import { featured } from '../content/site.mjs';
import { esc } from '../lib/html.mjs';
import { picture } from '../lib/image.mjs';
import { icon } from '../lib/icons.mjs';
import { url } from '../lib/routing.mjs';
import { pageHero, heading, ctaBand } from '../components.mjs';
import { lodgingBusiness, website, webPage, breadcrumbs } from '../lib/schema.mjs';

export const meta = (t) => ({
  title: t.facilities.title,
  description: t.facilities.description,
  heroImage: featured.facilitiesBanner,
  shareImage: 'terrace-shaded-pergola-bougainvillea',
  bodyClass: 'page-facilities',
});

export const schema = (t, lang) => [
  lodgingBusiness(t, lang),
  website(t, lang),
  webPage(t, lang, 'facilities', {
    title: t.facilities.title,
    description: t.facilities.description,
    image: featured.facilitiesBanner,
  }),
  breadcrumbs([
    { name: t.nav.home, url: url('home', lang) },
    { name: t.facilities.heroTitle, url: url('facilities', lang) },
  ]),
];

export function render(t, lang) {
  const f = t.facilities;

  return `
${pageHero({
  t,
  lang,
  route: 'facilities',
  image: featured.facilitiesBanner,
  title: f.heroTitle,
  subtitle: f.heroSubtitle,
})}

<section class="section">
  <div class="container">
    <div class="facilities">
      ${f.groups
        .map(
          (group) => `
      <section class="facilities__group" data-reveal>
        <h2 class="facilities__title">${esc(group.title)}</h2>
        <ul class="amenities amenities--stack">
          ${group.items
            .map(
              (item) => `
          <li class="amenity">
            ${icon(item.icon, { className: 'icon amenity__icon' })}
            <span>${esc(item.label)}</span>
          </li>`,
            )
            .join('\n')}
        </ul>
      </section>`,
        )
        .join('\n')}
    </div>
  </div>
</section>

<section class="section section--sand split" data-reveal>
  <div class="container split__inner">
    <div class="split__media">
      ${picture(featured.seaAccess, {
        alt: t.alt[featured.seaAccess],
        sizes: '(min-width: 900px) 50vw, 92vw',
        className: 'split__image',
        ratio: '4 / 3',
      })}
    </div>
    <div class="split__text">
      ${heading({ title: f.seaTitle })}
      <div class="prose"><p class="lede">${esc(f.seaBody)}</p></div>
    </div>
  </div>
</section>

${ctaBand(t)}`;
}
