# Progress

## Current state

Phase 0 in progress on branch `claude/zealous-curie-92bmzb`: docs kit, Astro + Tailwind v4 + TypeScript strict scaffold, tokens and theme toggle, placeholder page and 404, `pnpm check` (typecheck, lint, format, build, budget, brand), Playwright + axe smoke tests, `wrangler.jsonc`, Worker stub, `.env.example`, CI workflow.

## Next step

1. Owner connects the repo to Cloudflare Workers Builds (steps in the Phase 0 PR) and confirms a preview URL works. No custom domain yet.
2. Owner answers the open questions below.
3. Phase 1: 2–3 design directions as preview pages.

## Decisions

- **Stack versions:** Astro 7, Tailwind CSS 4, TypeScript 5.9 (TypeScript 7 is out but `astro check` and typescript-eslint do not support it yet), pnpm 12, Node 22.
- **Fonts:** Geist and Geist Mono, variable, Latin subset only, copied into `public/fonts/` from the fontsource packages (SIL OFL). Preloaded, `font-display: swap`. Phase 1 may swap to Inter Tight.
- **Theme default:** dark, following the system preference when the visitor has not chosen. Pending the owner's confirmation.
- **URLs:** no trailing slashes (`build.format: 'file'` + Workers `auto-trailing-slash`).
- **Worker routing:** only `/api/*` runs the Worker (`run_worker_first`); everything else is served straight from static assets. `keep_vars: true` so dashboard-set variables survive deploys.
- **ESLint:** ESLint 10 with `eslint-plugin-astro` and `eslint-plugin-jsx-a11y-x` (the original jsx-a11y plugin does not support ESLint 10).
- **Astro 7 preview in tests:** `astro preview` detaches into a background daemon when it detects an agent environment, and pnpm's wrapper puts the server in its own process group. Playwright therefore starts `node node_modules/astro/bin/astro.mjs preview --ignore-lock` directly, which stays in the foreground and stops cleanly.
- **Playwright in sandboxes:** set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a local Chromium when Playwright's own download is unavailable; CI installs Playwright's Chromium normally.
- **Brand check:** `scripts/check-brand.mjs` scans tracked files and `dist/`; the banned term is stored as joined fragments so the check never trips on itself.
- **Session skills:** none of the §10 plugins (`marketing`, `design`, `frontend-design`, `cloudflare`, `adobe-for-creativity`, `impeccable`, `agent-skills`) are enabled in this session. The first five exist in the catalog and can be enabled by the owner; `impeccable` and `agent-skills` are not in the catalog. The competitive-brief refinement of `docs/BRIEF.md` §2 is deferred until the marketing plugin is available.

## Open questions (asked in the Phase 0 PR / session)

1. Headline (3 options offered) and positioning line (2 options offered).
2. Form fields as in §8, and the inbox address for leads (`LEADS_TO`).
3. Show "Sign in" in the header now?
4. Footer: "© MaxOff" only, or a founder or company name?
5. Default theme: dark following the system?
6. Sending address for lead emails (`hello@maxoff.in` needs domain verification in Resend).
7. Clarifications on §1: what a Staff member sees of Attendance for others ("who's in"); whether Admins approve anything today; whether comp-leave credits are earned automatically or granted by the Owner.
