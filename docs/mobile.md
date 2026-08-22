# Mobile presentation

The mobile portfolio is a responsive presentation of the same `index.html`, scene, journey state, and content objects as desktop. There is deliberately no `mobile.html` and no duplicate copy deck. `JOURNEY`, each stop's `gallery`, `PORTFOLIO_PROJECTS`, GitHub stats, links, PDFs, games, and recordings remain the source of truth for both profiles.

## Invariants

1. A desktop content change must reach mobile through shared data, not a second hand-maintained markup copy.
2. The ASCII portrait, terrain flights, glyph assembly, cover development, and panorama remain the visual core on a phone.
3. Essential text and actions also receive native DOM semantics on mobile. No visitor should need to read 5 px projected type or hit a glyph-sized target.
4. Mobile-only code may change framing, controls, quality, and overlay presentation. It must not change desktop layout math.
5. Test portrait and landscape whenever a stop, overlay, fixed control, camera fit, or gesture changes.

## Profile selection

The small script in `<head>` adds `html.mobile-ui` before CSS paints. The decision is capability/viewport based, not user-agent based:

- coarse/touch devices whose short side is at most 600 CSS px and long side at most 1200 px;
- narrow phone-shaped viewports whose short side is at most 560 px and long side at most 960 px.

The class is intentionally persistent through rotation. A phone does not become the desktop interface in landscape. Test overrides are `?mobile=1` and `?desktop=1`.

`MOBILE_UI`, `REDUCED_MOTION`, and `SAVE_DATA` are captured once by the module. Do not turn the profile into a live width breakpoint: doing so would rebuild the renderer and interaction model in the middle of rotation.

## Viewport and safe areas

- The viewport uses `viewport-fit=cover`.
- `--safe-top/right/bottom/left` wrap `env(safe-area-inset-*)`.
- The root uses `100dvh` with a `100%` fallback and disables body overscroll.
- Fixed mobile chrome always includes the relevant safe-area variable.
- The canvas uses `touch-action:none`; scrollable sheets/forms use `touch-action:pan-y`.
- `visualViewport` is used only for keyboard offset. Keyboard-only resizes do not reallocate the WebGL composer.

## Mobile shell

`#mobile-shell` contains three pieces:

- `#mobile-nav`: persistent Previous / current-section details / Next / Roam controls. Primary targets are at least 48 CSS px, disabled at the ends of the six-stop journey, and update their accessible labels with the adjacent stop names.
- `#mobile-sheet`: a focusable, scroll-local dialog generated from the active shared stop object. It contains readable body copy, live GitHub figures, every gallery entry, project actions, methods/outcomes, reports, external links, games, recordings, volunteering entries, contact links, and a complete section index.
- `#mobile-coach`: a once-per-tab touch guide explaining drag, swipe, pinch, and the bottom controls.

Opening the sheet pushes a `pf:'sheet'` history entry. Browser/Android Back closes it first. Stop and overview states are also represented in History. A project launched from Details first removes the sheet entry, so its Back path is project → current stop → prior stop → overview; a sheet opened directly unwinds sheet → current stop. Popstate may arrive while entering, exiting, or flying, so pending sheet/project/stop targets are reconciled again at dock. When a sheet action is chosen, the code first removes the sheet history entry, then runs the queued action. Do not replace that with `replaceState`: it creates duplicate stop entries that require two Back presses.

## Scene framing

Desktop keeps its authored fit exactly. Mobile uses a separate scale path inside `assembleStop()`:

- Welcome and non-timeline gallery covers fit height first. Their wide composition may extend beyond the screen and is explored by drag/swipe; the sheet supplies the complete readable/semantic version.
- Timeline stops and non-gallery single facets add a width cap using the real docked `JOURNEY_FOV`, keeping their title/body inside the phone.
- Portrait uses a 0.74 presentation multiplier. Landscape begins from the old 1.30 boost but caps it against the height actually left after the fixed music/navigation bands; short landscape phones therefore do not place facet copy under chrome.
- Welcome project focus uses the same usable-height multiplier.

The overview distance remains the authored desktop distance on desktop. Mobile takes the maximum of that distance and horizontal/vertical fits derived from the real `spanX`/`spanY`, `BASE_FOV`, and current aspect. This prevents tall phones from cropping the face.

On a meaningful width/orientation change, `mobileReassembleDocked()` captures the active timeline slot or faced gallery entry plus its recording, chess game/ply, list selection, case-detail state, and Welcome project focus. It restores the old facet immediately, rebuilds against the new aspect, and reapplies nested state after the replacement facet reaches hold. Project previews and a focused contact form defer the rebuild until they close/blur; a physical width change noticed while the keyboard is open forces the deferred rebuild on blur. Address-bar height changes do not rebuild a facet.

## Touch gestures

The journey pointer controller tracks pointer IDs and captures touch pointers:

- one finger: drag-look;
- horizontal swipe over 52 px: snap one panorama facet, or step a timeline;
- vertical swipe: step a timeline or the faced recording/list selector;
- two fingers: pinch `dockZoomT` between the existing zoom bounds;
- tap: canvas action with a 14 px movement tolerance;
- mobile glyph buttons receive a small nearest-target fallback padding after exact hit tests.

A completed pinch consumes both pointer releases, preventing the last finger from accidentally activating a button. Pinch tracking exists only while actually docked; the second pointer cancels scrollbar ownership, and `pointercancel`/lost capture clears the complete gesture map and cursor state.

## Mobile surfaces

### Projects

The ASCII project focus remains in-scene, but a developed project becomes a safe-area-aware screen-space dialog rather than a 720×405 plane shrunk through a homography. Its 60 px header exposes the project name, primary action, repository, and Close. It traps focus, makes the canvas/chrome inert, returns focus to the stable section control, and unloads an interactive iframe on close so hidden timers/audio/network work cannot continue. Interactive projects use their responsive iframe size; desktop-only 1440 px sampling is disabled on mobile. Static screenshots remain contained without distortion.

### Chess

The existing 360 px board is centered as a solid-black screen-space surface. Portrait scales the board to the region between music and navigation; landscape hides the name bars and places the board beside a compact control grid. The control group is moved outside the scaled board on mobile, so all four move buttons remain real 48 px targets even when the board shrinks. Move buttons and the live move number have explicit accessible names/status.

### Contact

The glyph form still assembles behind the UI. Once settled, mobile shows a native fixed form with 16 px inputs, placeholders/autocomplete/input mode, a 108 px message area, 48 px Send, and an `aria-live` validation/submission note. Enter/Next advances through the single-line fields instead of submitting early; validation marks and focuses the first invalid field, and Send exposes its busy state. The form scrolls locally in short landscape viewports. Focusing an input adds `mobile-keyboard`, hides bottom chrome, and offsets the form from both `visualViewport` resize and scroll events; focusing Send does not enter keyboard mode.

### Read-more cards and piano

Legacy read-more cards become bottom sheets with readable 13 px minimum copy and touch-sized close/download controls. The semantic stop sheet includes all shared marks/actions and both piano recordings with captions, `controls`, `playsinline`, and `preload="none"`; playing one pauses its sibling and holds the music player. Large media is fetched only after intent.

## Music on phones

Desktop retains its established autoplay gamble. Mobile prewarms only the YouTube API script; it creates no player and attempts no audio at startup. If the API is ready, Play or speaker intent creates the player synchronously inside the activating gesture. If it is still loading, the first tap clearly becomes a prepare step and the ready state asks for a second Play tap, rather than spending the transient iOS activation. Script failures expose retry UI. All four controls and the revealed volume range are true 48 px targets; touch/focus or the speaker reveals volume without relying on hover. See `docs/music-bar.md` for the player state machine.

## Mobile rendering and lifecycle

- renderer DPR cap: 1.35, or 1 under Save-Data;
- mobile canvas antialiasing off; composer target uses unsigned-byte color and no MSAA;
- desktop retains DPR 2, half-float color, and 4× MSAA;
- the 13,268-glyph creation loop yields every 480 glyphs on mobile and reports progress through `#mobile-status`;
- normal phone startup uses the lighter surface reveal and does not allocate the progressive animation's extra 16,830 proxy glyphs; Save-Data or Reduced Motion reveals immediately at overview;
- WebGL context loss shows a restoring message and context restore forces a repaint;
- hidden tabs skip the 60-second stats poll and refresh once visible;
- Reduced Motion disables persisted auto-tour, shortens enter/exit, inter-stop, dock and facet flights, removes camera breathing, and collapses CSS animation/transition duration.

## Future-change checklist

For every portfolio change:

1. Put new copy/actions in the existing shared stop/project/gallery object.
2. Confirm `mobileRenderStop()` can represent any new data shape. Extend the renderer generically if necessary; do not hard-code a second copy of the content.
3. Check every new fixed element against safe areas, the music bar, bottom navigation, and the contact keyboard.
4. Ensure new controls are semantic, keyboard reachable, and at least 48 px on mobile.
5. If scene layout math changes, verify desktop and the mobile portrait/landscape branches separately and run the real-`asciiData` camera script.
6. If Case Studies glyph content changes, rerun the full glyph budget; mobile DOM does not consume terrain glyphs, but authored facet content still does.
7. Run esprima, then targeted screenshots at the affected stop in desktop, phone portrait, and phone landscape.

## Verification matrix

Automated Chromium checks should cover at least 320×568, 360×800, 390/393×844/852, 412×915, and 844×390. Exercise:

- cold load and overview fit;
- Welcome, its readable sheet, live stats, and a project surface;
- Work/Education intro plus a selected timeline card;
- Case Studies intro, developed cover, details/report actions;
- Interests chess controls and piano media;
- Contact idle, validation error, focused input, keyboard-safe scroll, and portrait↔landscape restoration;
- sheet/project/stop/overview Back behavior;
- touch target sizes, no horizontal document overflow, console errors, and WebGL restoration.

Before release, repeat on a real small iPhone Safari, a current notched iPhone Safari, a 360 px midrange Android Chrome device, and a 412 px Pixel-class Chrome device. Chromium emulation cannot prove Safari keyboard offsets, safe-area behavior, autoplay, inline video, real DPR/GPU memory, thermal stability, or VoiceOver/TalkBack behavior.
