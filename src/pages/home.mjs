import { site, featured, galleries } from '../content/site.mjs';
import { esc, paragraphs } from '../lib/html.mjs';
import { picture } from '../lib/image.mjs';
import { icon } from '../lib/icons.mjs';
import { path } from '../lib/routing.mjs';
import {
  heading,
  bookingBar,
  faqList,
  photoGrid,
  lightbox,
  ctaBand,
} from '../components.mjs';
import { lodgingBusiness, website, webPage, faqPage } from '../lib/schema.mjs';

export const meta = (t) => ({
  title: t.home.title,
  description: t.home.description,
  heroImage: featured.hero,
  shareImage: 'stone-terrace-above-the-blue-bay',
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
  faqPage(t),
];

export function render(t, lang) {
  const h = t.home;

  return `
<section class="hero">
  ${picture(featured.hero, {
    alt: t.alt[featured.hero],
    sizes: '100vw',
    priority: true,
    className: 'hero__image',
  })}
  <div class="hero__scrim"></div>
  <div class="hero__inner container">
    <p class="hero__eyebrow">${esc(h.hero.eyebrow)}</p>
    <h1 class="hero__title">${esc(h.hero.title)}</h1>
    <p class="hero__subtitle">${esc(h.hero.subtitle)}</p>
    <div class="hero__actions">
      <a class="btn btn--primary btn--lg" href="${esc(site.links.booking)}" target="_blank" rel="noopener noreferrer">${esc(h.hero.primaryCta)}</a>
      <a class="btn btn--outline btn--lg" href="${esc(path('studios', lang))}">${esc(h.hero.secondaryCta)}</a>
    </div>
  </div>
  <a class="hero__scroll" href="#welcome" aria-label="${esc(t.ui.scrollDown)}">
    ${icon('chevronDown', { className: 'icon' })}
  </a>
</section>

<div class="container bookbar__slot">
  ${bookingBar(t)}
</div>

<section class="section section--tight" id="welcome">
  <div class="container">
    <ul class="highlights">
      ${h.highlights
        .map(
          (item) => `
      <li class="highlights__item">
        ${icon(item.icon, { className: 'icon highlights__icon' })}
        <span>${esc(item.label)}</span>
      </li>`,
        )
        .join('\n')}
    </ul>
  </div>
</section>

<section class="section split" data-reveal>
  <div class="container split__inner">
    <div class="split__media split__media--arch">
      ${picture(featured.welcome, {
        alt: h.welcome.imageAlt,
        sizes: '(min-width: 900px) 46vw, 92vw',
        className: 'split__image',
        ratio: '4 / 5',
      })}
    </div>
    <div class="split__text">
      ${heading({ eyebrow: h.welcome.eyebrow, title: h.welcome.title })}
      ${paragraphs(h.welcome.body.map(esc), 'lede')}
      <ul class="ticks">
        ${h.why.items
          .slice(0, 3)
          .map((item) => `<li>${icon('check', { className: 'icon icon--xs' })}${esc(item.text)}</li>`)
          .join('\n')}
      </ul>
    </div>
  </div>
</section>

<section class="section section--sand" data-reveal>
  <div class="container">
    ${heading({ eyebrow: h.studios.eyebrow, title: h.studios.title, align: 'center' })}
    <div class="prose prose--center">${paragraphs(h.studios.body.map(esc))}</div>
    ${photoGrid(t, featured.studios, {
      className: 'grid--4',
      group: 'studios',
      sizes: '(min-width: 1100px) 24vw, (min-width: 700px) 48vw, 92vw',
    })}
    <p class="section__action">
      <a class="btn btn--outline" href="${esc(path('studios', lang))}">${esc(h.studios.cta)}${icon('arrowRight', { className: 'icon icon--xs' })}</a>
    </p>
  </div>
</section>

<section class="section split split--reverse" data-reveal>
  <div class="container split__inner">
    <div class="split__media">
      ${picture(featured.history, {
        alt: h.history.imageAlt,
        sizes: '(min-width: 900px) 50vw, 92vw',
        className: 'split__image',
        ratio: '4 / 3',
      })}
    </div>
    <div class="split__text">
      ${heading({ eyebrow: h.history.eyebrow, title: h.history.title })}
      <div class="prose">${paragraphs(h.history.body.map(esc))}</div>
    </div>
  </div>
</section>

<section class="section section--ink" data-reveal>
  <div class="container">
    ${heading({ eyebrow: h.why.eyebrow, title: h.why.title, align: 'center' })}
    <ul class="cards cards--why">
      ${h.why.items
        .map(
          (item) => `
      <li class="card card--why">
        ${icon(item.icon, { className: 'icon card__icon' })}
        <p>${esc(item.text)}</p>
      </li>`,
        )
        .join('\n')}
    </ul>
  </div>
</section>

<section class="section split" data-reveal>
  <div class="container split__inner">
    <div class="split__media">
      ${picture(featured.seaAccess, {
        alt: h.seaAccess.imageAlt,
        sizes: '(min-width: 900px) 50vw, 92vw',
        className: 'split__image',
        ratio: '4 / 3',
      })}
    </div>
    <div class="split__text">
      ${heading({ eyebrow: h.seaAccess.eyebrow, title: h.seaAccess.title })}
      <div class="prose"><p class="lede">${esc(h.seaAccess.body)}</p></div>
      <p class="section__action">
        <a class="btn btn--outline" href="${esc(path('facilities', lang))}">${esc(t.ui.seeFacilities)}${icon('arrowRight', { className: 'icon icon--xs' })}</a>
      </p>
    </div>
  </div>
</section>

<section class="section section--sand" data-reveal>
  <div class="container">
    ${heading({
      eyebrow: h.galleryTeaser.eyebrow,
      title: h.galleryTeaser.title,
      body: h.galleryTeaser.body,
      align: 'center',
    })}
    ${photoGrid(t, featured.galleryStrip, {
      className: 'grid--3',
      group: 'teaser',
      sizes: '(min-width: 1100px) 32vw, (min-width: 700px) 48vw, 92vw',
    })}
    <p class="section__action">
      <a class="btn btn--outline" href="${esc(path('gallery', lang))}">${esc(t.ui.viewAllPhotos)}${icon('arrowRight', { className: 'icon icon--xs' })}</a>
    </p>
  </div>
</section>

<section class="section" data-reveal>
  <div class="container container--narrow">
    ${heading({ eyebrow: h.faq.eyebrow, title: h.faq.title, align: 'center' })}
    ${faqList(t)}
  </div>
</section>

${ctaBand(t)}
${lightbox(t)}`;
}
