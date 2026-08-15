/**
 * Single source of truth for everything that is not translated copy:
 * business facts, external links, media selections and build settings.
 *
 * Every value here was read off the previous studioannaparos.gr site. Nothing
 * is asserted that the old site did not publish — there is no invented price,
 * rating, review count or distance anywhere in this project.
 */

export const site = {
  /** Production origin — used for canonicals, Open Graph URLs and the sitemap. */
  origin: 'https://studioannaparos.gr',

  name: 'Anna Studios',
  legalName: 'Anna Studios',

  /** Greek tourism registration (αριθμός γνωστοποίησης), shown in the footer. */
  eotLicense: '1165202',

  contact: {
    phone: '+30 22840 51007',
    phoneHref: '+302284051007',
    mobile: '+30 6974 757 611',
    mobileHref: '+306974757611',
    email: 'info@studioannaparos.gr',
    address: {
      locality: 'Kolympithres',
      region: 'Paros',
      area: 'Cyclades',
      country: 'Greece',
      countryCode: 'GR',
    },
    /**
     * Read out of the owner's own Google My Maps pin (the map the old location
     * page embedded), not looked up or estimated:
     * https://www.google.com/maps/d/kml?mid=zXOjcWYTSmMc.knNhvErYiVw4
     */
    geo: { lat: 37.1198413, lng: 25.2162302 },
  },

  links: {
    /**
     * The owner's own Google My Maps pin. Loaded only after the visitor asks —
     * see the click-to-load map on the location page.
     */
    mapEmbed: 'https://mapsengine.google.com/map/embed?mid=zXOjcWYTSmMc.knNhvErYiVw4',
    mapView: 'https://mapsengine.google.com/map/viewer?mid=zXOjcWYTSmMc.knNhvErYiVw4',
    instagram: 'https://www.instagram.com/anna_studios_paros/',
    facebook: 'https://www.facebook.com/216593868479323',
    tripadvisor:
      'https://www.tripadvisor.com.gr/Hotel_Review-g4564016-d4355196-Reviews-Anna_Studios-Livadia_Paros_Cyclades_South_Aegean.html',
    /** "Google Reviews" in the old main menu, kept verbatim. */
    googleReviews:
      'https://www.google.com/search?tbs=lf:1,lf_ui:2&tbm=lcl&sxsrf=APwXEdcpCI5ULR5y9S4ud5ltYZjPdIn4iA:1680680053132&q=anna+studios+paros&rflfq=1&num=10&rldimm=5492076423611075696&ved=2ahUKEwiX17CMnZL-AhVnVfEDHbdhBC0Qu9QIegQICxAK',
  },

  /**
   * The booking engine. The old site linked this exact URL — including
   * `lang=en` — from every language, so it is reproduced character for
   * character rather than guessed at. See README.md ("Booking engine").
   */
  booking: {
    url: 'https://reservations.bookoncloud.com/welcome/studioannaparos?lang=en&channelId=website#/availability',
    property: 'studioannaparos',
    channelId: 'website',
    lang: 'en',
  },

  /**
   * How the reservation request form is delivered.
   *   'mailto'   — no backend: the browser opens a pre-filled email (default).
   *   'endpoint' — POST the form as JSON to `form.endpoint`.
   *   'netlify'  — plain form POST captured by Netlify Forms.
   * The field names below reproduce the old Divi form exactly, so an existing
   * inbox filter or CRM mapping keeps working. Dates use the old d-m-Y format.
   */
  form: {
    provider: 'mailto',
    endpoint: '',
    /** Exact field contract of the old /reservations/ form. */
    fields: {
      name: 'et_pb_contact_name1_0',
      email: 'et_pb_contact_email_0',
      phone: 'et_pb_contact_phone_0',
      address: 'et_pb_contact_address_0',
      adults: 'et_pb_contact_adults_0',
      kids: 'et_pb_contact_kids_0',
      roomType: 'et_pb_contact_room_type_0',
      arrival: 'et_pb_contact_arrival_0',
      departure: 'et_pb_contact_departure_0',
      message: 'et_pb_contact_message_0',
    },
    /** Option values, verbatim from the old <select> elements. */
    adults: ['1', '2', '3', '4'],
    kids: ['0', '1', '2', '3'],
    /** d-m-Y, exactly as the old datepicker was configured. */
    dateFormat: 'd-m-Y',
  },

  languages: ['en', 'el', 'it', 'fr'],
  defaultLanguage: 'en',

  /**
   * Image used for Open Graph / Twitter when a page does not name its own.
   * Share images come from the 2000px masters, so the rendition a social
   * network fetches is comfortably over 1200px wide.
   */
  defaultShareImage: 'aerial-over-kolympithres-bay',
};

/**
 * Ordered photo sets. Keys are slugs from src/content/media.json; the alt text
 * for each lives in the language files so it can be translated.
 *
 * The four room sets are exactly the sets the old /accomodation/ page showed,
 * in the order it showed them.
 */
export const galleries = {
  doubleRoom: [
    'double-room-twin-beds-and-balcony-door',
    'double-room-balcony-with-sun-hat',
    'double-room-bathroom-with-blue-tiles',
    'double-room-terrace-table-and-chairs',
    'double-room-desk-mirror-and-kettle',
    'double-room-terrace-over-the-garden',
    'double-room-twin-beds-and-wardrobe',
    'double-room-veranda-under-the-trees',
    'double-room-bed-facing-the-balcony',
    'double-room-twin-beds-and-television',
  ],
  doubleStudio: [
    'studio-twin-beds-against-the-blue-wall',
    'studio-kitchenette-beside-the-doorway',
    'studio-pergola-terrace-under-the-tree',
    'studio-looking-through-to-the-kitchenette',
    'studio-twin-beds-and-open-shelving',
    'studio-bed-with-the-kitchen-beyond',
    'studio-double-bed-with-doors-thrown-open',
    'studio-terrace-table-under-the-pergola',
    'studio-double-bed-and-blue-wall',
    'studio-bathroom-with-basin-and-shower',
    'studio-veranda-beside-the-vines',
    'studio-veranda-looking-over-the-garden',
    'studio-balcony-with-village-and-sea',
    'studio-kitchenette-and-single-bed',
  ],
  apartmentTwo: [
    'apartment-for-two-double-bed-and-balcony',
    'apartment-for-two-bedroom-with-shutters',
    'apartment-for-two-kitchenette-and-window',
    'apartment-for-two-dining-corner',
    'apartment-for-two-shower-room',
    'apartment-for-two-balcony-among-the-trees',
    'apartment-for-two-bathroom-basin',
  ],
  apartmentFour: [
    'apartment-for-four-bedroom-and-wardrobe',
    'apartment-for-four-hallway-between-rooms',
    'apartment-for-four-double-bed-and-desk',
    'apartment-for-four-terrace-facing-inland',
    'apartment-for-four-kitchen-and-dining-table',
    'apartment-for-four-dining-area-and-twin-beds',
    'apartment-for-four-bathroom-with-blue-tiles',
    'apartment-for-four-pergola-terrace',
  ],
  island: [
    'aerial-over-kolympithres-bay',
    'anna-studios-seen-from-the-garden',
    'kolympithres-beach-swimmers-and-boat',
    'kolympithres-rock-formations',
    'paros-islet-chapel-in-naoussa-bay',
    'naoussa-waterfront-from-the-sea',
    'naoussa-harbour-tavernas-at-dusk',
    'naoussa-harbour-at-blue-hour',
    'naoussa-fishing-boats-reflected',
    'ekatontapyliani-church-interior',
    'terrace-table-with-bougainvillea-and-sea',
    'balcony-table-with-palms-and-hills',
    'veranda-table-facing-the-hills',
    'anna-studios-entrance-sign',
    'anna-studios-garden-and-drive',
    'twin-room-with-desk-and-wardrobe',
  ],
};

/**
 * The home-page slideshow, in the order the old Divi slider ran, each with the
 * headline that sat on it. Slide four carried no headline on the old site.
 */
export const slideshow = [
  { image: 'paros-islet-chapel-in-naoussa-bay', key: 'welcome' },
  { image: 'aerial-over-kolympithres-bay', key: 'hospitality' },
  { image: 'kolympithres-beach-swimmers-and-boat', key: 'swim' },
  { image: 'anna-studios-seen-from-the-garden', key: 'stay' },
  { image: 'naoussa-harbour-tavernas-at-dusk', key: 'nightlife' },
  { image: 'ekatontapyliani-church-interior', key: 'monuments' },
];

/** Photos featured outside the galleries. */
export const featured = {
  hero: 'paros-islet-chapel-in-naoussa-bay',
  welcome: 'terrace-table-with-bougainvillea-and-sea',
  accommodationBanner: 'studio-double-bed-with-doors-thrown-open',
  locationBanner: 'naoussa-waterfront-from-the-sea',
  galleryBanner: 'kolympithres-rock-formations',
  reservationsBanner: 'balcony-table-with-palms-and-hills',
  noticeBanner: 'anna-studios-garden-and-drive',
  homeStrip: [
    'studio-double-bed-with-doors-thrown-open',
    'kolympithres-beach-swimmers-and-boat',
    'apartment-for-four-pergola-terrace',
    'naoussa-harbour-at-blue-hour',
    'double-room-twin-beds-and-balcony-door',
    'terrace-table-with-bougainvillea-and-sea',
  ],
};

/**
 * The four room types, in the order the old accommodation page listed them.
 * `gallery` names the photo set; copy and headings live in the language files.
 */
export const roomTypes = [
  { key: 'doubleRoom', gallery: 'doubleRoom', sleeps: 2 },
  { key: 'doubleStudio', gallery: 'doubleStudio', sleeps: 2 },
  { key: 'apartmentTwo', gallery: 'apartmentTwo', sleeps: 3 },
  { key: 'apartmentFour', gallery: 'apartmentFour', sleeps: 4 },
];

/**
 * Route table. Slugs are per language because that is how the old site was
 * published; every path it served is still served here. Reservations did not
 * exist in Italian or French before — those two slugs are new.
 */
export const routes = [
  {
    key: 'home',
    template: 'home',
    priority: '1.0',
    slugs: { en: '', el: '', it: '', fr: '' },
  },
  {
    key: 'accommodation',
    template: 'accommodation',
    priority: '0.9',
    slugs: {
      en: 'accomodation',
      el: 'διαμονή',
      it: 'sistemazione',
      fr: 'hebergement',
    },
  },
  {
    key: 'location',
    template: 'location',
    priority: '0.8',
    slugs: { en: 'location', el: 'τοποθεσία', it: 'localita', fr: 'location-2' },
  },
  {
    key: 'gallery',
    template: 'gallery',
    priority: '0.8',
    slugs: { en: 'photos', el: 'φωτογραφίες', it: 'fotografie', fr: 'photos-fr' },
  },
  {
    key: 'reservations',
    template: 'reservations',
    priority: '0.9',
    slugs: {
      en: 'reservations',
      el: 'κρατήσεις',
      it: 'prenotazioni',
      fr: 'reservations',
    },
  },
  {
    key: 'notice',
    template: 'notice',
    priority: '0.3',
    slugs: {
      en: 'covid-19',
      el: 'covid-19-2',
      it: 'covid-19-italiano',
      fr: 'covid-19-3',
    },
  },
];

/**
 * Paths the old site published for its language home pages. They carried
 * auto-generated WordPress slugs (`/el/829-2/`), so they are retired to a clean
 * `/el/` with a 301 — which is what passes their ranking on — and a static stub
 * is emitted as well so the redirect also works on hosts with no rules engine.
 */
export const legacyRedirects = [
  { from: '/el/829-2/', to: 'home', lang: 'el' },
  { from: '/el/ελληνικά/', to: 'home', lang: 'el' },
  { from: '/it/italiano/', to: 'home', lang: 'it' },
  { from: '/fr/francais/', to: 'home', lang: 'fr' },
];
