/**
 * Reusable page fragments shared by more than one template.
 */

import { site } from './content/site.mjs';
import { esc, join } from './lib/html.mjs';
import { picture } from './lib/image.mjs';
import { icon } from './lib/icons.mjs';
import { path } from './lib/routing.mjs';

/** A short eyebrow + heading pair used to open most sections. */
export function heading({ eyebrow, title, body, level = 2, align = '', id = '', index }) {
  const H = `h${level}`;
  return `
<div class="sectionhead${align ? ` sectionhead--${align}` : ''}">
  ${index ? `<span class="sectionhead__index" aria-hidden="true">${esc(index)}</span>` : ''}
  ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
  <${H} class="sectionhead__title"${id ? ` id="${esc(id)}"` : ''}>${esc(title)}</${H}>
  ${body ? `<p class="sectionhead__body">${esc(body)}</p>` : ''}
</div>`;
}

/**
 * Full-bleed photograph with one sentence over it. The image is nudged as the
 * band crosses the viewport, which is the only parallax on the site.
 */
export function pullQuote({ image, alt, text, cite }) {
  return `
<section class="pullquote" data-parallax>
  ${picture(image, { alt: alt ?? '', sizes: '100vw', className: 'pullquote__image' })}
  <div class="pullquote__scrim"></div>
  <div class="container pullquote__inner" data-reveal>
    <blockquote>
      <p class="pullquote__text">${esc(text)}</p>
      ${cite ? `<cite class="pullquote__cite">${esc(cite)}</cite>` : ''}
    </blockquote>
  </div>
</section>`;
}

/** Inner-page banner: a wide photo with the page title over it. */
export function pageHero({ t, lang, image, title, subtitle }) {
  return `
<section class="pagehero">
  ${picture(image, {
    alt: '',
    sizes: '100vw',
    priority: true,
    className: 'pagehero__image',
    ratio: '21 / 9',
  })}
  <div class="pagehero__scrim"></div>
  <div class="pagehero__inner container">
    <nav class="crumbs" aria-label="${esc(t.ui.breadcrumb)}">
      <ol>
        <li><a href="${esc(path('home', lang))}">${esc(t.nav.home)}</a></li>
        <li aria-current="page">${esc(title)}</li>
      </ol>
    </nav>
    <h1 class="pagehero__title">${esc(title)}</h1>
    ${subtitle ? `<p class="pagehero__subtitle">${esc(subtitle)}</p>` : ''}
  </div>
</section>`;
}

/** The primary "Online Booking" link, pointing at the booking engine verbatim. */
export function bookButton(t, { className = 'btn btn--primary', label } = {}) {
  return (
    `<a class="${esc(className)}" href="${esc(site.booking.url)}" target="_blank" ` +
    `rel="noopener noreferrer">${esc(label ?? t.nav.book)}` +
    `<span class="u-visually-hidden"> (${esc(t.ui.opensNewTab)})</span>` +
    `${icon('external', { className: 'icon icon--xs' })}</a>`
  );
}

/** Accordion of questions; the matching FAQPage JSON-LD is added by the page. */
export function faqList(t) {
  return `
<div class="faq">
  ${t.faq.items
    .map(
      (item, i) => `
  <details class="faq__item"${i === 0 ? ' open' : ''}>
    <summary class="faq__q">
      <span>${esc(item.q)}</span>
      ${icon('chevronDown', { className: 'icon faq__caret' })}
    </summary>
    <div class="faq__a"><p>${esc(item.a)}</p></div>
  </details>`,
    )
    .join('\n')}
</div>`;
}

export function faqSection(t) {
  return `
<section class="section section--tint" aria-labelledby="faq-title">
  <div class="container container--narrow">
    ${heading({ title: t.faq.title, body: t.faq.intro, align: 'center', id: 'faq-title' })}
    ${faqList(t)}
  </div>
</section>`;
}

/**
 * Photo grid wired to the lightbox. `items` is a list of media slugs; the
 * lightbox reads its captions straight from each image's alt text.
 */
export function photoGrid(t, items, { className = '', sizes, group = 'gallery' } = {}) {
  const resolvedSizes = sizes || '(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw';

  return `
<ul class="grid ${esc(className)}" data-lightbox-group="${esc(group)}">
  ${items
    .map(
      (slug, index) => `
  <li class="grid__item">
    <button type="button" class="tile" data-lightbox="${esc(group)}" data-index="${index}"
            aria-label="${esc(t.ui.enlarge)}: ${esc(t.alt[slug] ?? site.name)}">
      ${picture(slug, {
        alt: t.alt[slug] ?? site.name,
        sizes: resolvedSizes,
        className: 'tile__image',
        ratio: '4 / 3',
      })}
      <span class="tile__zoom" aria-hidden="true">${icon('expand', { className: 'icon icon--sm' })}</span>
    </button>
  </li>`,
    )
    .join('\n')}
</ul>`;
}

/** Empty lightbox shell; contents are cloned from the grid at runtime. */
export function lightbox(t) {
  return `
<div class="lightbox" data-lightbox-root hidden>
  <div class="lightbox__backdrop" data-lightbox-close></div>
  <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-label="${esc(t.ui.image)}">
    <figure class="lightbox__figure">
      <img class="lightbox__image" data-lightbox-image src="" alt="">
      <figcaption class="lightbox__caption" data-lightbox-caption></figcaption>
    </figure>
    <p class="lightbox__counter" data-lightbox-counter></p>
    <button type="button" class="lightbox__btn lightbox__btn--prev" data-lightbox-prev aria-label="${esc(t.ui.previous)}">${icon('chevronLeft')}</button>
    <button type="button" class="lightbox__btn lightbox__btn--next" data-lightbox-next aria-label="${esc(t.ui.next)}">${icon('chevronRight')}</button>
    <button type="button" class="lightbox__btn lightbox__btn--close" data-lightbox-close aria-label="${esc(t.ui.close)}">${icon('close')}</button>
  </div>
</div>`;
}

/**
 * Google's map behind an explicit opt-in: nothing is requested from Google
 * until the visitor asks for it, which is why the site needs no consent banner.
 * The embed is the owner's own My Maps pin, as on the old location page.
 */
export function mapEmbed(t) {
  return `
<div class="mapbox" data-map data-map-src="${esc(site.links.mapEmbed)}"
     data-map-title="${esc(t.location.map.frameTitle)}">
  <div class="mapbox__consent">
    ${icon('pin', { className: 'icon mapbox__icon' })}
    <p class="mapbox__body">${esc(t.location.map.body)}</p>
    <button type="button" class="btn btn--primary" data-map-load>${esc(t.location.map.load)}</button>
    <a class="mapbox__alt" href="${esc(site.links.mapView)}" target="_blank" rel="noopener noreferrer">
      ${esc(t.location.map.openExternal)}${icon('external', { className: 'icon icon--xs' })}
    </a>
  </div>
</div>`;
}

/** Closing call-to-action band used at the bottom of most pages. */
export function ctaBand(t) {
  return `
<section class="cta" aria-labelledby="cta-title">
  <div class="container cta__inner">
    <div>
      <h2 class="cta__title" id="cta-title">${esc(t.home.cta.title)}</h2>
      <p class="cta__body">${esc(t.home.cta.body)}</p>
    </div>
    <div class="cta__actions">
      ${bookButton(t, { className: 'btn btn--invert' })}
      <a class="btn btn--ghost-invert" href="tel:${esc(site.contact.phoneHref)}">
        ${icon('phone', { className: 'icon icon--sm' })}${esc(site.contact.phone)}
      </a>
    </div>
  </div>
</section>`;
}

/** The two direct-booking offers, verbatim from the old home page. */
export function offerCards(t) {
  return `
<ul class="offers">
  ${t.home.offers.items
    .map(
      (offer, i) => `
  <li class="offer">
    <span class="offer__index" aria-hidden="true">${i + 1}</span>
    <h3 class="offer__title">${esc(offer.title)}</h3>
    <p class="offer__body">${esc(offer.body)}</p>
  </li>`,
    )
    .join('\n')}
</ul>`;
}

export { join };
