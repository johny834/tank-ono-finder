'use strict';

// ── Station data (inlined from stations.json) ──────────────────────────────
const STATIONS = [
  {id:1,  name:"ČS Plzeň, Domažlická",          lat:49.7364283, lng:13.330928},
  {id:2,  name:"ČS Nýřany",                       lat:49.7143517, lng:13.1829904},
  {id:3,  name:"ČS Plzeň, Studentská",            lat:49.7751277, lng:13.3605691},
  {id:4,  name:"ČS Sokolov",                      lat:50.163862,  lng:12.6647554},
  {id:5,  name:"ČS Teplice",                      lat:50.6508979, lng:13.8331188},
  {id:6,  name:"ČS Cheb",                         lat:50.0844837, lng:12.4622164},
  {id:7,  name:"ČS Milovice u Hořic",             lat:50.324795,  lng:15.6377472},
  {id:8,  name:"ČS Chlumec",                      lat:50.6967927, lng:13.9429392},
  {id:9,  name:"ČS Jihlava",                      lat:49.3894783, lng:15.5751928},
  {id:10, name:"ČS Trutnov",                      lat:50.5467516, lng:15.9094871},
  {id:11, name:"ČS Jindřichův Hradec",            lat:49.1310672, lng:15.0173792},
  {id:12, name:"ČS Vysoké Mýto",                  lat:49.9175285, lng:16.1779029},
  {id:13, name:"ČS Havraň",                       lat:50.4489057, lng:13.5989066},
  {id:14, name:"ČS Kolaje u Poděbrad",            lat:50.1534648, lng:15.2404369},
  {id:15, name:"ČS Ústí n. L., Božtěšická",      lat:50.6839568, lng:14.0164675},
  {id:16, name:"ČS Praha, Dolní Měcholupy",       lat:50.0498523, lng:14.5693083},
  {id:17, name:"ČS Kbelnice",                     lat:49.2935005, lng:13.9816598},
  {id:18, name:"ČS Havlovice u Domažlic",         lat:49.4185099, lng:12.874376},
  {id:19, name:"ČS Mělník",                       lat:50.3410159, lng:14.4997254},
  {id:20, name:"ČS Krupá u Rakovníka",            lat:50.1690735, lng:13.7439605},
  {id:21, name:"ČS Dolní Dvořiště – ONO I",       lat:48.651981,  lng:14.4536964},
  {id:22, name:"ČS Dolní Dvořiště – ONO II",      lat:48.6459347, lng:14.4538144},
  {id:23, name:"ČS Církvice u Kutné Hory",        lat:49.9487785, lng:15.3291859},
  {id:24, name:"ČS Sukorady u Mladé Boleslavi",   lat:50.4275383, lng:15.048262},
  {id:25, name:"ČS Podolí u Písku",               lat:49.3516897, lng:14.2900171},
  {id:26, name:"ČS Planá nad Lužnicí",            lat:49.3548664, lng:14.7030452},
  {id:27, name:"ČS Spytihněv",                    lat:49.1333187, lng:17.4899132},
  {id:28, name:"ČS Mošnov",                       lat:49.6854019, lng:18.1346734},
  {id:29, name:"ČS Kojetice-Tůmovka",             lat:50.2253914, lng:14.4988414},
  {id:30, name:"ČS Cvikov",                       lat:50.7840859, lng:14.6158941},
  {id:31, name:"ČS Chomutov – Přečaply",          lat:50.423531,  lng:13.470749},
  {id:32, name:"ČS Zádveřice u Zlína",            lat:49.2096363, lng:17.8111775},
  {id:33, name:"ČS Brno-Popovice",                lat:49.099558,  lng:16.6095907},
  {id:34, name:"ČS Roudnice nad Labem",           lat:50.4255272, lng:14.2393889},
  {id:35, name:"ČS Vysokov u Náchoda",            lat:50.3983448, lng:16.1063828},
  {id:36, name:"ČS Praha – Štěrboholy",           lat:50.0699486, lng:14.5417218},
  {id:37, name:"ČS Řasnice-Strážný",              lat:48.9125794, lng:13.7630004},
  {id:38, name:"ČS Břest u Kroměříže",            lat:49.3477293, lng:17.4464699},
  {id:39, name:"ČS Vojtanov",                     lat:50.1627,    lng:12.3167131},
  {id:40, name:"ČS Dobkovice u Děčína",           lat:50.7210908, lng:14.1865775},
  {id:41, name:"ČS Březno u Loun D7",             lat:50.3518776, lng:13.725684},
  {id:42, name:"ČS Brno-Hviezdoslavova",          lat:49.183302,  lng:16.6714723},
  {id:43, name:"ČS Studénka – D1 exit 336",       lat:49.7095535, lng:18.0413436},
  {id:44, name:"ČS Ostrov nad Ohří",              lat:50.3199113, lng:12.9461271},
  {id:45, name:"ČS Chlumčany u Přeštic",         lat:49.6289004, lng:13.3299895},
  {id:46, name:"ČS Rumburk",                      lat:50.9493663, lng:14.5787406},
];

// ── App state ──────────────────────────────────────────────────────────────
let map;
let userMarker = null;
let stationMarkers = {};         // id → Leaflet marker
let selectedId   = null;
let nearestId    = null;
let userLocation = null;         // { lat, lng }
let prices       = null;         // parsed price object or { error: true }
let pricesFetched = false;

// ── Colours & icon sizes ───────────────────────────────────────────────────
const C = {
  normal:   '#f59e0b',
  nearest:  '#22c55e',
  selected: '#fb923c',
};

function markerColor(id) {
  if (id === selectedId) return C.selected;
  if (id === nearestId)  return C.nearest;
  return C.normal;
}
function markerSize(id) {
  return (id === selectedId || id === nearestId) ? 30 : 24;
}

function buildPinIcon(id) {
  const color = markerColor(id);
  const sz    = markerSize(id);
  const h     = Math.round(sz * 1.43);
  // Inner circle uses a fuel-drop / circle look
  const r = Math.round(sz * 0.22);
  const cx = sz / 2, cy = sz / 2;
  const svg = `<svg width="${sz}" height="${h}" viewBox="0 0 ${sz} ${h}"
      xmlns="http://www.w3.org/2000/svg" overflow="visible">
    <filter id="ds${id}"><feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="rgba(0,0,0,.55)"/></filter>
    <path d="M${cx} 0 C${cx*0.45} 0 0 ${cy*0.45} 0 ${cy}
             C 0 ${cy*1.75} ${cx} ${h} ${cx} ${h}
             C ${cx} ${h} ${sz} ${cy*1.75} ${sz} ${cy}
             C ${sz} ${cy*0.45} ${cx*1.55} 0 ${cx} 0 Z"
      fill="${color}" filter="url(#ds${id})"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="white" fill-opacity=".92"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-pin',
    iconSize:   [sz, h],
    iconAnchor: [sz / 2, h],
    popupAnchor:[0, -h],
  });
}

function buildUserIcon() {
  return L.divIcon({
    html: `<div class="user-dot-wrap"><div class="user-dot-ring"></div><div class="user-dot"></div></div>`,
    className: 'custom-pin',
    iconSize:   [18, 18],
    iconAnchor: [9, 9],
  });
}

// ── Haversine distance (km) ────────────────────────────────────────────────
function distKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function fmtDist(km) {
  return km < 1
    ? `${Math.round(km * 1000)} m`
    : `${km.toFixed(1).replace('.', ',')} km`;
}

// ── Map init ───────────────────────────────────────────────────────────────
function initMap() {
  map = L.map('map', {
    center: [49.85, 15.55],
    zoom: 7,
    zoomControl: false,
    attributionControl: true,
  });

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> přispěvatelé © <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  STATIONS.forEach(s => {
    const m = L.marker([s.lat, s.lng], {
      icon: buildPinIcon(s.id),
      title: s.name,
      riseOnHover: true,
    }).addTo(map);
    m.on('click', () => selectStation(s.id, true));
    stationMarkers[s.id] = m;
  });
}

// ── Marker refresh ─────────────────────────────────────────────────────────
function refreshMarker(id) {
  const m = stationMarkers[id];
  if (!m) return;
  m.setIcon(buildPinIcon(id));
  m.setZIndexOffset(
    id === selectedId ? 2000 : id === nearestId ? 1000 : 0
  );
}

// ── Station selection ──────────────────────────────────────────────────────
function selectStation(id, panMap) {
  const prev = selectedId;
  selectedId = id;

  if (prev && prev !== id) refreshMarker(prev);
  refreshMarker(id);

  // Highlight nearest marker if it changed role
  if (nearestId && nearestId !== id && nearestId !== prev) refreshMarker(nearestId);

  const station = STATIONS.find(s => s.id === id);
  renderSelectedPanel(station);
  highlightListItem(id);

  if (panMap) {
    map.panTo([station.lat, station.lng], { animate: true, duration: 0.6 });
  }
}

function clearSelection() {
  if (!selectedId) return;
  const prev = selectedId;
  selectedId = null;
  refreshMarker(prev);
  if (nearestId) refreshMarker(nearestId);

  document.getElementById('selected-placeholder').classList.remove('hidden');
  document.getElementById('selected-info').classList.add('hidden');
  highlightListItem(null);
}

// ── Selected panel render ──────────────────────────────────────────────────
function renderSelectedPanel(station) {
  document.getElementById('selected-placeholder').classList.add('hidden');
  document.getElementById('selected-info').classList.remove('hidden');

  document.getElementById('selected-name').textContent = station.name;

  const distEl = document.getElementById('selected-distance');
  if (userLocation) {
    const d = distKm(userLocation.lat, userLocation.lng, station.lat, station.lng);
    distEl.textContent = fmtDist(d);
    distEl.style.display = '';
  } else {
    distEl.style.display = 'none';
  }

  const badge = document.getElementById('nearest-badge');
  if (station.id === nearestId) badge.classList.remove('hidden');
  else badge.classList.add('hidden');

  renderPricesPanel();
}

// ── Prices panel render ────────────────────────────────────────────────────
function renderPricesPanel() {
  const panel = document.getElementById('prices-panel');
  if (!pricesFetched) {
    panel.innerHTML = `<div class="prices-loading"><span class="spinner"></span> Načítání cen…</div>`;
    return;
  }
  if (!prices || prices.error) {
    panel.innerHTML = `<div class="prices-error">⚠ Ceny nedostupné</div>`;
    return;
  }

  const primary = [
    { key: 'natural95',  label: 'Natural 95' },
    { key: 'diesel',     label: 'Diesel' },
    { key: 'lpg',        label: 'LPG' },
  ];
  const secondary = [
    { key: 'natural95premium', label: 'Nat. 95+' },
    { key: 'natural98',        label: 'Natural 98' },
    { key: 'dieselplus',       label: 'Diesel+' },
    { key: 'adblue',           label: 'AdBlue' },
  ].filter(f => prices[f.key]);

  let html = `<div class="prices-grid primary">`;
  primary.forEach(f => {
    const val = prices[f.key];
    html += `<div class="price-item primary">
      <div class="price-label">${f.label}</div>
      <div class="price-value">${val ?? '–'} <span class="price-unit">Kč/l</span></div>
    </div>`;
  });
  html += `</div>`;

  if (secondary.length) {
    html += `<div class="prices-grid secondary">`;
    secondary.forEach(f => {
      html += `<div class="price-item secondary">
        <div class="price-label">${f.label}</div>
        <div class="price-value">${prices[f.key]} <span class="price-unit">Kč/l</span></div>
      </div>`;
    });
    html += `</div>`;
  }

  if (prices.validity) {
    html += `<div class="prices-validity"><strong>Platnost:</strong> ${prices.validity}</div>`;
  }

  panel.innerHTML = html;
}

// ── Station list render ────────────────────────────────────────────────────
function renderStationList() {
  const sorted = [...STATIONS];

  if (userLocation) {
    sorted.forEach(s => {
      s._dist = distKm(userLocation.lat, userLocation.lng, s.lat, s.lng);
    });
    sorted.sort((a, b) => a._dist - b._dist);
    document.getElementById('list-meta').textContent = 'seřazeno dle vzdálenosti';
  } else {
    sorted.forEach(s => { s._dist = null; });
    document.getElementById('list-meta').textContent = '46 stanic';
  }

  const ul = document.getElementById('station-list');
  ul.innerHTML = sorted.map(s => {
    const isNearest = s.id === nearestId;
    const classes   = ['station-item',
      isNearest ? 'nearest' : '',
      s.id === selectedId ? 'active' : '',
    ].filter(Boolean).join(' ');

    const distHtml = s._dist !== null
      ? `<span class="si-dist">${fmtDist(s._dist)}</span>` : '';
    const nearestBadge = isNearest
      ? `<span class="si-nearest-badge">Nejbližší</span>` : '';

    return `<div class="${classes}" data-id="${s.id}" onclick="handleListClick(${s.id})">
      <div class="si-dot"></div>
      <div class="si-body">
        <div class="si-name">${esc(s.name)}</div>
        ${distHtml || nearestBadge
          ? `<div class="si-sub">${distHtml}${nearestBadge}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function handleListClick(id) {
  selectStation(id, true);
  // On mobile scroll the map into view
  if (window.innerWidth <= 700) {
    document.getElementById('map-wrap').scrollIntoView({ behavior: 'smooth' });
  }
}

function highlightListItem(id) {
  document.querySelectorAll('.station-item').forEach(el => {
    el.classList.toggle('active', Number(el.dataset.id) === id);
  });
  if (id !== null) {
    const el = document.querySelector(`.station-item[data-id="${id}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Geolocation ────────────────────────────────────────────────────────────
function triggerGeolocation() {
  document.getElementById('locate-btn').classList.add('locating');
  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
  });
}

function onGeoSuccess(pos) {
  document.getElementById('locate-btn').classList.remove('locating');
  document.getElementById('geo-notice').classList.add('hidden');

  userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };

  if (userMarker) {
    userMarker.setLatLng([userLocation.lat, userLocation.lng]);
  } else {
    userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: buildUserIcon(),
      zIndexOffset: 3000,
      title: 'Vaše poloha',
    }).addTo(map);
  }

  // Find nearest
  let best = null, bestDist = Infinity;
  STATIONS.forEach(s => {
    const d = distKm(userLocation.lat, userLocation.lng, s.lat, s.lng);
    if (d < bestDist) { bestDist = d; best = s; }
  });

  const prevNearest = nearestId;
  nearestId = best ? best.id : null;

  if (prevNearest && prevNearest !== nearestId) refreshMarker(prevNearest);
  if (nearestId) refreshMarker(nearestId);

  renderStationList();

  // Auto-select nearest if nothing selected yet
  if (!selectedId && nearestId) {
    selectStation(nearestId, false);
    map.flyTo([best.lat, best.lng], 12, { animate: true, duration: 1.2 });
  }
}

function onGeoError(err) {
  document.getElementById('locate-btn').classList.remove('locating');
  document.getElementById('geo-notice').classList.remove('hidden');
  console.warn('Geolocation error:', err.message);
}

function requestGeolocation() {
  if (!navigator.geolocation) {
    document.getElementById('geo-notice').classList.remove('hidden');
    return;
  }
  triggerGeolocation();
}

// ── Price fetch ────────────────────────────────────────────────────────────
async function fetchPrices() {
  const statusEl = document.getElementById('price-status');
  const dotEl    = document.getElementById('price-dot');
  const btn      = document.getElementById('refresh-btn');

  statusEl.textContent = 'Načítání cen…';
  dotEl.className = 'status-dot loading';
  btn.classList.add('spinning');
  pricesFetched = false;

  try {
    const now  = new Date();
    const day  = String(now.getDate()).padStart(2, '0');
    const mon  = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hour = now.getHours();
    const min  = String(now.getMinutes()).padStart(2, '0');

    const body = new URLSearchParams({
      txtDate: `${day}/${mon}/${year}`,
      hod:     String(hour),
      min:     min,
    });

    const target = 'https://tank-ono.cz/cz/index.php?page=archiv';
    const proxy  = 'https://corsproxy.io/?url=' + encodeURIComponent(target);

    const resp = await fetch(proxy, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const html = await resp.text();
    prices = parsePrices(html);

    if (prices) {
      statusEl.textContent = 'Ceny aktuální';
      dotEl.className = 'status-dot ok';
    } else {
      prices = { error: true };
      statusEl.textContent = 'Ceny nedostupné';
      dotEl.className = 'status-dot error';
    }
  } catch (err) {
    console.error('Fetch error:', err);
    prices = { error: true };
    statusEl.textContent = 'Ceny nedostupné';
    dotEl.className = 'status-dot error';
  } finally {
    pricesFetched = true;
    btn.classList.remove('spinning');
    // Re-render prices panel if a station is selected
    if (selectedId) renderPricesPanel();
  }
}

// ── HTML price parser ──────────────────────────────────────────────────────
function parsePrices(html) {
  const doc   = new DOMParser().parseFromString(html, 'text/html');

  // ── Validity period ──
  let validity = '';
  const nadpis = doc.querySelector('#nadpis');
  if (nadpis) {
    const m = nadpis.textContent.match(
      /platnost\s+od:\s*(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{2}:\d{2}:\d{2})\s+do:\s*(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{2}:\d{2}:\d{2})/i
    );
    if (m) validity = `${m[1]} – ${m[2]}`;
  }

  // ── Price table ──
  const table = doc.querySelector('table.cenik');
  if (!table) return null;

  // Find the CZK / Kč row
  let cells = null;
  for (const row of table.querySelectorAll('tr')) {
    const tds = Array.from(row.querySelectorAll('td'));
    if (!tds.length) continue;
    const label = tds[0].textContent.trim();
    if (/^K[čc]$/i.test(label) || /^CZK$/i.test(label)) {
      cells = tds;
      break;
    }
  }

  // Fallback: first data row with enough cells
  if (!cells) {
    for (const row of table.querySelectorAll('tr')) {
      const tds = Array.from(row.querySelectorAll('td'));
      if (tds.length >= 9) { cells = tds; break; }
    }
  }

  if (!cells || cells.length < 9) return null;

  const getCell = idx => {
    if (idx >= cells.length) return null;
    const raw = cells[idx].textContent.trim();
    if (!raw || raw === '–' || raw === '-') return null;
    // Normalise Czech decimal comma: "38,90" → "38,90" (keep as-is for display)
    return raw;
  };

  const result = {
    natural95:        getCell(1),
    natural95premium: getCell(2),
    natural98:        getCell(3),
    diesel:           getCell(5),
    dieselplus:       getCell(7),
    adblue:           getCell(8),
    lpg:              getCell(9),
    validity,
  };

  // Return null if all prices are missing (probably wrong row)
  if (Object.values(result).every(v => v === null || v === '')) return null;

  return result;
}

// ── Boot ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  renderStationList();
  requestGeolocation();
  fetchPrices();
});
