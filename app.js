'use strict';

/* ═══════════════════════════════════════════════════════════
   Tank ONO Finder — App Logic v2
   Desktop: side panel detail | Mobile: bottom sheet
   ═══════════════════════════════════════════════════════════ */

// ── Station data ───────────────────────────────────────────
const STATIONS = [
  {id:1,name:"ČS Plzeň, Domažlická",lat:49.7364283,lng:13.330928},
  {id:2,name:"ČS Nýřany",lat:49.7143517,lng:13.1829904},
  {id:3,name:"ČS Plzeň, Studentská",lat:49.7751277,lng:13.3605691},
  {id:4,name:"ČS Sokolov",lat:50.163862,lng:12.6647554},
  {id:5,name:"ČS Teplice",lat:50.6508979,lng:13.8331188},
  {id:6,name:"ČS Cheb",lat:50.0844837,lng:12.4622164},
  {id:7,name:"ČS Milovice u Hořic",lat:50.324795,lng:15.6377472},
  {id:8,name:"ČS Chlumec",lat:50.6967927,lng:13.9429392},
  {id:9,name:"ČS Jihlava",lat:49.3894783,lng:15.5751928},
  {id:10,name:"ČS Trutnov",lat:50.5467516,lng:15.9094871},
  {id:11,name:"ČS Jindřichův Hradec",lat:49.1310672,lng:15.0173792},
  {id:12,name:"ČS Vysoké Mýto",lat:49.9175285,lng:16.1779029},
  {id:13,name:"ČS Havraň",lat:50.4489057,lng:13.5989066},
  {id:14,name:"ČS Kolaje u Poděbrad",lat:50.1534648,lng:15.2404369},
  {id:15,name:"ČS Ústí n. L., Božtěšická",lat:50.6839568,lng:14.0164675},
  {id:16,name:"ČS Praha, Dolní Měcholupy",lat:50.0498523,lng:14.5693083},
  {id:17,name:"ČS Kbelnice",lat:49.2935005,lng:13.9816598},
  {id:18,name:"ČS Havlovice u Domažlic",lat:49.4185099,lng:12.874376},
  {id:19,name:"ČS Mělník",lat:50.3410159,lng:14.4997254},
  {id:20,name:"ČS Krupá u Rakovníka",lat:50.1690735,lng:13.7439605},
  {id:21,name:"ČS Dolní Dvořiště – ONO I",lat:48.651981,lng:14.4536964},
  {id:22,name:"ČS Dolní Dvořiště – ONO II",lat:48.6459347,lng:14.4538144},
  {id:23,name:"ČS Církvice u Kutné Hory",lat:49.9487785,lng:15.3291859},
  {id:24,name:"ČS Sukorady u Mladé Boleslavi",lat:50.4275383,lng:15.048262},
  {id:25,name:"ČS Podolí u Písku",lat:49.3516897,lng:14.2900171},
  {id:26,name:"ČS Planá nad Lužnicí",lat:49.3548664,lng:14.7030452},
  {id:27,name:"ČS Spytihněv",lat:49.1333187,lng:17.4899132},
  {id:28,name:"ČS Mošnov",lat:49.6854019,lng:18.1346734},
  {id:29,name:"ČS Kojetice-Tůmovka",lat:50.2253914,lng:14.4988414},
  {id:30,name:"ČS Cvikov",lat:50.7840859,lng:14.6158941},
  {id:31,name:"ČS Chomutov – Přečaply",lat:50.423531,lng:13.470749},
  {id:32,name:"ČS Zádveřice u Zlína",lat:49.2096363,lng:17.8111775},
  {id:33,name:"ČS Brno-Popovice",lat:49.099558,lng:16.6095907},
  {id:34,name:"ČS Roudnice nad Labem",lat:50.4255272,lng:14.2393889},
  {id:35,name:"ČS Vysokov u Náchoda",lat:50.3983448,lng:16.1063828},
  {id:36,name:"ČS Praha – Štěrboholy",lat:50.0699486,lng:14.5417218},
  {id:37,name:"ČS Řasnice-Strážný",lat:48.9125794,lng:13.7630004},
  {id:38,name:"ČS Břest u Kroměříže",lat:49.3477293,lng:17.4464699},
  {id:39,name:"ČS Vojtanov",lat:50.1627,lng:12.3167131},
  {id:40,name:"ČS Dobkovice u Děčína",lat:50.7210908,lng:14.1865775},
  {id:41,name:"ČS Březno u Loun D7",lat:50.3518776,lng:13.725684},
  {id:42,name:"ČS Brno-Hviezdoslavova",lat:49.183302,lng:16.6714723},
  {id:43,name:"ČS Studénka – D1 exit 336",lat:49.7095535,lng:18.0413436},
  {id:44,name:"ČS Ostrov nad Ohří",lat:50.3199113,lng:12.9461271},
  {id:45,name:"ČS Chlumčany u Přeštic",lat:49.6289004,lng:13.3299895},
  {id:46,name:"ČS Rumburk",lat:50.9493663,lng:14.5787406},
];

// ── State ──────────────────────────────────────────────────
let map, tileLayer;
let userMarker = null;
let stationMarkers = {};
let selectedId = null;
let nearestId = null;
let userLocation = null;
let prices = null;
let pricesFetched = false;

// ── Helpers ────────────────────────────────────────────────
function isMobile() { return window.innerWidth <= 700; }
function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function distKm(a, b, c, d) {
  const R = 6371, p = Math.PI / 180;
  const dLat = (c - a) * p, dLng = (d - b) * p;
  const x = Math.sin(dLat/2)**2 + Math.cos(a*p) * Math.cos(c*p) * Math.sin(dLng/2)**2;
  return R * 2 * Math.asin(Math.sqrt(x));
}
function fmtDist(km) { return km < 1 ? `${Math.round(km*1000)} m` : `${km.toFixed(1).replace('.',',')} km`; }

// ── Theme ──────────────────────────────────────────────────
const TILES = {
  light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  dark:  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};
function getTheme() { return document.documentElement.getAttribute('data-theme') || 'light'; }
function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('tank-ono-theme', next);
  setTileLayer(next);
  if (historyChart && historyData) {
    const days = RANGE_DAYS[currentRange];
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days);
    renderHistoryChart(historyData.filter(d => d.date >= cutoff.toISOString().slice(0,10)));
  }
}
function setTileLayer(theme) {
  if (tileLayer) map.removeLayer(tileLayer);
  tileLayer = L.tileLayer(TILES[theme], {
    attribution: '© <a href="https://openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com">CARTO</a>',
    subdomains: 'abcd', maxZoom: 19,
  }).addTo(map);
}

// ── Markers ────────────────────────────────────────────────
const PIN = { normal: '#e5760a', nearest: '#16a34a', selected: '#f59e0b' };
function pinColor(id) { return id === selectedId ? PIN.selected : id === nearestId ? PIN.nearest : PIN.normal; }
function buildPin(id) {
  const c = pinColor(id), big = id === selectedId || id === nearestId;
  const sz = big ? 36 : 30, h = Math.round(sz * 1.4);
  const cx = sz/2, cy = sz/2, r = Math.round(sz * .2);
  return L.divIcon({
    html: `<svg width="${sz}" height="${h}" viewBox="0 0 ${sz} ${h}" xmlns="http://www.w3.org/2000/svg">
      <path d="M${cx} 0C${cx*.4} 0 0 ${cy*.4} 0 ${cy} 0 ${cy*1.7} ${cx} ${h} ${cx} ${h}S${sz} ${cy*1.7} ${sz} ${cy} ${cx*1.6} 0 ${cx} 0Z" fill="${c}" stroke="white" stroke-width="1.5"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/></svg>`,
    className: 'custom-pin', iconSize: [sz,h], iconAnchor: [sz/2,h],
  });
}
function refreshMarker(id) {
  const m = stationMarkers[id]; if (!m) return;
  m.setIcon(buildPin(id));
  m.setZIndexOffset(id === selectedId ? 2000 : id === nearestId ? 1000 : 0);
}

// ── Map ────────────────────────────────────────────────────
function initMap() {
  map = L.map('map', { center: [49.85, 15.55], zoom: 7, zoomControl: false, attributionControl: true });
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  setTileLayer(getTheme());

  STATIONS.forEach(s => {
    const m = L.marker([s.lat, s.lng], { icon: buildPin(s.id), title: s.name, riseOnHover: true }).addTo(map);
    m.on('click', () => selectStation(s.id, true));
    stationMarkers[s.id] = m;
  });

  // Click empty map → deselect
  map.on('click', (e) => {
    // Only if not clicking a marker
    if (e.originalEvent && e.originalEvent.target.closest('.custom-pin')) return;
    clearSelection();
  });
}

// ── Prices HTML (shared between desktop & mobile) ──────────
function buildPricesHTML() {
  if (!pricesFetched) return '<div class="prices-loading"><span class="spinner"></span> Načítání cen…</div>';
  if (!prices || prices.error) return '<div class="prices-error">⚠ Ceny nedostupné</div>';

  const fuels = [
    { k:'natural95', l:'Natural 95', p:true },
    { k:'diesel', l:'Diesel', p:true },
    { k:'lpg', l:'LPG', p:true },
    { k:'natural95premium', l:'Nat. 95+', p:false },
    { k:'natural98', l:'Natural 98', p:false },
    { k:'dieselplus', l:'Diesel+', p:false },
    { k:'adblue', l:'AdBlue', p:false },
  ].filter(f => prices[f.k]);

  if (!fuels.length) return '<div class="prices-error">⚠ Ceny nedostupné</div>';

  let h = '<div class="prices-grid">';
  fuels.forEach(f => {
    h += `<div class="fuel-card${f.p ? ' primary' : ''}">
      <div class="fuel-label">${f.l}</div>
      <div class="fuel-val">${prices[f.k]} <span class="fuel-unit">Kč</span></div>
    </div>`;
  });
  h += '</div>';
  if (prices.validity) h += `<div class="prices-validity">Platnost: ${prices.validity}</div>`;
  return h;
}

function buildChipsHTML(station) {
  const chips = [];
  if (userLocation) chips.push(`<span class="chip dist-chip">${fmtDist(distKm(userLocation.lat, userLocation.lng, station.lat, station.lng))}</span>`);
  if (station.id === nearestId) chips.push(`<span class="chip nearest-chip">⭐ Nejbližší</span>`);
  return chips.join('');
}

// ── Selection (core) ───────────────────────────────────────
function selectStation(id, pan) {
  const prev = selectedId;
  selectedId = id;
  if (prev && prev !== id) refreshMarker(prev);
  refreshMarker(id);
  if (nearestId && nearestId !== id && nearestId !== prev) refreshMarker(nearestId);

  const s = STATIONS.find(x => x.id === id);
  showDetail(s);
  highlightListItem(id);

  if (pan) {
    // On desktop, offset map center to account for side panel
    if (!isMobile()) {
      const panelW = 320;
      const point = map.latLngToContainerPoint([s.lat, s.lng]);
      const offset = L.point(panelW / 2, 0);
      const target = map.containerPointToLatLng(point.subtract(offset));
      map.panTo(target, { animate: true, duration: .4 });
    } else {
      map.panTo([s.lat, s.lng], { animate: true, duration: .4 });
    }
  }
}

function clearSelection() {
  if (!selectedId) return;
  const prev = selectedId;
  selectedId = null;
  refreshMarker(prev);
  if (nearestId) refreshMarker(nearestId);
  hideDetail();
  highlightListItem(null);
}

// ── Detail display (responsive) ────────────────────────────
function showDetail(station) {
  if (isMobile()) {
    showSheet(station);
  } else {
    showPanel(station);
  }
}

function hideDetail() {
  // Desktop panel
  document.getElementById('detail').classList.add('hidden');
  // Mobile sheet
  const sheet = document.getElementById('sheet');
  sheet.classList.remove('visible');
  sheet.classList.add('hidden');
}

// Desktop side panel detail
function showPanel(station) {
  const el = document.getElementById('detail');
  el.classList.remove('hidden');
  document.getElementById('detail-name').textContent = station.name;
  document.getElementById('detail-chips').innerHTML = buildChipsHTML(station);
  document.getElementById('detail-prices').innerHTML = buildPricesHTML();
}

// Mobile bottom sheet
function showSheet(station) {
  const sheet = document.getElementById('sheet');
  sheet.classList.remove('hidden');
  sheet.classList.add('visible');
  document.getElementById('sheet-name').textContent = station.name;
  document.getElementById('sheet-chips').innerHTML = buildChipsHTML(station);
  document.getElementById('sheet-prices').innerHTML = buildPricesHTML();
}

function toggleSheet() {
  const sheet = document.getElementById('sheet');
  if (sheet.classList.contains('expanded')) {
    sheet.classList.remove('expanded');
  } else {
    sheet.classList.add('expanded');
  }
}

// Refresh detail if prices arrive while station is selected
function refreshDetail() {
  if (!selectedId) return;
  const s = STATIONS.find(x => x.id === selectedId);
  if (!s) return;
  if (isMobile()) {
    const sheet = document.getElementById('sheet');
    if (sheet.classList.contains('visible')) {
      document.getElementById('sheet-prices').innerHTML = buildPricesHTML();
    }
  } else {
    const detail = document.getElementById('detail');
    if (!detail.classList.contains('hidden')) {
      document.getElementById('detail-prices').innerHTML = buildPricesHTML();
    }
  }
}

// Navigate to station via Google Maps
function navigateToStation() {
  if (!selectedId) return;
  const s = STATIONS.find(x => x.id === selectedId);
  if (!s) return;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`;
  window.open(url, '_blank');
}

// ── Station list ───────────────────────────────────────────
function renderList() {
  const sorted = [...STATIONS];
  if (userLocation) {
    sorted.forEach(s => { s._d = distKm(userLocation.lat, userLocation.lng, s.lat, s.lng); });
    sorted.sort((a, b) => a._d - b._d);
  } else {
    sorted.forEach(s => { s._d = null; });
  }
  document.getElementById('list-meta').textContent = userLocation ? 'dle vzdálenosti' : `${STATIONS.length} stanic`;

  document.getElementById('station-list').innerHTML = sorted.map(s => {
    const near = s.id === nearestId;
    const cls = ['station-item', near ? 'nearest' : '', s.id === selectedId ? 'active' : ''].filter(Boolean).join(' ');
    const dist = s._d !== null ? `<span class="si-dist">${fmtDist(s._d)}</span>` : '';
    const badge = near ? `<span class="si-nearest-badge">Nejbližší</span>` : '';
    return `<div class="${cls}" data-id="${s.id}" onclick="selectStation(${s.id},true)">
      <div class="si-dot"></div>
      <div class="si-body">
        <div class="si-name">${esc(s.name)}</div>
        ${dist || badge ? `<div class="si-sub">${dist}${badge}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

function highlightListItem(id) {
  document.querySelectorAll('.station-item').forEach(el => {
    el.classList.toggle('active', +el.dataset.id === id);
  });
  if (id !== null) {
    const el = document.querySelector(`.station-item[data-id="${id}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ── Geolocation ────────────────────────────────────────────
function triggerGeolocation() {
  document.getElementById('locate-btn').classList.add('locating');
  navigator.geolocation.getCurrentPosition(onGeoOk, onGeoErr, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
}
function onGeoOk(pos) {
  document.getElementById('locate-btn').classList.remove('locating');
  document.getElementById('geo-notice').classList.add('hidden');
  userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };

  if (userMarker) userMarker.setLatLng([userLocation.lat, userLocation.lng]);
  else {
    userMarker = L.marker([userLocation.lat, userLocation.lng], {
      icon: L.divIcon({ html: '<div class="user-dot-wrap"><div class="user-dot-ring"></div><div class="user-dot"></div></div>', className: 'custom-pin', iconSize: [18,18], iconAnchor: [9,9] }),
      zIndexOffset: 3000, title: 'Vaše poloha',
    }).addTo(map);
  }

  let best = null, bestD = Infinity;
  STATIONS.forEach(s => { const d = distKm(userLocation.lat, userLocation.lng, s.lat, s.lng); if (d < bestD) { bestD = d; best = s; } });
  const prev = nearestId;
  nearestId = best ? best.id : null;
  if (prev && prev !== nearestId) refreshMarker(prev);
  if (nearestId) refreshMarker(nearestId);
  renderList();

  if (!selectedId && nearestId) {
    selectStation(nearestId, false);
    map.flyTo([best.lat, best.lng], 12, { animate: true, duration: 1 });
  }
}
function onGeoErr() {
  document.getElementById('locate-btn').classList.remove('locating');
  document.getElementById('geo-notice').classList.remove('hidden');
}
function requestGeo() {
  if (!navigator.geolocation) { document.getElementById('geo-notice').classList.remove('hidden'); return; }
  triggerGeolocation();
}

// ── Prices ─────────────────────────────────────────────────
async function fetchPrices() {
  const statusEl = document.getElementById('price-status');
  const dot = document.getElementById('price-dot');
  const btn = document.getElementById('refresh-btn');
  statusEl.textContent = 'Načítání…'; dot.className = 'loading'; btn.classList.add('spinning');
  pricesFetched = false;

  try {
    const now = new Date();
    const body = new URLSearchParams({
      txtDate: `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`,
      hod: String(now.getHours()), min: String(now.getMinutes()).padStart(2,'0'),
    });
    const resp = await fetch('https://corsproxy.io/?url=' + encodeURIComponent('https://tank-ono.cz/cz/index.php?page=archiv'), {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString(),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    prices = parsePrices(await resp.text());
    if (prices) { statusEl.textContent = 'Aktuální'; dot.className = 'ok'; }
    else { prices = { error: true }; statusEl.textContent = 'Nedostupné'; dot.className = 'error'; }
  } catch (e) {
    console.error(e); prices = { error: true }; statusEl.textContent = 'Nedostupné'; dot.className = 'error';
  } finally {
    pricesFetched = true; btn.classList.remove('spinning');
    refreshDetail();
  }
}

// ── Price parser ───────────────────────────────────────────
function parsePrices(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  let validity = '';
  const nadpis = doc.querySelector('#nadpis');
  if (nadpis) {
    const m = nadpis.textContent.match(/platnost\s+od:\s*([\d/: ]+)\s+do:\s*([\d/: ]+)/i);
    if (m) validity = `${m[1].trim()} – ${m[2].trim()}`;
  }
  const table = doc.querySelector('table.cenik');
  if (!table) return null;

  let cells = null;
  for (const row of table.querySelectorAll('tr')) {
    const tds = Array.from(row.querySelectorAll('td'));
    if (!tds.length) continue;
    if (/^K[čc]$/i.test(tds[0].textContent.trim()) || /^CZK$/i.test(tds[0].textContent.trim())) { cells = tds; break; }
  }
  if (!cells) for (const row of table.querySelectorAll('tr')) {
    const tds = Array.from(row.querySelectorAll('td'));
    if (tds.length >= 9) { cells = tds; break; }
  }
  if (!cells || cells.length < 9) return null;

  const get = i => {
    if (i >= cells.length) return null;
    const v = cells[i].textContent.replace(/\s+/g,'').trim();
    return (!v || v === '–' || v === '-' || v === ',') ? null : v;
  };
  const r = { natural95:get(2), natural95premium:get(3), natural98:get(4), diesel:get(6), dieselplus:get(8), adblue:get(9), lpg:get(10), validity };
  return Object.values(r).every(v => v === null || v === '') ? null : r;
}

// ── History ────────────────────────────────────────────────
let historyChart = null, historyData = null, currentRange = 'week';
const RANGE_DAYS = { week: 7, month: 30, half: 180 };
const FUEL_META = {
  natural95:        { label: 'Natural 95',  color: '#e5760a',  primary: true },
  diesel:           { label: 'Diesel',      color: '#2563eb',  primary: true },
  lpg:              { label: 'LPG',         color: '#16a34a',  primary: true },
  natural95premium: { label: 'Nat. 95+',    color: '#f59e0b',  primary: false },
  natural98:        { label: 'Natural 98',  color: '#a855f7',  primary: false },
  dieselplus:       { label: 'Diesel+',     color: '#06b6d4',  primary: false },
  adblue:           { label: 'AdBlue',      color: '#64748b',  primary: false },
};
const KEY_MAP = { n95:'natural95', n95p:'natural95premium', n98:'natural98', die:'diesel', diep:'dieselplus', adb:'adblue', lpg:'lpg' };

function openHistory() {
  document.getElementById('history-overlay').classList.remove('hidden');
  switchHistoryTab(currentRange);
  if (!historyData) loadHistoryData();
}
function closeHistory(e) { if (e && e.target !== e.currentTarget) return; document.getElementById('history-overlay').classList.add('hidden'); }

async function loadHistoryData() {
  const st = document.getElementById('history-status');
  st.textContent = 'Načítání…';
  try {
    // Try static JSON first
    const resp = await fetch('data/history.json?v=' + Date.now());
    if (!resp.ok) throw new Error('fetch failed');
    const json = await resp.json();
    if (!json.prices || json.prices.length === 0) throw new Error('empty data');
    historyData = json.prices.map(p => {
      const out = { date: p.d };
      for (const [short, long] of Object.entries(KEY_MAP)) out[long] = p[short] || null;
      return out;
    });
    st.textContent = `${historyData.length} bodů · aktualizováno ${json.updated.slice(0, 10)}`;
    switchHistoryTab(currentRange);
  } catch (e) {
    console.warn('Static history failed, falling back to live fetch:', e.message);
    await loadHistoryLive();
  }
}

// Fallback: fetch last 7 days live via CORS proxy
async function loadHistoryLive() {
  const st = document.getElementById('history-status');
  const pts = [], now = new Date();
  for (let d = 7; d >= 0; d--) {
    const dt = new Date(now); dt.setDate(dt.getDate() - d);
    const dd = String(dt.getDate()).padStart(2,'0'), mm = String(dt.getMonth()+1).padStart(2,'0'), yy = dt.getFullYear();
    try {
      st.textContent = `Načítání: ${8-d}/8…`;
      const r = await fetch('https://corsproxy.io/?url=' + encodeURIComponent('https://tank-ono.cz/cz/index.php?page=archiv'), {
        method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body: `txtDate=${dd}/${mm}/${yy}&hod=12&min=00`,
      });
      if (!r.ok) continue;
      const p = parsePrices(await r.text());
      if (p && !p.error) {
        const out = { date: `${yy}-${mm}-${dd}` };
        out.natural95 = p.natural95; out.natural95premium = p.natural95premium;
        out.natural98 = p.natural98; out.diesel = p.diesel;
        out.dieselplus = p.dieselplus; out.adblue = p.adblue; out.lpg = p.lpg;
        pts.push(out);
      }
    } catch {}
    await new Promise(r => setTimeout(r, 300));
  }
  if (pts.length) {
    historyData = pts;
    st.textContent = `${pts.length} bodů (live)`;
    switchHistoryTab('week');
  } else {
    st.textContent = 'Historie nedostupná';
  }
}

function switchHistoryTab(range) {
  currentRange = range;
  document.querySelectorAll('.htab').forEach(el => el.classList.toggle('active', el.dataset.range === range));
  if (!historyData) return;
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - RANGE_DAYS[range]);
  const filtered = historyData.filter(d => d.date >= cutoff.toISOString().slice(0,10));
  renderHistoryChart(filtered);
  document.getElementById('history-status').textContent = `${filtered.length} bodů`;
}

function pf(v) { return (!v || v === ',') ? null : parseFloat(v.replace(',','.')); }

function renderHistoryChart(data) {
  const ctx = document.getElementById('history-chart').getContext('2d');
  if (historyChart) historyChart.destroy();
  if (!data.length) { historyChart = null; return; }

  const dark = getTheme() === 'dark';
  const gridC = dark ? 'rgba(42,46,62,.6)' : 'rgba(226,229,236,.7)';
  const tickC = dark ? '#5c6280' : '#8990a5';
  const keys = Object.keys(FUEL_META);
  const active = keys.filter(k => data.some(d => pf(d[k]) !== null));

  historyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => { const p = d.date.split('-'); return `${p[2]}.${p[1]}.`; }),
      datasets: active.map(k => {
        const m = FUEL_META[k];
        return {
          label: m.label, data: data.map(d => pf(d[k])),
          borderColor: m.color, backgroundColor: m.color + '18',
          borderWidth: m.primary ? 2.5 : 1.5,
          pointRadius: data.length > 30 ? 0 : 3, pointHoverRadius: 5,
          tension: .3, fill: false, spanGaps: true, hidden: !m.primary,
        };
      }),
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom', labels: { color: tickC, font: { size: 11 }, boxWidth: 12, padding: 10, usePointStyle: true } },
        tooltip: {
          backgroundColor: dark ? '#181b25' : '#fff', titleColor: dark ? '#e4e6f0' : '#1a1d26',
          bodyColor: dark ? '#9298b4' : '#4b5068', borderColor: dark ? '#2a2e3e' : '#e2e5ec',
          borderWidth: 1, padding: 10,
          callbacks: { label: c => c.parsed.y === null ? null : ` ${c.dataset.label}: ${c.parsed.y.toFixed(2).replace('.',',')} Kč/l` },
        },
      },
      scales: {
        x: { ticks: { color: tickC, font: { size: 10 }, maxRotation: 45 }, grid: { color: gridC } },
        y: { ticks: { color: tickC, font: { size: 10 }, callback: v => v + ' Kč' }, grid: { color: gridC } },
      },
    },
  });
}

// ── Responsive: re-route detail on resize ──────────────────
let wasMobile = null;
function handleResize() {
  const mobile = isMobile();
  if (wasMobile === mobile) return;
  wasMobile = mobile;
  // Re-show detail in correct container if station is selected
  if (selectedId) {
    hideDetail();
    const s = STATIONS.find(x => x.id === selectedId);
    if (s) showDetail(s);
  }
}

// ── Boot ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('tank-ono-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.setAttribute('data-theme', 'dark');

  wasMobile = isMobile();
  window.addEventListener('resize', handleResize);

  initMap();
  renderList();
  requestGeo();
  fetchPrices();
});
