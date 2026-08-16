/**
 * Package the built site into one self-contained HTML file that can be opened
 * anywhere: no server, no external requests. Every route in every language is
 * included; images and fonts are inlined and shared across languages, so extra
 * languages cost only HTML text.
 *
 *   node tools/pack-preview.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
/**
 * LOCAL=1 builds the version meant to be opened by double-click from a desktop,
 * at full image quality. The default build targets the hosted artifact viewer,
 * which caps the page at 16 MB.
 *
 * Neither carries the hero film: the artifact sandbox blocks third-party
 * frames, and YouTube refuses an embed to a page opened from disk, which has no
 * origin to authorise. The poster frame stands in for both.
 */
const LOCAL = process.env.LOCAL === '1';
const OUT = join(ROOT, 'preview', LOCAL ? 'aglaia-studios-local.html' : 'aglaia-studios-preview.html');
const IMAGE_WIDTH = LOCAL ? 2000 : 1500;
const IMAGE_QUALITY = LOCAL ? 88 : 82;

const LANGS = [
  { code: 'en', prefix: '' },
  { code: 'el', prefix: 'el/' },
  { code: 'fr', prefix: 'fr/' },
];

const PAGES = [
  { key: 'home', dir: '' },
  { key: 'studios', dir: 'studios' },
  { key: 'facilities', dir: 'facilities' },
  { key: 'location', dir: 'location' },
  { key: 'gallery', dir: 'photo-gallery' },
  { key: 'contact', dir: 'contact' },
  { key: 'cookies', dir: 'cookies-policy' },
];

/** Every published path mapped to its preview hash. */
const ROUTES = [];
for (const lang of LANGS) {
  for (const page of PAGES) {
    ROUTES.push([`/${lang.prefix}${page.dir}${page.dir ? '/' : ''}`, `#${lang.code}/${page.key}`]);
  }
}
// Longest first, so /el/studios/ is not shortened by the /el/ rule.
ROUTES.sort((a, b) => b[0].length - a[0].length);

const read = (p) => readFileSync(join(DIST, p), 'utf8');
const images = new Set();
let lightbox = '';

/**
 * Templates always emit the lightbox as the last element of the page body, so
 * everything from its opening tag onwards is the dialog. Only the first is
 * kept: the runtime binds a single root, and one dialog serves every grid.
 */
function takeLightbox(body) {
  const i = body.indexOf('<div class="lightbox"');
  if (i === -1) return body;
  if (!lightbox) lightbox = body.slice(i);
  return body.slice(0, i);
}

function rewrite(fragment, lang) {
  let out = fragment;

  // Group names ('exterior', 'interior') repeat in every language, and the
  // runtime opens the first grid it finds by name. Namespace them so a Greek
  // tile opens the Greek set, not the English one.
  out = out.replace(/data-lightbox-group="([^"]+)"/g, (_, g) => `data-lightbox-group="${lang}-${g}"`);
  out = out.replace(/data-lightbox="([^"]+)"/g, (_, g) => `data-lightbox="${lang}-${g}"`);

  for (const [route, hash] of ROUTES) {
    out = out.replaceAll(`href="${route}"`, `href="${hash}"`);
  }

  // <picture> collapses to its <img>; only one rendition is inlined.
  out = out.replace(
    /<picture([^>]*)>\s*(?:<source[^>]*>)?\s*(<img[^>]*>)\s*<\/picture>/g,
    (_, attrs, img) => `<span class="pv-pic"${attrs}>${img}</span>`,
  );

  // Image sources become lookups into the inlined dictionary.
  out = out.replace(/src="\/images\/([^"]+)"/g, (_, file) => {
    images.add(file);
    return `data-img="${file}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="`;
  });

  // The preview supplies its own reveal handling.
  out = out.replaceAll(' data-reveal', '');

  // No hero film in either preview — see the note on LOCAL above. Drop its
  // mount and its pause control rather than ship a button that does nothing;
  // the poster frame stays.
  out = out.replace(/<div class="hero__video"[\s\S]*?<\/div>/, '');
  out = out.replace(/<button type="button" class="hero__videotoggle"[\s\S]*?<\/button>/, '');

  // site.js binds the drawer and the language menu with querySelector, which
  // would always find the first language's copy. Rename the hooks so it skips
  // them, and let the preview router drive both against the visible chrome.
  out = out
    .replaceAll('data-menu-toggle', 'data-pv-menu')
    .replaceAll('data-drawer', 'data-pv-drawer')
    .replaceAll('data-langswitch', 'data-pv-langswitch');

  return out;
}

// ---- Chrome and pages, per language ---------------------------------------

const chromes = [];
const pages = [];

for (const lang of LANGS) {
  const home = read(join(lang.prefix, 'index.html'));

  chromes.push({
    code: lang.code,
    header: rewrite(home.slice(home.indexOf('<header class="header"'), home.indexOf('</header>') + 9), lang.code),
    drawer: rewrite(home.slice(home.indexOf('<div class="drawer"'), home.indexOf('<main id="main"')), lang.code),
    footer: rewrite(home.slice(home.indexOf('<footer class="footer">'), home.indexOf('</footer>') + 9), lang.code),
  });

  for (const page of PAGES) {
    const html = read(join(lang.prefix, page.dir, 'index.html'));
    const main = html
      .slice(html.indexOf('<main id="main"'), html.indexOf('</main>'))
      .replace(/^<main[^>]*>/, '');
    pages.push({ lang: lang.code, key: page.key, html: rewrite(takeLightbox(main), lang.code) });
  }
}

const sharedLightbox = rewrite(lightbox, LANGS[0].code);

// ---- Assets ---------------------------------------------------------------

console.log(`inlining ${images.size} images…`);

const script = `
from PIL import Image
import base64, io, json, sys, pathlib
out = {}
for name in json.load(sys.stdin):
    p = pathlib.Path(${JSON.stringify(join(ROOT, 'public', 'images'))}) / name
    im = Image.open(p)
    if im.width > ${IMAGE_WIDTH}:
        im = im.resize((${IMAGE_WIDTH}, round(im.height * ${IMAGE_WIDTH} / im.width)), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    if p.suffix == '.png':
        im.convert('RGBA').save(buf, 'WEBP', quality=90, method=6)
    else:
        im.convert('RGB').save(buf, 'WEBP', quality=${IMAGE_QUALITY}, method=6)
    out[name] = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
json.dump(out, sys.stdout)
`;

const imageMap = JSON.parse(
  execFileSync('python3', ['-c', script], {
    input: JSON.stringify([...images]),
    maxBuffer: 1024 * 1024 * 400,
  }).toString(),
);

// Latin for English and French; Greek for the /el/ pages, or the Greek text
// falls back to a system font and the preview misrepresents the site.
const FONTS = [
  'garamond-latin.woff2',
  'garamond-latin-ext.woff2',
  'gentium-greek-400.woff2',
  'gentium-greek-ext-400.woff2',
  'inter-latin.woff2',
  'inter-latin-ext.woff2',
  'inter-greek.woff2',
  'inter-greek-ext.woff2',
];

const fontCss = readFileSync(join(ROOT, 'public/fonts/fonts.css'), 'utf8')
  .split('\n\n')
  .filter((block) => FONTS.some((f) => block.includes(`/fonts/${f}`)))
  .map((block) =>
    block.replace(/url\(\/fonts\/([^)]+)\)/, (_, f) => {
      const data = readFileSync(join(ROOT, 'public/fonts', f)).toString('base64');
      return `url(data:font/woff2;base64,${data})`;
    }),
  )
  .join('\n\n');

const siteCss = readFileSync(join(DIST, 'styles/site.css'), 'utf8');
const siteJs = readFileSync(join(DIST, 'scripts/site.js'), 'utf8');

const NOTES = {
  en: LOCAL
    ? 'Local preview — the whole site in all three languages. Use the globe in the header to switch language.'
    : 'Preview of the whole site, in all three languages — use the globe in the header to switch. Photos are recompressed to fit one file, and the hero film shows as a still.',
  el: 'Προεπισκόπηση ολόκληρου του ιστότοπου, και στις τρεις γλώσσες.',
  fr: 'Aperçu du site entier, dans les trois langues.',
};

// ---- Assemble -------------------------------------------------------------

/* The charset must be declared in the file itself: opened over file:// there
   is no Content-Type header, and Chromium falls back to a legacy encoding that
   renders every Greek page as mojibake. */
const doc = `<meta charset="utf-8">
<title>Aglaia Studios</title>
<style>
${fontCss}
${siteCss}

/* --- Preview shell ---------------------------------------------------- */
.pv-page,
.pv-chrome { display: none; }
.pv-page.is-active,
.pv-chrome.is-active { display: block; }
.pv-pic { display: block; }

.pv-reveal { opacity: 0; transform: translateY(1.5rem); }
.pv-reveal.is-shown {
  opacity: 1;
  transform: none;
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
}

.pv-note {
  position: fixed;
  left: 1.25rem;
  bottom: 1.25rem;
  z-index: 300;
  max-width: min(100% - 2.5rem, 26rem);
  padding: 0.7rem 1rem;
  border-radius: var(--radius);
  background: var(--ink-900);
  color: var(--paper-100);
  font-family: var(--font-body);
  font-size: 0.85rem;
  box-shadow: var(--shadow-lg);
}
.pv-note[hidden] { display: none !important; }

@media (prefers-reduced-motion: reduce) {
  .pv-reveal { opacity: 1; transform: none; }
}
</style>

<a class="skiplink" href="#main">Skip to content</a>
${chromes
  .map((c) => `<div class="pv-chrome" data-chrome="${c.code}">\n${c.header}\n${c.drawer}\n</div>`)
  .join('\n')}
<main id="main" class="main">
${pages
  .map((p) => `<div class="pv-page" data-page="${p.lang}/${p.key}">\n${p.html}\n</div>`)
  .join('\n')}
</main>
${chromes.map((c) => `<div class="pv-chrome" data-chrome="${c.code}">\n${c.footer}\n</div>`).join('\n')}
${sharedLightbox}
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
/* Preview router: #lang/page. It also owns the drawer and the language menu,
   which site.js binds as singletons and so could not drive across copies. */
(function () {
  var LANGS = ${JSON.stringify(LANGS.map((l) => l.code))};
  var PAGES = ${JSON.stringify(PAGES.map((p) => p.key))};
  var NOTES = ${JSON.stringify(NOTES)};

  var note = document.getElementById('pv-note');
  var noteTimer;
  function say(text) {
    note.textContent = text;
    note.hidden = false;
    clearTimeout(noteTimer);
    noteTimer = setTimeout(function () { note.hidden = true; }, 6000);
  }

  var observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-shown'); observer.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.04 })
    : null;

  function reveal(page) {
    var armed = [];
    page.querySelectorAll(':scope > section, :scope > div').forEach(function (el, i) {
      el.classList.remove('pv-reveal', 'is-shown');
      /* Anything already on screen stays on screen: a preview must never open
         onto blank space if the observer misbehaves. */
      if (!observer || i === 0 || el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('pv-reveal');
      observer.observe(el);
      armed.push(el);
    });
    setTimeout(function () { armed.forEach(function (el) { el.classList.add('is-shown'); }); }, 4000);
  }

  function closeDrawer() {
    document.querySelectorAll('[data-pv-drawer]').forEach(function (d) { d.hidden = true; });
    document.querySelectorAll('[data-pv-menu]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
    document.querySelectorAll('[data-header]').forEach(function (h) { h.classList.remove('is-solid'); });
    document.body.classList.remove('is-locked');
  }

  function closeLangMenus() {
    document.querySelectorAll('[data-pv-langswitch] .langmenu').forEach(function (m) { m.hidden = true; });
    document.querySelectorAll('[data-pv-langswitch] .langswitch__button').forEach(function (b) {
      b.setAttribute('aria-expanded', 'false');
    });
  }

  var currentPage = 'home';

  function show(lang, page) {
    if (LANGS.indexOf(lang) === -1) lang = 'en';
    if (PAGES.indexOf(page) === -1) page = 'home';

    document.documentElement.lang = lang;

    document.querySelectorAll('.pv-chrome').forEach(function (c) {
      c.classList.toggle('is-active', c.dataset.chrome === lang);
    });
    document.querySelectorAll('.pv-page').forEach(function (p) {
      var on = p.dataset.page === lang + '/' + page;
      p.classList.toggle('is-active', on);
      if (on) reveal(p);
    });

    var here = '#' + lang + '/' + page;
    document.querySelectorAll('.nav__link').forEach(function (a) {
      var on = a.getAttribute('href') === here;
      a.classList.toggle('is-current', on);
      if (on) { a.setAttribute('aria-current', 'page'); } else { a.removeAttribute('aria-current'); }
    });

    currentPage = page;
    closeDrawer();
    closeLangMenus();
    window.scrollTo(0, 0);
    return lang;
  }

  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-pv-menu]');
    if (toggle) {
      var chrome = toggle.closest('.pv-chrome');
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      closeDrawer();
      if (open) {
        toggle.setAttribute('aria-expanded', 'true');
        chrome.querySelector('[data-pv-drawer]').hidden = false;
        chrome.querySelector('[data-header]').classList.add('is-solid');
        document.body.classList.add('is-locked');
      }
      return;
    }

    /* The chrome is shared across pages, so its language links always point at
       the other language's home page. Route to the page actually being read. */
    var langLink = event.target.closest('.langmenu__item');
    if (langLink) {
      event.preventDefault();
      location.hash = '#' + langLink.getAttribute('hreflang') + '/' + currentPage;
      return;
    }

    var langBtn = event.target.closest('[data-pv-langswitch] .langswitch__button');
    if (langBtn) {
      var wasOpen = langBtn.getAttribute('aria-expanded') === 'true';
      closeLangMenus();
      if (!wasOpen) {
        langBtn.parentNode.querySelector('.langmenu').hidden = false;
        langBtn.setAttribute('aria-expanded', 'true');
      }
      event.stopPropagation();
      return;
    }

    if (!event.target.closest('[data-pv-langswitch]')) closeLangMenus();
    if (event.target.closest('[data-pv-drawer] a')) closeDrawer();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') { closeDrawer(); closeLangMenus(); }
  });

  function fromHash() {
    var parts = (location.hash || '').replace('#', '').split('/');
    return parts.length === 2 ? show(parts[0], parts[1]) : show('en', 'home');
  }

  window.addEventListener('hashchange', fromHash);
  say(NOTES[fromHash()] || NOTES.en);
})();
</script>
`;

mkdirSync(join(ROOT, 'preview'), { recursive: true });
writeFileSync(OUT, doc);
console.log(
  `${OUT} — ${(Buffer.byteLength(doc) / 1048576).toFixed(1)} MB, ` +
    `${pages.length} pages across ${LANGS.length} languages`,
);
