# PROGRESS.md — Ateljé Sällström

**Branch `main` at `bb36adc`, tree clean** before this wrap-up commit (which only touches PROGRESS.md and
CLAUDE.md). Everything is pushed. The 2026-10-05 session was again the exhibition animation in After
Effects, which lives outside git (see below). The website was not touched.

## Where things stand

**Website** — unchanged since 2026-09-24. Opening hours lör–sön 12–18, mån–tis 15–19 are committed
(`63ab7d4`) and deployed. No tests or build exist; verification is opening the HTML and checking the
JSON-LD parses. Nothing on the site is half-done.

**AE animation** — `C:\Users\ROBIN\SynologyDrive\02_Internal\01_Projects\atelje-sallstrom\02_Projects\01_AE\MellanStadochDrom_V01.aep`,
comp `MellanStadochDrom_MC` (2560×1440, 30 fps, now **60 s**). The .aep on disk was saved 2026-10-05 22:30.
At wrap-up AE stopped answering the ae-vision panel, so it's unknown whether later changes were saved.
The comp is a seamless day→night→day loop:
- **Cycle:** day 0–20 s, fade 20–25, night 25–55, fade 55–60, then loops to 0. The single master fade is
  4 opacity keys on `salen22_night_V02_Upscaled.png`. Everything night-related follows it by expression:
  Water Ripple, Water Glimmer (×0.7), Aurora A/B, and Window Lights. Window Lights' layer opacity is
  `ease(n,30,100,0,100)`, so the windows light up late in dusk.
- **Water (night):** `Water Ripple` is a masked copy of the night painting with a Displacement Map from the
  hidden precomp `Water Ripple Map`. `Water Glimmer` (Add mode) has a Linear Color Key removing blue by hue
  plus an Extract floor of 30, and is luma-matted by the hidden precomp `Water Glimmer Map`.
- **Night canvas crop:** a "Canvas Crop" mask (comp x 272→2289) on the night painting removes the gray wall
  strips it has but the day painting doesn't. Ripple and Glimmer carry the same mask in Intersect mode.
- **Aurora:** `Aurora A` and `Aurora B` play the same 10 s clip, B offset by 5 s through a time-remap
  expression. They run 20–60 s with a 1 s crossfade at each loop seam (`half = 0.5` in both opacity
  expressions), luma-matted by the hidden `Sky Matte` layer.
- **Sky matte:** `01_Assets/03_GFX/07_Utility/salen22_night_V02_SkyMatte.png` (Synology folder), made by the
  `.py` beside it (HSV sky key + region connected to the top + hole fill). Regenerate it if the night
  painting changes.
- **Seal (daytime, 0.8 s to about 17 s):** precomp `Seal`, built from shape layers in the painting's naive
  style, placed under Window Lights. The acting is keyframed sliders on the `Seal Rig` null inside the
  precomp (Turn/Lift/Tilt/Sink/Wake/Back/Roll). The route is 4 position keys on the main-comp `Seal` layer.
  Checked on single frames only; **Robin hasn't seen it in a real-time preview yet.**
- **Window Lights** (from 2026-10-04) is unchanged apart from the opacity link above and its span, now 0–60 s.

## Next action

1. Exhibition is 10–13 Oct. Check with Robin whether the newsletter and Instagram post from
   `marknadsforing/vernissage_texter.md` were sent. That folder is on the Mac, not this PC.
2. Open AE and check that the 'AfterEffects MCP Agent' panel is connected and no dialog is open. Confirm the
   project has no unsaved changes and contains `Seal`, `Aurora A`/`Aurora B` and the "Canvas Crop" masks.
   If any are missing, the 22:30 save predates them, so rebuild them from the description above.
3. RAM-preview the whole 60 s loop with Robin, especially the seal and both fades (20–25 s, 55–60 s), then
   apply the notes. To retime the seal, use the `Seal Rig` slider keys; to change its route, use the
   main-comp position keys.
4. After the exhibition (14 Oct+): move the Om oss timeline entry from ”Kommande” to past, remove the
   `#utstallning` banner or turn it into a recap, and drop the ExhibitionEvent JSON-LD.

## Dead ends

- Window detection by colour (OpenCV, hue 8–34): a single threshold either missed dim windows or merged
  beige facades into one blob. What worked: lit panes S≥135 & V≥120 (beige walls are ~S115/V115), close
  11 px to join panes, then two looser passes keeping only non-overlapping window-shaped blobs; exclude
  bridge light strings and water (y>1730). The script is **gone**. Parked; rewrite from this description
  if the windows need re-detecting.
- Soloing layers via script fails on disabled layers ("Solo flag can not be set…"). Won't work; toggle
  `enabled` instead.
- Glimmer via brightness (Extract black point 140): only a few bright spots glimmered. Won't work for even
  coverage; use hue keying instead.
- Linear Color Key "Keep Colors" on its own does nothing without an earlier key on the same layer. Won't
  work; key out the blue instead.
- Sky matte with looser thresholds (S≥70) ate into the dark navy building left of Folkskolan. Won't work;
  use S≥100, V≥35.
- The old disabled `water-night` layer's mask was drawn for another image scale and doesn't match the
  current framing. Parked.

## Decided (by Robin)

- Opening hours lör–sön 12–18, mån–tis 15–19; vernissage the whole Saturday 12–18 (2026-09-24).
- Commit and push straight to `main`, no branch or preview (2026-09-08).
- Wanted: per-window adjustment masks, some brighter, some animated; sliders for flicker, breathe and
  intensity (2026-10-04).
- 2026-10-05:
  - water ripple + glimmer, with the glimmer selected by colour, not brightness;
  - a sky matte so the aurora sits behind the buildings;
  - day ≈20–25 s and night ≈30–40 s, looping;
  - window lights linked to the night fade;
  - gray strips cropped off the night layer;
  - crossfades at the aurora loop seams;
  - a daytime seal that swims, slows, peeks around, swims more and dives, in the painting's style.

## Assumed (by Claude, not confirmed)

- Matching the PNG via parenting to `salen22.jpg` with the V02 layer's slightly non-uniform scale (Robin said "yes" to applying).
- Brightening via Exposure +1 stop; windows only brighten, none darken.
- Animation mix (~6% flicker, ~10% breathe, ~6% switch-on), random seed 22, and the switch-on flicker style.
- Clock faces and boat windows count as windows; 4 detections in water/lamps removed.
- The exact cycle numbers (0–20 / 20–25 / 25–55 / 55–60). This reads "20–25 s" and "30–40 s" as durations,
  counts each fade half to each side, and keeps Robin's 60 s comp length.
- The second aurora layer, gone before the sky-matte step, was removed by Robin on purpose.
- Window lights switch on at 30% night, and are linked via layer opacity, not the Intensity slider.
- Glimmer values: key colour, 25% hue tolerance, Extract floor 30, speckle matte Brightness −55 / Contrast 300.
- Ripple values: displacement 8 horizontal and 1.5 vertical, the water mask polygon, and that the water
  effects fade with the night.
- Canvas crop at x 272–2289. The night canvas's right edge is skewed, so 1–3 px at the top right may show
  the day painting's edge.
- A 1 s aurora crossfade, and that the clip actually has a visible seam (never checked).
- All of the seal's design: size (~64 px head), route, timing, colours, look, and that it isn't parented to
  `salen22.jpg`.
- Roadmap: `nextAction` kept as the vernissage sendout, and an "Exhibition animation" milestone added as `in_progress`.

## Open questions

- Were the newsletter and Instagram post sent? — Robin; blocks marking the roadmap milestone done.
- Does the seal's look and timing work? — Robin, after a preview; seal polish depends on it.
- Should some windows switch *off* (needs a second, darkening adjustment layer)? — Robin; nothing blocked.
- Should the disabled `water-night` / `salen22_night_V02.jpg` layers and the stray `Grimkeep_A03_IntroCinematic`
  auto-saves in `02_Projects/01_AE/` be deleted? — Robin; housekeeping only.

## Re-verify before trusting

- Whether the .aep holds the 2026-10-05 work (disk save 22:30; AE unresponsive at wrap-up).
- Real-time playback. Every check was a single-frame render: the seal motion, the aurora seams at
  30/40/50 s and the 60→0 loop point have never been previewed.
- An `ae_render` call reported a temporary resolution change that marked the project modified. Check the
  comp's preview resolution is back to what Robin uses.
