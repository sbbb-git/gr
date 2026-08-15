/**
 * Accommodation page — the old /accomodation/ page.
 *
 * Same four room types in the same order, with the same descriptions and the
 * same photographs, plus the two service lists, the check-in times and the
 * reservation and cancellation policies.
 */

import { featured, roomTypes, galleries } from '../content/site.mjs';
import { esc } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { path, url } from '../lib/routing.mjs';
import {
  pageHero,
  heading,
  bookButton,
  photoGrid,
  lightbox,
  ctaBand,
} from '../components.mjs';
import {
  lodgingBusiness,
  website,
  webPage,
  breadcrumbs,
  accommodationTypes,
} from '../lib/schema.mjs';

export const meta = (t) => ({
  title: t.accommodation.title,
  description: t.accommodation.description,
  heroImage: featured.accommodationBanner,
  shareImage: featured.accommodationBanner,
  bodyClass: 'page-accommodation',
});

export const schema = (t, lang) => [
  lodgingBusiness(t, lang),
  website(t, lang),
  webPage(t, lang, 'accommodation', {
    title: t.accommodation.title,
    description: t.accommodation.description,
    image: featured.accommodationBanner,
  }),
  breadcrumbs([
    { name: t.nav.home, url: url('home', lang) },
    { name: t.nav.accommodation, url: url('accommodation', lang) },
  ]),
  ...accommodationTypes(t, lang),
];

function roomSection(t, lang, type, index) {
  const room = t.accommodation.rooms[type.key];
  const photos = galleries[type.gallery];

  return `
<section class="roomblock${index % 2 ? ' roomblock--alt' : ''}" id="${esc(type.key)}"
         aria-labelledby="${esc(type.key)}-title">
  <div class="container">
    <div class="roomblock__head">
      <div>
        <p class="eyebrow">${esc(t.accommodation.sleepsLabel)} ${type.sleeps}</p>
        <h2 class="roomblock__title" id="${esc(type.key)}-title">${esc(room.name)}</h2>
        ${room.subtitle && room.subtitle !== room.name ? `<p class="roomblock__subtitle">${esc(room.subtitle)}</p>` : ''}
        <p class="prose">${esc(room.body)}</p>
      </div>
      <div class="roomblock__actions">
        ${bookButton(t, { className: 'btn btn--primary', label: t.accommodation.bookOnline })}
        <a class="btn btn--ghost" href="#services">${esc(t.accommodation.checkServices)}</a>
      </div>
    </div>

    <h3 class="u-visually-hidden">${esc(t.accommodation.photosOf)} ${esc(room.name)}</h3>
    ${photoGrid(t, photos, {
      className: 'grid--four',
      group: type.key,
      sizes: '(min-width: 1100px) 24vw, (min-width: 700px) 46vw, 92vw',
    })}
  </div>
</section>`;
}

function services(t) {
  const list = (items) =>
    `<ul class="services__list">
      ${items
        .map(
          (item) =>
            `<li>${icon('check', { className: 'icon icon--xs services__tick' })}<span>${esc(item)}</span></li>`,
        )
        .join('\n')}
    </ul>`;

  return `
<section class="section section--tint" id="services" aria-labelledby="services-title">
  <div class="container">
    ${heading({ title: t.accommodation.services.title, align: 'center', id: 'services-title' })}
    <div class="services">
      <div class="services__col">
        <h3 class="services__title">${esc(t.accommodation.services.roomTitle)}</h3>
        ${list(t.accommodation.services.room)}
      </div>
      <div class="services__col">
        <h3 class="services__title">${esc(t.accommodation.services.complexTitle)}</h3>
        ${list(t.accommodation.services.complex)}
      </div>
    </div>
    <p class="services__times">${icon('clock', { className: 'icon icon--sm' })}${esc(t.accommodation.times)}</p>
  </div>
</section>`;
}

function policies(t) {
  return `
<section class="section" aria-labelledby="policies-title">
  <div class="container container--narrow">
    ${heading({ title: t.accommodation.policies.title, align: 'center', id: 'policies-title' })}
    <div class="policies">
      <div class="policy">
        <h3 class="policy__title">${esc(t.accommodation.policies.reservationTitle)}</h3>
        ${t.accommodation.policies.reservation.map((p) => `<p class="prose">${esc(p)}</p>`).join('\n')}
      </div>
      <div class="policy">
        <h3 class="policy__title">${esc(t.accommodation.policies.cancellationTitle)}</h3>
        <ul class="policy__list">
          ${t.accommodation.policies.cancellation.map((p) => `<li>${esc(p)}</li>`).join('\n')}
        </ul>
      </div>
    </div>
  </div>
</section>`;
}

export function render(t, lang) {
  return [
    pageHero({
      t,
      lang,
      image: featured.accommodationBanner,
      title: t.accommodation.heroTitle,
      subtitle: t.accommodation.heroSubtitle,
    }),
    `<section class="section section--intro"><div class="container container--narrow">
       <p class="lede">${esc(t.accommodation.intro)}</p>
     </div></section>`,
    ...roomTypes.map((type, i) => roomSection(t, lang, type, i)),
    services(t),
    policies(t),
    ctaBand(t),
    lightbox(t),
  ].join('\n');
}
