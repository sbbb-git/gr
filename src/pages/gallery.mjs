import { featured, galleries } from '../content/site.mjs';
import { esc } from '../lib/html.mjs';
import { url } from '../lib/routing.mjs';
import { pageHero, photoGrid, lightbox, ctaBand } from '../components.mjs';
import {
  lodgingBusiness,
  website,
  webPage,
  breadcrumbs,
  imageGallery,
} from '../lib/schema.mjs';

export const meta = (t) => ({
  title: t.gallery.title,
  description: t.gallery.description,
  heroImage: featured.galleryBanner,
  shareImage: 'sun-terrace-over-the-sea',
  bodyClass: 'page-gallery',
});

export const schema = (t, lang) => [
  lodgingBusiness(t, lang),
  website(t, lang),
  webPage(t, lang, 'gallery', {
    title: t.gallery.title,
    description: t.gallery.description,
    image: 'stone-terrace-above-the-blue-bay',
  }),
  imageGallery(t, lang),
  breadcrumbs([
    { name: t.nav.home, url: url('home', lang) },
    { name: t.gallery.heroTitle, url: url('gallery', lang) },
  ]),
];

export function render(t, lang) {
  const g = t.gallery;
  const count = galleries.exterior.length + galleries.interior.length;
  // The subtitle quotes a photo count; interpolate it so it can never drift
  // out of sync with the gallery arrays.
  const subtitle = g.heroSubtitle.replace('{count}', String(count));

  const filters = [
    { key: 'all', label: g.filterAll, count },
    { key: 'exterior', label: g.filterExterior, count: galleries.exterior.length },
    { key: 'interior', label: g.filterInterior, count: galleries.interior.length },
  ];

  return `
${pageHero({
  t,
  lang,
  route: 'gallery',
  image: featured.galleryBanner,
  title: g.heroTitle,
  subtitle,
})}

<section class="section">
  <div class="container">
    <div class="filters" role="tablist" aria-label="${esc(g.heroTitle)}">
      ${filters
        .map(
          (f, i) => `
      <button type="button" class="filters__btn${i === 0 ? ' is-active' : ''}"
              role="tab" aria-selected="${i === 0}" data-filter="${esc(f.key)}"
              aria-controls="gallery-panels">
        ${esc(f.label)}<span class="filters__count">${f.count}</span>
      </button>`,
        )
        .join('\n')}
    </div>

    <div id="gallery-panels">
      <section class="gallery__section" data-section="exterior">
        <h2 class="gallery__title">${esc(g.exteriorTitle)}</h2>
        ${photoGrid(t, galleries.exterior, { className: 'grid--3', group: 'exterior' })}
      </section>

      <section class="gallery__section" data-section="interior">
        <h2 class="gallery__title">${esc(g.interiorTitle)}</h2>
        ${photoGrid(t, galleries.interior, { className: 'grid--3', group: 'interior' })}
      </section>
    </div>
  </div>
</section>

${ctaBand(t)}
${lightbox(t)}`;
}
