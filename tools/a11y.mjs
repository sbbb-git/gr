/**
 * Run axe-core over every page type, in every language, at two viewports.
 *
 *   node build.mjs && node serve.mjs &
 *   AXE_PATH=/path/to/axe.min.js node tools/a11y.mjs
 *
 * Also fails on any uncaught JavaScript error, because a page that throws on
 * load is inaccessible in a way axe cannot see.
 */

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const AXE = readFileSync(
  process.env.AXE_PATH ?? new URL('../node_modules/axe-core/axe.min.js', import.meta.url).pathname,
  'utf8',
);

const BASE = process.env.BASE ?? 'http://localhost:4173';

const PAGES = [
  ['en home', '/'],
  ['en studios', '/studios/'],
  ['en facilities', '/facilities/'],
  ['en location', '/location/'],
  ['en gallery', '/photo-gallery/'],
  ['en contact', '/contact/'],
  ['en cookies', '/cookies-policy/'],
  ['en 404', '/definitely-not-a-page/'],
  ['el home', '/el/'],
  ['el studios', '/el/studios/'],
  ['el gallery', '/el/photo-gallery/'],
  ['el contact', '/el/contact/'],
  ['fr home', '/fr/'],
  ['fr location', '/fr/location/'],
];

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const browser = await chromium.launch();
let violations = 0;
let errors = 0;
let loads = 0;

for (const [width, height] of [
  [1440, 900],
  [390, 844],
]) {
  for (const [name, url] of PAGES) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const thrown = [];
    page.on('pageerror', (e) => thrown.push(String(e)));

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
    const result = await page.evaluate(
      (tags) => window.axe.run(document, { runOnly: { type: 'tag', values: tags } }),
      TAGS,
    );
    loads += 1;

    if (result.violations.length || thrown.length) {
      console.log(`\n${width}px  ${name}`);
      for (const v of result.violations) {
        console.log(`  ${v.id}  (${v.nodes.length})  ${v.nodes[0].target.join(' ')}`);
        console.log(`     ${v.nodes[0].failureSummary?.split('\n')[1]?.trim() ?? ''}`);
      }
      for (const e of thrown) console.log(`  JS ERROR  ${e}`);
    }
    violations += result.violations.length;
    errors += thrown.length;

    await context.close();
  }
}

await browser.close();
console.log(`\nTOTAL: ${violations} violations, ${errors} JS errors across ${loads} page loads`);
process.exitCode = violations || errors ? 1 : 0;
