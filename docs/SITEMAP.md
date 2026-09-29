# Sitemap and page structure

## Routes

| Route      | Purpose                                                                  | Phase |
| ---------- | ------------------------------------------------------------------------ | ----- |
| `/`        | The landing page (sections below)                                        | 2     |
| `/privacy` | Privacy policy for the website and the early-access form, plain language | 3     |
| `/404`     | Not found, on brand, with a link home                                    | 0     |
| `/og.png`  | Social share image (1200×630), generated at build time                   | 3     |

Later (not now): `/pricing`, `/security`, `/changelog`, a blog.

`www.maxoff.in` redirects permanently to `maxoff.in` (Phase 6). `app.maxoff.in` is the app and is not part of this project; the site links to it through the Sign in button in the header (every width, including the phone menu), a Sign in link in the footer, and "Already on MaxOff? Sign in" under the demo form.

The build emits `privacy.html`-style files (`build.format: 'file'`) and the Worker serves them without trailing slashes, so canonical URLs have none.

## The landing page, section by section

1. **Header.** MaxOff logo (red rounded square with a white "M", plus the wordmark), links to the sections (What it does · How it works · Roles · Trust), "Sign in" (quiet text link to https://app.maxoff.in), and the primary button **Request a demo** (red). "Sign in" is a visible outline button (not red) at every width, including the phone menu. The header's Request a demo appears only while no other primary button is on screen, so there is one red button per view. Sticky, compact, translucent on scroll. Mobile: logo, Sign in, menu; the menu holds the links, Request a demo and Sign in.
2. **Hero.** Headline (3–7 words), one supporting sentence, primary button **Request a demo**, secondary text link "See how it works". On the right (below on phones): a phone frame showing a recreated **Today** screen (Start day strip, pending approvals, who's in: the Owner's Today, with a people board). A faint grid and one soft red glow behind it. A small mono label above the headline, e.g. `OPERATIONS FOR STUDIOS`.
3. **The three questions.** Three cards, each question in large type with the one-line answer beneath: _Who's in today?_ / _Did they actually see the task?_ / _What's waiting on me?_
4. **What it does (Live).** Feature cards with a **Live** badge: Attendance, Leave, Comp leave, Expense claims, Month summary, Clients, People, Settings. Each: icon, title, one sentence.
5. **Coming next.** The same card style, dimmed, with a **Coming** badge: Tasks with "Noted", Owner-final approvals, Notifications & reminders, Dashboards & calendar, Client projects, Owner-only revenue & reports. One short loop animation: a task card moving _Assigned → Noted → Done → Approved_.
6. **Feels like an app.** Installs from the browser, no app store; back gesture like a native app; light and dark; works on any modern phone. Visual: two phone frames (light and dark).
7. **Three roles.** Owner / Admin / Staff side by side: what each sees and does. Includes the line **"Money stays with the owner."**
8. **Trust.** Invite-only; history never overwritten; every change recorded; permissions enforced by the database; nightly encrypted backups; clients never log in. No certifications or numbers.
9. **How it starts.** Three steps: _Invite your team by link → They tap Start day → You decide._
10. **Closing and demo form.** Headline "The final say is yours." and one short line, "Built by a working studio, used by its team every day." Then the form, headed "Tell us about your studio": Name, Email, Studio name, Team size (1–10 / 11–25 / 26–50 / 50+), What do you want to fix first? (optional). Consent line linking to `/privacy`. Submit button **Request a demo**. Success message: "Thanks. We'll get back to you within two working days." Under the form: "Already on MaxOff? Sign in".
11. **Footer.** Logo, one-line description, the developer credit ("MaxOff is developed by Pixora Agencies."), links (Privacy, Contact: hello@maxoff.in, Sign in), the theme toggle, © MaxOff and the year.

Every section must work at 360, 390, 430, 768, 1280 and 1440px wide, in both themes, and at 200 % text size.

## Recreated app screens (HTML/CSS, never screenshots)

- **Today** (hero): Start day strip, pending approvals, who's in.
- **A task card** (Coming section): Assigned → Noted → Done → Approved.
- **An approval** (roles or trust section): the chain ending with the Owner.

Demo data uses Northwind Studio and invented first names only.
