# Facet Assembly Manual — how stops assemble content from the portrait's glyphs

Written after v43 (July 2026). This is the playbook for extending or modifying the
"assemble" stop-info system — adding galleries/covers/buttons to stops other than
**Case studies**, changing clearing behavior, or debugging glyph transitions. It records
what we built, *why* it's built that way, and the methodology that made v43 succeed.

---

## v88 addendum: projected form fields and retained project surfaces

The Contact inputs are no longer positioned with an axis-aligned screen rectangle.
`updateContactForm()` projects every field's four world-space corners and feeds the
result to the same `cbQuadTransform()` homography used by the scene-mounted chess
board. Each control has a fixed internal canvas (`CF_DOM_PPU=64`) and
`transform-origin:top left`; width, height, font size, and padding are authored in
that internal coordinate system before the single matrix3d is applied. Keep all
four corners in the projection path. A two-corner translate/scale approximation
will make typed text swim outside its glyph frame as soon as drag-look introduces
perspective. Formspree failures now render only `Could not send right now.`

Welcome project previews now retain the already-loaded iframe when the live surface
folds back to ASCII. Returning to the same project reuses that document and applies
a deterministic 12x7 CSS-mask tile reveal while the `projectScreen` glyphs dissolve.
Do not clear `srcdoc` in `closeProjectLive()`; that was the source of the Danish map's
white reload border. `projectEmbedPatch()` also forces a dark Wind document backdrop.

Chess develops directly into the analysis workspace (board, moves, accuracy,
evaluation, engine, and the single Old Soviet coach); its former Analyze landing
screen is retired. DocuRAG develops directly into its Search/Ask mode chooser, with
the login surface and Logout control suppressed at the embed seam. The matching
ASCII screens must continue to depict those actual first surfaces.

The focused project stage is 25% larger than v87 (`WPF_SCALE=2.10`,
`WPF_VIEW_FILL=0.94`) and the side columns move to `WPF_SIDE_SHIFT=13.1` so their
visuals and hit geometry remain clear. Current validation is still 13,268 terrain
glyphs; Chess uses 861 records and Wind remains the largest project variant at 870,
so Welcome's 3,437 claims plus the active maximum leave 8,961 spare.

## v87 addendum: project previews mirror their real first screen

`projectStageArt()` is now a low-resolution composition of the first surface that
actually develops: the Chess Review toolbar popup, Entropy Forge's three-column
instrument rack, DocuRAG's login, the real Folium map plus collapsed Data Filter,
and Bitcoin Miner's title/menu. Keep this one-to-one relationship when a deployed
project changes; the ASCII is no longer a generic diagram of the project's idea.

The handoff starts after `PROJECT_PREVIEW_DELAY=1,150 ms`. Project-screen records
use `0.70 * photoStagger()` and `0.80 * photoTileMs()`; these project-only factors
make the morph brisker without changing the Journey's global image develop control.

The live bar has repository-first semantics. Every project gets OPEN REPOSITORY
(Chess uses the intentionally shorter OPEN REPO), Chess additionally gets GET
EXTENSION, and the old live-surface X is gone. `#pl-fullscreen` occupies that compact
slot only when a real GitHub Pages deployment exists. The assembled stage X remains
the close control for the whole project focus; Escape may still fold only the live
surface back to ASCII.

`desktop:true` renders a project's iframe at 1440x742 and samples it down by 0.5.
This is required for Entropy Forge's >=1080px rack and DocuRAG's full sidebar/topbar,
and it also improves text sampling under the outer homography. Do not remove the
inner scale while leaving those flags in the project records.

Wind is the explicit exception to the old lightweight-preview rule: the owner asked
for the real 11 MB `Interactive_wind_map_preview.html`, so it now loads as trusted
rebased raw HTML with the full Folium data and filter UI. DocuRAG is also rebased
through `srcdoc` so `projectEmbedPatch()` can hide its injected Preview badge and
capture `#delete-chat-btn` before the app's delete listener, routing X through the
existing Switch/knowledge-base path. Chess remains self-contained but now begins
with the repository's real popup design and continues into a static, PGN-driven
version of the repository's modular analyzer.

Current real-data budget after the compact v86 layout and v87 art update: 13,268
terrain glyphs; Welcome claims 3,437 and the largest project variant (Wind) needs
870, leaving 8,961 spare. The older 1,836 project-reserve figure below is historical
to the information-heavy v83-v85 layouts.

## v86 addendum: project stages develop without an OPEN button

`buildProjectStageLayout()` now lays out title, concise body copy, then the 16:9
ASCII screen. Do not restore the old index/kind/proof/meta/divider/button bands:
the selected terrain composition is the project's first view, and
`updateWelcomeProjectPreview()` develops it automatically only after the focus and
project facet both reach `hold` plus `PROJECT_PREVIEW_DELAY` (1,700 ms). The compact
stage is `21.5 x 19.0` layout units. Side columns use `WPF_SIDE_SHIFT=10.5`; their
visual targets and hit geometry must continue to share `welcomeProjectSideDX()`.

The live close path has a third `dismissPreview` argument. A visitor closing the
surface must get the assembled ASCII screen back without a reopen loop, so X and
Escape pass `true`; switching, departing, and teardown pass or default to `false`.
`previewDismissed` resets when a project is selected. Inline previews (`preview:
'chess'` / `preview:'wind'`) use trusted `srcdoc` in the same 720x405 homography as
deployed live projects, and all ordinary plus external donor records tagged
`projectScreen` still participate in the develop/reassemble dissolve.

Chess is deliberately a precomputed showcase: real PGN-derived positions and SAN,
but no browser Stockfish. Wind is deliberately lightweight: do not reintroduce the
upstream multi-megabyte raw HTML fetch, because that was the white-screen failure
mode. Its SVG layer is a required no-network fallback, not decorative duplication.

## v85 addendum: Welcome project focus reuses the assembled centre

Welcome's project facet is now centred on the main facet anchor and independently
scaled up to `main.f * WPF_SCALE` (`1.68`). `WPF_VIEW_FILL=0.84` caps both axes
against the docked FOV and current aspect. ABOUT ME and PORTFOLIO slide outward but must never
enter the project stage's fit calculation. Keep every visual and interactive side
coordinate on the shared `welcomeProjectSideDX()` path: row targets, headings,
scrollbar art, button centres, scroll hit rectangles, and drag tracks must agree.

The greeting/figure/calendar items carry `welcomePart:'center'`. On selection,
`startWelcomeProjectFocus()` creates external donor records from those already
assembled owners plus the completed keyboard-title proxies, assigns them across the
normalized project target set, and passes their target indices to
`configureProjectStage()`. The project facet must exclude those indices from its own
items and reserve only the remainder; drawing both sets at the same target creates
z-fighting and breaks the claim that the Welcome glyphs became the project.

External donors deliberately expose the small item contract used by project buttons
and live development (`m/to/s1/L/swapped/done/projectScreen/pD`). Whenever the live
screen loops project items, include `F.projectDonors` too. Project-to-project changes
retarget donors from their current positions; never send them home between variants.

The close path has a non-obvious handoff invariant. Because the project plane now
occupies the main Welcome corridor, its supplemental facet owners must release via
`facetOut(PF, now, false)`. `noHand=true` sends them home through the restored
identity scene and visibly floods the centre with portrait terrain. The still-active
main facet already has absorb records for them and is the correct receiver. Full
departure/look-away still uses the ordinary no-handoff teardown.

Budget remains the v83 budget: 3,437 Welcome claims + 1,836 project-reserve claims
out of 13,268, leaving 7,995 spare. Keyboard-title proxies are pooled glyphs rather
than terrain claims.

## v84 addendum: optional cover switchers and gated Welcome links

`switchArrows:false` is the supported way for a multi-`vids` cover to omit the
visual `addUDArrows()` pair while retaining caption clicks and keyboard switching.
Do not remove the `vids` array or special-case the input handlers to achieve the
same visual result.

Welcome side-column rows may be visually present before they are actionable.
`updateWelcomeNav()` keeps each row item's `shown` state tied to scroll visibility,
while the button's `shown` state also requires `welcomeIntroReady()`. Preserve that
split: hiding the row items until the title completes would reintroduce a second,
unrelated assembly sequence.

Timeline-arrow spacing belongs inside `addTimelineArrows()`. Its returned `top` and
`bottom` bounds must continue to include any larger gap so the list layout's fit and
clearing region remain correct.

## v83 addendum: Welcome projects use an auxiliary in-scene facet

The v82 projected DOM dossier is gone. Welcome now allocates one `projectStage`
facet on the **same world plane** as the main Welcome composition, offset just past
PORTFOLIO's right edge. It is excluded from `buildWelcomeLayout()` and the main
facet's fit calculation, so the greeting, figure, calendar, and navigation keep
their established scale. The stage has its own truthful width/height, cone, terrain
owners, and world anchor. It is explicitly selected from a project row and skipped
by the ordinary yaw-gaze loop; looking away from the main Welcome facet releases it.

All five project layouts share one fixed `PROJECT_STAGE_W` / `PROJECT_STAGE_H`
frame, the same 16:9 screen rectangle, identical information bands, and the same
OPEN PROJECT / VIEW CODE controls. `buildProjectStageReserve()` claims only the
largest layout once. `configureProjectStage()` retargets those same records and
restarts `facetIn()` from their **current** positions, so changing projects visibly
reorders the existing glyphs instead of changing card size or spawning a DOM panel.
Surplus union records fly into active targets and land hidden, following the same
max-layout reuse rule as in-scene READ MORE.

Every Welcome project row still needs its unique `wproject:<id>` kind. `btnKind` is
also the item-group key used for hover animation; one shared kind would merge all
five row groups. The stage's own controls use the stable `project-open`,
`project-code`, and `project-close` kinds.

Remote code still loads only after an explicit OPEN PROJECT. GitHub Pages demos and
rebased standalone repository HTML develop into `#project-live`, whose fixed
720×405 internal surface is homography-projected onto the stage's glyph screen
(the same technique as the chess board). It is not modal and has no viewport
backdrop. Closing it reassembles the glyph screen; departure tears it down. Project
previews never pause or resume the music bar.

Real-data validation: 13,268 terrain glyphs; Welcome claims 3,437 and the normalized
project stage claims 1,836, leaving 7,995 spare. Both facets claimed every requested
record.

## v81 addendum: timeline gaze parity and static lists

Scroll-mode Work/Education still share one forward yaw, but that does not make them
permanently active. `facetGaze()` must apply the same `F_GAZE_IN` / `F_GAZE_OUT`
hysteresis to the current content facet and persistent timeline facet together. Looking
away releases both through `facetOut()`; returning recruits both through `facetIn()`.
Do not special-case this with opacity or direct visibility writes, because that bypasses
terrain handoff and home restoration.

`staticList:true` is the non-interactive form of a cover `list`. Its rows are ordinary
facet items at equal emphasis: no `en`/`eh` highlight metadata, `esel` hit rectangles,
`elist` state, switcher arrows, or entry-gated download. It is intended for short lists
whose entries are all simultaneously valid, such as Volunteering.

Welcome's reserved banner pool now performs a `prepare` flight from each glyph's real
terrain home into the hidden under-calendar strip. The reserve must never be hidden
directly on arrival: reserved glyphs are excluded from normal facet absorption, so a
direct hide produces an obvious instantaneous hole in the portrait.

## v79 addendum: timeline arrow bounds

The optional Work/Education timeline controls are centered above and below the list.
Because those controls now extend the composition vertically, `addTimelineArrows()`
returns its top and bottom bounds and `buildTimelineNavLayout()` folds them into
`lay.h`. Keep that contract if the artwork, cell size, or list gap changes; otherwise
the fit and clearing ellipse will be computed from the rows alone and can clip the
controls.

## v78 addendum: keyboard Welcome nav and boundary-aware timeline arrows

Welcome's live side-column buttons can be selected with all four arrow keys and
activated with Enter. The selected button reuses the normal hover/swell state; clear
`welcomeKeyBtn` whenever Welcome is rebuilt or released so a stale facet record can
never survive a journey transition.

Scroll-mode Work/Education may add a matched vertical version of `ROT_ARROWS` to the
persistent timeline facet. The two controls are allocated once with the list. Their
`tlDir` metadata and `syncTimelineArrows()` hide the impossible direction at each
boundary (down only at the overview, both in the middle, up only at the end). Do not
rebuild the timeline facet merely to change arrow visibility.

## v77 addendum: Welcome row pitches and direct scrollbar input

Welcome row spacing is now per group (`lay.wsPitch`), because a no-scroll five-row
ABOUT ME column must fit the same vertical span as PORTFOLIO's four visible rows.
Every target rewrite in `updateWelcomeNav()` must use that metadata; falling back to
the global `WNAV_PITCH` would make the compact rows jump apart after the first
interaction.

The in-scene bars remain ordinary facet items, but `lay.wsBars.xs` records their
track positions for pointer hit testing. Track click/drag maps the pointer's
facet-plane Y coordinate through `welcomeScrollTo()` and temporarily owns the drag,
so camera look cannot compete with thumb movement. Arrow glyph controls and wheel
scrolling still use `welcomeScrollBy()` and the same integer scroll positions.

## v76 addendum: detail morphs are shared, timeline skins are layout-only

`more` is no longer a Case-studies-only switch in assemble mode. Every gallery cover
with authored detail sections builds `buildCaseDetailLayout()` and passes through
`mergeCaseLayouts()`, still reserving `max(base.items, detail.items)` rather than
their sum. Scroll-mode Work/Education must shift **both** layouts by the same x offset
before merging; otherwise READ MORE visibly jumps across the persistent index.
`toggleCaseMore()` / `resetCaseMore()` retain their historical names but are now the
shared in-scene detail lifecycle. The HTML more-card is fallback only.

Timeline list variants belong entirely inside `buildTimelineNavLayout()`. A variant
may change type size, row pitch, separators, caret character, and hit rectangles, but
must return one persistent facet with `timelineY` and `timeline`-tagged buttons.
Never duplicate the list into content facets or alter `timelineTo()` handoff ownership.

## v75 addendum: case details reuse their cover glyphs

Case-study READ MORE no longer opens `#more-card`. `buildCaseDetailLayout()` authors an
alternate Context / Methods / Outcomes layout; `mergeCaseLayouts()` reserves
`max(cover.items, detail.items)` terrain glyphs for the facet, and `toggleCaseMore()`
morphs those same records between the two target sets. Never concatenate both layouts:
the Cases stop is still the binding pool user, and allocating their sum would overflow.
Items unused by one state fly into an active target and land hidden, following the same
"fade only at the destination" rule as absorbed terrain. The developed cover folds on
READ MORE; READ LESS restores the base specs and re-arms the normal photo develop.
`facetOut()` resets a detailed case to its cover before sending its owners home.

Buttons are rebuilt from the active layout. DOWNLOAD therefore remains beside
READ MORE / READ LESS, and hit testing is disabled during the morph. The HTML card
remains the correct implementation for Work/Education `more.sections`.

Cases now use sequential yaw assignment `-(i+1)*step`, so rotating right walks the
authored P1→P6 order. This only permutes the same six non-intro slots; spacing, gaze
windows, cones, and the seven-direction angular set are unchanged.

Real-data validation for v75 (stream arrows, the worst style): 13,268 terrain glyphs;
Cases claim 12,959 and leave 309 spare. Every detail layout is smaller than its cover,
so the merged maximum adds no new binding claims.

## v74 addendum: scrolled Welcome facets and unified development clocks

Welcome's ABOUT ME and PORTFOLIO columns may contain more authored rows than are visible. Every row is still partitioned once as ordinary `F.items`; `ws/wsr/wsBaseY/wsDY` metadata lets `updateWelcomeNav()` move the active four-row window without reallocating or changing ownership. Off-window items must stay invisible and their `b.shown` flag must stay false, or button pulse/hit testing will fight the scroll window. `baseTo` is updated alongside `to` after a scroll so hover/swell and departure restore remain coherent. The ASCII scrollbar itself is facet content (`wsBar/wsThumb/wsControl`), not a DOM layer.

Photo-like reveals must use `photoStagger()` and `photoTileMs()` rather than hard-coded timing. They are the shared user-adjustable clock for developed covers, calendar tiles, video stills, and the chess square reveal. The fixed `PHOTO_DELAY` is intentionally separate.

Contact marks are laid out from visible-ink bounds, not padded author grids. If a mark is replaced, keep the trim step for row width, draw origin, and hit rectangles; otherwise asymmetric padding reintroduces optical miscentring.

## v73 addendum: full-view absorption + persistent timeline index

`toggleAbsorbView` (Journey dev tools, factory ON) expands pass 3 from the ellipse/cone to the active facet's complete 80° camera frustum. `viewHalfP=JOURNEY_FOV/2`; `viewHalfY=atan(tan(viewHalfP)*camera.aspect)`. Full-view members are correctness claims like cone members and therefore bypass `F_EXTRA_MAX` rather than falling into the fade fallback. Turning the setting off restores the v43 ellipse + exact-content-cone behavior. Real-data sampling at the six waypoint cameras measured 311–11,656 visible members out of 13,268; the record count is intentionally allowed to exceed the old ~9k corridor budget.

Scroll-mode Work/Education now build the left index once as `timelineFacet`; `scrollFacets` contains only the overview/cards that swap. `facetGaze()` keeps the index active while `timelineTo()` hands terrain between content facets, and a single caret record eases between `lay.timelineY` rows. Do not duplicate the index into each card again: that makes the same list assemble twice from two exclusive owner sets. `shiftLayoutX()` gives the changing content a truthful rightward composition while updating image/button coordinates and fit/cone width.

## v72 addendum: linear timeline facets

Work experience and Education have a second navigation presentation selected by `timelineNav` (factory `scroll`; classic `rotate` remains available). Scroll mode does **not** create a separate content system: it builds the normal intro/gallery facets, orders them with the stop's explicit `scrollOrder`, gives every content facet the same yaw, and moves only the active facet through the shared forward reading plane. As of v73, one persistent `timelineFacet` owns the clickable ASCII index; the v72 per-layout duplication was removed.

The handoff invariant still applies. `timelineTo()` activates the receiver before calling `facetOut()` on the sender; `facetOut()` remains the sole transfer point through `byMesh`/`hold`. Each item keeps an immutable `baseTo`; `updateTimelineMotion()` adds the temporary vertical offset and never overwrites the canonical target. Departure still sets `noHand=true`. Test overview -> adjacent -> non-adjacent click in both directions, plus switching the dev control between scroll and rotate while docked.

Real embedded-data validation for this implementation: 13,268 terrain glyphs; Work claims 4,646 (8,622 spare), Education claims 3,040 (10,228 spare). The new ASCII indexes therefore do not approach the binding Case-studies budget.

## 1. The design principles (non-negotiable, from the user)

1. **Every glyph gets used. Nothing fades in place.** The identity of the site is that
   the portrait's characters *become* the content. A character that merely fades — or
   flies home and *then* fades — breaks the story. Any clearing mechanic must absorb
   glyphs into flights toward the content. Fade-in-place may exist only as an
   unreachable overflow fallback. **Explicit welcome exception (v71):** the default
   keyboard-style greeting is not facet content and does not clear or borrow terrain
   glyphs; it allocates temporary `'#'` proxies and releases them on look-away/departure.
   All other welcome content, including both side groups, follows the normal rule.
2. **Nothing may sit still between the visitor and the content.** The test is a *cone*
   from the eye through the content rectangle (text/image/buttons) out to the content
   plane — everything inside it joins the assembly. But do NOT clear the whole field of
   view (that was scrapped v42's mistake — it ate the background and looked empty).
3. **The settled scene must be pixel-identical** to how it looked before any
   optimization/refactor (see memory: user is on older hardware; no quality trades).
4. **External documents (PDFs) open in a new tab** — never navigate the site's tab.

## 2. Architecture (v43) — the moving parts

All code lives in one place in `index.html`/`vN.html`, between the
`THE ASSEMBLED STOP` comment banner and `updateAssembly()`. Key objects:

- **Facet `F`**: one hung content block (intro text, or a gallery cover). Fields:
  `yaw/dist/dir/right/up/anchor/f` (placement), `Ry/Rp` (ellipse half-extents =
  content half-extent angle + 0.15 rad), `coneY/coneP` (cone half-extents = content
  half-extent angle + 0.06 rad), `state` (`home|in|hold|out`), `items`, `extras`,
  `fades`, `btns`, photo fields.
- **Item** (`F.items[]`): an *exclusive* letter of the facet's text/cover. Created in
  partition pass 2. Carries `home`, `geo0` (home geometry), `to`, `geoA` (letter
  geometry), `s1`, flight fields, and `handed` (v43).
- **Extra / absorb record** (`F.extras[]`): a *non-exclusive* claim on any glyph inside
  the facet's ellipse or cone. Created in pass 3 — **every** facet whose patch contains
  a glyph gets its own record (records overlap between facets). Carries `home`, `g0`,
  `own` (the facet whose *item* this glyph is, if any), and **self-clocked flight
  state**: `mode` (`null|'in'|'out'`), `st` (absolute start time), `to/from/ctrl/s0`,
  `swapped`, `done`.
- **`stopFacets.byMesh`**: Map from glyph proxy → all its absorb records across facets.
  This is the handoff lookup.
- **`m.userData.hold`**: THE arbiter. Names the facet currently animating a glyph as an
  absorb. Every extras/fade path cedes the instant it doesn't hold the glyph; owners
  reclaim their letters by clearing it (`facetIn` items set `hold=null`).
- **`F.fades[]`**: budget-overflow only. `F_EXTRA_MAX` (9000) was raised past the
  measured worst case (~7.2k members) precisely so this list stays ~empty.

### The lifecycle

- **`assembleStop(k)`** (once per dock): builds facets from `STOPS[k]`
  (+ `st.gallery`), then partitions all 13,268 glyphs:
  - *Pass 2*: each facet claims its letters exclusively (nearest to anchor,
    reading-order paired).
  - *Pass 3*: per glyph × per facet — skip own letters; skip `depth<0.2`; compute
    ellipse `e` (jittered rim, near-field widening) and `cone`
    (`depth<F.dist+2 && dy<coneY && dp<coneP`). Membership → absorb record
    (cone members bypass the budget); overflow → fade entry.
- **`facetIn(F)`** (gaze enters ±23° yaw): items launch (owner claims, `hold=null`);
  extras launch via `launchAbsorb` *unless* the owner or holder is actively displaying
  (`in|hold`) — an `'out'`-state owner/holder is stolen from mid-flight.
- **`facetOut(F)`** (gaze leaves ±35°): for each departing item/extra, `handTarget`
  checks `byMesh` for an active facet that wants the glyph. If found → `launchAbsorb`
  into it (**the handoff** — glyphs fly straight from old content into new; items set
  `handed=true` so their stale home flight can never resume). Otherwise → home flight.
  `disassemble` passes `noHand=true` (departure: everything genuinely goes home).
- **`updateFacet`**: extras animate FIRST, outside the `in/out` gate, each on its own
  clock — that's what lets a facet in `'hold'` still receive handoffs. Landing and
  restore paths fully restore `g0` geometry, `asmRestColor()`, `userData.asm`, and
  clear `hold`, so ownership can bounce A→B→A indefinitely.
- **`restoreFacet`**: skips anything an *active* facet still holds (that facet restores
  it itself) — this makes instant `disassemble(true)` order-independent.

### Why the gaze hysteresis forces the handoff

Facets fire within 23° and release past 35°, spaced 51.4° apart. So when you drag from
facet A to neighbor B, **B fires ~7° before A releases** — both are briefly active. At
B's `facetIn`, A's letters are still displayed, so B must cede them; the *only* correct
moment to transfer them is A's `facetOut`. That's why handoff lives there, and why
records must be self-clocked (B is already in `'hold'` when the glyphs arrive — a
shared per-facet clock like `F.t0` could not animate them).

## 3. Adding a gallery (covers + buttons) to ANOTHER stop

The machinery is generic — nothing in it is Case-studies-specific. Steps:

1. **Content**: give the stop's entry in `STOPS`/`JOURNEY` a `gallery:[...]` array.
   Each entry: `{img, title, sub, tags, blurb, pdf, more:{context,methods,outcomes},
   ascii?}`. `pdf` ⇒ DOWNLOAD button, `more` ⇒ READ MORE button (built by
   `buildCoverLayout`, hit-tested by `facetButtonHit`).
2. **ASCII covers**: add entries to `ASCII_COVERS` (34-col grids, ramp `' .:-=+*#%@'`).
   Generate offline from `images/*.png`: box-downsample, invert bright-paper covers
   (`val=1−L`), ramp index `1+round(val·8)` so the floor is `.` never space (full-frame
   fill — subject-shaped covers develop wrong). Add the real page to `COVER_PHOTOS`
   as a 512px data-URI JPEG (external files taint WebGL under `file://`).
3. **Spacing**: `assembleStop` rings gallery facets at even `360/(n+1)` (intro holds
   the 0° slot). With a different cover count, keep the fire windows non-overlapping:
   spacing must exceed 2×`F_GAZE_IN` (~46°) — i.e. **max 6–7 facets per stop**.
4. **VALIDATE THE GLYPH BUDGETS — both of them — before shipping** (see §4). This is
   the step that silently breaks: pass-2 items are exclusive, and the last-claimed
   cover gets shorted if the layouts outgrow the 13,268 pool (v41 measured ~12.9k used
   with 6 covers + buttons; only ~400 spare). Shorter titles/blurbs, or fewer covers,
   is the fix.
5. Non-case galleries continue to use the READ MORE HTML card. Case studies instead
   build and merge an alternate layout as described in the v75 addendum; pass 2/3,
   handoff, cone, and develop still key off the merged facet definition.

## 4. The methodology (why v43 worked — do it this way again)

1. **Reproduce the complaint in the state machine, not the pixels.** The "fly home then
   fade" bug was found by tracing the *timeline*: B fires (cede) → A releases (home
   flight) → A restores (`state='home'`) → B's fade entry finally applies. Once the
   ordering was written out, the fix (handoff at `facetOut`) was obvious. Trace state
   transitions on paper before writing code.
2. **One arbiter, not scattered flags.** Early designs tracked "guests"/"handed" lists
   per facet and drowned in edge cases (re-fire during handoff, departure mid-flight,
   instant restore ordering). The breakthrough was a single `userData.hold` field +
   "every path cedes the moment it doesn't hold the glyph". When adding any new
   animation path: *set `hold` when you take a glyph; check `hold` every frame; cede
   silently when you lose it.*
3. **Self-clocked records over shared clocks.** Any flight that can start "later"
   (handoffs, steals) needs its own `st`/`mode` — a shared `F.t0` only works for
   flights launched in the same instant as the state change.
4. **Hunt the races explicitly.** For every "glyph is animated by X" claim, ask: what
   if X finishes/restores while Y's stale flight timing still overlaps? That's what
   produced the `handed` flag (a stale home flight would resume after the receiver
   finished). Also: `restoreFacet` runs in arbitrary order at `disassemble(true)` —
   restores must be idempotent and hold-guarded.
5. **Validate data-dependent geometry against the real `asciiData` in Python.** Node
   isn't installed; Python 3.11 is. For v43 we extracted the embedded JSON and simulated
   pass 3 (camera at terrain max + `JCLEAR`, 7 facets, real ellipse/cone math) at
   several poses to *measure* corridor membership (~7.2k worst case) and set
   `F_EXTRA_MAX` above it — instead of guessing and shipping a fade regression.
   Re-run this whenever: the portrait data changes, facet count/spacing changes, or
   `Ry/Rp/cone` margins change.
6. **Syntax-check every edit**: extract inline `<script>` blocks, parse with the
   `esprima` pip package (`parseModule` for the main module). The file is 1.4MB —
   don't trust eyeballs.
7. **Versioning discipline**: never overwrite an existing `vN.html`. Copy the last-good
   version to `v(N+1).html`, edit that, then copy over `index.html`. A scrapped version
   burns its number (v42).
8. **End state must equal the old end state.** The v43 rework changed *how* glyphs
   leave (flights vs fades) but the settled scene is identical: content assembled,
   corridor black, terrain restored on release. Check invariants: absorbed glyph lands
   `opacity 0, visible false, at letter pos`; restored glyph is `geometry geo0/g0, home
   pos, scale 1, opacity 1, asmRestColor(), asm=false, hold=null` — on **every** path
   (landing, restore, steal, invert toggle).

## 5. Known pitfalls (each of these bit us once)

- **Geometry leaks**: any record that can carry a letter-swapped glyph must store the
  home geometry (`geo0`/`g0`) and restore it on *every* exit path, incl. mid-flight
  swap at `p>=0.5` and hard restore.
- **The overflow fade is the only remaining fade** — if the user reports fading again,
  first check `F.extras.length` hitting `F_EXTRA_MAX` (re-run the §4.5 measurement).
- **`noHand` on departure** — without it, `disassemble`'s facet-by-facet release hands
  glyphs to facets that are themselves about to leave.
- **Don't let flights fight**: opacity writers use `Math.max(current, ramp)` on the way
  up; only one system may own `scale` at a time (buttons write scale only in `'hold'`).
- **dt cap (50 ms) in `frame()`** protects arrival easing from the heavy dock-frame
  partition — don't add per-frame work to `assembleStop` callers without it.
- **Browser check matters**: preview tooling is software-rendered and rAF-throttled;
  judge animation *feel* only in a real browser. What to test after any facet change:
  adjacent-facet transitions both directions, look-away/look-back rebuild, photo
  develop + fold, departure (nothing strays), Free roam (portrait fully intact),
  invert + raw modes.

## 6. Quick reference — constants (v43 values)

| Constant | Value | Meaning |
|---|---|---|
| `F_GAZE_IN` / `F_GAZE_OUT` | 0.40 / 0.62 rad | fire under ~23°, release past ~35° (hysteresis ⇒ overlap window ⇒ handoff) |
| `F_IN_MS` / `F_FLY_MS` | 1500 / 850 | assembly window / one glyph's in-flight |
| `F_OUT_MS` / `F_OUT_FLY_MS` | 900 / 620 | scatter window / one glyph's home-flight |
| `F_EXTRA_MAX` | 9000 | absorb-record budget per facet (> measured ~7.2k worst case) |
| `Ry/Rp` margin | +0.15 rad | ellipse beyond content extent |
| `coneY/coneP` margin | +0.06 rad | cone beyond content extent (depth-gated: `depth<dist+2`) |
| near-field gate | `depth<0.2` | skip glyphs beside/behind the visitor |
| rim near-widening | `×(1+(10−vlen)·0.06)` | closer glyphs clear sooner |
| `ASM_DIST` / `ASM_IMG_DIST` | 21 / 18 | text / cover plane distance |
