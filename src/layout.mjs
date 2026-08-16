/**
 * The HTML shell: <head> metadata, header, footer and script tags.
 *
 * Everything search engines and social networks read is assembled here, so a
 * page template only has to supply its own body and any extra structured data.
 */

import { site } from './content/site.mjs';
import { path, url, alternates, asset } from './lib/routing.mjs';
import { esc, join, jsonLd } from './lib/html.mjs';
import { picture, preload, media, imageUrl } from './lib/image.mjs';
import { icon } from './lib/icons.mjs';

const NAV_KEYS = ['home', 'studios', 'facilities', 'location', 'gallery'];

function navLinks(t, lang, current) {
  const internal = NAV_KEYS.map((key) => {
    const href = path(key, lang);
    const active = key === current;
    return (
      `<li><a class="nav__link${active ? ' is-current' : ''}" href="${esc(href)}"` +
      `${active ? ' aria-current="page"' : ''}>${esc(t.nav[key])}</a></li>`
    );
  });

  internal.push(
    `<li><a class="nav__link nav__link--external" href="${esc(site.links.liveCamera)}" ` +
      `target="_blank" rel="noopener noreferrer">${esc(t.nav.camera)}` +
      `<span class="u-visually-hidden"> (${esc(t.ui.opensNewTab)})</span>` +
      `${icon('external', { className: 'icon icon--xs' })}</a></li>`,
  );

  internal.push(
    `<li><a class="nav__link${current === 'contact' ? ' is-current' : ''}" ` +
      `href="${esc(path('contact', lang))}"` +
      `${current === 'contact' ? ' aria-current="page"' : ''}>${esc(t.nav.contact)}</a></li>`,
  );

  return internal.join('\n');
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
    <a class="brand" href="${esc(path('home', lang))}" aria-label="${esc(site.name)} — ${esc(t.nav.home)}">
      <img class="brand__logo brand__logo--light" src="${esc(media('aglaia-studios-logo-white').src)}"
           width="${media('aglaia-studios-logo-white').width}" height="${media('aglaia-studios-logo-white').height}"
           alt="" aria-hidden="true">
      <img class="brand__logo brand__logo--dark" src="${esc(media('aglaia-studios-logo').src)}"
           width="${media('aglaia-studios-logo').width}" height="${media('aglaia-studios-logo').height}"
           alt="${esc(site.name)}">
    </a>

    <nav class="nav" aria-label="${esc(t.ui.menu)}">
      <ul class="nav__list">${navLinks(t, lang, current)}</ul>
    </nav>

    <div class="header__actions">
      ${languageSwitcher(t, lang, current, languages)}
      <a class="btn btn--primary btn--sm header__book" href="${esc(site.links.booking)}"
         target="_blank" rel="noopener noreferrer">${esc(t.nav.book)}</a>
      <button type="button" class="burger" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu">
        <span class="burger__box">${icon('menu', { className: 'icon burger__open' })}${icon('close', { className: 'icon burger__close' })}</span>
        <span class="u-visually-hidden">${esc(t.ui.openMenu)}</span>
      </button>
    </div>
  </div>
</header>

<div class="drawer" id="mobile-menu" data-drawer hidden>
  <nav class="drawer__nav" aria-label="${esc(t.ui.menu)}">
    <ul class="drawer__list">${navLinks(t, lang, current)}</ul>
  </nav>
  <div class="drawer__foot">
    <a class="btn btn--primary btn--block" href="${esc(site.links.booking)}" target="_blank" rel="noopener noreferrer">${esc(t.nav.book)}</a>
    <div class="drawer__contact">
      <a href="tel:${esc(site.contact.phoneHref)}">${icon('phone', { className: 'icon icon--sm' })}${esc(site.contact.phone)}</a>
      <a href="mailto:${esc(site.contact.email)}">${icon('mail', { className: 'icon icon--sm' })}${esc(site.contact.email)}</a>
    </div>
  </div>
</div>`;
}

function footer(t, lang) {
  const a = site.contact.address;
  const exploreLinks = [...NAV_KEYS.slice(1), 'contact']
    .map((key) => `<li><a href="${esc(path(key, lang))}">${esc(t.nav[key])}</a></li>`)
    .join('\n');

  return `
<footer class="footer">
  <div class="footer__inner">
    <div class="footer__brand">
      <img class="footer__logo" src="${esc(media('aglaia-studios-logo-white').src)}"
           width="${media('aglaia-studios-logo-white').width}" height="${media('aglaia-studios-logo-white').height}"
           alt="${esc(site.name)}" loading="lazy" decoding="async">
      <p class="footer__tagline">${esc(t.footer.tagline)}</p>
      <ul class="social" aria-label="${esc(t.footer.followTitle)}">
        <li><a href="${esc(site.links.instagram)}" target="_blank" rel="noopener noreferrer nofollow" aria-label="Instagram">${icon('instagram')}</a></li>
        <li><a href="${esc(site.links.facebook)}" target="_blank" rel="noopener noreferrer nofollow" aria-label="Facebook">${icon('facebook')}</a></li>
      </ul>
    </div>

    <div class="footer__col">
      <h2 class="footer__title">${esc(t.footer.addressTitle)}</h2>
      <address class="footer__address">
        <a href="${esc(site.links.maps)}" target="_blank" rel="noopener noreferrer">
          ${esc(t.address.line1)}<br>${esc(t.address.line2)}<br>${esc(t.address.line3)}
        </a>
      </address>
      <h2 class="footer__title footer__title--tight">${esc(t.footer.paymentTitle)}</h2>
      <ul class="footer__plain">
        ${t.contact.payments.map((p) => `<li>– ${esc(p)}</li>`).join('\n')}
      </ul>
    </div>

    <div class="footer__col">
      <h2 class="footer__title">${esc(t.footer.reservationTitle)}</h2>
      <ul class="footer__plain">
        <li>${esc(t.footer.phoneLabel)} <a href="tel:${esc(site.contact.phoneHref)}">${esc(site.contact.phone)}</a></li>
        <li>${esc(t.footer.emailLabel)} <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a></li>
        <li class="footer__license">${esc(t.footer.licenseLabel)} ${esc(site.eotLicense)}</li>
      </ul>
      <h2 class="footer__title footer__title--tight">${esc(t.footer.awardsTitle)}</h2>
      <a class="footer__badge" href="${esc(site.links.bookingCom)}" target="_blank" rel="noopener noreferrer nofollow">
        <img src="${esc(media('booking-com-award-badge').src)}" width="70" height="70"
             alt="${esc(t.footer.badgeAlt)}" loading="lazy" decoding="async">
      </a>
    </div>

    <div class="footer__col">
      <h2 class="footer__title">${esc(t.footer.navTitle)}</h2>
      <ul class="footer__plain footer__links">
        ${exploreLinks}
        <li><a href="${esc(site.links.liveCamera)}" target="_blank" rel="noopener noreferrer">${esc(t.nav.camera)}</a></li>
        <li><a href="${esc(site.links.booking)}" target="_blank" rel="noopener noreferrer">${esc(t.nav.book)}</a></li>
      </ul>
    </div>
  </div>

  <div class="footer__bar">
    <p>${esc(t.footer.copyright)}</p>
    <ul class="footer__legal">
      <li><a href="${esc(path('cookies', lang))}">${esc(t.nav.cookies ?? t.cookies.heroTitle)}</a></li>
    </ul>
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

  // Preload only the faces this page will actually paint with. A Greek page
  // that preloads the Latin subsets pays for two files it never draws a glyph
  // from, and still waits for the two it needs.
  const fontPreloads = (lang === 'el'
    ? ['gentium-greek-400.woff2', 'inter-greek.woff2']
    : ['garamond-latin.woff2', 'inter-latin.woff2']
  )
    .map(
      (file) =>
        `<link rel="preload" as="font" type="font/woff2" href="${esc(asset(`/fonts/${file}`))}" crossorigin>`,
    )
    .join('\n');

  const canonical = url(route, lang);
  const share = media(shareImage);
  const shareUrl = imageUrl(shareImage, site.origin);

  const hreflang = join(
    alternates(route)
      .map(
        (alt) =>
          `<link rel="alternate" hreflang="${esc(alt.lang)}" href="${esc(alt.href)}">`,
      )
      .concat(
        `<link rel="alternate" hreflang="x-default" href="${esc(url(route, site.defaultLanguage))}">`,
      ),
  );

  const ogAlternates = site.languages
    .filter((l) => l !== lang)
    .map((l) => {
      const pack = languages.find((x) => x.code === l);
      return `<meta property="og:locale:alternate" content="${esc(pack.locale)}">`;
    })
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

<meta name="theme-color" content="#f7f9fc" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b1b33" media="(prefers-color-scheme: dark)">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="${asset('/favicon.ico')}" sizes="48x48">
<link rel="icon" href="${asset('/favicon-32.png')}" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="${asset('/apple-touch-icon.png')}">
<link rel="manifest" href="${asset('/site.webmanifest')}">

${fontPreloads}
${heroImage ? preload(heroImage, heroSizes) : ''}
<link rel="stylesheet" href="${asset('/styles/site.css')}">

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
<script src="${asset('/scripts/site.js')}" defer></script>
</body>
</html>`;
}
