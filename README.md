# Portfolio 2.0

An interactive ASCII-art portrait site — a single `index.html`, no build step.
Open it via `open portfolio.bat` (serves it at http://localhost:8123/ so music
and stats work; double-clicking the file blocks both).

---

## GitHub stats on the welcome stop

The welcome stop shows live GitHub numbers: a commit ticker, the contribution
calendar, a compact latest-repository README line, total stars across the public
repositories, and per-project stars/language for the assembled in-scene project stage.
Because the site is static (GitHub Pages),
the numbers are fetched **ahead of time** by a scheduled GitHub Actions
workflow that writes them to `data/stats.json`; the site just reads that file.
The browser never talks to the GitHub API and never sees a token.

The moving parts:

| Piece | What it does |
|---|---|
| `scripts/fetch-stats.js` | Reads my public GitHub activity from the API and writes `data/stats.json` |
| `.github/workflows/stats.yml` | Runs that script every 30 minutes and commits the file when it changed |
| `STATS_TOKEN` (repo secret) | A personal access token with **read:user only** — lets the script read contribution data |

All numbers are **public activity only** (the token deliberately cannot see
private repos). Day boundaries ("today", "this month") use **Europe/Copenhagen**
time. The calendar grid is exactly what GitHub's own profile graph returns,
including its colour levels.

### How to tell if the token has expired

The numbers on the site stop moving, and the **Actions** tab of this repo
shows red ✗ runs of "Update GitHub stats" with an error like
`GitHub GraphQL returned HTTP 401`. GitHub also emails you before a token
with an expiry date lapses.

### How to rotate the token

1. GitHub → Settings (your account) → Developer settings → Personal access
   tokens → **Tokens (classic)** → Generate new token.
   Tick **only** the `read:user` scope. Copy the token.
2. This repo → Settings → Secrets and variables → **Actions** →
   `STATS_TOKEN` → Update → paste → Save.
3. Done. The next scheduled run uses the new token. (Optional: trigger a
   manual run to confirm — see below.)

The token never goes in any file. Only in that secret.

### How to run the workflow manually

Repo → **Actions** tab → "Update GitHub stats" (left sidebar) →
**Run workflow** button → green Run. It takes under a minute; when it's green,
`data/stats.json` is fresh.

### When the numbers stop moving, check in this order

1. **Actions tab** — is the latest "Update GitHub stats" run green?
   - Red with `HTTP 401` → token expired → rotate it (above).
   - Red with `403` on the *push* step → workflow lost write permission →
     Settings → Actions → General → Workflow permissions → "Read and write".
   - Red with a rate-limit message → almost certainly transient; wait for the
     next run.
2. **No runs at all lately?** GitHub disables scheduled workflows after
   ~60 days without any repo activity. Open the workflow in the Actions tab —
   there'll be a banner with an "Enable" button.
3. **Runs are green but the site is stale?** The site caches nothing
   (it fetches the JSON with a cache-buster every minute) — hard-refresh
   (Ctrl+F5) once; if it persists, GitHub Pages itself is still deploying
   the newest commit (check the repo's deployments in the sidebar).

### Local preview without real stats

`data/stats.json` only exists after the workflow's first run, and it's not
served when browsing locally before pulling. When the page runs on
`localhost` and `stats.json` is missing, it falls back to
`data/stats.sample.json` — obviously fake numbers, marked with a small
SAMPLE tag on the welcome stop. The deployed site never uses the sample file.
