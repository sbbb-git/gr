/**
 * Single source of truth for everything that is not translated copy:
 * business facts, external links, media selections and build settings.
 *
 * Every value here was carried over from the previous aglaiastudios.gr site.
 */

export const site = {
  /** Production origin — used for canonicals, Open Graph URLs and the sitemap. */
  origin: 'https://aglaiastudios.gr',

  name: 'Aglaia Studios',
  legalName: 'Aglaia Studios',

  /** Greek National Tourism Organisation licence, shown in the footer as required. */
  eotLicense: '1242674VER1',

  contact: {
    phone: '+30 22840 31513',
    phoneHref: '+302284031513',
    email: 'antonishris@hotmail.com',
    address: {
      street: 'Agia Marina',
      locality: 'Kamares',
      region: 'Sifnos',
      island: 'Sifnos Island',
      country: 'Greece',
      countryCode: 'GR',
    },
    geo: { lat: 36.9941033, lng: 24.6748554 },
  },

  links: {
    maps: 'https://maps.app.goo.gl/bS2jA1uXBtsnAc8YA',
    instagram: 'https://www.instagram.com/studiosaglaia?igsh=N2g2eHk1azYyaTB2',
    facebook: 'https://www.facebook.com/share/16fuz48Qcc/?mibextid=wwXIfr',
    facebookPage: 'https://www.facebook.com/Aglaiastudios',
    liveCamera:
      'https://www.skylinewebcams.com/webcam/ellada/naigaio/kyklades/kamares-sifnos-island.html',
    booking: 'https://aglaiastudios.book-onlinenow.net/',
    bookingEngine: 'https://aglaiastudios.book-onlinenow.net/index.aspx',
    bookingCom: 'https://www.booking.com/hotel/gr/aglaia-studios.html',
    video: 'https://www.youtube.com/watch?v=iNx5UHXXG5c',
    credit: 'https://codibee.com/',
  },

  /**
   * How the contact form is delivered.
   *   'mailto'   — no backend: the browser opens a pre-filled email (default).
   *   'endpoint' — POST the form as JSON to `formEndpoint` (Formspree, Web3Forms…).
   *   'netlify'  — plain form POST captured by Netlify Forms.
   * See README.md for how to switch.
   */
  form: {
    provider: 'mailto',
    endpoint: '',
  },

  /** Exact field contract of the booking engine, preserved from the old site. */
  booking: {
    action: 'https://aglaiastudios.book-onlinenow.net/index.aspx',
    maxRooms: 5,
    maxAdults: 6,
    maxChildren: 5,
    maxInfants: 4,
  },

  /**
   * Drone film used as the hero background, exactly as the previous site did.
   * Served from youtube-nocookie.com and disclosed in the cookies policy.
   */
  heroVideo: {
    id: 'iNx5UHXXG5c',
    title: 'Aglaia Studios from above',
    poster: 'aerial-hero-frame',
  },

  languages: ['en', 'el', 'fr'],
  defaultLanguage: 'en',

  /**
   * Image used for Open Graph / Twitter when a page does not name its own.
   * Share images are picked from the 2400px masters so the rendition social
   * networks fetch is at least 1200px wide.
   */
  defaultShareImage: 'stone-terrace-above-the-blue-bay',
};

/**
 * Ordered photo sets. Keys are slugs from src/content/media.json; the alt text
 * for each lives in the language files so it can be translated.
 */
export const galleries = {
  exterior: [
    'aerial-aglaia-studios-coastline',
    'terrace-view-over-kamares-bay',
    'stone-terrace-above-the-blue-bay',
    'aerial-swimming-turquoise-water-boat',
    'sun-terrace-over-the-sea',
    'sunset-wine-on-the-terrace',
    'terrace-shaded-pergola-bougainvillea',
    'terrace-blue-door-bougainvillea',
    'terrace-sea-view-sunbed',
    'terrace-from-above-sea-view',
    'whitewashed-facade-blue-doors-sunbeds',
    'seaside-path-along-the-studios',
    'courtyard-sunbeds-blue-shutters',
    'terrace-table-chairs-pergola',
    'terrace-sunbeds-mountain-view',
    'sunbed-overlooking-kamares-bay',
    'breakfast-table-view-kamares-village',
    'sunset-dinner-table-sea-view',
    'sunset-over-the-aegean-from-the-path',
    'golden-hour-terrace-with-wine',
    'blue-doors-and-terrace-furniture',
    'table-facing-the-calm-sea',
    'aerial-aglaia-studios-rocky-shore',
  ],
  interior: [
    'studio-double-bed-sea-view-door',
    'studio-living-area-corner-sofa',
    'studio-kitchenette-door-to-terrace',
    'studio-double-bed-bedside-lamps',
    'studio-twin-beds',
    'studio-double-room-armchair',
    'studio-kitchenette-and-sofa',
    'studio-coffee-corner-sea-doorway',
    'studio-double-bed-fresh-towels',
    'studio-bedroom-with-tv-and-desk',
    'studio-twin-beds-traditional',
    'studio-bedroom-with-mirror',
    'studio-bed-with-white-canopy',
    'studio-seating-corner-and-storage',
    'studio-modern-bathroom',
    'studio-bathroom-basin-and-shower',
    'studio-bathroom-walk-in-shower',
    'studio-dressing-table-and-bathroom',
    'studio-bed-stone-alcove-detail',
    'studio-wrought-iron-bed-detail',
  ],
};

/** Photos featured outside the main gallery. */
export const featured = {
  hero: 'aerial-hero-frame',
  welcome: 'terrace-view-over-kamares-bay',
  studios: [
    'studio-double-bed-sea-view-door',
    'studio-living-area-corner-sofa',
    'studio-double-room-armchair',
    'studio-modern-bathroom',
  ],
  history: 'kamares-bay-by-moonlight',
  facilitiesBanner: 'sea-view-from-the-terrace-banner',
  locationBanner: 'sunset-panorama-from-the-terrace',
  galleryBanner: 'aegean-sunset-banner',
  studiosBanner: 'terrace-sea-view-sunbed',
  contactBanner: 'sunset-wine-on-the-terrace',
  seaAccess: 'aerial-swimming-turquoise-water-boat',
  galleryStrip: [
    'stone-terrace-above-the-blue-bay',
    'studio-double-bed-sea-view-door',
    'sunset-dinner-table-sea-view',
    'whitewashed-facade-blue-doors-sunbeds',
    'aerial-swimming-turquoise-water-boat',
    'studio-living-area-corner-sofa',
  ],
};

/**
 * Route table. `slug` is shared by every language; non-default languages are
 * served from a /<lang>/ prefix, which keeps hreflang mapping one-to-one.
 */
export const routes = [
  { key: 'home', slug: '', template: 'home', priority: '1.0' },
  { key: 'studios', slug: 'studios', template: 'studios', priority: '0.9' },
  { key: 'facilities', slug: 'facilities', template: 'facilities', priority: '0.8' },
  { key: 'location', slug: 'location', template: 'location', priority: '0.8' },
  { key: 'gallery', slug: 'photo-gallery', template: 'gallery', priority: '0.8' },
  { key: 'contact', slug: 'contact', template: 'contact', priority: '0.7' },
  { key: 'cookies', slug: 'cookies-policy', template: 'cookies', priority: '0.2' },
];
