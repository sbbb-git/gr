import { site, featured, galleries } from '../content/site.mjs';
import { esc, paragraphs } from '../lib/html.mjs';
import { picture } from '../lib/image.mjs';
import { icon } from '../lib/icons.mjs';
import { path } from '../lib/routing.mjs';
import {
  heading,
  headRow,
  bookingBar,
  faqList,
  photoGrid,
  rail,
  pullQuote,
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

  const studioRail = featured.studios.map((slug, i) => ({
    slug,
    title: t.alt[slug] ?? site.name,
    index: i,
  }));

  return `
<section class="hero">
  ${picture(featured.hero, {
    alt: t.alt[featured.hero],
    sizes: '100vw',
    priority: true,
    className: 'hero__image',
  })}
  <!-- The drone film the previous site played behind this section. The frame
       is injected by script once the page has loaded, so it never delays the
       first paint, never loads at all under prefers-reduced-motion, and is
       only revealed once the player reports that it is actually playing. -->
  <div class="hero__video" data-hero-video
       data-video-id="${esc(site.heroVideo.id)}"
       data-video-title="${esc(site.heroVideo.title)}"></div>
  <div class="hero__scrim"></div>

  <div class="hero__inner container" data-reveal-stagger>
    <p class="hero__eyebrow">${esc(h.hero.eyebrow)}</p>
    <h1 class="hero__title">${esc(h.hero.title)}</h1>
    <p class="hero__subtitle">${esc(h.hero.subtitle)}</p>
    <div class="hero__actions">
      <a class="btn btn--primary btn--lg" href="${esc(site.links.booking)}" target="_blank" rel="noopener noreferrer">${esc(h.hero.primaryCta)}</a>
      <a class="btn btn--outline btn--lg" href="${esc(path('studios', lang))}">${esc(h.hero.secondaryCta)}</a>
    </div>
  </div>

  <div class="hero__foot">
    <div class="container hero__foot-inner">
      <ul class="hero__meta">
        <li>${icon('pin', { className: 'icon' })}${esc(t.address.line1)}</li>
        <li>${icon('phone', { className: 'icon' })}<a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a></li>
      </ul>
      <button type="button" class="hero__videotoggle" data-video-toggle hidden
              aria-pressed="false"
              data-pause-label="${esc(t.ui.pauseVideo)}"
              data-play-label="${esc(t.ui.playVideo)}">
        ${icon('pause', { className: 'icon icon--sm hero__videoicon hero__videoicon--pause' })}
        ${icon('play', { className: 'icon icon--sm hero__videoicon hero__videoicon--play' })}
        <span class="hero__videolabel" data-video-label>${esc(t.ui.pauseVideo)}</span>
      </button>
    </div>
  </div>
</section>

<div class="container bookbar__slot">
  ${bookingBar(t)}
</div>

<section class="section section--tight" id="welcome">
  <div class="container">
    <ul class="highlights" data-reveal-stagger>
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
    <div class="split__media split__media--arch" data-reveal-media>
      ${picture(featured.welcome, {
        alt: h.welcome.imageAlt,
        sizes: '(min-width: 56rem) 46vw, 92vw',
        className: 'split__image',
        ratio: '4 / 5',
      })}
    </div>
    <div class="split__text">
      ${heading({ index: '01', eyebrow: h.welcome.eyebrow, title: h.welcome.title })}
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

<section class="section section--sand">
  <div class="container">
    ${headRow(
      heading({ index: '02', eyebrow: h.studios.eyebrow, title: h.studios.title }),
      h.studios.body[0],
    )}
    ${rail(t, studioRail, { group: 'studios', label: h.studios.title, hint: t.ui.dragToExplore })}
    <p class="section__action">
      <a class="link" href="${esc(path('studios', lang))}">${esc(h.studios.cta)}${icon('arrowRight', { className: 'icon icon--xs' })}</a>
    </p>
  </div>
</section>

${pullQuote({
  image: featured.seaAccess,
  alt: h.seaAccess.imageAlt,
  text: h.pullquote.text,
  cite: h.pullquote.cite,
})}

<section class="section split split--reverse" data-reveal>
  <div class="container split__inner">
    <div class="split__media" data-reveal-media>
      ${picture(featured.history, {
        alt: h.history.imageAlt,
        sizes: '(min-width: 56rem) 48vw, 92vw',
        className: 'split__image',
        ratio: '4 / 3',
      })}
    </div>
    <div class="split__text">
      ${heading({ index: '03', eyebrow: h.history.eyebrow, title: h.history.title })}
      <div class="prose prose--lead">${paragraphs(h.history.body.map(esc))}</div>
    </div>
  </div>
</section>

<section class="section section--ink" data-reveal>
  <div class="container">
    ${heading({ index: '04', eyebrow: h.why.eyebrow, title: h.why.title })}
    <ol class="reasons" data-reveal-stagger>
      ${h.why.items
        .map(
          (item, i) => `
      <li class="reason">
        <span class="reason__num">${String(i + 1).padStart(2, '0')}</span>
        <span class="reason__text">${esc(item.text)}</span>
      </li>`,
        )
        .join('\n')}
    </ol>
  </div>
</section>

<section class="section split" data-reveal>
  <div class="container split__inner">
    <div class="split__media" data-reveal-media>
      ${picture(featured.seaAccess, {
        alt: h.seaAccess.imageAlt,
        sizes: '(min-width: 56rem) 48vw, 92vw',
        className: 'split__image',
        ratio: '4 / 3',
      })}
    </div>
    <div class="split__text">
      ${heading({ index: '05', eyebrow: h.seaAccess.eyebrow, title: h.seaAccess.title })}
      <div class="prose"><p class="lede">${esc(h.seaAccess.body)}</p></div>
      <p class="section__action">
        <a class="link" href="${esc(path('facilities', lang))}">${esc(t.ui.seeFacilities)}${icon('arrowRight', { className: 'icon icon--xs' })}</a>
      </p>
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="container">
    ${headRow(
      heading({ index: '06', eyebrow: h.galleryTeaser.eyebrow, title: h.galleryTeaser.title }),
      h.galleryTeaser.body,
    )}
    ${photoGrid(t, featured.galleryStrip, {
      className: 'grid--mosaic',
      group: 'teaser',
      sizes: '(min-width: 56rem) 46vw, 92vw',
    })}
    <p class="section__action">
      <a class="link" href="${esc(path('gallery', lang))}">${esc(t.ui.viewAllPhotos)}${icon('arrowRight', { className: 'icon icon--xs' })}</a>
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
