#!/usr/bin/env node
/* Archive all four GitHub traffic endpoints. Node 20+, no dependencies.
 * Authentication stays in GH_TOKEN; the browser only reads summary.json.
 */
'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const REPOSITORY = 'T-Julsgaard/Chess-Review';
const OUTPUT = path.join(__dirname, '..', 'data', 'traffic', 'chess-review');
const ENDPOINTS = {
  views: 'views?per=day',
  clones: 'clones?per=day',
  referrers: 'popular/referrers',
  paths: 'popular/paths',
};

function counts(value) {
  return value && Number.isSafeInteger(value.count) && value.count >= 0 &&
    Number.isSafeInteger(value.uniques) && value.uniques >= 0 && value.uniques <= value.count;
}

function validateTraffic(data) {
  for (const name of ['views', 'clones']) {
    const value = data[name];
    if (!counts(value) || !Array.isArray(value[name]) || value[name].length > 14)
      throw new Error('Invalid ' + name + ' response.');
    const dates = new Set();
    for (const day of value[name]) {
      if (!counts(day) || typeof day.timestamp !== 'string' ||
          !/^\d{4}-\d{2}-\d{2}T00:00:00Z$/.test(day.timestamp) ||
          !Number.isFinite(Date.parse(day.timestamp)) || dates.has(day.timestamp))
        throw new Error('Invalid daily ' + name + ' record.');
      dates.add(day.timestamp);
    }
  }
  for (const name of ['referrers', 'paths']) {
    const rows = data[name], key = name === 'paths' ? 'path' : 'referrer';
    if (!Array.isArray(rows) || rows.length > 10 || rows.some(row =>
      !counts(row) || typeof row[key] !== 'string' ||
      (name === 'paths' && typeof row.title !== 'string')))
      throw new Error('Invalid ' + name + ' response.');
  }
}

async function readHistory(file) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

async function writeJSON(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temporary = file + '.' + process.pid + '.tmp';
  try {
    await fs.writeFile(temporary, JSON.stringify(value, null, 2) + '\n', 'utf8');
    await fs.rename(temporary, file);
  } finally { await fs.rm(temporary, { force: true }); }
}

function summarizeHistory(history) {
  const totals = {};
  for (const name of ['views', 'clones']) {
    const entries = Object.entries(history.days).filter(([, day]) => day[name] !== undefined)
      .sort(([a], [b]) => a.localeCompare(b));
    let count = 0;
    for (const [date, day] of entries) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || !counts(day[name]))
        throw new Error('Invalid archived daily ' + name + ' record.');
      count += day[name].count;
      if (!Number.isSafeInteger(count)) throw new Error('Archived ' + name + ' total exceeds safe integer range.');
    }
    const from = entries.length ? entries[0][0] : null;
    const through = entries.length ? entries[entries.length - 1][0] : null;
    const span = entries.length ? Math.round((Date.parse(through) - Date.parse(from)) / 86400000) + 1 : 0;
    // These are event totals. Daily unique people cannot be deduplicated across dates.
    totals[name] = { count, from, through, recordedDays: entries.length, missingDays: span - entries.length };
  }
  return totals;
}

async function collectTraffic(options = {}) {
  const token = options.token || process.env.GH_TOKEN;
  if (!token) throw new Error('GH_TOKEN is missing. Set the TRAFFIC_TOKEN Actions secret (Administration: read on Chess-Review).');
  const fetchImpl = options.fetchImpl || fetch;
  const output = options.output || OUTPUT;
  // Read and validate everything before any writes: failed calls never replace good data.
  const pairs = await Promise.all(Object.entries(ENDPOINTS).map(async ([name, endpoint]) => {
    const response = await fetchImpl('https://api.github.com/repos/' + REPOSITORY + '/traffic/' + endpoint, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: 'Bearer ' + token,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'portfolio-traffic-archive',
      },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(name + ' endpoint returned HTTP ' + response.status + '. Check token permissions/expiry and API limits.');
    return [name, await response.json()];
  }));
  const data = Object.fromEntries(pairs);
  validateTraffic(data);
  const generatedAt = (options.now || new Date()).toISOString();
  const historyFile = path.join(output, 'history.json');
  const history = await readHistory(historyFile) || {
    schemaVersion: 1, repository: REPOSITORY, firstCollectedAt: generatedAt, days: {},
  };
  if (history.schemaVersion !== 1 || history.repository !== REPOSITORY ||
      !history.days || typeof history.days !== 'object' || Array.isArray(history.days))
    throw new Error('Existing history has an unexpected schema/repository. Refusing to overwrite it.');
  for (const name of ['views', 'clones']) {
    for (const day of data[name][name]) {
      const date = day.timestamp.slice(0, 10);
      history.days[date] = history.days[date] || {};
      // Replace overlapping observations rather than adding their rolling totals.
      history.days[date][name] = { count: day.count, uniques: day.uniques, observedAt: generatedAt };
    }
  }
  history.days = Object.fromEntries(Object.entries(history.days).sort(([a], [b]) => a.localeCompare(b)));
  history.lastCollectedAt = generatedAt;
  const snapshot = { schemaVersion: 1, repository: REPOSITORY, generatedAt, windowDays: 14, ...data };
  const summary = {
    schemaVersion: 1, repository: REPOSITORY, generatedAt, windowDays: 14,
    views: { count: data.views.count, uniques: data.views.uniques },
    clones: { count: data.clones.count, uniques: data.clones.uniques },
    totals: summarizeHistory(history),
  };
  const filename = generatedAt.replace(/:/g, '-') + '.json';
  await writeJSON(path.join(output, 'snapshots', generatedAt.slice(0, 4), filename), snapshot);
  await writeJSON(historyFile, history);
  await writeJSON(path.join(output, 'summary.json'), summary);
  return summary;
}

module.exports = { collectTraffic, validateTraffic, summarizeHistory };
if (require.main === module) {
  collectTraffic().then(summary => {
    console.log('Archived traffic for ' + summary.repository + ' at ' + summary.generatedAt + '.');
  }).catch(() => {
    // Do not log request/error objects: third-party errors could contain credentials.
    console.error('fetch-traffic: collection failed. Check GH_TOKEN / TRAFFIC_TOKEN, repository Administration: read access, API availability, and archive file validity. Existing published data is retained on API failures.');
    process.exitCode = 1;
  });
}
