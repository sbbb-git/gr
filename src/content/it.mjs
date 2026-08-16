/**
 * Italian copy.
 *
 * Every sentence the previous site published in Italian is reproduced verbatim,
 * spelling quirks included. The old Italian amenity list was missing a fridge
 * and listed the laundry twice (once untranslated); it is corrected against the
 * other three languages here. See README.md ("What changed").
 */

export default {
  code: 'it',
  htmlLang: 'it',
  locale: 'it_IT',
  label: 'Italiano',
  labelShort: 'IT',

  nav: {
    home: 'Home',
    accommodation: 'Sistemazione',
    location: 'Localita',
    gallery: 'Fotografie',
    reservations: 'Prenotazioni',
    notice: 'CoVID-19',
    reviews: 'Recensioni Google',
    book: 'Online Booking',
  },

  ui: {
    skipToContent: 'Vai al contenuto',
    openMenu: 'Apri il menu',
    closeMenu: 'Chiudi il menu',
    menu: 'Menu',
    close: 'Chiudi',
    previous: 'Precedente',
    next: 'Successiva',
    breadcrumb: 'Percorso di navigazione',
    languageSwitcher: 'Scegli una lingua',
    backToTop: 'Torna su',
    scrollDown: 'Scorri verso il basso',
    viewGallery: 'Guarda le fotografie',
    viewAllPhotos: 'Guarda tutte le fotografie',
    enlarge: 'Ingrandisci la fotografia',
    readMore: 'Leggi di più',
    opensNewTab: 'si apre in una nuova scheda',
    image: 'Fotografia',
    of: 'di',
    all: 'Tutte',
    callUs: 'Chiamaci',
    emailUs: 'Scrivici',
    slideshow: 'Sequenza di fotografie',
    goToSlide: 'Vai alla diapositiva',
    pause: 'Metti in pausa',
    play: 'Avvia la sequenza',
    required: 'obbligatorio',
    langSuggest: 'Questa pagina è disponibile anche in italiano.',
    langSuggestAction: 'Leggi in italiano',
  },

  address: {
    line1: 'Anna Studios',
    line2: 'Kolympithres | Paros | Cyclades',
    line3: 'Grecia',
    short: 'Kolympithres, Paros, Cicladi, Grecia',
  },

  contact: {
    phoneLabel: 'Tel.:',
    mobileLabel: 'Cell.:',
    emailLabel: 'E-mail:',
    licenseLabel: 'EOT reg. No :',
    whatsapp: 'WhatsApp',
    viber: 'Viber',
    payments: ['Visa', 'Mastercard'],
  },

  home: {
    title: 'Anna Studios Paros | Camere a Kolympithres, Naoussa',
    description:
      'Anna Studios a Kolympithres, nel golfo di Naoussa a Paros. Camere, monolocali e appartamenti con balcone, a 200 m dalla spiaggia sabbiosa più vicina.',

    hero: {
      eyebrow: 'Kolympithres · Naoussa · Paros',
      title: 'Benvenuti a Paros',
      subtitle:
        'Camere, monolocali e appartamenti nel golfo di Naoussa — tranquilli, confortevoli e a due passi dalla sabbia.',
      primaryCta: 'Online Booking',
      secondaryCta: 'Vedi la sistemazione',
    },

    slides: {
      welcome: 'Benvenuti sull’isola di Paros',
      hospitality: 'Godetevi la nostra ospitalità',
      swim: 'Nuotate nella famosa spiaggia di Kolympithres',
      stay: 'Soggiornate con noi a Kolympithres',
      nightlife: 'Vivete la vita notturna di Naoussa',
      monuments: 'Visitate i monumenti antichi',
    },

    welcome: {
      eyebrow: 'Benvenuti',
      title: 'Un angolo tranquillo nel golfo di Naoussa',
      body: [
        'Benvenuti ad “Anna Studios”, appartamenti situati nell’incantevole golfo di Naousa, località Kolymbitries.',
        'Se cercate una pausa dai ritmi frenetici della città ,presso di noi troverete natura e tranquillità, appartamenti confortevoli e puliti, semplicemente arredati e con bellissimi balconi, da dove potrete visitare agevolmente la nostra bellissima isola.',
      ],
    },

    highlights: [
      { icon: 'beach', label: 'Spiaggia a 200 m' },
      { icon: 'wifi', label: 'Wi-Fi gratuito' },
      { icon: 'parking', label: 'Parcheggio privato gratuito' },
      { icon: 'kitchen', label: 'Angolo cottura in monolocali e appartamenti' },
    ],

    offers: {
      eyebrow: 'Prenota diretto',
      title: 'Due motivi per prenotare direttamente con noi',
      intro:
        'La prenotazione tramite il nostro sito o al telefono vi garantisce un prezzo migliore, maggiore flessibilità in caso di cancellazione o cambio data e più agilità nel fornire servizi e risposte alle vostre esigenze.',
      items: [
        {
          title: 'Offerta 1',
          body: 'Prenotando tramite il nostro sito web, ti offriamo 1 cestino colazione da gustare in camera.',
        },
        {
          title: 'Offerta 2',
          body: 'Per prenotazioni telefoniche di 8 giorni, ne pagherete le 7. Offerta valida per tutti I periodi.',
        },
      ],
    },

    /* One sentence taken from the welcome text above, given a page of its
       own. Nothing here is new copy. */
    pullquote: {
      text:
        'Se cercate una pausa dai ritmi frenetici della città, presso di noi troverete natura e tranquillità.',
      cite: 'Anna Studios · Kolymbithres, Naoussa',
    },

    rooms: {
      eyebrow: 'Sistemazione',
      title: 'Camere, monolocali e appartamenti',
      body: 'Quattro tipi di sistemazione, tutti con balcone o veranda e tutti a pochi minuti dal mare.',
      cta: 'Vedi la sistemazione',
    },

    strip: {
      title: 'Paros, a pochi passi dalla porta',
      cta: 'Guarda tutte le fotografie',
    },

    cta: {
      title: 'Prenota il tuo soggiorno ad Anna Studios',
      body: 'Scriveteci o telefonate — rispondiamo personalmente a ogni richiesta, e le due offerte qui sopra valgono per le prenotazioni dirette.',
    },
  },

  accommodation: {
    title: 'Sistemazione | Anna Studios Paros',
    description:
      'Camere doppie, monolocali e appartamenti per due o quattro persone ad Anna Studios, Kolympithres, Paros. Balconi, angolo cottura, aria condizionata e Wi-Fi.',
    heroTitle: 'Sistemazione',
    heroSubtitle:
      'Camere a pianoterra, monolocali su due piani e due appartamenti — ognuno con il proprio balcone o veranda.',
    intro:
      'Ogni sistemazione è arredata con semplicità e pulita ogni giorno, e tutte si aprono su un balcone o una veranda con vista sul mare o sul giardino.',

    sleepsLabel: 'Persone',
    checkServices: 'Vedi i servizi',
    bookOnline: 'Online Booking',
    photosOf: 'Fotografie:',

    rooms: {
      doubleRoom: {
        name: 'Camera doppia',
        subtitle: 'Camere (per due persone)',
        body: 'Le camere sono situate a pianoterra e tengono un balcone con vista sul mare o sul giardino. I letti sono 2 singoli oppure un matrimoniale.  Ideale per coppie o amici.',
      },
      doubleStudio: {
        name: 'Monolocale per 2 persone',
        subtitle: 'Camere (per due persone)',
        body: 'I monolocali si trovano a pianoterra e al primo piano e tengono un balcone con vista sul giardino o da un lato sul mare. Tengono un letto matrimoniale oppure 2 singoli e angolo cottura fornito con l’ indispensabile per la preparazione di un pasto. Ideale per coppie o amici.',
      },
      apartmentTwo: {
        name: 'Appartamento per 2 persone',
        subtitle: 'Appartamento per due persone con la possibilità di ospitare una terza persona',
        body: 'È situato a pianoterra e il suo balcone dà sul mare. Nella stanza principale tiene un letto matrimoniale. Nell’ altra stanza c’è un divano (sul quale può dormire una terza persona) e l’ angolo cottura fornito con l’ indispensabile per la preparazione di un pasto. Ideale per coppie che vogliono trascorrere una comoda vacanza.',
      },
      apartmentFour: {
        name: 'Appartamento per 4 persone',
        subtitle: 'Appartamento per 4 persone',
        body: 'È situato al 1° piano tiene 2 balconi che danno sul mare. Nella stanza principale c’è un letto matrimoniale e nell’ altra ci sono due letti singoli e l’ angolo cottura fornito con l’ indispensabile per la preparazione di un pasto. Ideale per una famiglia o amici.',
      },
    },

    services: {
      title: 'Servizi',
      roomTitle: 'Servizi',
      complexTitle: 'Servizi / prestazioni di servizi',
      room: [
        'Tavolo con sedie esterni',
        'Pulizia quotidiana',
        'Balcone',
        'Armadio',
        'Bagno con specchio e sedia interna',
        'Aria condizionata',
        'Portavaligie',
        'Televisore PLASMA, 22 polici',
        'Asciugacapelli',
        'Frigorifero',
        'Free WI-FI',
        'Angolo cottura attrezzato con l’ indispensabile per la preparazione di un pasto o della colazione (negli monolocali e negli appartamenti)',
        'Bagno con doccia',
        'Asciugamani',
        'Acqua calda 24 ore al giorno',
        'Bollitore',
        'Articoli da toeletta NV COSMETICS',
      ],
      complex: [
        'Giardino',
        'Barbecue esterno',
        'Doccia esterna',
        'Parcheggio gratuito',
        'Prestazione di servizio di lavanderia – stiratura',
        'Si accettano le carte di credito ( VISA, MASTERCARD)',
        'Stampante',
        'Noleggio di auto, motorino, quad (servizio con supplemento)',
        'Trasporto dal porto o dall’ aeroporto (servizio con supplemento)',
        'Baby-sitting (servizio con supplemento)',
        'Prenotazione parrucchiere / estetista (servizio con supplemento)',
        'Escursioni / traghetti (servizio con supplemento)',
      ],
    },

    times: 'Check in : 14:00 | Ultimo Check out: 11:00',

    policies: {
      title: 'Prima di prenotare',
      reservationTitle: 'Termini di prenotazione',
      reservation: [
        'Per confermare la prenotazione è richiesto un deposito di 2 giorni. Il resto del pagamento avverà nell’ ANNA STUDIOS alla fine del soggiorno.',
      ],
      cancellationTitle: 'Termini di cancellazione',
      cancellation: [
        'Cancellazione gratuita fino a 7 giorni prima dell’arrivo per l’alta stagione (16/07-24/08).',
        'La cancellazione dopo questo periodo verrà addebitato il 50% del totale della prenotazione.',
        'Per gli altri periodi, cancellazione gratuita fino a 3 giorni prima dell’arrivo.',
        'La cancellazione dopo questo periodo verrà addebitato il 30% del totale della prenotazione.',
        'No show: addebito del 100%.',
      ],
    },
  },

  location: {
    title: 'Localita | Anna Studios, Kolympithres, Paros',
    description:
      'Anna Studios si trova a Kolympithres nel golfo di Naoussa, Paros: 200 m dalla spiaggia più vicina, 2 km da Naoussa e 10 km dal porto di Parikia.',
    heroTitle: 'Localita',
    heroSubtitle:
      'Kolympithres, nel golfo di Naoussa, sulla costa settentrionale di Paros nelle Cicladi.',
    intro:
      'Da Kolympithres tutto è vicino — la spiaggia a piedi, Naoussa a pochi minuti di auto, il porto e l’aeroporto in meno di mezz’ora.',

    distancesTitle: 'Le distanze',
    distances: [
      'Spiaggia sabbiosa più vicina: 200m',
      'Fermata dell’ autobus: 700m',
      'Aeroporto: 18 km',
      'Parikia (porto): 10 km',
      'Naoussa: 2 km',
      'Kolympithres: 1.5 km',
      'Parco Ambientale: 3 km',
    ],

    transportTitle: 'Spostarsi',
    transport:
      'Vi consigliamo di affittare un mezzo di trasporto per avere maggior liberta’ per esplorare l’ isola e scoprire le sue bellezze.',

    map: {
      title: 'Sulla mappa',
      body: 'La mappa viene caricata da Google solo quando la richiedete, così nessuna richiesta lascia questa pagina prima che siate voi a volerlo.',
      load: 'Carica la mappa',
      loading: 'Caricamento della mappa…',
      openExternal: 'Apri la mappa su Google',
      frameTitle: 'Mappa che mostra dove si trova Anna Studios a Paros',
    },
  },

  gallery: {
    title: 'Fotografie | Anna Studios Paros',
    description:
      'Fotografie di Anna Studios a Kolympithres, Paros — le camere, i monolocali e gli appartamenti, i balconi e le spiagge intorno a Naoussa.',
    heroTitle: 'Fotografie',
    heroSubtitle: 'Le camere e l’isola intorno a loro.',
    intro: 'Scegliete una fotografia per vederla a dimensione piena.',

    filtersLabel: 'Filtra le fotografie',
    filters: {
      all: 'Tutte',
      doubleRoom: 'Camere doppie',
      doubleStudio: 'Monolocali',
      apartmentTwo: 'Appartamento per 2',
      apartmentFour: 'Appartamento per 4',
      island: 'Paros',
    },
    counter: 'fotografie',
    empty: 'Nessuna fotografia in questo gruppo.',
  },

  reservations: {
    title: 'Prenotazioni | Anna Studios Paros',
    description:
      'Chiedete la disponibilità ad Anna Studios a Kolympithres, Paros. Inviate le vostre date, il numero di ospiti e il tipo di camera, oppure prenotate online.',
    heroTitle: 'Modulo di prenotazione',
    heroSubtitle: 'Diteci le vostre date e vi risponderemo.',

    directTitle: 'Prenota subito',
    directBody:
      'La prenotazione tramite il nostro sito o al telefono vi garantisce un prezzo migliore, maggiore flessibilità in caso di cancellazione o cambio data e più agilità nel fornire servizi e risposte alle vostre esigenze.',
    directCta: 'Online Booking',

    formTitle: 'Oppure inviateci una richiesta',
    formIntro:
      'Rispondiamo personalmente a ogni richiesta. I campi contrassegnati con un asterisco sono obbligatori.',

    fields: {
      name: 'Nome',
      email: 'Indirizzo e-mail',
      phone: 'Telefono',
      address: 'Indirizzo',
      adults: 'Adulti',
      kids: 'Bambini',
      roomType: 'Tipo di camera',
      arrival: 'Arrivo',
      departure: 'Partenza',
      message: 'Messaggio',
    },
    roomTypes: [
      'Camera doppia',
      'Monolocale',
      'Appartamento per 2',
      'Appartamento per 4',
    ],
    roomTypePlaceholder: 'Scegliete il tipo di camera',
    submit: 'Invia',
    sending: 'Invio…',

    errors: {
      name: 'Indicateci il vostro nome.',
      email: 'Inserite un indirizzo e-mail valido.',
      phone: 'Indicateci un numero di telefono.',
      address: 'Inserite il vostro indirizzo.',
      roomType: 'Scegliete un tipo di camera.',
      arrival: 'Scegliete la data di arrivo.',
      departure: 'Scegliete una data di partenza successiva all’arrivo.',
      message: 'Scriveteci un breve messaggio.',
      summary: 'Correggete i campi segnalati qui sotto.',
    },
    success:
      'Grazie — il vostro programma di posta dovrebbe essersi aperto con la richiesta già compilata. Se non è successo nulla, scriveteci a',
    mailSubject: 'Richiesta di prenotazione — Anna Studios',
  },

  notice: {
    title: 'Avviso CoVID-19 | Anna Studios Paros',
    description:
      'L’avviso CoVID-19 pubblicato da Anna Studios, Paros: pulizia e ventilazione tra un soggiorno e l’altro, le misure seguite e dov’è il centro sanitario.',
    heroTitle: 'CoVID-19 Notice',
    heroSubtitle: 'L’avviso così come pubblicato da Anna Studios.',
    body: [
      'Cari amici e possibili ospiti,',
      'Percorrendo la terza estate dentro questa  pandemia e dovendo affrontare una crisi sanitaria mondiale, continuiamo a seguire scrupolosamente le misure e informarci continuamente dalle autorità competenti, per essere in grado di accogliervi anche quest’ anno.',
      'Come sempre, nostra priorità è la pulizia. Cerchiamo di  far cambiare l’ aria delle camere durante la partenza/ arrivo e utulizziamo  dei prodotti speciali per asssicurare la qualità dei servizi offerti.  Le principali misure  imposte dall’ Organizzazione Mondiale della Sanità che seguiamo senza eccezioni  sono : tenere una distanza di 1,5 metri, lavare spesso le mani,  uso della mascherina. Disinfettanti  si trovano in tutte le aree comuni e mascherine multiuso si offrono dopo richiesta. È vietato avere visite dentro il nostro alloggio.',
      'Il centro sanitario dell’ isola  si trova a 10km di distanza da Studios Anna, a Paroikia e a 150m dal porto.',
      'Sperando che questa brutta avventura finirà presto, andiamo avanti facendo il nostro meglio.',
    ],
  },

  faq: {
    title: 'Domande e risposte',
    intro: 'Tutto quello che segue è tratto da ciò che Anna Studios dichiara su questo sito.',
    items: [
      {
        q: 'A che ora sono il check in e il check out?',
        a: 'Il check in è dalle 14:00 e l’ultimo check out è alle 11:00.',
      },
      {
        q: 'Come si conferma una prenotazione?',
        a: 'Per confermare la prenotazione è richiesto un deposito di 2 giorni. Il resto del pagamento avverà nell’ ANNA STUDIOS alla fine del soggiorno.',
      },
      {
        q: 'Quali sono i termini di cancellazione?',
        a: 'Cancellazione gratuita fino a 7 giorni prima dell’arrivo per l’alta stagione (16/07-24/08); dopo questo periodo viene addebitato il 50% del totale. Per gli altri periodi la cancellazione è gratuita fino a 3 giorni prima dell’arrivo, poi viene addebitato il 30%. Il no show viene addebitato al 100%.',
      },
      {
        q: 'Quali metodi di pagamento accettate?',
        a: 'Si accettano le carte di credito — VISA e MASTERCARD.',
      },
      {
        q: 'Quanto dista la spiaggia?',
        a: 'La spiaggia sabbiosa più vicina è a 200 m e Kolympithres a 1,5 km. La fermata dell’autobus è a 700 m dalla struttura.',
      },
      {
        q: 'Come si arriva dal porto o dall’aeroporto?',
        a: 'Parikia, il porto, è a 10 km e l’aeroporto a 18 km. Il trasporto da e per il porto o l’aeroporto può essere organizzato con supplemento.',
      },
      {
        q: 'Ci sono parcheggio e Wi-Fi?',
        a: 'Sì — parcheggio privato gratuito e Wi-Fi gratuito.',
      },
      {
        q: 'Posso cucinare in camera?',
        a: 'I monolocali e gli appartamenti hanno un angolo cottura fornito con l’indispensabile per la preparazione di un pasto o della colazione. Le camere doppie no.',
      },
      {
        q: 'Serve un’auto a Paros?',
        a: 'Vi consigliamo di affittare un mezzo di trasporto per avere maggior liberta’ per esplorare l’ isola e scoprire le sue bellezze. Auto, motorino o quad si possono noleggiare tramite noi, con supplemento.',
      },
      {
        q: 'Che altro potete organizzare?',
        a: 'Lavanderia e stiratura, una stampante, il baby-sitting, appuntamenti dal parrucchiere o dall’estetista ed escursioni o biglietti dei traghetti. Alcuni di questi servizi prevedono un supplemento.',
      },
    ],
  },

  footer: {
    tagline: 'Camere, monolocali e appartamenti a Kolympithres, nel golfo di Naoussa a Paros.',
    addressTitle: 'Anna Studios',
    contactTitle: 'Contatti',
    paymentTitle: 'Accettiamo',
    navTitle: 'Pagine',
    followTitle: 'Seguiteci',
    copyright: 'Copyright @2022 Anna Studios, Design & Hosting by Pararam',
    tripadvisor: 'Anna Studios su Tripadvisor',
    instagram: 'Anna Studios su Instagram',
    facebook: 'Anna Studios su Facebook',
  },

  notFound: {
    title: 'Pagina non trovata | Anna Studios Paros',
    description:
      'Questa pagina non esiste sul sito di Anna Studios. Usate i link qui sotto per raggiungere la sistemazione, la localita, le fotografie o il modulo di prenotazione.',
    heading: 'Non abbiamo trovato questa pagina',
    body: 'La pagina potrebbe essere stata spostata, oppure l’indirizzo contiene un errore di battitura. Questi link vi rimetteranno sulla strada giusta.',
    cta: 'Torna alla home page',
  },

  alt: {
    'paros-islet-chapel-in-naoussa-bay':
      'Un piccolo isolotto roccioso con una cappella bianca, nel mare mosso al largo di Naoussa a Paros',
    'aerial-over-kolympithres-bay':
      'Veduta dall’alto sul golfo di Kolympithres, con case bianche, giardini e il mare turchese oltre',
    'kolympithres-beach-swimmers-and-boat':
      'Bagnanti e ombrelloni blu sulla spiaggia di Kolympithres, con una barca da escursione ancorata poco al largo',
    'anna-studios-seen-from-the-garden':
      'L’edificio di Anna Studios, bianco con le persiane azzurre, visto dal giardino con le colline alle spalle',
    'naoussa-harbour-tavernas-at-dusk':
      'Barche da pesca ormeggiate alla banchina di Naoussa al tramonto, con i tavoli delle taverne illuminati',
    'ekatontapyliani-church-interior':
      'L’interno in pietra della chiesa di Ekatontapyliani a Paros, con il lampadario e l’iconostasi intagliata',
    'balcony-table-with-palms-and-hills':
      'Un tavolo con sedie sul balcone di Anna Studios, con vista sulle palme e sulle colline',
    'twin-room-with-desk-and-wardrobe':
      'Una camera a due letti ad Anna Studios con scrivania, specchio e armadio, e un quadro sopra i letti',
    'terrace-table-with-bougainvillea-and-sea':
      'Un tavolo in terrazza con bouganville, che guarda oltre i tetti e le palme verso il golfo e le colline',
    'kolympithres-rock-formations':
      'Le rocce levigate dal vento della spiaggia di Kolympithres, con gli ombrelloni tra loro e l’acqua limpida',
    'veranda-table-facing-the-hills':
      'Un tavolo con sedie sulla veranda di Anna Studios, di fronte alle palme e alle colline dell’entroterra',
    'naoussa-waterfront-from-the-sea':
      'Le case bianche di Naoussa viste dall’acqua, con il piccolo isolotto della cappella in primo piano',
    'naoussa-harbour-at-blue-hour':
      'Il porto di Naoussa all’ora blu, con il lungomare illuminato riflesso nell’acqua immobile',
    'naoussa-fishing-boats-reflected':
      'Barche da pesca e una cappella imbiancata riflesse nell’acqua calma del porto di Naoussa',
    'anna-studios-entrance-sign':
      'L’insegna di Anna Studios all’ingresso, con il logo a conchiglia, le palme e le colline alle spalle',
    'anna-studios-garden-and-drive':
      'Il vialetto e il giardino di Anna Studios, con gli ulivi e i bassi edifici bianchi oltre',
    'reception-desk-bell': 'Un campanello da reception in ottone su una scrivania di legno',

    'double-room-twin-beds-and-balcony-door':
      'Una camera doppia con due letti singoli, una scrivania con specchio e la porta del balcone aperta',
    'double-room-balcony-with-sun-hat':
      'Il balcone di una camera doppia, con un tavolo rotondo, un cappello di paglia e un telo rosso sul muretto',
    'double-room-bathroom-with-blue-tiles':
      'Il bagno di una camera doppia con lavabo, mensola a specchio e doccia dietro una tenda azzurra',
    'double-room-terrace-table-and-chairs':
      'La terrazza privata di una camera doppia con tavolo, due sedie e vista sui campi',
    'double-room-desk-mirror-and-kettle':
      'L’angolo scrivania di una camera doppia, con specchio, quadretti, bollitore e frigorifero',
    'double-room-terrace-over-the-garden':
      'La terrazza di una camera doppia con vista sul giardino e sugli alberi fino agli edifici oltre',
    'double-room-twin-beds-and-wardrobe':
      'Una camera doppia con due letti singoli con lenzuola bianche, un armadio e un frigorifero',
    'double-room-veranda-under-the-trees':
      'La veranda di una camera doppia con tavolo rotondo e sedie all’ombra degli alberi',
    'double-room-bed-facing-the-balcony':
      'Una camera doppia con il letto rivolto verso la porta-finestra aperta e il verde all’esterno',
    'double-room-twin-beds-and-television':
      'Una camera doppia con due letti singoli, un televisore a parete e una toeletta',

    'studio-twin-beds-against-the-blue-wall':
      'Un monolocale con due letti singoli contro una parete azzurra e le porte-finestra aperte sul giardino',
    'studio-kitchenette-beside-the-doorway':
      'L’angolo cottura di un monolocale, con piano cottura, lavello e pensili, accanto alla porta della terrazza',
    'studio-pergola-terrace-under-the-tree':
      'La terrazza di un monolocale sotto un pergolato, all’ombra di un grande albero, con tavolo e due sedie',
    'studio-looking-through-to-the-kitchenette':
      'Un monolocale visto dal letto, oltre i portabagagli fino all’angolo cottura e alla porta d’ingresso',
    'studio-twin-beds-and-open-shelving':
      'Un monolocale con due letti singoli, una parete azzurra e mensole aperte con gli asciugamani impilati',
    'studio-bed-with-the-kitchen-beyond':
      'Il letto di un monolocale rifatto di bianco, con l’angolo cottura e gli sgabelli nella stanza oltre',
    'studio-double-bed-with-doors-thrown-open':
      'Il letto matrimoniale di un monolocale accanto alla parete azzurra, con le porte spalancate sulla terrazza',
    'studio-terrace-table-under-the-pergola':
      'La terrazza di un monolocale vista dall’interno, tavolo e sedie sotto il pergolato con l’albero oltre',
    'studio-double-bed-and-blue-wall':
      'Il letto matrimoniale di un monolocale contro la parete azzurra, con le luci da lettura e la finestra a lato',
    'studio-bathroom-with-basin-and-shower':
      'Il bagno di un monolocale con lavabo, specchio ad arco e doccia dietro una tenda decorata',
    'studio-veranda-beside-the-vines':
      'La veranda di un monolocale con tavolo rotondo e due sedie, accanto alla vite e al muro del giardino',
    'studio-veranda-looking-over-the-garden':
      'La veranda di un monolocale con tavolo e due sedie, con vista sul giardino e sui campi',
    'studio-balcony-with-village-and-sea':
      'Il balcone di un monolocale con tavolo e sedie, con vista sul villaggio bianco e sul mare',
    'studio-kitchenette-and-single-bed':
      'L’angolo cottura di un monolocale con lavello e pensili, e un letto singolo sotto la finestra',

    'apartment-for-two-double-bed-and-balcony':
      'La camera dell’appartamento per due, con il letto matrimoniale accanto alle porte-finestra aperte',
    'apartment-for-two-bedroom-with-shutters':
      'Una camera dell’appartamento per due, con le persiane grigie aperte e la cucina di lato',
    'apartment-for-two-kitchenette-and-window':
      'L’angolo cottura dell’appartamento per due, con lavello, piano cottura e pensili sotto una finestrella',
    'apartment-for-two-dining-corner':
      'L’angolo pranzo dell’appartamento per due, con un tavolo dalla tovaglia a righe e la camera oltre',
    'apartment-for-two-shower-room':
      'Il locale doccia dell’appartamento per due, con una tenda decorata e una piccola finestra',
    'apartment-for-two-balcony-among-the-trees':
      'Il balcone dell’appartamento per due, con tavolo e sedie tra gli alberi',
    'apartment-for-two-bathroom-basin':
      'Il bagno dell’appartamento per due, con piastrelle azzurre decorate, lavabo e specchio',

    'apartment-for-four-bedroom-and-wardrobe':
      'Una camera dell’appartamento per quattro, con letto matrimoniale, armadio aperto e un cappello di paglia',
    'apartment-for-four-hallway-between-rooms':
      'Il corridoio dell’appartamento per quattro, con vista fino alla seconda camera e al balcone',
    'apartment-for-four-double-bed-and-desk':
      'Un letto matrimoniale nell’appartamento per quattro, con testiera in ferro battuto, scrivania e specchio',
    'apartment-for-four-terrace-facing-inland':
      'Una terrazza dell’appartamento per quattro rivolta verso l’entroterra, oltre gli alberi fino alle colline',
    'apartment-for-four-kitchen-and-dining-table':
      'La cucina e il tavolo dell’appartamento per quattro, con le porte-finestra aperte sul mare',
    'apartment-for-four-dining-area-and-twin-beds':
      'L’appartamento per quattro visto dalla porta, il tavolo da un lato e due letti dall’altro',
    'apartment-for-four-bathroom-with-blue-tiles':
      'Il bagno dell’appartamento per quattro, con piastrelle azzurre, lavabo e tenda della doccia decorata',
    'apartment-for-four-pergola-terrace':
      'La terrazza con pergolato dell’appartamento per quattro, con un lungo tavolo, sedie e le colline oltre',
  },
};
