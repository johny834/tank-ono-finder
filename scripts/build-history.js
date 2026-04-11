#!/usr/bin/env node
/**
 * Fetches Tank ONO price history for the last 180 days,
 * deduplicates by validity period, and writes data/history.json.
 *
 * Run: node scripts/build-history.js
 */

const fs = require('fs');
const path = require('path');

const API = 'https://tank-ono.cz/cz/index.php?page=archiv';
const DAYS = 180;
const STEP = 1;           // every day (dedup removes duplicates anyway)
const CONCURRENCY = 5;    // parallel requests
const DELAY_MS = 500;     // delay between batches (respectful)

async function fetchDay(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const body = `txtDate=${dd}/${mm}/${yyyy}&hod=12&min=00`;

  const resp = await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (compatible; TankONOFinder/1.0)',
      'Accept': 'text/html',
    },
    body,
  });
  if (!resp.ok) return null;
  const html = await resp.text();
  return parseHTML(html, `${yyyy}-${mm}-${dd}`);
}

function parseHTML(html, isoDate) {
  // Validity
  const vm = html.match(/platnost\s+od:\s*([\d/: ]+)\s+do:\s*([\d/: ]+)/i);
  const validFrom = vm ? vm[1].trim() : '';
  const validTo = vm ? vm[2].trim() : '';

  // Find price table
  const tableMatch = html.match(/<table[^>]*class="cenik"[^>]*>([\s\S]*?)<\/table>/i);
  if (!tableMatch) return null;
  const tableHTML = tableMatch[0];

  // Find CZK/Kč row
  const rows = tableHTML.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
  if (!rows) return null;

  let cells = null;
  for (const row of rows) {
    const tds = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/&nbsp;/g, '').replace(/<[^>]+>/g, '').trim());
    if (!tds.length) continue;
    if (/^K[čc]$/i.test(tds[0]) || /^CZK$/i.test(tds[0])) { cells = tds; break; }
  }

  if (!cells) {
    for (const row of rows) {
      const tds = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1].replace(/&nbsp;/g, '').replace(/<[^>]+>/g, '').trim());
      if (tds.length >= 9) { cells = tds; break; }
    }
  }

  if (!cells || cells.length < 9) return null;

  const get = i => {
    if (i >= cells.length) return null;
    const v = cells[i].replace(/\s+/g, '').trim();
    return (!v || v === '–' || v === '-' || v === ',') ? null : v;
  };

  const entry = {
    d: isoDate,
    vf: validFrom,
    vt: validTo,
    n95: get(2),
    n95p: get(3),
    n98: get(4),
    die: get(6),
    diep: get(8),
    adb: get(9),
    lpg: get(10),
  };

  // Skip if all prices null
  if (!entry.n95 && !entry.die && !entry.lpg) return null;
  return entry;
}

async function runBatch(dates) {
  return Promise.all(dates.map(d => fetchDay(d).catch(() => null)));
}

function readJsonIfExists(file) {
  if (!fs.existsSync(file)) return null;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

function isValidHistorySnapshot(data) {
  return !!(data && Array.isArray(data.prices) && data.prices.length > 0);
}

async function main() {
  const now = new Date();
  const allDates = [];
  for (let i = DAYS; i >= 0; i -= STEP) {
    const dt = new Date(now);
    dt.setDate(dt.getDate() - i);
    allDates.push(dt);
  }

  console.log(`Fetching ${allDates.length} days (concurrency=${CONCURRENCY})...`);
  const results = [];

  for (let i = 0; i < allDates.length; i += CONCURRENCY) {
    const batch = allDates.slice(i, i + CONCURRENCY);
    const batchResults = await runBatch(batch);
    batchResults.forEach(r => { if (r) results.push(r); });
    const pct = Math.round((i + batch.length) / allDates.length * 100);
    process.stdout.write(`\r  ${pct}% (${results.length} data points)`);
    if (i + CONCURRENCY < allDates.length) await new Promise(r => setTimeout(r, DELAY_MS));
  }

  console.log(`\nFetched ${results.length} raw data points.`);

  // Deduplicate by validity period
  const deduped = [];
  const seen = new Set();
  for (const r of results) {
    const key = r.vf || `${r.d}:${r.n95}:${r.die}:${r.lpg}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(r);
  }

  console.log(`Deduplicated to ${deduped.length} unique price periods.`);

  const outDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, 'history.json');
  const fallbackFile = path.join(outDir, 'history-last-valid.json');
  const previous = readJsonIfExists(outFile);
  const lastValid = readJsonIfExists(fallbackFile);

  let output;
  if (deduped.length > 0) {
    output = {
      updated: new Date().toISOString(),
      days: DAYS,
      count: deduped.length,
      prices: deduped,
    };
    fs.writeFileSync(outFile, JSON.stringify(output));
    fs.writeFileSync(fallbackFile, JSON.stringify(output));
    console.log(`Written fresh history to ${outFile} (${(fs.statSync(outFile).size / 1024).toFixed(1)} KB)`);
    console.log(`Updated fallback snapshot ${fallbackFile}`);
    return;
  }

  if (isValidHistorySnapshot(previous)) {
    output = {
      ...previous,
      updated: previous.updated || new Date().toISOString(),
      fallbackUsed: 'history.json',
      fallbackReason: 'build returned no valid price points',
    };
    fs.writeFileSync(outFile, JSON.stringify(output));
    console.log('No valid fresh data, kept existing history.json as fallback.');
    return;
  }

  if (isValidHistorySnapshot(lastValid)) {
    output = {
      ...lastValid,
      updated: lastValid.updated || new Date().toISOString(),
      fallbackUsed: 'history-last-valid.json',
      fallbackReason: 'build returned no valid price points',
    };
    fs.writeFileSync(outFile, JSON.stringify(output));
    console.log('No valid fresh data, restored last valid snapshot to history.json.');
    return;
  }

  throw new Error('No valid fresh history and no valid fallback snapshot available.');
}

main().catch(e => { console.error(e); process.exit(1); });
