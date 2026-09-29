# Progress

## Current state

- **Phases 0 to 2 are merged.** Phase 1 chose **Instrument** (with Glass's chips and Editorial's giant closing type); Phase 2 built the full page, and its review added the Staff My day phone, Approve and Reject, and the seventh Coming card.
- **Phase 3** is built on `phase-3/copy-seo` (PR open, the owner merges): the approved copy edits, `/privacy`, the social image, favicons and Apple touch icon, Open Graph and Twitter tags, canonical URLs, the sitemap, and JSON-LD `SoftwareApplication` on the home page. `pnpm check` and the Playwright and axe suite pass.
- Cloudflare: the Worker is `maxoff-website`. Email Routing for hello@maxoff.in is live. Until Phase 6 the site is `noindex` and `robots.txt` disallows everything.

## Next step

1. The owner merges the Phase 3 PR once its checks are green.
2. Phase 4 (contact by email) is mostly built already; it verifies a real email reaches the owner's inbox and that Copy email works on a phone and a desktop.
3. Phase 5 polish, then Phase 6 launch. Phase 6 includes an owner step: enable Cloudflare Web Analytics for maxoff.in (see `docs/ROADMAP.md`).

## Decisions

- **Stack:** Astro 7, Tailwind CSS 4, TypeScript 5.9 (TypeScript 7 is out but `astro check` and typescript-eslint do not support it yet), pnpm 12, Node 22.
- **Not indexed until launch.** `PRE_LAUNCH` in `src/lib/launch.ts` (true) puts `noindex` on every page and `Disallow: /` in `robots.txt`. Phase 6 flips it. The workers.dev account subdomain contains a name the brand check bans, so docs use `<account>` instead of writing it.
- **Branch builds need `"previews": {}`.** Cloudflare builds non-production branches with `npx wrangler preview` (production uses `npx wrangler deploy`). `wrangler preview` stops with "missing a `previews` block" unless `wrangler.jsonc` has one; it can be empty for a static site. This is what failed the first branch build on PR #3, after install and build had passed. `pnpm check:static` now requires the block.
- **Fully static.** No form, no Worker, no third-party service, no API key, no environment variable. `wrangler.jsonc` holds static assets only. `pnpm check:static` fails on a Worker directory, Worker config, any address other than the contact address, or an address or plain mailto link in the built site.
- **Contact is email only** (hello@maxoff.in, forwarded to the owner's inbox in Cloudflare). Every character of the address is written as an HTML entity by `src/lib/contact.ts`; Copy email assembles it at runtime from parts.
- **Developer credit** and the brand rule: see `CLAUDE.md` rule 1. `pnpm check:brand` allows exactly one string, in two files; `pnpm test:scripts` tests it.
- **Fonts:** Geist and Geist Mono (Vercel, SIL OFL), variable, Latin subset, copied into `public/fonts/` from fontsource, preloaded, `font-display: swap`. No Adobe Fonts.
- **Icons:** Lucide via `@lucide/astro`, 1.5px stroke, imported one by one.
- **Theme:** dark by default, following the system; the choice is kept in the visitor's own browser storage.
- **URLs:** no trailing slashes (`build.format: 'file'` and `auto-trailing-slash`).
- **The task loop** animates a registered custom property (`--on`) so dots and names fade in turn. It runs only when scripting is on and motion is allowed, has a Pause button (WCAG 2.2.2), and reads as a plain ordered list otherwise. Under reduced motion all four steps show as complete.
- **Coming cards** (seven) use a dashed badge, a faint hatch and muted titles: dimmed, never green.
- **The light and dark phone pair** (Staff My day in dark, Owner leave request in light; the hero keeps the Owner's Today) forces each frame's tokens (`.phone--dark`, `.phone--light`), so the pair is the same in either page theme.
- **One red button per view.** The header's Request a demo shows only while no other primary button is on screen (it starts collapsed, and a small IntersectionObserver script sets `html[data-header-cta]` when no other primary button is visible).
- **Social image and icons are drawn at build time** by endpoints (`src/pages/og.png.ts`, `apple-touch-icon.png.ts`, `favicon.ico.ts`): satori turns an element tree into SVG, `@resvg/resvg-js` turns that into PNG, and the fonts are the static `.woff` files from `@fontsource/geist` and `@fontsource/geist-mono`, read from `node_modules` relative to the project root. They are dev dependencies only and nothing from them ships to the browser. `src/lib/brand-mark.ts` holds the one drawing of the logo mark (used by the images) and `src/lib/render.ts` the PNG and ICO helpers. The image says MaxOff, never the developer.
- **Structured data** is one JSON-LD `SoftwareApplication` (name, url, description, category "BusinessApplication", operating system "Web") on the home page only. No ratings, offers, author or publisher, so no company name appears in any `<head>`.
- **Sub-pages use the full header.** `/privacy` and `/404` pass `navBase="/"` to `SiteHeader`, so the section links become `/#what` and so on and the phone menu, with Request a demo and Sign in, exists on every page. Without it a phone had no way to reach Request a demo from the header on those pages.
- **Astro 7 preview in tests:** `astro preview` detaches into a background daemon when it detects an agent environment, and pnpm's wrapper puts the server in its own process group. Playwright starts `node node_modules/astro/bin/astro.mjs preview --ignore-lock` directly, which stays in the foreground and stops cleanly.
- **Playwright in sandboxes:** set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a local Chromium when Playwright's own download is unavailable; CI installs Playwright's Chromium normally.
- **ESLint:** ESLint 10 with `eslint-plugin-astro` and `eslint-plugin-jsx-a11y-x` (the original jsx-a11y plugin does not support ESLint 10).
- **Session skills:** none of the §10 plugins are enabled in this session. `marketing`, `design`, `frontend-design` and `Cloudflare` exist in the catalog and the owner is enabling them; `impeccable` and `agent-skills` are not in the catalog and will be run from a local session. The competitive-brief refinement of `docs/BRIEF.md` §2 is deferred until the marketing plugin is available.

## Open questions

None open. Answered on 29 Sep 2026: direction Instrument with two borrowings; keep "We usually reply within two working days." under the contact block; keep both closing headings; one plain line about the theme choice on the privacy page; the Phase 3 copy edits and the privacy text (`docs/BRIEF.md` §3).
