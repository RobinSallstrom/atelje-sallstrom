# PROGRESS.md — Ateljé Sällström

**Branch `main` at `63ab7d4`, tree clean** before this wrap-up commit (which only touches PROGRESS.md and
CLAUDE.md). Everything is pushed. Last session's work (2026-10-04) was not in this repo: it was the
exhibition animation in After Effects, which lives outside git (see below).

## Where things stand

**Website** — unchanged since 2026-09-24. Opening hours lör–sön 12–18, mån–tis 15–19 are committed
(`63ab7d4`) and deployed. No tests or build exist; verification is opening the HTML and checking the
JSON-LD parses. Nothing on the site is half-done.

**AE animation** — `C:\Users\ROBIN\SynologyDrive\02_Internal\01_Projects\atelje-sallstrom\02_Projects\01_AE\MellanStadochDrom_V01.aep`,
comp `MellanStadochDrom_MC` (2560×1440, 30 fps, 20 s). The .aep was saved 2026-10-05 00:18, after the
work below, but I could not confirm the saved file contains it (AE stopped answering).
- `salen22_night_V02_Upscaled.png` (3840×2160, opaque black padding ~429 px each side, no alpha) is now
  parented to `salen22.jpg`, position 2188.5,1587, scale 146.83/146.93 — registered to within ~0.4 px of
  the old `salen22_night_V02.jpg` layer. Layer span 0–8 s.
- New top layer **Window Lights**: adjustment layer, 3840×2160, same parent/position/scale/span as the PNG,
  so mask coordinates = PNG pixel coordinates. 333 rectangular masks (feather 3, Add, names
  "Win N (flicker|breathe|switch)"), mask opacity 20–100 = per-window brightness. Effects in order:
  sliders Intensity, Flicker Amount, Flicker Speed, Breathe Amount, Breathe Speed, Window Animation
  (master), then Exposure "Window Brightness" whose Exposure = Intensity/100 by expression.
  21 flicker, 31 breathe, 13 switch-on windows (switch times 1.07–7.4 s).
- During the session Robin deleted the RippleMap and Adjustment Layer 7 layers; layer indices shifted.

## Next action

1. Open AE, check the 'AfterEffects MCP Agent' panel is connected and no dialog is open, then confirm
   `Window Lights` exists in `MellanStadochDrom_MC` with 333 masks and the six sliders. If missing, the
   save predates it — rebuild (see Dead ends for the lost detection script).
2. Review the window lights at play speed and tune sliders / individual mask opacities with Robin.
3. Exhibition is 10–13 Oct: check with Robin whether the newsletter/Instagram from
   `marknadsforing/vernissage_texter.md` were sent (that folder is on the Mac, not this PC).
4. After the exhibition (14 Oct+): move the Om oss timeline entry from ”Kommande” to past, remove the
   `#utstallning` banner or turn it into a recap, drop the ExhibitionEvent JSON-LD.

## Dead ends

- Window detection by colour (OpenCV, hue 8–34): a single threshold either missed dim windows or merged
  beige facades into one blob. What worked: lit panes S≥135 & V≥120 (beige walls are ~S115/V115), close
  11 px to join panes, then two looser passes keeping only non-overlapping window-shaped blobs; exclude
  bridge light strings and water (y>1730). The script was in the session scratchpad and is **gone** —
  parked; rewrite from this description if windows need re-detecting.
- Soloing layers via script fails on disabled layers ("Solo flag can not be set…") — won't work; toggle
  `enabled` instead.

## Decided (by Robin)

- Opening hours lör–sön 12–18, mån–tis 15–19; vernissage the whole Saturday 12–18 (2026-09-24).
- Commit and push straight to `main`, no branch or preview (2026-09-08).
- Wanted: per-window adjustment masks, some brighter, some animated; sliders for flicker, breathe and
  intensity (2026-10-04).

## Assumed (by Claude, not confirmed)

- Matching the PNG via parenting to `salen22.jpg` with the V02 layer's slightly non-uniform scale (Robin said "yes" to applying).
- Brightening via Exposure +1 stop; windows only brighten, none darken.
- Animation mix (~6% flicker, ~10% breathe, ~6% switch-on), random seed 22, and the switch-on flicker style.
- Clock faces and boat windows count as windows; 4 detections in water/lamps removed.
- Window Lights span 0–8 s, copied from the PNG layer.
- Roadmap milestone ”Send vernissage set” still `in_progress` (from last wrap-up; nothing confirmed sent).

## Open questions

- Were the newsletter and Instagram post sent? — Robin; blocks marking the roadmap milestone done.
- Should some windows switch *off* (needs a second, darkening adjustment layer)? — Robin; nothing blocked.
- Is the roadmap JSON reachable from this PC? Neither `~/Documents/Projects/ROBO-OS` nor
  `~/Documents/Projects/portfolio-roadmap` exists here — Robin; blocks roadmap updates from Windows.

## Re-verify before trusting

- That the saved .aep contains Window Lights and the PNG alignment (AE didn't respond at wrap-up).
- That the PNG layer's in/out is still 0–8 s and Window Lights matches it.
- Whether the earlier ROBO-OS roadmap edit (version 1.1.11) was ever committed — repo not on this PC.
