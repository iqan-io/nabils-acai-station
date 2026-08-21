// Interactive E2E layer for the Nabil's cinematic film homepage.
// Covers what client_run.py's route check cannot: the scroll-scrubbed film
// actually advancing, the reduced-motion path staying readable, every internal
// link resolving, and horizontal overflow at both viewports.
// puppeteer-core is vendored under web-clients/.tmp/verify rather than being a
// dependency of this site, so resolve it from a few known spots.
function loadPuppeteer() {
  const path = require("node:path");
  const candidates = [
    "puppeteer-core",
    path.resolve(__dirname, "../../../../.tmp/verify/node_modules/puppeteer-core"),
    path.resolve(process.cwd(), ".tmp/verify/node_modules/puppeteer-core"),
  ];
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch (error) {
      if (error.code !== "MODULE_NOT_FOUND") throw error;
    }
  }
  throw new Error(
    "puppeteer-core not found. Install with: npm install --prefix .tmp/verify puppeteer-core",
  );
}
const puppeteer = loadPuppeteer();

// client_run.py serves on harness.json's `port`; override for ad-hoc runs.
const BASE = process.env.E2E_BASE || process.argv[2] || "http://localhost:3000";
const ROUTES = ["/", "/menu", "/locations", "/about", "/order", "/specials"];
// The assets the current act actually loads. This list used to name the
// retired film's files under /videos/, which still sit in public/ and so still
// answered 200 — the check passed while asserting nothing about the live page.
const FILM_ASSETS = [
  "/media/acai-story/acai-sequence-1280.mp4",
  "/media/acai-story/acai-sequence-mobile.mp4",
  "/media/acai-story/sequence-first-frame.webp",
  "/media/acai-story/nabils-bowl.webp",
  "/media/acai-story/acai-berries.webp",
  "/media/acai-story/strawberries.webp",
  "/media/acai-story/blueberries.webp",
  "/media/acai-story/granola.webp",
  "/media/acai-story/drizzle.webp",
];

// Nabil's own Mount Lawley photography and footage, supplied 2026-08-19. These
// are the first real moving frames on the site; everything in FILM_ASSETS that
// moves is generated.
const MT_LAWLEY_ASSETS = [
  "/media/mt-lawley/neon.webp",
  "/media/mt-lawley/arrival.mp4",
  "/media/mt-lawley/arrival-poster.webp",
  "/media/mt-lawley/interior-arch.webp",
];

let pass = 0;
let fail = 0;
function check(name, ok, detail = "") {
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
}

const settle = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ channel: "chrome", headless: "new" });
  const page = await browser.newPage();

  // ---- 1. route matrix ----
  for (const route of ROUTES) {
    const res = await page.goto(BASE + route, { waitUntil: "networkidle0" });
    check(`route ${route}`, res.status() === 200, `HTTP ${res.status()}`);
  }

  // ---- 2. film assets are actually served ----
  for (const asset of [...FILM_ASSETS, ...MT_LAWLEY_ASSETS]) {
    const res = await page.goto(BASE + asset, { waitUntil: "domcontentloaded" });
    check(`asset ${asset}`, [200, 304].includes(res.status()), `HTTP ${res.status()}`);
  }

  // ---- 3. no horizontal overflow at both viewports ----
  for (const vp of [
    { width: 1440, height: 900, label: "1440" },
    { width: 390, height: 844, label: "390" },
  ]) {
    await page.setViewport(vp);
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle0" });
      const over = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      check(`no x-overflow ${route} @${vp.label}`, !over);
    }
  }

  // ---- 4. the film ----
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await settle(600);

  /*
    The act is three rendering technologies crossfaded into each other — cutouts,
    a scrubbed video, a static image — and the illusion only holds if all three
    are actually on the page and actually decoded. A missing cutout does not
    throw and does not 404 loudly; it just leaves a hole in the constellation and
    the handoff stops matching. So every layer is asserted by `naturalWidth`,
    which is the only thing that distinguishes "the element is in the DOM" from
    "the browser has pixels for it".
  */
  const layers = await page.evaluate(() => {
    const one = (sel) => {
      const img = document.querySelector(sel);
      return img ? { present: true, loaded: img.naturalWidth > 0 } : { present: false, loaded: false };
    };
    const cutouts = [...document.querySelectorAll("img[src*='/media/acai-story/']")].filter(
      (img) => !img.src.includes("sequence-first-frame"),
    );
    return {
      seam: one("img[src*='sequence-first-frame']"),
      product: one("img[src*='nabils-bowl']"),
      cutouts: cutouts.length,
      cutoutsLoaded: cutouts.filter((img) => img.naturalWidth > 0).length,
    };
  });
  // The seam still is the film's own first frame. It is what the cutouts land on
  // and what the video fades up over; without it the DOM -> video handoff is a
  // visible cut rather than a crossfade.
  check(
    "film's first-frame still renders",
    layers.seam.present && layers.seam.loaded,
    JSON.stringify(layers.seam),
  );
  check(
    "product handoff image renders",
    layers.product.present && layers.product.loaded,
    JSON.stringify(layers.product),
  );
  check(
    "every ingredient cutout decodes",
    layers.cutouts >= 6 && layers.cutoutsLoaded === layers.cutouts,
    `${layers.cutoutsLoaded}/${layers.cutouts} loaded`,
  );

  const video = await page.evaluate(() => {
    const v = document.querySelector("video");
    if (!v) return { present: false };
    return {
      present: true,
      src: v.getAttribute("src") || "",
      muted: v.muted,
      playsInline: v.hasAttribute("playsinline"),
      duration: Number.isFinite(v.duration) ? v.duration : null,
    };
  });
  check("video element present", video.present);
  check(
    "desktop gets the full-res cut",
    video.src.includes("acai-sequence-1280.mp4"),
    video.src || "(no src)",
  );
  // A non-muted or non-inline video is blocked by autoplay policy and would
  // never decode a frame to scrub.
  check("video is muted + playsinline", video.muted && video.playsInline);
  check("video metadata loaded", video.duration !== null, `duration ${video.duration}`);

  const chapters = await page.evaluate(
    () => document.querySelectorAll("[data-chapter]").length,
  );
  check("four chapter beats present", chapters === 4, `got ${chapters}`);

  // ---- 4b. Nabil's real Mount Lawley media ----
  // The film closes on brand.tagline; the neon photograph is that same line on
  // the actual wall. If this image ever stops rendering, the closing card goes
  // back to being an unsupported claim.
  // It sits below the film and is lazily loaded, so it has to be brought into
  // view before naturalWidth means anything.
  await page.evaluate(() => {
    document.querySelector("#neon-title").scrollIntoView({ block: "center" });
  });
  await settle(1500);
  const neon = await page.evaluate(() => {
    const img = document.querySelector("img[src*='neon']");
    return { present: !!img, w: img ? img.naturalWidth : 0 };
  });
  check("neon photograph renders", neon.present && neon.w > 0, `naturalWidth ${neon.w}`);

  // The arrival clip must not decode until it is on screen — the film above it
  // owns the frame budget. preload="none" is the mechanism.
  const beforeScroll = await page.evaluate(() => {
    const v = document.querySelector("video[aria-label*='Walking in']");
    return v ? { present: true, preload: v.preload, readyState: v.readyState } : { present: false };
  });
  check("arrival clip present", beforeScroll.present);
  check(
    "arrival clip does not preload",
    beforeScroll.preload === "none",
    `preload=${beforeScroll.preload}`,
  );

  await page.evaluate(() => {
    document.querySelector("#find-title").scrollIntoView({ block: "center" });
  });
  await settle(3000);
  const arrival = await page.evaluate(() => {
    const v = document.querySelector("video[aria-label*='Walking in']");
    if (!v) return { present: false };
    return {
      present: true,
      paused: v.paused,
      muted: v.muted,
      loop: v.loop,
      playsInline: v.hasAttribute("playsinline"),
      // Portrait phone footage: the source carries rotation=-90 over a 1024x576
      // stream and the rotation is baked into the encode, so the decoder must
      // report it upright. A 1024x576 here means the rotation came back.
      w: v.videoWidth,
      h: v.videoHeight,
    };
  });
  check("arrival clip plays in view", arrival.present && !arrival.paused);
  check("arrival clip is muted + playsinline", arrival.muted && arrival.playsInline);
  // It ends inside the shop; looping would cut back to the dark arcade.
  check("arrival clip does not loop", arrival.loop === false);
  check(
    "arrival clip decodes upright (portrait)",
    arrival.h > arrival.w,
    `${arrival.w}x${arrival.h}`,
  );

  // This block scrolled to the bottom of the page. Everything after it — the
  // hero hit-tests and the scrub measurement — assumes a page at rest at the
  // top, so reload rather than leaving the next check to inherit this scroll.
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await settle(500);

  // The four beats share one grid cell. A faded-out beat that still hit-tests
  // sits on top of the hero and swallows its clicks — which is exactly what
  // shipped once. Hit-test the real coordinates, don't trust that the link
  // exists in the DOM.
  const cta = await page.evaluate(() => {
    const out = [];
    for (const label of ["See the menu", "Order delivery"]) {
      const el = [...document.querySelectorAll("a")].find(
        (a) => a.textContent.trim() === label,
      );
      if (!el) { out.push({ label, ok: false, why: "not found" }); continue; }
      const r = el.getBoundingClientRect();
      let n = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      const top = n;
      while (n && n !== el) n = n.parentElement;
      let why = "";
      if (!n && top) {
        let b = top;
        while (b && !b.hasAttribute?.("data-chapter")) b = b.parentElement;
        why = b ? `blocked by [data-chapter="${b.getAttribute("data-chapter")}"]` : "blocked";
      }
      out.push({ label, ok: Boolean(n), why });
    }
    return out;
  });
  for (const c of cta) check(`hero CTA clickable: ${c.label}`, c.ok, c.why);

  // Scrubbing: scrolling into the film must advance currentTime.
  const startTime = await page.evaluate(() => document.querySelector("video").currentTime);
  await page.evaluate(() => {
    const film = document.querySelector("[data-chapter]").closest("section");
    window.scrollTo(0, film.offsetTop + film.offsetHeight * 0.55);
  });
  await settle(1200);
  const scrubbed = await page.evaluate(() => document.querySelector("video").currentTime);
  check(
    "scroll scrubs the film forward",
    scrubbed > startTime + 0.5,
    `${startTime.toFixed(2)}s -> ${scrubbed.toFixed(2)}s`,
  );

  /*
    Phones get their own cut, chosen on mount by breakpoint. This matters more
    than it looks: the two files are 5.0MB and 3.4MB, the choice is made in JS
    rather than by a <source media> the browser resolves, and a broken breakpoint
    would silently push the desktop master down a phone connection with nothing
    failing anywhere. Assert the actual file the phone viewport asks for.
  */
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await settle(600);
  const mobileSrc = await page.evaluate(() => {
    const v = document.querySelector("video");
    return v ? v.getAttribute("src") || "" : "";
  });
  check(
    "mobile gets the light cut",
    mobileSrc.includes("acai-sequence-mobile.mp4"),
    mobileSrc || "(no src)",
  );

  /*
    And the phone must SCRUB, not play.

    This assertion exists because the opposite shipped. Phones used to play the
    film through once on entry, on both briefs' advice about seek cost. That
    decouples the film from the scroll, and the scroll is far faster: the film
    window is ~1240px on a phone, a two-second flick, against 11.6s of footage.
    A visitor reached the product handoff — where the finished cup fades in over
    the film's last frame — while the video was two seconds in and showing the
    explosion, and the two crossfaded into each other.

    Nothing in the suite caught it, because every assertion was about the desktop
    transport. Scrolling to a point and asserting the video is near where that
    point maps to is the check that would have.
  */
  const mobileScrub = await page.evaluate(async () => {
    const section = document.querySelector('section[aria-labelledby="story-title"]');
    const video = document.querySelector('section[aria-labelledby="story-title"] video');
    if (!section || !video || !Number.isFinite(video.duration)) return null;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const travel = section.offsetHeight - window.innerHeight;
    // 0.80 sits inside the film window (0.37 -> 0.86), near its end.
    window.scrollTo(0, top + travel * 0.8);
    await new Promise((r) => setTimeout(r, 2500));
    const expected = ((0.8 - 0.37) / (0.86 - 0.37)) * video.duration;
    return { expected, actual: video.currentTime };
  });
  check(
    "mobile scrubs the film rather than playing it",
    mobileScrub !== null &&
      Math.abs(mobileScrub.actual - mobileScrub.expected) < 1.5,
    mobileScrub
      ? `expected ~${mobileScrub.expected.toFixed(2)}s, got ${mobileScrub.actual.toFixed(2)}s`
      : "could not measure",
  );

  await page.setViewport({ width: 1440, height: 900 });

  // ---- 5. reduced motion ----
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await settle(500);

  const reduced = await page.evaluate(() => {
    // Every video on the page, not just the first. The film's is the first and
    // used to be the only one; the Mount Lawley arrival clip is a second, and
    // checking querySelector("video") alone would have stopped covering it.
    const videos = [...document.querySelectorAll("video")];
    const beats = [...document.querySelectorAll("[data-chapter]")];
    return {
      // No src is ever assigned under reduced motion, so nothing downloads or moves.
      videoSrcs: videos.map((v) => v.getAttribute("src")).filter(Boolean),
      // The arrival clip degrades to its own poster frame rather than vanishing.
      arrivalStill: !!document.querySelector("img[src*='arrival-poster']"),
      hidden: beats.filter((b) => Number(getComputedStyle(b).opacity) < 0.9).length,
      count: beats.length,
    };
  });
  check(
    "reduced motion loads no video",
    reduced.videoSrcs.length === 0,
    reduced.videoSrcs.join(", ") || "no src on any video",
  );
  check("reduced motion still shows the arrival still", reduced.arrivalStill);
  check(
    "reduced motion shows every beat",
    reduced.hidden === 0 && reduced.count === 4,
    `${reduced.count - reduced.hidden}/${reduced.count} visible`,
  );
  const reducedOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  check("no x-overflow with reduced motion", !reducedOverflow);
  await page.emulateMediaFeatures([]);

  // ---- 6. internal links resolve (incl. #anchors) ----
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")),
  );
  const unique = [...new Set(hrefs)];
  for (const href of unique) {
    const [path, hash] = href.split("#");
    const res = await page.goto(BASE + path, { waitUntil: "networkidle0" });
    // 304 is a cache hit on a repeat navigation, not a failure.
    let ok = [200, 304].includes(res.status());
    let detail = `HTTP ${res.status()}`;
    if (ok && hash) {
      const found = await page.evaluate((id) => Boolean(document.getElementById(id)), hash);
      ok = found;
      detail = found ? "anchor found" : `anchor #${hash} MISSING`;
    }
    check(`link ${href}`, ok, detail);
  }

  await browser.close();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
