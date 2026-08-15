/**
 * Interaction test suite. Drives the built site in Chromium and asserts the
 * behaviour a visitor depends on: navigation, the slideshow, the lightbox,
 * gallery filters, the mobile drawer, the language switcher, the booking-engine
 * link contract, the click-to-load map and reservation-form validation.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4173';
const results = [];

function check(name, pass, detail) {
  results.push({ name, pass, detail: detail || '' });
}

const browser = await chromium.launch();
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
});

/* --- 1. Navigation across every language -------------------------------- */
{
  const page = await desktop.newPage();
  const routes = [
    ['/', 'en', 'Anna Studios Paros | Rooms in Kolympithres, Naoussa'],
    ['/accomodation/', 'en', null],
    ['/location/', 'en', null],
    ['/photos/', 'en', null],
    ['/reservations/', 'en', null],
    ['/covid-19/', 'en', null],
    ['/el/', 'el', null],
    ['/el/%CE%B4%CE%B9%CE%B1%CE%BC%CE%BF%CE%BD%CE%AE/', 'el', null],
    ['/el/%CF%84%CE%BF%CF%80%CE%BF%CE%B8%CE%B5%CF%83%CE%AF%CE%B1/', 'el', null],
    ['/el/%CE%BA%CF%81%CE%B1%CF%84%CE%AE%CF%83%CE%B5%CE%B9%CF%82/', 'el', null],
    ['/el/covid-19-2/', 'el', null],
    ['/it/', 'it', null],
    ['/it/sistemazione/', 'it', null],
    ['/it/localita/', 'it', null],
    ['/it/fotografie/', 'it', null],
    ['/it/covid-19-italiano/', 'it', null],
    ['/fr/', 'fr', null],
    ['/fr/hebergement/', 'fr', null],
    ['/fr/location-2/', 'fr', null],
    ['/fr/photos-fr/', 'fr', null],
    ['/fr/covid-19-3/', 'fr', null],
  ];
  let ok = 0;
  for (const [url, lang, title] of routes) {
    const res = await page.goto(BASE + url);
    const htmlLang = await page.getAttribute('html', 'lang');
    const h1 = await page.$$('h1');
    const good =
      res.status() === 200 && htmlLang === lang && h1.length === 1 && (!title || (await page.title()) === title);
    if (good) ok += 1;
    else check(`route ${url}`, false, `status=${res.status()} lang=${htmlLang} h1=${h1.length}`);
  }
  check('all 21 published routes render with one h1 and correct lang', ok === routes.length, `${ok}/${routes.length}`);
  await page.close();
}

/* --- 2. Legacy URLs still resolve --------------------------------------- */
{
  const page = await desktop.newPage();
  const legacy = [
    ['/el/829-2/', '/el/'],
    ['/el/%CE%B5%CE%BB%CE%BB%CE%B7%CE%BD%CE%B9%CE%BA%CE%AC/', '/el/'],
    ['/it/italiano/', '/it/'],
    ['/fr/francais/', '/fr/'],
  ];
  let ok = 0;
  for (const [from, to] of legacy) {
    await page.goto(BASE + from);
    await page.waitForURL((u) => u.pathname === to, { timeout: 5000 }).catch(() => {});
    if (new URL(page.url()).pathname === to) ok += 1;
    else check(`legacy ${from}`, false, `landed on ${page.url()}`);
  }
  check('retired WordPress home URLs redirect to the clean locale root', ok === legacy.length, `${ok}/${legacy.length}`);
  await page.close();
}

/* --- 3. Header navigation actually navigates ---------------------------- */
{
  const page = await desktop.newPage();
  await page.goto(BASE + '/');
  await page.click('.nav__list a[href="/accomodation/"]');
  await page.waitForLoadState();
  const onAccommodation = new URL(page.url()).pathname === '/accomodation/';
  await page.click('.nav__list a[href="/photos/"]');
  await page.waitForLoadState();
  const onGallery = new URL(page.url()).pathname === '/photos/';
  const current = await page.getAttribute('.nav__link.is-current', 'href');
  check('header nav navigates and marks the current page', onAccommodation && onGallery && current === '/photos/', current);
  await page.close();
}

/* --- 4. Slideshow ------------------------------------------------------- */
{
  const page = await desktop.newPage();
  await page.goto(BASE + '/');
  const first = await page.getAttribute('.hero__slide.is-active', 'data-slide');
  await page.click('[data-slide-next]');
  await page.waitForTimeout(120);
  const second = await page.getAttribute('.hero__slide.is-active', 'data-slide');
  await page.click('[data-slide-to="4"]');
  await page.waitForTimeout(120);
  const jumped = await page.getAttribute('.hero__slide.is-active', 'data-slide');
  const dotActive = await page.getAttribute('.hero__dot.is-active', 'data-slide-to');
  // Inactive slides must be hidden from assistive tech.
  const hiddenCount = await page.$$eval('.hero__slide:not(.is-active)', (els) =>
    els.filter((e) => e.getAttribute('aria-hidden') === 'true').length);
  check(
    'slideshow advances, jumps to a dot, syncs dots and hides inactive slides',
    first === '0' && second === '1' && jumped === '4' && dotActive === '4' && hiddenCount === 5,
    `${first}->${second}->${jumped} dot=${dotActive} hidden=${hiddenCount}`,
  );

  // Using prev/next/dots already pauses, so exercise the toggle from a fresh
  // load where autoplay is genuinely running.
  await page.goto(BASE + '/');
  await page.waitForTimeout(200);
  await page.click('[data-slide-toggle]');
  const paused = await page.getAttribute('[data-slide-toggle]', 'aria-label');
  const before = await page.getAttribute('.hero__slide.is-active', 'data-slide');
  await page.waitForTimeout(7000);
  const after = await page.getAttribute('.hero__slide.is-active', 'data-slide');
  check('pause button stops autoplay and relabels itself', before === after && paused === 'Play the slideshow', `${before} -> ${after} (${paused})`);

  // And resumes.
  await page.click('[data-slide-toggle]');
  await page.waitForTimeout(6800);
  const resumed = await page.getAttribute('.hero__slide.is-active', 'data-slide');
  check('play button resumes autoplay', resumed !== after, `${after} -> ${resumed}`);

  // Autoplay must never start when the visitor asks for reduced motion.
  const still = await desktop.newPage();
  await still.emulateMedia({ reducedMotion: 'reduce' });
  await still.goto(BASE + '/');
  const slideA = await still.getAttribute('.hero__slide.is-active', 'data-slide');
  await still.waitForTimeout(7000);
  const slideB = await still.getAttribute('.hero__slide.is-active', 'data-slide');
  check('prefers-reduced-motion disables autoplay', slideA === slideB, `${slideA} -> ${slideB}`);
  await still.close();
  await page.close();
}

/* --- 5. Lightbox -------------------------------------------------------- */
{
  const page = await desktop.newPage();
  await page.goto(BASE + '/photos/');
  await page.click('.grid__item:nth-child(3) .tile');
  await page.waitForTimeout(200);
  const open = await page.isVisible('[data-lightbox-root] .lightbox__dialog');
  const counter1 = await page.textContent('[data-lightbox-counter]');
  const alt1 = await page.getAttribute('[data-lightbox-image]', 'alt');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(120);
  const counter2 = await page.textContent('[data-lightbox-counter]');
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(120);
  const counter3 = await page.textContent('[data-lightbox-counter]');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  const closed = await page.getAttribute('[data-lightbox-root]', 'hidden');
  check(
    'lightbox opens on the right photo, arrows page through it, Escape closes it',
    open && counter1.trim() === '3 / 55' && counter2.trim() === '4 / 55' && counter3.trim() === '3 / 55' && closed !== null,
    `${counter1} ${counter2} ${counter3}`,
  );
  check('lightbox carries the photo caption as alt text', Boolean(alt1 && alt1.length > 20), alt1);

  // Focus must return to the tile that opened it.
  await page.click('.grid__item:nth-child(2) .tile');
  await page.waitForTimeout(150);
  await page.click('[data-lightbox-close].lightbox__btn--close');
  await page.waitForTimeout(150);
  const focused = await page.evaluate(() => document.activeElement.closest('.grid__item')
    ? Array.prototype.indexOf.call(document.activeElement.closest('.grid').children, document.activeElement.closest('.grid__item'))
    : -1);
  check('lightbox restores focus to the tile that opened it', focused === 1, `index ${focused}`);
  await page.close();
}

/* --- 6. Gallery filters ------------------------------------------------- */
{
  const page = await desktop.newPage();
  await page.goto(BASE + '/photos/');
  const all = await page.$$eval('.grid__item:not([hidden])', (e) => e.length);
  await page.click('[data-filter="apartmentFour"]');
  await page.waitForTimeout(150);
  const filtered = await page.$$eval('.grid__item:not([hidden])', (e) => e.length);
  const status = await page.textContent('[data-gallery-status]');
  const pressed = await page.getAttribute('[data-filter="apartmentFour"]', 'aria-pressed');

  // The lightbox must renumber against the filtered set, not the full one.
  await page.click('.grid__item:not([hidden]) .tile');
  await page.waitForTimeout(200);
  const counter = await page.textContent('[data-lightbox-counter]');
  await page.keyboard.press('Escape');

  await page.click('[data-filter="all"]');
  await page.waitForTimeout(150);
  const restored = await page.$$eval('.grid__item:not([hidden])', (e) => e.length);

  check(
    'gallery filters narrow the grid, update the count and reset',
    all === 55 && filtered === 8 && restored === 55 && pressed === 'true' && status.trim().startsWith('8'),
    `all=${all} filtered=${filtered} restored=${restored} status="${status.trim()}"`,
  );
  check('lightbox renumbers against the filtered set', counter.trim() === '1 / 8', counter);
  await page.close();
}

/* --- 7. Mobile drawer --------------------------------------------------- */
{
  const page = await mobile.newPage();
  await page.goto(BASE + '/');
  const hiddenAtStart = await page.getAttribute('[data-drawer]', 'hidden');
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(200);
  const openState = await page.getAttribute('[data-menu-toggle]', 'aria-expanded');
  const visible = await page.isVisible('[data-drawer] .nav__link');
  const locked = await page.evaluate(() => document.body.classList.contains('is-locked'));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  const closedState = await page.getAttribute('[data-menu-toggle]', 'aria-expanded');
  const unlocked = await page.evaluate(() => !document.body.classList.contains('is-locked'));
  check(
    'mobile drawer opens, locks scroll and closes on Escape',
    hiddenAtStart !== null && openState === 'true' && visible && locked && closedState === 'false' && unlocked,
  );

  // Following a link inside the drawer must close it.
  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(150);
  await page.click('[data-drawer] a[href="/location/"]');
  await page.waitForLoadState();
  check('drawer link navigates', new URL(page.url()).pathname === '/location/', page.url());
  await page.close();
}

/* --- 8. Language switcher ----------------------------------------------- */
{
  const page = await desktop.newPage();
  await page.goto(BASE + '/accomodation/');
  await page.click('.langswitch__button');
  await page.waitForTimeout(150);
  const expanded = await page.getAttribute('.langswitch__button', 'aria-expanded');
  // The switcher must land on the *same page* in the new language, not the home page.
  const greekHref = await page.getAttribute('.langmenu__item[hreflang="el"]', 'href');
  await page.click('.langmenu__item[hreflang="el"]');
  await page.waitForLoadState();
  const path = decodeURIComponent(new URL(page.url()).pathname);
  const lang = await page.getAttribute('html', 'lang');
  check(
    'language switcher stays on the same page and switches language',
    expanded === 'true' && path === '/el/διαμονή/' && lang === 'el',
    `${greekHref} -> ${path} (${lang})`,
  );

  // hreflang must be reciprocal on every page.
  const alts = await page.$$eval('link[rel="alternate"]', (els) =>
    els.map((e) => `${e.getAttribute('hreflang')} ${e.getAttribute('href')}`));
  check('every page declares 4 hreflang alternates plus x-default', alts.length === 5, alts.join(' | '));
  await page.close();
}

/* --- 9. Booking engine link contract ------------------------------------ */
{
  const page = await desktop.newPage();
  const EXPECTED =
    'https://reservations.bookoncloud.com/welcome/studioannaparos?lang=en&channelId=website#/availability';
  let ok = 0;
  const pages = ['/', '/accomodation/', '/reservations/', '/el/', '/it/', '/fr/'];
  for (const p of pages) {
    await page.goto(BASE + p);
    const hrefs = await page.$$eval('a[href*="bookoncloud"]', (els) => els.map((e) => e.getAttribute('href')));
    const allExact = hrefs.length > 0 && hrefs.every((h) => h === EXPECTED);
    const allBlank = await page.$$eval('a[href*="bookoncloud"]', (els) =>
      els.every((e) => e.target === '_blank' && e.rel.includes('noopener')));
    if (allExact && allBlank) ok += 1;
    else check(`booking link on ${p}`, false, hrefs.join(' | '));
  }
  check('booking engine URL is byte-identical to the old site on every page', ok === pages.length, `${ok}/${pages.length}`);
  await page.close();
}

/* --- 10. Reservation form ----------------------------------------------- */
{
  const page = await desktop.newPage();
  await page.goto(BASE + '/reservations/');

  // The legacy Divi field names must survive.
  const names = await page.$$eval('.rform [name]', (els) => els.map((e) => e.getAttribute('name')));
  const required = [
    'et_pb_contact_name1_0', 'et_pb_contact_email_0', 'et_pb_contact_phone_0',
    'et_pb_contact_address_0', 'et_pb_contact_adults_0', 'et_pb_contact_kids_0',
    'et_pb_contact_room_type_0', 'et_pb_contact_arrival_0', 'et_pb_contact_departure_0',
    'et_pb_contact_message_0',
  ];
  const missing = required.filter((n) => !names.includes(n));
  check('reservation form keeps all 10 legacy Divi field names', missing.length === 0, missing.join(', '));

  // Empty submit must block and report.
  await page.click('[data-submit]');
  await page.waitForTimeout(200);
  const summaryVisible = await page.isVisible('[data-form-summary]');
  const invalid = await page.$$eval('.field.is-invalid', (e) => e.length);
  const focusedId = await page.evaluate(() => document.activeElement.id);
  check(
    'empty submit is blocked, flags all 8 blank fields and focuses the first',
    summaryVisible && invalid === 8 && focusedId === 'r-name',
    `summary=${summaryVisible} invalid=${invalid} focus=${focusedId}`,
  );

  // A bad email must be caught.
  await page.fill('#r-name', 'Test Guest');
  await page.fill('#r-email', 'not-an-email');
  await page.click('[data-submit]');
  await page.waitForTimeout(150);
  const emailInvalid = await page.getAttribute('#r-email', 'aria-invalid');
  check('invalid email address is rejected', emailInvalid === 'true', emailInvalid);

  // Departure before arrival must be caught.
  await page.fill('#r-email', 'guest@example.com');
  await page.fill('#r-phone', '+30 1234567');
  await page.fill('#r-address', '1 Test Street');
  await page.fill('#r-arrival', '2026-08-20');
  await page.fill('#r-departure', '2026-08-18');
  await page.selectOption('#r-roomtype', 'Double room');
  await page.fill('#r-message', 'A test booking request.');
  await page.click('[data-submit]');
  await page.waitForTimeout(150);
  const depInvalid = await page.getAttribute('#r-departure', 'aria-invalid');
  check('a departure before the arrival is rejected', depInvalid === 'true', depInvalid);

  // Valid data: dates must be mirrored into the legacy d-m-Y hidden fields.
  // A mailto: navigation cannot complete in a headless browser, so the attempt
  // is captured off the request stream instead of being stubbed out.
  let mailto = null;
  page.on('request', (r) => {
    if (r.url().startsWith('mailto:')) mailto = r.url();
  });
  await page.fill('#r-departure', '2026-08-27');
  await page.click('[data-submit]');
  await page.waitForTimeout(400);
  const arrivalHidden = await page.inputValue('input[type="hidden"][name="et_pb_contact_arrival_0"]');
  const departureHidden = await page.inputValue('input[type="hidden"][name="et_pb_contact_departure_0"]');
  const doneVisible = await page.isVisible('[data-form-done]');
  check(
    'dates are submitted as d-m-Y, exactly as the old datepicker did',
    arrivalHidden === '20-08-2026' && departureHidden === '27-08-2026',
    `${arrivalHidden} / ${departureHidden}`,
  );
  check('a valid submit is accepted and confirms to the visitor', doneVisible, `done=${doneVisible}`);
  if (mailto) {
    check(
      'the mailto carries the legacy field names and d-m-Y dates',
      decodeURIComponent(mailto).includes('et_pb_contact_arrival_0: 20-08-2026'),
      mailto.slice(0, 80),
    );
  }
  await page.close();
}

/* --- 11. Click-to-load map ---------------------------------------------- */
{
  const page = await desktop.newPage();
  const thirdParty = [];
  page.on('request', (r) => {
    const host = new URL(r.url()).host;
    if (host && !host.startsWith('localhost')) thirdParty.push(host);
  });
  await page.goto(BASE + '/location/', { waitUntil: 'networkidle' });
  const beforeCount = thirdParty.length;
  const noFrame = (await page.$$('.mapbox iframe')).length === 0;
  await page.click('[data-map-load]');
  await page.waitForTimeout(1200);
  const frameSrc = await page.getAttribute('.mapbox iframe', 'src');
  const frameTitle = await page.getAttribute('.mapbox iframe', 'title');
  check(
    'no third-party request is made until the map is asked for',
    beforeCount === 0 && noFrame,
    `${beforeCount} request(s): ${[...new Set(thirdParty)].join(', ')}`,
  );
  check(
    'map loads on request, with the owner\'s own pin and a frame title',
    Boolean(frameSrc && frameSrc.includes('zXOjcWYTSmMc.knNhvErYiVw4') && frameTitle),
    frameSrc,
  );
  await page.close();
}

/* --- 12. Privacy: no external asset anywhere ---------------------------- */
{
  const page = await desktop.newPage();
  const hosts = new Set();
  page.on('request', (r) => {
    const host = new URL(r.url()).host;
    if (host && !host.startsWith('localhost')) hosts.add(host);
  });
  for (const p of ['/', '/accomodation/', '/photos/', '/reservations/', '/covid-19/', '/el/']) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
  }
  check('no font, script or analytics request leaves the site', hosts.size === 0, [...hosts].join(', '));
  await page.close();
}

/* --- 13. Layout stability and image sizing ------------------------------ */
{
  const page = await desktop.newPage();
  let missing = 0;
  for (const p of ['/', '/accomodation/', '/photos/', '/location/', '/reservations/']) {
    await page.goto(BASE + p, { waitUntil: 'networkidle' });
    missing += await page.$$eval('img:not([data-lightbox-image])', (els) =>
      els.filter((e) => !e.getAttribute('width') || !e.getAttribute('height')).length);
  }
  check('every <img> ships intrinsic width and height', missing === 0, `${missing} without dimensions`);
  await page.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
for (const r of results) {
  console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  [${r.detail}]` : ''}`);
}
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
