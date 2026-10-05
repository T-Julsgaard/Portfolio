'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { collectTraffic, summarizeTrends } = require('./fetch-traffic');

function fixture(count = 4) {
  const day = { timestamp: '2026-10-04T00:00:00Z', count, uniques: Math.min(2, count) };
  return {
    views: { count, uniques: day.uniques, views: [day] },
    clones: { count, uniques: day.uniques, clones: [day] },
    referrers: [{ referrer: 'example.com', count: 3, uniques: 2 }],
    paths: [{ path: '/T-Julsgaard/Chess-Review', title: 'Chess Review', count: 4, uniques: 2 }],
  };
}
function mockFetch(data, failure) {
  return async (url, options) => {
    assert.equal(options.headers.Authorization, 'Bearer test-secret');
    const endpoint = url.split('/traffic/')[1].split('?')[0];
    const name = endpoint.split('/').pop();
    return { ok: name !== failure, status: name === failure ? 403 : 200, json: async () => structuredClone(data[name]) };
  };
}
async function temporary(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'portfolio-traffic-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  return path.join(dir, 'archive');
}
function collect(output, data, now, failure) {
  return collectTraffic({ output, token: 'test-secret', fetchImpl: mockFetch(data, failure), now: new Date(now) });
}
async function json(output, name) { return JSON.parse(await fs.readFile(path.join(output, name), 'utf8')); }

test('archives all raw endpoints and preserves rolling unique totals without storing credentials', async t => {
  const output = await temporary(t), data = fixture();
  data.views.futureApiField = { retained: true };
  const summary = await collect(output, data, '2026-10-05T03:37:00Z');
  const snapshot = await json(output, 'snapshots/2026/2026-10-05T03-37-00.000Z.json');
  for (const name of Object.keys(data)) assert.deepEqual(snapshot[name], data[name]);
  assert.deepEqual(summary.clones, { count: 4, uniques: 2 });
  assert.equal(JSON.stringify(snapshot).includes('test-secret'), false);
  assert.equal((await json(output, 'history.json')).days['2026-10-04'].clones.count, 4);
  assert.deepEqual(summary.totals.clones, { count: 4, from: '2026-10-04', through: '2026-10-04', recordedDays: 1, missingDays: 0 });
  assert.equal('uniques' in summary.totals.clones, false);
});

test('overlapping dates replace observations, zero is valid, and older dates survive gaps', async t => {
  const output = await temporary(t);
  await collect(output, fixture(), '2026-10-05T03:37:00Z');
  await collect(output, fixture(7), '2026-10-06T03:37:00Z');
  let history = await json(output, 'history.json');
  assert.equal(history.days['2026-10-04'].clones.count, 7); // Not 4 + 7.
  await collect(output, fixture(0), '2026-10-07T03:37:00Z');
  assert.equal((await json(output, 'history.json')).days['2026-10-04'].clones.count, 0);
  const later = fixture(3);
  later.views.views[0].timestamp = later.clones.clones[0].timestamp = '2026-10-24T00:00:00Z';
  await collect(output, later, '2026-10-25T03:37:00Z');
  history = await json(output, 'history.json');
  assert.equal(history.firstCollectedAt, '2026-10-05T03:37:00.000Z');
  assert.deepEqual(Object.keys(history.days), ['2026-10-04', '2026-10-24']); // Unknown days are not fabricated as zero.
  assert.equal((await fs.readdir(path.join(output, 'snapshots/2026'))).length, 4);
  const summary = await json(output, 'summary.json');
  assert.equal(summary.totals.views.count, 3);
  assert.equal(summary.totals.clones.count, 3);
  assert.equal(summary.totals.clones.recordedDays, 2);
  assert.equal(summary.totals.clones.missingDays, 19);
});

test('totals grow beyond the 14-day window without counting overlapping days twice', async t => {
  const output = await temporary(t);
  function windowEnding(end) {
    const data = fixture();
    for (const name of ['views', 'clones']) {
      data[name][name] = Array.from({ length: 14 }, (_, i) => ({
        timestamp: new Date(Date.parse(end) - (13 - i) * 86400000).toISOString().replace('.000', ''),
        count: name === 'views' ? 3 : 2, uniques: 1,
      }));
      data[name].count = name === 'views' ? 42 : 28;
      data[name].uniques = 5;
    }
    return data;
  }
  await collect(output, windowEnding('2026-10-04'), '2026-10-05T03:37:00Z');
  const data = windowEnding('2026-10-05');
  data.clones.clones[0].count = 5; // Correct an overlapping date from 2 to 5.
  data.clones.count = 31;
  const summary = await collect(output, data, '2026-10-06T03:37:00Z');
  assert.equal(summary.views.count, 42);
  assert.equal(summary.clones.count, 31);
  assert.equal(summary.totals.views.count, 45); // Fifteen dates, not 42 + 42.
  assert.equal(summary.totals.clones.count, 33); // Fifteen dates plus the correction.
  assert.equal(summary.totals.clones.recordedDays, 15);
  assert.equal(summary.totals.clones.missingDays, 0);
  assert.equal(summary.totals.clones.from, '2026-09-21');
  assert.equal(summary.totals.clones.through, '2026-10-05');
  assert.equal(summary.trends.clones.length, 15);
  assert.equal(summary.trends.clones[1], 5);
});

test('compact trends cover all recorded history, preserve gaps/zeros, and average long periods', () => {
  const days = {};
  for (let i = 0; i < 56; i++) {
    const date = new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10);
    days[date] = { clones: { count: i }, views: { count: 56 - i } };
  }
  const trends = summarizeTrends({ days });
  assert.equal(trends.clones.length, 28);
  assert.equal(trends.clones[0], 0.5);
  assert.equal(trends.clones[27], 54.5);
  assert.equal(trends.views[0], 55.5);
  assert.equal(trends.from, '2026-01-01');
  assert.equal(trends.through, '2026-02-25');
  const sparse = summarizeTrends({ days: {
    '2026-01-01': { clones: { count: 0 } },
    '2026-01-03': { clones: { count: 4 }, views: { count: 2 } },
  } });
  assert.deepEqual(sparse.clones, [0, null, 4]);
  assert.deepEqual(sparse.views, [null, null, 2]);
  assert.deepEqual(summarizeTrends({ days: {} }).clones, []);
});

test('any failed endpoint preserves existing summary/history and creates no snapshot', async t => {
  const output = await temporary(t);
  await collect(output, fixture(), '2026-10-05T03:37:00Z');
  const before = await fs.readFile(path.join(output, 'history.json'), 'utf8');
  for (const endpoint of ['views', 'clones', 'referrers', 'paths']) {
    await assert.rejects(collect(output, fixture(9), '2026-10-06T03:37:00Z', endpoint), /HTTP 403/);
    assert.equal(await fs.readFile(path.join(output, 'history.json'), 'utf8'), before);
    assert.equal((await json(output, 'summary.json')).clones.count, 4);
    assert.equal((await fs.readdir(path.join(output, 'snapshots/2026'))).length, 1);
  }
});

test('first-run API failure and malformed data never create an archive', async t => {
  const output = await temporary(t);
  await assert.rejects(collect(output, fixture(), '2026-10-05T03:37:00Z', 'paths'), /HTTP 403/);
  const malformed = fixture();
  malformed.clones.clones.push(malformed.clones.clones[0]);
  await assert.rejects(collect(output, malformed, '2026-10-05T03:37:00Z'), /daily clones/);
  await assert.rejects(fs.access(output), { code: 'ENOENT' });
});

test('corrupt or foreign history is preserved and aborts before writing a snapshot', async t => {
  const output = await temporary(t);
  await fs.mkdir(output);
  for (const original of ['{invalid', '{"schemaVersion":1,"repository":"someone/else","days":{}}']) {
    await fs.writeFile(path.join(output, 'history.json'), original);
    await assert.rejects(collect(output, fixture(), '2026-10-05T03:37:00Z'));
    assert.equal(await fs.readFile(path.join(output, 'history.json'), 'utf8'), original);
    assert.deepEqual(await fs.readdir(output), ['history.json']);
  }
});
