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

## Current state (as of August 2026)

Done: the big July 2026 overhaul — performance pass (image optimization to WebP),
SEO (meta/OG/sitemap/robots/JSON-LD), accessibility, data-driven gallery (~70 works incl.
48 "salen" works under Lennart), aurora background, Vercel migration, working Web3Forms
contact + newsletter forms. Most of IMPROVEMENT_PLAN.md P0/P1 is complete.

**The live deadline: exhibition ”Mellan Stad och Dröm”, 9–13 October 2026**, vernissage Saturday 10 October,
Galleri Hornsgatan 96, Stockholm. Print/marketing set (A3 + A4 posters,
A4 trifold, Instagram square + story, layered PSD, latest revision
`AteljeSallstrom_Exhibition26_WiP.png`) lives in `marknadsforing/` — local only, gitignored
and excluded from deploy. Note the WiP PNG is newer than the exported PDFs, so **the print
PDFs may be stale** — re-export before sending to print.

Done 2026-08-30 (poster): `poster_a3_exhibition26_B.psd` rebuilt from scratch with every
element on its own named layer — artworks as smart objects, all nine text lines live and
editable. Layout **B**: Ninni's watercolour (`assets/ninni_akvarell_blomma.jpg`) takes the
portrait slot, Robin's abstract moves to the wide band. Full build spec, coordinates, type
sizes, colours and the two known deltas are in `_psd_layers/POSTER_SPEC.md` — read that
before touching the poster. Cormorant Garamond + DM Sans TTFs are in `_fonts/` and installed
to `~/Library/Fonts`; without them Photoshop silently falls back to Myriad.

Done 2026-08-30: exhibition announced on the site (`#utstallning` section on index.html with
ExhibitionEvent JSON-LD; upcoming entry at the top of the Om oss Utställningar timeline),
Barbro Edlund introduced in "Vår historia" (she runs the studio rather than exhibiting, so she
sits with the family, not the artist grid), "två/tre generationers" footer contradiction
resolved on två. Ready-to-send vernissage copy in `marknadsforing/vernissage_texter.md`
(newsletter, Instagram, stories, Facebook event, press notice, send schedule).

In flight / open items:

- **Exhibition times are unknown** — opening hours for 9–13 Oct and the vernissage time are
  not on the poster. The site section and all the marketing copy omit them; `vernissage_texter.md`
  marks the gaps as `[TID]`. Needed before anything goes out.
- 8 artwork titles in `js/works.js` marked `[granska]` are AI-suggested placeholders — need real titles from the family
- `_Archived/` (untracked, gitignored): old pre-overhaul copy of the site + a feedback PDF — historical only, never deploy or commit
- Hosting: DONE (2026-08-07) — GitHub repo imported into Robin's Vercel account (project "ateljesallstrom", team robinsallstroms-projects; note: project names "atelje-sallstrom"/"atelje-sallstrom-442b" were taken/renamed). ateljesallstrom.se + www live on Vercel; DNS at Inleed (A @ → 216.150.1.1, CNAME www → e247c5cb1ba7cefc.vercel-dns-016.com, www 308-redirects to apex). MX/SPF for mail untouched. Old Netlify site can be deleted.
- IMPROVEMENT_PLAN.md P2 ideas not yet built: per-artwork inquiry button, dedicated Utställningar page, EN language toggle, Instagram feed

## Conventions & gotchas

- All user-facing copy in Swedish; keep the warm, personal family voice
- Untracked folder `_Archived/` is intentionally not committed (old site archive) — leave it out of git
- Motion effects must respect `prefers-reduced-motion`
- `More pictures/` and `images/Edited/` are source archives — excluded from deploy via `.vercelignore`
- Don't add a bundler, framework, or npm — vanilla static is a deliberate choice

## When ending a work session

Update the "Current state" section above with what changed and what's next, and commit it.

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
