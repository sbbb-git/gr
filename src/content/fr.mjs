/**
 * Français.
 *
 * Les textes déjà présents sur l'ancien site sont repris mot pour mot ; tout
 * ce qui est nouveau (FAQ, libellés d'interface) ne s'appuie que sur des
 * informations qui y figuraient déjà.
 */

export default {
  code: 'fr',
  htmlLang: 'fr',
  locale: 'fr_FR',
  bookingLang: 'fr_FR',
  label: 'Français',
  labelShort: 'FR',

  nav: {
    home: 'Accueil',
    studios: 'Studios',
    facilities: 'Équipements',
    location: 'Emplacement',
    gallery: 'Galerie Photos',
    camera: 'Caméra en Direct',
    contact: 'Contactez-nous',
    book: 'Réservez Maintenant',
    cookies: 'Politique de Cookies',
  },

  ui: {
    skipToContent: 'Aller au contenu',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    menu: 'Menu',
    close: 'Fermer',
    previous: 'Précédente',
    next: 'Suivante',
    breadcrumb: "Fil d'Ariane",
    languageSwitcher: 'Choisir une langue',
    backToTop: 'Retour en haut',
    scrollDown: 'Faire défiler',
    viewGallery: 'Voir la galerie',
    viewAllPhotos: 'Voir toutes les photos',
    readMore: 'En savoir plus',
    seeStudios: 'Voir les studios',
    dragToExplore: 'Faites glisser pour explorer',
    seeFacilities: 'Voir tous les équipements',
    seeLocation: "Voir l'emplacement",
    opensNewTab: 'ouvre un nouvel onglet',
    image: 'Photo',
    of: 'sur',
    callUs: 'Appelez-nous',
    emailUs: 'Écrivez-nous',
    getDirections: "Obtenir l'itinéraire",
    watchLive: 'Voir la caméra en direct',
    pauseVideo: 'Mettre la vidéo en pause',
    playVideo: 'Lancer la vidéo',
    langSuggest: 'Cette page est aussi disponible en français.',
    langSuggestAction: 'Lire en français',
  },

  address: {
    line1: 'AGIA MARINA – KAMARES',
    line2: 'ÎLE DE SIFNOS',
    line3: 'GRÈCE',
    short: 'Agia Marina – Kamares, île de Sifnos, Grèce',
  },

  booking: {
    title: 'Vérifier les disponibilités',
    checkin: 'Arrivée',
    checkout: 'Départ',
    rooms: 'Chambres',
    adults: 'Adultes',
    children: 'Enfants',
    infants: 'Bébés',
    submit: 'Réservez Maintenant',
    note: 'Meilleur tarif garanti en réservant en direct.',
    directLink: 'Ouvrir la page de réservation',
  },

  home: {
    title: 'Aglaia Studios Sifnos | Studios en bord de mer à Kamares',
    description:
      "Studios en bord de mer à Agia Marina, Kamares, sur l'île de Sifnos. Vue sur la mer, accès direct à l'eau, transats et ménage quotidien. Réservez en direct.",

    hero: {
      eyebrow: 'Agia Marina · Kamares · Sifnos',
      title: 'Votre chez-vous au bord de la mer à Sifnos',
      subtitle:
        "Un refuge tranquille au bord de la mer Égée, à quelques marches au-dessus de l'eau.",
      primaryCta: 'Réservez votre séjour',
      secondaryCta: 'Découvrir les studios',
    },

    highlights: [
      { icon: 'wave', label: 'À quelques pas de la mer' },
      { icon: 'view', label: 'Vue mer depuis chaque studio' },
      { icon: 'sparkle', label: 'Ménage quotidien' },
      { icon: 'parking', label: 'Parking privé' },
    ],

    welcome: {
      eyebrow: 'Bienvenue',
      title: 'Bienvenue aux Aglaia Studios',
      body: [
        'Nichés sur la paisible côte de Sifnos, les Aglaia Studios offrent un refuge chaleureux et tranquille à quelques pas de la mer Égée. Avec des vues splendides, de douces brises marines et le bruit des vagues comme bande-son, c’est l’endroit idéal pour se détendre et se sentir vraiment chez soi.',
      ],
      imageAlt:
        'Terrasse en pierre des Aglaia Studios donnant sur la baie de Kamares à Sifnos',
    },

    studios: {
      eyebrow: 'Nos Studios',
      title: 'Simples, traditionnels et ouverts sur la mer',
      body: [
        'Chacun de nos studios est meublé de manière simple et traditionnelle, offrant tout ce dont vous avez besoin pour un séjour confortable. Vous y trouverez des transats pour profiter du soleil, une atmosphère paisible pour vous détendre, et un nettoyage quotidien pour garder votre espace frais et accueillant.',
      ],
      cta: 'Découvrir les studios',
    },

    history: {
      eyebrow: 'De l’Argile au Confort',
      title: 'Notre Histoire',
      body: [
        'Avant de devenir le paisible refuge en bord de mer qu’est aujourd’hui Aglaia Studios, ce bâtiment était autrefois un atelier de poterie en activité. Pendant de nombreuses années, les mains locales y façonnaient l’argile, créant des céramiques traditionnelles de Sifnos à quelques pas de la mer. L’esprit de savoir-faire et de soin perdure. Lors de la transformation de l’espace en studios à louer, nous avons conservé ce même amour pour la simplicité, la tradition et l’authenticité.',
        'Aujourd’hui, Aglaia Studios accueille des visiteurs du monde entier, offrant la même énergie paisible et le lien avec le patrimoine de Sifnos qui a autrefois façonné chaque pot et assiette créés ici.',
      ],
      imageAlt:
        'Un bougainvillier en fleurs devant le mur blanchi à la chaux et la porte bleue d’un studio des Aglaia Studios',
    },

    /* Une phrase reprise mot pour mot de l’histoire ci-dessus, à laquelle on
       donne une page entière. Rien n’est inventé ici. */
    pullquote: {
      text:
        'Pendant de nombreuses années, les mains locales y façonnaient l’argile, créant des céramiques traditionnelles de Sifnos à quelques pas de la mer.',
      cite: 'Aglaia Studios · Agia Marina, Kamares',
    },

    why: {
      eyebrow: 'Pourquoi Nous Choisir',
      title: 'Cinq raisons pour lesquelles nos hôtes reviennent',
      items: [
        { icon: 'view', text: 'Vue imprenable sur la mer' },
        { icon: 'ladder', text: 'Accès direct à la mer, à seulement quelques pas' },
        { icon: 'quiet', text: 'Environnement calme et relaxant' },
        { icon: 'heart', text: 'Accueil chaleureux et convivial' },
        { icon: 'pottery', text: 'Une véritable expérience sifnienne' },
      ],
    },

    seaAccess: {
      eyebrow: "Droit dans l'eau",
      title: 'La mer Égée, quelques marches plus bas',
      body: "L'accès à la mer se fait facilement par une échelle de piscine métallique située sur le petit quai, à quelques marches seulement en contrebas de l'hébergement.",
      imageAlt:
        'Eau turquoise en contrebas des Aglaia Studios, avec un bateau au mouillage et un nageur',
    },

    galleryTeaser: {
      eyebrow: 'Galerie Photos',
      title: 'Un aperçu des lieux',
      body: "Des terrasses au-dessus de l'eau, des murs blanchis à la chaux, des volets bleus et de longs couchers de soleil sur l'Égée.",
    },

    faq: {
      eyebrow: 'Bon à savoir',
      title: 'Questions fréquentes',
    },

    cta: {
      title: 'Prêt pour votre séjour à Sifnos ?',
      body: 'Vérifiez les disponibilités en ligne, ou appelez-nous simplement — nous répondons personnellement.',
    },
  },

  studios: {
    title: 'Nos Studios | Studios vue mer à Sifnos – Aglaia Studios',
    description:
      "Studios meublés simplement et traditionnellement à Kamares, Sifnos, avec vue sur la mer, coin cuisine, climatisation, Wi-Fi, transats et ménage quotidien.",
    heroTitle: 'Nos Studios',
    heroSubtitle: 'Meublés simplement et traditionnellement, toujours face à la mer.',
    intro: [
      'Chacun de nos studios est meublé de manière simple et traditionnelle, offrant tout ce dont vous avez besoin pour un séjour confortable. Vous y trouverez des transats pour profiter du soleil, une atmosphère paisible pour vous détendre, et un nettoyage quotidien pour garder votre espace frais et accueillant.',
    ],
    includedTitle: 'Dans chaque studio',
    includedNote:
      'Chaque studio ouvre sur la terrasse, avec la mer devant vous et le village de Kamares de l’autre côté de la baie.',
    galleryTitle: 'À l’intérieur des studios',
    galleryBody: '{count} photographies des chambres, des coins cuisine et des salles de bain.',
  },

  facilities: {
    title: 'Équipements & Services | Aglaia Studios Sifnos',
    description:
      'Salle de bain, réfrigérateur, TV, Wi-Fi, climatisation, machine à espresso, bouilloire, coffre-fort, sèche-cheveux et parking privé aux Aglaia Studios, Sifnos.',
    heroTitle: 'Équipements',
    heroSubtitle: 'Tout ce qu’il vous faut, et rien de superflu.',
    groups: [
      {
        title: 'Dans votre studio',
        items: [
          { icon: 'shower', label: 'Salle de bain' },
          { icon: 'ac', label: 'Climatisation' },
          { icon: 'tv', label: 'Télévision' },
          { icon: 'wifi', label: 'Wi-Fi' },
          { icon: 'safe', label: 'Coffre-fort' },
          { icon: 'hairdryer', label: 'Sèche-cheveux' },
        ],
      },
      {
        title: 'Coin cuisine',
        items: [
          { icon: 'fridge', label: 'Réfrigérateur' },
          { icon: 'espresso', label: 'Machine à café espresso' },
          { icon: 'kettle', label: 'Bouilloire' },
          { icon: 'toaster', label: 'Grille-pain' },
          { icon: 'plates', label: 'Assiettes et verres' },
        ],
      },
      {
        title: 'Extérieur & services',
        items: [
          { icon: 'parking', label: 'Parking privé' },
          { icon: 'sunbed', label: 'Transats' },
          { icon: 'sparkle', label: 'Ménage quotidien' },
          { icon: 'ladder', label: 'Accès direct à la mer' },
        ],
      },
    ],
    seaTitle: 'Descendre à la mer',
    seaBody:
      "L'accès à la mer se fait facilement par une échelle de piscine métallique située sur le petit quai, à quelques marches seulement en contrebas de l'hébergement.",
  },

  location: {
    title: 'Emplacement | Agia Marina, Kamares – Aglaia Studios Sifnos',
    description:
      "Les Aglaia Studios se trouvent côté Agia Marina, dans la baie de Kamares à Sifnos, avec un petit escalier qui descend directement vers une eau cristalline.",
    heroTitle: 'Notre Emplacement',
    heroSubtitle: 'Du côté calme de la baie de Kamares, les pieds dans l’eau.',
    body: [
      'Aglaia Studios se situe dans un endroit calme, en bord de mer, qui ressemble à un petit coin de paradis. Un petit escalier vous mène directement à des eaux cristallines, parfaites pour une baignade rafraîchissante à tout moment de la journée. Que vous savouriez un café le matin sur votre balcon ou que vous regardiez le coucher du soleil un verre de vin à la main, la mer est toujours à vos côtés.',
    ],
    addressTitle: 'Notre Adresse',
    mapTitle: 'Sur la carte',
    mapConsent: {
      title: 'Google Maps',
      body: 'La carte est chargée depuis Google. En la chargeant, votre navigateur se connectera aux serveurs de Google.',
      button: 'Charger la carte',
      alternative: 'Ou ouvrez directement l’emplacement dans Google Maps',
    },
    cameraTitle: 'Caméra en direct de Kamares',
    cameraBody:
      'Voyez la baie en temps réel avant de partir — le flux en direct est hébergé par SkylineWebcams.',
  },

  gallery: {
    title: 'Galerie Photos | Aglaia Studios, Kamares Sifnos',
    description:
      "Photographies des Aglaia Studios à Sifnos : terrasses au-dessus de la mer, façades blanchies à la chaux, couchers de soleil et intérieurs des studios.",
    heroTitle: 'Galerie Photos',
    heroSubtitle: '{count} photographies des studios, des terrasses et de la baie.',
    filterAll: 'Toutes les photos',
    filterExterior: 'Photos extérieures',
    filterInterior: 'Photos intérieures',
    exteriorTitle: 'Photos extérieures',
    interiorTitle: 'Photos intérieures',
    openLightbox: 'Ouvrir la photo en plein écran',
  },

  contact: {
    title: 'Contact & Réservations | Aglaia Studios Sifnos',
    description:
      'Contactez les Aglaia Studios à Kamares, Sifnos : appelez le +30 22840 31513 ou écrivez à antonishris@hotmail.com pour votre réservation.',
    heroTitle: 'Contactez-nous',
    heroSubtitle: 'Nous répondons personnellement — généralement sous 24 heures.',
    formTitle: 'Envoyez-nous un message',
    formIntro: 'Les champs marqués d’un astérisque sont obligatoires.',
    requiredHint: '« * » indique les champs obligatoires',
    fields: {
      name: 'Nom',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      email: 'Email',
      phone: 'Numéro de téléphone portable',
      comments: 'Commentaires supplémentaires',
      submit: 'Envoyer',
      sending: 'Envoi…',
    },
    validation: {
      firstName: 'Veuillez saisir votre prénom.',
      lastName: 'Veuillez saisir votre nom de famille.',
      email: 'Veuillez saisir une adresse email valide.',
      phone: 'Veuillez saisir un numéro où nous pouvons vous joindre.',
      generic: 'Veuillez vérifier les champs signalés.',
    },
    success: 'Merci — votre message est en route. Nous vous répondrons très vite.',
    mailtoNotice:
      'Votre application de messagerie va s’ouvrir avec le message prêt à envoyer. Si rien ne se passe, écrivez-nous directement à',
    error: 'Désolé, le message n’a pas pu être envoyé. Écrivez-nous directement à',
    detailsTitle: 'Réservation',
    addressTitle: 'Notre Adresse',
    paymentTitle: 'Modes de paiement',
    payments: [
      'Espèces sur place',
      'Cartes de crédit & débit (Visa, Mastercard, Revolut)',
    ],
    followTitle: 'Suivez-nous',
  },

  cookies: {
    title: 'Politique de Cookies | Aglaia Studios',
    description:
      'Comment aglaiastudios.gr utilise les cookies et technologies similaires, ce qui est stocké dans votre navigateur et comment le contrôler.',
    heroTitle: 'Politique de Cookies',
    heroSubtitle: 'Mise à jour pour la version actuelle de ce site.',
  },

  footer: {
    addressTitle: 'Notre Adresse',
    paymentTitle: 'Modes de paiement',
    reservationTitle: 'Réservation',
    awardsTitle: 'Récompenses',
    followTitle: 'Suivez-nous',
    phoneLabel: 'Tél :',
    emailLabel: 'Email :',
    licenseLabel: 'Licence EOT :',
    tagline: 'Studios en bord de mer à Agia Marina, Kamares — Sifnos, Grèce.',
    navTitle: 'Explorer',
    legalTitle: 'Mentions légales',
    copyright: '© Copyright Codibee',
    rights: 'Tous droits réservés.',
    badgeAlt: 'Récompense Booking.com reçue par Aglaia Studios',
  },

  notFound: {
    title: 'Page introuvable | Aglaia Studios',
    description: 'La page que vous cherchiez n’est pas ici.',
    heading: 'Cette page a pris le large',
    body: 'La page que vous cherchiez n’existe pas — mais la mer, elle, est restée où vous l’aviez laissée.',
    cta: 'Retour à l’accueil',
  },

  alt: {
    'aerial-aglaia-studios-coastline':
      'Vue aérienne des Aglaia Studios sur la côte rocheuse de Sifnos au-dessus d’une eau turquoise',
    'aerial-aglaia-studios-rocky-shore':
      'Vue aérienne des studios blanchis à la chaux le long du rivage rocheux de la baie de Kamares',
    'aerial-swimming-turquoise-water-boat':
      'Nageur et bateau au mouillage dans l’eau turquoise en contrebas des studios',
    'terrace-view-over-kamares-bay':
      'Terrasse ombragée avec table et chaises donnant sur la baie de Kamares',
    'stone-terrace-above-the-blue-bay':
      'Terrasse en pierre au-dessus de la baie bleue, avec une table dressée pour deux',
    'sun-terrace-over-the-sea':
      'Terrasse ensoleillée avec transats et pergola directement au-dessus de la mer',
    'sunset-wine-on-the-terrace':
      'Deux verres de vin blanc sur la terrasse alors que le soleil se couche sur l’Égée',
    'terrace-shaded-pergola-bougainvillea':
      'Terrasse sous une pergola blanche avec bougainvilliers et porte bleue de studio',
    'terrace-blue-door-bougainvillea':
      'Porte en bois bleue encadrée de bougainvilliers, à côté de la table de la terrasse',
    'terrace-sea-view-sunbed':
      'Terrasse avec transat et large vue sur la mer et la montagne',
    'terrace-from-above-sea-view':
      'La terrasse vue d’en haut, avec une table en bois face à la mer ouverte',
    'whitewashed-facade-blue-doors-sunbeds':
      'Façade blanchie à la chaux avec portes et volets bleus, transats sur la terrasse dallée',
    'seaside-path-along-the-studios':
      'Allée dallée longeant les studios au bord de la mer',
    'courtyard-sunbeds-blue-shutters':
      'Cour avec transats, chaises et volets bleus dans le soleil de l’après-midi',
    'terrace-table-chairs-pergola':
      'Table et chaises en bois sur la terrasse sous la pergola',
    'terrace-sunbeds-mountain-view':
      'Terrasse couverte donnant sur les transats et la montagne au loin',
    'sunbed-overlooking-kamares-bay':
      'Transat sur la terrasse dominant la baie et le village de Kamares',
    'breakfast-table-view-kamares-village':
      'Table sur la terrasse avec vue sur les bateaux de pêche et le village de Kamares',
    'sunset-dinner-table-sea-view':
      'Table en carreaux de faïence dressée avec du vin au coucher du soleil sur la mer',
    'sunset-over-the-aegean-from-the-path':
      'Coucher de soleil sur l’Égée, vu de l’allée qui longe les studios',
    'golden-hour-terrace-with-wine':
      'Heure dorée sur la terrasse, verres de vin sur la table et un ferry à l’horizon',
    'blue-doors-and-terrace-furniture':
      'Portes et fenêtres bleues avec mobilier de terrasse en bois devant',
    'table-facing-the-calm-sea':
      'Table et chaises sur la terrasse face à la mer calme du soir',
    'kamares-bay-by-moonlight':
      'La baie de Kamares à Sifnos éclairée par la lune, le village illuminé le long du rivage',
    'sunset-panorama-from-the-terrace':
      'Coucher de soleil panoramique sur la baie de Kamares depuis la terrasse des Aglaia Studios',
    'sea-view-from-the-terrace-banner':
      'Vue large sur la baie bleue et le village depuis la terrasse',
    'aegean-sunset-banner': 'Coucher de soleil orange profond sur la mer Égée',

    'studio-double-bed-sea-view-door':
      'Studio avec lit double et porte ouverte sur la terrasse et la mer',
    'studio-living-area-corner-sofa':
      'Coin salon d’un studio avec banquette d’angle intégrée et table en bois',
    'studio-kitchenette-door-to-terrace':
      'Coin cuisine avec réfrigérateur, machine à café et bouilloire près de la porte de la terrasse',
    'studio-double-bed-bedside-lamps':
      'Lit double avec lampes de chevet et cadre au mur dans un studio',
    'studio-twin-beds': 'Studio avec deux lits simples et serviettes fraîches',
    'studio-double-room-armchair':
      'Chambre double avec fauteuil, éclairage chaleureux et linge blanc',
    'studio-kitchenette-and-sofa':
      'Coin cuisine avec cuisinière, réfrigérateur et banquette',
    'studio-coffee-corner-sea-doorway':
      'Coin café avec bouilloire et machine à espresso près de la porte donnant sur la mer',
    'studio-double-bed-fresh-towels':
      'Lit double fait avec du linge blanc et des serviettes pliées',
    'studio-bedroom-with-tv-and-desk':
      'Chambre de studio avec téléviseur mural, miroir et coiffeuse',
    'studio-twin-beds-traditional':
      'Studio meublé de façon traditionnelle avec deux lits simples',
    'studio-bedroom-with-mirror':
      'Chambre de studio avec miroir, petit bureau et chaise traditionnelle',
    'studio-bed-with-white-canopy':
      'Lit avec ciel de lit blanc et éclairage mural doux',
    'studio-seating-corner-and-storage':
      'Coin salon d’un studio avec banc en bois, placards et climatisation',
    'studio-modern-bathroom': 'Salle de bain moderne avec douche à l’italienne et vasque en pierre',
    'studio-bathroom-basin-and-shower':
      'Salle de bain avec vasque ronde, miroir et douche',
    'studio-bathroom-walk-in-shower':
      'Salle de bain carrelée avec douche à l’italienne et vasque en pierre',
    'studio-dressing-table-and-bathroom':
      'Coiffeuse avec miroir à côté de la salle de bain du studio',
    'studio-bed-stone-alcove-detail':
      'Détail d’un lit à côté d’une alcôve en pierre dans un studio',
    'studio-wrought-iron-bed-detail':
      'Détail d’une tête de lit en fer forgé avec des oreillers blancs',

    'aerial-hero-frame':
      'Les Aglaia Studios vus du ciel, sur la pointe rocheuse au-dessus de l’eau turquoise de la baie de Kamares',
    'aglaia-studios-logo': 'Aglaia Studios',
    'aglaia-studios-logo-white': 'Aglaia Studios',
    'booking-com-award-badge': 'Badge de récompense Booking.com',
  },

  faq: [
    {
      q: 'Où se trouvent exactement les Aglaia Studios ?',
      a: 'Les Aglaia Studios se trouvent à Agia Marina, dans la baie de Kamares, sur l’île de Sifnos en Grèce. Le bâtiment est directement sur le littoral, à quelques marches au-dessus de l’eau.',
    },
    {
      q: 'Comment accède-t-on à la mer ?',
      a: "L'accès à la mer se fait facilement par une échelle de piscine métallique située sur le petit quai, à quelques marches seulement en contrebas de l'hébergement.",
    },
    {
      q: 'Qu’est-ce qui est inclus dans chaque studio ?',
      a: 'Chaque studio dispose d’une salle de bain, d’un réfrigérateur, d’une télévision, du Wi-Fi, de la climatisation, d’une machine à café espresso, d’une bouilloire, d’un grille-pain, d’assiettes et de verres, d’un coffre-fort et d’un sèche-cheveux. Les transats et le ménage quotidien sont inclus, et un parking privé est disponible.',
    },
    {
      q: 'Y a-t-il un parking ?',
      a: 'Oui — un parking privé est à la disposition des hôtes.',
    },
    {
      q: 'Quels moyens de paiement acceptez-vous ?',
      a: 'Espèces sur place, ainsi que cartes de crédit ou de débit : Visa, Mastercard et Revolut.',
    },
    {
      q: 'Le studio est-il nettoyé pendant mon séjour ?',
      a: 'Oui, le ménage quotidien est inclus afin que votre espace reste frais et accueillant.',
    },
    {
      q: 'Comment puis-je réserver un studio ?',
      a: 'Vous pouvez vérifier les disponibilités et réserver en ligne via notre page de réservation, ou nous contacter directement par téléphone au +30 22840 31513 ou par email à antonishris@hotmail.com.',
    },
    {
      q: 'Puis-je voir la baie avant de partir ?',
      a: 'Oui — une caméra en direct de Kamares, à Sifnos, est diffusée par SkylineWebcams et un lien figure sur notre page Emplacement.',
    },
  ],
};
