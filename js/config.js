window.APP_CONFIG = {
  map: {
    center: [-7.8014, 110.3647],
    zoom: 13,
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  geocoder: {
    provider: 'geoapify',
    apiKey: 'f77655c38be645f7955d3b36c86c080e',
    countryCodes: ['id'],
    biasCenter: { lat: -7.7956, lng: 110.3695 },
    filterCircleMeters: 30000,
    limit: 6
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
  scoring: {
    cctvNearMeters: 90,
    hospitalNearMeters: 220,
    policeNearMeters: 220,
    spbuNearMeters: 200,
    weights: {
      distanceMeters: -0.00015,
      cctv: 2.9,
      hospital: 3.4,
      police: 3.8,
      spbu: 1.8
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
