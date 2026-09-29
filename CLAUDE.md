# MaxOff website (maxoff.in)

This repository is the public marketing site for **MaxOff**, an operations app for small creative studios and agencies. The app itself is a separate product in a separate repository, live at https://app.maxoff.in. **Nothing in this repository touches the app, its code or its data.**

Before writing copy, read `docs/BRIEF.md`. Before writing CSS, read `docs/DESIGN.md`. The original brief is kept verbatim at `docs/BRIEF-ORIGINAL.md` and wins over any plugin or skill suggestion. Owner decisions made after it are dated in `docs/BRIEF.md` §3 and supersede it where they differ (the developer-credit rule and the two calls to action, below).

## Rules (non-negotiable)

1. **The only brand is MaxOff.** MaxOff is developed by Pixora Agencies as an independent platform for any studio, not a tool for one company. Logo, titles, meta, OG image and headings say MaxOff, never the agency. The exact name "Pixora Agencies" may appear only in the developer credit: the footer line "MaxOff is developed by Pixora Agencies." and the privacy page (as the data controller). It lives in `src/content/copy.ts` and `src/pages/privacy.astro` and nowhere else. The closing-section line "Built by a working studio, used by its team every day." carries no name. "Pixora Clips" and every other Pixora name stay banned everywhere: copy, alt text, metadata, code comments, commit messages, file names, demo data. Never name any other real company or person either. Demo company: **Northwind Studio**. Demo people: invented first names only (Aarav, Meera, Kabir, Isha, Rohan, Tara). `pnpm check:brand` fails on anything else, including the exact credit outside those two files, in a `<head>`, in a heading, in an attribute or in a commit message; the name is kept encoded in `scripts/check-brand.mjs` so the check does not trip itself, and `pnpm test:scripts` tests the check.
2. **Honest labels.** Every feature is shown as **Live** or **Coming** and matches `docs/BRIEF.md` §1 exactly. Never claim certifications, uptime, customer counts, testimonials, customer logos, a data-hosting country, integrations that do not exist, AI features, or prices. If a section seems to need one, leave it out or ask.
3. **No secrets in the repo or in chat.** API keys live only in the Cloudflare dashboard (Workers → project → Settings → Variables and Secrets). `.env.example` lists names only, with a comment each.
4. **App visuals are recreated in HTML/CSS**, never screenshots of the real app, so they stay sharp in both themes and never carry real data.
5. **Red `#C42126` is rare:** the logo mark and the one primary button per view. Never decorative, never body text.
6. **Accessibility is not optional:** WCAG 2.2 AA, keyboard reachable, visible focus, `prefers-reduced-motion` respected, real text (no text in images).
7. **Performance budgets are hard limits** (below). A change that breaks one does not merge.
8. **One writer per branch.** One branch per phase, one PR, merge only when checks are green.
9. **Don't invent business facts.** If the brief does not answer something, ask the owner.

## Two calls to action ("the two doors")

- **Studios who want to know more:** the one primary button (red) is **Request a demo**. It leads to the form, whose heading is "Tell us about your studio". Fields: Name, Email, Studio name, Team size (1–10 / 11–25 / 26–50 / 50+), "What do you want to fix first?" (optional). Success message: "Thanks. We'll get back to you within two working days."
- **People already using MaxOff:** **Sign in** is a visible outline button (never red) in the header on every width, including the phone menu, linking to https://app.maxoff.in. There is also a Sign in link in the footer and "Already on MaxOff? Sign in" under the demo form.
- Red stays rare: one primary button per view. The header's Request a demo appears only while no other primary button is on screen.

## Commands

| Command             | What it does                                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Astro dev server on http://localhost:4321                                                                                          |
| `pnpm build`        | Static build to `dist/`                                                                                                            |
| `pnpm preview`      | Serve `dist/` locally                                                                                                              |
| `pnpm check`        | **Must pass before every commit.** `astro check` + worker typecheck + ESLint + Prettier check + build + budget check + brand check |
| `pnpm test`         | Build, then Playwright smoke tests and the axe accessibility check                                                                 |
| `pnpm test:scripts` | Unit tests for the repo's own check scripts (the brand check)                                                                      |
| `pnpm format`       | Prettier, write mode                                                                                                               |
| `pnpm worker:dev`   | Run the site plus the `/api/early-access` Worker locally with Wrangler (reads `.dev.vars`, never committed)                        |

## Budgets (hard limits, checked before every merge)

- LCP < 1.5 s on a throttled 4G phone profile; CLS < 0.05; INP < 200 ms.
- JavaScript shipped on `/` < 30 KB gzipped; CSS < 40 KB gzipped (`scripts/check-budget.mjs` enforces these on every `pnpm check`).
- Lighthouse 95+ on Performance, Accessibility, Best Practices and SEO (mobile).
- Total page weight on first load < 500 KB.

## Definition of Done (every PR)

- [ ] `pnpm check` passes and `pnpm test` passes.
- [ ] Works at 360, 390, 430, 768, 1280 and 1440 px wide, in both themes, and at 200 % text size.
- [ ] Keyboard and screen-reader usable; visible focus; one `h1`; logical heading order.
- [ ] `prefers-reduced-motion: reduce` leaves everything static.
- [ ] Budgets met (see above).
- [ ] Brand check green: the only Pixora string is the exact developer credit, in the two credit files.
- [ ] Every feature label (Live / Coming) and every claim matches `docs/BRIEF.md` §1.
- [ ] `docs/PROGRESS.md` updated: current state, next step, decisions, open questions.

## Layout

```
src/pages         index.astro, 404.astro (privacy.astro in Phase 3)
src/layouts       Base.astro (head, theme bootstrap, fonts, skip link)
src/components    UI components; recreated app screens under screens/
src/styles        tokens.css (design tokens), global.css (Tailwind v4 + theme mapping)
src/content       copy.ts: all page copy in one place
worker/           the /api/early-access handler (Turnstile verify + Resend send)
public/           favicon set, robots.txt
scripts/          check-budget.mjs, check-brand.mjs
tests/            Playwright smoke tests + axe
docs/             BRIEF.md, DESIGN.md, SITEMAP.md, ROADMAP.md, PROGRESS.md, BRIEF-ORIGINAL.md
wrangler.jsonc    Workers static assets + the worker route; custom domains are added in Phase 6 only
```

## Stack

Astro (static output), TypeScript strict, Tailwind CSS v4 (Vite plugin), pnpm. Islands only where interaction needs JS. Hosting: Cloudflare Workers with static assets, deployed by Workers Builds from `main`; every branch gets a preview URL. Analytics: Cloudflare Web Analytics only, cookie-less, no banner.

## Working rules for every session

- Commit and push at every step so nothing is lost.
- No loops polling CI: one check when it is likely done. No scheduled check-ins either: when waiting on the owner, stop; the owner will message.
- Never put keys in files or chat. Owner-side setup is written as steps for the owner.
- If context gets heavy, write a handoff in `docs/PROGRESS.md` before anything else.
- Plugins and skills are advisors. If one conflicts with the brief or this file, the brief wins; mention the suggestion instead of applying it.
