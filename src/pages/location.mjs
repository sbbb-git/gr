/**
 * Location page — the old /location/ page.
 *
 * The same seven distances, the same note about renting a vehicle, and the
 * owner's own Google map, now behind a click-to-load button.
 */

import { featured, galleries } from '../content/site.mjs';
import { esc } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { url } from '../lib/routing.mjs';
import {
  pageHero,
  heading,
  mapEmbed,
  photoGrid,
  lightbox,
  faqSection,
  ctaBand,
} from '../components.mjs';
import { lodgingBusiness, website, webPage, breadcrumbs, faqPage } from '../lib/schema.mjs';

export const meta = (t) => ({
  title: t.location.title,
  description: t.location.description,
  heroImage: featured.locationBanner,
  shareImage: featured.locationBanner,
  bodyClass: 'page-location',
});

export const schema = (t, lang) => [
  lodgingBusiness(t, lang),
  website(t, lang),
  webPage(t, lang, 'location', {
    title: t.location.title,
    description: t.location.description,
    image: featured.locationBanner,
  }),
  breadcrumbs([
    { name: t.nav.home, url: url('home', lang) },
    { name: t.nav.location, url: url('location', lang) },
  ]),
  faqPage(t),
];

/** Icons chosen per row, in the order the old page listed the distances. */
const ROW_ICONS = ['beach', 'users', 'view', 'wave', 'pin', 'sunbed', 'heart'];

function distances(t) {
  return `
<section class="section" aria-labelledby="distances-title">
  <div class="container">
    ${heading({ title: t.location.distancesTitle, align: 'center', id: 'distances-title' })}
    <ul class="distances">
      ${t.location.distances
        .map(
          (row, i) => `
      <li class="distance">
        ${icon(ROW_ICONS[i] ?? 'pin', { className: 'icon distance__icon' })}
        <span class="distance__label">${esc(row)}</span>
      </li>`,
        )
        .join('\n')}
    </ul>
    <p class="note">${icon('check', { className: 'icon icon--sm' })}<span>${esc(t.location.transport)}</span></p>
  </div>
</section>`;
}

function map(t) {
  return `
<section class="section section--tint" aria-labelledby="map-title">
  <div class="container">
    ${heading({ title: t.location.map.title, align: 'center', id: 'map-title' })}
    ${mapEmbed(t)}
  </div>
</section>`;
}

function around(t) {
  return `
<section class="section" aria-labelledby="around-title">
  <div class="container">
    ${heading({ title: t.home.strip.title, align: 'center', id: 'around-title' })}
    ${photoGrid(t, galleries.island.slice(2, 11), {
      className: 'grid--three',
      group: 'island',
      sizes: '(min-width: 1100px) 32vw, (min-width: 700px) 48vw, 92vw',
    })}
  </div>
</section>`;
}

export function render(t, lang) {
  return [
    pageHero({
      t,
      lang,
      image: featured.locationBanner,
      title: t.location.heroTitle,
      subtitle: t.location.heroSubtitle,
    }),
    `<section class="section section--intro"><div class="container container--narrow">
       <p class="lede">${esc(t.location.intro)}</p>
     </div></section>`,
    distances(t),
    map(t),
    around(t),
    faqSection(t),
    ctaBand(t),
    lightbox(t),
  ].join('\n');
}
