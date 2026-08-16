/**
 * Package the built site into one self-contained HTML file that can be opened
 * anywhere: no server, no external request, nothing to install.
 *
 * All four languages travel in the same document — 6 routes × 4 languages =
 * 24 pages — because a preview that only shows English invites the reader to
 * conclude the site is English-only. Photos are inlined once and shared by
 * every language, so the extra three cost HTML text, not megabytes.
 *
 * How four copies of the chrome coexist with src/js/site.js
 * --------------------------------------------------------
 * site.js binds most components with `querySelectorAll` (see `each()` there),
 * so four headers, four galleries and four reservation forms all work on their
 * own. Three things need help:
 *
 *   1. The mobile drawer and the language menu are still singletons in site.js
 *      — correct for the real site, which has exactly one of each. Their hook
 *      attributes are renamed here so site.js skips them, and the preview
 *      router re-implements both with event delegation against whichever
 *      chrome is currently visible.
 *   2. The lightbox is deliberately one shared dialog: the duplicates are
 *      dropped and a single root is hoisted to the end of the document. Its
 *      group names are namespaced per language so a Greek grid opens Greek
 *      captions, not the English grid that happens to come first.
 *   3. `[data-map]` is neutralised outright. The real page loads a Google
 *      iframe on request; a preview must make zero external requests, so the
 *      router intercepts the button and explains itself instead.
 *
 * Routing is `#<lang>/<page>` — `#el/accommodation`. Every internal link and
 * every language-switcher link is rewritten to that scheme at pack time, so
 * switching language keeps the page you are on.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, routes } from '../src/content/site.mjs';
import { path as routePath, outputFile } from '../src/lib/routing.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
/**
 * LOCAL=1 builds the version meant to be opened by double-click from a desktop,
 * at full image quality. The default targets the hosted artifact viewer, which
 * caps the page at 16 MB.
 */
const LOCAL = process.env.LOCAL === '1';
const OUT = join(ROOT, 'preview', LOCAL ? 'anna-studios-local.html' : 'anna-studios-preview.html');

const LANGS = site.languages; // en, el, it, fr
const PAGES = routes.map((r) => r.key);

/** Photo quality inside the preview. High enough that nothing looks soft. */
const IMAGE_WIDTH = LOCAL ? 1800 : 1400;
const IMAGE_QUALITY = LOCAL ? 86 : 80;

/** Label shown on the preview's own language pills. */
const LANG_LABEL = { en: 'EN', el: 'ΕΛ', it: 'IT', fr: 'FR' };

/** "Every language is in here" — said in the language you are looking at. */
const INTRO = {
  en: 'Preview of the whole site — English, Ελληνικά, Italiano and Français are all in this one file. Switch with the globe in the header.',
  el: 'Προεπισκόπηση ολόκληρου του ιστότοπου — αγγλικά, ελληνικά, ιταλικά και γαλλικά βρίσκονται όλα σε αυτό το αρχείο.',
  it: 'Anteprima dell’intero sito — inglese, greco, italiano e francese sono tutti in questo unico file.',
  fr: 'Aperçu du site entier — anglais, grec, italien et français sont tous dans ce seul fichier.',
};

/** Every published route path, longest first, mapped to its preview hash. */
const PATH_TO_HASH = [];
for (const lang of LANGS) {
  for (const key of PAGES) PATH_TO_HASH.push([routePath(key, lang), `#${lang}/${key}`]);
}
PATH_TO_HASH.sort((a, b) => b[0].length - a[0].length);

const read = (p) => readFileSync(join(DIST, p), 'utf8');

function between(html, open, close, includeClose = true) {
  const i = html.indexOf(open);
  if (i === -1) throw new Error(`missing ${open}`);
  const j = html.indexOf(close, i);
  if (j === -1) throw new Error(`missing ${close}`);
  return html.slice(i, includeClose ? j + close.length : j);
}

const images = new Set();
let lightbox = '';

/**
 * Templates always emit the lightbox as the last element of the page body, so
 * everything from its opening tag onwards is the dialog. Only the first one is
 * kept; the other 23 are dropped because one dialog serves every grid.
 */
function takeLightbox(body) {
  const i = body.indexOf('<div class="lightbox"');
  if (i === -1) return body;
  if (!lightbox) lightbox = body.slice(i);
  return body.slice(0, i);
}

/**
 * Turn a fragment of the built site into a fragment of the preview.
 * `lang` is the language the fragment belongs to.
 */
function rewrite(fragment, lang) {
  let out = fragment;

  // Internal links — including every language-switcher link — become hash
  // routes. Because the switcher links to the *same* route in the other
  // language, this alone makes "switch language, keep the page" work.
  for (const [path, hash] of PATH_TO_HASH) out = out.replaceAll(`href="${path}"`, `href="${hash}"`);

  // In-page anchors would collide with the routing hash, so the router moves
  // them instead of the browser.
  for (const id of ['top', 'main', 'services']) {
    out = out.replaceAll(`href="#${id}"`, `href="#" data-pv-anchor="${id}"`);
  }

  // Hooks site.js still binds as singletons. Renaming them makes site.js skip
  // them; the preview router implements both, for every language.
  out = out.replace(/\bdata-menu-toggle\b/g, 'data-pv-menu-toggle');
  out = out.replace(/\bdata-drawer\b/g, 'data-pv-drawer');
  out = out.replace(/\bdata-langswitch\b/g, 'data-pv-langswitch');

  // The map would fetch a Google iframe. Nothing in this file may reach the
  // network, so site.js never sees the box and the router explains why.
  out = out.replace(/\bdata-map(?![-\w])/g, 'data-pv-map');

  // site.js resolves a lightbox group with a document-wide querySelector.
  // Namespacing the group keeps each language pointed at its own grid.
  out = out.replace(
    /data-lightbox-group="([^"]+)"/g,
    (_, g) => `data-lightbox-group="${lang}:${g}"`,
  );
  out = out.replace(/data-lightbox="([^"]+)"/g, (_, g) => `data-lightbox="${lang}:${g}"`);

  // Chrome ids that exist once per language; keep them unique so aria-controls
  // points at this language's drawer and menu rather than English's.
  for (const id of ['mobile-menu', 'language-menu', 'nav-list', 'drawer-list']) {
    out = out.replaceAll(`id="${id}"`, `id="${lang}-${id}"`);
    out = out.replaceAll(`aria-controls="${id}"`, `aria-controls="${lang}-${id}"`);
  }

  // <picture> collapses to its <img>; the srcset variants are not inlined.
  out = out.replace(
    /<picture([^>]*)>\s*(?:<source[^>]*>)?\s*(<img[^>]*>)\s*<\/picture>/g,
    (_, attrs, img) => `<span class="pv-pic"${attrs}>${img}</span>`,
  );

  // Every image src becomes a lookup into the inlined dictionary.
  out = out.replace(/src="\/images\/([^"]+)"/g, (_, file) => {
    images.add(file);
    return `data-img="${file}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="`;
  });

  return out;
}

/** Tag a chrome fragment's root element so the router can show and hide it. */
function markChrome(fragment, lang) {
  return fragment.replace(/^<(\w+)([^>]*)>/, (_, tag, attrs) => {
    const withClass = attrs.replace(/class="([^"]*)"/, (__, c) => `class="${c} pv-chrome"`);
    return `<${tag}${withClass} data-pv-lang="${lang}" lang="${lang}">`;
  });
}

// ---- Harvest every language -----------------------------------------------
const chrome = [];
const pages = [];

for (const lang of LANGS) {
  const home = read(outputFile('home', lang));

  chrome.push({
    lang,
    header: markChrome(rewrite(between(home, '<header class="header"', '</header>'), lang), lang),
    drawer: markChrome(
      rewrite(between(home, '<div class="drawer"', '<main id="main"', false).trimEnd(), lang),
      lang,
    ),
    footer: markChrome(rewrite(between(home, '<footer class="footer">', '</footer>'), lang), lang),
  });

  for (const key of PAGES) {
    const html = read(outputFile(key, lang));
    const main = between(html, '<main id="main"', '</main>', false).replace(/^<main[^>]*>/, '');
    pages.push({ lang, key, html: rewrite(takeLightbox(main), lang) });
  }
}

// The one surviving dialog is shared, so it keeps the plain group names its
// own hooks use; only the grids are namespaced.
lightbox = rewrite(lightbox, 'shared');

// ---- Assets ----------------------------------------------------------------
console.log(`inlining ${images.size} images at ${IMAGE_WIDTH}px q${IMAGE_QUALITY}…`);

/**
 * The `<img>` fallback in the built markup points at the 1200px rendition, but
 * the preview's lightbox shows a photo full-screen, so the packer reaches for
 * the widest rendition on disk and works down to the target width. Soft photos
 * are what a client remembers.
 */
const script = `
from PIL import Image
import base64, io, json, re, sys, pathlib

BASE = pathlib.Path(${JSON.stringify(join(ROOT, 'public', 'images'))})
WIDTH = ${IMAGE_WIDTH}
QUALITY = ${IMAGE_QUALITY}

def source(name):
    """Smallest rendition at or above the target width, else the widest one."""
    stem = re.sub(r'-(480|768|1200|1600|2000)$', '', pathlib.Path(name).stem)
    ladder = []
    for candidate in BASE.glob(stem + '-*.webp'):
        m = re.search(r'-(\\d+)\\.webp$', candidate.name)
        if m:
            ladder.append((int(m.group(1)), candidate))
    ladder.sort()
    for width, candidate in ladder:
        if width >= WIDTH:
            return candidate
    return ladder[-1][1] if ladder else BASE / name

out = {}
for name in json.load(sys.stdin):
    p = source(name)
    im = Image.open(p)
    if im.width > WIDTH:
        im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    if im.mode in ('RGBA', 'LA', 'P'):
        im.convert('RGBA').save(buf, 'WEBP', quality=QUALITY, method=6)
    else:
        im.convert('RGB').save(buf, 'WEBP', quality=QUALITY, method=6)
    out[name] = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
json.dump(out, sys.stdout)
`;

const imageMap = JSON.parse(
  execFileSync('python3', ['-c', script], {
    input: JSON.stringify([...images]),
    maxBuffer: 1024 * 1024 * 400,
  }).toString(),
);

// Fonts: every subset of both families travels, because the preview holds
// Greek and Latin in the same document. Without the Greek cuts the Greek pages
// fall back to a system face and look broken beside the Latin ones.
const fontCss = readFileSync(join(ROOT, 'public/fonts/fonts.css'), 'utf8').replace(
  /url\(\/fonts\/([^)]+)\)/g,
  (_, f) =>
    `url(data:font/woff2;base64,${readFileSync(join(ROOT, 'public/fonts', f)).toString('base64')})`,
);

const siteCss = readFileSync(join(DIST, 'styles/site.css'), 'utf8');
const siteJs = readFileSync(join(DIST, 'scripts/site.js'), 'utf8');

// ---- Assemble --------------------------------------------------------------
const pills = LANGS.map(
  (l) =>
    `<button type="button" class="pv-pill" data-pv-go="${l}" lang="${l}">${LANG_LABEL[l]}</button>`,
).join('');

// The charset declaration has to come first and stay inside the first 1024
// bytes: opened from disk there is no Content-Type header, and a browser that
// guesses windows-1252 turns every Greek page — and every typographic
// apostrophe — into mojibake.
const doc = `<meta charset="utf-8">
<title>Anna Studios</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
${fontCss}
${siteCss}

/* --- Preview shell ---------------------------------------------------- */
.pv-chrome:not(.pv-on) { display: none !important; }
.pv-page { display: none; }
.pv-page.is-active { display: block; }
.pv-pic { display: block; }

/* A standing reminder that all four languages are in this one file. Quiet at
   rest so it never competes with the page it is sitting on top of. */
.pv-bar {
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  z-index: 320;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.3rem 0.4rem 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgb(15 29 43 / 90%);
  backdrop-filter: blur(8px);
  box-shadow: var(--shadow-lg);
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-400);
  opacity: 0.82;
  transition: opacity 0.2s ease;
}
.pv-bar:hover,
.pv-bar:focus-within { opacity: 1; }
.pv-bar__label { padding-right: 0.3rem; }
.pv-pill {
  appearance: none;
  border: 0;
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 999px;
  background: transparent;
  color: var(--ink-200);
  font: inherit;
  letter-spacing: 0.08em;
}
.pv-pill:hover { background: rgb(255 255 255 / 14%); color: var(--white); }
.pv-pill.is-on { background: var(--shell-50); color: var(--ink-900); }
.pv-pill:focus-visible { outline: 2px solid var(--azure-200); outline-offset: 2px; }

.pv-note {
  position: fixed;
  left: 50%;
  bottom: 1.1rem;
  translate: -50% 0;
  z-index: 300;
  max-width: min(100% - 2rem, 34rem);
  padding: 0.8rem 1.1rem;
  border-radius: var(--radius);
  background: var(--ink-900);
  color: var(--shell-100);
  font-family: var(--font-body);
  font-size: 0.85rem;
  line-height: 1.45;
  box-shadow: var(--shadow-lg);
}
.pv-note[hidden] { display: none !important; }

@media (max-width: 820px) {
  .pv-note { bottom: 4.2rem; }
}
</style>

<a class="skiplink" href="#" data-pv-anchor="main">Skip to content</a>
${chrome.map((c) => c.header).join('\n')}
${chrome.map((c) => c.drawer).join('\n')}
<main id="main" class="main">
${pages
  .map(
    (p) =>
      `<div class="pv-page" data-pv-lang="${p.lang}" data-pv-page="${p.key}" lang="${p.lang}">\n${p.html}\n</div>`,
  )
  .join('\n')}
</main>
${chrome.map((c) => c.footer).join('\n')}
${lightbox}
<div class="pv-bar" role="group" aria-label="Preview language"><span class="pv-bar__label">Preview</span>${pills}</div>
<p class="pv-note" id="pv-note" hidden></p>

<script>
/* Fill every image from the inlined dictionary before anything else runs. */
var PV_IMAGES = ${JSON.stringify(imageMap)};
(function () {
  var imgs = document.querySelectorAll('[data-img]');
  for (var i = 0; i < imgs.length; i++) {
    var src = PV_IMAGES[imgs[i].getAttribute('data-img')];
    if (src) { imgs[i].src = src; imgs[i].removeAttribute('loading'); }
  }
})();
</script>

<script>
${siteJs}
</script>

<script>
/* Preview router.
   The hash is "#<lang>/<page>". Everything the real site gets from serving
   separate documents — one visible chrome, one visible page, a drawer and a
   language menu that belong to the language on screen — is done here with
   event delegation. */
(function () {
  var LANGS = ${JSON.stringify(LANGS)};
  var PAGES = ${JSON.stringify(PAGES)};
  var INTRO = ${JSON.stringify(INTRO)};
  var chromes = [].slice.call(document.querySelectorAll('.pv-chrome'));
  var pages = [].slice.call(document.querySelectorAll('.pv-page'));
  var pills = [].slice.call(document.querySelectorAll('[data-pv-go]'));
  var note = document.getElementById('pv-note');
  var noteTimer;
  var current = { lang: LANGS[0], page: PAGES[0] };

  function say(text, ms) {
    note.textContent = text;
    note.hidden = false;
    clearTimeout(noteTimer);
    noteTimer = setTimeout(function () { note.hidden = true; }, ms || 5000);
  }

  /* --- drawer and language menu, one per language ------------------------ */
  function drawerParts() {
    var header = null;
    var panel = null;
    chromes.forEach(function (c) {
      if (c.dataset.pvLang !== current.lang) return;
      if (c.tagName === 'HEADER') header = c;
      if (c.hasAttribute('data-pv-drawer')) panel = c;
    });
    return { toggle: header && header.querySelector('[data-pv-menu-toggle]'), panel: panel };
  }

  function setDrawer(open) {
    var parts = drawerParts();
    if (!parts.toggle || !parts.panel) return;
    parts.toggle.setAttribute('aria-expanded', String(open));
    parts.panel.hidden = !open;
    document.body.classList.toggle('is-locked', open);
    if (open) {
      var first = parts.panel.querySelector('a, button');
      if (first) first.focus();
    }
  }

  function drawerOpen() {
    var parts = drawerParts();
    return !!parts.toggle && parts.toggle.getAttribute('aria-expanded') === 'true';
  }

  function setLangMenu(root, open) {
    var button = root.querySelector('.langswitch__button');
    var menu = root.querySelector('.langmenu');
    if (!button || !menu) return;
    button.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  }

  function closeLangMenus() {
    document.querySelectorAll('[data-pv-langswitch]').forEach(function (root) {
      setLangMenu(root, false);
    });
  }

  /* --- routing ----------------------------------------------------------- */
  function parse() {
    var bits = location.hash.replace(/^#/, '').split('/');
    return {
      lang: LANGS.indexOf(bits[0]) > -1 ? bits[0] : LANGS[0],
      page: PAGES.indexOf(bits[1]) > -1 ? bits[1] : PAGES[0],
    };
  }

  function show(lang, page) {
    setDrawer(false);
    closeLangMenus();
    current = { lang: lang, page: page };
    document.documentElement.lang = lang;

    chromes.forEach(function (c) { c.classList.toggle('pv-on', c.dataset.pvLang === lang); });
    pages.forEach(function (p) {
      p.classList.toggle('is-active', p.dataset.pvLang === lang && p.dataset.pvPage === page);
    });

    var here = '#' + lang + '/' + page;
    document.querySelectorAll('.nav__link').forEach(function (a) {
      var on = a.getAttribute('href') === here;
      a.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    // One chrome serves all six pages of a language, so the switcher's targets
    // are re-pointed at whichever page is open.
    document.querySelectorAll('.langmenu__item').forEach(function (a) {
      var to = a.getAttribute('lang');
      a.setAttribute('href', '#' + to + '/' + page);
      var on = to === lang;
      a.classList.toggle('is-current', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    pills.forEach(function (b) { b.classList.toggle('is-on', b.dataset.pvGo === lang); });

    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', function () {
    var next = parse();
    show(next.lang, next.page);
  });

  /* --- interception: anchors, labels, maps, external links --------------- */
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('[data-pv-anchor]');
    if (anchor) {
      e.preventDefault();
      var id = anchor.getAttribute('data-pv-anchor');
      var open = document.querySelector('.pv-page.is-active');
      var target = id === 'top' || id === 'main' ? null : open && open.querySelector('[id="' + id + '"]');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      setDrawer(false);
      return;
    }

    // Four copies of the reservation form means four inputs share an id, and a
    // bare <label for> would hand focus to the hidden English one.
    var label = e.target.closest('label[for]');
    if (label) {
      var scope = label.closest('.pv-page') || document;
      var field = scope.querySelector('[id="' + label.getAttribute('for') + '"]');
      if (field) {
        e.preventDefault();
        if (field.type === 'checkbox' || field.type === 'radio') field.click();
        else field.focus();
      }
      return;
    }

    if (e.target.closest('[data-map-load]')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      say('Google Maps can’t load inside this preview — external embeds are blocked. It works on the real site.');
      return;
    }

    var external = e.target.closest('a[target="_blank"]');
    if (external && external.href.indexOf('mailto:') !== 0 && external.href.indexOf('tel:') !== 0) {
      e.preventDefault();
      say('Opens ' + new URL(external.href).hostname + ' — external links are blocked in this preview.');
    }
  }, true);

  /* --- interception: the chrome site.js no longer owns -------------------- */
  document.addEventListener('click', function (e) {
    var burger = e.target.closest('[data-pv-menu-toggle]');
    if (burger) {
      setDrawer(burger.getAttribute('aria-expanded') !== 'true');
      return;
    }

    var langButton = e.target.closest('.langswitch__button');
    if (langButton) {
      var root = langButton.closest('[data-pv-langswitch]');
      var wasOpen = langButton.getAttribute('aria-expanded') === 'true';
      closeLangMenus();
      if (!wasOpen && root) setLangMenu(root, true);
      return;
    }

    var pill = e.target.closest('[data-pv-go]');
    if (pill) {
      location.hash = '#' + pill.dataset.pvGo + '/' + current.page;
      return;
    }

    var langItem = e.target.closest('.langmenu__item');
    if (langItem) {
      try { localStorage.setItem('anna:lang', langItem.getAttribute('lang') || ''); } catch (err) { /* ignore */ }
      closeLangMenus();
      return;
    }

    if (!e.target.closest('[data-pv-langswitch]')) closeLangMenus();
    if (e.target.closest('[data-pv-drawer] a')) setDrawer(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (drawerOpen()) {
      var parts = drawerParts();
      setDrawer(false);
      if (parts.toggle) parts.toggle.focus();
      return;
    }
    closeLangMenus();
  });

  window.matchMedia('(min-width: 1081px)').addEventListener('change', function (e) {
    if (e.matches) setDrawer(false);
  });

  var start = parse();
  show(start.lang, start.page);
  say(INTRO[start.lang] || INTRO.en, 9000);
})();
</script>
`;

mkdirSync(join(ROOT, 'preview'), { recursive: true });
writeFileSync(OUT, doc);
console.log(
  `${OUT} — ${(Buffer.byteLength(doc) / 1048576).toFixed(2)} MB, ` +
    `${pages.length} pages (${LANGS.length} languages × ${PAGES.length} routes)`,
);
