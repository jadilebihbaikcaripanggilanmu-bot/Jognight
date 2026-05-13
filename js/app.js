const map = L.map('map', { zoomControl: false }).setView(APP_CONFIG.map.center, APP_CONFIG.map.zoom);
L.control.zoom({ position: 'topleft' }).addTo(map);
L.tileLayer(APP_CONFIG.map.tileUrl, { attribution: APP_CONFIG.map.attribution }).addTo(map);

const EMPTY_GEOJSON = { type: 'FeatureCollection', features: [] };
const EMPTY_ARRAY = [];

const I18N = {
  id: {
    appTagline: 'Night Safety & Mobility',
    routeInput: 'Input Rute',
    origin: 'Asal',
    destination: 'Tujuan',
    useMyLocation: 'Pakai lokasi saya',
    findingLocation: 'Mengambil lokasi...',
    findSafeRoute: 'Cari rute aman',
    calculating: 'Menghitung...',
    reset: 'Reset',
    routeInfo: 'Info Rute',
    noRouteYet: 'Pilih asal dan tujuan, lalu klik Cari rute aman.',
    selectedRoute: 'Rute terpilih',
    score: 'Skor aman',
    distance: 'Jarak',
    estimate: 'Estimasi',
    cctvNear: 'CCTV dekat',
    hospitalNear: 'RS / Klinik',
    policeNear: 'Polisi',
    spbuNear: 'SPBU dekat',
    directions: 'Petunjuk awal',
    cctvAlong: 'CCTV dekat rute',
    bestRoute: 'Rute terbaik',
    alternativeRoute: 'Rute alternatif',
    commonSettings: 'Common settings',
    language: 'Bahasa',
    callCentre: 'Call Centre',
    nearestHelp: 'Bantuan terdekat',
    nearestHospital: 'RS terdekat',
    nearestPolice: 'Polisi terdekat',
    policeButton: '110 Polisi',
    ambulanceButton: '119 Ambulans',
    openStream: 'Buka stream',
    openPortal: 'Portal CCTV',
    openGoogleMaps: 'Lanjutkan di Google Maps',
    openWebsite: 'Website',
    openLocation: 'Buka lokasi',
    searchWeb: 'Cari web',
    callHospital: 'Hubungi RS',
    callOffice: 'Hubungi kantor',
    callPolice: 'Hubungi 110',
    policeOffice: 'Kantor Polisi',
    hospitalClinic: 'RS / Klinik',
    cctv: 'CCTV',
    unavailable: 'Belum tersedia',
    noNearbyCctv: 'Tidak ada CCTV dekat rute.',
    spbuTitle: 'SPBU / Pom Bensin',
    nearestSpbu: 'SPBU terdekat',
    routeType: {
      balanced: 'Seimbang',
      short: 'Terpendek',
      less_maneuvers: 'Minim belokan'
    },
    placeholders: {
      origin: 'Contoh: Tugu Yogyakarta',
      destination: 'Contoh: UGM'
    },
    stepsFallback: 'Petunjuk belum tersedia.',
    autocompleteEmpty: 'Tidak ada saran lokasi',
    routePopupStart: 'Asal',
    routePopupEnd: 'Tujuan',
    routeGenerated: 'Rute aman berhasil dihitung.',
    cctvTitle: 'CCTV',
    hospitalTitle: 'RS / Klinik',
    policeTitle: 'Kantor Polisi',
    minutesShort: 'menit'
  },
  en: {
    appTagline: 'Night Safety & Mobility',
    routeInput: 'Route Input',
    origin: 'Origin',
    destination: 'Destination',
    useMyLocation: 'Use my location',
    findingLocation: 'Getting location...',
    findSafeRoute: 'Find safer route',
    calculating: 'Calculating...',
    reset: 'Reset',
    routeInfo: 'Route Info',
    noRouteYet: 'Choose origin and destination, then click Find safer route.',
    selectedRoute: 'Selected route',
    score: 'Safety score',
    distance: 'Distance',
    estimate: 'Estimate',
    cctvNear: 'Nearby CCTV',
    hospitalNear: 'Hospitals',
    policeNear: 'Police',
    spbuNear: 'Nearby SPBU',
    directions: 'First directions',
    cctvAlong: 'CCTV near route',
    bestRoute: 'Best route',
    alternativeRoute: 'Alternative route',
    commonSettings: 'Common settings',
    language: 'Language',
    callCentre: 'Call Centre',
    nearestHelp: 'Nearest help',
    nearestHospital: 'Nearest hospital',
    nearestPolice: 'Nearest police',
    policeButton: '110 Police',
    ambulanceButton: '119 Ambulance',
    openStream: 'Open stream',
    openPortal: 'CCTV portal',
    openGoogleMaps: 'Continue in Google Maps',
    openWebsite: 'Website',
    openLocation: 'Open location',
    searchWeb: 'Search web',
    callHospital: 'Call hospital',
    callOffice: 'Call office',
    callPolice: 'Call 110',
    policeOffice: 'Police Office',
    hospitalClinic: 'Hospital / Clinic',
    cctv: 'CCTV',
    unavailable: 'Not available',
    noNearbyCctv: 'No CCTV found near the route.',
    spbuTitle: 'Fuel Station',
    nearestSpbu: 'Nearest fuel station',
    routeType: {
      balanced: 'Balanced',
      short: 'Shortest',
      less_maneuvers: 'Fewer turns'
    },
    placeholders: {
      origin: 'Example: Tugu Yogyakarta',
      destination: 'Example: UGM'
    },
    stepsFallback: 'Directions are not available yet.',
    autocompleteEmpty: 'No location suggestions',
    routePopupStart: 'Origin',
    routePopupEnd: 'Destination',
    routeGenerated: 'Safer route has been calculated.',
    cctvTitle: 'CCTV',
    hospitalTitle: 'Hospital / Clinic',
    policeTitle: 'Police Office',
    minutesShort: 'min'

  },
  jv: {
    appTagline: 'Keamanan lan Mobilitas Wengi',
    routeInput: 'Input Rute',
    origin: 'Asal',
    destination: 'Tujuan',
    useMyLocation: 'Gunakake lokasiku',
    findingLocation: 'Njupuk lokasi...',
    findSafeRoute: 'Golek rute aman',
    calculating: 'Ngitung...',
    reset: 'Reset',
    routeInfo: 'Info Rute',
    noRouteYet: 'Pilih asal lan tujuan, banjur klik Golek rute aman.',
    selectedRoute: 'Rute kapilih',
    score: 'Skor aman',
    distance: 'Jarak',
    estimate: 'Perkiraan',
    cctvNear: 'CCTV cedhak',
    hospitalNear: 'RS / Klinik',
    policeNear: 'Polisi',
    spbuNear: 'SPBU cedhak',
    directions: 'Pandhuan awal',
    cctvAlong: 'CCTV cedhak rute',
    bestRoute: 'Rute paling apik',
    alternativeRoute: 'Rute alternatif',
    commonSettings: 'Pangaturan umum',
    language: 'Basa',
    callCentre: 'Call Centre',
    nearestHelp: 'Bantuan paling cedhak',
    nearestHospital: 'RS paling cedhak',
    nearestPolice: 'Polisi paling cedhak',
    policeButton: '110 Polisi',
    ambulanceButton: '119 Ambulans',
    openStream: 'Bukak stream',
    openPortal: 'Portal CCTV',
    openGoogleMaps: 'Terusna ing Google Maps',
    openWebsite: 'Website',
    openLocation: 'Bukak lokasi',
    searchWeb: 'Golek web',
    callHospital: 'Hubungi RS',
    callOffice: 'Hubungi kantor',
    callPolice: 'Hubungi 110',
    policeOffice: 'Kantor Polisi',
    hospitalClinic: 'RS / Klinik',
    cctv: 'CCTV',
    unavailable: 'Durung kasedhiya',
    noNearbyCctv: 'Ora ana CCTV cedhak rute.',
    spbuTitle: 'SPBU / Pom Bensin',
    nearestSpbu: 'SPBU paling cedhak',
    routeType: {
      balanced: 'Imbang',
      short: 'Paling cendhak',
      less_maneuvers: 'Sithik belokan'
    },
    placeholders: {
      origin: 'Tuladha: Tugu Yogyakarta',
      destination: 'Tuladha: UGM'
    },
    stepsFallback: 'Pandhuan durung kasedhiya.',
    autocompleteEmpty: 'Ora ana saran lokasi',
    routePopupStart: 'Asal',
    routePopupEnd: 'Tujuan',
    routeGenerated: 'Rute aman wis kasil diitung.',
    cctvTitle: 'CCTV',
    hospitalTitle: 'RS / Klinik',
    policeTitle: 'Kantor Polisi',
    minutesShort: 'menit'
  }
};

const state = {
  datasets: {
    cctv: EMPTY_GEOJSON,
    hospitals: EMPTY_GEOJSON,
    police: EMPTY_GEOJSON,
    spbu: EMPTY_GEOJSON,
  },
  localPlaces: [],
  originPlace: null,
  destinationPlace: null,
  routeResult: null,
  layers: {},
  layerControl: null,
  routeLayers: {
    bestOuter: null,
    bestInner: null,
    alternatives: [],
  },
  markers: {
    origin: null,
    destination: null,
    clicked: null,
  },
  language: APP_CONFIG.ui?.defaultLanguage || 'id'
};

const dom = {
  brandSubtext: document.getElementById('brandSubtext'),
  inputTitle: document.getElementById('inputTitle'),
  originLabel: document.getElementById('originLabel'),
  destinationLabel: document.getElementById('destinationLabel'),
  originInput: document.getElementById('originInput'),
  destinationInput: document.getElementById('destinationInput'),
  originSuggestions: document.getElementById('originSuggestions'),
  destinationSuggestions: document.getElementById('destinationSuggestions'),
  useMyLocationBtn: document.getElementById('useMyLocationBtn'),
  drawRouteBtn: document.getElementById('drawRouteBtn'),
  clearRouteBtn: document.getElementById('clearRouteBtn'),
  routeInfo: document.getElementById('routeInfo'),
  settingsTitle: document.getElementById('settingsTitle'),
  languageLabel: document.getElementById('languageLabel'),
  languageSwitch: document.getElementById('languageSwitch'),
  languageButtons: [...document.querySelectorAll('.lang-btn')],
  legendBest: document.getElementById('legendBest'),
  legendAlt: document.getElementById('legendAlt'),
  callCentreTitle: document.getElementById('callCentreTitle'),
  policeCallLink: document.getElementById('policeCallLink'),
  ambulanceCallLink: document.getElementById('ambulanceCallLink'),
  nearestHelpBox: document.getElementById('nearestHelpBox')
};

const dataFiles = {
  cctv: 'data/cctv.geojson',
  hospitals: 'data/hospitals.geojson',
  police: 'data/police.geojson',
  places: 'data/places.json',
  spbu: 'data/spbu.geojson'
};

init().catch((err) => {
  console.error(err);
  alert(`Gagal inisialisasi aplikasi: ${err.message}`);
});

async function init() {
  await loadAllData();
  buildOperationalLayers();
  buildLayerControl();
  bindUI();
  applyLanguage();
  renderRouteInfo();
  renderCallCentre();

  map.on('click', (e) => {
    const coord = [e.latlng.lng, e.latlng.lat];
    if (state.markers.clicked) map.removeLayer(state.markers.clicked);
    state.markers.clicked = L.marker(e.latlng, { icon: createPinIcon('•', 'clickpin') }).addTo(map);
    renderCallCentre(coord);
  });
}

function t(path) {
  const parts = path.split('.');
  let ref = I18N[state.language] || I18N.id;
  for (const part of parts) ref = ref?.[part];
  return ref ?? path;
}

async function loadJSON(url, fallback) {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

async function loadAllData() {
  const [cctv, hospitals, police, spbu, places] = await Promise.all([
    loadJSON(dataFiles.cctv, EMPTY_GEOJSON),
    loadJSON(dataFiles.hospitals, EMPTY_GEOJSON),
    loadJSON(dataFiles.police, EMPTY_GEOJSON),
    loadJSON(dataFiles.spbu, EMPTY_GEOJSON),
    loadJSON(dataFiles.places, EMPTY_ARRAY)
  ]);

  state.datasets.cctv = normalizeGeojson(cctv);
  state.datasets.hospitals = normalizeGeojson(hospitals);
  state.datasets.police = normalizeGeojson(police);
  state.datasets.spbu = normalizeGeojson(spbu);
  state.localPlaces = Array.isArray(places) ? places : [];
}

function normalizeGeojson(geojson) {
  const normalized = geojson && geojson.type === 'FeatureCollection' ? structuredClone(geojson) : structuredClone(EMPTY_GEOJSON);
  normalized.features = (normalized.features || []).filter((feature) => {
    const coords = feature?.geometry?.coordinates;
    return Array.isArray(coords) && coords.length >= 2 && Number.isFinite(Number(coords[0])) && Number.isFinite(Number(coords[1]));
  });
  return normalized;
}

function buildOperationalLayers() {
  Object.values(state.layers).forEach((layer) => layer && map.removeLayer(layer));

  state.layers.cctv = L.geoJSON(state.datasets.cctv, {
    pointToLayer: (feature, latlng) => L.marker(latlng, { icon: createFacilityIcon('cctv') }),
    onEachFeature: (feature, layer) => layer.bindPopup(buildCctvPopup(buildCctvInfo(feature)))
  }).addTo(map);

  state.layers.hospitals = L.geoJSON(state.datasets.hospitals, {
    pointToLayer: (feature, latlng) => L.marker(latlng, { icon: createFacilityIcon('hospital') }),
    onEachFeature: (feature, layer) => layer.bindPopup(buildHospitalPopup(buildHospitalInfo(feature)))
  }).addTo(map);

  state.layers.police = L.geoJSON(state.datasets.police, {
    pointToLayer: (feature, latlng) => L.marker(latlng, { icon: createFacilityIcon('police') }),
    onEachFeature: (feature, layer) => layer.bindPopup(buildPolicePopup(buildPoliceInfo(feature)))
  }).addTo(map);

  state.layers.spbu = L.geoJSON(state.datasets.spbu, {
    pointToLayer: (feature, latlng) => L.marker(latlng, { icon: createFacilityIcon('spbu') }),
    onEachFeature: (feature, layer) => layer.bindPopup(buildSpbuPopup(buildSpbuInfo(feature)))
  }).addTo(map);
}

function buildLayerControl() {
  if (state.layerControl) {
    map.removeControl(state.layerControl);
    state.layerControl = null;
  }

  const overlays = {
    [layerLabelHtml('cctv', t('cctv'))]: state.layers.cctv,
    [layerLabelHtml('hospital', t('hospitalClinic'))]: state.layers.hospitals,
    [layerLabelHtml('police', t('policeOffice'))]: state.layers.police,
    [layerLabelHtml('spbu', t('spbuTitle'))]: state.layers.spbu,
  };

  state.layerControl = L.control.layers(null, overlays, {
    position: 'topleft',
    collapsed: false
  }).addTo(map);

  const layerContainer = state.layerControl.getContainer?.();
  if (layerContainer) layerContainer.classList.add('custom-layer-left');
}

function layerLabelHtml(type, label) {
  return `<span class="layer-inline"><span class="layer-dot ${type}"></span>${escapeHtml(label)}</span>`;
}

function bindUI() {
  dom.languageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.language = btn.dataset.lang || 'id';
      applyLanguage();
      buildOperationalLayers();
      buildLayerControl();
      renderRouteInfo();
      renderCallCentre(getCurrentReferenceCoord());
    });
  });

  bindAutocomplete(dom.originInput, dom.originSuggestions, (place) => {
    state.originPlace = normalizePlace(place);
    dom.originInput.value = state.originPlace.name;
    setPointMarker('origin', state.originPlace);
    hideAllSuggestions();
    renderCallCentre([state.originPlace.lng, state.originPlace.lat]);
  });

  bindAutocomplete(dom.destinationInput, dom.destinationSuggestions, (place) => {
    state.destinationPlace = normalizePlace(place);
    dom.destinationInput.value = state.destinationPlace.name;
    setPointMarker('destination', state.destinationPlace);
    hideAllSuggestions();
  });

  dom.useMyLocationBtn.addEventListener('click', useMyLocation);
  dom.drawRouteBtn.addEventListener('click', drawSafeRoute);
  dom.clearRouteBtn.addEventListener('click', clearRoute);

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.input-stack')) hideAllSuggestions();
  });
}

function applyLanguage() {
  dom.languageButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === state.language);
  });
  dom.brandSubtext.textContent = t('appTagline');
  dom.inputTitle.textContent = t('routeInput');
  dom.originLabel.textContent = t('origin');
  dom.destinationLabel.textContent = t('destination');
  dom.originInput.placeholder = t('placeholders.origin');
  dom.destinationInput.placeholder = t('placeholders.destination');
  dom.useMyLocationBtn.textContent = t('useMyLocation');
  dom.drawRouteBtn.textContent = t('findSafeRoute');
  dom.clearRouteBtn.textContent = t('reset');
  dom.settingsTitle.textContent = t('commonSettings');
  dom.languageLabel.textContent = t('language');
  dom.legendBest.textContent = t('bestRoute');
  dom.legendAlt.textContent = t('alternativeRoute');
  dom.callCentreTitle.textContent = t('callCentre');
  dom.policeCallLink.textContent = t('policeButton');
  dom.ambulanceCallLink.textContent = t('ambulanceButton');
  dom.policeCallLink.href = `tel:${APP_CONFIG.emergency?.policeCall || '110'}`;
  dom.ambulanceCallLink.href = `tel:${APP_CONFIG.emergency?.ambulanceCall || '119'}`;
}

function bindAutocomplete(inputEl, suggestionsEl, onPick) {
  let debounceId = null;

  inputEl.addEventListener('input', () => {
    const query = inputEl.value.trim();
    clearTimeout(debounceId);
    if (!query) {
      suggestionsEl.innerHTML = '';
      suggestionsEl.classList.add('hidden');
      return;
    }
    debounceId = setTimeout(async () => {
      const suggestions = await getPlaceSuggestions(query);
      renderSuggestions(suggestionsEl, suggestions, onPick);
    }, 250);
  });

  inputEl.addEventListener('focus', async () => {
    const query = inputEl.value.trim();
    if (!query) return;
    const suggestions = await getPlaceSuggestions(query);
    renderSuggestions(suggestionsEl, suggestions, onPick);
  });
}

async function getPlaceSuggestions(query) {
  const apiKey = APP_CONFIG.geocoder.apiKey?.trim();
  if (apiKey) {
    try {
      const center = APP_CONFIG.geocoder.biasCenter;
      const radius = APP_CONFIG.geocoder.filterCircleMeters;
      const params = new URLSearchParams({
        text: query,
        apiKey,
        limit: String(APP_CONFIG.geocoder.limit),
        lang: state.language === 'en' ? 'en' : 'id',
        filter: `circle:${center.lng},${center.lat},${radius}`,
        bias: `proximity:${center.lng},${center.lat}`,
      });
      const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.features) && data.features.length) {
          return data.features.map((feature, idx) => ({
            id: feature.properties.place_id || `geoapify_${idx}`,
            name: feature.properties.formatted || feature.properties.address_line1 || query,
            subtitle: [feature.properties.address_line2, feature.properties.city, feature.properties.state].filter(Boolean).join(' • '),
            lat: Number(feature.properties.lat),
            lng: Number(feature.properties.lon),
            source: 'geoapify'
          }));
        }
      }
    } catch (error) {
      console.warn('Geoapify autocomplete gagal, fallback ke data lokal.', error);
    }
  }

  const q = query.toLowerCase();
  return state.localPlaces
    .filter((place) => [place.name, ...(place.aliases || []), place.subtitle || ''].join(' ').toLowerCase().includes(q))
    .slice(0, 8)
    .map((place) => ({ ...place, source: 'local' }));
}

function renderSuggestions(container, suggestions, onPick) {
  if (!suggestions.length) {
    container.innerHTML = `<div class="suggestion-empty">${escapeHtml(t('autocompleteEmpty'))}</div>`;
    container.classList.remove('hidden');
    return;
  }

  container.innerHTML = suggestions.map((item, idx) => `
    <button class="suggestion-item" data-index="${idx}" type="button">
      <span class="suggestion-title">${escapeHtml(item.name)}</span>
      <span class="suggestion-subtitle">${escapeHtml(item.subtitle || '')}</span>
    </button>
  `).join('');
  container.classList.remove('hidden');

  [...container.querySelectorAll('.suggestion-item')].forEach((btn) => {
    btn.addEventListener('click', () => {
      const picked = suggestions[Number(btn.dataset.index)];
      onPick(picked);
    });
  });
}

function hideAllSuggestions() {
  dom.originSuggestions.classList.add('hidden');
  dom.destinationSuggestions.classList.add('hidden');
}

function normalizePlace(place) {
  return {
    id: place.id,
    name: place.name,
    subtitle: place.subtitle || '',
    lat: Number(place.lat),
    lng: Number(place.lng),
  };
}

function setPointMarker(type, place) {
  const latlng = [place.lat, place.lng];
  if (state.markers[type]) map.removeLayer(state.markers[type]);

  const label = type === 'origin' ? 'A' : 'B';
  state.markers[type] = L.marker(latlng, { icon: createPointMarkerIcon(label, type) })
    .addTo(map)
    .bindPopup(`${type === 'origin' ? t('routePopupStart') : t('routePopupEnd')}: ${escapeHtml(place.name)}`);

  const points = Object.values(state.markers).filter(Boolean).filter((m) => m !== state.markers.clicked).map((m) => m.getLatLng());
  if (points.length === 1) map.setView(points[0], 15);
  else if (points.length >= 2) map.fitBounds(L.latLngBounds(points), { padding: [60, 60] });
}

function useMyLocation() {
  if (!navigator.geolocation) {
    alert('Browser tidak mendukung geolocation.');
    return;
  }
  dom.useMyLocationBtn.disabled = true;
  dom.useMyLocationBtn.textContent = t('findingLocation');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const place = { id: 'my_location', name: state.language === 'en' ? 'My Location' : (state.language === 'jv' ? 'Lokasiku' : 'Lokasi Saya'), lat: pos.coords.latitude, lng: pos.coords.longitude };
      state.originPlace = place;
      dom.originInput.value = place.name;
      setPointMarker('origin', place);
      renderCallCentre([place.lng, place.lat]);
      dom.useMyLocationBtn.disabled = false;
      dom.useMyLocationBtn.textContent = t('useMyLocation');
    },
    (err) => {
      alert(`Gagal mengambil lokasi: ${err.message}`);
      dom.useMyLocationBtn.disabled = false;
      dom.useMyLocationBtn.textContent = t('useMyLocation');
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

async function drawSafeRoute() {
  if (!state.originPlace || !state.destinationPlace) {
    alert(state.language === 'en' ? 'Please fill origin and destination first.' : 'Isi asal dan tujuan dulu.');
    return;
  }

  try {
    dom.drawRouteBtn.disabled = true;
    dom.drawRouteBtn.textContent = t('calculating');

    const candidates = await fetchCandidateRoutes(state.originPlace, state.destinationPlace);
    if (!candidates.length) throw new Error(state.language === 'en' ? 'No route candidate was returned.' : 'Tidak ada kandidat rute yang berhasil dihitung.');

    candidates.forEach((route) => scoreRoute(route));
    candidates.sort((a, b) => b.properties.safety_score - a.properties.safety_score);

    state.routeResult = {
      best: candidates[0],
      alternatives: candidates.slice(1)
    };

    drawRouteLayers(state.routeResult);
    renderRouteInfo();
    renderCallCentre(routeAnchorCoord(state.routeResult.best));
  } catch (err) {
    console.error(err);
    alert(`${state.language === 'en' ? 'Route error' : 'Gagal bikin rute'}: ${err.message}`);
  } finally {
    dom.drawRouteBtn.disabled = false;
    dom.drawRouteBtn.textContent = t('findSafeRoute');
  }
}

async function fetchCandidateRoutes(origin, destination) {
  const apiKey = APP_CONFIG.geocoder.apiKey?.trim();
  if (!apiKey) throw new Error('API key Geoapify belum diisi di js/config.js');

  const paramsBase = {
    waypoints: `${origin.lat},${origin.lng}|${destination.lat},${destination.lng}`,
    mode: APP_CONFIG.routing.mode,
    format: 'geojson',
    lang: APP_CONFIG.routing.lang,
    traffic: APP_CONFIG.routing.traffic,
    apiKey,
  };

  const results = await Promise.all(APP_CONFIG.routing.candidateTypes.map(async (type) => {
    const params = new URLSearchParams({ ...paramsBase, type });
    const res = await fetch(`https://api.geoapify.com/v1/routing?${params.toString()}`);
    if (!res.ok) {
      console.warn(`Route ${type} gagal`, await res.text());
      return null;
    }
    const geojson = await res.json();
    const feature = geojson.features?.[0] || null;
    if (feature) feature.properties.route_type = type;
    return feature;
  }));

  return results.filter(Boolean);
}

function scoreRoute(routeFeature) {
  const cctvNear = countPointsNearRoute(state.datasets.cctv.features, routeFeature, APP_CONFIG.scoring.cctvNearMeters);
  const hospitalNear = countPointsNearRoute(state.datasets.hospitals.features, routeFeature, APP_CONFIG.scoring.hospitalNearMeters);
  const policeNear = countPointsNearRoute(state.datasets.police.features, routeFeature, APP_CONFIG.scoring.policeNearMeters);
  const spbuNear = countPointsNearRoute(state.datasets.spbu.features, routeFeature, APP_CONFIG.scoring.spbuNearMeters);
  const distanceMeters = Number(routeFeature.properties.distance || 0);

  const score = (
    100 +
    (distanceMeters * APP_CONFIG.scoring.weights.distanceMeters) +
    (cctvNear.length * APP_CONFIG.scoring.weights.cctv) +
    (hospitalNear.length * APP_CONFIG.scoring.weights.hospital) +
    (policeNear.length * APP_CONFIG.scoring.weights.police) +
    (spbuNear.length * APP_CONFIG.scoring.weights.spbu)
  );

  routeFeature.properties.safety_score = score;
  routeFeature.properties.cctv_near = cctvNear;
  routeFeature.properties.hospital_near = hospitalNear;
  routeFeature.properties.police_near = policeNear;
  routeFeature.properties.spbu_near = spbuNear;
}

function countPointsNearRoute(pointFeatures, routeFeature, maxMeters) {
  const routeLines = getRouteLineFeatures(routeFeature);
  return pointFeatures
    .map((feature) => {
      const distMeters = Math.min(...routeLines.map((line) => turf.pointToLineDistance(feature, line, { units: 'kilometers' }) * 1000));
      return { feature, distMeters };
    })
    .filter((item) => item.distMeters <= maxMeters)
    .sort((a, b) => a.distMeters - b.distMeters);
}

function getRouteCoordinateLines(routeFeature) {
  if (!routeFeature?.geometry) return [];
  if (routeFeature.geometry.type === 'LineString') return [routeFeature.geometry.coordinates || []];
  if (routeFeature.geometry.type === 'MultiLineString') return routeFeature.geometry.coordinates || [];
  return [];
}

function getRouteLineFeatures(routeFeature) {
  return getRouteCoordinateLines(routeFeature)
    .filter((coords) => Array.isArray(coords) && coords.length >= 2)
    .map((coords) => turf.lineString(coords));
}

function drawRouteLayers(result) {
  clearRouteLayersOnly();

  const altPalette = [
    { color: '#8b5cf6', dashArray: '12 10' },
    { color: '#ff8a00', dashArray: '8 10' },
    { color: '#ec4899', dashArray: '10 10' }
  ];

  result.alternatives.forEach((feature, index) => {
    const layer = L.geoJSON(feature, {
      style: {
        color: altPalette[index % altPalette.length].color,
        weight: 6,
        opacity: 0.95,
        dashArray: altPalette[index % altPalette.length].dashArray,
        lineCap: 'round'
      }
    }).addTo(map);
    state.routeLayers.alternatives.push(layer);
  });

  state.routeLayers.bestOuter = L.geoJSON(result.best, {
    style: {
      color: '#03161b',
      weight: 12,
      opacity: 0.9,
      lineCap: 'round'
    }
  }).addTo(map);

  state.routeLayers.bestInner = L.geoJSON(result.best, {
    style: {
      color: '#00e5a8',
      weight: 7,
      opacity: 1,
      lineCap: 'round'
    }
  }).addTo(map);

  map.fitBounds(state.routeLayers.bestInner.getBounds(), { padding: [70, 70] });
}

function renderRouteInfo() {
  if (!state.routeResult?.best) {
    dom.routeInfo.innerHTML = `
      <div class="route-card-head">
        <h3>${escapeHtml(t('routeInfo'))}</h3>
      </div>
      <p class="empty-route">${escapeHtml(t('noRouteYet'))}</p>
    `;
    return;
  }

  const best = state.routeResult.best;
  const p = best.properties || {};
  const steps = (p.legs?.[0]?.steps || []).slice(0, 5).map((step) => {
    const original = step.instruction?.text || step.instruction || step.name || t('stepsFallback');
    const translated = translateInstruction(original, state.language);
    return `<li>${escapeHtml(translated)}</li>`;
  }).join('');

  const cctvList = (p.cctv_near || []).slice(0, 8).map((item) => {
    const info = buildCctvInfo(item.feature);
    return `
      <li>
        <div class="list-row-top">
          <strong>${escapeHtml(info.name)}</strong>
          <span>${item.distMeters.toFixed(0)} m</span>
        </div>
        <div class="inline-actions compact-actions">
          <a class="mini-btn" href="${escapeAttr(info.streamUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openStream'))}</a>
          <a class="mini-btn secondary" href="${escapeAttr(info.portalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openPortal'))}</a>
        </div>
      </li>
    `;
  }).join('');

  dom.routeInfo.innerHTML = `
    <div class="route-card-head">
      <div>
        <h3>${escapeHtml(t('routeInfo'))}</h3>
        <p>${escapeHtml(t('selectedRoute'))}: <strong>${escapeHtml(getRouteTypeLabel(p.route_type))}</strong></p>
      </div>
      <a class="gmaps-btn" href="${escapeAttr(buildGoogleMapsDirectionsUrl(best))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openGoogleMaps'))}</a>
    </div>

    <div class="metrics-grid">
      <div class="metric-box"><span>${escapeHtml(t('score'))}</span><strong>${Number(p.safety_score || 0).toFixed(1)}</strong></div>
      <div class="metric-box"><span>${escapeHtml(t('distance'))}</span><strong>${((Number(p.distance || 0)) / 1000).toFixed(2)} km</strong></div>
      <div class="metric-box"><span>${escapeHtml(t('estimate'))}</span><strong>${Math.round((Number(p.time || 0)) / 60)} ${escapeHtml(t('minutesShort'))}</strong></div>
      <div class="metric-box"><span>${escapeHtml(t('cctvNear'))}</span><strong>${(p.cctv_near || []).length}</strong></div>
      <div class="metric-box"><span>${escapeHtml(t('hospitalNear'))}</span><strong>${(p.hospital_near || []).length}</strong></div>
      <div class="metric-box"><span>${escapeHtml(t('policeNear'))}</span><strong>${(p.police_near || []).length}</strong></div>
      <div class="metric-box"><span>${escapeHtml(t('spbuNear'))}</span><strong>${(p.spbu_near || []).length}</strong></div>
    </div>

    <div class="content-box">
      <strong>${escapeHtml(t('directions'))}</strong>
      <ol>${steps || `<li>${escapeHtml(t('stepsFallback'))}</li>`}</ol>
    </div>

    <div class="content-box">
      <strong>${escapeHtml(t('cctvAlong'))}</strong>
      <ul class="list-unstyled">${cctvList || `<li>${escapeHtml(t('noNearbyCctv'))}</li>`}</ul>
    </div>
  `;
}

function buildGoogleMapsDirectionsUrl(routeFeature) {
  const allCoords = flattenRouteCoordinates(routeFeature);
  const origin = state.originPlace ? `${state.originPlace.lat},${state.originPlace.lng}` : `${allCoords[0][1]},${allCoords[0][0]}`;
  const destination = state.destinationPlace
    ? `${state.destinationPlace.lat},${state.destinationPlace.lng}`
    : `${allCoords[allCoords.length - 1][1]},${allCoords[allCoords.length - 1][0]}`;

  const params = new URLSearchParams({
    api: '1',
    origin,
    destination,
    travelmode: APP_CONFIG.routing.googleMapsTravelMode || 'driving'
  });

  const waypoints = sampleWaypointsForGoogleMaps(allCoords, APP_CONFIG.routing.googleMapsWaypointCount || 6);
  if (waypoints.length) params.set('waypoints', waypoints.join('|'));

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function flattenRouteCoordinates(routeFeature) {
  const lines = getRouteCoordinateLines(routeFeature);
  return lines.flat();
}

function sampleWaypointsForGoogleMaps(coords, maxWaypoints) {
  if (!Array.isArray(coords) || coords.length < 4) return [];
  const trimmed = coords.slice(1, -1);
  if (!trimmed.length) return [];
  const step = Math.max(1, Math.floor(trimmed.length / maxWaypoints));
  const sampled = [];
  for (let i = step - 1; i < trimmed.length && sampled.length < maxWaypoints; i += step) {
    sampled.push(`${trimmed[i][1]},${trimmed[i][0]}`);
  }
  return sampled;
}

function renderCallCentre(referenceCoord = getCurrentReferenceCoord()) {
  const policeCall = APP_CONFIG.emergency?.policeCall || '110';
  const ambulanceCall = APP_CONFIG.emergency?.ambulanceCall || '119';
  dom.policeCallLink.href = `tel:${policeCall}`;
  dom.ambulanceCallLink.href = `tel:${ambulanceCall}`;
  dom.policeCallLink.textContent = t('policeButton');
  dom.ambulanceCallLink.textContent = t('ambulanceButton');

  if (!referenceCoord) {
    dom.nearestHelpBox.innerHTML = `
      <div class="nearest-title">${escapeHtml(t('nearestHelp'))}</div>
      <div class="nearest-line">${escapeHtml(t('nearestHospital'))}: <span>${escapeHtml(t('unavailable'))}</span></div>
      <div class="nearest-line">${escapeHtml(t('nearestPolice'))}: <span>${escapeHtml(t('unavailable'))}</span></div>
    `;
    return;
  }

  const nearestHospital = findNearestFeature(referenceCoord, state.datasets.hospitals.features);
  const nearestPolice = findNearestFeature(referenceCoord, state.datasets.police.features);
  const nearestSpbu = findNearestFeature(referenceCoord, state.datasets.spbu.features);

  const hospitalInfo = nearestHospital ? buildHospitalInfo(nearestHospital.feature) : null;
  const policeInfo = nearestPolice ? buildPoliceInfo(nearestPolice.feature) : null;
  const spbuInfo = nearestSpbu ? buildSpbuInfo(nearestSpbu.feature) : null;

  dom.nearestHelpBox.innerHTML = `
    <div class="nearest-title">${escapeHtml(t('nearestHelp'))}</div>
    <div class="nearest-block">
      <div class="nearest-label">${escapeHtml(t('nearestHospital'))}</div>
      <strong>${escapeHtml(hospitalInfo?.name || t('unavailable'))}</strong>
      ${nearestHospital ? `<span>${nearestHospital.distance.toFixed(2)} km</span>` : ''}
      ${hospitalInfo ? `<div class="inline-actions compact-actions"><a class="mini-btn secondary" href="${escapeAttr(buildMapsUrl(hospitalInfo.name, hospitalInfo.lat, hospitalInfo.lng))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openLocation'))}</a></div>` : ''}
    </div>
    <div class="nearest-block">
      <div class="nearest-label">${escapeHtml(t('nearestPolice'))}</div>
      <strong>${escapeHtml(policeInfo?.name || t('unavailable'))}</strong>
      ${nearestPolice ? `<span>${nearestPolice.distance.toFixed(2)} km</span>` : ''}
      ${policeInfo ? `<div class="inline-actions compact-actions"><a class="mini-btn secondary" href="${escapeAttr(buildMapsUrl(policeInfo.name, policeInfo.lat, policeInfo.lng))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openLocation'))}</a></div>` : ''}
    </div>
    <div class="nearest-block">
      <div class="nearest-label">${escapeHtml(t('nearestSpbu'))}</div>
      <strong>${escapeHtml(spbuInfo?.name || t('unavailable'))}</strong>
      ${nearestSpbu ? `<span>${nearestSpbu.distance.toFixed(2)} km</span>` : ''}
      ${spbuInfo ? `<div class="inline-actions compact-actions"><a class="mini-btn secondary" href="${escapeAttr(buildMapsUrl(spbuInfo.name, spbuInfo.lat, spbuInfo.lng))}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openLocation'))}</a></div>` : ''}
    </div>
  `;
}

function findNearestFeature(originCoord, features) {
  if (!features?.length) return null;
  return features
    .map((feature) => ({
      feature,
      distance: turf.distance(turf.point(originCoord), turf.point(feature.geometry.coordinates), { units: 'kilometers' })
    }))
    .sort((a, b) => a.distance - b.distance)[0];
}

function getCurrentReferenceCoord() {
  if (state.routeResult?.best) return routeAnchorCoord(state.routeResult.best);
  if (state.originPlace) return [state.originPlace.lng, state.originPlace.lat];
  if (state.markers.clicked) {
    const ll = state.markers.clicked.getLatLng();
    return [ll.lng, ll.lat];
  }
  return null;
}

function routeAnchorCoord(routeFeature) {
  const allCoords = flattenRouteCoordinates(routeFeature);
  return allCoords[Math.floor(allCoords.length / 2)] || null;
}

function clearRoute() {
  clearRouteLayersOnly();
  ['origin', 'destination', 'clicked'].forEach((key) => {
    if (state.markers[key]) map.removeLayer(state.markers[key]);
    state.markers[key] = null;
  });
  state.routeResult = null;
  state.originPlace = null;
  state.destinationPlace = null;
  dom.originInput.value = '';
  dom.destinationInput.value = '';
  hideAllSuggestions();
  renderRouteInfo();
  renderCallCentre();
}

function clearRouteLayersOnly() {
  if (state.routeLayers.bestOuter) map.removeLayer(state.routeLayers.bestOuter);
  if (state.routeLayers.bestInner) map.removeLayer(state.routeLayers.bestInner);
  state.routeLayers.alternatives.forEach((layer) => map.removeLayer(layer));
  state.routeLayers.bestOuter = null;
  state.routeLayers.bestInner = null;
  state.routeLayers.alternatives = [];
}

function buildCctvInfo(feature) {
  const p = getProps(feature);
  return {
    name: getAny(p, ['name', 'cctv_title']) || 'CCTV',
    descr: getAny(p, ['descr', 'cctv_descr']) || '',
    streamUrl: getAny(p, ['video_url', 'stream_url', 'cctv_link']) || 'https://cctv.jogjakota.go.id/home',
    portalUrl: 'https://cctv.jogjakota.go.id/home'
  };
}

function buildHospitalInfo(feature) {
  const p = getProps(feature);
  const name = getAny(p, ['name']) || t('hospitalClinic');
  const coords = feature.geometry.coordinates;
  return {
    name,
    address: getAddress(p),
    phoneText: getPhone(p)?.display || '',
    phoneHref: getPhone(p)?.href || '',
    website: getAny(p, ['website', 'contact:website', 'url']),
    lat: coords[1],
    lng: coords[0]
  };
}

function buildPoliceInfo(feature) {
  const p = getProps(feature);
  const name = getAny(p, ['name']) || t('policeOffice');
  const coords = feature.geometry.coordinates;
  return {
    name,
    address: getAddress(p),
    phoneText: getPhone(p)?.display || APP_CONFIG.emergency?.policeCall || '110',
    phoneHref: getPhone(p)?.href || `tel:${APP_CONFIG.emergency?.policeCall || '110'}`,
    website: getAny(p, ['website', 'contact:website', 'url']),
    lat: coords[1],
    lng: coords[0]
  };
}

function buildCctvPopup(info) {
  return `
    <div class="popup-card">
      <strong>${escapeHtml(t('cctvTitle'))}</strong><br>
      ${escapeHtml(info.name)}
      ${info.descr ? `<span class="popup-sub">${escapeHtml(info.descr)}</span>` : ''}
      <div class="inline-actions compact-actions">
        <a class="mini-btn" href="${escapeAttr(info.streamUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openStream'))}</a>
        <a class="mini-btn secondary" href="${escapeAttr(info.portalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openPortal'))}</a>
      </div>
    </div>
  `;
}

function buildHospitalPopup(info) {
  const mapsUrl = buildMapsUrl(info.name, info.lat, info.lng);
  const searchUrl = buildSearchUrl(`${info.name} ${info.address}`);
  return `
    <div class="popup-card">
      <strong>${escapeHtml(t('hospitalTitle'))}</strong><br>
      ${escapeHtml(info.name)}
      ${info.address ? `<span class="popup-sub">${escapeHtml(info.address)}</span>` : ''}
      ${info.phoneText ? `<span class="popup-sub">${escapeHtml(info.phoneText)}</span>` : ''}
      <div class="inline-actions compact-actions">
        ${info.phoneHref ? `<a class="mini-btn" href="${escapeAttr(info.phoneHref)}">${escapeHtml(t('callHospital'))}</a>` : ''}
        ${info.website ? `<a class="mini-btn secondary" href="${escapeAttr(info.website)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openWebsite'))}</a>` : `<a class="mini-btn secondary" href="${escapeAttr(searchUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('searchWeb'))}</a>`}
        <a class="mini-btn secondary" href="${escapeAttr(mapsUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openLocation'))}</a>
      </div>
    </div>
  `;
}

function buildPolicePopup(info) {
  const mapsUrl = buildMapsUrl(info.name, info.lat, info.lng);
  const searchUrl = buildSearchUrl(`${info.name} Yogyakarta`);
  return `
    <div class="popup-card">
      <strong>${escapeHtml(t('policeTitle'))}</strong><br>
      ${escapeHtml(info.name)}
      ${info.address ? `<span class="popup-sub">${escapeHtml(info.address)}</span>` : ''}
      ${info.phoneText ? `<span class="popup-sub">${escapeHtml(info.phoneText)}</span>` : ''}
      <div class="inline-actions compact-actions">
        <a class="mini-btn" href="tel:${escapeAttr(APP_CONFIG.emergency?.policeCall || '110')}">${escapeHtml(t('callPolice'))}</a>
        <a class="mini-btn secondary" href="${escapeAttr(info.phoneHref)}">${escapeHtml(t('callOffice'))}</a>
        ${info.website ? `<a class="mini-btn secondary" href="${escapeAttr(info.website)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openWebsite'))}</a>` : `<a class="mini-btn secondary" href="${escapeAttr(searchUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('searchWeb'))}</a>`}
        <a class="mini-btn secondary" href="${escapeAttr(mapsUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openLocation'))}</a>
      </div>
    </div>
  `;
}


function buildSpbuInfo(feature) {
  const p = getProps(feature);
  const name = getAny(p, ['name', 'brand']) || t('spbuTitle');
  const coords = feature.geometry.coordinates;
  return {
    name,
    address: getAddress(p),
    brand: getAny(p, ['brand']) || 'Pertamina',
    lat: coords[1],
    lng: coords[0]
  };
}

function buildSpbuPopup(info) {
  const mapsUrl = buildMapsUrl(info.name, info.lat, info.lng);
  return `
    <div class="popup-card">
      <strong>${escapeHtml(t('spbuTitle'))}</strong><br>
      ${escapeHtml(info.name)}
      ${info.address ? `<span class="popup-sub">${escapeHtml(info.address)}</span>` : ''}
      <span class="popup-sub">${escapeHtml(info.brand)}</span>
      <div class="inline-actions compact-actions">
        <a class="mini-btn secondary" href="${escapeAttr(mapsUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('openLocation'))}</a>
      </div>
    </div>
  `;
}

function createFacilityIcon(type) {
  const svgs = {
    cctv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.889L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>`,
    hospital: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8v8M8 12h8"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>`,
    police: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l-8 3v5c0 5.25 3.4 10.1 8 12 4.6-1.9 8-6.75 8-12V5l-8-3z"/><path d="M9 12l2 2 4-4"/></svg>`,
    spbu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 22V8a2 2 0 012-2h6a2 2 0 012 2v14"/><path d="M3 22h10M13 8l4-4 2 2-1 1v10a1 1 0 01-1 1h-1"/><path d="M6 11h4"/></svg>`
  };

  return L.divIcon({
    className: '',
    html: `<div class="map-icon ${type}">${svgs[type] || ''}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -14]
  });
}

function createPointMarkerIcon(label, type) {
  return L.divIcon({
    className: '',
    html: `<div class="point-marker ${type}">${escapeHtml(label)}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
}

function createPinIcon(label, type) {
  return L.divIcon({
    className: '',
    html: `<div class="point-marker ${type}">${escapeHtml(label)}</div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10]
  });
}

function getProps(feature) {
  return { ...(feature.properties || {}), ...(feature.properties?.tags || {}) };
}

function getAny(props, keys) {
  for (const key of keys) {
    const value = props?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') return String(value).trim();
  }
  return '';
}

function getAddress(props) {
  const full = getAny(props, ['address', 'addr:full']);
  if (full) return full;
  const parts = [
    getAny(props, ['addr:street']),
    getAny(props, ['addr:housenumber']),
    getAny(props, ['addr:suburb']),
    getAny(props, ['addr:city'])
  ].filter(Boolean);
  return parts.join(', ');
}

function getPhone(props) {
  const raw = getAny(props, ['phone', 'contact:phone', 'contact:mobile', 'emergency']);
  if (!raw) return null;
  const tel = raw.replace(/[^\d+]/g, '');
  return { display: raw, href: `tel:${tel}` };
}

function getRouteTypeLabel(type) {
  return t(`routeType.${type || 'balanced'}`);
}

function translateInstruction(text, language = 'id') {
  if (language === 'en') return String(text || '');
  let out = String(text || '');
  const replacements = [
    [/^Drive southwest/i, language === 'jv' ? 'Mlaku menyang kidul-kulon' : 'Jalan ke arah barat daya'],
    [/^Drive southeast/i, language === 'jv' ? 'Mlaku menyang kidul-wetan' : 'Jalan ke arah tenggara'],
    [/^Drive northwest/i, language === 'jv' ? 'Mlaku menyang lor-kulon' : 'Jalan ke arah barat laut'],
    [/^Drive northeast/i, language === 'jv' ? 'Mlaku menyang lor-wetan' : 'Jalan ke arah timur laut'],
    [/^Drive north/i, language === 'jv' ? 'Mlaku menyang lor' : 'Jalan ke arah utara'],
    [/^Drive south/i, language === 'jv' ? 'Mlaku menyang kidul' : 'Jalan ke arah selatan'],
    [/^Drive west/i, language === 'jv' ? 'Mlaku menyang kulon' : 'Jalan ke arah barat'],
    [/^Drive east/i, language === 'jv' ? 'Mlaku menyang wetan' : 'Jalan ke arah timur'],
    [/^Head southwest/i, language === 'jv' ? 'Miwiti menyang kidul-kulon' : 'Mulai ke arah barat daya'],
    [/^Head southeast/i, language === 'jv' ? 'Miwiti menyang kidul-wetan' : 'Mulai ke arah tenggara'],
    [/^Head northwest/i, language === 'jv' ? 'Miwiti menyang lor-kulon' : 'Mulai ke arah barat laut'],
    [/^Head northeast/i, language === 'jv' ? 'Miwiti menyang lor-wetan' : 'Mulai ke arah timur laut'],
    [/^Head north/i, language === 'jv' ? 'Miwiti menyang lor' : 'Mulai ke arah utara'],
    [/^Head south/i, language === 'jv' ? 'Miwiti menyang kidul' : 'Mulai ke arah selatan'],
    [/^Head west/i, language === 'jv' ? 'Miwiti menyang kulon' : 'Mulai ke arah barat'],
    [/^Head east/i, language === 'jv' ? 'Miwiti menyang wetan' : 'Mulai ke arah timur'],
    [/^Turn left onto /i, language === 'jv' ? 'Belok kiwa menyang ' : 'Belok kiri ke '],
    [/^Turn right onto /i, language === 'jv' ? 'Belok tengen menyang ' : 'Belok kanan ke '],
    [/^Bear left onto /i, language === 'jv' ? 'Belok rada kiwa menyang ' : 'Belok agak kiri ke '],
    [/^Bear right onto /i, language === 'jv' ? 'Belok rada tengen menyang ' : 'Belok agak kanan ke '],
    [/^Slight left onto /i, language === 'jv' ? 'Belok sethithik kiwa menyang ' : 'Belok sedikit kiri ke '],
    [/^Slight right onto /i, language === 'jv' ? 'Belok sethithik tengen menyang ' : 'Belok sedikit kanan ke '],
    [/^Make a U-turn to stay on /i, language === 'jv' ? 'Putar balik supaya tetep ing ' : 'Putar balik untuk tetap di '],
    [/^Continue straight onto /i, language === 'jv' ? 'Terus lurus menyang ' : 'Lanjut lurus ke '],
    [/^Continue on /i, language === 'jv' ? 'Terus ing ' : 'Lanjut di '],
    [/^Keep left to stay on /i, language === 'jv' ? 'Tetep kiwa supaya tetep ing ' : 'Ambil kiri untuk tetap di '],
    [/^Keep right to stay on /i, language === 'jv' ? 'Tetep tengen supaya tetep ing ' : 'Ambil kanan untuk tetap di '],
    [/^At the roundabout, take the /i, language === 'jv' ? 'Ing bundaran, pilih ' : 'Di bundaran, ambil '],
    [/^At the roundabout, take /i, language === 'jv' ? 'Ing bundaran, pilih ' : 'Di bundaran, ambil '],
    [/^Exit the roundabout onto /i, language === 'jv' ? 'Metu bundaran menyang ' : 'Keluar bundaran ke '],
    [/^You have arrived at your destination/i, language === 'jv' ? 'Sampeyan wis tekan tujuan' : 'Anda telah tiba di tujuan'],
    [/destination is on the left/i, language === 'jv' ? 'tujuan ana ing kiwa' : 'tujuan ada di kiri'],
    [/destination is on the right/i, language === 'jv' ? 'tujuan ana ing tengen' : 'tujuan ada di kanan'],
    [/ toward /gi, language === 'jv' ? ' menyang ' : ' menuju ']
  ];
  replacements.forEach(([pattern, replacement]) => {
    out = out.replace(pattern, replacement);
  });
  return out;
}

function buildMapsUrl(name, lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng} ${name}`)}`;
}

function buildSearchUrl(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function escapeAttr(value) {
  return escapeHtml(value);
}
