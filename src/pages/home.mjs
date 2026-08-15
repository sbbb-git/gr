/**
 * Home page.
 *
 * Keeps the shape of the old page — the slideshow with its six headlines, the
 * welcome text and the two direct-booking offers — and adds the room-type
 * cards, a photo strip and the FAQ.
 */

import { slideshow, featured, roomTypes, galleries } from '../content/site.mjs';
import { esc } from '../lib/html.mjs';
import { picture } from '../lib/image.mjs';
import { icon } from '../lib/icons.mjs';
import { path, url } from '../lib/routing.mjs';
import {
  heading,
  bookButton,
  offerCards,
  faqSection,
  ctaBand,
  photoGrid,
  lightbox,
} from '../components.mjs';
import {
  lodgingBusiness,
  website,
  webPage,
  faqPage,
  breadcrumbs,
  accommodationTypes,
} from '../lib/schema.mjs';

export const meta = (t) => ({
  title: t.home.title,
  description: t.home.description,
  heroImage: slideshow[0].image,
  shareImage: featured.hero,
  bodyClass: 'page-home',
});

export const schema = (t, lang) => [
  lodgingBusiness(t, lang),
  website(t, lang),
  webPage(t, lang, 'home', {
    title: t.home.title,
    description: t.home.description,
    image: featured.hero,
  }),
  breadcrumbs([{ name: t.nav.home, url: url('home', lang) }]),
  faqPage(t),
  ...accommodationTypes(t, lang),
];

/** The slideshow. Every slide is in the markup, so it works without JS too. */
function hero(t, lang) {
  const slides = slideshow
    .map(
      (slide, i) => `
    <li class="hero__slide${i === 0 ? ' is-active' : ''}" data-slide="${i}"${i === 0 ? '' : ' aria-hidden="true"'}>
      ${picture(slide.image, {
        alt: i === 0 ? t.alt[slide.image] : '',
        sizes: '100vw',
        priority: i === 0,
        className: 'hero__image',
      })}
      ${i === 0 ? '' : `<p class="hero__caption">${esc(t.home.slides[slide.key])}</p>`}
    </li>`,
    )
    .join('\n');

  const dots = slideshow
    .map(
      (slide, i) =>
        `<li><button type="button" class="hero__dot${i === 0 ? ' is-active' : ''}" data-slide-to="${i}" ` +
        `aria-label="${esc(t.ui.goToSlide)} ${i + 1}: ${esc(t.home.slides[slide.key])}"></button></li>`,
    )
    .join('\n');

  return `
<section class="hero" data-slideshow aria-labelledby="hero-title">
  <ul class="hero__slides" aria-label="${esc(t.ui.slideshow)}">${slides}</ul>
  <div class="hero__scrim"></div>

  <div class="hero__inner container">
    <p class="hero__eyebrow">${esc(t.home.hero.eyebrow)}</p>
    <h1 class="hero__title" id="hero-title">${esc(t.home.hero.title)}</h1>
    <p class="hero__subtitle">${esc(t.home.hero.subtitle)}</p>
    <div class="hero__actions">
      ${bookButton(t, { className: 'btn btn--primary btn--lg', label: t.home.hero.primaryCta })}
      <a class="btn btn--ghost-invert btn--lg" href="${esc(path('accommodation', lang))}">${esc(t.home.hero.secondaryCta)}</a>
    </div>
  </div>

  <div class="hero__controls">
    <div class="container hero__controls-inner">
      <button type="button" class="hero__ctrl" data-slide-prev aria-label="${esc(t.ui.previous)}">${icon('chevronLeft', { className: 'icon icon--sm' })}</button>
      <ul class="hero__dots">${dots}</ul>
      <button type="button" class="hero__ctrl" data-slide-next aria-label="${esc(t.ui.next)}">${icon('chevronRight', { className: 'icon icon--sm' })}</button>
      <button type="button" class="hero__ctrl hero__ctrl--play" data-slide-toggle
              data-label-play="${esc(t.ui.play)}" data-label-pause="${esc(t.ui.pause)}"
              aria-label="${esc(t.ui.pause)}">${icon('pause', { className: 'icon icon--sm hero__pause' })}${icon('play', { className: 'icon icon--sm hero__play' })}</button>
    </div>
  </div>
</section>`;
}

function highlights(t) {
  return `
<section class="highlights" aria-label="${esc(t.home.rooms.eyebrow)}">
  <ul class="highlights__list container">
    ${t.home.highlights
      .map(
        (item) => `
    <li class="highlight">
      ${icon(item.icon, { className: 'icon highlight__icon' })}
      <span>${esc(item.label)}</span>
    </li>`,
      )
      .join('\n')}
  </ul>
</section>`;
}

function welcome(t) {
  return `
<section class="section welcome" aria-labelledby="welcome-title">
  <div class="container welcome__inner">
    <div class="welcome__text">
      ${heading({
        eyebrow: t.home.welcome.eyebrow,
        title: t.home.welcome.title,
        id: 'welcome-title',
      })}
      ${t.home.welcome.body.map((p) => `<p class="prose">${esc(p)}</p>`).join('\n')}
    </div>
    <div class="welcome__media">
      ${picture(featured.welcome, {
        alt: t.alt[featured.welcome],
        sizes: '(min-width: 900px) 46vw, 92vw',
        className: 'welcome__image',
        ratio: '4 / 3',
      })}
    </div>
  </div>
</section>`;
}

function rooms(t, lang) {
  return `
<section class="section section--tint" aria-labelledby="rooms-title">
  <div class="container">
    ${heading({
      eyebrow: t.home.rooms.eyebrow,
      title: t.home.rooms.title,
      body: t.home.rooms.body,
      align: 'center',
      id: 'rooms-title',
    })}
    <ul class="roomcards">
      ${roomTypes
        .map((type) => {
          const room = t.accommodation.rooms[type.key];
          const image = galleries[type.gallery][0];
          return `
      <li class="roomcard">
        <a class="roomcard__link" href="${esc(path('accommodation', lang))}#${esc(type.key)}">
          ${picture(image, {
            alt: t.alt[image],
            sizes: '(min-width: 1100px) 24vw, (min-width: 700px) 46vw, 92vw',
            className: 'roomcard__image',
            ratio: '4 / 3',
          })}
          <span class="roomcard__body">
            <span class="roomcard__title">${esc(room.name)}</span>
            <span class="roomcard__meta">${icon('users', { className: 'icon icon--xs' })}${esc(t.accommodation.sleepsLabel)} ${type.sleeps}</span>
          </span>
        </a>
      </li>`;
        })
        .join('\n')}
    </ul>
  </div>
</section>`;
}

function offers(t) {
  return `
<section class="section" aria-labelledby="offers-title">
  <div class="container container--narrow">
    ${heading({
      eyebrow: t.home.offers.eyebrow,
      title: t.home.offers.title,
      body: t.home.offers.intro,
      align: 'center',
      id: 'offers-title',
    })}
    ${offerCards(t)}
  </div>
</section>`;
}

function strip(t, lang) {
  return `
<section class="section section--tint" aria-labelledby="strip-title">
  <div class="container">
    ${heading({ title: t.home.strip.title, align: 'center', id: 'strip-title' })}
    ${photoGrid(t, featured.homeStrip, {
      className: 'grid--three',
      group: 'home',
      sizes: '(min-width: 1100px) 32vw, (min-width: 700px) 48vw, 92vw',
    })}
    <p class="section__more">
      <a class="btn btn--ghost" href="${esc(path('gallery', lang))}">${esc(t.home.strip.cta)}</a>
    </p>
  </div>
</section>`;
}

export function render(t, lang) {
  return [
    hero(t, lang),
    highlights(t),
    welcome(t),
    rooms(t, lang),
    offers(t),
    strip(t, lang),
    faqSection(t),
    ctaBand(t),
    lightbox(t),
  ].join('\n');
}
