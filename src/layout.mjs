/**
 * The HTML shell: <head> metadata, header, footer and script tags.
 *
 * Everything search engines and social networks read is assembled here, so a
 * page template only has to supply its own body and any extra structured data.
 */

import { site } from './content/site.mjs';
import { path, url, alternates } from './lib/routing.mjs';
import { esc, join, jsonLd } from './lib/html.mjs';
import { preload, media, imageUrl } from './lib/image.mjs';
import { icon } from './lib/icons.mjs';

const NAV_KEYS = ['home', 'accommodation', 'location', 'gallery', 'reservations'];

/**
 * The brand mark: a scallop shell and the name. The old site used a 250×55 PNG
 * of the same shell, too small for a modern screen — drawn as vector here so it
 * stays sharp at any size and inherits the current colour.
 */
function brand(t, lang, { className = 'brand' } = {}) {
  return `
<a class="${esc(className)}" href="${esc(path('home', lang))}">
  ${icon('shell', { className: 'brand__mark' })}
  <span class="brand__text">
    <span class="brand__name">${esc(site.name)}</span>
    <span class="brand__place">Paros · Greece</span>
  </span>
</a>`;
}

function navLinks(t, lang, current, { idPrefix }) {
  const items = NAV_KEYS.map((key) => {
    const active = key === current;
    return (
      `<li><a class="nav__link${active ? ' is-current' : ''}" href="${esc(path(key, lang))}"` +
      `${active ? ' aria-current="page"' : ''}>${esc(t.nav[key])}</a></li>`
    );
  });

  items.push(
    `<li><a class="nav__link nav__link--external" href="${esc(site.links.googleReviews)}" ` +
      `target="_blank" rel="noopener noreferrer nofollow">${esc(t.nav.reviews)}` +
      `<span class="u-visually-hidden"> (${esc(t.ui.opensNewTab)})</span>` +
      `${icon('external', { className: 'icon icon--xs' })}</a></li>`,
  );

  return `<ul class="nav__list" id="${esc(idPrefix)}-list">${items.join('\n')}</ul>`;
}

function languageSwitcher(t, lang, current, languages) {
  const options = languages
    .map((other) => {
      const active = other.code === lang;
      return (
        `<li><a class="langmenu__item${active ? ' is-current' : ''}" ` +
        `href="${esc(path(current, other.code))}" lang="${esc(other.htmlLang)}" ` +
        `hreflang="${esc(other.htmlLang)}"${active ? ' aria-current="true"' : ''}>` +
        `<span class="langmenu__code">${esc(other.labelShort)}</span>` +
        `<span>${esc(other.label)}</span></a></li>`
      );
    })
    .join('\n');

  return `
<div class="langswitch" data-langswitch>
  <button type="button" class="langswitch__button" aria-expanded="false" aria-controls="language-menu">
    ${icon('globe', { className: 'icon icon--sm' })}
    <span class="langswitch__current">${esc(t.labelShort)}</span>
    ${icon('chevronDown', { className: 'icon icon--xs langswitch__caret' })}
    <span class="u-visually-hidden">${esc(t.ui.languageSwitcher)}</span>
  </button>
  <ul class="langmenu" id="language-menu" hidden>${options}</ul>
</div>`;
}

function header(t, lang, current, languages) {
  return `
<header class="header" data-header>
  <div class="header__inner">
    ${brand(t, lang)}

    <nav class="nav" aria-label="${esc(t.ui.menu)}">
      ${navLinks(t, lang, current, { idPrefix: 'nav' })}
    </nav>

    <div class="header__actions">
      ${languageSwitcher(t, lang, current, languages)}
      <a class="btn btn--primary btn--sm header__book" href="${esc(site.booking.url)}"
         target="_blank" rel="noopener noreferrer">${esc(t.nav.book)}</a>
      <button type="button" class="burger" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu">
        <span class="burger__box" aria-hidden="true">${icon('menu', { className: 'icon burger__open' })}${icon('close', { className: 'icon burger__close' })}</span>
        <span class="u-visually-hidden">${esc(t.ui.openMenu)}</span>
      </button>
    </div>
  </div>
</header>

<div class="drawer" id="mobile-menu" data-drawer hidden>
  <nav class="drawer__nav" aria-label="${esc(t.ui.menu)}">
    ${navLinks(t, lang, current, { idPrefix: 'drawer' })}
    <div class="drawer__foot">
    <a class="btn btn--primary btn--block" href="${esc(site.booking.url)}" target="_blank" rel="noopener noreferrer">${esc(t.nav.book)}</a>
    <div class="drawer__contact">
      <a href="tel:${esc(site.contact.phoneHref)}">${icon('phone', { className: 'icon icon--sm' })}${esc(site.contact.phone)}</a>
      <a href="mailto:${esc(site.contact.email)}">${icon('mail', { className: 'icon icon--sm' })}${esc(site.contact.email)}</a>
      </div>
    </div>
  </nav>
</div>`;
}

function footer(t, lang) {
  const pages = [...NAV_KEYS.slice(1), 'notice']
    .map((key) => `<li><a href="${esc(path(key, lang))}">${esc(t.nav[key])}</a></li>`)
    .join('\n');

  return `
<footer class="footer">
  <div class="footer__inner container">
    <div class="footer__brand">
      ${brand(t, lang, { className: 'brand brand--footer' })}
      <p class="footer__tagline">${esc(t.footer.tagline)}</p>
      <ul class="social">
        <li><a href="${esc(site.links.instagram)}" target="_blank" rel="noopener noreferrer nofollow" aria-label="${esc(t.footer.instagram)}">${icon('instagram')}</a></li>
        <li><a href="${esc(site.links.facebook)}" target="_blank" rel="noopener noreferrer nofollow" aria-label="${esc(t.footer.facebook)}">${icon('facebook')}</a></li>
        <li><a href="${esc(site.links.tripadvisor)}" target="_blank" rel="noopener noreferrer nofollow" aria-label="${esc(t.footer.tripadvisor)}">${icon('tripadvisor')}</a></li>
      </ul>
    </div>

    <div class="footer__col">
      <h2 class="footer__title">${esc(t.footer.addressTitle)}</h2>
      <address class="footer__address">
        ${esc(t.address.line2)}<br>${esc(t.address.line3)}
      </address>
      <p class="footer__license">${esc(t.contact.licenseLabel)} ${esc(site.eotLicense)}</p>
    </div>

    <div class="footer__col">
      <h2 class="footer__title">${esc(t.footer.contactTitle)}</h2>
      <ul class="footer__plain">
        <li>${esc(t.contact.phoneLabel)} <a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a></li>
        <li>
          ${esc(t.contact.mobileLabel)} <a href="tel:${esc(site.contact.mobileHref)}">${esc(site.contact.mobile)}</a>
          <span class="footer__apps">
            <span class="footer__app">${icon('whatsapp', { className: 'icon icon--xs', title: t.contact.whatsapp })}</span>
            <span class="footer__app">${icon('viber', { className: 'icon icon--xs', title: t.contact.viber })}</span>
          </span>
        </li>
        <li>${esc(t.contact.emailLabel)} <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a></li>
      </ul>
      <h2 class="footer__title footer__title--tight">${esc(t.footer.paymentTitle)}</h2>
      <ul class="footer__plain footer__payments">
        ${t.contact.payments.map((p) => `<li>${icon('card', { className: 'icon icon--xs' })}${esc(p)}</li>`).join('\n')}
      </ul>
    </div>

    <div class="footer__col">
      <h2 class="footer__title">${esc(t.footer.navTitle)}</h2>
      <ul class="footer__plain footer__links">
        ${pages}
        <li><a href="${esc(site.booking.url)}" target="_blank" rel="noopener noreferrer">${esc(t.nav.book)}</a></li>
      </ul>
    </div>
  </div>

  <div class="footer__bar container">
    <p>${esc(t.footer.copyright)}</p>
    <a class="totop" href="#top">${esc(t.ui.backToTop)}${icon('arrowUp', { className: 'icon icon--sm' })}</a>
  </div>
</footer>`;
}

/**
 * @param {object} options
 * @param {object} options.t           language pack
 * @param {string} options.lang
 * @param {string} options.route       route key, used for canonical + nav state
 * @param {string} options.title
 * @param {string} options.description
 * @param {string} options.body        rendered page markup
 * @param {string} [options.shareImage]  media slug for og:image
 * @param {string} [options.heroImage]   media slug to preload
 * @param {object[]} [options.schema]    extra JSON-LD graph nodes
 * @param {string} [options.bodyClass]
 * @param {boolean} [options.noindex]
 */
export function layout(options) {
  const {
    t,
    lang,
    route,
    title,
    description,
    body,
    shareImage = site.defaultShareImage,
    heroImage,
    heroSizes = '100vw',
    schema = [],
    bodyClass = '',
    noindex = false,
    languages,
  } = options;

  // Greek pages must warm the Greek subset, or the first paint swaps a
  // fallback face for the real one and nudges the layout.
  const fontSubset = lang === 'el' ? 'greek' : 'latin';

  const canonical = url(route, lang);
  const share = media(shareImage);
  const shareUrl = imageUrl(shareImage, site.origin);

  const hreflang = join(
    alternates(route)
      .map((alt) => `<link rel="alternate" hreflang="${esc(alt.lang)}" href="${esc(alt.href)}">`)
      .concat(
        `<link rel="alternate" hreflang="x-default" href="${esc(url(route, site.defaultLanguage))}">`,
      ),
  );

  const ogAlternates = languages
    .filter((pack) => pack.code !== lang)
    .map((pack) => `<meta property="og:locale:alternate" content="${esc(pack.locale)}">`)
    .join('\n');

  return `<!doctype html>
<html lang="${esc(t.htmlLang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">'}
${hreflang}

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${esc(t.locale)}">
${ogAlternates}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(shareUrl)}">
<meta property="og:image:width" content="${share.fallback[0]}">
<meta property="og:image:height" content="${share.fallback[1]}">
<meta property="og:image:alt" content="${esc(t.alt[shareImage] ?? site.name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(shareUrl)}">
<meta name="twitter:image:alt" content="${esc(t.alt[shareImage] ?? site.name)}">

<meta name="theme-color" content="#fcfbf9" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1d2b" media="(prefers-color-scheme: dark)">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">

<link rel="preload" as="font" type="font/woff2" href="/fonts/alegreya-${esc(fontSubset)}.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/commissioner-${esc(fontSubset)}.woff2" crossorigin>
${heroImage ? preload(heroImage, heroSizes) : ''}
<link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/styles/site.css">

<script type="application/ld+json">
${jsonLd({ '@context': 'https://schema.org', '@graph': schema })}
</script>
</head>
<body class="${esc(bodyClass)}" id="top">
<a class="skiplink" href="#main">${esc(t.ui.skipToContent)}</a>
${header(t, lang, route, languages)}
<main id="main" class="main">
${body}
</main>
${footer(t, lang)}
<script type="application/json" id="lang-data">
${jsonLd(
  languages
    .filter((pack) => pack.code !== lang)
    .map((pack) => ({
      code: pack.code,
      href: path(route, pack.code),
      suggest: pack.ui.langSuggest,
      action: pack.ui.langSuggestAction,
      dismiss: pack.ui.close,
    })),
)}
</script>
<script src="/scripts/site.js" defer></script>
</body>
</html>`;
}
