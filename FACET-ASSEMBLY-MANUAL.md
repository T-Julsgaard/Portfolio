# Facet Assembly Manual — how stops assemble content from the portrait's glyphs

Written after v43 (July 2026). This is the playbook for extending or modifying the
"assemble" stop-info system — adding galleries/covers/buttons to stops other than
**Case studies**, changing clearing behavior, or debugging glyph transitions. It records
what we built, *why* it's built that way, and the methodology that made v43 succeed.

---

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
