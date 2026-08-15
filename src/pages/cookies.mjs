import { featured } from '../content/site.mjs';
import { esc, join } from '../lib/html.mjs';
import { url } from '../lib/routing.mjs';
import { pageHero } from '../components.mjs';
import { website, webPage, breadcrumbs } from '../lib/schema.mjs';

export const meta = (t) => ({
  title: t.cookies.title,
  description: t.cookies.description,
  heroImage: featured.galleryBanner,
  shareImage: featured.galleryBanner,
  bodyClass: 'page-legal',
});

export const schema = (t, lang) => [
  website(t, lang),
  webPage(t, lang, 'cookies', {
    title: t.cookies.title,
    description: t.cookies.description,
  }),
  breadcrumbs([
    { name: t.nav.home, url: url('home', lang) },
    { name: t.cookies.heroTitle, url: url('cookies', lang) },
  ]),
];

function definitions(list) {
  if (!list?.length) return '';
  return `<dl class="legal__defs">
${list
  .map((d) => `<dt>${d.term}</dt><dd>${d.body}</dd>`)
  .join('\n')}
</dl>`;
}

function table(tbl, label) {
  // tabindex makes the horizontally scrolling wrapper reachable by keyboard.
  return `
<div class="legal__tablewrap" tabindex="0" role="region" aria-label="${esc(label)}">
  <table class="legal__table">
    <caption>${esc(tbl.caption)}</caption>
    <thead>
      <tr>${tbl.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${tbl.rows
        .map(
          (row) =>
            `<tr>${row
              .map((cell, i) =>
                i === 0
                  ? `<th scope="row"><code>${esc(cell)}</code></th>`
                  : `<td>${esc(cell)}</td>`,
              )
              .join('')}</tr>`,
        )
        .join('\n')}
    </tbody>
  </table>
</div>`;
}

export function render(t, lang, { cookies }) {
  return `
${pageHero({
  t,
  lang,
  route: 'cookies',
  image: featured.galleryBanner,
  title: t.cookies.heroTitle,
  subtitle: t.cookies.heroSubtitle,
})}

<section class="section">
  <div class="container container--narrow legal">
    ${join(cookies.intro.map((p) => `<p class="lede">${p}</p>`))}

    ${join(
      cookies.sections.map(
        (section) => `
    <section class="legal__section">
      <h2>${esc(section.title)}</h2>
      ${join((section.blocks ?? []).map((p) => `<p>${p}</p>`))}
      ${definitions(section.definitions)}
      ${join((section.after ?? []).map((p) => `<p>${p}</p>`))}
    </section>`,
      ),
    )}

    <section class="legal__section">
      ${table(cookies.table, cookies.table.caption)}
      <h3>${esc(cookies.table.third.title)}</h3>
      <p>${cookies.table.third.body}</p>
      <ul class="legal__list">
        ${join(cookies.table.third.items.map((i) => `<li>${i}</li>`))}
      </ul>
    </section>

    ${join(
      cookies.after.map(
        (section) => `
    <section class="legal__section">
      <h2>${esc(section.title)}</h2>
      ${join((section.blocks ?? []).map((p) => `<p>${p}</p>`))}
      ${
        section.links
          ? `<ul class="legal__list">${join(
              section.links.map(
                (l) =>
                  `<li><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer nofollow">${esc(l.label)}</a></li>`,
              ),
            )}</ul>`
          : ''
      }
      ${section.linksAfter ? `<p class="legal__note">${esc(section.linksAfter)}</p>` : ''}
    </section>`,
      ),
    )}
  </div>
</section>`;
}
