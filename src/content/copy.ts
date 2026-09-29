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

/** Section links in the header. */
export const nav = [
  { label: 'What it does', href: '#what' },
  { label: 'How it works', href: '#how' },
  { label: 'Roles', href: '#roles' },
  { label: 'Trust', href: '#trust' },
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
  /** Facts about the product, shown as a strip under the hero. */
  specs: [
    { term: 'Roles', value: 'Owner, Admin, Staff' },
    { term: 'Times', value: 'IST' },
    { term: 'History', value: 'Never overwritten' },
    { term: 'Install', value: 'From the browser' },
  ],
} as const;

/** The three questions every studio owner asks: the spine of the page. */
export const questions = {
  eyebrow: 'Questions',
  headline: 'Three questions every studio owner asks.',
  items: [
    {
      question: 'Who’s in today?',
      answer:
        'Attendance with Start day and End day, approved by you. Your Today screen shows everyone’s day.',
      status: 'live',
    },
    {
      question: 'Did they actually see the task?',
      answer: 'Every assignee taps “Noted”, so you know the task was seen.',
      status: 'coming',
    },
    {
      question: 'What’s waiting on me?',
      answer:
        'Days to approve, leave, comp leave and expense claims wait in one place, and the final say is yours.',
      status: 'live',
    },
  ],
} as const;

export const badges = { live: 'Live', coming: 'Coming' } as const;

export const what = {
  eyebrow: 'Live',
  headline: 'What it does today.',
  intro: 'Everything here is live in the app now.',
} as const;

/** Live features. `chips` are small decorative illustrations of each card, in demo data. */
export const liveFeatures = [
  {
    key: 'attendance',
    title: 'Attendance',
    text: 'Each person taps Start day and End day on their phone. You approve the day, and corrections sit beside the original.',
    chips: ['Start day 9:12', 'End day 6:48', 'Approved by you'],
  },
  {
    key: 'leave',
    title: 'Leave',
    text: 'People request leave and only you decide. Holidays and weekly offs are yours to set.',
    chips: ['Kabir, 6–7 Oct', 'Requested', 'Approved by you'],
  },
  {
    key: 'comp-leave',
    title: 'Comp leave',
    text: 'Extra work is noted, and you grant half a day, a full day or nothing. Credits expire at the end of the month.',
    chips: ['½ day', '1 day', 'Nothing', 'Expires at month end'],
  },
  {
    key: 'expense-claims',
    title: 'Expense claims',
    text: 'A member adds a claim, you approve or reject it, then mark it paid. Only the two of you see it.',
    chips: ['Receipt attached', 'Approved', 'Paid'],
  },
  {
    key: 'month-summary',
    title: 'Month summary',
    text: 'Attendance, leave and comp leave for each person and for the whole team. Yours alone to see.',
    chips: [],
  },
  {
    key: 'clients',
    title: 'Clients',
    text: 'Client records with contacts, brand details and custom fields. Admins edit the clients assigned to them.',
    chips: ['Contacts', 'Brand details', 'Custom fields'],
  },
  {
    key: 'people',
    title: 'People',
    text: 'Invite by link, set roles and job titles, and deactivate someone without losing their history.',
    chips: ['Invite link', 'Roles', 'Job titles'],
  },
  {
    key: 'settings',
    title: 'Settings',
    text: 'Holidays, days off, thresholds, job titles and custom fields. All editable by you, no developer needed.',
    chips: ['Holidays', 'Days off', 'Thresholds'],
  },
] as const;

/** Mini bars on the Month summary card. Decorative demo data: how much of the month each person was in. */
export const monthBars = [
  { name: 'Aarav', width: 92 },
  { name: 'Meera', width: 100 },
  { name: 'Tara', width: 84 },
  { name: 'Kabir', width: 70 },
] as const;

export const coming = {
  eyebrow: 'Coming',
  headline: 'Coming next.',
  intro: 'Not live yet. This is what is on the way.',
} as const;

export const comingFeatures = [
  {
    key: 'tasks',
    title: 'Tasks with “Noted”',
    text: 'Every assignee taps “Noted”, and one primary owner marks the task Done.',
  },
  {
    key: 'approvals',
    title: 'Owner-final approvals',
    text: 'Done goes to the approving Admin, if there is one, then to you. Final completion is always yours.',
  },
  {
    key: 'notifications',
    title: 'Notifications and reminders',
    text: 'In the app, on the phone and by email for the important few. Escalations when a task is not acknowledged, and quiet hours at night.',
  },
  {
    key: 'dashboards',
    title: 'Dashboards and calendar',
    text: 'A dashboard and a calendar for each role.',
  },
  {
    key: 'projects',
    title: 'Client projects',
    text: 'Recurring client work in projects, cycles and items, kept apart from staff tasks.',
  },
  {
    key: 'revenue',
    title: 'Owner-only revenue and reports',
    text: 'Money is visible to you only, never to Admins or Staff.',
  },
] as const;

/** The task-state loop in the Coming section. Demo data. */
export const taskLoop = {
  label: 'Task',
  title: 'Cut the launch film',
  meta: 'Aarav is the primary owner, with Tara',
  steps: [
    { name: 'Assigned', note: 'To Aarav and Tara' },
    { name: 'Noted', note: 'Both tapped Noted' },
    { name: 'Done', note: 'Aarav marked it Done' },
    { name: 'Approved', note: 'You made the final call' },
  ],
  pause: 'Pause animation',
  play: 'Play animation',
} as const;

export const app = {
  eyebrow: 'On your phone',
  headline: 'Feels like an app.',
  points: [
    {
      key: 'app-install',
      title: 'Installs from the browser',
      text: 'Add it to your home screen. There is no app store.',
    },
    {
      key: 'app-back',
      title: 'Behaves like a native app',
      text: 'The back gesture does what you expect.',
    },
    {
      key: 'app-themes',
      title: 'Light and dark',
      text: 'Follows your phone, or your choice.',
    },
    {
      key: 'app-phones',
      title: 'Any modern phone',
      text: 'Works on any modern phone.',
    },
  ],
  darkLabel: 'Dark theme',
  lightLabel: 'Light theme',
} as const;

/** The second recreated screen: the Owner deciding a leave request. Demo data. */
export const approvalScreen = {
  label:
    'Illustration of a leave request as the Owner sees it: Kabir asks for two days, with Approve and Decline.',
  time: '10:31',
  zone: 'IST',
  back: 'Today',
  title: 'Leave request',
  person: 'Kabir',
  kind: 'Leave',
  dates: '6–7 Oct, 2 days',
  note: 'Family function',
  history: 'Requested by Kabir, 29 Sep 9:41',
  history2: 'Recorded next to the original',
  approve: 'Approve',
  decline: 'Decline',
  tabs: ['Today', 'People', 'Leave', 'Claims'],
} as const;

export const roles = {
  eyebrow: 'Roles',
  headline: 'Three roles. One owner.',
  intro: 'Job titles are labels. Permissions come from the role.',
  can: 'Can',
  never: 'Never',
  soon: 'Coming',
  items: [
    {
      key: 'owner',
      name: 'Owner',
      tagline: 'One per company. The final say.',
      can: [
        'Sees everyone’s day on Today.',
        'Approves the day and decides all leave and comp leave.',
        'Approves or rejects expense claims, then marks them paid.',
        'Sees the month summary for each person and for the team.',
        'Sets holidays, days off, thresholds, job titles and custom fields.',
      ],
      never: [],
      soon: ['Sees revenue and reports. Money is visible to the Owner only.'],
    },
    {
      key: 'admin',
      name: 'Admin',
      tagline: 'Runs the team day to day.',
      can: [
        'Marks their own attendance and requests leave, like Staff.',
        'Sees the team list and who is in today, but not attendance history.',
        'Edits the clients assigned to them: details, contacts, brand and custom fields.',
        'Manages lists and templates.',
      ],
      never: ['Decides attendance or leave.', 'Sees money.'],
      soon: [
        'Creates and assigns tasks.',
        'Does the Admin approval step before the Owner’s.',
        'Gets work reports for their own scope.',
      ],
    },
    {
      key: 'staff',
      name: 'Staff',
      tagline: 'Everyone else on the team.',
      can: [
        'Taps Start day and End day.',
        'Sees only their own day.',
        'Requests leave, and adds a note when they worked extra.',
        'Submits expense claims. Only they and the Owner see them.',
        'Sees their own recent attendance, comp leave credits and claims.',
      ],
      never: [],
      soon: ['Taps “Noted” on every task assigned to them.'],
    },
  ],
  money: 'Money stays with the owner.',
} as const;

export const trust = {
  eyebrow: 'Trust',
  headline: 'Built to be trusted with your team’s days.',
  items: [
    {
      key: 'trust-invite',
      title: 'Invite-only',
      text: 'People join with an invite link from you.',
    },
    {
      key: 'trust-history',
      title: 'History is never overwritten',
      text: 'Corrections and cancellations are recorded next to the original.',
    },
    {
      key: 'trust-recorded',
      title: 'Every change is recorded',
      text: 'Who did what, and when.',
    },
    {
      key: 'trust-database',
      title: 'Permissions in the database',
      text: 'The database enforces permissions, not only the screens.',
    },
    {
      key: 'trust-backups',
      title: 'Nightly encrypted backups',
      text: 'Every night, encrypted.',
    },
    {
      key: 'trust-clients',
      title: 'Clients never log in',
      text: 'Your clients have no access. Their records stay yours.',
    },
  ],
} as const;

export const how = {
  eyebrow: 'How it starts',
  headline: 'Three steps.',
  steps: [
    {
      key: 'how-invite',
      title: 'Invite your team by link',
      text: 'Send each person an invite link. They join with the role you choose.',
    },
    {
      key: 'how-start',
      title: 'They tap Start day',
      text: 'Each person starts and ends their day on their phone.',
    },
    {
      key: 'how-decide',
      title: 'You decide',
      text: 'You approve the day and decide leave, comp leave and expense claims.',
    },
  ],
} as const;

/** The closing section. The line carries no company name. */
export const closing = {
  eyebrow: 'Demo',
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
  reply: 'We usually reply within two working days.',
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

/** The recreated Today screen, as the Owner sees it. Demo data. */
export const todayScreen = {
  label:
    'Illustration of the Owner’s Today screen: the day started, three items waiting for approval, and who is in.',
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
