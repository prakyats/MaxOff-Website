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

**Never claim:** certifications (ISO, SOC 2), uptime percentages, customer counts, testimonials, logos of customers, a data-hosting country, integrations that do not exist, AI features, or prices. If a section seems to need one of these, leave it out or ask.

## 2. Audience and positioning

**Primary reader:** the owner of a small creative studio or agency in India who runs the team from their phone and is tired of chasing people on WhatsApp.

**Secondary reader:** their operations lead or senior editor (a future Admin).

**The three questions every studio owner asks (the spine of the page):**

1. _Who's in today?_ → Attendance with Start day / End day, approved by you.
2. _Did they actually see the task?_ → Every assignee taps "Noted" (Coming).
3. _What's waiting on me?_ → Approvals, leave and expenses in one place, and the final say is yours.

**Positioning line (starting point, to be refined with the owner):** _MaxOff is the operating system for small studios: attendance, leave, tasks and approvals in one app your team already has on their phone, and the final say is always yours._

**Tone:** calm, confident, precise. Short sentences. No hype words ("revolutionary", "seamless", "supercharge", "leverage", "unlock"). No exclamation marks. Speak to the owner as "you".

**How MaxOff differs (to verify and sharpen with a competitive brief):** generic HR tools do attendance but not studio work; generic task tools do tasks but nobody is accountable for having _seen_ them; neither keeps money private to the owner or keeps an unbroken history.

## 3. Demo data

Demo company: **Northwind Studio**. Demo people: invented first names only, for example Aarav, Meera, Kabir, Isha, Rohan, Tara. No real company or person is ever named.
