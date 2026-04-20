window.APP_CONFIG = {
  map: {
    center: [-7.8014, 110.3647],
    zoom: 13,
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  geocoder: {
    provider: 'geoapify',
    apiKey: '',
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
    candidateTypes: ['balanced', 'short', 'less_maneuvers']
  },
  scoring: {
    cctvNearMeters: 80,
    hospitalNearMeters: 180,
    policeNearMeters: 180,
    weights: {
      distanceMeters: -0.00015,
      cctv: 2.8,
      hospital: 3.5,
      police: 3.5
    }
  }
,
  emergency: {
    policeCall: '110'
  }
};
