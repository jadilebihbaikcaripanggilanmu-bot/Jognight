window.APP_CONFIG = {
  map: {
    // Tengah Provinsi DIY agar layer CCTV/RS/Polsek/SPBU/24 jam langsung terlihat lebih menyeluruh.
    center: [-7.8754, 110.4262],
    zoom: 10,
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  geocoder: {
    provider: 'geoapify',
    apiKey: 'f77655c38be645f7955d3b36c86c080e',
    countryCodes: ['id'],
    biasCenter: { lat: -7.8754, lng: 110.4262 },
    filterCircleMeters: 80000,
    limit: 8
  },
  routing: {
    provider: 'geoapify',
    mode: 'drive',
    lang: 'en',
    traffic: 'approximated',
    candidateTypes: ['balanced', 'short', 'less_maneuvers'],
    googleMapsTravelMode: 'driving',
    googleMapsWaypointCount: 6
  },
  data: {
    useOverpass: true,
    // false = SPBU dan titik 24 jam tidak memakai fallback lama jika data live gagal,
    // supaya titik ngawur tidak ikut tampil.
    staticFallbackOnLiveFail: false,
    overpassEndpoints: [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
      'https://overpass.openstreetmap.ru/api/interpreter'
    ],
    // Bounding box kasar satu Provinsi DIY + sedikit buffer tepi wilayah.
    bounds: {
      south: -8.25,
      west: 110.00,
      north: -7.50,
      east: 110.90
    }
  },
  scoring: {
    cctvNearMeters: 100,
    hospitalNearMeters: 280,
    policeNearMeters: 280,
    spbuNearMeters: 240,
    store24NearMeters: 220,
    weights: {
      distanceMeters: -0.00015,
      cctv: 2.9,
      hospital: 3.4,
      police: 3.8,
      spbu: 1.8,
      store24: 1.4
    }
  },
  emergency: {
    policeCall: '110',
    ambulanceCall: '119'
  },
  ui: {
    defaultLanguage: 'id'
  }
};
