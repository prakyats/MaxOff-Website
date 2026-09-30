# Progress

## Current state

- **Phases 0 to 4 are done and merged** (Phase 3 in PR #5; contact by email confirmed working by the owner). Phase 5 (polish) is postponed until after launch.
- **Phase 6 (launch) is merged** (PR #6): the pre-launch switch is off and `wrangler.jsonc` has the custom domains `maxoff.in` and `www.maxoff.in`. The owner's post-merge steps (DNS cleanup, the www redirect rule, Web Analytics, the verification checklist) are in `docs/ROADMAP.md` Phase 6.
- **Phase 5, first slice** (mobile controls, PR #7) is merged.
- **Phase 5, second slice** (Lighthouse and an accessibility audit past axe, PR #8) is merged: Lighthouse 100 across the four categories locally with production-like compression; five defects fixed, each with a test.
- **The third role is now Crew** (owner decision, 30 Sep 2026; `docs/BRIEF.md` §3), on `copy/crew-role`: every "Staff" on the site, in the phone mock-up caption and on the social image now says Crew. The facts are unchanged. A test fails if "staff" appears on any page.
- **www redirect** (branch `fix/www-and-crew`, 30 Sep 2026): www.maxoff.in still answered 200 with the page, so the Redirect Rule was never created. The exact dashboard steps are in `docs/ROADMAP.md` Phase 6 step 2; `pnpm check:www` checks the live redirect (it fails until the rule is deployed). Crew was already live from PR #9: no page says Staff.
- Cloudflare: the Worker is `maxoff-website`. Email Routing for hello@maxoff.in is live.

## Next step

1. The owner creates the www Redirect Rule (`docs/ROADMAP.md` Phase 6 step 2) and runs `pnpm check:www`; then merges `fix/www-and-crew`, runs PageSpeed Insights on https://maxoff.in (mobile) and checks the site on an iPhone in Safari: tap the hero's Request a demo, open the menu in landscape.
2. The owner's critique and polish pass (the design skills run from a local session), and the Phase 6 owner steps still open (the www redirect rule, Web Analytics).

## Decisions

- **Stack:** Astro 7, Tailwind CSS 4, TypeScript 5.9 (TypeScript 7 is out but `astro check` and typescript-eslint do not support it yet), pnpm 12, Node 22.
- **Indexable since launch.** `PRE_LAUNCH` in `src/lib/launch.ts` is now `false`; `true` would put `noindex` on every page and `Disallow: /` in `robots.txt`. The 404 page is always `noindex`. Preview URLs are indexable too, since they share the build. The workers.dev account subdomain contains a name the brand check bans, so docs use `<account>` instead of writing it.
- **Branch builds need `"previews": {}`.** Cloudflare builds non-production branches with `npx wrangler preview` (production uses `npx wrangler deploy`). `wrangler preview` stops with "missing a `previews` block" unless `wrangler.jsonc` has one; it can be empty for a static site. This is what failed the first branch build on PR #3, after install and build had passed. `pnpm check:static` now requires the block.
- **Fully static.** No form, no Worker, no third-party service, no API key, no environment variable. `wrangler.jsonc` holds static assets only. `pnpm check:static` fails on a Worker directory, Worker config, any address other than the contact address, or an address or plain mailto link in the built site.
- **Contact is email only** (hello@maxoff.in, forwarded to the owner's inbox in Cloudflare). Every character of the address is written as an HTML entity by `src/lib/contact.ts`; Copy email assembles it at runtime from parts.
- **Developer credit** and the brand rule: see `CLAUDE.md` rule 1. `pnpm check:brand` allows exactly one string, in two files; `pnpm test:scripts` tests it.
- **Fonts:** Geist and Geist Mono (Vercel, SIL OFL), variable, Latin subset, copied into `public/fonts/` from fontsource, preloaded, `font-display: swap`. No Adobe Fonts.
- **Icons:** Lucide via `@lucide/astro`, 1.5px stroke, imported one by one.
- **Theme:** dark by default, following the system; the choice is kept in the visitor's own browser storage.
- **www → apex** is a Redirect Rule in the Cloudflare dashboard: Workers static assets cannot match on hostname and the site has no Worker code.
- **URLs:** no trailing slashes (`build.format: 'file'` and `auto-trailing-slash`).
- **The task loop** animates a registered custom property (`--on`) so dots and names fade in turn. It runs only when scripting is on and motion is allowed, has a Pause button (WCAG 2.2.2), and reads as a plain ordered list otherwise. Under reduced motion all four steps show as complete.
- **Coming cards** (seven) use a dashed badge, a faint hatch and muted titles: dimmed, never green.
- **The light and dark phone pair** (Crew My day in dark, Owner leave request in light; the hero keeps the Owner's Today) forces each frame's tokens (`.phone--dark`, `.phone--light`), so the pair is the same in either page theme.
- **One red button per view.** The header's Request a demo shows only while no other primary button is on screen (it starts collapsed, and a small IntersectionObserver script sets `html[data-header-cta]` when no other primary button is visible).
- **Social image and icons are drawn at build time** by endpoints (`src/pages/og.png.ts`, `apple-touch-icon.png.ts`, `favicon.ico.ts`): satori turns an element tree into SVG, `@resvg/resvg-js` turns that into PNG, and the fonts are the static `.woff` files from `@fontsource/geist` and `@fontsource/geist-mono`, read from `node_modules` relative to the project root. They are dev dependencies only and nothing from them ships to the browser. `src/lib/brand-mark.ts` holds the one drawing of the logo mark (used by the images) and `src/lib/render.ts` the PNG and ICO helpers. The image says MaxOff, never the developer.
- **Structured data** is one JSON-LD `SoftwareApplication` (name, url, description, category "BusinessApplication", operating system "Web") on the home page only. No ratings, offers, author or publisher, so no company name appears in any `<head>`.
- **Sub-pages use the full header.** `/privacy` and `/404` pass `navBase="/"` to `SiteHeader`, so the section links become `/#what` and so on and the phone menu, with Request a demo and Sign in, exists on every page. Without it a phone had no way to reach Request a demo from the header on those pages.
- **Touch is tested with taps, not clicks.** Playwright's `tap()` (phone project, `hasTouch`) refuses an element that another element covers at the tap point, which is how the hero bug would have been caught: the glow behind the phone (`.mo-hero__device::before`, `inset: -15%`) painted over the hero's buttons on stacked layouts and took every tap. It is `pointer-events: none` now. Two more rules from the same pass: `scroll-padding-top: 5rem` on `html`, so section links and the skip link land below the sticky header; and `.site-header[data-menu-open]` caps the header at the screen height and lets it scroll, because a sticky header taller than the screen can never be scrolled into view (the menu's last buttons were unreachable in landscape and at 200 % text).
- **Measuring performance here:** Astro's preview server and a plain static server send the HTML and CSS uncompressed (69 KB and 41 KB), which pushes the simulated LCP to 1.8 s and makes Lighthouse noisy. Cloudflare sends them with Brotli (about 10 KB and 8 KB). A small Brotli server in the scratchpad gives stable, production-like numbers: 100 on all four categories, LCP 1.4 s. The live URL, through PageSpeed Insights, is still the number that counts.
- **The task loop pauses off screen.** `@property --on` animations are main-thread: Chrome restyles the steps every frame for the whole ten-second cycle, not just during the fades. An `IntersectionObserver` sets `data-inview`, and the steps are paused without it, the same way the Pause button pauses them. A test counts style recalculations over 1.5 s at the top of the page (must be 2 or fewer).
- **Forced colours** (Windows high contrast) strip backgrounds. The red button gets a `LinkText` outline there, and the loop's dots opt out with `forced-color-adjust: none` and use `CanvasText` and `Canvas`, so done and not-done steps still differ.
- **Contrast of text over the grid and glow:** axe cannot decide text over pseudo-element backgrounds and reports it as needing review. The audit screenshots the page with and without text and compares each text colour with the background pixels under its glyphs. All 107 such nodes pass; the tightest is the light-theme phone caption at 4.57:1.
- **Astro 7 preview in tests:** `astro preview` detaches into a background daemon when it detects an agent environment, and pnpm's wrapper puts the server in its own process group. Playwright starts `node node_modules/astro/bin/astro.mjs preview --ignore-lock` directly, which stays in the foreground and stops cleanly.
- **Playwright in sandboxes:** set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a local Chromium when Playwright's own download is unavailable; CI installs Playwright's Chromium normally.
- **ESLint:** ESLint 10 with `eslint-plugin-astro` and `eslint-plugin-jsx-a11y-x` (the original jsx-a11y plugin does not support ESLint 10).
- **Session skills:** none of the §10 plugins are enabled in this session. `marketing`, `design`, `frontend-design` and `Cloudflare` exist in the catalog and the owner is enabling them; `impeccable` and `agent-skills` are not in the catalog and will be run from a local session. The competitive-brief refinement of `docs/BRIEF.md` §2 is deferred until the marketing plugin is available.

## Open questions

None open. Answered on 29 Sep 2026: direction Instrument with two borrowings; keep "We usually reply within two working days." under the contact block; keep both closing headings; one plain line about the theme choice on the privacy page; the Phase 3 copy edits and the privacy text (`docs/BRIEF.md` §3).
