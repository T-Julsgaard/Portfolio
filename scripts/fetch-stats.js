#!/usr/bin/env node
/*
 * fetch-stats.js — pulls my GitHub statistics and writes them to data/stats.json.
 *
 * Runs inside GitHub Actions (see .github/workflows/stats.yml). The website
 * never talks to the GitHub API itself — it only reads the JSON file this
 * script produces.
 *
 * Requirements honoured here (see the implementation brief):
 *  - The token comes from the GH_TOKEN environment variable and NOWHERE else.
 *  - The token is never logged, and never written to any file.
 *  - If ANY API call fails, the script exits non-zero WITHOUT writing the file,
 *    so a bad run can never overwrite yesterday's good data with zeros.
 *  - The token has `read:user` scope only, so every number below reflects
 *    PUBLIC activity. Private contributions are not available and are not
 *    silently mixed in.
 *  - Days are bucketed in Europe/Copenhagen for the "today / this month /
 *    this year" counters, so the daily number resets at MY midnight, not UTC's.
 *    (The contribution calendar grid itself comes straight from GitHub's API,
 *    identical to the graph on my profile page.)
 *
 * Node 20+, no dependencies — native fetch only.
 */

'use strict';

/* ------------------------------------------------------------------ config */

const LOGIN = 'T-Julsgaard';            // the GitHub account being measured
const TIMEZONE = 'Europe/Copenhagen';   // my local day, stated in the output
const OUTPUT = 'data/stats.json';       // where the result is written
const FEATURED_REPOS = [
  'Chess-Review',
  'entropy-forge',
  'DocuRAG',
  'danish-wind-mapper',
  'bitcoin-mining-miningame',
];

const TOKEN = process.env.GH_TOKEN;
if (!TOKEN) {
  console.error('fetch-stats: GH_TOKEN environment variable is not set. Aborting.');
  process.exit(1);
}

/* -------------------------------------------------------- tiny API helpers */

// One POST to GitHub's GraphQL endpoint. Throws (with the API's error
// MESSAGES only — never the request object, which would carry the token
// in its headers) if anything is wrong.
async function gql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: 'bearer ' + TOKEN,
      'Content-Type': 'application/json',
      'User-Agent': 'portfolio-stats-script',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 403 || res.status === 429) {
    throw new Error('GitHub API rate limit or permission problem (HTTP ' + res.status + ').');
  }
  if (!res.ok) throw new Error('GitHub GraphQL returned HTTP ' + res.status + '.');
  const body = await res.json();
  if (body.errors && body.errors.length) {
    throw new Error('GraphQL errors: ' + body.errors.map((e) => e.message).join(' | '));
  }
  if (!body.data || !body.data.user) {
    throw new Error('GraphQL response had no user data — is the login "' + LOGIN + '" correct?');
  }
  return body.data.user;
}

/* -------------------------------------------------- Copenhagen date maths */

// Minutes east of UTC that Europe/Copenhagen is at a given instant
// (60 in winter, 120 in summer — derived from the clock itself, so DST
// switches are handled automatically).
function tzOffsetMinutes(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(date);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return Math.round((asUTC - date.getTime()) / 60000);
}

// The exact UTC instant of local Copenhagen midnight on year-month-day.
function cphMidnightUTC(y, m, d) {
  // First guess: as if Copenhagen were UTC. Then correct by the real offset
  // at that instant (done twice so a DST boundary can't leave it one hour off).
  let t = Date.UTC(y, m - 1, d, 0, 0, 0);
  for (let i = 0; i < 2; i++) t = Date.UTC(y, m - 1, d, 0, 0, 0) - tzOffsetMinutes(new Date(t)) * 60000;
  return new Date(t);
}

// Today's date — year, month, day — as the calendar shows it in Copenhagen.
function cphToday() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(new Date()).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day };
}

/* ------------------------------------------------------------ the queries */

// Contribution + commit totals inside one time window (max 1 year — a
// GitHub API rule; the all-time total below loops year by year).
async function countRange(fromISO, toISO) {
  const u = await gql(
    `query($login:String!,$from:DateTime!,$to:DateTime!){
       user(login:$login){
         contributionsCollection(from:$from, to:$to){
           contributionCalendar{ totalContributions }
           totalCommitContributions
         }
       }
     }`,
    { login: LOGIN, from: fromISO, to: toISO },
  );
  return {
    contributions: u.contributionsCollection.contributionCalendar.totalContributions,
    commits: u.contributionsCollection.totalCommitContributions,
  };
}

async function main() {
  const now = new Date();
  const today = cphToday();

  /* -- 1. profile basics + all public repos (paginated 100 at a time) ----- */

  console.log('Fetching profile and repositories…');
  const repos = [];
  let createdAt = null, followers = 0, publicCount = 0, cursor = null;
  for (;;) {
    const u = await gql(
      `query($login:String!,$after:String){
         user(login:$login){
           createdAt
           followers{ totalCount }
           repositories(privacy:PUBLIC, ownerAffiliations:OWNER, first:100, after:$after,
                        orderBy:{field:PUSHED_AT, direction:DESC}){
             totalCount
             pageInfo{ hasNextPage endCursor }
             nodes{
               name description url homepageUrl pushedAt stargazerCount isFork
               primaryLanguage{ name }
               languages(first:20, orderBy:{field:SIZE, direction:DESC}){
                 edges{ size node{ name } }
               }
             }
           }
         }
       }`,
      { login: LOGIN, after: cursor },
    );
    createdAt = u.createdAt;
    followers = u.followers.totalCount;
    publicCount = u.repositories.totalCount;
    repos.push(...u.repositories.nodes);
    if (!u.repositories.pageInfo.hasNextPage) break;
    cursor = u.repositories.pageInfo.endCursor;
  }

  // Stars are counted across every public repo I own. Languages and the
  // "most recently pushed" card EXCLUDE forks — a fork's languages describe
  // someone else's code, and showing a fork as "currently working on"
  // would be misleading.
  const totalStars = repos.reduce((sum, r) => sum + r.stargazerCount, 0);
  const ownRepos = repos.filter((r) => !r.isFork);

  const langBytes = new Map();
  for (const r of ownRepos) {
    for (const e of r.languages.edges) {
      langBytes.set(e.node.name, (langBytes.get(e.node.name) || 0) + e.size);
    }
  }
  const langTotal = [...langBytes.values()].reduce((a, b) => a + b, 0) || 1;
  const languages = [...langBytes.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, bytes]) => ({ name, bytes, percent: Math.round((bytes / langTotal) * 1000) / 10 }));

  const recent = ownRepos[0] || null; // repos arrive sorted by pushedAt already
  const mostRecent = recent && {
    name: recent.name,
    description: recent.description,
    url: recent.url,
    pushedAt: recent.pushedAt,
    language: recent.primaryLanguage ? recent.primaryLanguage.name : null,
  };
  const featured = FEATURED_REPOS.map((name) => {
    const r = ownRepos.find((repo) => repo.name.toLowerCase() === name.toLowerCase());
    return r && {
      name: r.name,
      description: r.description,
      url: r.url,
      homepageUrl: r.homepageUrl,
      pushedAt: r.pushedAt,
      stars: r.stargazerCount,
      language: r.primaryLanguage ? r.primaryLanguage.name : null,
    };
  }).filter(Boolean);

  /* -- 2. the contribution calendar — GitHub's own last-year window ------- */
  /* Called WITHOUT from/to so the grid is EXACTLY the graph GitHub renders
     on my profile, including its own quartile colour levels per day.        */

  console.log('Fetching contribution calendar…');
  const calU = await gql(
    `query($login:String!){
       user(login:$login){
         contributionsCollection{
           contributionCalendar{
             totalContributions
             weeks{ contributionDays{ date contributionCount contributionLevel weekday } }
           }
         }
       }
     }`,
    { login: LOGIN },
  );
  const weeks = calU.contributionsCollection.contributionCalendar.weeks;
  const calendar = [];
  for (const w of weeks) {
    for (const d of w.contributionDays) {
      calendar.push({ date: d.date, count: d.contributionCount, level: d.contributionLevel, weekday: d.weekday });
    }
  }
  if (calendar.length < 300) throw new Error('Calendar came back suspiciously short (' + calendar.length + ' days).');

  /* -- 3. streaks, computed from the calendar days ------------------------ */

  let currentStreak = 0, longestStreak = 0, run = 0;
  for (const d of calendar) {
    run = d.count > 0 ? run + 1 : 0;
    if (run > longestStreak) longestStreak = run;
  }
  // Current streak counts back from the last day; a zero on the FINAL day
  // (today, which isn't over yet) doesn't break it — same as streak trackers.
  for (let i = calendar.length - 1; i >= 0; i--) {
    if (calendar[i].count > 0) currentStreak++;
    else if (i === calendar.length - 1) continue;
    else break;
  }

  /* -- 4. today / month-to-date / year-to-date (Copenhagen windows) ------- */

  console.log('Fetching commit counters (today / month / year)…');
  const nowISO = now.toISOString();
  const cToday = await countRange(cphMidnightUTC(today.y, today.m, today.d).toISOString(), nowISO);
  const cMonth = await countRange(cphMidnightUTC(today.y, today.m, 1).toISOString(), nowISO);
  const cYear = await countRange(cphMidnightUTC(today.y, 1, 1).toISOString(), nowISO);

  /* -- 5. this year's contribution breakdown ------------------------------ */

  const bkU = await gql(
    `query($login:String!,$from:DateTime!,$to:DateTime!){
       user(login:$login){
         contributionsCollection(from:$from, to:$to){
           totalCommitContributions
           totalIssueContributions
           totalPullRequestContributions
           totalPullRequestReviewContributions
         }
       }
     }`,
    { login: LOGIN, from: cphMidnightUTC(today.y, 1, 1).toISOString(), to: nowISO },
  );
  const breakdown = {
    commits: bkU.contributionsCollection.totalCommitContributions,
    issues: bkU.contributionsCollection.totalIssueContributions,
    pullRequests: bkU.contributionsCollection.totalPullRequestContributions,
    reviews: bkU.contributionsCollection.totalPullRequestReviewContributions,
  };

  /* -- 6. all-time totals: loop one-year windows since the account began -- */

  console.log('Fetching all-time totals (one query per account year)…');
  let totalCommits = 0, totalContribs = 0;
  const created = new Date(createdAt);
  for (let t = created.getTime(); t < now.getTime(); ) {
    const end = Math.min(t + 365 * 24 * 3600 * 1000, now.getTime());
    const c = await countRange(new Date(t).toISOString(), new Date(end).toISOString());
    totalCommits += c.commits;
    totalContribs += c.contributions;
    t = end;
  }

  /* -- 7. assemble and write — ONLY now that every call has succeeded ----- */

  const out = {
    generatedAt: now.toISOString(),
    timezone: TIMEZONE,
    contributions: {
      today: cToday.contributions,
      month: cMonth.contributions,
      year: cYear.contributions,
      total: totalContribs,
      currentStreak,
      longestStreak,
      breakdown,
    },
    // Commits specifically (the site's ticker shows these): commit
    // contributions inside each Copenhagen-local window. Public repos only —
    // the read:user token cannot see private activity.
    commits: {
      today: cToday.commits,
      month: cMonth.commits,
      year: cYear.commits,
      total: totalCommits,
    },
    calendar,
    repos: { publicCount, totalStars, languages, mostRecent, featured },
    profile: { followers, createdAt },
  };

  const fs = require('fs');
  fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 2) + '\n');
  console.log('Wrote ' + OUTPUT + ' — ' + calendar.length + ' calendar days, '
    + out.commits.total + ' total commits, generated ' + out.generatedAt);
}

main().catch((err) => {
  // Print the MESSAGE only. Never dump whole error/request objects — they can
  // carry request headers, and headers carry the token.
  console.error('fetch-stats FAILED: ' + (err && err.message ? err.message : String(err)));
  console.error('No file was written — the previous stats.json (if any) is untouched.');
  process.exit(1);
});
