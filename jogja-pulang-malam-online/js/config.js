window.APP_CONFIG = {
  map: {
    center: [-7.8014, 110.3647],
    zoom: 13,
    tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  scoring: {
    zoneWeights: {
      cctv: 0.25,
      hotspots: 0.1,
      hospitals: 0.2,
      police: 0.2,
      transit: 0.1,
      darkspots: -0.2,
      incident: -0.15
    },
    routeWeights: {
      length: 0.35,
      cctvCoverage: -0.15,
      hospitalAccess: -0.1,
      policeAccess: -0.1,
      darkspotExposure: 0.2,
      incidentExposure: 0.2,
      transitAccess: -0.1
    }
  }
};
