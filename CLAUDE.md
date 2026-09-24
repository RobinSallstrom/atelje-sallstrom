# CLAUDE.md — Ateljé Sällström website

Context file for AI assistants. Read this first when starting a session on a fresh machine.

## What this project is

Marketing/portfolio website for **Ateljé Sällström**, a Swedish family art collective:
Lennart Sällström (father, acrylic paintings), Robin Sällström (son, digital art — this is
the repo owner), and Ninni Sällström (daughter, acrylic pouring + photography).
Site language is **Swedish**. Live domain target: `ateljesallstrom.se`.

## Tech stack

- Pure static HTML5 + CSS3 + vanilla JS — **no build step, no framework, keep it that way**
- 4 pages: `index.html` (Hem), `galleri.html` (Galleri), `om-oss.html` (Om oss), `kontakt.html` (Kontakt), plus `404.html`
- `css/style.css` — all styles (BEM-ish)
- `js/main.js` — nav, gallery rendering, lightbox, animations, form handling
- `js/works.js` — **data-driven gallery**: one JS object per artwork (`window.WORKS`)
- `js/aurora.js` + `js/fireflies.js` — background particle/aurora animations
- Fonts: Cormorant Garamond + DM Sans (Google Fonts). Icons: Lucide (pinned CDN, deferred)
- Forms: **Web3Forms** (contact + newsletter). Access key lives in `js/main.js` (`WEB3FORMS_KEY`) — already set and committed
- Hosting: **Vercel** (migrated from Netlify July 2026). `vercel.json` = security + cache headers. `.vercelignore` excludes source images. Push to `main` auto-deploys
- Images: optimized WebP in `images/opt/` as `<stem>-800.webp` (grid) and `<stem>-1600.webp` (lightbox). Originals in `images/` are NOT deployed

## Adding artwork (the most common task)

1. Original image → `images/`
2. Generate `images/opt/<stem>-800.webp` and `images/opt/<stem>-1600.webp` (max widths 800/1600)
3. Add one entry to `js/works.js` (title, artist, medium, w/h of the 800px version, optional `size: 'tall'|'wide'`)

## Facts you can't get from the repo

Session status lives in `PROGRESS.md` — read it first. This section is only for context that is
outside git.

**Exhibition ”Mellan Stad och Dröm”, 10–13 October 2026**, Galleri Hornsgatan 96, Stockholm.
9 Oct is hang-day only. Vernissage Sat 10 Oct 12–18; open Sat–Sun 12–18, Mon–Tue 15–19 (changed 2026-09-24).
Snacks, no alcohol (the gallery is dry) — never write ”ta ett glas”/🥂 in copy.
Barbro Edlund runs the studio but does not exhibit: she belongs in ”Vår historia”, not the artist grid.
Footer says ”två generationers” (not tre).

`marknadsforing/` (local only, gitignored, excluded from deploy):
- `_export/poster_a3_exhibition26.png` — **the final A3 poster** (3508×4961 @ 300 dpi, 10–13 Oct,
  no times on it by design). Anything else print-ready gets exported here.
- `assets/poster_a3_exhibition26_B.psd` — the layered source PSD (every element on its own named
  layer, artworks as smart objects, all text live), plus the artwork crops it uses.
  Read `_psd_layers/POSTER_SPEC.md` before touching it. Cormorant Garamond + DM Sans TTFs are in
  `_fonts/` and must be installed in `~/Library/Fonts`, or Photoshop silently falls back to Myriad.
- `vernissage_texter.md` — ready-to-send copy (newsletter, Instagram, FB event, press, SMS, schedule)
- `_archive/`, `_to_delete/`, `refs/` — old Aug posters/PDFs/WiP, junk, empty. Ignore.
There is no A4 poster or trifold with the final dates — make them from the PSD if needed.

Hosting: Vercel project "ateljesallstrom" (team robinsallstroms-projects; the names
"atelje-sallstrom"/"atelje-sallstrom-442b" were taken). DNS at Inleed: A @ → 216.150.1.1,
CNAME www → e247c5cb1ba7cefc.vercel-dns-016.com, www 308-redirects to apex. MX/SPF untouched.
Old Netlify site can be deleted.

IMPROVEMENT_PLAN.md P2 ideas not built: per-artwork inquiry button, dedicated Utställningar page,
EN language toggle, Instagram feed.

## Conventions & gotchas

- All user-facing copy in Swedish; keep the warm, personal family voice
- Untracked folder `_Archived/` is intentionally not committed (old site archive) — leave it out of git
- Motion effects must respect `prefers-reduced-motion`
- `More pictures/` and `images/Edited/` are source archives — excluded from deploy via `.vercelignore`
- Don't add a bundler, framework, or npm — vanilla static is a deliberate choice

## When ending a work session

Run `/wrapup`: rewrite `PROGRESS.md`, prune this file, update the roadmap JSON (below), commit and push.

## Portfolio roadmap (cross-project)

This project is **`atelje-sallstrom`** in Robin's portfolio roadmap — currently **NEXT #3**.
Data: `../ROBO-OS/docs/roadmap/roadmap.json` (absolute: `~/Documents/Projects/ROBO-OS/docs/roadmap/roadmap.json`).
**The JSON is the source of truth.** The published board (Claude artifact) and
`ROBO-OS/docs/roadmap/portfolio-roadmap.html` are renderings of it — never edit those; edit the JSON.
This works from any Claude profile or tool: it's a file, not an account.

- **Session start:** read this project's entry — tier, `tierNote`, `milestones`, `triggers`, `nextAction`, `blockers`.
  `python3 -c "import json;p=[x for x in json.load(open('$HOME/Documents/Projects/ROBO-OS/docs/roadmap/roadmap.json'))['projects'] if x['id']=='atelje-sallstrom'][0];print(json.dumps(p,indent=2,ensure_ascii=False))"`
- **Wrap-up (alongside PROGRESS.md):** update the entry — set finished milestones to `"status":"done"` with a `"date"`,
  mark the one you're on `"in_progress"`, add new milestones only if they're coarse (5–10 per project, never task-level),
  refresh `currentPhase`, `nextAction`, `lastActivity`, `percentComplete`, and the `git` counts. Bump the top-level `version` patch number.
- **Never change** `tier`, `tierRank`, `tierNote`, `scores`, `triggers` or `ownership` — those are Robin's decisions, made in review.
- Milestone `status` ∈ pending · in_progress · done · dropped. Keep valid JSON (`python3 -m json.tool` on the file). Do not reformat the whole file.
