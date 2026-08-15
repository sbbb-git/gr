import { featured, galleries } from '../content/site.mjs';
import { esc, paragraphs } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { path, url } from '../lib/routing.mjs';
import {
  pageHero,
  heading,
  photoGrid,
  lightbox,
  bookingBar,
  ctaBand,
} from '../components.mjs';
import { lodgingBusiness, website, webPage, breadcrumbs } from '../lib/schema.mjs';

export const meta = (t) => ({
  title: t.studios.title,
  description: t.studios.description,
  heroImage: featured.studiosBanner,
  shareImage: 'terrace-sea-view-sunbed',
  bodyClass: 'page-studios',
});

export const schema = (t, lang) => [
  lodgingBusiness(t, lang),
  website(t, lang),
  webPage(t, lang, 'studios', {
    title: t.studios.title,
    description: t.studios.description,
    image: 'studio-double-bed-sea-view-door',
  }),
  breadcrumbs([
    { name: t.nav.home, url: url('home', lang) },
    { name: t.studios.heroTitle, url: url('studios', lang) },
  ]),
];

export function render(t, lang) {
  const s = t.studios;

  return `
${pageHero({
  t,
  lang,
  route: 'studios',
  image: featured.studiosBanner,
  title: s.heroTitle,
  subtitle: s.heroSubtitle,
})}

<section class="section">
  <div class="container container--narrow">
    <div class="prose prose--center">${paragraphs(s.intro.map(esc), 'lede')}</div>
  </div>
</section>

<section class="section section--sand" data-reveal>
  <div class="container">
    ${heading({ title: s.includedTitle, align: 'center' })}
    <ul class="amenities">
      ${t.facilities.groups
        .flatMap((group) => group.items)
        .map(
          (item) => `
      <li class="amenity">
        ${icon(item.icon, { className: 'icon amenity__icon' })}
        <span>${esc(item.label)}</span>
      </li>`,
        )
        .join('\n')}
    </ul>
    <p class="section__note">${esc(s.includedNote)}</p>
    <p class="section__action">
      <a class="btn btn--outline" href="${esc(path('facilities', lang))}">${esc(t.ui.seeFacilities)}${icon('arrowRight', { className: 'icon icon--xs' })}</a>
    </p>
  </div>
</section>

<section class="section" data-reveal>
  <div class="container">
    ${heading({
      title: s.galleryTitle,
      body: s.galleryBody.replace('{count}', String(galleries.interior.length)),
      align: 'center',
    })}
    ${photoGrid(t, galleries.interior, { className: 'grid--3', group: 'interior' })}
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    ${bookingBar(t, { variant: 'inline' })}
  </div>
</section>

${ctaBand(t)}
${lightbox(t)}`;
}
