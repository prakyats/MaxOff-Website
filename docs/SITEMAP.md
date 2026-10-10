# Sitemap and page structure

## Routes

| Route      | Purpose                                                                                                                              | Phase |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| `/`        | The landing page (sections below)                                                                                                    | 2     |
| `/privacy` | Privacy, plain language: no form data is collected, cookie-less analytics only, emails answered by the developer named in the footer | 3     |
| `/404`     | Not found, on brand, with a link home (never in the sitemap)                                                                         | 0     |
| `/og.png`  | Social share image (1200×630), generated at build time                                                                               | 3     |

The `/preview` pages of Phase 1 were removed in Phase 2.

Files the pages point to, all generated at build time from the site's own mark and fonts: `/favicon.ico` (16, 32 and 48 px), `/favicon.svg`, `/apple-touch-icon.png` (180 px), `/sitemap-index.xml` and `/sitemap-0.xml` (`/` and `/privacy`), and `/robots.txt`.

`/privacy` and `/404` use the same header as the home page; its section links point at `/#what` and so on, so the phone menu (with Request a demo and Sign in) works on every page.

Since launch every page is indexable except `/404`, and `robots.txt` allows crawling and lists the sitemap (`PRE_LAUNCH` in `src/lib/launch.ts` is `false`).

Later (not now): `/pricing`, `/security`, `/changelog`, a blog.

`www.maxoff.in` redirects permanently to `maxoff.in`, keeping path and query (a Redirect Rule in the Cloudflare dashboard). `app.maxoff.in` is the app and is not part of this project; the site links to it through the Sign in button in the header (every width, including the phone menu), a Sign in link in the footer, and "Already on MaxOff? Sign in" under the contact block.

The build emits `privacy.html`-style files (`build.format: 'file'`) and Cloudflare serves them without trailing slashes, so canonical URLs have none.

## The landing page, section by section

1. **Header.** MaxOff logo (red rounded square with a white "M", plus the wordmark), links to the sections (What it does · How it works · Roles · Trust), "Sign in" (quiet text link to https://app.maxoff.in), and the primary button **Request a demo** (red). "Sign in" is a visible outline button (not red) at every width, including the phone menu. The header's Request a demo appears only while no other primary button is on screen, so there is one red button per view. Sticky, compact, translucent on scroll. Mobile: logo, Sign in, menu; the menu holds the links, Request a demo and Sign in.
2. **Hero.** Headline "Run your studio from your phone.", the positioning line (owner, 10 Oct 2026), primary button **Request a demo**, secondary link "See how it works". Beside it (below on phones): the Owner's **Today** (needs you first, with how long each waited; today's attendance in one row; today's tasks), which plays one approval once on load: Kabir's leave turns Approved, the count goes from 3 to 2, and a six-second Undo shows and fades. Still under reduced motion.
3. **The three questions.** All three Live: _Who's in today?_ / _Did they actually see the task?_ (Task Noted) / _What's waiting on me?_ (with crew tasks waiting for the final approval).
4. **What it does (Live).** A bento grid in four groups: _Your team's day_ (Attendance, Leave, Comp leave, Expense claims, Month summary) · _The work_ (Tasks with "Noted" with the task loop, Today, My Day and a calendar with a month view, Owner-final approvals, Notifications and reminders, End-of-day report) · _Clients_ (Client projects with an October cycle, Clients) · _Set up once_ (People, Settings, Templates). Every tile says Live.
5. **One app. Three views.** Owner / Admin / Crew tabs (radio buttons, no script) swap the phone: the Owner's calendar week with who's free, an Admin's Today with their approval step and their clients' projects, Crew's My Day.
6. **A day in the studio.** Six beats on a rail: Start day → assigned and noted → a shoot → Done, then approved → End day and the end-of-day report → next morning, a client's October cycle ready.
7. **Feels like an app.** Installs from the browser; push notifications with quiet hours; native back gesture; light and dark; any modern phone; on a laptop Enter sends a chat message. Visual: a lock screen where four MaxOff notifications arrive once.
8. **Three roles.** Owner / Admin / Crew side by side: what each can do and never does; revenue is the one line still Coming. Includes **"Money stays with the owner."**
9. **Coming next.** Three dimmed cards: Work submission, Owner-only revenue and reports, Working hours, late starts and leaving early.
10. **Trust.** Invite-only; history never overwritten; every change recorded; permissions enforced by the database; nightly encrypted backups; clients never log in.
11. **How it starts.** Four steps: _Invite your team by link → They tap Start day → Assign the work. They tap Noted. → You decide._
12. **Closing and contact.** Headline "The final say is yours." and one short line, "Built by a working studio, used by its team every day." Then the contact block, headed "Tell us about your studio": one sentence asking for name, studio, team size and what to fix first; the **Request a demo** button, which opens an email to hello@maxoff.in with the subject "MaxOff demo request" and a short prefilled body; the address as text; a **Copy email** control for people with no mail app. Under it: "Already on MaxOff? Sign in". There is no form.
13. **Footer.** Logo, one-line description, the developer credit line, links (Privacy, Contact: hello@maxoff.in, Sign in), the theme toggle, © MaxOff and the year.

Every section must work at 360, 390, 430, 768, 1280 and 1440px wide, in both themes, and at 200 % text size.

## Recreated app screens (HTML/CSS, never screenshots)

- **Owner Today** (hero): needs you first, attendance in one row, today's tasks; the one-time approval moment.
- **Owner calendar**, **Admin Today**, **Crew My Day** (the role switcher).
- **Lock screen** with four notifications (Feels like an app).
- **The task loop** (Tasks tile): Assigned → Noted → Done → Approved.
- Small visuals in the bento: a month calendar, a client project's October cycle, the month bars.

Overdue and waiting are amber; red stays for the logo and the one primary button.

Demo data uses Northwind Studio and invented first names only.
