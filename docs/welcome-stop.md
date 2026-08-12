# Welcome stop (live GitHub data, mini-me, section nav, commit banner)

## v87 - source-faithful project previews

The five project ASCII screens now depict the first UI that replaces them rather
than an abstract system diagram: Chess Review's extension popup, Entropy Forge's
desktop rack, DocuRAG's login, the Danish wind map with its collapsed Data Filter,
and Bitcoin Miner's launch menu. Automatic development begins after 1,150 ms and
uses project-local 0.70 stagger / 0.80 tile-duration factors for a quicker morph.

The developed surface bar is consistent: OPEN REPOSITORY for every project (OPEN
REPO on Chess to make room for its additional GET EXTENSION action), plus a compact
full-screen/GitHub-Pages icon only for Entropy Forge and DocuRAG, the two records
with deployed Pages URLs. The former bar X was removed; the assembled X above the
screen still closes the complete project focus.

Entropy Forge and DocuRAG set `desktop:true`, giving their iframes a 1440x742
internal viewport sampled down at 0.5. Entropy therefore crosses its 1080px desktop
breakpoint and renders the three-column rack; DocuRAG keeps its desktop sidebar and
topbar. This also supplies a denser text raster before the scene homography scales
the surface.

DocuRAG's deployed HTML is fetched, rebased to its Pages root, and patched only at
the embed seam: the injected Preview badge is hidden, `#delete-chat-btn` is pinned
to the top-right and relabelled Close mode, and a capture listener routes it through
the app's existing Switch action. Search and Ask now return to the knowledge-base
mode chooser instead of deleting the active chat; Dashboard keeps its own matching
close path.

Danish Wind Mapper now loads the exact repository artifact requested by the owner:
`wind-asset-map/Interactive_wind_map_preview.html`. It is the full 11 MB Folium
document, rebased from raw GitHub content; the old representative local Leaflet
mock is no longer selected. Browser validation reached the real Data Filter and
6,987 Leaflet paths. Chess Review now starts on the repository's toolbar-popup UI
and its Analyze action opens a static walkthrough of the real modular analyzer,
driven by the existing real PGN positions and moves.

Budget validation against embedded `asciiData`: 13,268 terrain glyphs, 3,437 main
Welcome claims, and 870 records for the largest current project layout, leaving
8,961 spare.

## v86 - automatic project development and fluid navigation

Selected portfolio projects now read as assembled ASCII before developing into
their interactive surface automatically. `PROJECT_PREVIEW_DELAY=1700` begins only
after the focused project facet reaches `hold`, so terrain flight time never eats
the reading pause. Closing a developed surface sets `previewDismissed` for the
current selection; it restores the ASCII screen without immediately reopening it.
Selecting another project clears that suppression. The old OPEN PROJECT / VIEW
CODE row and the proof, language, stars, repository-type, and index bands are gone.
Every project stage now starts with its stencil title, concise explanation, and
then the 16:9 ASCII screen. ABOUT ME and PORTFOLIO move `10.5` layout units outward
while project focus is active.

Chess Review uses a self-contained `srcdoc` showcase generated from the real
preselected `CHESS_GAMES[0]` PGN. It recreates the extension's board, clocks,
review insight, move classifications, accuracy/estimated-rating cards, move list,
and evaluation graph without shipping Stockfish or requiring another host. Its
evaluation/classification values are intentionally precomputed presentation data;
the game positions and SAN sequence are real. Danish wind mapper no longer fetches
and parses the multi-megabyte upstream preview. It uses a lightweight local map
surface with representative coordinates from the project data, capacity filtering,
pan/zoom, and an SVG fallback beneath Leaflet, preventing the former white screen.

Welcome's two in-scene lists now scroll fractionally instead of rounding to whole
rows. Wheel deltas are scaled by `WELCOME_SCROLL_WHEEL=0.0035`; row targets and
opacity interpolate continuously at the viewport edges. The GitHub calendar month
labels are anchored to actual first-of-month cells and laid out with a running
collision boundary, so adjacent labels such as Jul/Aug cannot overlap.

## v85 - centred project-focus composition

Selecting a Welcome project no longer appends its stage beyond PORTFOLIO. The
project facet shares the main Welcome anchor and camera-facing plane, scales up to
`main.f * WPF_SCALE` (`1.68`), and replaces the identity spine on the visual axis.
`WPF_VIEW_FILL=0.84` caps both axes against the real docked FOV/aspect so saved
Welcome-size preferences cannot clip it. ABOUT ME and
PORTFOLIO remain live while sliding `8.5` layout units outward over
`WPF_SIDE_MS=320`; their row/button/scrollbar hit geometry follows the same offset,
so the project stage is never made smaller by including those rails in its fit.
The selected project row stays brighter while the focus state is active.

The stage is assembled primarily by glyphs already holding the greeting, seated
figure, and GitHub calendar. `buildWelcomeLayout()` tags those terrain-owned records
as `welcomePart:'center'`, while the independent keyboard-title proxies join the
same donor list after the greeting gate. On selection, current donor positions and
the selected project's normalized targets are both sorted in reading order; donors
are spread evenly across the full target list to avoid a directional clump. Their
target indices are omitted from the project facet's own configuration, so the
reserved project owners supply only the shortfall. This is a real retargeting of
the visible Welcome glyphs, not a crossfade between two complete cards.

The rails begin moving first (`WPF_LEAD=190`), then the donor and supplemental
records assemble together. Switching projects retargets both sets from their
current positions while the rails stay out. The projected live surface now
dissolves both ordinary project items and external Welcome donors tagged
`projectScreen`.

Closing with X or Escape reverses every donor to its saved identity target and
slides both rails home. The project facet must release with handoff enabled
(`facetOut(PF, now, false)`): because the stage is now centred inside the main
Welcome corridor, sending its supplemental owners directly home would visibly
repopulate the portrait through the restored calendar/figure. The active main
facet receives them through its existing absorb records instead. The calendar
develop and commit banner restart only after the identity composition is exact
again. Looking away cancels the focus mapping before the normal facet lifecycle
takes over.

The terrain claim budget is unchanged: Welcome still claims 3,437 records and the
normalized project reserve still claims 1,836 of the real 13,268-glyph pool,
leaving 7,995 spare. Reused keyboard-title proxies do not add terrain claims.

## v84 - click-only projects, greeting gate, quieter commit banner

Welcome project rows still brighten and swell on pointer hover or keyboard focus,
but neither interaction assembles the auxiliary project stage. A pointer click or
Enter is now the only way to select and display a project; clicking a project in
the fixed Portfolio rail remains an explicit selection and still carries it back
to Welcome.

The side-column destinations remain visible while the greeting types, but their
hit targets (`b.shown`) stay disabled until the final title glyph finishes its
pop. `welcomeTitleDoneAt()` is the shared timing source for this interaction gate
and the commit banner's first-message pause. Classic assembled-title mode unlocks
when the main facet reaches `hold`.

`welcomeMessages()` is again limited to the four commit totals. The v81 README
description and repository-star messages are no longer displayed.

## v83 - featured projects assemble beside PORTFOLIO

The five PORTFOLIO rows are now live project selectors rather than quiet
placeholders. `PORTFOLIO_PROJECTS` is a curated object array shared by the in-scene
Welcome rows and the fixed right rail. Each record owns its label, repository,
launch targets, concise recruiter-facing copy, proof point, visual theme, and
fallback metadata. The stats workflow adds `GH_STATS.repos.featured`, filtered from
the already-fetched public repositories, so stars and primary language refresh
without putting a GitHub token in the browser.

Clicking or keyboard-activating a project assembles a second, world-stationary facet
to PORTFOLIO's right. It is deliberately **not** part of
`buildWelcomeLayout()` or the main facet's bounds: folding it into those bounds
would shrink the greeting, figure, calendar, and side columns. Instead, its anchor
is derived from the main facet's right edge after fit, and it keeps the same plane
orientation so drag-look, breathing drift, and zoom read exactly like the in-scene
chess board.

All five variants use the same `PROJECT_STAGE_W` / `PROJECT_STAGE_H`, 16:9 preview
rectangle, title/body/proof/meta positions, and OPEN PROJECT / VIEW CODE controls.
The largest variant reserves 1,836 terrain glyphs once. A new selection retargets
those records and restarts their assembly from wherever they currently are; the old
project visibly reorganizes into the new one without a size jump. The main Welcome
facet claims 3,437, so the real 13,268-glyph pool retains 7,995 spare.

Every project row still receives a unique `btnKind` (`wproject:<id>`); sharing one
kind would merge the rows' item groups and make one hover animate all five. Pointer
hover only highlights a row. Click/Enter selects it, a second keyboard Enter
activates the primary action, and Escape or the assembled X sends the stage home.

Explicit `OPEN PROJECT` actions open `#project-live`; hover never loads remote work.
Entropy Forge and DocuRAG use their GitHub Pages deployments. The Danish wind map
and Bitcoin miningame fetch their repository's standalone HTML only after launch,
insert the correct raw-directory `<base>`, and render it in a sandboxed `srcdoc`
iframe. Chess Review links to the shipped Chrome Web Store product. The live surface
is a fixed 720×405 DOM plane projected into the stage's 16:9 glyph screen with the
same four-corner homography as the chess board. It has no modal backdrop, remains
inside the world, and never pauses the portfolio music. Closing it rebuilds the
screen from the stage's glyphs; departure tears the iframe down.

The fixed PORTFOLIO rail routes a project click back to Welcome and preserves the
requested project through the flight, where this same stage assembles.

## v81 - one-shot greeting and animated banner reservation

The seated mini-me waves once per page session. `welcome.wavePlayed` becomes true
when the first raise/wiggle/lower sequence finishes and survives look-away,
reassembly, and later visits to Welcome; changing the Wave control deliberately
clears it so the chosen style can be previewed once.

The commit-banner reserve no longer disappears as soon as Welcome starts assembling.
`initBanner()` creates a `prepare` phase that flies every reserved terrain glyph from
its real home into a compact hidden strip below the calendar, fading only at the
destination. The existing title-aware pause and selectable banner motions begin
after that preparation. This removes the instantaneous central hole that previously
appeared ahead of the rest of the assembly.

`welcomeMessages()` also appends a compact `README:` line from the latest public
repository description and the total star count already present in
`GH_STATS.repos`. The stats workflow and JSON schema required no change.

## v80 - darker exact calendar default migration

The v76 factory promotion to **Exact · darker empty cells** (`html2`) did not
replace older browser state: `pf_welcome_cal` and `pf_user_defaults.welCalSelect`
could still restore **Exact (assembles, develops to image)** (`html`) after startup.
A one-time `pf_welcome_cal_default_rev` migration now promotes both existing values
to `html2`. Once migrated, later calendar selections and saved defaults remain
user-owned and persist normally.

## v79 - real project names and complete journey rails

The PORTFOLIO column no longer contains invented placeholder titles. Its text-only
future-project rows are Chess-Review, Entropy-forge, DocuRAG, Danish wind mapper,
and Bitcoin-miningame, sourced from the shared `PORTFOLIO_PROJECTS` array also used
by the fixed right rail. Case studies remains the live first portfolio destination.
With six authored rows in a four-row window, the existing in-scene scrollbar,
off-window opacity transition, wheel, track click, and drag behavior remain active.

Welcome is also the first live item on both fixed journey rails. The right rail adds
the same five text-only project rows beneath Case studies and uses a clipped,
faded-edge scroll viewport to make its additional content obvious.

## v78 - promoted defaults, optical heading width, and keyboard navigation

The project factory profile now uses Exact darker calendar cells, Center burst,
Bracketed centered headings, right-side Brackets `[=]`, and no About Me scrollbar.
Previously saved browser preferences still override factory values as intended.

Centered headings now use the widest actually rendered row in their own group rather
than the nine-unit maximum row allowance. This puts ABOUT ME over the visual center
of its compact five-row list instead of over unused space to its right.

At the settled Welcome stop, arrow keys select live section/CV rows with the normal
hover swell. Up/down move within a column, left/right switch columns, and Enter
activates the selected destination. Rebuilding or releasing Welcome clears the
selection.

## v77 - compact About column and direct scrollbar manipulation

The greeting sits 0.70 layout units higher above the figure. The ABOUT ME scrollbar
is now factory-off, matching the expanded five-row presentation. In that mode its
five live rows use an 18% smaller stencil cell and a
compressed per-group pitch, so EXPERIENCE through DOWNLOAD CV occupy the same
top-to-bottom span as the four-row PORTFOLIO viewport. `wsPitch` is layout metadata
and must be used for both the initial targets and `updateWelcomeNav()` motion.

Welcome scrollbars are now direct controls, not arrow-only decoration. Clicking a
track maps its facet-plane coordinate to the nearest scroll index; pressing and
dragging either track or thumb keeps updating that index and suppresses camera
drag-look until release. `wsBars.xs` stores every authored bar side so left, right,
and both-side variants share the same hit testing.

## v76 - optical centring and configurable headings / scrollbars / banner motion

The factory GitHub-calendar choice is now **Exact · darker empty cells** (`html2`). The
calendar and its commit banner shift 1.25 layout units right, which is the optical
midpoint between the deliberately asymmetric ABOUT ME and PORTFOLIO columns; the
figure and greeting remain on the camera axis.

Welcome settings now expose four heading treatments (quiet left, quiet centred,
centred stencil, and centred brackets), plus independent scrollbar design and
position controls. Scrollbars may sit right, left, or on both sides. **About Me
scrollbar** is factory-off as of v77; turning it on collapses ABOUT ME from all five
rows to the same four-row scroll window as Portfolio.
The per-group `wsVisible` count is now layout metadata and must be used by visibility,
hit-testing, target motion, wheel bounds, and thumb travel instead of assuming the
global four-row window.

Commit banner choices now include **Baseline rise**, **Orbital sweep**, and **Center
burst** alongside Stream, Scan, and Cascade. They reuse the same reserved terrain
pool, stencil messages, linger clock, and restore path; only per-cell delays and
Bezier origins/controls differ.

The post-Welcome journey rail is split by information architecture: Experience,
Education, Interests, and Contact live on the left as ABOUT ME destinations, while
Case studies lives on the right as PORTFOLIO. Hovering either side adds one shared
`peek` state so both label sets reveal together.

## v74 - quiet headings, scrollable columns, CV, and banner variants

ABOUT ME and PORTFOLIO are now small typeset labels with dim dotted rules, not stencil buttons, so they read as column headings rather than clickable choices. Each column is a four-row viewport with its own compact ASCII scrollbar. Wheel over a column or click its end characters to scroll; the rail, dot, and bracket designs are selectable in Welcome settings. Rows retain normal terrain ownership and handoff, while off-window rows are invisible/non-interactive. ABOUT ME adds a `DOWNLOAD CV` row opening `pdfs/CV - Thomas Julsgaard.pdf` in a new tab. PORTFOLIO keeps Case studies live and includes named placeholders for future work.

The commit banner has three selectable motion grammars: **Stream** (the familiar lateral waterfall), **Scan** (centre-out with depth), and **Cascade** (stable row/column scatter from above). The Banner animation setting is persisted and can rebuild the active Welcome presentation immediately.

Welcome-to-processing handoff now begins at dock rather than during the entry flight, so the first assembled glyphs and the processed rendering arrive together.

## v72 - left-side scene framing and under-calendar commit stream

Welcome now assembles over the portrait's left side (`xf:-0.58, yf:0.82`) instead of near the middle. The authored content is unchanged in scale and structure, but `buildWelcomeLayout()` fixes its central spine at local `cx=0`; `welcomeLookQuat()` aims the camera horizontally at `faceCenter` for entry, arrival, and the docked facet. The figure therefore stays dead center while the portrait terrain remains visible around the entire composition. The Welcome bounds were validated against the embedded portrait: the waypoint lies inside the data bounds and the nearest real terrain glyph is 0.601 units away in XY.

The commit banner now emerges from a compact strip immediately under the calendar rather than recruiting visibly across the screen. Cells use a short under-baseline swoop before settling (`WB_FLY=360`, `WB_COL=14`); clearing reverses into that same hidden sink. The saved time becomes reading time (`WB_LINGER=4400`, `WB_GAP=700`). The first stat does not start until the facet is holding, the keyboard greeting has completely typed, and `WB_FIRST_PAUSE=480` ms has elapsed. Classic-title mode uses the hold time plus the same pause.

Deep reference for the first journey stop: the contribution calendar, the commit-ticker banner, the ASCII figure, the section-list nav, and the GitHub Actions stats pipeline. Read this before touching the welcome stop or data/stats.json plumbing.

## v71 — reference-led composition and an independent greeting

The welcome panorama now follows a wide, symmetrical composition: **"HI, I'M THOMAS." sits directly above the centred figure**, the GitHub calendar sits below the figure, and the commit stream remains below the calendar. Two generously separated side groups flank that central spine. **ABOUT ME** contains the live Experience, Education, Interests, and Contact journey links; **PORTFOLIO** contains the live Case studies link plus the deliberately non-interactive placeholder names PROJECT NORTH / PROJECT STATIC / PROJECT AFTERGLOW until real projects are supplied. Placeholder cells use luminance `0.58`, so they read quieter than the white live links. `buildWelcomeLayout()` owns the coordinates; the current main anchors are `leftX=-18`, `rightX=11.5`, `miTop=10.20`, `titleTop=13.05`, and `calDY=-1.35`. Its usual final recentre still converts the authored layout into the facet-local coordinate system.

The old v60 section rewrite is removed. Side-link stencil cells no longer carry per-item `nav`/`wd` launch metadata, do not land invisible, and do not fly a second time from their terrain homes. They are ordinary facet items and therefore assemble in the same `F_IN_MS` window as the calendar and figure. `updateWelcomeNav()` now only gates link hit-testing until the facet reaches `hold`; `b.nav` remains button metadata for hover styling and `departTo()` dispatch. The obsolete Section list delay/pace controls and defaults were deleted from the welcome dev panel.

The default title reveal is also no longer a terrain flight. `buildWelcomeTypeSpec()` records stencil-cell targets without adding them to `lay.items`; after the welcome facet reaches `hold`, `initWelcomeTypeTitle()` allocates fresh `'#'` proxies with `acquireGlyph()`. `updateWelcomeTitle()` reveals a complete stencil character per key (`WTW_KEY=105 ms`), pauses after `HI,` (`WTW_GAP=380 ms`), applies a short `WTW_POP=100 ms` key-pop, and moves a blinking seven-cell cursor. These proxies never belong to `textMeshes`, never claim portrait glyphs, and are detached with `releaseGlyph()` on look-away, departure, reassembly, or classic-title selection. The **Assemble (classic)** dev option still places the same title into `lay.items`, but both modes are fixed directly above the figure; the old title-position control was removed.

**Calendar variants (v64):** the dev panel's "GitHub calendar" dropdown gained `html2` ("Exact · darker empty cells") — identical to `html` (assembles, develops to the crisp Canvas2D image) except level-0 days use `CAL_DARK2[0]` `#151b23`, a neutral near-black instead of `CAL_DARK`'s green-tinted `#1c2b22`. Plumbing: `calPalDark()` picks the dark palette by `welcomeCal` (used by both `setImgColor`'s `{cal:n}` branch and `ghCalTexture`), `_ghTexKey` includes `welcomeCal` so switching variants rebuilds the texture, and every `welcomeCal==='html'` gate is now `'html'||'html2'`. Invert mode still uses `CAL_LIGHT` unchanged; factory default stays `blocks`.

**Welcome stop — live GitHub data (v53).** The first stop (`id:'welcome'`, flagged `github:true` in `JOURNEY`) assembles a one-view GitHub panorama out of the terrain instead of the generic title/body: the title **"Hi, I'm Thomas."**, a 1:1 recreation of the contribution calendar, a commit-ticker **banner**, and a small ASCII figure of me (the **mini-me**). It's built by `buildWelcomeLayout()` (returns the same `{items,w,h}` facet-layout shape as `buildStopLayout`/`buildCoverLayout`, so the existing facet machinery assembles/clears/restores it for free) plus calendar hit-test data (`calCells`) and the banner placement. `assembleStop` routes github stops through it (`hFit:1.0`), and everything only exists while docked here — leaving flies every glyph home into the face, so there is no separate model to cull. **Calendar**: `GH_STATS.calendar` (per-day `{date,count,level,weekday}`) laid into GitHub's grid (columns = weeks, rows Sun→Sat), one glyph per day coloured by `contributionLevel` via `CAL_DARK`/`CAL_LIGHT` (invert-aware, passed to `setImgColor` as `L={cal:n}`), month labels along the top and Mon/Wed/Fri labels on the left; hovering a cell raycasts to the facet plane (`welcomeCalTip`) and shows a GitHub-style tooltip (`#cal-tip`, "N contributions on Mon D, YYYY"). **Mini-me / welcome figure (v54)**: two selectable characters, config in `WFIG` (grid + display pitch `cw/ch/s` + optional `wave` descriptor), chosen by `welcomeFigure` (`'scene'` default | `'classic'`, dev panel ▸ "Welcome figure", persisted in `localStorage.pf_welcome_figure`; live-rebuilds if docked). `'scene'` = `MINIME2`, a **26×66 = 1120-glyph seated full-body figure** downsampled offline from a second Grainrad export (Downloads `ascii-scene (7).html`, 12,719 glyphs; scratchpad `gen_minime.py` box-averages luminance, ramp `' .:-=+*#%@'`, rows chosen to preserve on-screen aspect at the display pitch). `'classic'` = the original `MINIME` 30×48 headshot. Both render as gray image cells (`L=0..1`) like a cover, placed left of the calendar stack. **Greeting wave** (scene figure only, whole-arm since v65): the ENTIRE viewer-left arm is flagged in the layout as a two-segment limb — `WFIG.scene.wave.up` is the upper-arm grid box (`it.wave=1`, ~34 cells) and `wave.lo` the forearm+hand boxes (`it.wave=2`, ~67 cells; col 5 is the `.` torso separator and stays put, as do the lap-edge dots the old hand-only box used to drag along). Once the facet settles (`state==='hold'`) `updateWelcomeWave` drives forward kinematics in layout space: the upper arm rotates about the shoulder pivot (`sc,sr` → `lay.waveS`) by `b1·envelope`, the forearm+hand about the elbow (`ec,er` → `lay.waveE`, itself carried by the shoulder rotation) by `(b1+b2)·envelope` plus the wiggle — a raise, a ~1 s side-to-side wiggle, a lower, then a few seconds at rest, looped per the `WAVE_STYLES` profile. `welcomeWaveEnv`/`welcomeWaveWig` split the old single-angle profile into the raise/fall envelope and the oscillation; the style amps were tuned for the old short wrist lever, so `WAVE_WIGK` (0.55) scales them down globally, `WAVE_ARMSHARE` (0.35) bleeds a fraction of the wiggle into the upper arm so the whole limb sways, and the forearm samples the wiggle `WAVE_LAG` (110 ms) behind — a slight whip that reads as a loose natural wave. At angles 0 every glyph sits byte-exact on its settled `to`. `b1=-0.5,b2=-1.9` were validated against the real grid (scratchpad `arm_check.py`): the raised hand sits beside the head, below its top, and clears the section-nav column (right edge at `miX0−2.0`) even at peak wiggle (~0.06 momentary kiss on the longest label's edge). `welcome.waveItems` caches the flagged items per dock, reset in `releaseWelcome`/`assembleStop`. The classic figure has `wave:null` (static). To swap either figure regenerate its grid from the source export with `gen_minime.py`; the wave boxes/pivots are grid-coordinate constants in `WFIG` and must be re-checked against the new grid. **Section list (v60)**: a clickable menu of the OTHER five stops (welcome excluded), hung as a column left of the figure — each stop's rail label rendered in `BTN_FONT` stencil bitmaps (v61 removed the plain-text "SECTIONS" header and renumbered the nav waves 0-based) as *positive* letters made of `'#'` glyphs (the inverse of the punched-out buttons; the font gained C T U X for the labels). The labels are ordinary layout items (pass 2/3, absorb, handoff, restore all free) but flagged `nav:k`/`wd`, and they land **invisible** during the facet assembly (extras-style fade in `updateFacet`'s dirIn path — so nothing sits still in the corridor); once the facet settles, `updateWelcomeNav` writes them in banner-style — glyphs re-launched from their terrain homes into the letters, swept L→R per label (`wd`), one wave (`nav` index) at a time: `WNAV_DELAY` after `holdT0`, `WNAV_STEP` apart (dev panel ▸ Welcome Stop ▸ "Section list delay"/"pace", `pf_user_defaults` keys `welNavDelay`/`welNavStep`, read live at wave-launch so slider moves affect pending waves; look-away/back replays the whole sequence — detected by `F.t0` changing, which resets the per-item/per-button `shown`/write flags). Each label registers a `nav` hit rect in `lay.btns` (`data` = its STOPS index): hover pins it bright and **swells it ~1.13× about its own centre** (`b.sc` smoothed; position+scale writes only in `'hold'`, snapping byte-exact to `to`/`s1` when settled — never fights the flights), click = `departTo` that stop; unwritten labels don't hit-test (`b.shown` gate; the header is `noHit`). Nav labels skip the buttons' amber throb (steady 0.78 brightness — five labels pulsing in sync read as noise). The list adds ~11 layout units of width, so factory `WELCOME_SIZE` moved 0.80 → 0.90 (three places: slider HTML, the `ud()` default, `CTRL_DEF`) to keep the pre-existing content within ~9% of its old on-screen size; welcome's clearing ellipse stays smaller than the validated case-studies worst case, and the stop's glyph total (~2.4k) is nowhere near the pool. **Commit banner (the horizontal waterfall)**: NOT layout items — `reserveWelcomeBanner` claims ~30 terrain glyphs near the banner line BEFORE the facet partition (marked `owner=100` so pass 2 skips them; pass 3 skips reserved so they're never absorbed), and `updateWelcome`/`updateWelcomeBanner` animate them (v61: as a per-column stencil STREAM — each cell assembles, lingers, and dissolves on its own column clock, so a stat's head is dissolving while its tail arrives; see the v61 paragraph), advancing today → this month → this year → total. Idle banner glyphs sit invisible at home; `releaseWelcome` (called from `disassemble`) restores them fully so the face is intact on departure. **Stats data** comes from `data/stats.json`, written **ahead of time** by a GitHub Actions workflow (`scripts/fetch-stats.js` + `.github/workflows/stats.yml`) — the browser never calls the GitHub API or sees a token. `loadStats()` fetches it cache-busted (`cache:'no-store'`, `?t=`), polls every 60 s, and on localhost/`file://` with no real file falls back to `data/stats.sample.json` (obviously fake, for local preview); when fresh stats arrive while docked at welcome it re-`assembleStop`s. Everything degrades gracefully when the JSON is missing (placeholder empty calendar, "LOADING COMMITS" banner). All numbers are **public activity only** (the `read:user` token cannot see private repos) and bucketed in **Europe/Copenhagen**. See `README.md` for token rotation / troubleshooting.
