# Facet Assembly Manual — how stops assemble content from the portrait's glyphs

Written after v43 (July 2026). This is the playbook for extending or modifying the
"assemble" stop-info system — adding galleries/covers/buttons to stops other than
**Case studies**, changing clearing behavior, or debugging glyph transitions. It records
what we built, *why* it's built that way, and the methodology that made v43 succeed.

---

## 1. The design principles (non-negotiable, from the user)

1. **Every glyph gets used. Nothing fades in place.** The identity of the site is that
   the portrait's characters *become* the content. A character that merely fades — or
   flies home and *then* fades — breaks the story. Any clearing mechanic must absorb
   glyphs into flights toward the content. Fade-in-place may exist only as an
   unreachable overflow fallback.
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
5. Nothing else: partition passes 2/3, handoff, cone, develop, buttons, READ MORE card
   all key off the facet definitions and just work.

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
