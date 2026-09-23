// Interaction and visual evidence for the reference-led site.
// Run: node scripts/station-check.cjs http://localhost:3000 ../.tmp/reference-parity-2026-09-23/station
//
// 2026-09-23: the menu moved. The homepage no longer carries a 13-tab menu
// browser; /menu is now the reference's scroll-spy menu (a five-category rail
// that follows the scroll, the whole menu as one list, and a photograph that
// changes with the section on screen). This check follows it there, and is at
// least as strict as the tab version: every category is clicked for real, the
// landing position is asserted, every section's content and every visible
// photograph are checked, deep links and keyboard operation are exercised, and
// overflow is measured on the panel as well as the page — a clipped panel can
// hide overflow from `scrollWidth`, which is how a 905px-wide rail on a 390px
// phone went unreported once.
const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const puppeteer = require(path.resolve(__dirname, '../../../../.tmp/verify/node_modules/puppeteer-core'));
const base = process.argv[2] || 'http://localhost:3000';
const out = path.resolve(process.argv[3] || '../.tmp/reference-parity-2026-09-23/station');
const settle = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await puppeteer.launch({ channel: 'chrome', headless: true });
  const results = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => { throw error; });
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 834, height: 1112 }]) {
      await page.setViewport({ ...viewport, deviceScaleFactor: 1 });

      // --- homepage: fonts, and the hero's menu action reaches the menu page.
      await page.goto(base, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      const typography = await page.evaluate(() => ({
        heading: getComputedStyle(document.querySelector('h1')).fontFamily,
        body: getComputedStyle(document.querySelector('header nav')).fontFamily,
      }));
      assert.match(typography.heading, /Titan One/);
      assert.match(typography.body, /Nunito/);
      await page.screenshot({ path: path.join(out, `home-${viewport.width}.png`) });
      await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('section[aria-labelledby="home-title"] a[href="/menu"]')]);
      assert.equal(new URL(page.url()).pathname, '/menu', 'Hero "See the menu" must reach /menu');

      // --- /menu: structure.
      await page.evaluate(() => document.fonts.ready);
      const railCount = await page.$$eval('nav[aria-label="Menu categories"] button', b => b.length);
      assert.equal(railCount, 5, 'The rail carries the five menu groups');
      const sections = await page.$$eval('[data-index]', els => els.map(el => ({
        id: el.id, title: el.querySelector('h2')?.textContent, items: el.querySelectorAll('li').length,
      })));
      assert.equal(sections.length, 13, 'Every menu section renders');
      sections.forEach(s => assert.ok(s.id && s.title && s.items > 0, `Section ${s.id} has a heading and items`));
      assert.ok(await page.$eval('#classic-crepes', el => el.textContent.includes('Nutella Crêpe') && el.textContent.includes('$14')));

      // --- every rail category, clicked for real at its rendered position.
      const labels = await page.$$eval('nav[aria-label="Menu categories"] button', bs => bs.map(b => b.textContent.replace('↗', '').trim()));
      for (let i = 0; i < labels.length; i++) {
        const button = (await page.$$('nav[aria-label="Menu categories"] button'))[i];
        await button.evaluate(b => b.scrollIntoView({ block: 'nearest', inline: 'nearest' }));
        const box = await button.boundingBox();
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await settle(1300);
        const state = await page.evaluate(i => {
          const bs = [...document.querySelectorAll('nav[aria-label="Menu categories"] button')];
          const active = bs.findIndex(b => b.getAttribute('aria-current') === 'true');
          const target = document.getElementById(location.hash.slice(1));
          const panel = document.querySelector('main section[data-panel]');
          return {
            active, hash: location.hash,
            headingTop: target ? Math.round(target.querySelector('h2').getBoundingClientRect().top) : null,
            pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            panelOverflow: panel.scrollWidth > panel.clientWidth + 1,
            railFits: (() => { const r = document.querySelector('nav[aria-label="Menu categories"]'); return r.getBoundingClientRect().width <= innerWidth; })(),
          };
        }, i);
        assert.equal(state.active, i, `Rail "${labels[i]}" must become active on click at ${viewport.width}px: ${JSON.stringify(state)}`);
        assert.ok(state.headingTop !== null && state.headingTop > 0 && state.headingTop < viewport.height * 0.5,
          `Rail "${labels[i]}" must land its first section's heading in the top half, clear of the nav: ${JSON.stringify(state)}`);
        assert.ok(!state.pageOverflow && !state.panelOverflow && state.railFits, `No overflow at ${viewport.width}px: ${JSON.stringify(state)}`);
        // Every photograph currently in view has actually decoded.
        await page.waitForFunction(() => [...document.querySelectorAll('main img')]
          .filter(img => { const r = img.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0 && getComputedStyle(img).visibility !== 'hidden'; })
          .every(img => img.complete && img.naturalWidth > 0), { timeout: 15000 });
        await page.screenshot({ path: path.join(out, `menu-${viewport.width}-${i}.png`) });
      }

      // --- scroll-spy: reading down the page moves the rail on its own, and
      //     on desktop the photograph changes with the section.
      await page.evaluate(() => window.scrollTo(0, 0));
      await settle(600);
      const spy = [];
      for (const id of ['acai-build-your-own', 'dubai-chocolate', 'fruit-cocktails', 'mocktails']) {
        await page.evaluate(id => { const el = document.getElementById(id); window.scrollTo(0, scrollY + el.getBoundingClientRect().top - innerHeight * 0.3); }, id);
        await settle(900);
        spy.push(await page.evaluate(() => ({
          active: document.querySelector('nav[aria-label="Menu categories"] button[aria-current="true"]')?.textContent.replace('↗', '').trim(),
          photo: (() => { const img = document.querySelector('main img[class*="menuPhotoImg"]'); return img && getComputedStyle(img.parentElement.parentElement).display !== 'none' ? img.getAttribute('src') : null; })(),
        })));
      }
      assert.deepEqual(spy.map(s => s.active), ['Açaí & Bowls', 'Chocolate & Sweets', 'Fruit', 'Drinks'], `Scroll-spy follows the reader: ${JSON.stringify(spy)}`);
      if (viewport.width >= 1200) assert.equal(new Set(spy.map(s => s.photo)).size, 4, `Photograph changes with each section: ${JSON.stringify(spy)}`);

      // --- a deep link lands on its section with the rail already agreeing.
      await page.goto(`${base}/menu#dubai-chocolate`, { waitUntil: 'networkidle0' });
      await settle(1000);
      const deep = await page.evaluate(() => ({
        top: Math.round(document.querySelector('#dubai-chocolate h2').getBoundingClientRect().top),
        active: document.querySelector('nav[aria-label="Menu categories"] button[aria-current="true"]')?.textContent.replace('↗', '').trim(),
      }));
      assert.ok(deep.top > 0 && deep.top < viewport.height * 0.5, `Deep link lands in view: ${JSON.stringify(deep)}`);
      assert.equal(deep.active, 'Chocolate & Sweets');

      // --- keyboard: the rail is reachable and operable without a pointer.
      await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur(); });
      await page.focus('nav[aria-label="Menu categories"] button:nth-child(4)');
      await page.keyboard.press('Enter');
      await settle(1300);
      assert.equal(await page.$eval('nav[aria-label="Menu categories"] button:nth-child(4)', b => b.getAttribute('aria-current')), 'true', 'Enter on a rail button activates it');

      // --- mobile navigation.
      if (viewport.width === 390) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await settle(400);
        await page.click('button[aria-label="Open menu"]');
        assert.equal(await page.$$eval('#station-navigation a', links => links.length), 5);
        await page.keyboard.press('Escape');
        assert.equal(await page.$('#station-navigation'), null);
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Open menu');
      }

      // --- homepage evidence frames.
      await page.goto(base, { waitUntil: 'networkidle0' });
      for (const [name, selector] of [['neon', '#neon-title'], ['cravings', '#cravings-title'], ['locations', '#find-title']]) {
        await page.$eval(selector, el => window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 125));
        await settle(700);
        await page.screenshot({ path: path.join(out, `${name}-${viewport.width}.png`) });
      }
      results.push({ viewport, typography, railCategories: railCount, sections: sections.length, spy, status: 'pass' });
      console.log(`PASS ${viewport.width}: rail clicks + landing, scroll-spy, photographs, deep link, keyboard, fonts and overflow`);
    }
    fs.writeFileSync(path.join(out, 'interaction-results.json'), JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
