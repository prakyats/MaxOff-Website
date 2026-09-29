# Roadmap

Each phase: its own branch and PR, `pnpm check` green, a short note in `docs/PROGRESS.md`, then merge. The Definition of Done in `CLAUDE.md` applies to every PR.

## Phase 0: Setup and skeleton

**Branch:** `claude/zealous-curie-92bmzb` (PR #1). Later phases use `phase-N/<topic>`.

- Docs kit: `CLAUDE.md`, `docs/BRIEF.md`, `docs/DESIGN.md` (draft), `docs/SITEMAP.md`, `docs/ROADMAP.md`, `docs/PROGRESS.md`, `docs/BRIEF-ORIGINAL.md`.
- Astro + Tailwind v4 + TypeScript strict scaffold, static output, pnpm.
- Design tokens in `src/styles/tokens.css`, both themes, no-flash theme bootstrap, theme toggle.
- One placeholder page and the 404 page.
- `pnpm check`: astro check, ESLint (with a11y rules for templates), Prettier, build, gzipped JS/CSS budget check, banned-brand check.
- Playwright smoke tests (page loads, one h1, no horizontal scroll at 360px, theme toggle persists, 404, reduced motion) and an axe WCAG 2.2 AA check in both themes.
- `wrangler.jsonc` (static assets only, no custom domain), GitHub Actions CI.

**Acceptance:** `pnpm check` and `pnpm test` green locally and in CI; the owner has connected the repo to Cloudflare Workers Builds and a preview URL works. **maxoff.in is not attached yet.**

**Status:** done. Merged in PR #1. The owner connected Workers Builds; the Worker is named `maxoff-website`. Email Routing for hello@maxoff.in is live.

## Phase 1: Design direction

**Branch:** `phase-1/design-directions`.

- 3 directions as preview pages under `/preview` (header, hero, one feature section, closing with the contact block, footer), both themes, phone and desktop. Each applies the developer credit, the two doors (Request a demo, Sign in) and contact by email.
- The owner picks one; `docs/DESIGN.md` is finalised.

**Acceptance:** the owner has chosen; DESIGN.md is no longer a draft.

## Phase 2: Build the page

- Every section in `docs/SITEMAP.md` in the chosen direction.
- Recreated app screens: Today, a task card, an approval. The task-state loop.
- Responsive at every width, both themes, 200 % text.

**Acceptance:** every section present and working; Definition of Done met.

## Phase 3: Copy, SEO and sharing

- Final copy in `src/content/copy.ts`, reviewed by the owner.
- `/privacy`, simple: no form data is collected, cookie-less analytics only, emails answered by the developer (see `docs/BRIEF.md` §3), `/404` final, OG image at build time, meta, canonical, sitemap, JSON-LD `SoftwareApplication` (no ratings, no offers), favicons and Apple touch icon. All of it stays dormant until launch: the site is `noindex` and `robots.txt` disallows everything until Phase 6.

**Acceptance:** copy approved; every claim matches `docs/BRIEF.md`; SEO checks pass.

## Phase 4: Contact by email (small)

The site is fully static and contact is email only. Most of this is built into the Phase 1 to 3 pages; Phase 4 finishes and verifies it.

- **Request a demo** opens an email to hello@maxoff.in with the subject "MaxOff demo request" and a short prefilled body (Name, Studio name, Team size, What do you want to fix first?), from the header, hero, phone menu and closing block.
- The closing block, headed "Tell us about your studio", shows the button, the address as text, and a **Copy email** control with a live status message.
- The address is never a plain string in the built site (entities in the markup, assembled at runtime for Copy email). `pnpm check:static` enforces it. Keyboard and screen-reader friendly.
- Tests: the mailto subject and body, no plain address in the raw HTML, Copy email with and without clipboard access.
- The owner confirms Cloudflare Email Routing forwards hello@maxoff.in to the inbox (set up in Cloudflare, not in code).

**Acceptance:** Request a demo opens a draft with the subject and body; a real email to hello@maxoff.in reaches the owner's inbox; Copy email works on a desktop and a phone.

## Phase 5: Polish

- Critique and polish passes, accessibility audit (WCAG 2.2 AA), performance against the budgets on the preview URL, cross-browser check (Chrome Android, Safari iOS, desktop Chrome/Safari/Firefox).

**Acceptance:** Lighthouse 95+ across the four categories on mobile; budgets met; no open a11y findings.

## Phase 6: Launch

- The owner removes any remaining parked/GoDaddy records for the apex.
- The Phase 1 `/preview` pages are gone (removed in Phase 2 once a direction is built).
- Set `PRE_LAUNCH` to `false` in `src/lib/launch.ts`. That removes the `noindex` meta from every page and the `Disallow: /` from `robots.txt` (which then allows all and lists the sitemap). Update the tests that assert them.
- Custom domains `maxoff.in` and `www.maxoff.in` (www → apex 301) added in `wrangler.jsonc`.
- Verify HTTPS, redirects, analytics, a real email to hello@maxoff.in end to end, and that `app.maxoff.in` is untouched.

**Acceptance:** https://maxoff.in serves the site; the go/no-go checklist is complete.
