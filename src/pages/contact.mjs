import { site, featured } from '../content/site.mjs';
import { esc } from '../lib/html.mjs';
import { icon } from '../lib/icons.mjs';
import { url } from '../lib/routing.mjs';
import { pageHero, heading, contactCards, mapEmbed } from '../components.mjs';
import { lodgingBusiness, website, webPage, breadcrumbs } from '../lib/schema.mjs';

export const meta = (t) => ({
  title: t.contact.title,
  description: t.contact.description,
  heroImage: featured.contactBanner,
  shareImage: featured.contactBanner,
  bodyClass: 'page-contact',
});

export const schema = (t, lang) => [
  lodgingBusiness(t, lang),
  website(t, lang),
  webPage(t, lang, 'contact', {
    title: t.contact.title,
    description: t.contact.description,
    image: featured.contactBanner,
  }),
  {
    '@type': 'ContactPage',
    '@id': `${url('contact', lang)}#contactpage`,
    url: url('contact', lang),
    inLanguage: t.htmlLang,
  },
  breadcrumbs([
    { name: t.nav.home, url: url('home', lang) },
    { name: t.contact.heroTitle, url: url('contact', lang) },
  ]),
];

export function render(t, lang) {
  const c = t.contact;

  // The form works without JavaScript when a real endpoint is configured; with
  // the default 'mailto' provider the script composes the message instead.
  const formAttrs =
    site.form.provider === 'netlify'
      ? 'method="POST" data-netlify="true" netlify-honeypot="company" name="contact"'
      : site.form.provider === 'endpoint'
        ? `method="POST" action="${esc(site.form.endpoint)}"`
        : `method="POST" action="mailto:${esc(site.contact.email)}" enctype="text/plain"`;

  return `
${pageHero({
  t,
  lang,
  route: 'contact',
  image: featured.contactBanner,
  title: c.heroTitle,
  subtitle: c.heroSubtitle,
})}

<section class="section">
  <div class="container contact">
    <div class="contact__form-col">
      ${heading({ title: c.formTitle, level: 2 })}
      <p class="form__required-hint">${esc(c.requiredHint)}</p>

      <form class="form" ${formAttrs} data-contact-form
            data-provider="${esc(site.form.provider)}"
            data-endpoint="${esc(site.form.endpoint)}"
            data-mailto="${esc(site.contact.email)}"
            data-subject="${esc(`${site.name} — ${c.formTitle}`)}"
            data-messages="${esc(
              JSON.stringify({
                ...c.validation,
                success: c.success,
                error: c.error,
                mailtoNotice: c.mailtoNotice,
                sending: c.fields.sending,
              }),
            )}"
            novalidate>
        ${site.form.provider === 'netlify' ? '<input type="hidden" name="form-name" value="contact">' : ''}
        <p class="u-hidden" aria-hidden="true">
          <label>Company <input type="text" name="company" tabindex="-1" autocomplete="off"></label>
        </p>

        <fieldset class="form__group">
          <legend class="form__legend">${esc(c.fields.name)} <span class="form__req" aria-hidden="true">*</span></legend>
          <div class="form__row">
            <p class="field">
              <label for="first-name">${esc(c.fields.firstName)}</label>
              <input type="text" id="first-name" name="firstName" autocomplete="given-name" required
                     aria-describedby="err-first-name">
              <span class="field__error" id="err-first-name" data-error-for="firstName"></span>
            </p>
            <p class="field">
              <label for="last-name">${esc(c.fields.lastName)}</label>
              <input type="text" id="last-name" name="lastName" autocomplete="family-name" required
                     aria-describedby="err-last-name">
              <span class="field__error" id="err-last-name" data-error-for="lastName"></span>
            </p>
          </div>
        </fieldset>

        <div class="form__row">
          <p class="field">
            <label for="email">${esc(c.fields.email)} <span class="form__req" aria-hidden="true">*</span></label>
            <input type="email" id="email" name="email" autocomplete="email" required
                   aria-describedby="err-email">
            <span class="field__error" id="err-email" data-error-for="email"></span>
          </p>
          <p class="field">
            <label for="phone">${esc(c.fields.phone)} <span class="form__req" aria-hidden="true">*</span></label>
            <input type="tel" id="phone" name="phone" autocomplete="tel" required
                   aria-describedby="err-phone">
            <span class="field__error" id="err-phone" data-error-for="phone"></span>
          </p>
        </div>

        <p class="field">
          <label for="comments">${esc(c.fields.comments)}</label>
          <textarea id="comments" name="comments" rows="5"></textarea>
        </p>

        <p class="form__actions">
          <button type="submit" class="btn btn--primary btn--lg">${esc(c.fields.submit)}</button>
        </p>

        <p class="form__status" data-form-status role="status" aria-live="polite"></p>
      </form>
    </div>

    <aside class="contact__aside">
      <div class="panel">
        <h2 class="panel__title">${esc(c.detailsTitle)}</h2>
        <ul class="panel__list">
          <li>
            ${icon('phone', { className: 'icon icon--sm' })}
            <a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a>
          </li>
          <li>
            ${icon('mail', { className: 'icon icon--sm' })}
            <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>
          </li>
          <li>
            ${icon('pin', { className: 'icon icon--sm' })}
            <a href="${esc(site.links.maps)}" target="_blank" rel="noopener noreferrer">
              ${esc(t.address.short)}
            </a>
          </li>
        </ul>
        <p class="panel__meta">${esc(t.footer.licenseLabel)} ${esc(site.eotLicense)}</p>
        <a class="btn btn--primary btn--block" href="${esc(site.links.booking)}" target="_blank" rel="noopener noreferrer">${esc(t.nav.book)}</a>
      </div>

      <div class="panel">
        <h2 class="panel__title">${esc(c.followTitle)}</h2>
        <ul class="social social--dark">
          <li><a href="${esc(site.links.instagram)}" target="_blank" rel="noopener noreferrer nofollow" aria-label="Instagram">${icon('instagram')}</a></li>
          <li><a href="${esc(site.links.facebook)}" target="_blank" rel="noopener noreferrer nofollow" aria-label="Facebook">${icon('facebook')}</a></li>
        </ul>
      </div>
    </aside>
  </div>
</section>

<section class="section section--sand" data-reveal>
  <div class="container">
    ${heading({ title: t.location.mapTitle, align: 'center' })}
    ${mapEmbed(t)}
    ${contactCards(t)}
  </div>
</section>`;
}
