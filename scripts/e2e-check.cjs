// Interactive E2E layer for the Nabil's "Counter" redesign.
// Covers what client_run.py's route check cannot: the bowl builder's arithmetic,
// every internal link resolving, and horizontal overflow at both viewports.
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

let pass = 0;
let fail = 0;
function check(name, ok, detail = "") {
  (ok ? pass++ : fail++);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
}

(async () => {
  const browser = await puppeteer.launch({ channel: "chrome", headless: "new" });
  const page = await browser.newPage();

  // ---- 1. route matrix ----
  for (const route of ROUTES) {
    const res = await page.goto(BASE + route, { waitUntil: "networkidle0" });
    check(`route ${route}`, res.status() === 200, `HTTP ${res.status()}`);
  }

  // ---- 2. no horizontal overflow at both viewports ----
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

  // ---- 3. bowl builder arithmetic ----
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });

  const readTotal = () =>
    page.evaluate(() => {
      const el = [...document.querySelectorAll("strong")].find((n) =>
        /^\$\d+\.00$/.test(n.textContent.trim()),
      );
      return el ? Number(el.textContent.trim().replace(/[$.]/g, "").slice(0, -2)) : null;
    });

  // Default state: Regular 12 + Pistachio 2 + Strawberries 2 + Dubai filling 3 = 19
  const initial = await readTotal();
  check("builder default total is $19", initial === 19, `got $${initial}`);

  // Click "Large" ($15) — should move the total by +3 (15 - 12).
  const clickOption = (label) =>
    page.evaluate((text) => {
      const btn = [...document.querySelectorAll("button")].find(
        (b) => b.textContent.replace(/\s+/g, " ").trim().startsWith(text),
      );
      if (btn) btn.click();
      return Boolean(btn);
    }, label);

  await clickOption("Large");
  await new Promise((r) => setTimeout(r, 120));
  const afterLarge = await readTotal();
  check("size Large recalculates to $22", afterLarge === 22, `got $${afterLarge}`);

  // Deselect a topping (Strawberries +$2) — total should drop by 2.
  await clickOption("Strawberries");
  await new Promise((r) => setTimeout(r, 120));
  const afterToggle = await readTotal();
  check("deselecting Strawberries drops $2", afterToggle === 20, `got $${afterToggle}`);

  // aria-pressed must track selection for assistive tech.
  const ariaOk = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      b.textContent.replace(/\s+/g, " ").trim().startsWith("Large"),
    );
    return btn && btn.getAttribute("aria-pressed") === "true";
  });
  check("aria-pressed tracks selection", ariaOk);

  // ---- 4. internal links resolve (incl. homepage -> /menu#anchor) ----
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
