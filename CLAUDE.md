# Portfolio 2.0 — ASCII Portrait Site

A single-file, no-build Three.js prototype: an interactive ASCII-art portrait (13,268 glyphs) the visitor can fly through. No framework, no bundler — everything lives in one HTML file (`index.html`).

Orientation in one paragraph: the portrait (a Grainrad ASCII export embedded as `asciiData`) is rendered as per-character `InstancedMesh` pools and treated as terrain. A camera journey along a Catmull-Rom path visits **6 stops** (welcome, work experience, education, case studies, interests, contact); at each stop, content — stencil-typography titles, ASCII covers that "develop" into photos, buttons, cards — **assembles out of the terrain glyphs themselves** ("facets") and flies home on departure. A YouTube-backed music bar streams a 78-track playlist. The welcome stop shows live GitHub data written ahead of time by a GitHub Actions workflow.

## Deep documentation — READ BEFORE TOUCHING a subsystem

This file is a lean index; the detailed subsystem documentation (architecture, validated invariants, tuned constants, and the pitfalls/regressions that already bit us) lives in `docs/`. **Reading the relevant doc before editing is mandatory, not optional** — these systems are full of non-obvious couplings, and every past regression is documented there with its symptom.

| Before touching… | Read |
|---|---|
| Assembled stops, facets, covers, stencil buttons, clearing/absorb/handoff, overlay cards, in-scene video, contact stop, stop content (`JOURNEY`/`gallery`) | `FACET-ASSEMBLY-MANUAL.md` (root) **then** `docs/facets.md` |
| Glyph rendering, instanced pools, `syncPools`, glyph geometry/materials, text baseline, load animations, bloom/FOV automation, dev panel | `docs/rendering.md` |
| The journey path, UI state machine, docking/departing, travel styles, auto tour, fullscreen toggle | `docs/journey.md` |
| The welcome stop (GitHub calendar, commit banner, mini-me figure, section nav, stats pipeline) | `docs/welcome-stop.md` |
| The music bar, YouTube player, muted autostart, playlist modal | `docs/music-bar.md` |

When a subsystem changes, update its `docs/` file (and `FACET-ASSEMBLY-MANUAL.md` if it's the facet system) — keep THIS file a lean index. Add new subsystems as new `docs/` files with a row in the table above.

## Hard rules

- **`index.html` contains four single-line embedded data blobs — never pull them into context.** As of v61: `asciiData` ~625 KB (≈ line 1078), `PROGRESSIVE_FRAMES` ~341 KB (≈ line 1080), `ASCII_COVERS` ~18 KB (≈ line 1877), `COVER_PHOTOS` ~552 KB of base64 JPEGs (≈ line 1882). Line numbers drift as the file changes — re-locate with a line-length scan, never by reading around. Never Read a range that spans them (use offset/limit to stop short); never grep with content output for identifiers that occur inside them (`asciiData`, `PROGRESSIVE_FRAMES`, `ASCII_COVERS`, `COVER_PHOTOS`, `data:image`) — use files-with-matches/count modes, or anchor the pattern to the declaration (e.g. `^const asciiData`). One careless match on the 625 KB line floods the entire context window.
- **The glyph pool is TIGHT at the case-studies stop**: ~13,145 of the 13,268-glyph pool used (~123 spare as of v62 — the covers' compact rotation arrows consumed most of the old ~300 margin). Any content edit there (longer title/blurb/sub, new stencil text) can silently overflow and short the last-claimed cover. Validate glyph counts with a quick Python script against the real `ASCII_COVERS`/`BTN_FONT` before shipping content edits (methodology in `FACET-ASSEMBLY-MANUAL.md` and `docs/facets.md`).
- **Never attribute commits to an AI tool** (user requirement, applies to every commit in this repo): no `Co-Authored-By`, no "Generated with" lines.
- **Always validate camera-math/data-dependent changes** (distances, fog thresholds, grid spacing, terrain clearance, flood-fill reachability) against the real embedded `asciiData` with a quick script before shipping. Node is NOT installed on this machine; Python 3.11 is available as `python`. JS syntax can be checked with the `esprima` pip package.
- **Keep `AGENTS.md` in sync**: it is read by other agents (Codex/ChatGPT) and must stay byte-identical to this file. After ANY edit to `CLAUDE.md`, copy it over `AGENTS.md` in the same commit — and vice versa if an edit lands in `AGENTS.md` first. The `docs/` files are shared by both and need no mirroring.

## Files

- `index.html` — the single source of truth. This is the only working copy; edit it directly and open it in a browser to preview. Versioning is handled by `git`, not by numbered files.
- `docs/` — the deep subsystem documentation (see table above).
- `FACET-ASSEMBLY-MANUAL.md` (repo root) — **read this before touching the assembled-stop/facet system** (adding galleries or buttons to stops, changing clearing/absorb behavior, debugging glyph transitions). Written after v43: architecture, the hold/handoff/cone design, the validation methodology (Python vs. real `asciiData`, esprima), and the pitfalls that already bit us once.
- `scripts/fetch-stats.js` — Node 20 (native `fetch`) script the Actions workflow runs to write `data/stats.json`. Token from `process.env.GH_TOKEN` only, never logged/committed; exits non-zero without writing on any API failure (never publishes partial/zero data over good data).
- `.github/workflows/stats.yml` — runs the fetch every 30 min + on demand, commits `data/stats.json` as `github-actions[bot]` only when it changed (`chore: update stats [skip ci]`). Needs the `STATS_TOKEN` repo secret (`read:user` scope). See `README.md` for token rotation / troubleshooting.
- `data/stats.sample.json` — fake but structurally identical stats for local preview; the deployed site never uses it.
- `open portfolio.bat` (repo root) — starts `python -m http.server 8123` minimized and opens `http://localhost:8123/`; the double-click way to browse the site with working music (YouTube refuses ALL embeds on `file://` pages).
- Media images and PDFs live in `images/` and `pdfs/`; piano videos in `videos/`.

## Versioning (git — no more numbered files)

- **Do NOT create `vN.html` copies.** The old `v1.html … vN.html` snapshot convention is retired; git history is the version record now. Older numbered snapshots are archived in `../Portfolio older versions/`. (The `vN` numbers still name change-rounds in the docs.)
- **After each round of changes, commit.** One commit per change round, with a short message describing what changed (e.g. `git commit -am "seamless docking + finer stencil buttons"`).
- **To go back to an old version:** `git log --oneline` to find it, then `git show <hash>:index.html > preview.html` to inspect it, or `git checkout <hash> -- index.html` to restore it.
- **Multiple changes at once:** use a separate branch (or git worktree) per task, then merge each back into `main`. Two edits to the *same* part of `index.html` will still need a manual merge — those are best done one at a time.

## Browser testing

- The file CAN be browser-tested from here (since v28/v29): `.claude/launch.json` defines a `portfolio-static` config (`python -m http.server 8123`; `portfolio-static-8124` is a fallback for when another session holds 8123) for the Claude preview tools — navigate, check console logs, screenshot, and drive the journey by clicking `#enter-btn`/rail dots and dispatching PointerEvents on the canvas. Caveats: WebGL there is software-rendered and the hidden tab throttles rAF to ~1/s between tool calls, so animation-timing/FPS observations are unreliable — use it for correctness and settled-state visual parity, not performance numbers.
- Still report clearly what to check when the user opens changes in a real browser (real-GPU behavior, animation feel and frame rate can only be judged there).
