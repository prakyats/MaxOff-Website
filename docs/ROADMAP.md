# Roadmap

Each phase: its own branch and PR, `pnpm check` green, a short note in `docs/PROGRESS.md`, then merge. The Definition of Done in `CLAUDE.md` applies to every PR.

## Phase 0: Setup and skeleton

**Branch:** `claude/zealous-curie-92bmzb` (this session's designated branch; later phases use `phase-N/<topic>`).

- Docs kit: `CLAUDE.md`, `docs/BRIEF.md`, `docs/DESIGN.md` (draft), `docs/SITEMAP.md`, `docs/ROADMAP.md`, `docs/PROGRESS.md`, `docs/BRIEF-ORIGINAL.md`.
- Astro + Tailwind v4 + TypeScript strict scaffold, static output, pnpm.
- Design tokens in `src/styles/tokens.css`, both themes, no-flash theme bootstrap, theme toggle.
- One placeholder page and the 404 page.
- `pnpm check`: astro check, worker typecheck, ESLint (with a11y rules for templates), Prettier, build, gzipped JS/CSS budget check, banned-brand check.
- Playwright smoke tests (page loads, one h1, no horizontal scroll at 360px, theme toggle persists, 404, reduced motion) and an axe WCAG 2.2 AA check in both themes.
- `wrangler.jsonc` (assets + `/api/*` worker route, no custom domain), Worker stub, `.env.example`, GitHub Actions CI.

**Acceptance:** `pnpm check` and `pnpm test` green locally and in CI; the owner has connected the repo to Cloudflare Workers Builds and a preview URL works. **maxoff.in is not attached yet.**

## Phase 1: Design direction

- 2–3 directions as preview pages (hero + one feature section + footer each), both themes, phone and desktop.
- The owner picks one; `docs/DESIGN.md` is finalised.

**Acceptance:** the owner has chosen; DESIGN.md is no longer a draft.

## Phase 2: Build the page

- Every section in `docs/SITEMAP.md` in the chosen direction.
- Recreated app screens: Today, a task card, an approval. The task-state loop.
- Responsive at every width, both themes, 200 % text.

**Acceptance:** every section present and working; Definition of Done met.

## Phase 3: Copy, SEO and sharing

- Final copy in `src/content/copy.ts`, reviewed by the owner.
- `/privacy`, `/404` final, OG image at build time, meta, canonical, sitemap, JSON-LD `SoftwareApplication` (no ratings, no offers), favicons and Apple touch icon.

**Acceptance:** copy approved; every claim matches `docs/BRIEF.md`; SEO checks pass.

## Phase 4: The form

- Worker endpoint `/api/early-access`: validation, Turnstile verification, one email via Resend, per-IP rate limit, JSON responses.
- Client: all states (idle, loading, success, error keeping what was typed), 16px inputs, 44px targets.
- Tests for validation and the endpoint.
- The owner completes the setup steps: Turnstile widget, Resend key (sending-only), the three variables in Cloudflare, Email Routing for hello@maxoff.in.

**Acceptance:** a real submission arrives in the owner's inbox from the preview URL.

## Phase 5: Polish

- Critique and polish passes, accessibility audit (WCAG 2.2 AA), performance against the budgets on the preview URL, cross-browser check (Chrome Android, Safari iOS, desktop Chrome/Safari/Firefox).

**Acceptance:** Lighthouse 95+ across the four categories on mobile; budgets met; no open a11y findings.

## Phase 6: Launch

- The owner removes any remaining parked/GoDaddy records for the apex.
- Custom domains `maxoff.in` and `www.maxoff.in` (www → apex 301) added in `wrangler.jsonc`.
- Verify HTTPS, redirects, analytics, the form end to end with a real submission, and that `app.maxoff.in` is untouched.

**Acceptance:** https://maxoff.in serves the site; the go/no-go checklist is complete.
