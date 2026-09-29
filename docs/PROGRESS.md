# Progress

## Current state

- **Phase 0** and the first slice of **Phase 1** are merged. PR #3 (the design directions, static setup, noindex switch, the branch-build fix) is open. Its final commits record the owner's choice: **Instrument**, with Glass's chips and Editorial's giant closing type. `docs/DESIGN.md` is final.
- **Phase 2** (the full page) is built on `phase-2/build-page`, stacked on the Phase 1 branch: hero, the three questions, What it does (Live), Coming next with the task loop, Feels like an app (light and dark phones), Roles, Trust, How it starts, and the closing section with the contact block. The `/preview` pages, the Glass and Editorial styles and Inter Tight are gone.
- Cloudflare: the Worker is `maxoff-website`. Email Routing for hello@maxoff.in is live.

## Next step

1. The owner reads the page and the copy. Copy is a first pass written only from `docs/BRIEF.md`; Phase 3 is the review.
2. Merge PR #3, then the Phase 2 PR. Then Phase 3: final copy review, `/privacy`, OG image, meta, JSON-LD, favicons.

## Decisions

- **Stack:** Astro 7, Tailwind CSS 4, TypeScript 5.9 (TypeScript 7 is out but `astro check` and typescript-eslint do not support it yet), pnpm 12, Node 22.
- **Not indexed until launch.** `PRE_LAUNCH` in `src/lib/launch.ts` (true) puts `noindex` on every page and `Disallow: /` in `robots.txt`. Phase 6 flips it. The workers.dev account subdomain contains a name the brand check bans, so docs use `<account>` instead of writing it.
- **Branch builds need `"previews": {}`.** Cloudflare builds non-production branches with `npx wrangler preview` (production uses `npx wrangler deploy`). `wrangler preview` stops with "missing a `previews` block" unless `wrangler.jsonc` has one; it can be empty for a static site. This is what failed the first branch build on PR #3, after install and build had passed. `pnpm check:static` now requires the block.
- **Fully static.** No form, no Worker, no third-party service, no API key, no environment variable. `wrangler.jsonc` holds static assets only. `pnpm check:static` fails on a Worker directory, Worker config, any address other than the contact address, or an address or plain mailto link in the built site.
- **Contact is email only** (hello@maxoff.in, forwarded to the owner's inbox in Cloudflare). Every character of the address is written as an HTML entity by `src/lib/contact.ts`; Copy email assembles it at runtime from parts.
- **Developer credit** and the brand rule: see `CLAUDE.md` rule 1. `pnpm check:brand` allows exactly one string, in two files; `pnpm test:scripts` tests it.
- **Fonts:** Geist and Geist Mono (Vercel, SIL OFL) and Inter Tight (SIL OFL), variable, Latin subset, copied into `public/fonts/` from fontsource, preloaded, `font-display: swap`. No Adobe Fonts.
- **Icons:** Lucide via `@lucide/astro`, 1.5px stroke, imported one by one.
- **Theme:** dark by default, following the system; the choice is kept in the visitor's own browser storage.
- **URLs:** no trailing slashes (`build.format: 'file'` and `auto-trailing-slash`).
- **The task loop** animates a registered custom property (`--on`) so dots and names fade in turn. It runs only when scripting is on and motion is allowed, has a Pause button (WCAG 2.2.2), and reads as a plain ordered list otherwise. Under reduced motion all four steps show as complete.
- **Coming cards** use a dashed badge, a faint hatch and muted titles: dimmed, never green.
- **The light and dark phone pair** forces each frame's tokens (`.phone--dark`, `.phone--light`), so the pair is the same in either page theme.
- **One red button per view.** The header's Request a demo shows only while no other primary button is on screen (it starts collapsed, and a small IntersectionObserver script sets `html[data-header-cta]` when no other primary button is visible).
- **Astro 7 preview in tests:** `astro preview` detaches into a background daemon when it detects an agent environment, and pnpm's wrapper puts the server in its own process group. Playwright starts `node node_modules/astro/bin/astro.mjs preview --ignore-lock` directly, which stays in the foreground and stops cleanly.
- **Playwright in sandboxes:** set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a local Chromium when Playwright's own download is unavailable; CI installs Playwright's Chromium normally.
- **ESLint:** ESLint 10 with `eslint-plugin-astro` and `eslint-plugin-jsx-a11y-x` (the original jsx-a11y plugin does not support ESLint 10).
- **Session skills:** none of the §10 plugins are enabled in this session. `marketing`, `design`, `frontend-design` and `Cloudflare` exist in the catalog and the owner is enabling them; `impeccable` and `agent-skills` are not in the catalog and will be run from a local session. The competitive-brief refinement of `docs/BRIEF.md` §2 is deferred until the marketing plugin is available.

## Open questions

None open. Answered on 29 Sep 2026: direction Instrument with two borrowings; keep "We usually reply within two working days." under the contact block; keep both closing headings; one plain line about the theme choice on the privacy page. Phase 3 note: the footer Privacy link shows the 404 page until `/privacy` exists.
