import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const AXE = readFileSync(
  process.env.AXE_PATH ?? new URL('../node_modules/axe-core/axe.min.js', import.meta.url).pathname,
  'utf8',
);
const BASE = 'http://localhost:4173';

const PAGES = [
  ['en home', '/'],
  ['en accommodation', '/accomodation/'],
  ['en location', '/location/'],
  ['en gallery', '/photos/'],
  ['en reservations', '/reservations/'],
  ['en notice', '/covid-19/'],
  ['en 404', '/definitely-not-a-page/'],
  ['el home', '/el/'],
  ['el accommodation', '/el/%CE%B4%CE%B9%CE%B1%CE%BC%CE%BF%CE%BD%CE%AE/'],
  ['el gallery', '/el/%CF%86%CF%89%CF%84%CE%BF%CE%B3%CF%81%CE%B1%CF%86%CE%AF%CE%B5%CF%82/'],
  ['it home', '/it/'],
  ['it location', '/it/localita/'],
  ['fr home', '/fr/'],
  ['fr reservations', '/fr/reservations/'],
];

const OPTS = {
  runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
};

const browser = await chromium.launch();
let total = 0;
const rows = [];

for (const [width, tag] of [[1440, 'desktop'], [390, 'mobile']]) {
  const ctx = await browser.newContext({ viewport: { width, height: width === 1440 ? 900 : 844 } });
  for (const [name, url] of PAGES) {
    const page = await ctx.newPage();
    await page.goto(BASE + url, { waitUntil: 'networkidle' });

    // Force the reveals to their end state before axe
    // samples colours: axe scrolls elements into view as it walks the page,
    // which starts the transition, and a colour read mid-fade is a blend of
    // two that both pass on their own.
    await page.evaluate(() => {
      document
        .querySelectorAll('[data-reveal], [data-reveal-media], [data-reveal-stagger]')
        .forEach((el) => {
          el.classList.remove('is-armed');
          el.classList.add('is-visible');
        });
    });
    await page.waitForTimeout(1400);
    await page.addScriptTag({ content: AXE });
    const result = await page.evaluate((o) => window.axe.run(document, o), OPTS);

    // Second pass with the interactive surfaces actually open.
    let extra = { violations: [] };
    const hasLightbox = await page.$('[data-lightbox]');
    if (hasLightbox) {
      await page.click('[data-lightbox]');
      await page.waitForTimeout(250);
      extra = await page.evaluate((o) => window.axe.run(document, o), OPTS);
      await page.keyboard.press('Escape');
    }

    let drawer = { violations: [] };
    if (width === 390) {
      const burger = await page.$('[data-menu-toggle]');
      if (burger) {
        await burger.click();
        await page.waitForTimeout(200);
        drawer = await page.evaluate((o) => window.axe.run(document, o), OPTS);
      }
    }

    const all = [...result.violations, ...extra.violations, ...drawer.violations];
    total += all.length;
    if (all.length) {
      rows.push(`${tag} ${name}`);
      for (const v of all) {
        rows.push(`   [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
        for (const n of v.nodes.slice(0, 3)) {
          rows.push(`      ${n.target.join(' ')}`);
          rows.push(`      ${(n.failureSummary || '').split('\n').join(' | ').slice(0, 260)}`);
        }
      }
    }
    await page.close();
  }
  await ctx.close();
}

await browser.close();
console.log(rows.join('\n'));
console.log(`\nTOTAL VIOLATIONS: ${total} across ${PAGES.length * 2} page loads`);
