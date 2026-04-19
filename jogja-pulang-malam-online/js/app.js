const map = L.map('map').setView(APP_CONFIG.map.center, APP_CONFIG.map.zoom);
L.tileLayer(APP_CONFIG.map.tileUrl, { attribution: APP_CONFIG.map.attribution }).addTo(map);

const layerStore = {};
let routeLine = null;
let clickedPointMarker = null;

const state = {
  datasets: {},
  emergencyOrigin: null,
};

const dataFiles = {
  zones: 'data/zones.geojson',
  cctv: 'data/cctv.geojson',
  hotspots: 'data/hotspots.geojson',
  hospitals: 'data/hospitals.geojson',
  police: 'data/police.geojson',
  darkspots: 'data/darkspots.geojson',
  transit: 'data/transit.geojson',
  routes: 'data/routes.geojson'
};

init();

async function init() {
  await loadAllData();
  buildLayers();
  renderZoneSummary();
  bindUI();

  map.on('click', (e) => {
    state.emergencyOrigin = [e.latlng.lng, e.latlng.lat];
    if (clickedPointMarker) map.removeLayer(clickedPointMarker);
    clickedPointMarker = L.marker(e.latlng).addTo(map).bindPopup('Titik emergency stop').openPopup();
    renderEmergencyStops(state.emergencyOrigin);
  });
}

async function loadAllData() {
  const entries = await Promise.all(
    Object.entries(dataFiles).map(async ([key, url]) => [key, await fetch(url).then(r => r.json())])
  );
  state.datasets = Object.fromEntries(entries);
}

function buildLayers() {
  layerStore.zones = L.geoJSON(state.datasets.zones, {
    style: feature => ({
      color: '#7ba4ff',
      weight: 1,
      fillOpacity: 0.42,
      fillColor: getZoneColor(feature.properties.night_score)
    }),
    onEachFeature: (feature, layer) => {
      layer.bindPopup(buildZonePopup(feature.properties), { className: 'zone-popup' });
    }
  }).addTo(map);

  layerStore.cctv = pointLayer(state.datasets.cctv, '#6fd3ff', '📷 CCTV');
  layerStore.hotspots = pointLayer(state.datasets.hotspots, '#72e4b8', '📶 Hotspot');
  layerStore.hospitals = pointLayer(state.datasets.hospitals, '#ff8fab', '🏥 Layanan Kesehatan');
  layerStore.police = pointLayer(state.datasets.police, '#ffd166', '🚓 Polisi');
  layerStore.darkspots = pointLayer(state.datasets.darkspots, '#ff6f7d', '⚠️ Titik Gelap');
  layerStore.transit = pointLayer(state.datasets.transit, '#b692ff', '🚌 Transit');

  Object.keys(layerStore).forEach(k => {
    if (k !== 'zones') layerStore[k].addTo(map);
  });
}

function pointLayer(geojson, color, label) {
  return L.geoJSON(geojson, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
      radius: 6,
      color,
      fillColor: color,
      fillOpacity: 0.85,
      weight: 1
    }),
    onEachFeature: (feature, layer) => {
      const props = feature.properties || {};
      const html = `<strong>${label}</strong><br>${props.name || '-'}<br><small>${props.address || ''}</small>`;
      layer.bindPopup(html);
    }
  });
}

function buildZonePopup(props) {
  return `
    <div class="zone-popup">
      <strong>${props.name}</strong><br>
      Night score: <b>${props.night_score}</b><br>
      CCTV: ${props.cctv_count}<br>
      Hotspot: ${props.hotspot_count}<br>
      RS/klinik: ${props.hospital_count}<br>
      Polisi: ${props.police_count}<br>
      Titik gelap: ${props.darkspot_count}<br>
      Kecelakaan/insiden: ${props.incident_index}
    </div>
  `;
}

function getZoneColor(score) {
  if (score >= 80) return '#1dd1a1';
  if (score >= 65) return '#9be15d';
  if (score >= 50) return '#f4d35e';
  if (score >= 35) return '#ff9f1c';
  return '#ef476f';
}

function renderZoneSummary() {
  const features = [...state.datasets.zones.features].sort((a, b) => b.properties.night_score - a.properties.night_score);
  if (!features.length) return;
  document.getElementById('bestZone').textContent = `${features[0].properties.name} (${features[0].properties.night_score})`;
  document.getElementById('worstZone').textContent = `${features.at(-1).properties.name} (${features.at(-1).properties.night_score})`;
}

function bindUI() {
  document.querySelectorAll('[data-layer-toggle]').forEach(el => {
    el.addEventListener('change', (e) => {
      const key = e.target.dataset.layerToggle;
      if (!layerStore[key]) return;
      if (e.target.checked) map.addLayer(layerStore[key]);
      else map.removeLayer(layerStore[key]);
    });
  });

  document.getElementById('drawDemoRouteBtn').addEventListener('click', drawBestDemoRoute);
  document.getElementById('clearRouteBtn').addEventListener('click', clearRoute);
}

function drawBestDemoRoute() {
  const routes = state.datasets.routes.features;
  const scored = routes.map(f => ({
    feature: f,
    score: computeRouteCost(f.properties)
  })).sort((a, b) => a.score - b.score);

  const best = scored[0];
  const worst = scored.at(-1);

  if (routeLine) map.removeLayer(routeLine);
  routeLine = L.geoJSON(best.feature, {
    style: { color: '#72e4b8', weight: 6, opacity: 0.92 }
  }).addTo(map);
  map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });

  document.getElementById('routeTag').textContent = best.feature.properties.name;
  document.getElementById('routeInfo').innerHTML = `
    <h3>Info Rute</h3>
    <p><strong>${best.feature.properties.name}</strong></p>
    <p class="route-good">Biaya aman: ${best.score.toFixed(2)}</p>
    <p>Panjang: ${best.feature.properties.length_m} m</p>
    <p>CCTV dekat: ${best.feature.properties.cctv_coverage}</p>
    <p>Titik gelap: ${best.feature.properties.darkspot_exposure}</p>
    <p>Insiden: ${best.feature.properties.incident_exposure}</p>
    <hr>
    <p class="route-bad">Alternatif terburuk: ${worst.feature.properties.name} (${worst.score.toFixed(2)})</p>
  `;

  const start = best.feature.geometry.coordinates[0];
  state.emergencyOrigin = start;
  renderEmergencyStops(start);
}

function computeRouteCost(p) {
  const w = APP_CONFIG.scoring.routeWeights;
  return (
    (p.length_m * w.length / 1000) +
    (p.cctv_coverage * w.cctvCoverage) +
    (p.hospital_access * w.hospitalAccess) +
    (p.police_access * w.policeAccess) +
    (p.darkspot_exposure * w.darkspotExposure) +
    (p.incident_exposure * w.incidentExposure) +
    (p.transit_access * w.transitAccess)
  );
}

function renderEmergencyStops(originCoord) {
  const helpFeatures = [
    ...state.datasets.hospitals.features.map(f => ({...f, properties: {...f.properties, help_type: 'Kesehatan'}})),
    ...state.datasets.police.features.map(f => ({...f, properties: {...f.properties, help_type: 'Polisi'}})),
    ...state.datasets.transit.features.map(f => ({...f, properties: {...f.properties, help_type: 'Transit'}}))
  ];

  const enriched = helpFeatures.map(f => ({
    feature: f,
    distance: turf.distance(turf.point(originCoord), turf.point(f.geometry.coordinates), { units: 'kilometers' })
  })).sort((a, b) => a.distance - b.distance).slice(0, 4);

  document.getElementById('nearestHelp').textContent = enriched[0]
    ? `${enriched[0].feature.properties.name} (${enriched[0].distance.toFixed(2)} km)`
    : '-';

  const el = document.getElementById('emergencyList');
  el.innerHTML = enriched.map(item => `
    <div class="emergency-item">
      <strong>${item.feature.properties.name}</strong>
      <small>${item.feature.properties.help_type} • ${item.distance.toFixed(2)} km</small>
      <small>${item.feature.properties.phone || 'Kontak belum diisi'}</small>
    </div>
  `).join('');
}

function clearRoute() {
  if (routeLine) {
    map.removeLayer(routeLine);
    routeLine = null;
  }
  if (clickedPointMarker) {
    map.removeLayer(clickedPointMarker);
    clickedPointMarker = null;
  }
  document.getElementById('routeTag').textContent = 'Belum dihitung';
  document.getElementById('nearestHelp').textContent = '-';
  document.getElementById('routeInfo').innerHTML = '<h3>Info Rute</h3><p>Pilih asal dan tujuan, lalu hitung rute.</p>';
  document.getElementById('emergencyList').innerHTML = '';
}
