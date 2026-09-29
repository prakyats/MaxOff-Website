/**
 * All page copy in one place so the owner can review it.
 *
 * Every claim must match docs/BRIEF.md §1 and the owner's clarifications in §3.
 * Feature labels are Live or Coming, nothing else.
 * Tone: calm, confident, precise. Short sentences. No hype words. No exclamation marks.
 * Demo company: Northwind Studio. Demo people: invented first names only.
 */

export const site = {
  name: 'MaxOff',
  url: 'https://maxoff.in',
  appUrl: 'https://app.maxoff.in',
  title: 'MaxOff: operations for small studios',
  description:
    'Attendance, leave and approvals in one app your team already has on their phone. The final say is always yours.',
} as const;

/** Section links in the header. `built` is false for sections that arrive in Phase 2. */
export const nav = [
  { label: 'What it does', href: '#what', built: true },
  { label: 'How it works', href: '#how', built: false },
  { label: 'Roles', href: '#roles', built: false },
  { label: 'Trust', href: '#trust', built: false },
] as const;

/** The two doors: a demo for studios who want to know more, Sign in for people already on MaxOff. */
export const cta = {
  demo: 'Request a demo',
  signIn: 'Sign in',
  signInHref: site.appUrl,
  seeHow: 'See how it works',
  menu: 'Menu',
} as const;

export const hero = {
  eyebrow: 'Operations for studios',
  headline: 'Run your studio from your phone.',
  supporting:
    'Attendance, leave and approvals in one app your team already has on their phone. The final say is always yours.',
} as const;

export const what = {
  eyebrow: 'Live',
  headline: 'What it does today.',
  intro: 'Everything here is live in the app now.',
  badge: 'Live',
} as const;

/** Live features only. Coming features arrive with the Coming section in Phase 2. */
export const liveFeatures = [
  {
    key: 'attendance',
    title: 'Attendance',
    text: 'Each person taps Start day and End day on their phone. You approve the day, and corrections sit beside the original.',
  },
  {
    key: 'leave',
    title: 'Leave',
    text: 'People request leave and only you decide. Holidays and weekly offs are yours to set.',
  },
  {
    key: 'comp-leave',
    title: 'Comp leave',
    text: 'Extra work is noted, and you grant half a day, a full day or nothing. Credits expire at the end of the month.',
  },
  {
    key: 'expense-claims',
    title: 'Expense claims',
    text: 'A member adds a claim, you approve or reject it, then mark it paid. Only the two of you see it.',
  },
  {
    key: 'month-summary',
    title: 'Month summary',
    text: 'Attendance, leave and comp leave for each person and for the whole team. Yours alone to see.',
  },
  {
    key: 'clients',
    title: 'Clients',
    text: 'Client records with contacts, brand details and custom fields. Admins edit the clients assigned to them.',
  },
  {
    key: 'people',
    title: 'People',
    text: 'Invite by link, set roles and job titles, and deactivate someone without losing their history.',
  },
  {
    key: 'settings',
    title: 'Settings',
    text: 'Holidays, days off, thresholds, job titles and custom fields. All editable by you, no developer needed.',
  },
] as const;

/** The closing section. The line carries no company name. */
export const closing = {
  headline: 'The final say is yours.',
  line: 'Built by a working studio, used by its team every day.',
} as const;

/**
 * Contact is email only. The address is kept in parts and assembled at build time and at runtime,
 * so it never appears as a plain string in the built site (see src/lib/contact.ts).
 */
export const contact = {
  heading: 'Tell us about your studio',
  intro: 'Email us your name, your studio, your team size and what you want to fix first.',
  cta: 'Request a demo',
  opensEmail: 'opens an email',
  noMailApp: 'No mail app? Write to us from your own email.',
  copy: 'Copy email',
  copied: 'Copied',
  copiedStatus: 'Email address copied.',
  copyFailed: 'Could not copy. Select the address and copy it yourself.',
  subject: 'MaxOff demo request',
  bodyLines: ['Name:', 'Studio name:', 'Team size:', 'What do you want to fix first?'],
  alreadyOn: 'Already on MaxOff?',
  signIn: 'Sign in',
  address: { user: 'hello', domain: 'maxoff.in' },
} as const;

export const footer = {
  description: 'Operations for small creative studios.',
  /** The developer credit. The only place the agency name appears besides the privacy page. */
  credit: 'MaxOff is developed by Pixora Agencies.',
  links: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Contact', href: null },
    { label: 'Sign in', href: site.appUrl },
  ],
  copyright: 'MaxOff',
} as const;

/** The recreated Today screen, as the Owner sees it. Demo data only. */
export const todayScreen = {
  label:
    "Illustration of the Owner's Today screen: the day started, four items waiting for approval, and who is in.",
  time: '10:24',
  zone: 'IST',
  title: 'Today',
  date: 'Tue 29 Sep',
  company: 'Northwind Studio',
  day: { label: 'Your day', status: 'Started 9:12', action: 'End day' },
  waiting: {
    heading: 'Waiting on you',
    items: [
      { who: 'Rohan', kind: 'Attendance', what: 'Mon 28 Sep' },
      { who: 'Kabir', kind: 'Leave', what: '6–7 Oct, 2 days' },
      { who: 'Isha', kind: 'Expense', what: 'Taxi to shoot, receipt attached' },
    ],
    action: 'Review',
  },
  board: {
    heading: 'Who’s in',
    people: [
      { name: 'Meera', state: 'In', since: '9:12' },
      { name: 'Aarav', state: 'In', since: '9:05' },
      { name: 'Tara', state: 'In', since: '9:31' },
      { name: 'Isha', state: 'In', since: '10:02' },
      { name: 'Kabir', state: 'On leave', since: '' },
      { name: 'Rohan', state: 'Not started', since: '' },
    ],
  },
  tabs: ['Today', 'People', 'Leave', 'Claims'],
} as const;

export const notFound = {
  eyebrow: '404',
  headline: 'Page not found',
  body: 'There is nothing at this address. The home page has everything MaxOff does today.',
  cta: 'Back to home',
} as const;
