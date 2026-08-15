/**
 * JSON-LD builders.
 *
 * Everything asserted here is a fact published on the site itself. Where there
 * is no data — nightly rates, a star rating, review scores — the property is
 * left out rather than guessed, because fabricated structured data is both a
 * manual-action risk and simply untrue.
 */

import { site, galleries, featured } from '../content/site.mjs';
import { url } from './routing.mjs';
import { imageUrl } from './image.mjs';

const ID = {
  business: `${site.origin}/#lodging`,
  website: `${site.origin}/#website`,
};

/** The accommodation itself — the node every page links back to. */
export function lodgingBusiness(t, lang) {
  const a = site.contact.address;

  const amenities = [...t.accommodation.services.room, ...t.accommodation.services.complex].map(
    (name) => ({ '@type': 'LocationFeatureSpecification', name, value: true }),
  );

  return {
    '@type': 'LodgingBusiness',
    '@id': ID.business,
    name: site.name,
    url: url('home', lang),
    description: t.home.description,
    image: [
      imageUrl('aerial-over-kolympithres-bay', site.origin),
      imageUrl('anna-studios-seen-from-the-garden', site.origin),
      imageUrl('studio-double-bed-with-doors-thrown-open', site.origin),
      imageUrl('apartment-for-four-pergola-terrace', site.origin),
    ],
    telephone: site.contact.phone,
    email: site.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.locality,
      addressLocality: a.locality,
      addressRegion: `${a.region}, ${a.area}`,
      addressCountry: a.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.contact.geo.lat,
      longitude: site.contact.geo.lng,
    },
    hasMap: site.links.mapView,
    sameAs: [site.links.instagram, site.links.facebook, site.links.tripadvisor],
    /** The old site listed exactly these two under "Credit cards accepted". */
    paymentAccepted: 'Visa, Mastercard',
    currenciesAccepted: 'EUR',
    checkinTime: '14:00',
    checkoutTime: '11:00',
    amenityFeature: amenities,
    /** Greek tourism registration number (αριθμός γνωστοποίησης). */
    identifier: {
      '@type': 'PropertyValue',
      name: 'EOT registration number',
      value: site.eotLicense,
    },
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: site.booking.url,
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
    mainEntity: t.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** The photo gallery, so image search can associate captions with the property. */
export function imageGallery(t, lang) {
  const slugs = [
    ...galleries.doubleRoom,
    ...galleries.doubleStudio,
    ...galleries.apartmentTwo,
    ...galleries.apartmentFour,
    ...galleries.island,
  ];

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

/**
 * The four accommodation types. Only what the site states is asserted — the
 * name, the description and how many people it sleeps. No price, no rating.
 */
export function accommodationTypes(t, lang) {
  const bySlug = {
    doubleRoom: galleries.doubleRoom[0],
    doubleStudio: galleries.doubleStudio[0],
    apartmentTwo: galleries.apartmentTwo[0],
    apartmentFour: galleries.apartmentFour[0],
  };

  return Object.entries(t.accommodation.rooms).map(([key, room], index) => ({
    '@type': 'Accommodation',
    '@id': `${url('accommodation', lang)}#${key}`,
    name: room.name,
    description: room.body,
    occupancy: {
      '@type': 'QuantitativeValue',
      maxValue: [2, 2, 3, 4][index],
      unitCode: 'C62',
    },
    image: imageUrl(bySlug[key], site.origin),
    containedInPlace: { '@id': ID.business },
  }));
}

/** Shown on the gallery banner and share cards. */
export const defaultImage = featured.hero;

export const schemaIds = ID;
