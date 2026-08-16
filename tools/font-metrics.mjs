/**
 * Measure the webfonts against their local stand-ins, and print the
 * `size-adjust` that makes the stand-in occupy the same room.
 *
 *   node build.mjs && node serve.mjs &
 *   node tools/font-metrics.mjs
 *
 * This is where the numbers in the `@font-face` block at the top of
 * src/styles/site.css come from. Both families load with
 * `font-display: optional`, so nothing ever swaps under the reader — but on
 * the rare miss the page is set in the fallback for that whole visit, and
 * these overrides are what keep the layout the one that was designed.
 *
 * The ratio is measured on the strings the hero actually sets, in every
 * language, rather than on the usual average of the lowercase Latin alphabet:
 * Inter runs about 0.3 % wider than Arial across Latin lowercase but 10 %
 * wider on the Greek subtitle, and it is the Greek page that was reflowing.
 *
 * Caveat: `local('Arial')` only resolves on a machine that has Arial or one of
 * its metric clones installed. On a bare Linux box the declared fallback face
 * silently falls through, so this script measures the *ratio* correctly but
 * cannot verify the face itself — check that on a desktop.
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:4173';

/** Each family, its stand-in, and the real face's own vertical metrics. */
const FAMILIES = [
  {
    label: 'body',
    webfont: "'Inter'",
    fallback: 'Arial',
    // From the woff2 hhea table, as a fraction of the em.
    ascent: 0.9688,
    descent: 0.2412,
    lineGap: 0,
    sample: '.hero__subtitle',
    size: 17,
    weight: 400,
  },
];

const PAGES = [
  ['en', '/'],
  ['el', '/el/'],
  ['fr', '/fr/'],
];

const browser = await chromium.launch();
const ratios = new Map(FAMILIES.map((f) => [f.label, []]));

for (const [lang, url] of PAGES) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + url, { waitUntil: 'networkidle' });

  for (const family of FAMILIES) {
    const measured = await page.evaluate(async (f) => {
      await document.fonts.ready;
      const node = document.querySelector(f.sample);
      if (!node) return null;
      const text = node.textContent.trim();

      const width = (fontFamily) => {
        const span = document.createElement('span');
        span.textContent = text;
        span.style.position = 'absolute';
        span.style.visibility = 'hidden';
        span.style.whiteSpace = 'nowrap';
        span.style.fontFamily = fontFamily;
        span.style.fontSize = `${f.size}px`;
        span.style.fontWeight = String(f.weight);
        document.body.appendChild(span);
        const w = span.getBoundingClientRect().width;
        span.remove();
        return w;
      };

      return { text: text.slice(0, 44), webfont: width(f.webfont), fallback: width(f.fallback) };
    }, family);

    if (!measured) continue;

    const ratio = measured.webfont / measured.fallback;
    ratios.get(family.label).push(ratio);
    console.log(
      `${lang}  ${family.label.padEnd(8)} ${family.webfont} ${measured.webfont.toFixed(1)}px  ` +
        `vs ${family.fallback} ${measured.fallback.toFixed(1)}px  →  ${(ratio * 100).toFixed(1)} %` +
        `   "${measured.text}…"`,
    );
  }

  await page.close();
}

console.log('\nDeclare these on the fallback face:\n');

for (const family of FAMILIES) {
  const seen = ratios.get(family.label);
  if (!seen.length) continue;

  // One value has to serve every language, so take the midpoint of the range
  // rather than the mean: it bounds the worst case on both sides.
  const low = Math.min(...seen);
  const high = Math.max(...seen);
  const sizeAdjust = (low + high) / 2;

  const pct = (n) => `${(n * 100).toFixed(1)}%`;
  console.log(`  /* ${family.webfont} against ${family.fallback} */`);
  console.log(`  size-adjust: ${pct(sizeAdjust)};`);
  console.log(`  ascent-override: ${pct(family.ascent / sizeAdjust)};`);
  console.log(`  descent-override: ${pct(family.descent / sizeAdjust)};`);
  console.log(`  line-gap-override: ${pct(family.lineGap / sizeAdjust)};`);
  console.log(
    `  /* worst case ${pct(Math.abs(low / sizeAdjust - 1))} narrow, ` +
      `${pct(Math.abs(high / sizeAdjust - 1))} wide */\n`,
  );
}

await browser.close();
