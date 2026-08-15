import { featured } from '../content/site.mjs';
import { esc, paragraphs } from '../lib/html.mjs';
import { picture } from '../lib/image.mjs';
import { url } from '../lib/routing.mjs';
import {
  pageHero,
  heading,
  contactCards,
  mapEmbed,
  liveCameraCard,
  ctaBand,
} from '../components.mjs';
import { lodgingBusiness, website, webPage, breadcrumbs } from '../lib/schema.mjs';

export const meta = (t) => ({
  title: t.location.title,
  description: t.location.description,
  heroImage: featured.locationBanner,
  shareImage: 'terrace-view-over-kamares-bay',
  bodyClass: 'page-location',
});

export const schema = (t, lang) => [
  lodgingBusiness(t, lang),
  website(t, lang),
  webPage(t, lang, 'location', {
    title: t.location.title,
    description: t.location.description,
    image: featured.locationBanner,
  }),
  breadcrumbs([
    { name: t.nav.home, url: url('home', lang) },
    { name: t.location.heroTitle, url: url('location', lang) },
  ]),
];

export function render(t, lang) {
  const l = t.location;

  return `
${pageHero({
  t,
  lang,
  route: 'location',
  image: featured.locationBanner,
  title: l.heroTitle,
  subtitle: l.heroSubtitle,
})}

<section class="section split" data-reveal>
  <div class="container split__inner">
    <div class="split__text">
      <div class="prose">${paragraphs(l.body.map(esc), 'lede')}</div>
      ${liveCameraCard(t)}
    </div>
    <div class="split__media split__media--arch">
      ${picture('stone-terrace-above-the-blue-bay', {
        alt: t.alt['stone-terrace-above-the-blue-bay'],
        sizes: '(min-width: 900px) 46vw, 92vw',
        className: 'split__image',
        ratio: '4 / 5',
      })}
    </div>
  </div>
</section>

<section class="section section--sand" data-reveal>
  <div class="container">
    ${heading({ title: l.mapTitle, align: 'center' })}
    ${mapEmbed(t)}
    ${contactCards(t)}
  </div>
</section>

${ctaBand(t)}`;
}
