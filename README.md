# Anna Studios — studioannaparos.gr

A rebuild of the Anna Studios website: rooms, studios and apartments in
Kolympithres, in the bay of Naoussa on the island of Paros.

The old site was WordPress 7.0.4 with Divi and Polylang — roughly 120–240 KB of
HTML and about 900 KB of render-blocking assets on every page, with the Greek,
Italian and French versions each missing pages the English one had. This
replaces it with plain static HTML generated from a small, dependency-free
build script.

Everything the previous site published — text, photographs, contact details,
the tourism registration number, payment methods, external links, the booking
engine and the exact field contract of its reservation form — is carried over.
The differences are listed under [What changed](#what-changed).

---

## Quick start

```bash
npm run build     # render dist/
npm start         # build, then serve on http://localhost:4173
```

Node 18 or newer. The generator itself has no dependencies — `npm install` is
only needed for the verification suites in `tools/`.

The two asset pipelines are run only when the source material changes:

```bash
npm run images    # assets/originals -> public/images (needs: pip install Pillow)
npm run fonts     # re-download the self-hosted webfonts
```

---

## How it is put together

```
build.mjs               the whole toolchain: renders every route × language
serve.mjs               local preview server

src/
  content/
    site.mjs            business facts, external links, photo sets, routes
    en.mjs el.mjs it.mjs fr.mjs   all translated copy, including per-photo alt text
    media.json          generated — image dimensions and placeholder colours
  pages/                one module per template
  lib/                  html escaping, responsive images, routing, JSON-LD, icons
  components.mjs        fragments shared by more than one page
  layout.mjs            the <head>, header and footer
  styles/site.css
  js/site.js

public/                 images, fonts, favicons — copied verbatim into dist/
assets/originals/       full-resolution masters, input to the image pipeline
scripts/                the image and font pipelines
tools/pack-preview.mjs  bundles all 24 pages into one self-contained preview file
```

`npm run preview` writes `preview/anna-studios-preview.html`: every route in
every language in a single file, with the photos and both webfonts (Latin *and*
Greek subsets) inlined, routed on a `#<lang>/<page>` hash. It opens from disk
with no server and makes no external request, so it can be emailed to someone
who wants to click through the site before it is live.

`build.mjs` renders 6 routes × 4 languages, plus a 404 page and four redirect
stubs, and writes `sitemap.xml`, `robots.txt`, `site.webmanifest` and
`_redirects`. It refuses to build if the four language files have drifted out of
sync — key shapes *and* array lengths must match, which is what stops an amenity
or an FAQ entry from silently going missing in one language — and prints an SEO
audit (title and description lengths, duplicate titles and descriptions, heading
counts, missing `alt` attributes) at the end of every run.

### URLs

The old site published a **different slug in every language**, so the route
table carries a slug per language rather than one shared slug:

| route | English | Greek | Italian | French |
| --- | --- | --- | --- | --- |
| home | `/` | `/el/` | `/it/` | `/fr/` |
| accommodation | `/accomodation/` | `/el/διαμονή/` | `/it/sistemazione/` | `/fr/hebergement/` |
| location | `/location/` | `/el/τοποθεσία/` | `/it/localita/` | `/fr/location-2/` |
| photos | `/photos/` | `/el/φωτογραφίες/` | `/it/fotografie/` | `/fr/photos-fr/` |
| reservations | `/reservations/` | `/el/κρατήσεις/` | `/it/prenotazioni/` | `/fr/reservations/` |
| CoVID-19 | `/covid-19/` | `/el/covid-19-2/` | `/it/covid-19-italiano/` | `/fr/covid-19-3/` |

Every path the old site served still resolves. `/accomodation/` keeps its
original spelling because that is the URL search engines have indexed. The four
language home pages carried auto-generated WordPress slugs (`/el/829-2/`,
`/el/ελληνικά/`, `/it/italiano/`, `/fr/francais/`); those are 301'd to the clean
locale roots both in `_redirects` and by a static stub, so the redirect works on
hosting with no rules engine too.

Greek slugs are real UTF-8 on disk and percent-encoded in markup, exactly as the
old WordPress install served them.

### Adding or changing text

All copy lives in `src/content/<lang>.mjs`. The four files must have identical
key structures — the build fails with a list of the offending keys otherwise.

### Adding photographs

1. Drop the full-resolution file into `assets/originals/`.
2. Add a filename → slug entry in `scripts/image-map.json`.
3. `npm run images`.
4. Reference the slug in `src/content/site.mjs` (`galleries` or `featured`) and
   write its alt text in each of the four language files.

Every photo is emitted as a WebP ladder (480/768/1200/1600/2000, capped at the
master's own width) at quality 86, plus one JPEG fallback at quality 90.
`media.json` records the intrinsic dimensions so every `<img>` ships
`width`/`height` and the page never reflows, and an average colour that fills
the frame while the file downloads.

---

## The booking engine

The old site linked one URL from every page in every language:

```
https://reservations.bookoncloud.com/welcome/studioannaparos?lang=en&channelId=website#/availability
```

That is reproduced **character for character** in `site.booking.url`, including
`lang=en` — the old site sent English to the booking engine from the Greek,
Italian and French pages too, and guessing at `lang=el` / `lang=it` / `lang=fr`
without knowing whether BookOnCloud has those locales configured would be a
change, not a carry-over. See [Open questions](#open-questions).

## The reservation form

The old `/reservations/` page ran a Divi contact form that POSTed back to
WordPress. There is no WordPress any more, so delivery is configurable:

| `site.form.provider` | behaviour |
| --- | --- |
| `mailto` *(default)* | No backend. The visitor's own mail application opens with the request pre-filled, and the address is shown as a link in case it does not. |
| `endpoint` | The form is POSTed as JSON to `form.endpoint` — Formspree, Web3Forms, a Cloudflare Worker, anything that accepts JSON. |
| `netlify` | A normal form POST, captured by Netlify Forms. |

The **field contract is preserved exactly** in all three modes. Every field
keeps the name the Divi form used —

```
et_pb_contact_name1_0   et_pb_contact_email_0    et_pb_contact_phone_0
et_pb_contact_address_0 et_pb_contact_adults_0   et_pb_contact_kids_0
et_pb_contact_room_type_0
et_pb_contact_arrival_0 et_pb_contact_departure_0
et_pb_contact_message_0
```

— and the two dates are still submitted as **`d-m-Y`**, which is how the old
datepicker was configured. Any existing inbox filter or CRM mapping keeps
working. The visible date fields are native `<input type="date">` (better on a
phone, reachable by keyboard) and a hidden twin carries the `d-m-Y` value under
the legacy name.

The adults (1–4), children (0–3) and room-type options are the old `<select>`
values, including the `Doulbe Studio` misspelling in the English list.

---

## Deploying

`dist/` is a plain folder of static files — any host will serve it.

* **GitHub Pages** — `.github/workflows/deploy.yml` builds and publishes on every
  push to `main`. Enable Pages with source *GitHub Actions* once.
* **Netlify / Vercel / Cloudflare Pages** — build command `node build.mjs`,
  publish directory `dist`. `_redirects` handles the retired language home pages
  and the old WordPress endpoints (`/wp-admin/*`, `/xmlrpc.php`, `/feed`, …).
* **Plain hosting** — upload the contents of `dist/`.

Set `site.origin` in `src/content/site.mjs` if the site ever moves off
`https://studioannaparos.gr` — canonicals, hreflang, Open Graph URLs, JSON-LD
and the sitemap all derive from it.

---

## Measured results

| | old site | this site |
| --- | --- | --- |
| Home — HTML | 136.5 KB | 63.9 KB |
| Home — total page | ~1 075 KB, 21 requests | 623 KB, 20 requests (mobile) |
| Accommodation — HTML | 237.0 KB | 96.5 KB |
| Photos — HTML | 190.6 KB | 114.4 KB *(55 photos, up from 22)* |
| Location — HTML | 133.8 KB | 53.5 KB |
| Reservations — HTML | 181.3 KB | 45.3 KB |
| CoVID-19 — HTML | 117.5 KB | 29.1 KB |

Measured in Chromium: **CLS 0.000** on every page at 1440 px and 390 px, LCP
72–208 ms on a local server, **0 axe-core violations** (WCAG 2.1 A + AA plus
best practices) across 14 page types × 2 widths, including with the lightbox and
the mobile drawer open. The old-site totals exclude its CSS background images,
so its real page weight is higher than the figure above.

`tools/` holds the verification suites — `npm test`, `npm run a11y` and
`npm run perf`, each against a running `npm run serve` (they need
`npm install`, which pulls in Playwright and axe-core). The interaction suite is
28 checks
covering navigation, the legacy redirects, the slideshow (including
`prefers-reduced-motion`), the lightbox, gallery filters, the mobile drawer, the
language switcher, the booking-engine URL, the reservation form's validation and
`d-m-Y` contract, the click-to-load map and the "no third-party request"
guarantee.

## SEO

* Unique title and meta description on all 24 pages, length-checked at build time.
* Canonical URL, four `hreflang` alternates and `x-default` on every page.
* Open Graph and Twitter cards with a per-page image, its real dimensions and alt.
* JSON-LD: `LodgingBusiness` (address, geo, telephone, e-mail, 29 amenities,
  payment methods, check-in/out times, tourism registration number,
  `ReserveAction`), `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage`,
  `ImageGallery` of all 55 photographs and an `Accommodation` node per room type.
  Nothing is asserted that is not published on the site — no invented rating,
  review count or price range.
* `sitemap.xml` with `xhtml:link` alternates for every language of every page.
* Semantic landmarks, one `<h1>` per page, descriptive alt text on every image in
  all four languages.
* A ten-question FAQ per language, answered only from facts the site states.

## Accessibility

axe-core reports no violations across all page types at desktop and mobile
widths. Colour tokens were measured against the 4.5:1 threshold before use (the
ratios are noted beside them in `site.css`); the lightbox traps focus and
restores it to the tile that opened it; the gallery grid and slideshow are
keyboard-operable; inactive slides are hidden from assistive technology;
`prefers-reduced-motion` disables autoplay and every transition.

## Privacy

No analytics, no tracking scripts, no advertising cookies, no consent banner —
because there is nothing to consent to. Fonts are self-hosted, so no request
ever reaches Google. The map is behind an explicit *Load the map* button and is
the only thing that can set a third-party cookie, and only once the visitor asks.
Three functional entries are kept in `localStorage` (map consent, chosen
language, dismissed language hint).

---

## Design

The palette is sampled out of the property's own photographs rather than picked
from a swatch: the powder blue of the studio accent walls, the deep azure of the
sea off Kolympithres, the sun-baked ochre of the boats and dry grass, and the
whitewash the island is painted in.

Type is **Alegreya** for headlines and **Commissioner** for text. Both carry a
genuine upright Greek, so a Greek heading sits level with a Latin one instead of
leaning — which matters on a site that publishes in Greek as a first language.
Both are self-hosted; the Greek pages preload the Greek subset.

The scallop shell from the original logo is redrawn as vector geometry. The old
logo was a 250 × 55 px PNG — too small to serve to a modern screen, and the only
version on the server.

---

## What changed

Carried over unchanged: every sentence of the original copy in all four
languages, all 55 photographs at their full 2000 px resolution, the address, the
phone and mobile numbers with their WhatsApp and Viber marks, the e-mail, the
tourism registration number 1165202, the payment methods, the check-in and
check-out times, the reservation and cancellation policies, the two direct
booking offers, the CoVID-19 notice, and the links to Instagram, Facebook,
Tripadvisor, Google Reviews, the owner's Google map and the booking engine.

Added or changed:

* **All four languages are complete.** The old site had Reservations only in
  English and Greek, and the Greek home page existed twice under two slugs.
  Every page now exists in all four languages.
* **A photo gallery with a lightbox** — 55 photographs, up from 22, filterable
  by room type, with keyboard navigation and swipe.
* **An FAQ** in each language, drawn strictly from information the site states.
* **Two amenity lists were completed.** The Greek list was missing the luggage
  table; the Italian list was missing the fridge, listed the laundry twice (once
  untranslated as "Laundry service – Ironing") and omitted the outdoor shower.
  All four lists now describe the same 17 room and 12 property amenities, each in
  its own language's original wording.
* **The home-page slideshow headlines are translated.** The old Divi slider
  showed its six headlines in English on the Greek, Italian and French pages;
  slide four had no headline at all and now carries one.
* **The map is click-to-load.** Same pin, same map, but Google is not contacted
  until the visitor presses the button.
* **The reservation form no longer needs a server** — see above.
* **The brand mark is vector** rather than a 250 px PNG.
* **The floating social and language bars are gone.** The same links are in the
  header and footer.

## Open questions

Three things need the owner's decision — none of them block the site:

1. **Booking-engine language.** The engine link is hard-coded to `lang=en` on
   every page because that is what the old site did. If BookOnCloud has Greek,
   Italian and French locales configured, `site.booking.lang` should become
   per-language.
2. **The footer credit.** `Copyright @2022 Anna Studios, Design & Hosting by
   Pararam` is carried over verbatim, including the year and the previous
   provider's name. Both probably want updating.
3. **The CoVID-19 page.** The text refers to "the third summer … in the middle
   of a pandemic". The page is kept because its URL was published and indexed,
   but the owner may want to retire or rewrite it.

---

© Anna Studios.
