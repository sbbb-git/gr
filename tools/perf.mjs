/**
 * Measure what the browser actually pays for, page by page.
 *
 *   node build.mjs && node serve.mjs &
 *   node tools/perf.mjs
 *
 * Weight comes from the Resource Timing API rather than from counting response
 * bodies in the driver: `response.body()` throws for anything served from the
 * memory cache or redirected, and swallowing those errors quietly under-reports
 * the total. `transferSize` is what went over the wire, including headers.
 */

import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://localhost:4173';

const PAGES = [
  ['home', '/'],
  ['studios', '/studios/'],
  ['facilities', '/facilities/'],
  ['location', '/location/'],
  ['gallery', '/photo-gallery/'],
  ['contact', '/contact/'],
  ['cookies', '/cookies-policy/'],
  ['el home', '/el/'],
  ['fr home', '/fr/'],
];

const VIEWPORTS = [
  [1440, 900, 'desktop 1440'],
  [390, 844, 'mobile 390'],
];

const browser = await chromium.launch();

// One throwaway load first: the very first request to a cold static server
// costs about a second, which would otherwise be reported as the home page's
// largest contentful paint.
{
  const warm = await browser.newContext();
  await (await warm.newPage()).goto(BASE + '/', { waitUntil: 'networkidle' });
  await warm.close();
}

for (const [width, height, tag] of VIEWPORTS) {
  console.log(`\n=== ${tag} ===`);
  console.log('page             CLS      LCP(ms)   transfer  requests   html');

  for (const [name, url] of PAGES) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();

    await page.addInitScript(() => {
      window.__cls = 0;
      window.__lcp = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        window.__lcp = entries[entries.length - 1].startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });

    await page.goto(BASE + url, { waitUntil: 'networkidle' });

    // Take LCP before scrolling. Programmatic scrolling does not close the LCP
    // window the way a real click does, so a large image further down the page
    // would otherwise be reported as the largest paint of the first screen.
    const lcp = await page.evaluate(() => window.__lcp);

    // Walk the page so every lazy image loads and any late shift is counted.
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto';
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);

    const m = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');
      const bytes =
        (nav ? nav.transferSize : 0) + resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      return {
        cls: window.__cls,
        bytes,
        requests: resources.length + 1,
        html: nav ? nav.transferSize : 0,
      };
    });

    console.log(
      `${name.padEnd(16)} ${m.cls.toFixed(4).padEnd(8)} ${String(Math.round(lcp)).padEnd(9)} ` +
        `${(m.bytes / 1024).toFixed(0).padStart(6)} KB ${String(m.requests).padStart(8)}   ` +
        `${(m.html / 1024).toFixed(1)} KB`,
    );

    await context.close();
  }
}

await browser.close();
