# Aglaia Studios — aglaiastudios.gr

A rebuild of the Aglaia Studios website: seafront studios in Agia Marina, Kamares,
on the island of Sifnos.

The old site was WordPress with Elementor, WPML, Gravity Forms and a hotel-booking
plugin — roughly 130 KB of HTML and 2 MB of render-blocking assets per page, with
Greek and French limited to the home page. This replaces it with plain static
HTML generated from a small, dependency-free build script.

Everything the previous site published — text, photographs, contact details,
payment methods, EOT licence, awards badge, external links, the booking engine
and its exact field contract — is carried over. The differences are listed under
[What changed](#what-changed).

---

## Quick start

```bash
npm run build     # render dist/
npm start         # build, then serve on http://localhost:4173
npm run preview   # pack the English site into one shareable HTML file
```

`npm run preview` writes `preview/aglaia-studios-preview.html` — the whole
English site, images and fonts inlined, in a single ~3 MB file that opens with
no server and makes no external requests. Useful for sending someone a look at
the site before it is deployed.

Node 18 or newer. There are no npm dependencies to install.

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
    site.mjs            business facts, external links, photo selections, routes
    en.mjs el.mjs fr.mjs  all translated copy, including per-photo alt text
    cookies-*.mjs       the cookies policy, one file per language
    media.json          generated — image dimensions and placeholder colours
  pages/                one module per template
  lib/                  html escaping, responsive images, routing, JSON-LD
  components.mjs        fragments shared by more than one page
  layout.mjs            the <head>, header and footer
  styles/site.css
  js/site.js

public/                 images, fonts, favicons — copied verbatim into dist/
assets/originals/       full-resolution masters, input to the image pipeline
scripts/                the image and font pipelines
```

`build.mjs` renders 7 routes × 3 languages, plus a 404 page, and writes
`sitemap.xml`, `robots.txt`, `site.webmanifest` and `_redirects`. It refuses to
build if the three language files have drifted out of sync, and prints an SEO
audit (title and description lengths, duplicate titles, heading counts, missing
`alt` attributes) at the end of every run.

### Adding or changing text

All copy lives in `src/content/<lang>.mjs`. The three files must have identical
key structures — the build fails with a list of the offending keys otherwise,
which is what stops a translation from silently going missing.

### Adding photographs

1. Drop the full-resolution file into `assets/originals/`.
2. Add a filename → slug entry in `scripts/image-map.json`.
3. `npm run images`.
4. Reference the slug in `src/content/site.mjs` (`galleries` or `featured`) and
   write its alt text in each of the three language files.

Every photo is emitted as a WebP ladder (480/768/1200/1600/2000/2600, capped at
the master's own width) plus one JPEG fallback, at WebP q86 / JPEG q90. `media.json` records the intrinsic
dimensions so every `<img>` ships `width`/`height` and the page never reflows,
and an average colour that fills the frame while the file downloads.

---

## The contact form

`src/content/site.mjs` → `form.provider` decides how a message is delivered:

| provider | behaviour |
| --- | --- |
| `mailto` *(default)* | No backend. The visitor's own mail application opens with the message pre-filled, and the address is shown as a link in case it does not. |
| `endpoint` | The form is POSTed as JSON to `form.endpoint` — Formspree, Web3Forms, a Cloudflare Worker, anything that accepts JSON. |
| `netlify` | A normal form POST, captured by Netlify Forms. |

Validation, the honeypot field and the error messages are identical in all three
modes. Switching is a one-line change plus a rebuild.

---

## Deploying

`dist/` is a plain folder of static files — any host will serve it.

* **GitHub Pages** — `.github/workflows/deploy.yml` builds and publishes on every
  push to `main`. Enable Pages with source *GitHub Actions* once.
* **Netlify / Vercel / Cloudflare Pages** — build command `node build.mjs`,
  publish directory `dist`. `_redirects` retires the old WordPress endpoints
  (`/wp-admin/*`, `/xmlrpc.php`, `/feed`, `/sitemap_index.xml`, …).
* **Plain hosting** — upload the contents of `dist/`.

Set `site.origin` in `src/content/site.mjs` if the site ever moves off
`https://aglaiastudios.gr` — canonicals, hreflang, Open Graph URLs, JSON-LD and
the sitemap all derive from it.

---

## SEO

* Unique title and meta description on all 21 pages, length-checked at build time.
* Canonical URL, three `hreflang` alternates and `x-default` on every page.
* Open Graph and Twitter cards with a per-page image, its real dimensions and alt.
* JSON-LD: `LodgingBusiness` (address, geo, telephone, e-mail, amenities, payment
  methods, EOT licence, `ReserveAction`), `WebSite`, `WebPage`, `BreadcrumbList`,
  `FAQPage` and an `ImageGallery` of all 43 photographs. Nothing is asserted that
  is not published on the site — there is no invented rating, review count or
  price range.
* `sitemap.xml` with `xhtml:link` alternates for every language of every page.
* Semantic landmarks, one `<h1>` per page, descriptive alt text on every image in
  all three languages.
* Every URL the old site published still resolves: `/`, `/facilities/`,
  `/location/`, `/photo-gallery/`, `/contact/`, `/cookies-policy/`, `/el/`, `/fr/`.
* An eight-question FAQ per language, answered only from facts the site states.

## Accessibility

axe-core (WCAG 2.1 A + AA, plus best practices) reports no violations across all
10 page types at desktop and mobile widths. Colour tokens were chosen against the
4.5:1 threshold; the lightbox traps focus and restores it on close; the gallery
grid is keyboard-operable; `prefers-reduced-motion` disables every transition.

## Privacy

No analytics, no tracking scripts, no advertising cookies. Fonts are self-hosted,
so the typography never calls out to Google.

Two things do reach a third party, and both are disclosed in the cookies policy:

* The **hero film** on the home page streams from `youtube-nocookie.com` — Google's
  privacy-enhanced embed. It is muted, injected only after `load` so it never
  delays first paint, skipped entirely under `prefers-reduced-motion` or
  `Save-Data`, and stoppable from a visible control (WCAG 2.2.2).
* The **map** loads nothing until the visitor presses *Load the map*.

Every other page makes zero third-party requests. Two functional entries are kept
in `localStorage` (map consent, chosen language).

---

## What changed

Carried over unchanged: every sentence of the original copy in all three
languages, all 50 images, the address, phone, e-mail, EOT licence 1242674VER1,
payment methods, the Booking.com award badge, and the links to Instagram,
Facebook, Google Maps, the SkylineWebcams live camera and the booking engine.

Added or changed:

* **Greek and French are complete.** The old site only translated the home page;
  every page now exists in all three languages, with matching URLs.
* **A `/studios/` page** — the home page's "Our Studios" section, expanded with
  the amenity list and all 20 interior photographs.
* **A photo gallery with a lightbox** — filters, keyboard navigation, swipe.
* **The hero film is back.** The old site played a drone video behind the top of
  the home page, configured inside an Elementor section setting rather than as a
  `<video>` tag. It is reinstated, with a frame of it as the poster image and a
  pause control the original never had.
* **An FAQ** in each language, drawn strictly from information the site states.
* **The cookies policy table was rewritten.** The old table listed Google
  Analytics, Facebook, Polylang and Popup Maker cookies. None of them exist on
  this site, so the table now describes what is actually stored. The
  interpretation, consent and browser-control sections are unchanged.
* **The contact form no longer needs a server** — see above.
* **The floating Booking.com badge iframe was removed.** The same badge image is
  still in the footer and links to the Booking.com page; the third-party iframe
  that loaded it on every page is gone.
* **The Greek headline typeface.** EB Garamond's Greek is a slanted cursive that
  reads as italic beside upright Latin, so the display family draws its Greek
  from Gentium Book Plus instead.

---

© Aglaia Studios. Site credit: Codibee.
