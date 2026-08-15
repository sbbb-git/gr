/**
 * JSON-LD builders.
 *
 * Everything asserted here is a fact published on the site itself. Where we
 * have no data — nightly rates, star rating, review scores — the property is
 * left out rather than guessed, because fabricated structured data is a
 * manual-action risk and simply untrue.
 */

import { site, galleries } from '../content/site.mjs';
import { url } from './routing.mjs';
import { imageUrl } from './image.mjs';

const ID = {
  business: `${site.origin}/#lodging`,
  website: `${site.origin}/#website`,
};

/** The accommodation itself — the node every page links back to. */
export function lodgingBusiness(t, lang) {
  const a = site.contact.address;

  const amenities = t.facilities.groups.flatMap((group) =>
    group.items.map((item) => ({
      '@type': 'LocationFeatureSpecification',
      name: item.label,
      value: true,
    })),
  );

  return {
    '@type': 'LodgingBusiness',
    '@id': ID.business,
    name: site.name,
    url: url('home', lang),
    description: t.home.description,
    image: [
      imageUrl('aerial-aglaia-studios-coastline', site.origin),
      imageUrl('terrace-view-over-kamares-bay', site.origin),
      imageUrl('studio-double-bed-sea-view-door', site.origin),
      imageUrl('sunset-wine-on-the-terrace', site.origin),
    ],
    logo: imageUrl('aglaia-studios-logo', site.origin),
    telephone: site.contact.phone,
    email: site.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${a.street} – ${a.locality}`,
      addressLocality: a.locality,
      addressRegion: a.region,
      addressCountry: a.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.contact.geo.lat,
      longitude: site.contact.geo.lng,
    },
    hasMap: site.links.maps,
    sameAs: [site.links.instagram, site.links.facebookPage, site.links.bookingCom],
    paymentAccepted: 'Cash, Visa, Mastercard, Revolut',
    currenciesAccepted: 'EUR',
    amenityFeature: amenities,
    /** Greek National Tourism Organisation licence number. */
    identifier: {
      '@type': 'PropertyValue',
      name: 'EOT License',
      value: site.eotLicense,
    },
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: site.links.booking,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
      result: { '@type': 'LodgingReservation', name: t.nav.book },
    },
  };
}

export function website(t, lang) {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: url('home', lang),
    name: site.name,
    inLanguage: t.htmlLang,
    publisher: { '@id': ID.business },
  };
}

export function webPage(t, lang, route, { title, description, image }) {
  return {
    '@type': 'WebPage',
    '@id': `${url(route, lang)}#webpage`,
    url: url(route, lang),
    name: title,
    description,
    inLanguage: t.htmlLang,
    isPartOf: { '@id': ID.website },
    about: { '@id': ID.business },
    primaryImageOfPage: image ? imageUrl(image, site.origin) : undefined,
  };
}

export function breadcrumbs(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqPage(t) {
  return {
    '@type': 'FAQPage',
    mainEntity: t.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** The photo gallery, so image search can associate captions with the property. */
export function imageGallery(t, lang) {
  const slugs = [...galleries.exterior, ...galleries.interior];
  return {
    '@type': 'ImageGallery',
    '@id': `${url('gallery', lang)}#gallery`,
    name: t.gallery.heroTitle,
    inLanguage: t.htmlLang,
    associatedMedia: slugs.map((slug) => ({
      '@type': 'ImageObject',
      contentUrl: imageUrl(slug, site.origin),
      caption: t.alt[slug] ?? site.name,
    })),
  };
}

export const schemaIds = ID;
