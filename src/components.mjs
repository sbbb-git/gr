/**
 * Reusable page fragments shared by more than one template.
 */

import { site } from './content/site.mjs';
import { esc, join } from './lib/html.mjs';
import { picture } from './lib/image.mjs';
import { icon } from './lib/icons.mjs';
import { path } from './lib/routing.mjs';

/** A short eyebrow + heading pair used to open most sections. */
export function heading({ eyebrow, title, body, level = 2, align = '', index, wide = false }) {
  const H = `h${level}`;
  const classes = [
    'sectionhead',
    align && `sectionhead--${align}`,
    wide && 'sectionhead--wide',
  ]
    .filter(Boolean)
    .join(' ');

  return `
<div class="${classes}">
  ${index ? `<span class="sectionhead__index" aria-hidden="true">${esc(index)}</span>` : ''}
  ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
  <${H} class="sectionhead__title">${esc(title)}</${H}>
  ${body ? `<p class="sectionhead__body">${esc(body)}</p>` : ''}
</div>`;
}

/**
 * A heading with a note set against it, on one line at desktop width. Used
 * where a section needs a second thought without a second paragraph.
 */
export function headRow(headingHtml, aside) {
  return `
<div class="headrow" data-reveal>
  ${headingHtml}
  ${aside ? `<p class="headrow__aside">${esc(aside)}</p>` : ''}
</div>`;
}

/**
 * A horizontal run of photographs, each opening the lightbox. Large cards on a
 * scroll-snapping track: four rooms in one screen instead of four screens.
 */
export function rail(t, items, { group = 'rail', label, hint } = {}) {
  return `
<div class="rail" data-rail>
  <ul class="rail__track" data-rail-track data-lightbox-group="${esc(group)}"${label ? ` aria-label="${esc(label)}"` : ''}>
    ${items
      .map(
        (item, index) => `
    <li class="rail__item">
      <button type="button" class="railcard" data-lightbox="${esc(group)}" data-index="${index}"
              aria-label="${esc(t.gallery.openLightbox)}: ${esc(t.alt[item.slug] ?? site.name)}">
        ${picture(item.slug, {
          alt: t.alt[item.slug] ?? site.name,
          sizes: '(min-width: 62rem) 27rem, 78vw',
          className: 'railcard__image',
          ratio: '4 / 5',
        })}
        <span class="railcard__veil"></span>
        <span class="railcard__body">
          <span class="railcard__index">${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}</span>
          <span class="railcard__cue">${icon('arrowRight', { className: 'icon icon--sm' })}</span>
        </span>
      </button>
    </li>`,
      )
      .join('\n')}
  </ul>
  ${hint ? `<p class="rail__hint">${icon('arrowRight', { className: 'icon icon--xs' })}${esc(hint)}</p>` : ''}
</div>`;
}

/**
 * Full-bleed photograph with one sentence over it. The image is nudged as the
 * band crosses the viewport, which is the only parallax on the site.
 */
export function pullQuote({ image, alt, text, cite }) {
  return `
<section class="pullquote" data-parallax>
  ${picture(image, {
    alt: alt ?? '',
    sizes: '100vw',
    className: 'pullquote__image',
  })}
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
export function pageHero({ t, lang, route, image, title, subtitle }) {
  const crumbs = [
    { label: t.nav.home, href: path('home', lang) },
    { label: title, href: null },
  ];

  return `
<section class="pagehero">
  ${picture(image, {
    alt: '',
    sizes: '100vw',
    priority: true,
    className: 'pagehero__image',
    ratio: '21 / 9',
  })}
  <div class="pagehero__overlay"></div>
  <div class="pagehero__inner container">
    <nav class="crumbs" aria-label="${esc(t.ui.breadcrumb)}">
      <ol>
        ${crumbs
          .map((c) =>
            c.href
              ? `<li><a href="${esc(c.href)}">${esc(c.label)}</a></li>`
              : `<li aria-current="page">${esc(c.label)}</li>`,
          )
          .join('\n')}
      </ol>
    </nav>
    <h1 class="pagehero__title">${esc(title)}</h1>
    ${subtitle ? `<p class="pagehero__subtitle">${esc(subtitle)}</p>` : ''}
  </div>
</section>`;
}

/**
 * Availability form. Field names, the target and the date format are exactly
 * those the existing booking engine expects, so the handover is lossless.
 */
export function bookingBar(t, { variant = 'floating' } = {}) {
  const options = (n, from = 1, selected = null) =>
    Array.from({ length: n - from + 1 }, (_, i) => from + i)
      .map((v) => `<option value="${v}"${v === selected ? ' selected' : ''}>${v}</option>`)
      .join('');

  return `
<section class="bookbar bookbar--${esc(variant)}" aria-labelledby="bookbar-title">
  <form class="bookbar__form" data-booking-form method="GET"
        action="${esc(site.booking.action)}" target="_blank" rel="noopener">
    <input type="hidden" name="lang" value="${esc(t.bookingLang)}">
    <input type="hidden" name="fromd" value="" data-booking-fromd>
    <input type="hidden" name="nights" value="1" data-booking-nights>
    <input type="hidden" name="checkinWeb" value="" data-booking-checkin-web>
    <input type="hidden" name="checkoutWeb" value="" data-booking-checkout-web>

    <h2 class="bookbar__title" id="bookbar-title">${icon('calendar', { className: 'icon icon--sm' })}${esc(t.booking.title)}</h2>

    <div class="bookbar__fields">
      <p class="bookbar__field bookbar__field--date">
        <label for="bb-checkin">${esc(t.booking.checkin)}</label>
        <input type="date" id="bb-checkin" data-booking-checkin required>
      </p>
      <p class="bookbar__field bookbar__field--date">
        <label for="bb-checkout">${esc(t.booking.checkout)}</label>
        <input type="date" id="bb-checkout" data-booking-checkout required>
      </p>
      <p class="bookbar__field">
        <label for="bb-rooms">${esc(t.booking.rooms)}</label>
        <select id="bb-rooms" name="rooms">${options(site.booking.maxRooms)}</select>
      </p>
      <p class="bookbar__field">
        <label for="bb-adults">${esc(t.booking.adults)}</label>
        <select id="bb-adults" name="adults">${options(site.booking.maxAdults, 1, 2)}</select>
      </p>
      <p class="bookbar__field">
        <label for="bb-children">${esc(t.booking.children)}</label>
        <select id="bb-children" name="children">${options(site.booking.maxChildren, 0)}</select>
      </p>
      <p class="bookbar__field">
        <label for="bb-infants">${esc(t.booking.infants)}</label>
        <select id="bb-infants" name="infants">${options(site.booking.maxInfants, 0)}</select>
      </p>
      <p class="bookbar__field bookbar__field--submit">
        <button type="submit" class="btn btn--primary btn--block">${esc(t.booking.submit)}</button>
      </p>
    </div>
    <p class="bookbar__note">${icon('check', { className: 'icon icon--xs' })}${esc(t.booking.note)}</p>
  </form>
</section>`;
}

/** Accordion of questions; the matching FAQPage JSON-LD is added by the page. */
export function faqList(t) {
  return `
<div class="faq">
  ${t.faq
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

/**
 * Photo grid wired to the lightbox. `items` is a list of media slugs; the
 * lightbox reads captions straight from each image's alt text.
 */
export function photoGrid(t, items, { className = '', sizes, group = 'gallery' } = {}) {
  const resolvedSizes =
    sizes || '(min-width: 1100px) 33vw, (min-width: 700px) 50vw, 100vw';

  return `
<ul class="grid ${esc(className)}" data-lightbox-group="${esc(group)}">
  ${items
    .map(
      (slug, index) => `
  <li class="grid__item">
    <button type="button" class="tile" data-lightbox="${esc(group)}" data-index="${index}"
            aria-label="${esc(t.gallery.openLightbox)}: ${esc(t.alt[slug] ?? site.name)}">
      ${picture(slug, {
        alt: t.alt[slug] ?? site.name,
        sizes: resolvedSizes,
        className: 'tile__image',
        ratio: '4 / 3',
      })}
      <span class="tile__zoom">${icon('expand', { className: 'icon icon--sm' })}</span>
    </button>
  </li>`,
    )
    .join('\n')}
</ul>`;
}

/** Empty lightbox shell; contents are cloned from the grid at runtime. */
export function lightbox(t) {
  return `
<div class="lightbox" data-lightbox-root hidden aria-hidden="true">
  <div class="lightbox__backdrop" data-lightbox-close></div>
  <div class="lightbox__dialog" role="dialog" aria-modal="true" aria-label="${esc(t.gallery.heroTitle)}">
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

/** Address, phone, email and directions, as a set of cards. */
export function contactCards(t) {
  return `
<ul class="cards cards--contact">
  <li class="card">
    ${icon('pin', { className: 'icon card__icon' })}
    <h3 class="card__title">${esc(t.contact.addressTitle)}</h3>
    <address class="card__body">${esc(t.address.line1)}<br>${esc(t.address.line2)}<br>${esc(t.address.line3)}</address>
    <a class="card__link" href="${esc(site.links.maps)}" target="_blank" rel="noopener noreferrer">
      ${esc(t.ui.getDirections)}${icon('arrowRight', { className: 'icon icon--xs' })}
    </a>
  </li>
  <li class="card">
    ${icon('phone', { className: 'icon card__icon' })}
    <h3 class="card__title">${esc(t.contact.detailsTitle)}</h3>
    <p class="card__body">
      <a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a><br>
      <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>
    </p>
    <p class="card__meta">${esc(t.footer.licenseLabel)} ${esc(site.eotLicense)}</p>
  </li>
  <li class="card">
    ${icon('star', { className: 'icon card__icon' })}
    <h3 class="card__title">${esc(t.contact.paymentTitle)}</h3>
    <ul class="card__body card__list">
      ${t.contact.payments.map((p) => `<li>${esc(p)}</li>`).join('\n')}
    </ul>
  </li>
</ul>`;
}

/**
 * Google Maps embed behind an explicit opt-in: nothing is requested from Google
 * until the visitor asks for it, which is why the site needs no consent banner.
 */
export function mapEmbed(t) {
  const { lat, lng } = site.contact.geo;
  const src = `https://www.google.com/maps?q=${lat},${lng}&hl=${site.defaultLanguage}&z=15&output=embed`;

  return `
<div class="mapbox" data-map data-map-src="${esc(src)}">
  <div class="mapbox__consent">
    ${icon('pin', { className: 'icon mapbox__icon' })}
    <h3 class="mapbox__title">${esc(t.location.mapConsent.title)}</h3>
    <p class="mapbox__body">${esc(t.location.mapConsent.body)}</p>
    <button type="button" class="btn btn--primary" data-map-load>${esc(t.location.mapConsent.button)}</button>
    <a class="mapbox__alt" href="${esc(site.links.maps)}" target="_blank" rel="noopener noreferrer">
      ${esc(t.location.mapConsent.alternative)}${icon('external', { className: 'icon icon--xs' })}
    </a>
  </div>
</div>`;
}

/** Closing call-to-action band used at the bottom of most pages. */
export function ctaBand(t) {
  return `
<section class="cta">
  <div class="container cta__inner">
    <div>
      <h2 class="cta__title">${esc(t.home.cta.title)}</h2>
      <p class="cta__body">${esc(t.home.cta.body)}</p>
    </div>
    <div class="cta__actions">
      <a class="btn btn--primary" href="${esc(site.links.booking)}" target="_blank" rel="noopener noreferrer">${esc(t.nav.book)}</a>
      <a class="btn btn--ghost" href="tel:${esc(site.contact.phoneHref)}">${icon('phone', { className: 'icon icon--sm' })}${esc(site.contact.phone)}</a>
    </div>
  </div>
</section>`;
}

/** Card linking out to the SkylineWebcams live stream of Kamares. */
export function liveCameraCard(t) {
  return `
<a class="livecam" href="${esc(site.links.liveCamera)}" target="_blank" rel="noopener noreferrer">
  <span class="livecam__badge">${icon('camera', { className: 'icon icon--sm' })}LIVE</span>
  <span class="livecam__text">
    <span class="livecam__title">${esc(t.location.cameraTitle)}</span>
    <span class="livecam__body">${esc(t.location.cameraBody)}</span>
  </span>
  ${icon('arrowRight', { className: 'icon livecam__arrow' })}
</a>`;
}

export { join };
