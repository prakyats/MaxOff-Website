# MaxOff website: build brief for Claude Code

You are building the public marketing site for **MaxOff** at **https://maxoff.in**, in this repository (`maxoff-site`). The repository starts empty. This file is your complete brief: read all of it before doing anything, then follow **§13 First session** exactly.

---

## 1. What MaxOff is

MaxOff is an operations app for small creative studios and agencies (video, design, content teams of roughly 5–50 people). It replaces the WhatsApp messages, spreadsheets and memory that a studio owner uses today to know who is working, what was assigned, and what is waiting on them.

The app itself is a separate product in a separate repository, live at **https://app.maxoff.in**. **This repository is only the website.** You never touch the app, its code or its data.

### Hard facts about the product (use only these; never invent features)

**Roles:** exactly three: **Owner** (one per company), **Admin**, **Staff**. Job titles are just labels, not permissions.

**Live now:**
- **Attendance:** each person taps **Start day** and **End day** on their phone. The Owner approves the day. Corrections are added alongside the original, never over it.
- **Leave:** people request leave; **only the Owner decides**. Holidays and weekly offs are set by the Owner.
- **Comp leave:** extra work earns comp-leave credits (half or full day) that expire at the end of the calendar month; using one is approved by the Owner.
- **Expense claims:** a member submits their own claims; only they and the Owner can see them.
- **Month summary:** attendance, leave and comp leave per person for the month.
- **Clients:** client records with contacts, brand details and custom fields.
- **People:** invite by link, roles, job titles, deactivate without losing history.
- **Settings:** holidays, days off, thresholds, job titles, custom fields: all editable by the Owner, no developer needed.

**Coming next (label as "Coming", never as live):**
- **Tasks with acknowledgement:** every assignee must tap **"Noted"**; one primary owner marks it Done.
- **Approvals that end with the Owner:** Done → approving Admin (if any) → **Owner**. Final completion is always the Owner's.
- **Notifications and reminders:** in-app, push to the phone, email for the important few; escalations when a task is not acknowledged; quiet hours at night.
- **Dashboards and calendar** for each role.
- **Client projects:** recurring client work (projects → cycles → items) kept separate from staff tasks.
- **Work submission** with original-quality files.
- **Owner-only revenue and reports:** money is visible to the Owner only, never to Admins or Staff.

**True principles you may state:**
- Invite-only; clients never log in.
- **History is never overwritten:** corrections and cancellations are recorded next to the original.
- Every change is recorded (who did what, when).
- Permissions are enforced by the database itself, not only by the screens.
- **Money stays with the owner.**
- Nightly encrypted backups.
- Phone-first: installs from the browser like a native app (no app store), the back gesture behaves like a native app, light and dark themes.
- Built for Indian studios: business dates and times in IST.

**Never claim:** certifications (ISO, SOC 2), uptime percentages, customer counts, testimonials, logos of customers, a data-hosting country, integrations that do not exist, AI features, or prices. If a section seems to need one of these, leave it out or ask.

---

## 2. Non-negotiable rules

1. **The only brand is MaxOff.** Never write "Pixora", "Pixora Clips" or any real company or person's name anywhere: copy, alt text, metadata, code comments, commit messages, file names, demo data. Demo company: **Northwind Studio**. Demo people: invented first names only (e.g. Aarav, Meera, Kabir, Isha, Rohan, Tara).
2. **Honest labels:** every feature is shown as **Live** or **Coming**, and matches §1 exactly.
3. **No secrets in the repo or in chat.** API keys (Resend, Turnstile secret) are set by the owner in the Cloudflare dashboard. `.env.example` lists names only, with a comment each.
4. **App visuals are recreated in HTML/CSS**, never screenshots of the real app, so they stay sharp in both themes and never carry real data.
5. **Red (#C42126) is rare:** the logo mark and the one primary button per view. Never decorative, never for body text.
6. **Accessibility is not optional:** WCAG 2.2 AA, keyboard reachable, visible focus, `prefers-reduced-motion` respected, real text (no text in images).
7. **Performance budgets are hard limits** (§7). A change that breaks one does not merge.
8. **One writer per branch.** Work on a branch per phase, open a PR, and merge only when checks are green.
9. **Don't invent business facts.** If this brief does not answer something, ask.

---

## 3. Audience and positioning

**Primary reader:** the owner of a small creative studio or agency in India who runs the team from their phone and is tired of chasing people on WhatsApp.

**Secondary reader:** their operations lead or senior editor (a future Admin).

**The three questions every studio owner asks (use these as the spine of the page):**
1. *Who's in today?* → Attendance with Start day / End day, approved by you.
2. *Did they actually see the task?* → Every assignee taps "Noted" (Coming).
3. *What's waiting on me?* → Approvals, leave and expenses in one place, and the final say is yours.

**Positioning line (starting point, refine with the owner):** *MaxOff is the operating system for small studios: attendance, leave, tasks and approvals in one app your team already has on their phone, and the final say is always yours.*

**Tone:** calm, confident, precise. Short sentences. No hype words ("revolutionary", "seamless", "supercharge", "leverage", "unlock"). No exclamation marks. Speak to the owner as "you".

**How MaxOff differs** (verify and sharpen with `marketing:competitive-brief`): generic HR tools do attendance but not studio work; generic task tools do tasks but nobody is accountable for having *seen* them; neither keeps money private to the owner or keeps an unbroken history.

---

## 4. Site map

| Route | Purpose |
|---|---|
| `/` | The landing page (sections in §5) |
| `/privacy` | Privacy policy for the website and the early-access form (plain language) |
| `/404` | Not found, on brand, with a link home |
| `/og.png` | Social share image (1200×630), generated at build time |

Later (not now): `/pricing`, `/security`, `/changelog`, a blog.

`www.maxoff.in` redirects permanently to `maxoff.in`. `app.maxoff.in` is the app and is **not** part of this project; the site links to it only via a quiet "Sign in" link in the header.

---

## 5. The landing page, section by section

1. **Header:** MaxOff logo (red rounded square with a white "M", plus the wordmark), links to the sections (What it does · How it works · Roles · Trust), "Sign in" (quiet text link to https://app.maxoff.in), and the primary button **Request early access**. Sticky, compact, translucent on scroll. Mobile: logo, primary button, menu.
2. **Hero:** headline (3–7 words), one supporting sentence, primary button **Request early access**, secondary text link "See how it works". On the right (below on phones): a phone frame showing a recreated **Today** screen (Start day strip, pending approvals, who's in). A faint grid and one soft red glow behind it. A small mono label above the headline, e.g. `OPERATIONS FOR STUDIOS`.
3. **The three questions:** three cards, each question in large type with the one-line answer beneath.
4. **What it does (Live):** feature cards with a **Live** badge: Attendance, Leave, Comp leave, Expense claims, Month summary, Clients, People, Settings. Each: icon, title, one sentence.
5. **Coming next:** the same card style, dimmed, with a **Coming** badge: Tasks with "Noted", Owner-final approvals, Notifications & reminders, Dashboards & calendar, Client projects, Owner-only revenue & reports. One short loop animation here: a task card moving *Assigned → Noted → Done → Approved*.
6. **Feels like an app:** installs from the browser, no app store; back gesture like a native app; light and dark; works on any modern phone. Visual: two phone frames (light and dark).
7. **Three roles:** Owner / Admin / Staff side by side: what each sees and does. Include the line **"Money stays with the owner."**
8. **Trust:** invite-only; history never overwritten; every change recorded; permissions enforced by the database; nightly encrypted backups; clients never log in. No certifications or numbers.
9. **How it starts:** three steps: *Invite your team by link → They tap Start day → You decide.*
10. **Early access:** short pitch plus the form (§8).
11. **Footer:** logo, one-line description, links (Privacy, Contact: hello@maxoff.in, Sign in), © MaxOff and the year.

Every section must work at 360px, 390px, 430px, 768px, 1280px and 1440px wide, in both themes, and at 200% text size.

---

## 6. Design system (write it to `docs/DESIGN.md` first)

**Feel:** minimal, futuristic, modern, quiet. Think precise instrument, not neon arcade.

- **Colour tokens** (CSS custom properties on `:root`, dark by default, light under `[data-theme="light"]` and `prefers-color-scheme: light`):
  - background near-black `#0A0A0B` / light `#FAFAFA`
  - surface `#121214` / `#FFFFFF`, hairline border `#232326` / `#E4E4E7`
  - text `#F4F4F5` / `#16161A`, muted text `#A1A1AA` / `#52525B` (check contrast ≥ 4.5:1)
  - **accent red `#C42126`** (logo, primary button, the one glow); success green only for the "Live" badge
- **Type:** a tight modern sans for headings and body (**Geist** or **Inter Tight**), a mono for small labels (**Geist Mono** or **JetBrains Mono**). Self-host the fonts (no third-party font requests at runtime), `font-display: swap`, subset to Latin. Fluid type scale with `clamp()`; hero headline large with tight tracking.
- **Texture:** a faint grid background (1px lines, very low opacity) that fades out at the edges, one soft radial red glow behind the hero, hairline borders, cards only barely frosted (`backdrop-filter` with a solid fallback).
- **Spacing:** 4px base, generous section spacing, max content width ~1200px, 16px side gutter on phones.
- **Radius:** 14px cards, 10px buttons, phone frames ~40px.
- **Motion:** fade-and-rise on scroll (small distance, 400–600 ms, ease-out), the task-state loop in §5.5, a subtle hover lift on cards. No parallax, no scroll-jacking, no autoplaying video. Everything static under `prefers-reduced-motion: reduce`.
- **Icons:** one consistent line icon set (e.g. Lucide), 1.5px stroke.
- **Theme toggle:** in the footer or header, remembered in `localStorage` (wrapped in try/catch), no flash of the wrong theme on load.

Phase 1 produces **2–3 genuinely different directions** within these constraints (e.g. *Instrument*, a strict grid with mono labels; *Glass*, depth and soft light; *Editorial*, big type and whitespace) as preview pages. The owner picks one; then `docs/DESIGN.md` is finalised.

---

## 7. Stack, structure and budgets

- **Astro** (latest stable), **TypeScript strict**, **Tailwind CSS v4**, **pnpm**. Static output. Islands only where interaction needs JS (theme toggle, form, the task loop if CSS alone can't do it).
- **Hosting:** Cloudflare Workers with static assets, deployed by **Cloudflare's Git integration** (Workers Builds): every push to `main` deploys, every branch gets a preview URL. No deploy secrets in GitHub.
- **The form endpoint:** a small Worker route (`/api/early-access`) in the same project: validates input, verifies Turnstile, sends one email via the Resend API to the inbox, returns JSON. No database.
- **Analytics:** Cloudflare Web Analytics (cookie-less). No cookie banner, no other trackers.

Suggested layout:

```
/src
  /pages        index.astro, privacy.astro, 404.astro
  /components   Header, Hero, PhoneFrame, screens/TodayScreen, FeatureCard, RoleColumn, TaskLoop, EarlyAccessForm, Footer, ThemeToggle
  /styles       tokens.css, global.css
  /content      copy.ts (all page copy in one place, easy to review)
/worker         early-access handler (Turnstile verify + Resend send)
/public         fonts, favicon set, robots.txt
/docs           BRIEF.md, DESIGN.md, SITEMAP.md, ROADMAP.md, PROGRESS.md
CLAUDE.md       the rules in §2, the commands, the Definition of Done
wrangler.jsonc  assets + the worker route; custom domains maxoff.in and www.maxoff.in
```

**Budgets (hard limits, checked before every merge):**
- LCP < 1.5 s on a throttled 4G phone profile; CLS < 0.05; INP < 200 ms.
- JavaScript shipped on `/` < 30 KB gzipped; CSS < 40 KB gzipped.
- Lighthouse 95+ on Performance, Accessibility, Best Practices and SEO (mobile).
- Total page weight on first load < 500 KB.

**Scripts:** `pnpm dev`, `pnpm build`, `pnpm check` (astro check + typecheck + lint + format check + build + budget check). `pnpm check` must pass before every commit. Add Playwright for a few smoke tests (page loads, sections present, form validation, theme toggle, no horizontal scroll at 360px) and an axe accessibility check.

---

## 8. Early-access form

Fields (confirm with the owner): **Name**, **Work email**, **Studio name**, **Team size** (1–10 / 11–25 / 26–50 / 50+), **What do you want to fix first?** (optional, short text). Consent line linking to `/privacy`.

- Client-side and server-side validation with clear messages; 16px inputs; 44px targets; a loading state on submit; success and error states that keep what was typed.
- **Cloudflare Turnstile** (invisible or managed mode) against spam; the secret key lives only in the Worker's settings.
- The Worker sends a plain email via **Resend** to the owner's inbox (address set as a Worker variable, e.g. `LEADS_TO`), from `MaxOff <hello@maxoff.in>` or a sending address the owner provides. Rate-limit by IP (simple per-minute limit).
- No data stored anywhere else. `/privacy` says exactly this.

Owner-side setup the session must **list as steps for the owner** (never do it with keys in chat): create the Turnstile widget for maxoff.in; create a Resend API key with sending-only access; add `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `LEADS_TO` in Cloudflare → Workers → the project → Settings → Variables and Secrets; set up **Cloudflare Email Routing** so `hello@maxoff.in` forwards to the owner's inbox.

---

## 9. SEO and sharing

- Title: "MaxOff: operations for small studios" (refine with the owner); meta description ≤ 155 characters.
- Open Graph and Twitter card tags; `/og.png` 1200×630 in the site's style (logo, headline, faint grid).
- Canonical `https://maxoff.in/`; `robots.txt`; `sitemap.xml`; JSON-LD `SoftwareApplication` (name, description, applicationCategory "BusinessApplication", operatingSystem "Web"), with **no** ratings or offers.
- Favicons and an Apple touch icon: the red rounded square with the white "M".
- One `h1`, logical heading order, descriptive link text.

---

## 10. Plugins and skills: how to use them

First, **list which skills and plugins this session actually has** and report any missing from the list below. If the design ones are missing, say so; the owner can run those passes from a local session against the preview URL.

| When | Use | For |
|---|---|---|
| Phase 0 | `marketing:competitive-brief` | How MaxOff differs from HR tools and task tools |
| Phase 0 | `agent-skills:spec`, `agent-skills:plan` | The spec and the phase plan with acceptance criteria |
| Phase 1 | `impeccable` (shape), `frontend-design:frontend-design` | 2–3 distinct design directions |
| Phase 1 | `adobe-for-creativity:adobe-fonts` (if signed in) | Font choice and pairing (else Google Fonts, self-hosted) |
| Phase 2 | `agent-skills:build`, `agent-skills:incremental-implementation` | Build section by section |
| Phase 3 | `marketing:content-creation`, `design:ux-copy`, `marketing:brand-review` | Headlines, section copy, microcopy, a voice check |
| Phase 3 | `marketing:seo-audit` | Titles, descriptions, structure |
| Phase 4 | `cloudflare:wrangler`, `cloudflare:workers-best-practices`, `cloudflare:turnstile-spin` | The Worker, deploy config, Turnstile |
| Phase 5 | `impeccable` (critique, polish, audit), `design:design-critique` | Visual quality pass |
| Phase 5 | `design:accessibility-review` | WCAG 2.2 AA audit |
| Phase 5 | `agent-skills:webperf`, `cloudflare:web-perf` | Core Web Vitals against the budgets |
| Phase 6 | `agent-skills:ship` | The go/no-go checklist before pointing maxoff.in at it |

Plugins are advisors: if one suggests something that conflicts with this brief or `CLAUDE.md`, the brief wins; mention the suggestion instead of applying it.

---

## 11. Phases (write them to `docs/ROADMAP.md`)

Each phase: its own branch and PR, `pnpm check` green, a short note in `docs/PROGRESS.md`, then merge.

- **Phase 0: Setup and skeleton.** Docs kit (§12), Astro + Tailwind + TS strict scaffold, tokens, one placeholder page, `pnpm check` with the budget check, Playwright + axe smoke tests, `wrangler.jsonc`, `.env.example`. The owner connects the repo to Cloudflare (Workers Builds) and confirms a preview URL works. **Do not attach maxoff.in yet.**
- **Phase 1: Design direction.** 2–3 directions as preview pages (hero + one feature section + footer each, both themes, phone and desktop). The owner picks; finalise `docs/DESIGN.md`.
- **Phase 2: Build the page.** Every section in §5 with the chosen direction, the recreated app screens (Today, a task card, an approval), the task loop, responsive at every width in §5, both themes.
- **Phase 3: Copy, SEO and sharing.** Final copy in `src/content/copy.ts` (reviewed by the owner), `/privacy`, `/404`, OG image, meta, sitemap, JSON-LD, favicons.
- **Phase 4: The form.** Worker endpoint, Turnstile, Resend, rate limit, all states, tests. The owner does the §8 setup steps.
- **Phase 5: Polish.** Critique and polish passes, accessibility audit, performance against the budgets on the preview URL, cross-browser check (Chrome Android, Safari iOS, desktop Chrome/Safari/Firefox).
- **Phase 6: Launch.** The owner removes the old parked/GoDaddy records for the apex if any remain, then the session adds the custom domains `maxoff.in` and `www.maxoff.in` (www → apex 301) in `wrangler.jsonc`; verify HTTPS, redirects, analytics, the form end to end with a real submission, and that `app.maxoff.in` is untouched.

---

## 12. Docs kit to create in Phase 0

- `CLAUDE.md`: what this repo is; the rules in §2; commands; the budgets; the Definition of Done: `pnpm check` passes, works at every width in §5 in both themes and at 200% text, keyboard and screen-reader usable, reduced motion respected, budgets met, no "Pixora" anywhere (add a check to `pnpm check` that fails on that word, case-insensitive, outside this brief), copy matches §1, PROGRESS updated.
- `docs/BRIEF.md`: §1 and §3 of this file, refined with the competitive brief.
- `docs/DESIGN.md`: §6, finalised after Phase 1.
- `docs/SITEMAP.md`: §4 and §5.
- `docs/ROADMAP.md`: §11.
- `docs/PROGRESS.md`: current state, next step, decisions, open questions.
- Keep this file as `docs/BRIEF-ORIGINAL.md` for reference.

---

## 13. First session: do exactly this

1. Read this whole file.
2. Report the skills/plugins available (§10) and anything missing.
3. Create the Phase 0 branch; write the docs kit (§12); scaffold the project (§7); make `pnpm check` pass; push; open the PR.
4. Give the owner the exact Cloudflare steps to connect this repo with Workers Builds (build command, output directory, the production branch `main`, where preview URLs appear). No custom domain yet.
5. Ask the owner **every open question in one message**, each with your recommendation, including at least:
   - 3 headline options and 2 positioning lines;
   - the form fields (§8) and the inbox address for leads;
   - whether to show "Sign in" in the header now;
   - whether the footer names a founder or company (default: "© MaxOff" only);
   - light or dark as the default theme (default: dark, following the system);
   - anything in §1 you think is unclear.
6. Stop and wait for the answers. Then run Phase 1 and show the directions.

Working rules for every session: commit and push at every step so nothing is lost; no loops polling CI (one check when it's likely done); never put keys in files or chat; if context gets heavy, write a handoff in `docs/PROGRESS.md` before anything else.
