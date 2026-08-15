/**
 * The CoVID-19 notice — the old /covid-19/ page.
 *
 * Reproduced word for word in all four languages. It is kept because the URL
 * was published and indexed; the text is the owner's, unedited.
 */

import { featured } from '../content/site.mjs';
import { esc } from '../lib/html.mjs';
import { url } from '../lib/routing.mjs';
import { pageHero, ctaBand } from '../components.mjs';
import { lodgingBusiness, website, webPage, breadcrumbs } from '../lib/schema.mjs';

export const meta = (t) => ({
  title: t.notice.title,
  description: t.notice.description,
  heroImage: featured.noticeBanner,
  shareImage: featured.noticeBanner,
  bodyClass: 'page-notice',
});

export const schema = (t, lang) => [
  lodgingBusiness(t, lang),
  website(t, lang),
  webPage(t, lang, 'notice', {
    title: t.notice.title,
    description: t.notice.description,
    image: featured.noticeBanner,
  }),
  breadcrumbs([
    { name: t.nav.home, url: url('home', lang) },
    { name: t.nav.notice, url: url('notice', lang) },
  ]),
];

export function render(t, lang) {
  return [
    pageHero({
      t,
      lang,
      image: featured.noticeBanner,
      title: t.notice.heroTitle,
      subtitle: t.notice.heroSubtitle,
    }),
    `
<section class="section" aria-labelledby="notice-title">
  <div class="container container--narrow">
    <h2 class="u-visually-hidden" id="notice-title">${esc(t.notice.heroTitle)}</h2>
    <div class="longform">
      ${t.notice.body.map((p) => `<p>${esc(p)}</p>`).join('\n')}
    </div>
  </div>
</section>`,
    ctaBand(t),
  ].join('\n');
}
