import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';
const PAGES = [
  ['home', '/'],
  ['accommodation', '/accomodation/'],
  ['location', '/location/'],
  ['gallery', '/photos/'],
  ['reservations', '/reservations/'],
  ['notice', '/covid-19/'],
  ['el home', '/el/'],
];

const browser = await chromium.launch();

for (const [width, tag] of [[1440, 'desktop 1440'], [390, 'mobile 390']]) {
  console.log(`\n=== ${tag} ===`);
  console.log('page             CLS      LCP(ms)  transfer  requests  html');
  for (const [name, url] of PAGES) {
    const ctx = await browser.newContext({ viewport: { width, height: width === 1440 ? 900 : 844 } });
    const page = await ctx.newPage();

    let bytes = 0;
    let requests = 0;
    let html = 0;
    page.on('response', async (res) => {
      requests += 1;
      try {
        const buf = await res.body();
        bytes += buf.length;
        if (res.request().resourceType() === 'document') html += buf.length;
      } catch (e) { /* redirects have no body */ }
    });

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
    // Scroll the whole page so lazy images load and any late shift is caught.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);

    const { cls, lcp } = await page.evaluate(() => ({ cls: window.__cls, lcp: window.__lcp }));
    console.log(
      `${name.padEnd(16)} ${cls.toFixed(4).padEnd(8)} ${Math.round(lcp).toString().padEnd(8)} ` +
      `${(bytes / 1024).toFixed(0).padStart(6)} KB ${String(requests).padStart(7)}  ${(html / 1024).toFixed(1)} KB`,
    );
    await ctx.close();
  }
}

await browser.close();
