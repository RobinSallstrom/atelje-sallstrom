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

## Current state (as of July 2026)

Done: the big July 2026 overhaul — performance pass (image optimization to WebP),
SEO (meta/OG/sitemap/robots/JSON-LD), accessibility, data-driven gallery (~70 works incl.
48 "salen" works under Lennart), aurora background, Vercel migration, working Web3Forms
contact + newsletter forms. Most of IMPROVEMENT_PLAN.md P0/P1 is complete.

In flight / open items:

- 8 artwork titles in `js/works.js` marked `[granska]` are AI-suggested placeholders — need real titles from the family
- `_Archived/` (untracked): old pre-overhaul copy of the site + a feedback PDF — historical only, not relevant, never deploy or commit
- Hosting: DONE (2026-08-07) — GitHub repo imported into Robin's Vercel account (project "ateljesallstrom", team robinsallstroms-projects; note: project names "atelje-sallstrom"/"atelje-sallstrom-442b" were taken/renamed). ateljesallstrom.se + www live on Vercel; DNS at Inleed (A @ → 216.150.1.1, CNAME www → e247c5cb1ba7cefc.vercel-dns-016.com, www 308-redirects to apex). MX/SPF for mail untouched. Old Netlify site can be deleted.
- IMPROVEMENT_PLAN.md P2 ideas not yet built: per-artwork inquiry button, Utställningar page, EN language toggle, Instagram feed

## Conventions & gotchas

- All user-facing copy in Swedish; keep the warm, personal family voice
- Untracked folder `_Archived/` is intentionally not committed (old site archive) — leave it out of git
- Motion effects must respect `prefers-reduced-motion`
- `More pictures/` and `images/Edited/` are source archives — excluded from deploy via `.vercelignore`
- Don't add a bundler, framework, or npm — vanilla static is a deliberate choice

## When ending a work session

Update the "Current state" section above with what changed and what's next, and commit it.
