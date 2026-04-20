const map = L.map('map').setView(APP_CONFIG.map.center, APP_CONFIG.map.zoom);
L.tileLayer(APP_CONFIG.map.tileUrl, { attribution: APP_CONFIG.map.attribution }).addTo(map);

const EMPTY_GEOJSON = { type: 'FeatureCollection', features: [] };

const state = {
  datasets: {},
  localPlaces: [],
  originPlace: null,
  destinationPlace: null,
  routeResult: null,
  clickedPointMarker: null,
  layers: {},
  routeLayers: {
    best: null,
    alternatives: null,
  },
  markers: {
    origin: null,
    destination: null,
  },
};

const dom = {
  originInput: document.getElementById('originInput'),
  destinationInput: document.getElementById('destinationInput'),
  originSuggestions: document.getElementById('originSuggestions'),
  destinationSuggestions: document.getElementById('destinationSuggestions'),
  useMyLocationBtn: document.getElementById('useMyLocationBtn'),
  drawRouteBtn: document.getElementById('drawRouteBtn'),
  clearRouteBtn: document.getElementById('clearRouteBtn'),
  routeInfo: document.getElementById('routeInfo'),
  emergencyList: document.getElementById('emergencyList'),
};

const dataFiles = {
  cctv: 'data/cctv.geojson',
  hospitals: 'data/hospitals.geojson',
  police: 'data/police.geojson',
  places: 'data/places.json',
};

init().catch((err) => {
  console.error(err);
  alert(`Gagal inisialisasi aplikasi: ${err.message}`);
});

async function init() {
  await loadAllData();
  buildLayers();
  bindUI();

  map.on('click', (e) => {
    const coord = [e.latlng.lng, e.latlng.lat];
    if (state.clickedPointMarker) map.removeLayer(state.clickedPointMarker);
    state.clickedPointMarker = L.marker(e.latlng).addTo(map).bindPopup('Titik bantuan').openPopup();
    renderEmergencyStops(coord);
  });
}

async function loadJSON(url, fallback = null) {
  const res = await fetch(url);
  if (!res.ok) {
    if (fallback !== null) return fallback;
    throw new Error(`Gagal load ${url} (${res.status})`);
  }
  return await res.json();
}

async function loadAllData() {
  const entries = await Promise.all(
    Object.entries(dataFiles).map(async ([key, url]) => {
      if (key === 'places') return [key, await loadJSON(url, [])];
      return [key, await loadJSON(url, EMPTY_GEOJSON)];
    })
  );

  for (const [key, value] of entries) {
    if (key === 'places') state.localPlaces = Array.isArray(value) ? value : [];
    else state.datasets[key] = normalizeGeojson(value);
  }
}

function normalizeGeojson(geojson) {
  const normalized = geojson && geojson.type === 'FeatureCollection' ? geojson : EMPTY_GEOJSON;
  normalized.features = (normalized.features || []).filter((feature) => {
    const coords = feature?.geometry?.coordinates;
    return Array.isArray(coords) && coords.length >= 2 && Number.isFinite(Number(coords[0])) && Number.isFinite(Number(coords[1]));
  });
  return normalized;
}

function buildLayers() {
  state.layers.cctv = L.geoJSON(state.datasets.cctv, {
    pointToLayer: (feature, latlng) => L.marker(latlng, { icon: createEmojiIcon('📷', 'cctv') }),
    onEachFeature: (feature, layer) => {
      const info = buildCctvInfo(feature);
      layer.bindPopup(buildCctvPopup(info));
    }
  }).addTo(map);

  state.layers.hospitals = L.geoJSON(state.datasets.hospitals, {
    pointToLayer: (feature, latlng) => L.marker(latlng, { icon: createEmojiIcon('🏥', 'hospital') }),
    onEachFeature: (feature, layer) => {
      const info = buildHospitalInfo(feature);
      layer.bindPopup(buildHospitalPopup(info));
    }
  }).addTo(map);

  state.layers.police = L.geoJSON(state.datasets.police, {
    pointToLayer: (feature, latlng) => L.marker(latlng, { icon: createEmojiIcon('👮', 'police') }),
    onEachFeature: (feature, layer) => {
      const info = buildPoliceInfo(feature);
      layer.bindPopup(buildPolicePopup(info));
    }
  }).addTo(map);
}

function bindUI() {
  document.querySelectorAll('[data-layer-toggle]').forEach((el) => {
    el.addEventListener('change', (e) => {
      const key = e.target.dataset.layerToggle;
      const layer = state.layers[key];
      if (!layer) return;
      if (e.target.checked) map.addLayer(layer);
      else map.removeLayer(layer);
    });
  });

  bindAutocomplete(dom.originInput, dom.originSuggestions, (place) => {
    state.originPlace = normalizePlace(place);
    dom.originInput.value = state.originPlace.name;
    setPointMarker('origin', state.originPlace);
    hideAllSuggestions();
    renderEmergencyStops([state.originPlace.lng, state.originPlace.lat]);
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
        lang: 'id',
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
    .slice(0, 6)
    .map((place) => ({ ...place, source: 'local' }));
}

function renderSuggestions(container, suggestions, onPick) {
  if (!suggestions.length) {
    container.innerHTML = '<div class="suggestion-empty">Tidak ada saran lokasi</div>';
    container.classList.remove('hidden');
    return;
  }
  container.innerHTML = suggestions.map((item, idx) => `
    <button class="suggestion-item" data-index="${idx}" type="button">
      <span class="suggestion-title">${escapeHtml(item.name)}</span>
      <span class="suggestion-subtitle">${escapeHtml(item.subtitle || (item.source === 'geoapify' ? 'Hasil geocoding' : 'Data lokal'))}</span>
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
  dom.originSuggestions?.classList.add('hidden');
  dom.destinationSuggestions?.classList.add('hidden');
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
  const label = type === 'origin' ? 'Asal' : 'Tujuan';

  if (state.markers[type]) map.removeLayer(state.markers[type]);
  state.markers[type] = L.marker(latlng).addTo(map).bindPopup(`${label}: ${escapeHtml(place.name)}`);

  const points = Object.values(state.markers).filter(Boolean).map((m) => m.getLatLng());
  if (points.length === 1) map.setView(points[0], 15);
  else if (points.length === 2) map.fitBounds(L.latLngBounds(points), { padding: [50, 50] });
}

function useMyLocation() {
  if (!navigator.geolocation) {
    alert('Browser tidak mendukung geolocation.');
    return;
  }
  dom.useMyLocationBtn.disabled = true;
  dom.useMyLocationBtn.textContent = 'Mengambil lokasi...';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const place = { id: 'my_location', name: 'Lokasi Saya', lat: pos.coords.latitude, lng: pos.coords.longitude };
      state.originPlace = place;
      dom.originInput.value = place.name;
      setPointMarker('origin', place);
      renderEmergencyStops([place.lng, place.lat]);
      dom.useMyLocationBtn.disabled = false;
      dom.useMyLocationBtn.textContent = 'Pakai lokasi saya';
    },
    (err) => {
      alert(`Gagal mengambil lokasi: ${err.message}`);
      dom.useMyLocationBtn.disabled = false;
      dom.useMyLocationBtn.textContent = 'Pakai lokasi saya';
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

async function drawSafeRoute() {
  if (!state.originPlace || !state.destinationPlace) {
    alert('Isi asal dan tujuan dulu.');
    return;
  }
  try {
    dom.drawRouteBtn.disabled = true;
    dom.drawRouteBtn.textContent = 'Menghitung...';

    const candidates = await fetchCandidateRoutes(state.originPlace, state.destinationPlace);
    if (!candidates.length) throw new Error('Tidak ada kandidat rute yang berhasil dihitung.');

    candidates.forEach((route) => scoreRoute(route));
    candidates.sort((a, b) => b.properties.safety_score - a.properties.safety_score);

    state.routeResult = {
      best: candidates[0],
      alternatives: candidates.slice(1),
    };

    drawRouteLayers(state.routeResult);
    renderRouteInfo(state.routeResult.best, state.routeResult.alternatives);
    renderEmergencyStops(routeAnchorCoord(state.routeResult.best));
  } catch (err) {
    console.error(err);
    alert(`Gagal bikin rute: ${err.message}`);
  } finally {
    dom.drawRouteBtn.disabled = false;
    dom.drawRouteBtn.textContent = 'Cari rute aman';
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
  const distanceMeters = Number(routeFeature.properties.distance || 0);

  const score = (
    100 +
    (distanceMeters * APP_CONFIG.scoring.weights.distanceMeters) +
    (cctvNear.length * APP_CONFIG.scoring.weights.cctv) +
    (hospitalNear.length * APP_CONFIG.scoring.weights.hospital) +
    (policeNear.length * APP_CONFIG.scoring.weights.police)
  );

  routeFeature.properties.safety_score = score;
  routeFeature.properties.cctv_near = cctvNear;
  routeFeature.properties.hospital_near = hospitalNear;
  routeFeature.properties.police_near = policeNear;
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
  if (state.routeLayers.best) map.removeLayer(state.routeLayers.best);
  if (state.routeLayers.alternatives) map.removeLayer(state.routeLayers.alternatives);

  state.routeLayers.alternatives = L.geoJSON(result.alternatives, {
    style: { color: '#94a3b8', weight: 4, opacity: 0.65 }
  }).addTo(map);

  state.routeLayers.best = L.geoJSON(result.best, {
    style: { color: '#34d399', weight: 6, opacity: 0.95 }
  }).addTo(map);

  map.fitBounds(state.routeLayers.best.getBounds(), { padding: [40, 40] });
}

function renderRouteInfo(best) {
  const p = best.properties || {};
  const firstSteps = (p.legs?.[0]?.steps || []).slice(0, 5).map((step) => {
    const text = step.instruction?.text || step.instruction || step.name || 'Lanjut';
    return `<li>${escapeHtml(text)}</li>`;
  }).join('');

  const cctvList = (p.cctv_near || []).slice(0, 8).map((item) => {
    const info = buildCctvInfo(item.feature);
    return `
      <li>
        <div class="cctv-item-head">
          <strong>${escapeHtml(info.name)}</strong>
          <span class="cctv-item-distance">${item.distMeters.toFixed(0)} m</span>
        </div>
        <div class="inline-actions">
          <a class="mini-btn" href="${escapeAttr(info.streamUrl)}" target="_blank" rel="noopener noreferrer">Buka stream</a>
          <a class="mini-btn secondary-action" href="${escapeAttr(info.portalUrl)}" target="_blank" rel="noopener noreferrer">Portal CCTV</a>
        </div>
      </li>
    `;
  }).join('');

  dom.routeInfo.innerHTML = `
    <h3>Info Rute</h3>
    <p><strong>Rute terpilih:</strong> ${escapeHtml(capitalize(p.route_type || 'balanced'))}</p>
    <div class="route-metrics compact">
      <div><span>Safety score</span><strong>${Number(p.safety_score || 0).toFixed(1)}</strong></div>
      <div><span>Jarak</span><strong>${((Number(p.distance || 0)) / 1000).toFixed(2)} km</strong></div>
      <div><span>Estimasi</span><strong>${Math.round((Number(p.time || 0)) / 60)} menit</strong></div>
      <div><span>CCTV dekat</span><strong>${(p.cctv_near || []).length}</strong></div>
      <div><span>RS / Klinik</span><strong>${(p.hospital_near || []).length}</strong></div>
      <div><span>Polisi</span><strong>${(p.police_near || []).length}</strong></div>
    </div>
    <p class="route-note">Alternatif dihitung dari mode ${escapeHtml(APP_CONFIG.routing.mode)} dengan kandidat ${escapeHtml(APP_CONFIG.routing.candidateTypes.join(', '))}.</p>
    <div class="steps-box">
      <strong>Petunjuk awal</strong>
      <ol>${firstSteps || '<li>Petunjuk belum tersedia.</li>'}</ol>
    </div>
    <div class="steps-box">
      <strong>CCTV dekat rute</strong>
      <ul class="cctv-pass-list">${cctvList || '<li>Tidak ada CCTV dekat rute.</li>'}</ul>
    </div>
  `;
}

function renderEmergencyStops(originCoord) {
  const helpFeatures = [
    ...state.datasets.hospitals.features.map((f) => ({ ...f, properties: { ...f.properties, help_type: 'RS / Klinik' } })),
    ...state.datasets.police.features.map((f) => ({ ...f, properties: { ...f.properties, help_type: 'Kantor Polisi' } })),
  ];

  const nearest = helpFeatures
    .map((f) => ({
      feature: f,
      distance: turf.distance(turf.point(originCoord), turf.point(f.geometry.coordinates), { units: 'kilometers' })
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 4);

  dom.emergencyList.innerHTML = nearest.map((item) => {
    const info = item.feature.properties.help_type === 'Kantor Polisi'
      ? buildPoliceInfo(item.feature)
      : buildHospitalInfo(item.feature);
    return `
      <div class="emergency-item">
        <strong>${escapeHtml(info.name)}</strong>
        <small>${escapeHtml(info.typeLabel)} • ${item.distance.toFixed(2)} km</small>
        ${info.address ? `<small>${escapeHtml(info.address)}</small>` : ''}
        ${info.phoneText ? `<small>Telp: ${escapeHtml(info.phoneText)}</small>` : ''}
        <div class="inline-actions compact-actions">
          ${info.primaryActionHtml}
          ${info.secondaryActionHtml}
          ${info.tertiaryActionHtml || ''}
        </div>
      </div>
    `;
  }).join('') || '<div class="emergency-item"><strong>Tidak ada data bantuan.</strong></div>';
}

function routeAnchorCoord(routeFeature) {
  const lines = getRouteCoordinateLines(routeFeature);
  const mainLine = lines[0] || [];
  const anchor = mainLine[Math.floor(mainLine.length / 2)] || mainLine[0] || [APP_CONFIG.map.center[1], APP_CONFIG.map.center[0]];
  return anchor;
}

function clearRoute() {
  if (state.routeLayers.best) map.removeLayer(state.routeLayers.best);
  if (state.routeLayers.alternatives) map.removeLayer(state.routeLayers.alternatives);
  if (state.markers.origin) map.removeLayer(state.markers.origin);
  if (state.markers.destination) map.removeLayer(state.markers.destination);
  state.routeLayers.best = null;
  state.routeLayers.alternatives = null;
  state.markers.origin = null;
  state.markers.destination = null;
  state.originPlace = null;
  state.destinationPlace = null;
  dom.originInput.value = '';
  dom.destinationInput.value = '';
  dom.routeInfo.innerHTML = '<h3>Info Rute</h3><p>Pilih asal dan tujuan, lalu klik <b>Cari rute aman</b>.</p>';
  dom.emergencyList.innerHTML = '';
}

function buildCctvInfo(feature) {
  const p = feature.properties || {};
  return {
    name: getAny(p, ['name', 'cctv_title']) || 'CCTV',
    descr: getAny(p, ['descr', 'cctv_descr']) || '',
    streamUrl: getAny(p, ['video_url', 'stream_url', 'cctv_link']) || 'https://cctv.jogjakota.go.id/home',
    portalUrl: 'https://cctv.jogjakota.go.id/home',
  };
}

function buildHospitalInfo(feature) {
  const p = feature.properties || {};
  const name = getAny(p, ['name']) || 'RS / Klinik';
  const address = getAddress(p);
  const phone = getPhone(p);
  const website = getAny(p, ['website', 'contact:website', 'url']);
  const coords = feature.geometry.coordinates;
  const mapsUrl = buildMapsUrl(name, coords[1], coords[0]);
  const searchUrl = buildSearchUrl(`${name} ${address}`);

  return {
    typeLabel: 'RS / Klinik',
    name,
    address,
    phoneText: phone?.display || '',
    openingHours: getAny(p, ['opening_hours']),
    primaryActionHtml: phone
      ? `<a class="mini-btn" href="${escapeAttr(phone.href)}">Hubungi RS</a>`
      : `<a class="mini-btn" href="${escapeAttr(mapsUrl)}" target="_blank" rel="noopener noreferrer">Buka lokasi</a>`,
    secondaryActionHtml: website
      ? `<a class="mini-btn secondary-action" href="${escapeAttr(website)}" target="_blank" rel="noopener noreferrer">Website RS</a>`
      : `<a class="mini-btn secondary-action" href="${escapeAttr(searchUrl)}" target="_blank" rel="noopener noreferrer">Cari web RS</a>`,
    tertiaryActionHtml: `<a class="mini-btn secondary-action" href="${escapeAttr(mapsUrl)}" target="_blank" rel="noopener noreferrer">Google Maps</a>`,
  };
}

function buildPoliceInfo(feature) {
  const p = feature.properties || {};
  const name = getAny(p, ['name']) || 'Kantor Polisi';
  const address = getAddress(p);
  const phone = getPhone(p);
  const website = getAny(p, ['website', 'contact:website', 'url']);
  const coords = feature.geometry.coordinates;
  const mapsUrl = buildMapsUrl(name, coords[1], coords[0]);
  const searchUrl = buildSearchUrl(`${name} Yogyakarta`);
  const policeCall = APP_CONFIG.emergency?.policeCall || '110';

  return {
    typeLabel: 'Kantor Polisi',
    name,
    address,
    phoneText: phone?.display || policeCall,
    openingHours: getAny(p, ['opening_hours']),
    primaryActionHtml: `<a class="mini-btn" href="tel:${escapeAttr(policeCall)}">Hubungi 110</a>`,
    secondaryActionHtml: phone
      ? `<a class="mini-btn secondary-action" href="${escapeAttr(phone.href)}">Hubungi kantor</a>`
      : `<a class="mini-btn secondary-action" href="${escapeAttr(mapsUrl)}" target="_blank" rel="noopener noreferrer">Buka lokasi</a>`,
    tertiaryActionHtml: website
      ? `<a class="mini-btn secondary-action" href="${escapeAttr(website)}" target="_blank" rel="noopener noreferrer">Website</a>`
      : `<a class="mini-btn secondary-action" href="${escapeAttr(searchUrl)}" target="_blank" rel="noopener noreferrer">Cari polsek</a>`,
  };
}

function buildCctvPopup(info) {
  return `
    <div class="popup-card">
      <strong>📷 CCTV</strong><br>
      ${escapeHtml(info.name)}
      ${info.descr ? `<span class="popup-sub">${escapeHtml(info.descr)}</span>` : ''}
      <div class="inline-actions">
        <a class="mini-btn" href="${escapeAttr(info.streamUrl)}" target="_blank" rel="noopener noreferrer">Buka stream CCTV</a>
        <a class="mini-btn secondary-action" href="${escapeAttr(info.portalUrl)}" target="_blank" rel="noopener noreferrer">Portal CCTV</a>
      </div>
    </div>
  `;
}

function buildHospitalPopup(info) {
  return `
    <div class="popup-card">
      <strong>🏥 RS / Klinik</strong><br>
      ${escapeHtml(info.name)}
      ${info.address ? `<span class="popup-sub">${escapeHtml(info.address)}</span>` : ''}
      ${info.phoneText ? `<span class="popup-sub">Telp: ${escapeHtml(info.phoneText)}</span>` : ''}
      ${info.openingHours ? `<span class="popup-sub">Jam: ${escapeHtml(info.openingHours)}</span>` : ''}
      <div class="inline-actions">
        ${info.primaryActionHtml}
        ${info.secondaryActionHtml}
        ${info.tertiaryActionHtml}
      </div>
    </div>
  `;
}

function buildPolicePopup(info) {
  return `
    <div class="popup-card">
      <strong>👮 Kantor Polisi</strong><br>
      ${escapeHtml(info.name)}
      ${info.address ? `<span class="popup-sub">${escapeHtml(info.address)}</span>` : ''}
      ${info.phoneText ? `<span class="popup-sub">Kontak: ${escapeHtml(info.phoneText)}</span>` : ''}
      ${info.openingHours ? `<span class="popup-sub">Jam: ${escapeHtml(info.openingHours)}</span>` : ''}
      <div class="inline-actions">
        ${info.primaryActionHtml}
        ${info.secondaryActionHtml}
        ${info.tertiaryActionHtml}
      </div>
    </div>
  `;
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

function buildMapsUrl(name, lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng} ${name}`)}`;
}

function buildSearchUrl(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function createEmojiIcon(symbol, typeClass) {
  return L.divIcon({
    className: '',
    html: `<div class="map-icon ${typeClass}">${symbol}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -12],
  });
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

function capitalize(value) {
  const str = String(value || '');
  return str.charAt(0).toUpperCase() + str.slice(1);
}
