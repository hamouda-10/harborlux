export type ResidenceCategory = 'All' | 'Available' | 'Penthouses' | 'Full-Floor';

export interface FloorplanRoom {
  id: string;
  name: string;
  dimensions: string;
  areaSqFt: number;
  finish: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Residence {
  id: string;
  name: string;
  level: string;
  elevationM: number;
  category: 'Penthouses' | 'Full-Floor';
  status: 'Available' | 'Private Hold';
  priceUsd: string;
  interiorSqFt: number;
  exteriorSqFt: number;
  bedrooms: number;
  bathrooms: number;
  ceilingM: string;
  exposure: string;
  privateLifts: number;
  summary: string;
  highlights: string[];
  rooms: FloorplanRoom[];
}

export const FIRM_METRICS = [
  {
    value: '312 m',
    label: 'Crown Elevation',
    detail: '78 habitable storeys above deep-water datum',
  },
  {
    value: '12',
    label: 'Private Estates',
    detail: 'Strictly full-floor and triplex sky residences',
  },
  {
    value: '52 dB',
    label: 'Storm Attenuation',
    detail: 'Triple-laminated acoustic curtain wall envelope',
  },
  {
    value: '8.5 m/s',
    label: 'Express Lifts',
    detail: 'Biometric direct-to-foyer twin shafts',
  },
];

export const ENGINEERING_PILLARS = [
  {
    num: '01',
    title: 'Acoustic Storm Envelope',
    metric: '52 dB STC Rating',
    description:
      'Low-iron triple glazing suspended in thermally broken titanium-anodised mullions eliminates harbour gale noise while preserving rain-slick night clarity.',
  },
  {
    num: '02',
    title: 'Cantilevered Sky Pools',
    metric: '28°C Year-Round',
    description:
      'Zero-edge basalt lap pools engineered with tuned mass dampers directly beneath the slab, keeping water mirror-calm even in 90 km/h squalls.',
  },
  {
    num: '03',
    title: 'Private Quay & Helipad Link',
    metric: '4 Min Transfer',
    description:
      'Sub-surface arrival gallery connects residents from a 45-metre superyacht berth and twin-engine rooftop helipad directly to private foyers.',
  },
  {
    num: '04',
    title: 'Museum-Grade Air & Light',
    metric: 'HEPA H14 + 2700K',
    description:
      'Hospital-grade positive-pressure filtration paired with circadian architectural bronze-recessed luminaires calibrated for nocturnal skyline living.',
  },
];

export const HARBOUR_PROXIMITY = [
  {
    place: 'Sovereign Private Marina Berth',
    mode: 'Express Sub-Surface Lift',
    time: '2 min',
    distance: '0.1 km',
  },
  {
    place: 'Harbour Crown Helipad (VHH-01)',
    mode: 'Private Sky Lobby',
    time: '4 min',
    distance: 'Vertical',
  },
  {
    place: 'Central Financial Exchange',
    mode: 'Dedicated Harbour Tunnel',
    time: '6 min',
    distance: '2.4 km',
  },
  {
    place: 'Harbour Opera & Cultural Quay',
    mode: 'Covered Waterfront Arcade',
    time: '8 min',
    distance: '1.1 km',
  },
];

export const ALTITUDE_LEVELS = [
  {
    level: '62F',
    altitudeM: 248,
    horizonKm: 56.2,
    windDampening: '99.1%',
    noiseFloorDb: '24 dB',
    vantageNote: 'Eye-level with mid-harbour container cranes and illuminated bridge spans.',
  },
  {
    level: '66F',
    altitudeM: 264,
    horizonKm: 58.0,
    windDampening: '99.3%',
    noiseFloorDb: '23 dB',
    vantageNote: 'Clears the financial district mid-rise ridge with uninterrupted east-channel views.',
  },
  {
    level: '71F',
    altitudeM: 284,
    horizonKm: 60.1,
    windDampening: '99.5%',
    noiseFloorDb: '21 dB',
    vantageNote: 'Above the harbour mist inversion layer; full 270-degree neon skyline arc.',
  },
  {
    level: '74F',
    altitudeM: 296,
    horizonKm: 61.4,
    windDampening: '99.6%',
    noiseFloorDb: '20 dB',
    vantageNote: 'Wrap-around glass balustrade loggia framing both outer sea channel and city core.',
  },
  {
    level: '78F',
    altitudeM: 312,
    horizonKm: 63.0,
    windDampening: '99.8%',
    noiseFloorDb: '19 dB',
    vantageNote: 'Unobstructed 360-degree summit crown with private heated rooftop lap pool.',
  },
];

export const RESIDENCES: Residence[] = [
  {
    id: 'crown-triplex-78',
    name: 'Crown Triplex — The Summit',
    level: 'Levels 76–78',
    elevationM: 312,
    category: 'Penthouses',
    status: 'Available',
    priceUsd: '$48,500,000',
    interiorSqFt: 9400,
    exteriorSqFt: 3250,
    bedrooms: 5,
    bathrooms: 6.5,
    ceilingM: '4.4 m / 8.2 m Void',
    exposure: '360° Full Horizon',
    privateLifts: 2,
    summary:
      'Spanning the top three levels of Harborlux with a black lacquer arrival gallery, private heated rooftop pool, and the signature cantilevered glass harbour terrace.',
    highlights: [
      '18-metre heated rooftop basalt lap pool',
      'Black lacquer sculptural gallery & private lift core',
      '1,400-bottle humidity-controlled wine & whisky vault',
      'Direct private stair to Crown Helipad Lounge',
    ],
    rooms: [
      {
        id: 'terrace',
        name: 'Harbour Glass Loggia',
        dimensions: '54\' × 16\' (16.5 × 4.9 m)',
        areaSqFt: 864,
        finish: 'Honed Rain-Slip Basalt & 18mm Low-Iron Glass',
        x: 4,
        y: 6,
        w: 92,
        h: 18,
      },
      {
        id: 'salon',
        name: 'Double-Height Grand Salon',
        dimensions: '46\' × 28\' (14.0 × 8.5 m)',
        areaSqFt: 1288,
        finish: 'Smoked European Oak & Brushed Gunmetal',
        x: 4,
        y: 26,
        w: 56,
        h: 38,
      },
      {
        id: 'pool',
        name: 'Rooftop Pool Deck (Upper)',
        dimensions: '60\' × 22\' (18.3 × 6.7 m)',
        areaSqFt: 1320,
        finish: 'Heated Nero Assoluto Granite',
        x: 62,
        y: 26,
        w: 34,
        h: 38,
      },
      {
        id: 'primary',
        name: 'Primary Harbour Suite',
        dimensions: '32\' × 22\' (9.8 × 6.7 m)',
        areaSqFt: 704,
        finish: 'Silk Acoustic Wall Panels & Travertine Bath',
        x: 4,
        y: 66,
        w: 38,
        h: 28,
      },
      {
        id: 'foyer',
        name: 'Lacquer Lift Foyer',
        dimensions: '20\' × 18\' (6.1 × 5.5 m)',
        areaSqFt: 360,
        finish: 'Hand-Rubbed Piano Lacquer & Bronze',
        x: 44,
        y: 66,
        w: 22,
        h: 28,
      },
      {
        id: 'kitchen',
        name: 'Chef Atelier & Vault',
        dimensions: '28\' × 20\' (8.5 × 6.1 m)',
        areaSqFt: 560,
        finish: 'Monolithic Fluted Stone & Gaggenau 400',
        x: 68,
        y: 66,
        w: 28,
        h: 28,
      },
    ],
  },
  {
    id: 'harbour-loggia-74',
    name: 'Harbour Loggia Residence',
    level: 'Level 74',
    elevationM: 296,
    category: 'Penthouses',
    status: 'Available',
    priceUsd: '$34,000,000',
    interiorSqFt: 6850,
    exteriorSqFt: 1420,
    bedrooms: 4,
    bathrooms: 5,
    ceilingM: '4.1 m Clear',
    exposure: 'North, East & South',
    privateLifts: 2,
    summary:
      'A full-floor sky sanctuary centred around an uninterrupted 28-metre harbourfront glass balustrade loggia designed for nocturnal entertaining above the neon skyline.',
    highlights: [
      '28-metre cantilevered harbourfront terrace',
      'Acoustic library & private screening room',
      'Dual chef and service kitchens with separate lift',
      'Dedicated chauffeur & marina valet bay',
    ],
    rooms: [
      {
        id: 'loggia74',
        name: '28m Sky Loggia',
        dimensions: '92\' × 14\' (28.0 × 4.3 m)',
        areaSqFt: 1288,
        finish: 'Flamed Dark Granite & Frameless Glass',
        x: 4,
        y: 6,
        w: 92,
        h: 16,
      },
      {
        id: 'living74',
        name: 'Skyline Living Gallery',
        dimensions: '44\' × 26\' (13.4 × 7.9 m)',
        areaSqFt: 1144,
        finish: 'Charred Cedar & Matte Plaster',
        x: 4,
        y: 24,
        w: 60,
        h: 38,
      },
      {
        id: 'dining74',
        name: 'Formal Dining Pavilion',
        dimensions: '26\' × 24\' (7.9 × 7.3 m)',
        areaSqFt: 624,
        finish: 'Pietra Grey Marble',
        x: 66,
        y: 24,
        w: 30,
        h: 38,
      },
      {
        id: 'suite74',
        name: 'Corner Primary Wing',
        dimensions: '30\' × 22\' (9.1 × 6.7 m)',
        areaSqFt: 660,
        finish: 'Walnut Herringbone & Limestone Spa',
        x: 4,
        y: 64,
        w: 44,
        h: 30,
      },
      {
        id: 'study74',
        name: 'Acoustic Observatory Study',
        dimensions: '22\' × 18\' (6.7 × 5.5 m)',
        areaSqFt: 396,
        finish: 'Saddle Leather & Smoked Bronze',
        x: 50,
        y: 64,
        w: 46,
        h: 30,
      },
    ],
  },
  {
    id: 'storm-observatory-71',
    name: 'Storm Observatory Residence',
    level: 'Level 71',
    elevationM: 284,
    category: 'Full-Floor',
    status: 'Private Hold',
    priceUsd: '$27,800,000',
    interiorSqFt: 5200,
    exteriorSqFt: 940,
    bedrooms: 4,
    bathrooms: 4.5,
    ceilingM: '3.9 m Clear',
    exposure: '360° Panoramic',
    privateLifts: 2,
    summary:
      'Elevated directly above the harbour mist line with corner-free structural glazing, private wellness Hammam suite, and dual sunset terraces.',
    highlights: [
      'Column-free 14-metre corner glazing',
      'Private steam Hammam & cold-plunge suite',
      'Custom Lutron nocturnal lighting scenes',
      'Two climate-controlled subterranean vaults',
    ],
    rooms: [
      {
        id: 'deck71',
        name: 'West Channel Terrace',
        dimensions: '52\' × 15\' (15.8 × 4.6 m)',
        areaSqFt: 780,
        finish: 'Weathered Basalt Pavers',
        x: 4,
        y: 6,
        w: 92,
        h: 16,
      },
      {
        id: 'great71',
        name: 'Observatory Great Room',
        dimensions: '42\' × 24\' (12.8 × 7.3 m)',
        areaSqFt: 1008,
        finish: 'Wide-Plank Fumed Ash',
        x: 4,
        y: 24,
        w: 58,
        h: 40,
      },
      {
        id: 'spa71',
        name: 'Private Hammam & Plunge',
        dimensions: '24\' × 20\' (7.3 × 6.1 m)',
        areaSqFt: 480,
        finish: 'Carved Soapstone & Cedar',
        x: 64,
        y: 24,
        w: 32,
        h: 40,
      },
      {
        id: 'bed71',
        name: 'Harbour Primary Suite',
        dimensions: '28\' × 20\' (8.5 × 6.1 m)',
        areaSqFt: 560,
        finish: 'Woven Wool & Brushed Nickel',
        x: 4,
        y: 66,
        w: 48,
        h: 28,
      },
      {
        id: 'guests71',
        name: 'Guest Suites & Gallery',
        dimensions: '34\' × 20\' (10.4 × 6.1 m)',
        areaSqFt: 680,
        finish: 'Travertine & Lacquered Oak',
        x: 54,
        y: 66,
        w: 42,
        h: 28,
      },
    ],
  },
  {
    id: 'east-channel-66',
    name: 'East Channel Residence',
    level: 'Level 66',
    elevationM: 264,
    category: 'Full-Floor',
    status: 'Available',
    priceUsd: '$21,500,000',
    interiorSqFt: 4650,
    exteriorSqFt: 720,
    bedrooms: 3,
    bathrooms: 3.5,
    ceilingM: '3.8 m Clear',
    exposure: 'East, South & West',
    privateLifts: 1,
    summary:
      'Calibrated for collectors and international principals seeking full-floor privacy, museum-grade UV filtration, and unobstructed views down the illuminated shipping channel.',
    highlights: [
      'Museum-grade UV & humidity climate control',
      '22-metre uninterrupted art gallery corridor',
      'Private sunset dining loggia with radiant stone',
      '24/7 Harborlux concierge & private berth access',
    ],
    rooms: [
      {
        id: 'terrace66',
        name: 'Channel Sunset Loggia',
        dimensions: '48\' × 14\' (14.6 × 4.3 m)',
        areaSqFt: 672,
        finish: 'Heated Basalt Stone',
        x: 4,
        y: 6,
        w: 92,
        h: 16,
      },
      {
        id: 'gallery66',
        name: 'Collector Living & Salon',
        dimensions: '40\' × 24\' (12.2 × 7.3 m)',
        areaSqFt: 960,
        finish: 'Architectural Concrete & Oak',
        x: 4,
        y: 24,
        w: 62,
        h: 38,
      },
      {
        id: 'kitchen66',
        name: 'Monolith Kitchen & Bar',
        dimensions: '24\' × 20\' (7.3 × 6.1 m)',
        areaSqFt: 480,
        finish: 'Brushed Steel & Black Quartzite',
        x: 68,
        y: 24,
        w: 28,
        h: 38,
      },
      {
        id: 'suite66',
        name: 'East Harbour Primary',
        dimensions: '26\' × 20\' (7.9 × 6.1 m)',
        areaSqFt: 520,
        finish: 'Natural Linen & Dolomite',
        x: 4,
        y: 64,
        w: 45,
        h: 30,
      },
      {
        id: 'suites66',
        name: 'Two En-Suite Wings',
        dimensions: '32\' × 18\' (9.8 × 5.5 m)',
        areaSqFt: 576,
        finish: 'Bleached Oak & Limestone',
        x: 51,
        y: 64,
        w: 45,
        h: 30,
      },
    ],
  },
];
