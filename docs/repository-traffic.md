# Repository traffic archive

`scripts/fetch-traffic.js` collects the complete responses from the four GitHub
traffic endpoints for `T-Julsgaard/Chess-Review`: daily views, daily clones,
popular referrers, and popular paths. `.github/workflows/traffic.yml` runs at
03:37 UTC daily and supports manual runs. Collection begins with the real
2026-10-05 snapshot; data already outside GitHub's window cannot be recovered.

## Activation

1. Create a fine-grained personal access token, owned by `T-Julsgaard`, restricted
   to **Chess-Review**, with repository **Administration: read**. Metadata read is
   granted automatically. It needs no code write permission.
2. In **Portfolio** → Settings → Secrets and variables → Actions, create the
   repository secret **TRAFFIC_TOKEN** with that token. Do not paste it into chat,
   commit it, or reuse the existing `STATS_TOKEN` (which only has `read:user`).
3. Push the local implementation commits to the default branch (`main`).
4. In Portfolio → Actions → **Archive Chess Review traffic** → **Run workflow**,
   run once and check that both collection and the archive commit succeed.

The token is provided to the collector as `GH_TOKEN`, never logged or saved.
The workflow's separate built-in `GITHUB_TOKEN` has `contents: write` on Portfolio
and commits only `data/traffic/chess-review/` as `github-actions[bot]`. It pulls
with rebase before pushing, with three attempts to accommodate the existing stats
workflow. Traffic runs are serialized. Local development does not push anything.

## Saved data and invariants

All files live under `data/traffic/chess-review/`:

- `snapshots/YYYY/<UTC timestamp>.json`: immutable observations for each successful
  run, containing the exact four endpoint responses, including any future extra
  API fields. Referrers and paths must remain snapshots: they are overlapping
  14-day top-10 lists, not daily records that can be summed.
- `history.json`: views and clones by UTC date. Repeated observations **replace**
  the count/unique value for that date, with `observedAt`. Corrections and the
  partially complete current day therefore update without inflating totals.
  Older dates remain permanently; dates not returned by GitHub are not fabricated
  as zero. `firstCollectedAt` and `lastCollectedAt` describe archive coverage.
- `summary.json`: the latest API-reported 14-day views/clones totals and their
  corresponding rolling unique counts, plus `generatedAt` and repository identity.
  Its additive `totals.views` / `totals.clones` objects sum the deduplicated daily
  history across the entire recorded period. Each contains `count`, `from`,
  `through`, `recordedDays`, and `missingDays` within that date span. Overlapping
  date corrections replace their previous contribution to the total; the totals
  continue to grow after dates fall outside the live API's 14-day window. No
  lifetime unique count is calculated. The portfolio displays total clone and
  view **events**, not unique people, extension installs, or unrecorded history.

All responses and existing history are validated before writing anything. API
errors, missing tokens, malformed responses, or corrupt history abort without
replacing the last good published data. Files are written through temporary-file
renames, with the raw snapshot first and the display summary last. A filesystem
failure between writes can leave a saved snapshot ahead of history/summary; retry
collection after fixing storage. Do not delete the snapshot.

GitHub retains only the last 14 days. Daily runs give missed jobs room to recover,
but an outage longer than the retention period still loses data. Daily unique
visitor/cloner counts cannot be added to obtain lifetime unique people. GitHub
reports full clones, not fetches; traffic to the deployed app is a separate metric.
Referrers and paths are limited to the top 10, so the archive captures all data the
API exposes, not every individual event.

## Portfolio display

The Chess Review `PORTFOLIO_PROJECTS` record owns the traffic path, remote URL, and
clone/view labels. The shared formatter drives three terrain text rows above the
video, the mobile project dialog's compact two-column footer, and the readable
project card in Details. **Total clones** and **Total views** are the primary
figures for all recorded dates, with the latest **Last 14 days** figures underneath.
The caption names the recorded date range and **As of … UTC** collection date,
and marks gaps if any recorded metric has missing days within its range.
Missing data shows `--` and `Awaiting first traffic update`; failed refreshes
retain the prior observation. Older summaries without `totals` still supply the
14-day figures but show cumulative totals as awaiting an archive update, never
silently substituting the 14-day count for the full recorded total.

The deployed site reads the public summary from Portfolio's `main` branch at
`raw.githubusercontent.com`, with the deployed JSON as a fallback. This avoids a
stale Pages artifact: bot commits using `GITHUB_TOKEN` do not trigger Pages builds.
Local loopback previews read the local summary. The browser never receives a token
or calls the authenticated traffic API. Refreshes occur every minute while visible
and on returning to the tab. The glyph layout takes fresh data on the next project
selection; polling must not interrupt video or reassign donors mid-transition.

## Checks and troubleshooting

Run `node --test scripts/fetch-traffic.test.js` with Node 20+ (the desktop runtime
also supplies Node). Tests cover raw-response retention, date replacement,
corrections/zero counts, totals beyond 14 days, missed-day gaps, API failures,
and corrupt history.
Run the repository's esprima syntax check and targeted desktop/phone visual checks
for changes to the display. Preserve the real portrait glyph budget.

If an Actions run fails, check token expiry, **Administration: read** access on
Chess-Review, the secret name, GitHub API availability, and archive validity.
For push failures, check Portfolio's Actions permissions/branch rules and other
workflow commits. Check for disabled schedules after 60 days without repository
activity. Rotate the secret before token expiry and inspect occasional run history.

References: [traffic API](https://docs.github.com/en/rest/metrics/traffic),
[traffic semantics](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-traffic-to-a-repository),
[scheduled workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule),
[Pages and bot commits](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
