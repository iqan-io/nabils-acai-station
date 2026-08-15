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
const FILM_ASSETS = [
  "/videos/acai-film.mp4",
  "/videos/acai-film-mobile.mp4",
  "/videos/acai-film-poster.webp",
  "/videos/acai-film-poster.jpg",
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
  for (const asset of FILM_ASSETS) {
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

  const poster = await page.evaluate(() => {
    const img = document.querySelector("img[src*='acai-film-poster']");
    return img ? { present: true, loaded: img.naturalWidth > 0 } : { present: false };
  });
  check("poster frame renders", poster.present && poster.loaded, JSON.stringify(poster));

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
    video.src.includes("acai-film.mp4"),
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

  // ---- 5. reduced motion ----
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await settle(500);

  const reduced = await page.evaluate(() => {
    const v = document.querySelector("video");
    const beats = [...document.querySelectorAll("[data-chapter]")];
    return {
      // No src is ever assigned under reduced motion, so nothing downloads or moves.
      videoSrc: v ? v.getAttribute("src") : null,
      hidden: beats.filter((b) => Number(getComputedStyle(b).opacity) < 0.9).length,
      count: beats.length,
    };
  });
  check("reduced motion loads no video", !reduced.videoSrc, reduced.videoSrc || "no src");
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
