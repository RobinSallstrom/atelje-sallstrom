# Ateljé Sällström — Audit & Improvement Plan

*Audited 2026-07-07. Static HTML/CSS/JS site, deployed on Netlify. 4 pages: Hem, Galleri, Om oss, Kontakt.*

## Summary

The site has a strong foundation: a cohesive brand (gradient palette, Cormorant Garamond + DM Sans), a tasteful firefly particle background, working lightbox, scroll animations, and responsive layout. The biggest problems are **a contact form that silently discards every message**, **~47MB of unoptimized images on page load paths**, **mislabeled artworks**, and **two broken meta tags**. None require an architecture change — vanilla static is the right stack for this site.

## Scores

| Area | Score | Headline |
|---|---|---|
| Codebase | 6/10 | Clean, readable BEM CSS; but broken meta attrs, duplicated nav/footer ×4, inline styles in om-oss, unpinned CDN deps |
| UX flow | 5/10 | Clear nav; but contact form is fake, gallery shows only 15 of ~80 available works, no per-artwork inquiry path |
| UI / visual | 7/10 | Cohesive, elegant, art-forward; minor inconsistencies (emoji favicon, inline-styled exhibition timeline) |
| Motion | 7/10 | Fireflies are lovely and performance-aware; missing `prefers-reduced-motion`, filter transitions are abrupt |
| Architecture | 7/10 | Vanilla static is correct; gallery content should be data-driven (JSON), images need an optimization pass |
| Copy | 5/10 | Warm, personal voice; but typos, "två/tre generationer" contradiction, Barbro appears in hero/meta but nowhere else |
| SEO | 3/10 | Meta descriptions exist (2 broken); no OG tags, canonical, sitemap, robots.txt, or structured data |

## Key findings (evidence)

**Critical bugs**

1. **Contact form goes nowhere.** `kontakt.html:109` has `action="#"`; `main.js:181` calls `preventDefault()` and shows a fake success message. Visitors believe they've contacted you. Netlify Forms fixes this with two attributes.
2. **Broken meta descriptions.** `index.html:7` and `om-oss.html:7` contain unescaped quotes (`Lennart " Sälen"`) which terminate the `content` attribute — search engines see garbage.
3. **Mislabeled artworks.** `index.html`: `ninni15.jpg` labeled "Interstellar Dreams — Robin"; `robin02.jpg` and `robin04.png` credited to Ninni; "Celestial Hues" used 3× for different works. `galleri.html`: `lennart02.jpg` appears twice as both "Tänk" and "Röd komposition".

**Performance**

4. Gallery page loads ~30MB; Robin's PNGs are 4.7–7.6MB each (`robin04.png` = 7.6MB). Target: WebP/JPEG ≤1600px, ≤300KB → ~90% reduction.
5. No `width`/`height` on images → layout shift. No `srcset`. No cache headers in `netlify.toml`.
6. ~700MB of unused images (`More pictures/`, `images/Edited/salen*.jpg`) are deployed with the site.
7. `lucide@latest` from unpkg is unpinned and render-blocking in `<head>` on all 4 pages.

**Copy**

8. Typos in `om-oss.html`: "uttrck" → "uttryck"; missing period in "flera kreativa former Hennes"; `index.html`: "MFd. bildlärare", "abstrakta målning".
9. Footer says "två generationers" on index/om-oss, "tre generationers" on galleri/kontakt.
10. Hero and meta mention four names (incl. Barbro) but everything else says "Tre konstnärer" — needs a decision.

**Accessibility**

11. Lightbox has no focus trap; gallery items aren't keyboard-operable (`div` with click handler, no `tabindex`/`role`); no skip-link; no `prefers-reduced-motion` (fireflies + fades always animate); `aria-current="page"` missing on nav.

**Motion opportunities**

12. Gallery filter uses instant `display:none` — a subtle FLIP/fade would feel far more polished. Lightbox image swaps have no transition. Hero could get a gentle staggered entrance. All gated behind `prefers-reduced-motion`.

---

## Build plan

### P0 — Fix & fast wins (~half a day)

| # | Task | Files | Acceptance criteria |
|---|---|---|---|
| 0.1 | Real contact form via Netlify Forms (`data-netlify="true"`, honeypot, graceful success state) | kontakt.html, main.js | Submission appears in Netlify dashboard; success message only after real submit |
| 0.2 | Fix broken meta descriptions (escape/rewrite) | index.html, om-oss.html | Pages validate; descriptions render correctly |
| 0.3 | Correct all artwork titles/credits/alt text; remove duplicates | index.html, galleri.html | Every work has unique correct title, artist, alt |
| 0.4 | Fix typos + unify "tre generationers"; resolve Barbro mention | all HTML | Zero known typos; consistent copy |
| 0.5 | Optimize all used images → resized WebP+JPEG (≤1600px, ≤300KB), add `width`/`height` | images/, all HTML | Gallery page weight <3MB; no layout shift |
| 0.6 | Stop deploying unused assets; remove .DS_Store; add .gitignore entries | netlify.toml, .gitignore | Deploy excludes More pictures/ and images/Edited/ |
| 0.7 | Pin lucide version, `defer` all scripts | all HTML | No render-blocking JS |
| 0.8 | `prefers-reduced-motion` support (fireflies off, fades instant) | fireflies.js, style.css | Animations disabled when OS setting active |

### P1 — Core improvements (~2–3 days)

| # | Task | Files | Acceptance criteria |
|---|---|---|---|
| 1.1 | SEO package: OG/Twitter tags, canonical, sitemap.xml, robots.txt, JSON-LD (Organization + VisualArtwork), real SVG favicon | all HTML + new files | Rich previews when shared; valid structured data |
| 1.2 | Data-driven gallery: `js/works.json` (title, artist, medium, year, image) rendered by JS; expand beyond 15 works | galleri.html, main.js, new works.json | Adding a work = one JSON entry; filter still works |
| 1.3 | Responsive images: `srcset`/`sizes`, `fetchpriority="high"` on hero-adjacent images | all HTML | Mobile downloads ≤800px variants |
| 1.4 | Cache headers for images/CSS/JS | netlify.toml | Repeat visits load assets from cache |
| 1.5 | Accessibility pass: lightbox focus trap, keyboard-operable gallery, skip-link, `aria-current`, contrast check | main.js, style.css, all HTML | Fully keyboard navigable; WCAG AA contrast |
| 1.6 | Motion polish: animated filter transitions (FLIP), lightbox crossfade, blur-up image loading, staggered hero entrance | style.css, main.js | Smooth 60fps, all reduced-motion-gated |
| 1.7 | Custom 404 page in site style | new 404.html | Netlify serves branded 404 |
| 1.8 | Move om-oss inline styles + exhibition timeline into style.css as proper components | om-oss.html, style.css | No inline `style=` attributes remain |

### P2 — Ambitious additions (each ~1–2 days, pick and choose)

| # | Idea | Impact |
|---|---|---|
| 2.1 | Per-artwork detail in lightbox + "Skicka förfrågan" button that prefills the contact form with the artwork name — turns gallery into a sales channel | High |
| 2.2 | Utställningar page with upcoming events (Event structured data) + past exhibitions with photos from Edited/ archive | High |
| 2.3 | Curated selection from the 48 `salen*.jpg` edited images added to gallery as Lennart's collection | Medium |
| 2.4 | English language toggle (SV/EN) | Medium |
| 2.5 | Instagram feed section on home page | Medium |
| 2.6 | Newsletter signup (Netlify Forms) for vernissage invitations | Medium |
| 2.7 | Prislista/print inquiries, or lightweight shop via Instagram DM links | Depends on goals |

## Open questions

1. Is Barbro a member of the studio (hero/meta mention her, nothing else does)?
2. Where should contact form submissions be emailed?
3. Should the `salen*.jpg` edited images (48 works) go into the gallery, and are the current artwork titles correct?
