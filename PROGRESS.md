# PROGRESS.md — Ateljé Sällström

**Branch `main` at `3cb6256`, tree clean** (this wrap-up commit follows). Everything is pushed; Vercel has
deployed. The roadmap JSON in `~/Documents/Projects/ROBO-OS` was edited (version 1.1.11) but is NOT
committed in that repo.

## Where things stand

- Live site (ateljesallstrom.se) carries the final exhibition info: 10–13 Oct, vernissage Sat 12–20,
  open Sat 12–20 · Sun–Tue 12–18. Verified on the live HTML on 2026-09-08 after deploy.
- Same hours are in the ExhibitionEvent JSON-LD, the Om oss timeline and
  `marknadsforing/vernissage_texter.md` (gitignored). Texts are ready to send.
- No tests or build exist. Verification is opening the HTML and checking the JSON-LD parses.
- A3 poster is final and has no times on it. No A4 poster or trifold exists with final dates.
- Nothing on the site is half-done.

## Next action

1. Around 15 Sep: send the newsletter from the ”Nyhetsbrev” block in `marknadsforing/vernissage_texter.md`,
   then the Instagram post, following the send schedule at the bottom of that file.
2. Commit the roadmap change in `~/Documents/Projects/ROBO-OS` (docs/roadmap/roadmap.json).
3. Optional: remake the A4 poster / trifold from `assets/poster_a3_exhibition26_B.psd` with 10–13 Oct.
4. After the exhibition (14 Oct+): move the Om oss timeline entry from ”Kommande” to past, remove the
   `#utstallning` banner or turn it into a recap, drop the ExhibitionEvent JSON-LD.

## Dead ends

none

## Decided (by Robin)

- Opening hours lör 12–20, sön–tis 12–18, and vernissage runs the whole Saturday 12–20 (2026-09-08).
- Commit and push straight to `main`, no branch or preview (2026-09-08).

## Assumed (by Claude, not confirmed)

- Wording ”söndag–tisdag 12–18” instead of listing each day; Robin saw the diff summary and pushed, but
  never commented on the phrasing.
- Roadmap milestone ”Send vernissage set” set to `in_progress` (nothing has actually been sent yet).
- CLAUDE.md ”Current state” section replaced by ”Facts you can't get from the repo”; status now lives here.

## Open questions

none

## Re-verify before trusting

- That the roadmap JSON edit in ROBO-OS is still uncommitted there (another session may have committed it).
