import { featured } from '../content/site.mjs';
import { esc } from '../lib/html.mjs';
import { picture } from '../lib/image.mjs';
import { path } from '../lib/routing.mjs';

export const meta = (t) => ({
  title: t.notFound.title,
  description: t.notFound.description,
  bodyClass: 'page-404',
  noindex: true,
});

export function render(t, lang) {
  return `
<section class="notfound">
  ${picture(featured.galleryBanner, {
    alt: '',
    sizes: '100vw',
    priority: true,
    className: 'notfound__image',
  })}
  <div class="notfound__scrim"></div>
  <div class="container notfound__inner">
    <p class="eyebrow">404</p>
    <h1 class="notfound__title">${esc(t.notFound.heading)}</h1>
    <p class="notfound__body">${esc(t.notFound.body)}</p>
    <a class="btn btn--primary btn--lg" href="${esc(path('home', lang))}">${esc(t.notFound.cta)}</a>
  </div>
</section>`;
}
