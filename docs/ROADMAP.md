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

**Status:** done. The owner chose Instrument, borrowing Glass's chips and Editorial's giant closing type. `docs/DESIGN.md` is final.

## Phase 2: Build the page

- Every section in `docs/SITEMAP.md` in the chosen direction (Instrument), on `phase-2/build-page`.
- Two borrowings: chips inside the feature cards, restyled in Instrument's hairline and mono language; giant type for the closing line.
- The `/preview` pages, the Glass and Editorial styles and Inter Tight are removed.

**Status:** built on `phase-2/build-page`. All nine sections, the task loop with a Pause button, the light and dark phone pair, the two borrowings, the reply line. Copy is a first pass for Phase 3 review.

- Recreated app screens: Today, a task card, an approval. The task-state loop.
- Responsive at every width, both themes, 200 % text.

**Acceptance:** every section present and working; Definition of Done met.

## Phase 3: Copy, SEO and sharing

- Final copy in `src/content/copy.ts`, reviewed by the owner.
- `/privacy`, simple: no form data is collected, cookie-less analytics only, emails answered by the developer (see `docs/BRIEF.md` §3), `/404` final, OG image at build time, meta, canonical, sitemap, JSON-LD `SoftwareApplication` (no ratings, no offers), favicons and Apple touch icon. It stayed dormant until launch (Phase 6).

**Acceptance:** copy approved; every claim matches `docs/BRIEF.md`; SEO checks pass.

**Status:** built on `phase-3/copy-seo`. The owner approved the copy with edits (`docs/BRIEF.md` §3). Delivered: the approved copy edits, `/privacy`, the social image (`/og.png`, 1200×630, drawn at build time with satori and resvg from the site's own fonts and mark), favicons (`favicon.ico` with 16, 32 and 48 px, `favicon.svg`, a 180 px Apple touch icon), Open Graph and Twitter tags, canonical URLs, the sitemap (`/` and `/privacy`, never `/404`) and JSON-LD `SoftwareApplication` on the home page (no ratings, offers, author or publisher). `/privacy` and the 404 page share the home header, so the phone menu (Request a demo, Sign in) works everywhere.

## Phase 4: Contact by email (small)

The site is fully static and contact is email only. Most of this is built into the Phase 1 to 3 pages; Phase 4 finishes and verifies it.

- **Request a demo** opens an email to hello@maxoff.in with the subject "MaxOff demo request" and a short prefilled body (Name, Studio name, Team size, What do you want to fix first?), from the header, hero, phone menu and closing block.
- The closing block, headed "Tell us about your studio", shows the button, the address as text, and a **Copy email** control with a live status message.
- The address is never a plain string in the built site (entities in the markup, assembled at runtime for Copy email). `pnpm check:static` enforces it. Keyboard and screen-reader friendly.
- Tests: the mailto subject and body, no plain address in the raw HTML, Copy email with and without clipboard access.
- The owner confirms Cloudflare Email Routing forwards hello@maxoff.in to the inbox (set up in Cloudflare, not in code).

**Acceptance:** Request a demo opens a draft with the subject and body; a real email to hello@maxoff.in reaches the owner's inbox; Copy email works on a desktop and a phone.

**Status:** done. The owner confirmed that email to hello@maxoff.in forwards to the inbox (tested, 29 Sep 2026).

## Phase 5: Polish

- Critique and polish passes, accessibility audit (WCAG 2.2 AA), performance against the budgets on the preview URL, cross-browser check (Chrome Android, Safari iOS, desktop Chrome/Safari/Firefox).

**Acceptance:** Lighthouse 95+ across the four categories on mobile; budgets met; no open a11y findings.

**Status:** postponed by the owner until after launch. First slice, `phase-5/mobile-controls`: every control checked by touch on phone profiles (portrait, landscape, 200 % text). Fixed: the hero's buttons took no taps because the glow behind the phone covered them (`pointer-events: none` on the glow); the open menu was cut off on short screens and its last buttons unreachable (the header scrolls inside itself while the menu is open); section links landed under the sticky header (`scroll-padding-top`); the logo link, skip link and the contact block's inline Sign in were under 44 px. Touch tests added (tap, not click), phone project only.

Second slice, `phase-5/audit`: performance and an accessibility audit past axe.

- **Lighthouse (mobile, simulated 4G), measured locally the way Cloudflare serves the site (Brotli, keep-alive):** 100 / 100 / 100 / 100 in three runs out of three; LCP 1.4 s, TBT 0 ms, CLS 0. Inlining the CSS or dropping the mono-font preload did not help, so delivery is unchanged. Fixed: the task loop recalculated style on every frame (about 60 a second), even off screen, because an animated custom property runs on the main thread; it now runs only while on screen (idle style work at the top of the page: 182 recalculations per 3 s before, 0 after). The header no longer forces a layout at load.
- **WCAG 2.2 beyond axe:** a full keyboard walk (every stop has a focus ring and none is hidden under the sticky header, 2.4.7 and 2.4.11), reflow at 320 px (1.4.10), the text-spacing override (1.4.12), and text contrast against the real pixels for the 107 nodes axe could not decide (all pass; tightest 4.57:1). Fixed: outline-button borders were 2.94:1 in the light theme (1.4.11, now 3.6:1); in forced colours (Windows high contrast) the red button lost its outline and the task loop lost its state (both fixed).
- Tests for each fix, each shown to fail without it.
- **Still open:** Lighthouse on the live URL (PageSpeed Insights; this sandbox cannot reach maxoff.in), Safari and Firefox (no WebKit or Firefox build here), and the owner's critique and polish pass.

## Phase 6: Launch

**Branch:** `phase-6/launch`. The owner decided to go live before Phase 5.

- `PRE_LAUNCH` is `false` in `src/lib/launch.ts`: no `noindex` meta (the 404 page keeps it) and `robots.txt` allows crawling and lists `https://maxoff.in/sitemap-index.xml`. Tests updated.
- `wrangler.jsonc` has the custom domains `maxoff.in` and `www.maxoff.in`. Canonical, Open Graph and sitemap URLs already use `https://maxoff.in`.
- **Owner steps after merge:**
  1. Remove any parked or GoDaddy records for the apex and `www` in DNS, so the custom domains can be created.
  2. www → apex (still open on 30 Sep 2026: www answered 200 with the page). In the Cloudflare dashboard: open the `maxoff.in` zone → **Rules** → **Overview** → **Create rule** → **Redirect Rule**. Rule name `www to apex`. Under "If incoming requests match…" choose **Custom filter expression**: Field **Hostname**, Operator **equals**, Value `www.maxoff.in`. Under "Then…": Type **Dynamic**, Expression `concat("https://maxoff.in", http.request.uri.path)`, Status code **301**, tick **Preserve query string**. **Deploy**. Keep `www.maxoff.in` as a custom domain in `wrangler.jsonc`: its proxied record is what lets the rule run. Then `pnpm check:www` must pass (it probes http and https, a page and a query string). A static site has no code that could do this.
  3. **Enable Cloudflare Web Analytics for maxoff.in** (cookie-less, no banner). If Cloudflare does not add the beacon by itself, pass the site's public beacon token so it can be added to the page; it is a public identifier, not a secret. `scripts/check-budget.mjs` already allows the one beacon host (`static.cloudflareinsights.com`); `pnpm check:static` and its tests must be updated in the same change if the beacon is added to the markup. Then read the Analytics line on `/privacy` again: "We count visits with cookie-less analytics. No cookies are set." must still be true.
  4. Run the verification checklist in the PR.

**Acceptance:** https://maxoff.in serves the site; the go/no-go checklist is complete.
