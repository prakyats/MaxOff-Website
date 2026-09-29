# MaxOff: product brief for the website

Source of truth for every claim on the site. Copied from the original brief (`docs/BRIEF-ORIGINAL.md` §1 and §3); the competitive positioning in §3 is still to be sharpened with a competitive brief once the marketing plugin is available to a session.

## 1. What MaxOff is

MaxOff is an operations app for small creative studios and agencies (video, design, content teams of roughly 5–50 people). It replaces the WhatsApp messages, spreadsheets and memory that a studio owner uses today to know who is working, what was assigned, and what is waiting on them.

The app is a separate product at https://app.maxoff.in. This repository is only the website.

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

**Coming next (always labelled "Coming", never as live):**

- **Tasks with acknowledgement:** every assignee must tap **"Noted"**; one primary owner marks it Done.
- **Approvals that end with the Owner:** Done → approving Admin (if any) → **Owner**. Final completion is always the Owner's.
- **Notifications and reminders:** in-app, push to the phone, email for the important few; escalations when a task is not acknowledged; quiet hours at night.
- **Dashboards and calendar** for each role.
- **Client projects:** recurring client work (projects → cycles → items) kept separate from staff tasks.
- **Work submission** with original-quality files.
- **Owner-only revenue and reports:** money is visible to the Owner only, never to Admins or Staff.

**True principles the site may state:**

- Invite-only; clients never log in.
- **History is never overwritten:** corrections and cancellations are recorded next to the original.
- Every change is recorded (who did what, when).
- Permissions are enforced by the database itself, not only by the screens.
- **Money stays with the owner.**
- Nightly encrypted backups.
- Phone-first: installs from the browser like a native app (no app store), the back gesture behaves like a native app, light and dark themes.
- Built for Indian studios: business dates and times in IST.

### Clarifications from the owner (29 Sep 2026): use exactly these

- **Who's in today:** the Owner sees everyone's day (a people board on Today). Admins can see today's presence and availability, but not attendance history. Staff see only their own day. The hero phone shows the Owner's Today.
- **Admins:** they mark their own attendance and request leave like Staff, see the team list and availability, edit the clients assigned to them (details, contacts, brand, custom fields), and manage lists and templates. They never decide attendance or leave, and never see money. Coming with tasks: they create and assign tasks, do the Admin approval step before the Owner's, and get work reports for their own scope.
- **Comp leave:** never automatic. A person adds an extra-work note (for example "I worked on a day off"), and the Owner grants ½ or 1 day, or nothing. The Owner can also grant comp leave at any time. Credits expire at the end of the calendar month, and using one is a leave request the Owner approves.
- **Expense claims:** the member adds a claim (a receipt photo is required above an amount the Owner sets), the Owner approves or rejects it, then marks it paid. Expenses belong under "What's waiting on me".
- **Month summary:** Owner-only (per person and a team report). Each person sees only their own recent attendance, comp leave credits and claims.

**Never claim:** certifications (ISO, SOC 2), uptime percentages, customer counts, testimonials, logos of customers, a data-hosting country, integrations that do not exist, AI features, or prices. If a section seems to need one of these, leave it out or ask.

## 2. Audience and positioning

**Primary reader:** the owner of a small creative studio or agency in India who runs the team from their phone and is tired of chasing people on WhatsApp.

**Secondary reader:** their operations lead or senior editor (a future Admin).

**The three questions every studio owner asks (the spine of the page):**

1. _Who's in today?_ → Attendance with Start day / End day, approved by you.
2. _Did they actually see the task?_ → Every assignee taps "Noted" (Coming).
3. _What's waiting on me?_ → Approvals, leave and expenses in one place, and the final say is yours.

**Positioning line (chosen by the owner, 29 Sep 2026; "tasks" left out while tasks are Coming):** _MaxOff is the operating system for small studios: attendance, leave and approvals in one app your team already has on their phone, and the final say is always yours._

**Tone:** calm, confident, precise. Short sentences. No hype words ("revolutionary", "seamless", "supercharge", "leverage", "unlock"). No exclamation marks. Speak to the owner as "you".

**How MaxOff differs (to verify and sharpen with a competitive brief):** generic HR tools do attendance but not studio work; generic task tools do tasks but nobody is accountable for having _seen_ them; neither keeps money private to the owner or keeps an unbroken history.

## 3. Decisions from the owner (29 Sep 2026)

These supersede `docs/BRIEF-ORIGINAL.md` where they differ.

- **Hero headline:** "Run your studio from your phone." **Closing section headline:** "The final say is yours." No real company or product name in any headline.
- **Page title:** "MaxOff: operations for small studios".
- **Developer credit.** MaxOff is developed by Pixora Agencies, as an independent platform for any studio, not a tool for one company. The footer says "MaxOff is developed by Pixora Agencies." The closing section carries one short line: "Built by a working studio, used by its team every day." The exact name "Pixora Agencies" may appear only in that credit (footer, and the privacy page as the data controller). "Pixora Clips" and every other name in that family stay banned everywhere, and so do real names in demo data. MaxOff stays the brand: logo, titles, meta, OG image and headings say MaxOff, never the agency.
- **Two doors.**
  - _Studios who want to know more:_ the main call to action is **Request a demo** (red, the one primary button), leading to the form. Form heading: "Tell us about your studio". Success message: "Thanks. We'll get back to you within two working days."
  - _People already using MaxOff:_ a visible **Sign in** outline button (not red) in the header on every width, including the phone menu, linking to https://app.maxoff.in. Also a Sign in link in the footer and "Already on MaxOff? Sign in" under the demo form.
- **Footer:** "© MaxOff" (with the year), the developer credit, Privacy, Contact (hello@maxoff.in), Sign in. No founder or company name beyond the credit.
- **Theme:** dark by default, following the system preference.
- **Early-access form fields:** Name, Email, Studio name, Team size (1–10 / 11–25 / 26–50 / 50+), "What do you want to fix first?" (optional). The lead email is sent from `MaxOff Website <leads@mail.maxoff.in>` (an already-verified sending subdomain; the apex is not verified in Resend) with Reply-To set to the person's email. The public contact address stays hello@maxoff.in. The inbox that receives leads is set by the owner in Cloudflare and is never asked for.
- **Fonts:** Google Fonts, self-hosted (Geist, Geist Mono, Inter Tight). No Adobe Fonts.

## 4. Demo data

Demo company: **Northwind Studio**. Demo people: invented first names only, for example Aarav, Meera, Kabir, Isha, Rohan, Tara. No real company or person is ever named, apart from the developer credit above.
