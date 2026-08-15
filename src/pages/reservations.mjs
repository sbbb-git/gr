/**
 * Reservation request form — the old /reservations/ page.
 *
 * The old page ran a Divi contact form that POSTed back to WordPress. There is
 * no WordPress any more, so delivery is configurable (see site.form.provider),
 * but the *field contract* is preserved exactly: every field keeps the name the
 * Divi form used (`et_pb_contact_name1_0`, `et_pb_contact_arrival_0`, …) and
 * the two dates are still submitted as d-m-Y, which is how the old datepicker
 * was configured. Anything already filtering on those names keeps working.
 *
 * The visible date fields are native `<input type="date">` — better on a phone
 * and reachable by keyboard — and a hidden twin carries the d-m-Y value under
 * the legacy name.
 */

import { site, featured } from '../content/site.mjs';
import { esc } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { url } from '../lib/routing.mjs';
import { pageHero, heading, bookButton, faqSection } from '../components.mjs';
import { lodgingBusiness, website, webPage, breadcrumbs, faqPage } from '../lib/schema.mjs';

export const meta = (t) => ({
  title: t.reservations.title,
  description: t.reservations.description,
  heroImage: featured.reservationsBanner,
  shareImage: featured.accommodationBanner,
  bodyClass: 'page-reservations',
});

export const schema = (t, lang) => [
  lodgingBusiness(t, lang),
  website(t, lang),
  webPage(t, lang, 'reservations', {
    title: t.reservations.title,
    description: t.reservations.description,
    image: featured.accommodationBanner,
  }),
  breadcrumbs([
    { name: t.nav.home, url: url('home', lang) },
    { name: t.nav.reservations, url: url('reservations', lang) },
  ]),
  faqPage(t),
];

const F = site.form.fields;

function field({ id, name, label, type = 'text', required = true, autocomplete, inputmode }) {
  return `
<p class="field">
  <label class="field__label" for="${esc(id)}">${esc(label)}${required ? ' <span class="field__req" aria-hidden="true">*</span>' : ''}</label>
  <input class="field__input" type="${esc(type)}" id="${esc(id)}" name="${esc(name)}"
         ${required ? 'required aria-required="true"' : ''}
         ${autocomplete ? `autocomplete="${esc(autocomplete)}"` : ''}
         ${inputmode ? `inputmode="${esc(inputmode)}"` : ''}
         aria-describedby="${esc(id)}-error">
  <span class="field__error" id="${esc(id)}-error" data-error-for="${esc(id)}"></span>
</p>`;
}

function select({ id, name, label, options, placeholder }) {
  return `
<p class="field">
  <label class="field__label" for="${esc(id)}">${esc(label)} <span class="field__req" aria-hidden="true">*</span></label>
  <span class="field__selectwrap">
    <select class="field__input field__select" id="${esc(id)}" name="${esc(name)}" required
            aria-required="true" aria-describedby="${esc(id)}-error">
      ${placeholder ? `<option value="">${esc(placeholder)}</option>` : ''}
      ${options.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join('\n')}
    </select>
    ${icon('chevronDown', { className: 'icon icon--sm field__caret' })}
  </span>
  <span class="field__error" id="${esc(id)}-error" data-error-for="${esc(id)}"></span>
</p>`;
}

/** A native date input plus the hidden d-m-Y twin the old contract expects. */
function dateField({ id, name, label }) {
  return `
<p class="field">
  <label class="field__label" for="${esc(id)}">${esc(label)} <span class="field__req" aria-hidden="true">*</span></label>
  <input class="field__input" type="date" id="${esc(id)}" required aria-required="true"
         data-date-for="${esc(name)}" aria-describedby="${esc(id)}-error">
  <input type="hidden" name="${esc(name)}" value="">
  <span class="field__error" id="${esc(id)}-error" data-error-for="${esc(id)}"></span>
</p>`;
}

function form(t) {
  /** Validation copy, keyed by field id, handed to the script as JSON. */
  const messages = {
    'r-name': t.reservations.errors.name,
    'r-email': t.reservations.errors.email,
    'r-phone': t.reservations.errors.phone,
    'r-address': t.reservations.errors.address,
    'r-roomtype': t.reservations.errors.roomType,
    'r-adults': t.reservations.errors.roomType,
    'r-kids': t.reservations.errors.roomType,
    'r-arrival': t.reservations.errors.arrival,
    'r-departure': t.reservations.errors.departure,
    'r-message': t.reservations.errors.message,
    summary: t.reservations.errors.summary,
    generic: t.reservations.errors.summary,
  };

  return `
<form class="rform" data-reservation-form novalidate
      data-provider="${esc(site.form.provider)}"
      data-endpoint="${esc(site.form.endpoint)}"
      data-email="${esc(site.contact.email)}"
      data-subject="${esc(t.reservations.mailSubject)}"
      data-date-format="${esc(site.form.dateFormat)}"
      data-messages="${esc(JSON.stringify(messages))}"
      ${site.form.provider === 'netlify' ? 'name="reservations" method="POST" data-netlify="true"' : ''}>

  <div class="rform__summary" data-form-summary role="alert" hidden>
    ${icon('close', { className: 'icon icon--sm' })}<span data-form-summary-text></span>
  </div>

  <div class="rform__grid">
    ${field({ id: 'r-name', name: F.name, label: t.reservations.fields.name, autocomplete: 'name' })}
    ${field({ id: 'r-email', name: F.email, label: t.reservations.fields.email, type: 'email', autocomplete: 'email' })}
    ${field({ id: 'r-phone', name: F.phone, label: t.reservations.fields.phone, type: 'tel', autocomplete: 'tel' })}
    ${field({ id: 'r-address', name: F.address, label: t.reservations.fields.address, autocomplete: 'street-address' })}
    ${dateField({ id: 'r-arrival', name: F.arrival, label: t.reservations.fields.arrival })}
    ${dateField({ id: 'r-departure', name: F.departure, label: t.reservations.fields.departure })}
    ${select({ id: 'r-adults', name: F.adults, label: t.reservations.fields.adults, options: site.form.adults })}
    ${select({ id: 'r-kids', name: F.kids, label: t.reservations.fields.kids, options: site.form.kids })}
    ${select({
      id: 'r-roomtype',
      name: F.roomType,
      label: t.reservations.fields.roomType,
      options: t.reservations.roomTypes,
      placeholder: t.reservations.roomTypePlaceholder,
    })}
  </div>

  <p class="field field--wide">
    <label class="field__label" for="r-message">${esc(t.reservations.fields.message)} <span class="field__req" aria-hidden="true">*</span></label>
    <textarea class="field__input field__textarea" id="r-message" name="${esc(F.message)}" rows="5"
              required aria-required="true" aria-describedby="r-message-error"></textarea>
    <span class="field__error" id="r-message-error" data-error-for="r-message"></span>
  </p>

  <p class="rform__trap" aria-hidden="true">
    <label for="r-company">Company</label>
    <input type="text" id="r-company" name="company" tabindex="-1" autocomplete="off">
  </p>

  <p class="rform__actions">
    <button type="submit" class="btn btn--primary btn--lg" data-submit
            data-label-sending="${esc(t.reservations.sending)}"
            data-label-submit="${esc(t.reservations.submit)}">${esc(t.reservations.submit)}</button>
  </p>

  <p class="rform__done" data-form-done role="status" hidden>
    ${esc(t.reservations.success)}
    <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>
  </p>
</form>`;
}

export function render(t, lang) {
  return [
    pageHero({
      t,
      lang,
      image: featured.reservationsBanner,
      title: t.reservations.heroTitle,
      subtitle: t.reservations.heroSubtitle,
    }),
    `
<section class="section" aria-labelledby="direct-title">
  <div class="container container--narrow">
    <div class="direct">
      ${icon('calendar', { className: 'icon direct__icon' })}
      <div class="direct__text">
        <h2 class="direct__title" id="direct-title">${esc(t.reservations.directTitle)}</h2>
        <p class="direct__body">${esc(t.reservations.directBody)}</p>
      </div>
      ${bookButton(t, { className: 'btn btn--primary', label: t.reservations.directCta })}
    </div>

    ${heading({ title: t.reservations.formTitle, body: t.reservations.formIntro, id: 'form-title' })}
    ${form(t)}

    <ul class="directline">
      <li><a href="tel:${esc(site.contact.phoneHref)}">${icon('phone', { className: 'icon icon--sm' })}${esc(site.contact.phone)}</a></li>
      <li><a href="tel:${esc(site.contact.mobileHref)}">${icon('phone', { className: 'icon icon--sm' })}${esc(site.contact.mobile)}</a></li>
      <li><a href="mailto:${esc(site.contact.email)}">${icon('mail', { className: 'icon icon--sm' })}${esc(site.contact.email)}</a></li>
    </ul>
  </div>
</section>`,
    faqSection(t),
  ].join('\n');
}
