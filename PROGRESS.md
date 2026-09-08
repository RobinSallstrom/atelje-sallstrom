# PROGRESS.md — Ateljé Sällström

**Branch `main`, tree clean** after the 2026-09-08 commit "New opening hours: lör 12–20, sön–tis 12–18;
vernissage 12–20; add PROGRESS.md". Pushed to origin, so Vercel has deployed the new hours.

## Where things stand

- Site, JSON-LD, Om oss timeline and the marketing texts all carry the new hours:
  **lör 12–20 · sön–tis 12–18** (Robin, 2026-09-08). Old hours (lör 12–18, sön 12–17, mån–tis 16–19)
  are gone everywhere. JSON-LD validated as JSON after the edit.
- No tests or build exist. Verification = open the HTML files and `python3 -m json.tool` on the JSON-LD.
- Newsletter + Instagram send is due ~15 Sep; copy lives in `marknadsforing/vernissage_texter.md`.
- The final A3 poster (`marknadsforing/_export/poster_a3_exhibition26.png`) has no times on it by design,
  so it is unaffected. No A4 poster or trifold exists with final dates.

## Next action

1. Check https://ateljesallstrom.se/#utstallning shows lör 12–20 · sön–tis 12–18 and vernissage 12–20.
2. Roadmap: refresh `lastActivity` and bump `version` in `~/Documents/Projects/ROBO-OS/docs/roadmap/roadmap.json`.
3. Send the vernissage set around 15 Sep (newsletter first, then Instagram/Facebook per the schedule in the texts file).

## Dead ends

none

## Decided (by Robin)

- Opening hours: lör 12–20, sön 12–18, mån 12–18, tis 12–18 (2026-09-08).
- Vernissage runs the full Saturday, 12–20 (2026-09-08).
- Exhibition name, dates 10–13 Oct, venue, alcohol-free, dates-only poster (earlier sessions).

## Assumed (by Claude, not confirmed)

- Collapsing "söndag 12–17 · måndag–tisdag 16–19" into "söndag–tisdag 12–18" is fine wording.

## Open questions

none

## Re-verify before trusting

- That the live site updates after push (Vercel auto-deploy was working as of 2026-09-05).
