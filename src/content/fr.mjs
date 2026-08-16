/**
 * French copy.
 *
 * Every sentence the previous site published in French is reproduced verbatim,
 * spelling quirks included. Only the pages the old site never translated — the
 * reservation form and the FAQ — are new. See README.md ("What changed").
 */

export default {
  code: 'fr',
  htmlLang: 'fr',
  locale: 'fr_FR',
  label: 'Français',
  labelShort: 'FR',

  nav: {
    home: 'Accueil',
    accommodation: 'Hébergement',
    location: 'Location',
    gallery: 'Photos',
    reservations: 'Réservations',
    notice: 'CoVID-19',
    reviews: 'Avis Google',
    book: 'Online Booking',
  },

  ui: {
    skipToContent: 'Aller au contenu',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    menu: 'Menu',
    close: 'Fermer',
    previous: 'Précédente',
    next: 'Suivante',
    breadcrumb: 'Fil d’Ariane',
    languageSwitcher: 'Choisir une langue',
    backToTop: 'Retour en haut',
    scrollDown: 'Faire défiler',
    viewGallery: 'Voir les photos',
    viewAllPhotos: 'Voir toutes les photos',
    enlarge: 'Agrandir la photo',
    readMore: 'En savoir plus',
    opensNewTab: 'ouvre dans un nouvel onglet',
    image: 'Photo',
    of: 'sur',
    all: 'Toutes',
    callUs: 'Appelez-nous',
    emailUs: 'Écrivez-nous',
    slideshow: 'Diaporama de photos',
    goToSlide: 'Aller à la diapositive',
    pause: 'Mettre en pause',
    play: 'Lancer le diaporama',
    required: 'obligatoire',
    langSuggest: 'Cette page est également disponible en français.',
    langSuggestAction: 'Lire en français',
  },

  address: {
    line1: 'Anna Studios',
    line2: 'Kolympithres | Paros | Cyclades',
    line3: 'Grèce',
    short: 'Kolympithres, Paros, Cyclades, Grèce',
  },

  contact: {
    phoneLabel: 'Tél. :',
    mobileLabel: 'Mob. :',
    emailLabel: 'E-mail :',
    licenseLabel: 'EOT reg. No :',
    whatsapp: 'WhatsApp',
    viber: 'Viber',
    payments: ['Visa', 'Mastercard'],
  },

  home: {
    title: 'Anna Studios Paros | Chambres à Kolympithres, Naoussa',
    description:
      'Anna Studios à Kolympithres, dans la baie de Naoussa à Paros. Chambres, studios et appartements avec balcon, à 200 m de la plage de sable la plus proche.',

    hero: {
      eyebrow: 'Kolympithres · Naoussa · Paros',
      title: 'Bienvenue à Paros',
      subtitle:
        'Chambres, studios et appartements dans la baie de Naoussa — calmes, confortables et à deux pas du sable.',
      primaryCta: 'Online Booking',
      secondaryCta: 'Voir l’hébergement',
    },

    slides: {
      welcome: 'Bienvenue sur l’île de Paros',
      hospitality: 'Profitez de notre hospitalité',
      swim: 'Baignez-vous à la célèbre plage de Kolympithres',
      stay: 'Séjournez chez nous à Kolympithres',
      nightlife: 'Découvrez la vie nocturne de Naoussa',
      monuments: 'Visitez les monuments anciens',
    },

    welcome: {
      eyebrow: 'Bienvenue',
      title: 'Un coin tranquille dans la baie de Naoussa',
      body: [
        'Bienvenue chez ANNA STUDIOS, dans la charmante baie de Naoussa, dans la région de Kolimbithres. Si vous recherchez des moments de détente de rythmes intenses de la ville, vous trouverez dans nos hébergements le calme et la tranquillité que vous désirez.',
        'Prendre plaisir de vos vacances dans des chambres confortables et propres, décorées simplement avec de beaux balcons et des installations qui répondront à vos besoins. Nous sommes impatients de vous accueillir et de vous aider découvrir notre belle île!',
      ],
    },

    highlights: [
      { icon: 'beach', label: 'Plage de sable à 200 m' },
      { icon: 'wifi', label: 'Wi-Fi gratuit' },
      { icon: 'parking', label: 'Parking privé gratuit' },
      { icon: 'kitchen', label: 'Cuisine équipée dans les studios et appartements' },
    ],

    offers: {
      eyebrow: 'Réservez en direct',
      title: 'Deux raisons de réserver directement chez nous',
      intro:
        'La réservation via notre site internet ou par téléphone vous garantit un meilleur prix, une flexibilité en cas d’annulation/ changement de dates et des avantages supplémentaires.',
      items: [
        {
          title: 'Offre 1',
          body: 'En réservant via notre site Internet, nous vous proposons 1 panier petit-déjeuner a déguster dans votre chambre.',
        },
        {
          title: 'Offre 2',
          body: 'Pour les réservations téléphoniques de 8 jours, vous payez les 7. Valable pour toutes les périodes.',
        },
      ],
    },

    /* One sentence taken from the welcome text above, given a page of its
       own. Nothing here is new copy. */
    pullquote: {
      text:
        'Si vous recherchez des moments de détente loin des rythmes intenses de la ville, vous trouverez dans nos hébergements le calme et la tranquillité que vous désirez.',
      cite: 'Anna Studios · Kolimbithres, Naoussa',
    },

    rooms: {
      eyebrow: 'Hébergement',
      title: 'Chambres, studios et appartements',
      body: 'Quatre types d’hébergement, tous avec balcon ou terrasse, tous à quelques minutes de la mer.',
      cta: 'Voir l’hébergement',
    },

    strip: {
      title: 'Paros, à quelques pas de la porte',
      cta: 'Voir toutes les photos',
    },

    cta: {
      title: 'Réservez votre séjour à Anna Studios',
      body: 'Écrivez-nous ou appelez — nous répondons personnellement à chaque demande, et les deux offres ci-dessus valent pour les réservations directes.',
    },
  },

  accommodation: {
    title: 'Hébergement | Anna Studios Paros',
    description:
      'Chambres doubles, studios doubles et appartements pour deux ou quatre personnes chez Anna Studios, Kolympithres, Paros. Balcons, cuisine équipée, climatisation.',
    heroTitle: 'Hébergement',
    heroSubtitle:
      'Des chambres au rez-de-chaussée, des studios sur deux niveaux et deux appartements — chacun avec son balcon ou sa terrasse.',
    intro:
      'Chaque logement est meublé simplement et nettoyé chaque jour, et tous s’ouvrent sur un balcon ou une terrasse donnant sur la mer ou le jardin.',

    sleepsLabel: 'Personnes',
    checkServices: 'Voir les services',
    bookOnline: 'Online Booking',
    photosOf: 'Photos :',

    rooms: {
      doubleRoom: {
        name: 'Chambre double',
        subtitle: 'Chambre pour 2 personnes',
        body: 'Les chambres sont situées au rez-de-chaussée, avec un balcon qui donne sur la mer ou le jardin et comprennent 1 lit double ou 2 lits simples. Idéale pour des couples et des amis.',
      },
      doubleStudio: {
        name: 'Studio double',
        subtitle: 'Studio pour 2 personnes',
        body: 'Les studios sont situées au rez-de-chaussée et au premier étage. Il y a un balcon qui donne sur la mer ou le jardin. Ils comprennent 1 lit double ou 2 lits simples et une petite cuisine equipée. Idéale pour des couples et des amis.',
      },
      apartmentTwo: {
        name: 'Appartement double',
        subtitle: 'Appartement pour 2 personnes avec la possibilité d’accueillir une troisième personne.',
        body: 'Il est situé au rez-de-chaussée avec un balcon qiu donne sur la mer et comprend 1 lit double dans la pièce principale. Dans la deuxième pièce il y a un canapé (qui peut être utilisé par une troisième personne) et une petite cuisine equipée. Idéal pour des couples qui veulent profiter de leurs vacances avec comfort.',
      },
      apartmentFour: {
        name: 'Appartement pour 4 personnes.',
        subtitle: 'Appartement pour 4 personnes',
        body: 'Il est situé au premier étage et il comprend 2 terrasses qui donnent sur la mer. Dans la pièce principale il y a 1 lit double et dans la deuxième pièce il y ont 2 lits simples et une petite cuisine equipée. Idéal pour une famille ou des amis.',
      },
    },

    services: {
      title: 'Services',
      roomTitle: 'Services',
      complexTitle: 'Services/Avantages de l’unité',
      room: [
        'Table avec des chaises pour l’extérieur',
        'Nettoyage quotidien',
        'Balcon/ Terrasse',
        'Armoire',
        'Toilette avec mirroir et une chaisse pour l’intérieur',
        'Air condition',
        'Meuble pour les valises',
        'Télévision PLASMA 22”',
        'Sèche-cheuveux',
        'Réfrigérateur',
        'Accès libre à l’internet',
        'Cuisine equipée (dans les appartements et les studios)',
        'Salle de bains avec douche et rideau de douche',
        'Serviettes',
        'Eau chaude pendant toute la jour',
        'Bouilloire',
        'Articles de toilette NV COSMETICS',
      ],
      complex: [
        'jardin',
        'Barbecue à l’extérieur',
        'Douche extérieur',
        'Parking privé gratuit',
        'Fournir le service de blanchisserie et repassage',
        'Cartes de credit acceptées (VISA, MASTERCARD)',
        'Imprimeur',
        'Location de voiture, cyclomoteur, vélo (en supplément)',
        'Transfert de l’aéroport ou le port (en supplément)',
        'Garde de bébé (en supplément)',
        'Rendez-vous coiffure/maquillage (en supplément)',
        'Tours/billets de ferry (en supplément)',
      ],
    },

    times: 'Check in : 14:00 | Dernier départ Check out: 11:00',

    policies: {
      title: 'Avant de réserver',
      reservationTitle: 'Politique de réservation',
      reservation: [
        'Un acompte de 2 jours est demandé pour confirmer la réservation. Le solde de la réservation sera payé à Anna Studios à la fin du séjour.',
      ],
      cancellationTitle: 'Conditions d’annulation',
      cancellation: [
        'Annulation gratuite jusqu’à 7 jours avant l’arrivée pour la haute saison (16/07-24/08).',
        'Une annulation après cette période sera facturée 50% du total de la réservation.',
        'Pour les autres périodes, annulation gratuite jusqu’à 3 jours avant l’arrivée.',
        'Une annulation après cette période sera facturée 30% du total de la réservation.',
        'Non-présentation : 100% de frais',
      ],
    },
  },

  location: {
    title: 'Location | Anna Studios, Kolympithres, Paros',
    description:
      'Anna Studios se trouve à Kolympithres dans la baie de Naoussa, Paros : 200 m de la plage la plus proche, 2 km de Naoussa, 10 km du port et 18 km de l’aéroport.',
    heroTitle: 'Location',
    heroSubtitle:
      'Kolympithres, dans la baie de Naoussa, sur la côte nord de Paros dans les Cyclades.',
    intro:
      'Depuis Kolympithres tout est proche — la plage à pied, Naoussa à quelques minutes en voiture, le port et l’aéroport en moins d’une demi-heure.',

    distancesTitle: 'Les distances',
    distances: [
      'La plus proche plage avec de sable: 200m',
      'Arrêt de bus: 700m',
      'Aéroport: 18 km',
      'Parikia (port): 10 km',
      'Naoussa: 2 km',
      'Kolympithres beach : 1.5 km',
      'Parc de l’environement: 3 km',
    ],

    transportTitle: 'Se déplacer',
    transport:
      'Nous vous conseillons de louer un moyen de transport, qui vous donnera la liberte d’ explorer l’ ile et decouvrir des lieux uniques.',

    map: {
      title: 'Sur la carte',
      body: 'La carte n’est chargée depuis Google que lorsque vous la demandez : aucune requête ne quitte cette page avant que vous n’appuyiez sur le bouton.',
      load: 'Charger la carte',
      loading: 'Chargement de la carte…',
      openExternal: 'Ouvrir la carte sur Google',
      frameTitle: 'Carte indiquant l’emplacement d’Anna Studios à Paros',
    },
  },

  gallery: {
    title: 'Photos | Anna Studios Paros',
    description:
      'Photographies d’Anna Studios à Kolympithres, Paros — les chambres, studios et appartements, les balcons et les plages autour de Naoussa.',
    heroTitle: 'Photos',
    heroSubtitle: 'Les chambres et l’île autour d’elles.',
    intro: 'Choisissez une photo pour la voir en grand.',

    filtersLabel: 'Filtrer les photos',
    filters: {
      all: 'Toutes',
      doubleRoom: 'Chambres doubles',
      doubleStudio: 'Studios doubles',
      apartmentTwo: 'Appartement pour 2',
      apartmentFour: 'Appartement pour 4',
      island: 'Paros',
    },
    counter: 'photos',
    empty: 'Aucune photo dans ce groupe.',
  },

  reservations: {
    title: 'Réservations | Anna Studios Paros',
    description:
      'Demandez les disponibilités à Anna Studios à Kolympithres, Paros. Envoyez vos dates, le nombre de personnes et le type de chambre, ou réservez en ligne.',
    heroTitle: 'Formulaire de réservation',
    heroSubtitle: 'Donnez-nous vos dates et nous vous répondrons.',

    directTitle: 'Réserver tout de suite',
    directBody:
      'La réservation via notre site internet ou par téléphone vous garantit un meilleur prix, une flexibilité en cas d’annulation/ changement de dates et des avantages supplémentaires.',
    directCta: 'Online Booking',

    formTitle: 'Ou envoyez-nous une demande',
    formIntro:
      'Nous répondons personnellement à chaque demande. Les champs marqués d’un astérisque sont obligatoires.',

    fields: {
      name: 'Nom',
      email: 'Adresse e-mail',
      phone: 'Téléphone',
      address: 'Adresse',
      adults: 'Adultes',
      kids: 'Enfants',
      roomType: 'Type de chambre',
      arrival: 'Arrivée',
      departure: 'Départ',
      message: 'Message',
    },
    roomTypes: [
      'Chambre double',
      'Studio double',
      'Appartement pour 2',
      'Appartement pour 4',
    ],
    roomTypePlaceholder: 'Choisissez un type de chambre',
    submit: 'Envoyer',
    sending: 'Envoi…',

    errors: {
      name: 'Indiquez-nous votre nom.',
      email: 'Saisissez une adresse e-mail valide.',
      phone: 'Indiquez-nous un numéro de téléphone.',
      address: 'Saisissez votre adresse.',
      roomType: 'Choisissez un type de chambre.',
      arrival: 'Choisissez votre date d’arrivée.',
      departure: 'Choisissez une date de départ postérieure à l’arrivée.',
      message: 'Écrivez-nous un court message.',
      summary: 'Corrigez les champs signalés ci-dessous.',
    },
    success:
      'Merci — votre logiciel de messagerie devrait s’être ouvert avec la demande déjà remplie. S’il ne s’est rien passé, écrivez-nous à',
    mailSubject: 'Demande de réservation — Anna Studios',
  },

  notice: {
    title: 'Avis CoVID-19 | Anna Studios Paros',
    description:
      'L’avis CoVID-19 publié par Anna Studios, Paros : nettoyage et ventilation entre les séjours, mesures de protection et emplacement du centre de santé de l’île.',
    heroTitle: 'CoVID-19 Notice',
    heroSubtitle: 'L’avis tel que publié par Anna Studios.',
    body: [
      'Chers amis et visiteurs potentiels,',
      'En passant par le troisième été qui nous trouvera au milieu d’une pandémie et devant faire face à une crise sanitaire mondiale, nous continuons à suivre fidèlement les mesures en cours et à être constamment informés par les autorités afin que nous puissions vous accueillir à nouveau cette année.',
      'Un propreté adéquat et detaillé a toujours été notre priorité absolue. Nous veillons à une ventilation adéquate des chambres au départ / à l’arrivée et utilisons les produits appropriés qui garantissent la qualité que nous fournissons. Les essentieles mesures de protection que l’Organisation mondiale de la santé conseille de suivre avec respect: une distance de 1,5 mètre, un lavage fréquent des mains et l’utilisation d’un masque est la règle que nous assurons de suivre. Des désinfectants sont disponibles dans les espaces publics et des masques en tissu individuels sur demande. Il est expressément interdit de visiter en dehors des locataires de notre logement.',
      'Le centre de santé de l’île est situé à 10 km des studios Anna, à Parikia, à 150 mètres du port principal.',
      'En espérant que toute cette aventure se terminera bientôt, nous continuons à travailler dur et à prendre notre responsabilité individuelle.',
    ],
  },

  faq: {
    title: 'Questions et réponses',
    intro: 'Tout ce qui suit provient de ce qu’Anna Studios indique sur ce site.',
    items: [
      {
        q: 'À quelle heure sont l’arrivée et le départ ?',
        a: 'L’arrivée se fait à partir de 14:00 et le départ au plus tard à 11:00.',
      },
      {
        q: 'Comment une réservation est-elle confirmée ?',
        a: 'Un acompte de 2 jours est demandé pour confirmer la réservation. Le solde de la réservation sera payé à Anna Studios à la fin du séjour.',
      },
      {
        q: 'Quelles sont les conditions d’annulation ?',
        a: 'Annulation gratuite jusqu’à 7 jours avant l’arrivée pour la haute saison (16/07-24/08) ; après cette période, 50% du total est facturé. Pour les autres périodes, l’annulation est gratuite jusqu’à 3 jours avant l’arrivée, puis 30% est facturé. Une non-présentation est facturée 100%.',
      },
      {
        q: 'Quels moyens de paiement acceptez-vous ?',
        a: 'Les cartes de crédit sont acceptées — VISA et MASTERCARD.',
      },
      {
        q: 'À quelle distance se trouve la plage ?',
        a: 'La plage de sable la plus proche est à 200 m et la plage de Kolympithres à 1,5 km. L’arrêt de bus est à 700 m de l’hébergement.',
      },
      {
        q: 'Comment venir du port ou de l’aéroport ?',
        a: 'Parikia, le port, est à 10 km et l’aéroport à 18 km. Le transfert depuis et vers le port ou l’aéroport peut être organisé en supplément.',
      },
      {
        q: 'Y a-t-il un parking et le Wi-Fi ?',
        a: 'Oui — un parking privé gratuit et un accès libre à l’internet.',
      },
      {
        q: 'Puis-je cuisiner dans la chambre ?',
        a: 'Les studios et les appartements disposent d’une petite cuisine équipée. Les chambres doubles n’en ont pas.',
      },
      {
        q: 'Ai-je besoin d’une voiture à Paros ?',
        a: 'Nous vous conseillons de louer un moyen de transport, qui vous donnera la liberte d’ explorer l’ ile et decouvrir des lieux uniques. Voiture, cyclomoteur ou vélo peuvent être loués par notre intermédiaire, en supplément.',
      },
      {
        q: 'Que pouvez-vous organiser d’autre ?',
        a: 'Blanchisserie et repassage, une imprimante, la garde d’enfants, des rendez-vous coiffure ou maquillage, et des excursions ou billets de ferry. Certains de ces services sont en supplément.',
      },
    ],
  },

  footer: {
    tagline: 'Chambres, studios et appartements à Kolympithres, dans la baie de Naoussa à Paros.',
    addressTitle: 'Anna Studios',
    contactTitle: 'Contact',
    paymentTitle: 'Nous acceptons',
    navTitle: 'Pages',
    followTitle: 'Suivez-nous',
    copyright: 'Copyright @2022 Anna Studios, Design & Hosting by Pararam',
    tripadvisor: 'Anna Studios sur Tripadvisor',
    instagram: 'Anna Studios sur Instagram',
    facebook: 'Anna Studios sur Facebook',
  },

  notFound: {
    title: 'Page introuvable | Anna Studios Paros',
    description:
      'Cette page n’existe pas sur le site d’Anna Studios. Utilisez les liens ci-dessous pour accéder à l’hébergement, à la location, aux photos ou au formulaire.',
    heading: 'Nous n’avons pas trouvé cette page',
    body: 'La page a peut-être été déplacée, ou l’adresse contient une faute de frappe. Ces liens vous remettront sur la bonne voie.',
    cta: 'Retour à la page d’accueil',
  },

  alt: {
    'paros-islet-chapel-in-naoussa-bay':
      'Un petit îlot rocheux surmonté d’une chapelle blanche, dans la mer agitée au large de Naoussa à Paros',
    'aerial-over-kolympithres-bay':
      'Vue en hauteur sur la baie de Kolympithres, avec ses maisons blanches, ses jardins et la mer turquoise',
    'kolympithres-beach-swimmers-and-boat':
      'Des baigneurs et des parasols bleus sur la plage de Kolympithres, avec un bateau d’excursion au mouillage',
    'anna-studios-seen-from-the-garden':
      'Le bâtiment d’Anna Studios, blanc aux volets bleus, vu depuis le jardin avec les collines derrière',
    'naoussa-harbour-tavernas-at-dusk':
      'Des bateaux de pêche amarrés au quai de Naoussa au crépuscule, avec les tables des tavernes éclairées',
    'ekatontapyliani-church-interior':
      'L’intérieur en pierre de l’église d’Ekatontapyliani à Paros, avec son lustre et son iconostase sculptée',
    'balcony-table-with-palms-and-hills':
      'Une table et des chaises sur un balcon d’Anna Studios, donnant sur les palmiers et les collines',
    'twin-room-with-desk-and-wardrobe':
      'Une chambre à deux lits chez Anna Studios avec bureau, miroir et armoire, et un tableau au-dessus des lits',
    'terrace-table-with-bougainvillea-and-sea':
      'Une table de terrasse fleurie de bougainvillier, donnant sur les toits et les palmiers jusqu’à la baie',
    'kolympithres-rock-formations':
      'Les rochers polis par le vent de la plage de Kolympithres, des parasols entre eux et l’eau claire au-delà',
    'veranda-table-facing-the-hills':
      'Une table et des chaises sur une terrasse d’Anna Studios, face aux palmiers et aux collines de l’intérieur',
    'naoussa-waterfront-from-the-sea':
      'Les maisons blanches de Naoussa vues depuis l’eau, avec le petit îlot et sa chapelle au premier plan',
    'naoussa-harbour-at-blue-hour':
      'Le port de Naoussa à l’heure bleue, le front de mer éclairé se reflétant dans l’eau immobile',
    'naoussa-fishing-boats-reflected':
      'Des bateaux de pêche et une chapelle blanchie à la chaux reflétés dans l’eau calme du port de Naoussa',
    'anna-studios-entrance-sign':
      'L’enseigne d’Anna Studios à l’entrée, avec son logo en coquille, des palmiers et les collines derrière',
    'anna-studios-garden-and-drive':
      'L’allée et le jardin d’Anna Studios, avec ses oliviers et les bâtiments blancs bas au-delà',
    'reception-desk-bell': 'Une sonnette de réception en laiton sur un bureau en bois',

    'double-room-twin-beds-and-balcony-door':
      'Une chambre double avec deux lits simples, un bureau et un miroir, la porte du balcon ouverte',
    'double-room-balcony-with-sun-hat':
      'Le balcon d’une chambre double, avec une table ronde, un chapeau de paille et une serviette rouge',
    'double-room-bathroom-with-blue-tiles':
      'La salle de bains d’une chambre double, avec lavabo, étagère à miroir et douche derrière un rideau bleu',
    'double-room-terrace-table-and-chairs':
      'La terrasse privée d’une chambre double avec une table, deux chaises et vue sur les champs',
    'double-room-desk-mirror-and-kettle':
      'Le coin bureau d’une chambre double, avec miroir, cadres, bouilloire et réfrigérateur',
    'double-room-terrace-over-the-garden':
      'La terrasse d’une chambre double donnant sur le jardin et les arbres jusqu’aux bâtiments au-delà',
    'double-room-twin-beds-and-wardrobe':
      'Une chambre double avec deux lits simples en linge blanc, une armoire et un réfrigérateur',
    'double-room-veranda-under-the-trees':
      'La terrasse d’une chambre double avec une table ronde et des chaises à l’ombre des arbres',
    'double-room-bed-facing-the-balcony':
      'Une chambre double dont le lit fait face à la porte-fenêtre ouverte et à la verdure au-dehors',
    'double-room-twin-beds-and-television':
      'Une chambre double avec deux lits simples, une télévision murale et une coiffeuse',

    'studio-twin-beds-against-the-blue-wall':
      'Un studio avec deux lits simples contre un mur bleu pâle et les portes-fenêtres ouvertes sur le jardin',
    'studio-kitchenette-beside-the-doorway':
      'La cuisine d’un studio, avec plaques, évier et placards, à côté de la porte donnant sur la terrasse',
    'studio-pergola-terrace-under-the-tree':
      'La terrasse d’un studio sous une pergola, à l’ombre d’un grand arbre, avec une table et deux chaises',
    'studio-looking-through-to-the-kitchenette':
      'Un studio vu depuis le lit, par-delà les porte-bagages jusqu’à la cuisine et la porte d’entrée',
    'studio-twin-beds-and-open-shelving':
      'Un studio avec deux lits simples, un mur bleu et des étagères ouvertes garnies de serviettes',
    'studio-bed-with-the-kitchen-beyond':
      'Le lit d’un studio fait de blanc, avec la cuisine et les tabourets dans la pièce au-delà',
    'studio-double-bed-with-doors-thrown-open':
      'Le lit double d’un studio près du mur bleu, les portes-fenêtres grandes ouvertes sur la terrasse',
    'studio-terrace-table-under-the-pergola':
      'La terrasse d’un studio vue de l’intérieur, table et chaises sous la pergola et l’arbre au-delà',
    'studio-double-bed-and-blue-wall':
      'Le lit double d’un studio contre le mur bleu, avec les liseuses et la fenêtre sur le côté',
    'studio-bathroom-with-basin-and-shower':
      'La salle de bains d’un studio avec lavabo, miroir en arc et douche derrière un rideau à motifs',
    'studio-veranda-beside-the-vines':
      'La terrasse d’un studio avec une table ronde et deux chaises, près de la vigne et du mur du jardin',
    'studio-veranda-looking-over-the-garden':
      'La terrasse d’un studio avec une table et deux chaises, donnant sur le jardin et les champs',
    'studio-balcony-with-village-and-sea':
      'Le balcon d’un studio avec table et chaises, donnant sur le village blanc et la mer',
    'studio-kitchenette-and-single-bed':
      'La cuisine d’un studio avec évier et placards, et un lit simple sous la fenêtre',

    'apartment-for-two-double-bed-and-balcony':
      'La chambre de l’appartement pour deux, le lit double près des portes-fenêtres ouvertes',
    'apartment-for-two-bedroom-with-shutters':
      'Une chambre de l’appartement pour deux, volets gris ouverts et la cuisine sur le côté',
    'apartment-for-two-kitchenette-and-window':
      'La cuisine de l’appartement pour deux, avec évier, plaques et placards sous une petite fenêtre',
    'apartment-for-two-dining-corner':
      'Le coin repas de l’appartement pour deux, une table à nappe rayée et la chambre au-delà',
    'apartment-for-two-shower-room':
      'La salle d’eau de l’appartement pour deux, avec un rideau à motifs et une petite fenêtre',
    'apartment-for-two-balcony-among-the-trees':
      'Le balcon de l’appartement pour deux, une table et des chaises parmi les arbres',
    'apartment-for-two-bathroom-basin':
      'La salle de bains de l’appartement pour deux, carrelage bleu à motifs, lavabo et miroir',

    'apartment-for-four-bedroom-and-wardrobe':
      'Une chambre de l’appartement pour quatre, lit double, armoire ouverte et un chapeau de paille',
    'apartment-for-four-hallway-between-rooms':
      'Le couloir de l’appartement pour quatre, avec vue jusqu’à la seconde chambre et au balcon',
    'apartment-for-four-double-bed-and-desk':
      'Un lit double dans l’appartement pour quatre, tête de lit en fer forgé, bureau et miroir',
    'apartment-for-four-terrace-facing-inland':
      'Une terrasse de l’appartement pour quatre tournée vers l’intérieur, par-delà les arbres et les collines',
    'apartment-for-four-kitchen-and-dining-table':
      'La cuisine et la table de l’appartement pour quatre, portes-fenêtres ouvertes sur la mer',
    'apartment-for-four-dining-area-and-twin-beds':
      'L’appartement pour quatre vu de la porte, la table d’un côté et deux lits de l’autre',
    'apartment-for-four-bathroom-with-blue-tiles':
      'La salle de bains de l’appartement pour quatre, carrelage bleu, lavabo et rideau de douche à motifs',
    'apartment-for-four-pergola-terrace':
      'La terrasse à pergola de l’appartement pour quatre, avec une grande table, des chaises et les collines',
  },
};
