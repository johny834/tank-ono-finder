'use strict';

/* ═══════════════════════════════════════════════════════════
   Tank ONO Finder — v3
   Map: MapLibre GL + OpenFreeMap (free, no API key)
   Data: data/current.json + data/history.json (GitHub Action)
   ═══════════════════════════════════════════════════════════ */

// ── Stations ───────────────────────────────────────────────
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
].map(s => ({ ...s, label: s.name.replace(/^ČS\s+/, ''), key: norm(s.name) }));

// ── Fuels ──────────────────────────────────────────────────
// k = key in current.json, s = short key in history.json, c = CSS color var
const FUELS = [
  { k: 'natural95',        s: 'n95',  label: 'Natural 95',  c: '--f-n95',  primary: true },
  { k: 'diesel',           s: 'die',  label: 'Diesel',      c: '--f-die',  primary: true },
  { k: 'lpg',              s: 'lpg',  label: 'LPG',         c: '--f-lpg',  primary: true },
  { k: 'natural95premium', s: 'n95p', label: 'Natural 95+', c: '--f-n95p' },
  { k: 'natural98',        s: 'n98',  label: 'Natural 98',  c: '--f-n98'  },
  { k: 'dieselplus',       s: 'diep', label: 'Diesel+',     c: '--f-diep' },
  { k: 'adblue',           s: 'adb',  label: 'AdBlue',      c: '--f-adb'  },
];
const FUEL = Object.fromEntries(FUELS.map(f => [f.k, f]));
const RANGE_LABEL = { 7: 'za 7 dní', 30: 'za měsíc', 90: 'za 3 měsíce', 180: 'za půl roku' };

// ── Map styles (OpenFreeMap: free, open, no key) ───────────
const MAP_STYLES = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark:  'https://tiles.openfreemap.org/styles/dark',
};
// Raster OSM fallback if OpenFreeMap is unreachable
const FALLBACK_STYLE = {
  version: 8,
  sources: { osm: { type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'], tileSize: 256, maxzoom: 19,
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' } },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

// ── State ──────────────────────────────────────────────────
const state = {
  map: null, mapReady: false, mapFallback: false,
  markers: {}, userMarker: null,
  user: null, nearestId: null, selectedId: null, geoFailed: false,
  current: null,          // { prices: {k: number}, validFrom: Date|null, updated }
  series: [],             // [{ date:'YYYY-MM-DD', natural95: 35.9, ... }]
  loadError: false,
  fuel: 'natural95', range: 30, compare: false,
  tab: 'trend', query: '',
  expanded: false, peek: 260,
  chart: null,
};

// ── Helpers ────────────────────────────────────────────────
const $ = id => document.getElementById(id);
function norm(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
function isDesktop() { return window.matchMedia('(min-width: 900px)').matches; }
function num(v) { if (v == null) return null; const n = parseFloat(String(v).replace(/\s/g, '').replace(',', '.')); return Number.isFinite(n) ? n : null; }
function fmtPrice(n) { return n == null ? '–' : n.toFixed(2).replace('.', ','); }
function fmtDelta(d) { return (d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d).toFixed(2).replace('.', ','); }
function fmtPct(p) { return (p > 0 ? '+' : p < 0 ? '−' : '') + Math.abs(p).toFixed(1).replace('.', ',') + ' %'; }
function fmtDist(km) { return km < 1 ? `${Math.round(km * 1000)} m` : km < 10 ? `${km.toFixed(1).replace('.', ',')} km` : `${Math.round(km)} km`; }
function isoLocal(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function parseIso(iso) { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d, 12); }
function fmtDay(iso, opts = { day: 'numeric', month: 'numeric' }) { return parseIso(iso).toLocaleDateString('cs-CZ', opts); }
function distKm(a, b, c, d) {
  const R = 6371, p = Math.PI / 180;
  const x = Math.sin((c - a) * p / 2) ** 2 + Math.cos(a * p) * Math.cos(c * p) * Math.sin((d - b) * p / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(x));
}
function stationById(id) { return STATIONS.find(s => s.id === id); }
function distTo(s) { return state.user ? distKm(state.user.lat, state.user.lng, s.lat, s.lng) : null; }
function trendCls(d) { return d > 0.001 ? 'up' : d < -0.001 ? 'down' : 'flat'; }
function arrow(d) { return d > 0.001 ? '▲' : d < -0.001 ? '▼' : '•'; }

let toastTimer;
function toast(msg) {
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// "25/11/2026 15:44:41" → Date
function parseValidity(str) {
  const m = str && str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
  return m ? new Date(+m[3], m[2] - 1, +m[1], +m[4], +m[5]) : null;
}

// ── Icons ──────────────────────────────────────────────────
const ICON = {
  pump: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v17"/><path d="M2 22h14"/><path d="M15 9h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8.5L19 5"/><path d="M6 8h6"/></svg>',
  nav: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M21.7 2.3a1 1 0 0 0-1.06-.23l-18 7a1 1 0 0 0 .08 1.9l7.6 2.2 2.2 7.6a1 1 0 0 0 .93.73h.03a1 1 0 0 0 .94-.64l7-18a1 1 0 0 0-.22-1.06z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-6.2-8-12a8 8 0 0 1 16 0c0 5.8-8 12-8 12z"/><circle cx="12" cy="10" r="3"/></svg>',
  chev: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
};

/* ═══════════════════════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════════════════════ */
const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
function theme() { return document.documentElement.dataset.theme || (darkMQ.matches ? 'dark' : 'light'); }
function syncThemeColor() {
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute('content', theme() === 'dark' ? '#0b0e14' : '#f6f7f9'));
}
function toggleTheme() {
  const next = theme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('tank-ono-theme', next); } catch (e) {}
  onThemeChange();
}
function onThemeChange() {
  syncThemeColor();
  if (state.map && !state.mapFallback) state.map.setStyle(MAP_STYLES[theme()]);
  renderChart(); renderFuelList();
}

/* ═══════════════════════════════════════════════════════════
   MAP
   ═══════════════════════════════════════════════════════════ */
function initMap() {
  if (!window.maplibregl) { $('map').innerHTML = '<div class="empty" style="padding-top:40vh">Mapu se nepodařilo načíst.</div>'; return; }

  const bounds = stationBounds();
  const map = new maplibregl.Map({
    container: 'map',
    style: MAP_STYLES[theme()],
    bounds, fitBoundsOptions: { padding: mapPadding(40) },
    attributionControl: { compact: true },
    dragRotate: false, pitchWithRotate: false, touchPitch: false,
    maxZoom: 18, minZoom: 5,
  });
  map.touchZoomRotate.disableRotation();
  state.map = map;

  const useFallback = () => {
    if (state.mapReady || state.mapFallback) return;
    state.mapFallback = true;
    console.warn('OpenFreeMap unavailable – falling back to OSM raster tiles');
    map.setStyle(FALLBACK_STYLE);
  };
  const fallbackTimer = setTimeout(useFallback, 9000);
  map.on('error', e => { if (!state.mapReady) { console.warn(e && e.error); useFallback(); } });
  map.once('load', () => { state.mapReady = true; clearTimeout(fallbackTimer); });

  STATIONS.forEach(s => {
    const el = document.createElement('div');
    el.className = 'pin';
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', s.label);
    el.innerHTML = '<svg viewBox="0 0 34 42"><path class="pin-body" d="M17 1C8.7 1 2 7.6 2 15.8 2 26.6 17 41 17 41s15-14.4 15-25.2C32 7.6 25.3 1 17 1z"/><circle class="pin-dot" cx="17" cy="15.5" r="5.5"/></svg>';
    el.addEventListener('click', e => { e.stopPropagation(); selectStation(s.id); });
    state.markers[s.id] = new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([s.lng, s.lat]).addTo(map);
  });

  map.on('click', () => { if (state.selectedId) clearSelection(); });
}

function stationBounds(list = STATIONS) {
  const lngs = list.map(s => s.lng), lats = list.map(s => s.lat);
  return [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]];
}

// Map area not covered by UI → MapLibre padding
function mapPadding(extra = 0) {
  const safeT = parseFloat(css('--safe-t-px')) || 0;
  if (isDesktop()) return { top: 90 + extra, bottom: 30 + extra, left: 416 + 30 + extra, right: 70 + extra };
  return { top: 64 + safeT + extra, bottom: state.peek + 10 + extra, left: 20 + extra, right: 20 + extra };
}

function updatePinClasses() {
  for (const [id, m] of Object.entries(state.markers)) {
    const el = m.getElement(), n = +id;
    el.classList.toggle('selected', n === state.selectedId);
    el.classList.toggle('nearest', n === state.nearestId);
    m.getElement().style.zIndex = n === state.selectedId ? 3 : n === state.nearestId ? 2 : 1;
  }
}

function fitAll() {
  clearSelection(true);
  state.map?.fitBounds(stationBounds(), { padding: mapPadding(30), duration: 700 });
}

/* ═══════════════════════════════════════════════════════════
   SELECTION
   ═══════════════════════════════════════════════════════════ */
function selectStation(id, { fly = true } = {}) {
  state.selectedId = id;
  updatePinClasses();
  renderStationCard();
  renderStationList();
  if (!isDesktop()) setExpanded(false);
  const s = stationById(id);
  if (fly && state.map) {
    state.map.flyTo({ center: [s.lng, s.lat], zoom: Math.max(state.map.getZoom(), 11.5), padding: mapPadding(), duration: 900, essential: true });
  }
}

function clearSelection(silent) {
  if (!state.selectedId) return;
  state.selectedId = null;
  updatePinClasses();
  renderStationCard();
  if (!silent) renderStationList();
}

function navigateTo(id) {
  const s = stationById(id); if (!s) return;
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`, '_blank', 'noopener');
}

/* ═══════════════════════════════════════════════════════════
   GEOLOCATION
   ═══════════════════════════════════════════════════════════ */
let geoBusy = false;
function locate({ userAction = false } = {}) {
  if (!navigator.geolocation) { onGeoErr({ code: 0 }, userAction); return; }
  if (geoBusy) return;
  geoBusy = true;
  $('locate-btn').classList.add('locating');
  navigator.geolocation.getCurrentPosition(
    pos => onGeoOk(pos, userAction),
    err => onGeoErr(err, userAction),
    { enableHighAccuracy: false, timeout: 12000, maximumAge: 120000 },
  );
}

function onGeoOk(pos, userAction) {
  geoBusy = false;
  const btn = $('locate-btn'); btn.classList.remove('locating'); btn.classList.add('active');
  state.user = { lat: pos.coords.latitude, lng: pos.coords.longitude };
  state.geoFailed = false;

  let best = null, bestD = Infinity;
  for (const s of STATIONS) { const d = distTo(s); if (d < bestD) { bestD = d; best = s; } }
  state.nearestId = best?.id ?? null;

  if (state.map) {
    if (!state.userMarker) {
      const el = document.createElement('div'); el.className = 'me';
      state.userMarker = new maplibregl.Marker({ element: el }).setLngLat([state.user.lng, state.user.lat]).addTo(state.map);
    } else state.userMarker.setLngLat([state.user.lng, state.user.lat]);
  }

  updatePinClasses();
  renderStationCard();
  renderStationList();

  // Frame user + nearest station
  if (state.map && best && (userAction || !state.selectedId)) {
    const pts = [state.user, best];
    const b = [[Math.min(...pts.map(p => p.lng)), Math.min(...pts.map(p => p.lat))], [Math.max(...pts.map(p => p.lng)), Math.max(...pts.map(p => p.lat))]];
    state.map.fitBounds(b, { padding: mapPadding(50), maxZoom: 13, duration: 1100 });
  }
}

function onGeoErr(err, userAction) {
  geoBusy = false;
  $('locate-btn').classList.remove('locating');
  state.geoFailed = true;
  renderStationCard();
  if (userAction) toast(err && err.code === 1 ? 'Přístup k poloze je zakázaný v prohlížeči' : 'Polohu se nepodařilo zjistit');
}

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */
async function getJson(url) {
  const r = await fetch(url, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return r.json();
}

async function loadData() {
  const [cur, hist] = await Promise.all([
    getJson('data/current.json').catch(e => (console.warn(e), null)),
    getJson('data/history.json').catch(e => (console.warn(e), null)),
  ]);

  const series = (hist?.prices || []).map(p => {
    const row = { date: p.d };
    for (const f of FUELS) row[f.k] = num(p[f.s]);
    return row;
  }).filter(r => r.date).sort((a, b) => a.date.localeCompare(b.date));

  let current = null;
  if (cur?.prices) {
    const prices = {};
    for (const f of FUELS) prices[f.k] = num(cur.prices[f.k]);
    if (prices.natural95 || prices.diesel || prices.lpg) {
      current = { prices, validFrom: parseValidity(cur.validity), updated: cur.updated ? new Date(cur.updated) : null };
    }
  }
  if (!current && series.length) {
    const last = series[series.length - 1], src = hist.prices[hist.prices.length - 1];
    current = { prices: Object.fromEntries(FUELS.map(f => [f.k, last[f.k]])), validFrom: parseValidity(src.vf), updated: hist.updated ? new Date(hist.updated) : null };
  }

  // Make the series end with the current price "today"
  if (current) {
    const today = isoLocal(new Date());
    const row = { date: today, ...current.prices };
    const last = series[series.length - 1];
    if (last && last.date === today) series[series.length - 1] = row;
    else if (!last || last.date < today) series.push(row);
  }

  state.current = current;
  state.series = series;
  state.loadError = !current;
  state.dataUpdated = current?.updated || (hist?.updated ? new Date(hist.updated) : null);
}

// Delta vs. the previous different price, and since when the current one holds
function lastChange(key) {
  const s = state.series;
  const cur = state.current?.prices[key];
  if (cur == null) return null;
  for (let i = s.length - 1; i >= 0; i--) {
    const v = s[i][key];
    if (v != null && Math.abs(v - cur) > 0.001) {
      let since = s[i + 1]?.date || null;
      // Snapshots are taken at noon; prefer the exact price-list start if it falls in that gap
      const vf = state.current.validFrom;
      if (since && vf) {
        const vfIso = isoLocal(vf);
        if (vfIso <= since && vf > parseIso(s[i].date)) since = vfIso;
      }
      return { diff: cur - v, since };
    }
  }
  return { diff: 0, since: null };
}

function rangeRows(days = state.range) {
  const cut = new Date(); cut.setDate(cut.getDate() - days);
  const c = isoLocal(cut);
  return state.series.filter(r => r.date >= c);
}

/* ═══════════════════════════════════════════════════════════
   RENDER — sheet top
   ═══════════════════════════════════════════════════════════ */
function renderStationCard() {
  const el = $('station-card');
  const id = state.selectedId || state.nearestId;
  const s = id && stationById(id);

  if (!s) {
    const text = state.geoFailed ? 'Vybrat stanici ze seznamu' : 'Najít nejbližší stanici';
    el.innerHTML = `<button class="st-prompt" id="st-prompt" type="button">${state.geoFailed ? ICON.pump : ICON.pin}<span>${text}</span></button>`;
    $('st-prompt').onclick = () => {
      if (state.geoFailed) { switchTab('stations'); setExpanded(true); }
      else locate({ userAction: true });
    };
    return;
  }

  const isSel = !!state.selectedId, isNear = s.id === state.nearestId;
  const d = distTo(s);
  const sub = [
    isNear ? '<span class="tag">Nejbližší</span>' : (d == null ? 'Vybraná stanice' : ''),
    d != null ? `<span>${fmtDist(d)} od vás</span>` : '',
  ].filter(Boolean).join('<span>·</span>');

  el.innerHTML = `<div class="st ${isNear ? 'is-nearest' : ''}">
      <div class="st-ico">${ICON.pump}</div>
      <button class="st-main" type="button" id="st-focus" style="text-align:left">
        <div class="st-name">${esc(s.label)}</div>
        <div class="st-sub">${sub}</div>
      </button>
      <button class="btn-nav" type="button" id="st-nav">${ICON.nav}Trasa</button>
      ${isSel ? '<button class="btn-x" type="button" id="st-close" aria-label="Zavřít">×</button>' : ''}
    </div>`;
  $('st-nav').onclick = () => navigateTo(s.id);
  $('st-focus').onclick = () => selectStation(s.id);
  if (isSel) $('st-close').onclick = () => clearSelection();
}

function renderHero() {
  const el = $('hero-prices');
  if (state.loadError) {
    el.innerHTML = '<div class="price-error">Ceny se nepodařilo načíst. Zkuste to prosím později.</div>';
    $('validity').textContent = '';
    return;
  }
  el.innerHTML = FUELS.filter(f => f.primary).map(f => {
    const p = state.current.prices[f.k];
    const ch = lastChange(f.k);
    const delta = ch && ch.diff !== 0
      ? `<span class="delta ${trendCls(ch.diff)}">${arrow(ch.diff)} ${fmtDelta(ch.diff).replace(/^[+−]/, '')}</span>`
      : '<span class="delta flat">beze změny</span>';
    return `<button class="hero-card ${f.k === state.fuel && !state.compare ? 'active' : ''}" data-fuel="${f.k}" style="--fc:var(${f.c})" type="button"
        aria-label="${f.label} ${fmtPrice(p)} Kč, zobrazit graf">
      <div class="hero-label"><span class="dot"></span>${f.label}</div>
      <div class="hero-price">${fmtPrice(p)}<small>Kč</small></div>
      ${delta}
    </button>`;
  }).join('');

  const vf = state.current.validFrom;
  $('validity').textContent = vf ? `platí od ${vf.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' })} ${vf.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}` : '';
}

/* ═══════════════════════════════════════════════════════════
   RENDER — trend tab
   ═══════════════════════════════════════════════════════════ */
function setChartHeader(hoverIdx = null) {
  const rows = rangeRows();
  const f = FUEL[state.fuel];

  if (state.compare) {
    const prim = FUELS.filter(x => x.primary);
    const row = hoverIdx != null ? rows[hoverIdx] : rows[rows.length - 1];
    $('chart-fuel').innerHTML = 'Porovnání hlavních paliv';
    $('chart-value').innerHTML = `<div class="chart-legend">${prim.map(x =>
      `<span><span class="dot" style="--fc:var(${x.c})"></span>${x.label} <b class="num">${fmtPrice(row?.[x.k])}</b></span>`).join('')}</div>`;
    $('chart-value').style.fontSize = '0';
    $('chart-sub').innerHTML = row ? (hoverIdx != null ? fmtDay(row.date, { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric' }) : 'Aktuální ceny v Kč/l') : '&nbsp;';
    return;
  }

  $('chart-value').style.fontSize = '';
  $('chart-fuel').innerHTML = `<span class="dot" style="--fc:var(${f.c})"></span>${f.label}`;
  const vals = rows.filter(r => r[f.k] != null);
  if (!vals.length) { $('chart-value').textContent = '–'; $('chart-sub').innerHTML = 'Bez dat'; return; }

  if (hoverIdx != null && rows[hoverIdx]?.[f.k] != null) {
    const r = rows[hoverIdx];
    $('chart-value').innerHTML = `${fmtPrice(r[f.k])}<small>Kč/l</small>`;
    $('chart-sub').innerHTML = `<span>${fmtDay(r.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>`;
    return;
  }
  const first = vals[0][f.k], last = vals[vals.length - 1][f.k];
  const d = last - first, pct = first ? d / first * 100 : 0;
  $('chart-value').innerHTML = `${fmtPrice(last)}<small>Kč/l</small>`;
  $('chart-sub').innerHTML = `<span class="${trendCls(d)}">${arrow(d)} ${fmtDelta(d)} Kč (${fmtPct(pct)})</span> <span class="muted">${RANGE_LABEL[state.range]}</span>`;
}

// Vertical crosshair while scrubbing
const crosshair = {
  id: 'crosshair',
  afterDatasetsDraw(chart) {
    const a = chart.tooltip?.getActiveElements?.() || [];
    if (!a.length) return;
    const x = a[0].element.x, { top, bottom } = chart.chartArea, ctx = chart.ctx;
    ctx.save();
    ctx.strokeStyle = css('--line-2'); ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    ctx.restore();
  },
};

function renderChart() {
  if (!window.Chart || !state.series.length) return;
  const rows = rangeRows();
  const canvas = $('chart');
  const keys = state.compare ? FUELS.filter(f => f.primary).map(f => f.k) : [state.fuel];
  const text3 = css('--text-3'), line = css('--line'), surface = css('--surface-2');

  const datasets = keys.map(k => {
    const color = css(FUEL[k].c);
    const single = !state.compare;
    return {
      label: FUEL[k].label,
      data: rows.map(r => r[k]),
      borderColor: color,
      borderWidth: 2.25,
      stepped: 'after',
      spanGaps: true,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: surface,
      fill: single ? 'start' : false,
      backgroundColor: single ? (ctx => {
        const { chart } = ctx; const area = chart.chartArea;
        if (!area) return 'transparent';
        const g = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom);
        g.addColorStop(0, color + '55'); g.addColorStop(1, color + '00');
        return g;
      }) : 'transparent',
    };
  });

  const labels = rows.map(r => r.date);
  const all = datasets.flatMap(d => d.data).filter(v => v != null);
  const min = Math.min(...all), max = Math.max(...all);
  const pad = Math.max((max - min) * 0.15, 0.3);

  if (state.chart) state.chart.destroy();
  state.chart = new Chart(canvas, {
    type: 'line',
    data: { labels, datasets },
    plugins: [crosshair],
    options: {
      responsive: true, maintainAspectRatio: false, animation: { duration: 450, easing: 'easeOutCubic' },
      layout: { padding: { top: 6, right: 4 } },
      interaction: { mode: 'index', intersect: false },
      events: ['mousemove', 'mouseout', 'touchstart', 'touchmove', 'touchend'],
      onHover: (e, els) => {
        const idx = (els.length && e.type !== 'mouseout' && e.type !== 'touchend') ? els[0].index : null;
        setChartHeader(idx);
        if (idx == null) { chartClearActive(); }
      },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: {
          grid: { display: false }, border: { display: false },
          ticks: {
            color: text3, font: { size: 11, weight: '500' }, maxRotation: 0, autoSkip: true, maxTicksLimit: 5,
            callback: (v, i) => fmtDay(labels[i]),
          },
        },
        y: {
          position: 'right', min: Math.floor(min - pad), max: Math.ceil(max + pad),
          grid: { color: line, drawTicks: false }, border: { display: false },
          ticks: { color: text3, font: { size: 11, weight: '500' }, maxTicksLimit: 5, padding: 8,
            callback: v => (Number.isInteger(v) ? v : v.toFixed(1).replace('.', ',')) },
        },
      },
    },
  });
  setChartHeader();
  renderStats(rows);
}

function chartClearActive() {
  const c = state.chart; if (!c) return;
  c.setActiveElements([]); c.tooltip.setActiveElements([], { x: 0, y: 0 }); c.update('none');
}

function renderStats(rows) {
  const el = $('stats');
  if (state.compare) { el.innerHTML = ''; el.classList.add('hidden'); return; }
  el.classList.remove('hidden');
  const k = state.fuel;
  const v = rows.map(r => r[k]).filter(x => x != null);
  if (!v.length) { el.innerHTML = ''; return; }
  let changes = 0; for (let i = 1; i < v.length; i++) if (Math.abs(v[i] - v[i - 1]) > 0.001) changes++;
  const avg = v.reduce((a, b) => a + b, 0) / v.length;
  const tiles = [['Minimum', fmtPrice(Math.min(...v))], ['Maximum', fmtPrice(Math.max(...v))], ['Průměr', fmtPrice(avg)], ['Změn', String(changes)]];
  el.innerHTML = tiles.map(([l, val]) => `<div class="stat"><div class="stat-l">${l}</div><div class="stat-v">${val}</div></div>`).join('');
}

function sparkline(key, color) {
  const v = rangeRows(30).map(r => r[key]).filter(x => x != null);
  if (v.length < 2) return '<svg class="fr-spark"></svg>';
  const W = 64, H = 26, P = 2;
  const min = Math.min(...v), max = Math.max(...v), span = max - min || 1;
  const x = i => P + i * (W - 2 * P) / (v.length - 1);
  const y = n => max === min ? H / 2 : P + (H - 2 * P) * (1 - (n - min) / span);
  let d = `M${x(0).toFixed(1)} ${y(v[0]).toFixed(1)}`;
  for (let i = 1; i < v.length; i++) d += `H${x(i).toFixed(1)}V${y(v[i]).toFixed(1)}`;
  return `<svg class="fr-spark" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="${d}" fill="none" stroke="${color}" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}

function renderFuelList() {
  const el = $('fuel-list');
  if (!state.current) { el.innerHTML = '<div class="empty">Data nejsou k dispozici</div>'; return; }
  el.innerHTML = FUELS.filter(f => state.current.prices[f.k] != null).map(f => {
    const ch = lastChange(f.k);
    const deltaTxt = ch && ch.diff !== 0
      ? `${arrow(ch.diff)} ${fmtDelta(ch.diff)}${ch.since ? ` · ${fmtDay(ch.since)}` : ''}`
      : 'beze změny';
    return `<button class="fuel-row ${f.k === state.fuel && !state.compare ? 'active' : ''}" data-fuel="${f.k}" style="--fc:var(${f.c})" type="button">
      <span class="fr-name"><span class="dot"></span><span>${f.label}</span></span>
      ${sparkline(f.k, css(f.c))}
      <span class="fr-right">
        <div class="fr-price">${fmtPrice(state.current.prices[f.k])}<small>Kč</small></div>
        <div class="fr-delta ${trendCls(ch?.diff || 0)}">${deltaTxt}</div>
      </span>
    </button>`;
  }).join('');

  const upd = state.dataUpdated;
  $('data-note').innerHTML = `Ceny jsou stejné na všech stanicích Tank ONO. Změna ceny se porovnává s předchozí cenou. ` +
    `Zdroj: <a href="https://tank-ono.cz" target="_blank" rel="noopener">tank-ono.cz</a>` +
    (upd ? ` · aktualizováno ${upd.toLocaleDateString('cs-CZ')} ${upd.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}` : '');
}

function selectFuel(k, { scroll = false } = {}) {
  state.fuel = k; state.compare = false;
  $('compare-btn').setAttribute('aria-pressed', 'false');
  renderHero(); renderFuelList(); renderChart();
  if (scroll) {
    const body = isDesktop() ? $('sheet') : $('sheet-body');
    body.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ═══════════════════════════════════════════════════════════
   RENDER — stations tab
   ═══════════════════════════════════════════════════════════ */
function renderStationList() {
  const q = norm(state.query.trim());
  let list = STATIONS.map(s => ({ s, d: distTo(s) }));
  if (q) list = list.filter(x => x.s.key.includes(q));
  if (state.user) list.sort((a, b) => a.d - b.d);
  else list.sort((a, b) => a.s.label.localeCompare(b.s.label, 'cs'));

  $('st-count').textContent = STATIONS.length;
  const el = $('station-list');
  if (!list.length) { el.innerHTML = `<div class="empty">Žádná stanice pro „${esc(state.query)}“</div>`; return; }
  el.innerHTML = list.map(({ s, d }) => {
    const near = s.id === state.nearestId;
    return `<button class="srow ${near ? 'nearest' : ''} ${s.id === state.selectedId ? 'active' : ''}" data-id="${s.id}" type="button">
      <span class="srow-ico">${ICON.pump}</span>
      <span class="srow-main">
        <div class="srow-name">${esc(s.label)}</div>
        <div class="srow-sub">${near ? '<b>Nejbližší</b> · ' : ''}Tank ONO</div>
      </span>
      ${d != null ? `<span class="srow-dist">${fmtDist(d)}</span>` : ''}
      <span class="srow-chev">${ICON.chev}</span>
    </button>`;
  }).join('');
}

function switchTab(tab) {
  state.tab = tab;
  document.querySelectorAll('.seg-btn').forEach(b => {
    const on = b.dataset.tab === tab; b.classList.toggle('active', on); b.setAttribute('aria-selected', on);
  });
  $('tab-trend').classList.toggle('hidden', tab !== 'trend');
  $('tab-stations').classList.toggle('hidden', tab !== 'stations');
  if (tab === 'trend') state.chart?.resize();
}

/* ═══════════════════════════════════════════════════════════
   BOTTOM SHEET (mobile)
   ═══════════════════════════════════════════════════════════ */
function setExpanded(on) {
  if (isDesktop()) on = false;
  state.expanded = on;
  document.body.classList.toggle('sheet-expanded', on);
  if (!on) $('sheet-body').scrollTop = 0;
}

function measurePeek() {
  const safeB = parseFloat(css('--safe-b-px')) || 0;
  state.peek = isDesktop() ? 0 : Math.round($('sheet-top').offsetHeight + safeB);
  document.documentElement.style.setProperty('--peek', state.peek + 'px');
  state.map?.resize();
}

function initSheetGestures() {
  const sheet = $('sheet'), top = $('sheet-top'), body = $('sheet-body');
  let startY = 0, startT = 0, lastY = 0, lastTime = 0, vel = 0, dragging = false, moved = false, pid = null;

  const maxT = () => sheet.offsetHeight - state.peek;
  const begin = y => {
    startY = lastY = y; lastTime = performance.now(); vel = 0; moved = false;
    startT = state.expanded ? 0 : maxT();
  };
  const move = y => {
    const dy = y - startY;
    if (!moved && Math.abs(dy) < 6) return false;
    if (!moved) { moved = true; sheet.classList.add('dragging'); }
    const now = performance.now();
    vel = (y - lastY) / Math.max(1, now - lastTime); lastY = y; lastTime = now;
    let t = startT + dy;
    if (t < 0) t = t / 3;                 // rubber band at the top
    t = Math.min(t, maxT() + 40);
    sheet.style.transform = `translateY(${t}px)`;
    return true;
  };
  const end = () => {
    sheet.classList.remove('dragging');
    if (!moved) return;
    const t = startT + (lastY - startY);
    let open = Math.abs(vel) > 0.45 ? vel < 0 : t < maxT() / 2;
    sheet.style.transform = '';
    setExpanded(open);
  };

  // Drag handle area (pointer events)
  top.addEventListener('pointerdown', e => {
    if (isDesktop() || (e.pointerType === 'mouse' && e.button !== 0)) return;
    dragging = true; pid = e.pointerId; begin(e.clientY);
  });
  window.addEventListener('pointermove', e => {
    if (!dragging || e.pointerId !== pid) return;
    if (move(e.clientY) && !top.hasPointerCapture(pid)) { try { top.setPointerCapture(pid); } catch (_) {} }
  });
  const up = e => {
    if (!dragging || e.pointerId !== pid) return;
    dragging = false; end();
    if (!moved && e.target.closest('.grabber')) setExpanded(!state.expanded);
  };
  window.addEventListener('pointerup', up);
  window.addEventListener('pointercancel', up);
  // Swallow the click that follows a drag
  top.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  // Tap empty area of the handle zone toggles
  top.addEventListener('click', e => {
    if (isDesktop() || e.target.closest('button')) return;
    if (e.target === top || e.target.closest('.prices-head')) setExpanded(!state.expanded);
  });

  // Expanded: pull down from the top of the content collapses the sheet.
  // Collapsed: any swipe on the visible part of the body opens it.
  let bodyDrag = false, bodyStart = 0;
  body.addEventListener('touchstart', e => {
    if (isDesktop() || dragging) return;
    if (state.expanded && (body.scrollTop > 0 || e.target.closest('canvas'))) { bodyDrag = false; return; }
    bodyStart = e.touches[0].clientY; bodyDrag = true;
    begin(bodyStart);
  }, { passive: true });
  body.addEventListener('touchmove', e => {
    if (!bodyDrag) return;
    const y = e.touches[0].clientY;
    if (state.expanded && !moved && y < bodyStart) { bodyDrag = false; return; }   // scrolling content up
    if (move(y)) e.preventDefault();
  }, { passive: false });
  const bodyEnd = () => { if (bodyDrag) { bodyDrag = false; end(); setTimeout(() => { moved = false; }, 0); } };
  body.addEventListener('touchend', bodyEnd);
  body.addEventListener('touchcancel', bodyEnd);
}

/* ═══════════════════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════════════════ */
function bindUI() {
  $('theme-btn').onclick = toggleTheme;
  $('locate-btn').onclick = () => locate({ userAction: true });
  $('fit-btn').onclick = fitAll;

  $('hero-prices').addEventListener('click', e => {
    const b = e.target.closest('[data-fuel]'); if (!b) return;
    selectFuel(b.dataset.fuel);
    switchTab('trend');
    setExpanded(true);
  });
  $('fuel-list').addEventListener('click', e => {
    const b = e.target.closest('[data-fuel]'); if (b) selectFuel(b.dataset.fuel, { scroll: true });
  });
  $('station-list').addEventListener('click', e => {
    const b = e.target.closest('[data-id]'); if (b) selectStation(+b.dataset.id);
  });
  document.querySelectorAll('.seg-btn').forEach(b => b.onclick = () => { switchTab(b.dataset.tab); setExpanded(true); });
  $('ranges').addEventListener('click', e => {
    const b = e.target.closest('[data-range]'); if (!b) return;
    state.range = +b.dataset.range;
    $('ranges').querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
    renderChart();
  });
  $('compare-btn').onclick = () => {
    state.compare = !state.compare;
    $('compare-btn').setAttribute('aria-pressed', String(state.compare));
    renderHero(); renderFuelList(); renderChart();
  };
  $('search').addEventListener('input', e => { state.query = e.target.value; renderStationList(); });
  $('search').addEventListener('focus', () => setExpanded(true));

  darkMQ.addEventListener?.('change', () => { if (!document.documentElement.dataset.theme) onThemeChange(); });

  new ResizeObserver(measurePeek).observe($('sheet-top'));
  let wasDesktop = isDesktop();
  window.addEventListener('resize', () => {
    const d = isDesktop();
    if (d !== wasDesktop) { wasDesktop = d; setExpanded(false); measurePeek(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (state.expanded) setExpanded(false); else clearSelection(); } });
}

async function boot() {
  // expose safe-area insets to JS
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;visibility:hidden;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)';
  document.body.appendChild(probe);
  const ps = getComputedStyle(probe);
  document.documentElement.style.setProperty('--safe-t-px', ps.paddingTop);
  document.documentElement.style.setProperty('--safe-b-px', ps.paddingBottom);
  probe.remove();

  syncThemeColor();
  bindUI();
  initSheetGestures();
  renderStationCard();
  renderStationList();
  measurePeek();
  initMap();
  locate();

  await loadData();
  renderHero();
  renderFuelList();
  renderChart();
}

document.addEventListener('DOMContentLoaded', boot);
