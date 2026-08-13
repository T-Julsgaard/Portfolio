# The journey: path, state machine, travel styles, auto tour, fullscreen

Deep reference for the camera journey over the portrait-as-terrain. Read this before touching the path, docking/departing, flight styles, the auto tour, or the fullscreen toggle.

## v88: uniform hollow rails with a short dock slide

The ABOUT ME and PORTFOLIO rails now have one marker language: every stop and every
project is a hollow circular node. `.current` and `.done` retain their semantic
classes for routing/state inspection, but no longer fill or glow the dot; project
rows no longer rotate a square into a diamond. `data-rail-style` is fixed to
`nodes`, and the Side-link markers selector plus its persisted Journey control were
removed. Do not reintroduce visual completion state through those classes.

Both rail columns are fully hidden and non-interactive whenever `#journey-rails`
lacks `.docked`. The left/right columns wait at -7/+7 px respectively, then fade and
slide to zero over roughly 160-180 ms when docking adds the class. This replaces the
v81 rule that kept previously revealed dots visible in flight; Roam and Welcome
still clear the rail wrapper through their existing state paths.

## v86: complete Portfolio rail and clean Roam reset

The right Portfolio rail is no longer a clipped native scroll viewport. All seven
destinations are displayed together, with `overflow-y`, the mask, scrollbar skins,
and the `railScrollSelect` Journey setting removed. `railStyleSelect` still controls
the dot/diamond/bracket marker treatment; wheel events over the rail remain isolated
from journey navigation even though the rail itself no longer scrolls.

`railRoam()` is now the single overview/free-roam reset. It clears `railSeen` and
removes `seen`, `docked`, and `at-welcome` from `#journey-rails`, so both columns and
their dots disappear immediately when Roam is pressed. Normal stop-to-stop travel
continues to use `railTravel()`, preserving the v81 behavior where already-revealed
dots stay visible during a flight. Intro replay and generator resets also use the
clean roam state.

## v85: selectable Portfolio scrollbar skins

The Journey panel now separates the rail's two visual layers. **Side-link markers**
(`railStyleSelect`) controls the dots/diamonds beside rows. **Portfolio scrollbar**
(`railScrollSelect`) controls the real native scroll track and moving thumb at the
far right of the clipped Portfolio list.

Four scrollbar skins are available: the original two-pixel **Hairline**, a rounded
**Soft capsule**, a minimal dashed **Segmented track**, and square-ended
**ASCII · |#|** with a dotted centre rail and stacked block thumb. The value is
applied as `data-scroll-style` on `#rail-portfolio` and participates in Journey
reset/user-default handling. Only presentation changes; wheel containment, native
thumb dragging, keyboard focus, and list routing remain intact.

## v84: selectable side-link rail markers

Journey settings now expose **Side-link markers** (`railStyleSelect`) for the
fixed ABOUT ME / PORTFOLIO rails. The choices are the existing circular
nodes/project diamonds, compact signal ticks, and ASCII-like brackets. The selected
value is applied as `data-rail-style` on `#journey-rails`; it participates in the
Journey reset and user-default system without changing rail state, scrolling,
keyboard navigation, or destination routing.

## v81: dock-expanded rails

The split ABOUT ME / PORTFOLIO rails now use explicit journey states instead of
hover-driven label reveal. `railTravel()` retracts the labels for entering, flying,
exiting, and overview resets; `railDock(k)` slides them back in over 180 ms at every
settled non-Welcome stop. Welcome applies `at-welcome`, hiding and disabling both
rails because the assembled stop already exposes the same destinations.

Native `title` attributes and the shared hover `peek` lifecycle are removed, so
hovering a dot no longer opens a browser tooltip. Hover/focus only brightens an
already expanded label. Dots remain visible during stop-to-stop travel once the
rails have first been revealed.

## v79: complete split rails and keyboard focus

Welcome is now the first destination on both post-entry rails. The left rail then
continues through Experience, Education, Interests, and Contact; the right rail
continues through Case studies and the named portfolio projects. Project rows are
text-only until their destinations exist.

The longer Portfolio rail is a deliberately short scroll viewport with a thin
scrollbar and faded top/bottom edges, so clipped rows advertise that more content is
available. Wheel input over either rail is contained there instead of leaking into
the docked scene. Up/Down plus Home/End move focus through every rail row, including
the text-only projects, and focused labels use the exact mouse-hover treatment. Only
rows backed by real stops have click/Enter actions.

## v78: complete keyboard entry and Welcome selection

In overview, any arrow key focuses the Enter control and Enter begins at Welcome.
Once Welcome is settled, all four arrows navigate its live About/Portfolio choices
and Enter activates the selected row. Other assembled-stop arrow behavior remains
unchanged: left/right rotate panorama facets, up/down drive vertical switchers, and
Work/Education up/down step their linear timelines.

## v77: Welcome-only re-entry and masked Raw handoff

The Enter button always calls `beginEnter(0)`. Returning to free roam no longer
turns the last `dockIdx` into an implicit resume point, so every new journey begins
at Welcome while normal rail travel still remembers the current stop inside the
active journey.

On exit, the continuously eased processed-to-Raw blend is unchanged. Once its
remaining processed contribution falls below 3.5%, `applyRaw(true)` now performs
the binary composer bypass during the final trace of camera motion rather than on
the first completely stationary overview frame. The checkbox and renderer route
therefore settle before the camera does, masking the last handoff.

## v76: split About / Portfolio rails

The one right-side journey rail is now two linked rails revealed by the existing
one-shot `railReveal()` lifecycle. Work, Education, Interests, and Contact sit on the
left; Case studies sits on the right. (v79 adds Welcome to both sides and the named,
text-only project rows to Portfolio.) `railEls` stores each live button with its real
STOPS index, so current/done state remains correct after the visual regrouping.
Hovering either rail toggles a shared wrapper `peek` class, revealing labels on both
sides at once. The wrapper itself never intercepts the canvas; only the two compact
nav columns accept pointer input.

## v74: continuous Welcome arrivals, dock-time processing, timeline drag-look

Every stop-to-stop travel style now calls `arrivalQuat(toIdx,pos,pathQuat,out)` for its final gaze. Ordinary stops still level out with `levelQuat`; Welcome instead converges on the exact position-dependent `welcomeLookQuat`. Cruise/classic recompute that target through deceleration and all swoop variants use it for their terminal quaternion, so the touchdown callback no longer replaces a path-facing quaternion with the horizontal face-centre gaze (the reported 90-degree cut). Roam-to-Welcome keeps the established direct target.

Entry remains Raw for the entire descent. `dock()` now starts the processed-render fade immediately before stop assembly, so fog, palette, bloom, vignette, tone mapping, and the arriving facet come in together after the camera reaches the journey stop. Exit still reverses processing into Raw.

Pointer drag-look is no longer suppressed when the active facet uses `scrollMode`. Work and Education retain wheel/click timeline navigation, but dragging the canvas now changes `freeYawT/freePitchT` exactly as it does at the other assembled stops.

## v73: processing handoff and full-view assembly setting

Entry/exit now use `journeyT` for both camera/FOV movement and the Raw/processed visual blend, removing the one-frame processing switch at Enter. Journey dev tools also add **Absorb full field of view** (factory ON, user-default aware): ON recruits the active camera frustum into the faced facet; OFF restores the narrower ellipse + content cone. The setting live-reassembles a docked stop.

The Work/Education scroll presentation keeps its left index as a persistent facet. `scrollFacets` alone participate in `timelineTo()`; `timelineFacet` stays active and moves one caret, so the list does not rebuild on every step.

## v72: left-side Welcome and linear timeline navigation

The Welcome waypoint moved to `xf:-0.58, yf:0.82`, putting the assembled composition on the portrait's left while preserving the surrounding terrain as the visible scene. Welcome is a deliberate camera exception: `welcomeLookQuat(pos,out)` points horizontally at `faceCenter`, and it is used by direct entry, flight touchdown, and `assembleStop()`. `buildWelcomeLayout()` uses `cx=0`, so the seated figure and central spine are exactly on that camera axis rather than merely centered inside an asymmetric authored layout.

Work experience and Education default to `timelineNav='scroll'`. Their explicit `scrollOrder` starts at the overview and proceeds newest to oldest. While docked there, wheel and either arrow pair step the internal timeline; clicking an ASCII list entry jumps directly to it. Crossing the list boundary continues to the adjacent journey stop. Auto tour uses the same timeline stepper. The Journey dev-panel setting **Experience & Education** switches to `rotate`, restoring the panorama, drag-look, and rotation-arrow behavior without changing other stops.

## Scene bounds and the path

Bounds/derived constants are computed once from the embedded `asciiData` JSON (13,268 `{x,y,z,char}` instances): `centerX/Y`, `spanX/Y`, `midZ`, `farDist`. Glyph grid spacing is `0.6` (x) × `1.0` (y) — used wherever code needs real neighbor/row adjacency.

**The journey** (v20+, replaces the old "descend through the portrait" model): the portrait is treated as terrain (glyph z = relief height). A centripetal Catmull-Rom path snakes over the face through 20 waypoints (6 of them exhibit stops since v57), altitude = local terrain max (`terrainH`, ±5×±3-cell window over `TERRAIN` heightmap) + `JCLEAR` (default 7), passed through a ±9-sample moving max (climb *before* hills) and 3 box-smooth passes, clamped to never dip below the safe height — collision-free by construction (validated numerically against the data). `pathPos(s)` is arc-length parameterized; `poseAt(s)` gazes `LOOK_AHEAD_U` (16 units) down-path with pitch clamped to ~11°–30° so every stop frames the landscape consistently. Content lives in the `JOURNEY` array (marked `EDIT YOUR CONTENT HERE`): per stop `{id,label,title,body,media:[{src,caption}],links:[{href,label}]}`.

## UI state machine

**UI state machine** (`uiState`):
- `overview` — free orbit via `OrbitControls`, as before.
- `entering` — flies from the current camera pose to a stop's pose (duration scales with distance).
- `journey` — two sub-modes (`jMode`): `docked` (holding a stop: idle breathing drift, hint visible; in assemble mode free 360° drag-look + facet firing, scroll charges the departure bar; in panel mode the classic damped mouse-look ±~30°/±17° where drag *or* scroll charges departure; 650 ms dock cooldown swallows trackpad inertia) and `flying` (three selectable travel styles — see below). **Cursor sway (v62, dev tools ▸ Journey ▸ "Cursor sway (docked)", default OFF, persisted `pf_cursor_sway`, `toggleCursorSway` in CTRL_DEF):** whether the docked camera follows the bare (undragged) mouse — the subtle ±~3° gaze sway in assemble mode (`lookTX*0.05`/`lookTY*0.04`) and the whole panel-mode mouse-look above. Off by default after a user report that the passive drift reads as unwanted movement; drag-look, breathing drift and departure charging are unaffected. `cursorSway` is read live each frame; turning it off mid-dock eases the panel look back to centre (the lerp target just becomes 0). **Travel keys (v68):** in assemble mode the arrow keys no longer travel — ←/→ rotate the docked panorama one facet step (`rotateDock`; nothing at single-facet stops), ↑/↓ drive the faced facet's vertical switcher (piano recordings / Earlier-roles slides / the Volunteering highlight list, via `facedSwitchFacet`), and the chess board still owns ←/→ for moves while it's up (`chessBoardActive`). Rail dots, space and PageUp/PageDown travel; panel mode keeps the classic arrow-travel. Esc exits to free roam; scrolling past either end gives a soft rebuff bounce.
- `exiting` — **Free roam** button; returns to the overview framing and re-enables OrbitControls.

## Travel styles (v44, split v47, v49 variants)

**Travel styles** (v44; **split into two settings in v47** — dev tools has separate "Travel — Adjacent stops" (`travelAdjacent`, default **cruise**) and "Travel — Far stops" (`travelFar`, default **swoop**) dropdowns. `departTo` picks per hop: neighbouring stops — index diff 1, i.e. scroll/arrow steps — fly `travelAdjacent`; jumps across the path — a rail-dot click more than one stop away — fly `travelFar`. `buildFlight(s0,s1,toIdx,mode)` takes the chosen `mode` explicitly; each departure snapshots its style into the `flight` object, so switching mid-flight is safe). The complaint driving this: classic maps ONE `easeInOut` over the whole arc, so a long trip (welcome→contact ≈ 294 units, capped at 6.5 s) gets sluggish multi-second ramps at both ends and a whipping middle over the snaking spline, with the damped quaternion visibly lagging. The styles: `classic` (the original: eased arc-length flight along the path, `dt*7` damped quaternion follow, `sin` FOV stretch — kept byte-identical in feel); `cruise` (the rail flown properly: a trapezoid velocity profile — `CRUISE_RAMP` 1.0 s sin²-eased acceleration/deceleration around a constant cruise speed `vc = clamp(18+D·0.14, ·, 48)` floored at `D/5.5` so total time caps ~6.5 s; adjacent stops ≈ 2.4–2.8 s, full run 6.5 s at steady 53 u/s; the closed-form integral lands exactly at D with v=0 — validated numerically. Gaze look-ahead grows with speed (`LOOK_AHEAD_U + v·0.55`, via poseAt's optional 4th arg) which irons out spline wiggle, the damped follow tightens with speed, a `chase` quaternion banks into turns from the smoothed yaw rate (cap ±0.26 rad, fades with speed → gone at landing), FOV boost rides actual velocity, and the last-`tA` deceleration blends `levelQuat` for the assemble-mode arrival); and `swoop` (off the rail entirely: rises from the exact current camera pose — no snap — glides a straight-line arc over the portrait and descends into the target; z = lerp + `hump`·sin(π·ek) where `hump` = max(3 + 0.09·horizDist, terrain requirement sampled at ~0.5-unit steps against `terrainH`+`JCLEAR`+0.4) — validated against the real `asciiData`: mid-arc clearance never dips below JCLEAR; duration `1.5 s + 16 ms/unit` capped 3.9 s, so the longest hop is one calm ~3.5 s arc instead of a 6.5 s rail sprint. Heading is constant (straight hop), so the gaze just pitches along the velocity (clamped ~[−41°, +8°]), slerping out of the departure gaze over the first 25% and into the (assemble-leveled) arrival gaze over the last 32% — no damped follow needed, zero lag by construction). All three land through the same `dock()` touchdown-pose blend (v41), so arrivals stay seamless. Only stop-to-stop flights are affected; `entering`/`exiting` are unchanged. **v49** added two further swoop variants to both dropdowns: `swoop2` (curved hop — quadratic-bezier bow in the horizontal plane instead of the straight line, raised-cosine sin² climb, gaze riding the velocity with a milder pitch clamp so it never stares down) and `swoop3` (same curve with a stronger bow, gaze locked on the destination — eye level at the arriving stop — plus a bank into the sweep that fades at both ends); both hump-validated against the terrain like the original swoop. Defaults are unchanged (`cruise`/`swoop`).

## Fullscreen + corner X (v47, opt-in v52) and rail label

**Fullscreen + corner X (v47; made opt-in v52).** The old top-left `#meta` "ASCII PORTRAIT · 13,268 NODES" label is replaced by `#fs-btn` — a minimalist ASCII-style fullscreen toggle (black fill, thin white border, a bare mono `X`, invert on hover) in the same top-left slot. Browsers refuse `requestFullscreen()` outside a user gesture, so there is no true on-load fullscreen: `fsFirst` (one-shot `pointerdown`/`keydown`/`touchend` listeners) requests it on the visitor's first activating gesture, and clicking the X toggles thereafter (`enterFS`/`toggleFS`, all guarded). The browser's own "press ESC to exit fullscreen" overlay is chrome that page code cannot suppress. **v52: auto-fullscreen is now OPT-IN and OFF by default** — dev tools ▸ "Fullscreen on enter" checkbox, persisted in `localStorage.pf_fullscreen`. `fsEnabled` gates `fsFirst`; when off the corner X is hidden (`#fs-btn` ships `style="display:none"` and `applyFullscreenPref` sets its visibility from the saved pref). Toggling the checkbox is itself an activating gesture, so `applyFullscreenPref(on,true)` enters/exits fullscreen immediately; "Reset defaults" turns it back off. **Rail label (v47):** the `.rail-stop.current .lbl { opacity:1 }` rule was removed — the current dot stays lit but its text only shows on hover (per-stop or `#rail:hover`), so leaving a stop to free roam no longer strands its label on screen. **Rail visibility + labels (v69, user request):** the labels dropped their `01 —` numbering (bare section names), and the whole rail starts hidden (`#rail` opacity 0 / pointer-events none) until the visitor first travels beyond Welcome — `departTo(k>0)` adds `.seen` (via `railReveal()`, one-shot per session), so the first dock at Welcome shows no wayfinding chrome and the rail fades in with the first departure, staying for the rest of the session.

## Flip-stop arrivals swivel mid-travel (v64)

Arriving at a `flip:true` stop (contact) no longer lands facing the void and pans afterwards: `departTo` sets `flight.flip` (assemble mode only) and the flying branch premultiplies the camera quaternion with `Rz(π·g)`, `g=easeInOut((prog−0.55)/0.43)` where `prog=(now−t0)/dur` — style-agnostic (classic/cruise/every swoop), composing with each style's own level-out so the descent IS the half-turn onto the scene, exact π at touchdown. `beginEnter`'s `entering` state flips its target quat outright. `dock()` keeps `freeYaw=0` for flip stops now (the `-π` pan is gone), so the contact facet fires on the first docked frame.

## rotateDock pitch (v64 fix)

`rotateDock` used to set `freePitchT=0` intending "level" — but in the docked pose math level is `freePitch=-pitch0` (`cp=pitch0+freePitch`), so every arrow press eased the gaze down onto the path pose's ground-stare instead of the facet. It now sets `freePitchT=-stopFacets.pitch0`; content sits dead-centre after any rotation.

## Auto tour (v58)

**Auto tour (v58, dev tools ▸ Journey ▸ "Auto tour (scroll-only)", default OFF, persisted `pf_auto_tour`).** A guided mode where the wheel is the only input. Free roam: the tour owns the camera (`tourUpdate` — OrbitControls disabled) and scroll drives progress `tour.pT` through `tourPose(p)`, a scenic arc (flank → CLOSE centre pass → other flank → home; p=0 and p=1 are both exactly the overview framing so arming/finishing never snaps); completing the sweep calls `beginEnter(0)` by itself. Docked: `tourLook` rotates `freeYawT` one facet-step (`2π/n`) at a time around the panorama, dwelling 6.2 s on developing covers / 5 s otherwise (`tourDwell`), looping forever (yaw kept wrapped by shifting freeYaw/freeYawT together; single-facet stops like welcome don't sweep). Scroll still departs (unchanged), and `departTo` past the last stop calls `beginExit()` instead of the rebuff bounce — the whole site becomes one wheel-driven loop. `tourReset()` runs in `beginEnter`/`beginExit`/the checkbox apply, so progress never leaks between modes.

## Stop markers: none

**Stop markers: none** (removed across v24–v25 at the user's request as wayfinding clutter). The v20 beacon system — numbered text plaques *and* the additive light pillars/beams — plus the breadcrumb path dots are all gone, along with their helpers (`makeSignTexture`, `roundRectPath`, `pickPlaque`/the plaque raycaster, `buildCrumbs`, `buildBeacons`, `syncJourneyPalette`, `BEAM_TEX`) and the "Path dots" dev toggle. **The flight path itself is unchanged** — only the visual overlays came off. Arrival at a stop is announced solely by the assembled text (or the HTML panel); stops are reached via scroll/drag, space/PageUp/PageDown, and the rail list (v68: the arrow keys work the stop itself in assemble mode).
