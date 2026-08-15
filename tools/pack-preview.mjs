/**
 * Package the built English site into one self-contained HTML file that can be
 * opened anywhere: no server, no external requests. Images and fonts are
 * inlined, and the seven pages are swapped client-side by hash.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'preview', 'aglaia-studios-preview.html');

const PAGES = [
  { key: 'home', dir: '', label: 'Home' },
  { key: 'studios', dir: 'studios', label: 'Studios' },
  { key: 'facilities', dir: 'facilities', label: 'Facilities' },
  { key: 'location', dir: 'location', label: 'Location' },
  { key: 'gallery', dir: 'photo-gallery', label: 'Photo Gallery' },
  { key: 'contact', dir: 'contact', label: 'Contact' },
  { key: 'cookies', dir: 'cookies-policy', label: 'Cookies Policy' },
];

const ROUTE_TO_HASH = {
  '/': '#home',
  '/studios/': '#studios',
  '/facilities/': '#facilities',
  '/location/': '#location',
  '/photo-gallery/': '#gallery',
  '/contact/': '#contact',
  '/cookies-policy/': '#cookies',
};

const read = (p) => readFileSync(join(DIST, p), 'utf8');

const home = read('index.html');

// ---- Shared chrome -------------------------------------------------------
const header = home.slice(home.indexOf('<header class="header"'), home.indexOf('</header>') + 9);
const drawerStart = home.indexOf('<div class="drawer"');
const drawerEnd = home.indexOf('<main id="main"');
const drawer = home.slice(drawerStart, drawerEnd);
const footer = home.slice(home.indexOf('<footer class="footer">'), home.indexOf('</footer>') + 9);

// ---- Per-page <main> -----------------------------------------------------
const images = new Set();
let lightbox = '';

/**
 * Templates always emit the lightbox as the last element of the page body, so
 * everything from its opening tag onwards is the dialog. Only the first one is
 * kept; the rest are dropped because the runtime binds a single root.
 */
function takeLightbox(body) {
  const i = body.indexOf('<div class="lightbox"');
  if (i === -1) return body;
  if (!lightbox) lightbox = body.slice(i);
  return body.slice(0, i);
}

function rewrite(fragment) {
  let out = fragment;

  // Internal links become hash routes.
  for (const [route, hash] of Object.entries(ROUTE_TO_HASH)) {
    out = out.replaceAll(`href="${route}"`, `href="${hash}"`);
  }

  // The preview carries English only; the other two are flagged, not broken.
  out = out.replace(/href="\/(el|fr)\/[^"]*"/g, (_, code) => `href="#" data-pv-lang="${code}"`);

  // <picture> collapses to its <img>; the srcset variants are not inlined.
  out = out.replace(/<picture([^>]*)>\s*(?:<source[^>]*>)?\s*(<img[^>]*>)\s*<\/picture>/g,
    (_, attrs, img) => `<span class="pv-pic"${attrs}>${img}</span>`);

  // Every image src becomes a lookup into the inlined dictionary.
  out = out.replace(/src="\/images\/([^"]+)"/g, (_, file) => {
    images.add(file);
    return `data-img="${file}" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="`;
  });

  // The preview supplies its own reveal handling.
  out = out.replaceAll(' data-reveal', '');
  return out;
}

const pages = PAGES.map((page) => {
  const html = read(join(page.dir, 'index.html'));
  let main = html.slice(html.indexOf('<main id="main"'), html.indexOf('</main>'));
  main = main.replace(/^<main[^>]*>/, '');
  return { ...page, html: rewrite(takeLightbox(main)) };
});

const chrome = {
  header: rewrite(header),
  drawer: rewrite(drawer),
  footer: rewrite(footer),
  lightbox: rewrite(lightbox),
};

// ---- Assets --------------------------------------------------------------
console.log(`inlining ${images.size} images…`);

const script = `
from PIL import Image
import base64, io, json, sys, pathlib
out = {}
for name in json.load(sys.stdin):
    p = pathlib.Path(${JSON.stringify(join(ROOT, 'public', 'images'))}) / name
    im = Image.open(p)
    fmt = 'PNG' if p.suffix == '.png' else 'WEBP'
    if im.width > 1100:
        im = im.resize((1100, round(im.height * 1100 / im.width)), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    if fmt == 'PNG':
        im.convert('RGBA').save(buf, 'WEBP', quality=90, method=6)
    else:
        im.convert('RGB').save(buf, 'WEBP', quality=68, method=6)
    out[name] = 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
json.dump(out, sys.stdout)
`;

const imageMap = JSON.parse(
  execFileSync('python3', ['-c', script], {
    input: JSON.stringify([...images]),
    maxBuffer: 1024 * 1024 * 200,
  }).toString(),
);

// Fonts: English needs the latin subsets only.
const FONTS = ['garamond-latin.woff2', 'inter-latin.woff2'];
let fontCss = readFileSync(join(ROOT, 'public/fonts/fonts.css'), 'utf8');
fontCss = fontCss
  .split('\n\n')
  .filter((block) => FONTS.some((f) => block.includes(f)))
  .map((block) =>
    block.replace(/url\(\/fonts\/([^)]+)\)/, (_, f) => {
      const data = readFileSync(join(ROOT, 'public/fonts', f)).toString('base64');
      return `url(data:font/woff2;base64,${data})`;
    }),
  )
  .join('\n\n');

const siteCss = readFileSync(join(DIST, 'styles/site.css'), 'utf8');
const siteJs = readFileSync(join(DIST, 'scripts/site.js'), 'utf8');

// ---- Assemble ------------------------------------------------------------
const nav = PAGES.map((p) => `${JSON.stringify(p.key)}`).join(',');

const doc = `<title>Aglaia Studios</title>
<style>
${fontCss}
${siteCss}

/* --- Preview shell ---------------------------------------------------- */
.pv-page { display: none; }
.pv-page.is-active { display: block; }
.pv-pic { display: block; }

.pv-reveal { opacity: 0; transform: translateY(1.5rem); }
.pv-reveal.is-shown {
  opacity: 1;
  transform: none;
  transition: opacity 0.7s var(--ease), transform 0.7s var(--ease);
}

.pv-note {
  position: fixed;
  left: 50%;
  bottom: 1.25rem;
  translate: -50% 0;
  z-index: 300;
  max-width: min(100% - 2rem, 30rem);
  padding: 0.8rem 1.1rem;
  border-radius: var(--radius);
  background: var(--ink-900);
  color: var(--sand-100);
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
${chrome.header}
${chrome.drawer}
<main id="main" class="main">
${pages.map((p) => `<div class="pv-page" data-page="${p.key}">\n${p.html}\n</div>`).join('\n')}
</main>
${chrome.footer}
${chrome.lightbox}
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
/* Preview router: hash -> page, plus the scroll reveal the real site does
   with server-rendered markup. */
(function () {
  var PAGES = [${nav}];
  var pages = document.querySelectorAll('.pv-page');
  var note = document.getElementById('pv-note');
  var noteTimer;

  function say(text) {
    note.textContent = text;
    note.hidden = false;
    clearTimeout(noteTimer);
    noteTimer = setTimeout(function () { note.hidden = true; }, 5000);
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
      // Anything already on screen stays on screen: a preview must never open
      // onto blank space if the observer misbehaves.
      if (!observer || i === 0 || el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('pv-reveal');
      observer.observe(el);
      armed.push(el);
    });

    // Safety net — nothing stays invisible for more than a moment.
    setTimeout(function () {
      armed.forEach(function (el) { el.classList.add('is-shown'); });
    }, 4000);
  }

  function show(key) {
    if (PAGES.indexOf(key) === -1) key = 'home';
    pages.forEach(function (p) {
      var active = p.dataset.page === key;
      p.classList.toggle('is-active', active);
      if (active) reveal(p);
    });
    document.querySelectorAll('.nav__link, .drawer .nav__link').forEach(function (a) {
      var on = a.getAttribute('href') === '#' + key;
      a.classList.toggle('is-current', on);
      if (on) { a.setAttribute('aria-current', 'page'); } else { a.removeAttribute('aria-current'); }
    });
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', function () {
    show(location.hash.replace('#', '') || 'home');
  });
  show(location.hash.replace('#', '') || 'home');

  // The artifact sandbox blocks third-party frames, so say so rather than
  // leaving an empty box where the map should be.
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-map-load]')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      say('Google Maps can’t load inside this preview — external embeds are blocked. It works on the real site.');
    }
    var external = e.target.closest('a[target="_blank"]');
    if (external && !external.href.startsWith('mailto:') && !external.href.startsWith('tel:')) {
      say('Opens ' + new URL(external.href).hostname + ' — external links are blocked in this preview.');
    }
  }, true);

  say('Preview of the English site — click through the menu. Photos are recompressed to fit in one file.');
})();
</script>
`;

mkdirSync(join(ROOT, 'preview'), { recursive: true });
writeFileSync(OUT, doc);
console.log(`${OUT} — ${(Buffer.byteLength(doc) / 1048576).toFixed(1)} MB, ${pages.length} pages`);
