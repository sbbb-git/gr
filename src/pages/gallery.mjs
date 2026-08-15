/**
 * Photo gallery — the old /photos/ page.
 *
 * The old page showed 22 photographs in a plain grid. This one shows all 55,
 * grouped so a visitor can filter to one room type, with a lightbox.
 */

import { featured, galleries } from '../content/site.mjs';
import { esc } from '../lib/html.mjs';
import { picture } from '../lib/image.mjs';
import { icon } from '../lib/icons.mjs';
import { url } from '../lib/routing.mjs';
import { pageHero, lightbox, ctaBand } from '../components.mjs';
import {
  lodgingBusiness,
  website,
  webPage,
  breadcrumbs,
  imageGallery,
} from '../lib/schema.mjs';

const GROUPS = ['doubleRoom', 'doubleStudio', 'apartmentTwo', 'apartmentFour', 'island'];

export const meta = (t) => ({
  title: t.gallery.title,
  description: t.gallery.description,
  heroImage: featured.galleryBanner,
  shareImage: featured.galleryBanner,
  bodyClass: 'page-gallery',
});

export const schema = (t, lang) => [
  lodgingBusiness(t, lang),
  website(t, lang),
  webPage(t, lang, 'gallery', {
    title: t.gallery.title,
    description: t.gallery.description,
    image: featured.galleryBanner,
  }),
  breadcrumbs([
    { name: t.nav.home, url: url('home', lang) },
    { name: t.nav.gallery, url: url('gallery', lang) },
  ]),
  imageGallery(t, lang),
];

/** Every photo, tagged with its group so the filter can hide and show them. */
function items() {
  return GROUPS.flatMap((group) => galleries[group].map((slug) => ({ slug, group })));
}

export function render(t, lang) {
  const all = items();

  const filters = ['all', ...GROUPS]
    .map(
      (key, i) =>
        `<li><button type="button" class="chip${i === 0 ? ' is-active' : ''}" data-filter="${esc(key)}" ` +
        `aria-pressed="${i === 0}">${esc(t.gallery.filters[key])}` +
        `<span class="chip__count">${key === 'all' ? all.length : galleries[key].length}</span></button></li>`,
    )
    .join('\n');

  const tiles = all
    .map(
      (item, index) => `
  <li class="grid__item" data-group="${esc(item.group)}">
    <button type="button" class="tile" data-lightbox="gallery" data-index="${index}"
            aria-label="${esc(t.ui.enlarge)}: ${esc(t.alt[item.slug])}">
      ${picture(item.slug, {
        alt: t.alt[item.slug],
        sizes: '(min-width: 1300px) 25vw, (min-width: 900px) 33vw, (min-width: 600px) 50vw, 92vw',
        className: 'tile__image',
        ratio: '4 / 3',
      })}
      <span class="tile__zoom" aria-hidden="true">${icon('expand', { className: 'icon icon--sm' })}</span>
    </button>
  </li>`,
    )
    .join('\n');

  return [
    pageHero({
      t,
      lang,
      image: featured.galleryBanner,
      title: t.gallery.heroTitle,
      subtitle: t.gallery.heroSubtitle,
    }),
    `
<section class="section" aria-labelledby="gallery-title" data-gallery>
  <div class="container">
    <h2 class="u-visually-hidden" id="gallery-title">${esc(t.gallery.heroTitle)}</h2>
    <p class="lede lede--center">${esc(t.gallery.intro)}</p>

    <div class="filters">
      <h3 class="u-visually-hidden" id="filters-title">${esc(t.gallery.filtersLabel)}</h3>
      <ul class="filters__list" aria-labelledby="filters-title">${filters}</ul>
    </div>

    <p class="filters__status" data-gallery-status role="status">${all.length} ${esc(t.gallery.counter)}</p>

    <ul class="grid grid--four" data-lightbox-group="gallery">${tiles}</ul>

    <p class="filters__empty" data-gallery-empty hidden>${esc(t.gallery.empty)}</p>
  </div>
</section>`,
    ctaBand(t),
    lightbox(t),
  ].join('\n');
}
