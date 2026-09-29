# Progress

## Current state

- **Phase 0** is merged (PR #1). The owner connected Cloudflare Workers Builds: the Worker is `maxoff-website`, production at `maxoff-website.<account>.workers.dev`, previews at `<id>-maxoff-website.<account>.workers.dev`. Email Routing for hello@maxoff.in is live.
- **Phase 1** (design directions) is in progress on `phase-1/design-directions`. The first slice (owner decisions, the developer credit and its brand check) is merged (PR #2). This slice adds the shared header, footer, contact block and Today screen, the fully static setup, the pre-launch noindex switch, and the three directions with a chooser at `/preview`.

## Next step

1. Get every test green, open the Phase 1 PR, share screenshots.
2. The owner picks a direction. Then Phase 2 builds the full page in it and removes `/preview`.

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
- **One red button per view.** The header's Request a demo shows only while no other primary button is on screen (it starts collapsed, and a small IntersectionObserver script sets `html[data-header-cta]` when no other primary button is visible).
- **Astro 7 preview in tests:** `astro preview` detaches into a background daemon when it detects an agent environment, and pnpm's wrapper puts the server in its own process group. Playwright starts `node node_modules/astro/bin/astro.mjs preview --ignore-lock` directly, which stays in the foreground and stops cleanly.
- **Playwright in sandboxes:** set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a local Chromium when Playwright's own download is unavailable; CI installs Playwright's Chromium normally.
- **ESLint:** ESLint 10 with `eslint-plugin-astro` and `eslint-plugin-jsx-a11y-x` (the original jsx-a11y plugin does not support ESLint 10).
- **Session skills:** none of the §10 plugins are enabled in this session. `marketing`, `design`, `frontend-design` and `Cloudflare` exist in the catalog and the owner is enabling them; `impeccable` and `agent-skills` are not in the catalog and will be run from a local session. The competitive-brief refinement of `docs/BRIEF.md` §2 is deferred until the marketing plugin is available.

## Open questions

1. The old success message promised a reply "within two working days". With email contact I dropped that line. Keep it under the contact block?
2. The closing section has both the headline "The final say is yours." and, below it, the block heading "Tell us about your studio". Keep both, or make it one?
3. The privacy page (Phase 3) says only cookie-less analytics. The theme choice is kept in the visitor's own browser storage and never sent anywhere. Should the page say so?
4. The Privacy link in the footer points at `/privacy`, which arrives in Phase 3. Until then it shows the 404 page.
