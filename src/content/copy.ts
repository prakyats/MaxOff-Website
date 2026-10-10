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
    'Attendance, leave, tasks, client projects and approvals in one app your team already has on their phone. The final say is always yours.',
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
  /** The positioning line, approved by the owner (10 Oct 2026). */
  supporting:
    'MaxOff is the operating system for small studios: attendance, leave, tasks, client projects and approvals in one app your team already has on their phone, and the final say is always yours.',
  /** Facts about the product, shown as a strip under the hero. */
  specs: [
    { term: 'Roles', value: 'Owner, Admin, Crew' },
    { term: 'Times', value: 'IST' },
    { term: 'History', value: 'Never overwritten' },
    { term: 'Install', value: 'From the browser' },
  ],
} as const;

export const questions = {
  eyebrow: 'Questions',
  headline: 'Three questions every studio owner asks.',
  items: [
    {
      question: 'Who’s in today?',
      answer:
        'Attendance with Start day and End day, approved by you. Your Today screen shows everyone’s day in one row.',
      status: 'live',
    },
    {
      question: 'Did they actually see the task?',
      answer: 'Every assignee taps Task Noted. If they don’t, you hear about it.',
      status: 'live',
    },
    {
      question: 'What’s waiting on me?',
      answer:
        'Days to approve, leave, comp leave, expense claims and crew tasks waiting for your final approval, all in one place, with how long each has waited.',
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

/**
 * Live features, in four groups for the bento grid. `size: 'large'` tiles carry a small recreated
 * visual (the task loop, a month calendar, a client project cycle). `chips` are decorative
 * illustrations in demo data.
 */
export const liveGroups = [
  {
    key: 'team',
    label: 'Your team’s day',
    items: [
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
        chips: ['Kabir, 6–7 Oct', 'Approved by you'],
      },
      {
        key: 'comp-leave',
        title: 'Comp leave',
        text: 'Extra work is noted, and you grant half a day, a full day or nothing. Credits expire at the end of the month.',
        chips: ['½ day', '1 day', 'Nothing'],
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
    ],
  },
  {
    key: 'work',
    label: 'The work',
    items: [
      {
        key: 'tasks',
        size: 'large',
        title: 'Tasks with “Noted”',
        text: 'Every assignee taps Task Noted, and one primary owner marks it Done. A task has a type, a due date and time, a priority, optional stages and its own chat. Crew can suggest a task; you or an Admin turn it into one.',
        chips: [],
      },
      {
        key: 'dashboards',
        size: 'large',
        title: 'Today, My Day and a calendar',
        text: 'You get Today: what needs you first. Crew get My Day: only what needs them. The calendar has day, week and month views, with shoots and meetings, leave, holidays and who’s free.',
        chips: [],
      },
      {
        key: 'approvals',
        title: 'Owner-final approvals',
        text: 'Done goes to the approving Admin, if there is one, then to you. Final completion of a crew task is always yours.',
        chips: ['Done', 'Admin', 'You'],
      },
      {
        key: 'notifications',
        title: 'Notifications and reminders',
        text: 'A bell in the app, push to the phone, and email only for the important few. Reminders before a deadline, escalations when a task isn’t noted, and quiet hours at night.',
        chips: ['Bell', 'Push', 'Quiet hours'],
      },
      {
        key: 'reports',
        title: 'End-of-day report',
        text: 'A report for you at the end of every day, saved and never rewritten, and a weekly summary email on the day you pick.',
        chips: ['Every evening', 'Weekly email'],
      },
    ],
  },
  {
    key: 'clients',
    label: 'Clients',
    items: [
      {
        key: 'projects',
        size: 'large',
        title: 'Client projects',
        text: 'One-time, weekly or monthly. Each cycle starts by itself from its item list, and every item moves through its own stages. Admins run their own clients’ projects end to end, and crew never see client work.',
        chips: [],
      },
      {
        key: 'clients',
        title: 'Clients',
        text: 'Client records with contacts, brand details and custom fields. Admins edit the clients assigned to them.',
        chips: ['Contacts', 'Brand details', 'Custom fields'],
      },
    ],
  },
  {
    key: 'setup',
    label: 'Set up once',
    items: [
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
      {
        key: 'templates',
        title: 'Templates',
        text: 'Task templates, project templates and stage presets for the work you repeat.',
        chips: ['Task templates', 'Stage presets'],
      },
    ],
  },
] as const;

/** Every live feature, flat (for tests and the structured data). */
export const liveFeatures: readonly { key: string; title: string; text: string }[] =
  liveGroups.flatMap(
    (group): readonly { key: string; title: string; text: string }[] => group.items,
  );

/** The mini month in the calendar tile. Decorative demo data: October, with a few events. */
export const calendarTile = {
  month: 'October',
  /** Weekday the 1st falls on, Monday = 0 (1 Oct 2026 is a Thursday). */
  offset: 3,
  days: 31,
  today: 29,
  events: [
    { day: 6, kind: 'leave' },
    { day: 7, kind: 'leave' },
    { day: 2, kind: 'holiday' },
    { day: 9, kind: 'shoot' },
    { day: 14, kind: 'meeting' },
    { day: 16, kind: 'shoot' },
    { day: 21, kind: 'meeting' },
    { day: 23, kind: 'shoot' },
    { day: 29, kind: 'shoot' },
  ],
  legend: [
    { kind: 'shoot', label: 'Shoot' },
    { kind: 'meeting', label: 'Meeting' },
    { kind: 'leave', label: 'Leave' },
    { kind: 'holiday', label: 'Holiday' },
  ],
} as const;

/** The cycle in the client projects tile. Demo data; Saffron Café is an invented client. */
export const projectTile = {
  client: 'Saffron Café',
  cycle: 'October cycle',
  stages: ['Script', 'Shoot', 'Edit', 'Posted'],
  items: [
    { name: 'Reel 1', done: 4 },
    { name: 'Reel 2', done: 3 },
    { name: 'Reel 3', done: 2 },
    { name: 'Reel 4', done: 1 },
    { name: 'Poster 1', done: 4 },
  ],
} as const;

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
    key: 'work',
    title: 'Work submission',
    text: 'Crew members hand in their files at full quality, never re-encoded, and originals are kept.',
  },
  {
    key: 'revenue',
    title: 'Owner-only revenue and reports',
    text: 'Amounts and billing are yours only, never Admins’ or Crew’s.',
  },
  {
    key: 'hours',
    title: 'Working hours, late starts and leaving early',
    text: 'Set working hours. A late start is marked after a grace period, and leaving early needs your OK.',
  },
] as const;

/** The task-state loop in the Tasks tile. Demo data. */
export const taskLoop = {
  label: 'Task',
  title: 'Cut the launch film',
  meta: 'Aarav is the primary owner, with Tara',
  steps: [
    { name: 'Assigned', note: 'To Aarav and Tara' },
    { name: 'Noted', note: 'Both tapped Task Noted' },
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
      key: 'app-push',
      title: 'Push notifications, with quiet hours',
      text: 'Reminders reach the phone. At night they wait, and arrive as one summary in the morning.',
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
    {
      key: 'app-desk',
      title: 'At a desk too',
      text: 'On a laptop, Enter sends a chat message.',
    },
  ],
} as const;

/** The lock screen in "Feels like an app". Demo data; Saffron Café is an invented client. */
export const lockScreen = {
  label:
    'Illustration of a phone’s lock screen at 8:00 with four MaxOff notifications: the October cycle for Saffron Café is ready, a summary of updates held during quiet hours, Meera has not noted a task, and Kabir asks for leave.',
  time: '8:00',
  date: 'Thursday 1 October',
  app: 'MaxOff',
  items: [
    {
      when: 'now',
      title: 'Saffron Café: October cycle ready',
      text: 'Reel 1–4 and Poster 1 are lined up.',
    },
    { when: 'now', title: 'While you slept', text: 'Quiet hours held 3 updates. Here they are.' },
    { when: '8 h', title: 'Not noted yet', text: 'Meera hasn’t noted “Cut the launch film”.' },
    { when: '9 h', title: 'Leave request from Kabir', text: '6–7 Oct, 2 days' },
  ],
  caption: 'Owner, 8:00 in the morning',
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
        'Sees everyone’s day on Today, and what needs them first.',
        'Approves the day and decides all leave and comp leave.',
        'Approves or rejects expense claims, then marks them paid.',
        'Gives the final approval on every crew task.',
        'Gets the end-of-day report and a weekly summary email.',
        'Sees who can’t be reached by notifications.',
        'Sees the month summary for each person and for the team.',
        'Sets holidays, days off, thresholds, job titles and custom fields.',
      ],
      never: [],
      soon: ['Sees revenue and reports. Money is visible to the Owner only.'],
    },
    {
      key: 'admin',
      name: 'Admin',
      tagline: 'Runs clients and work, day to day.',
      can: [
        'Creates and assigns tasks.',
        'Does the Admin approval step before the Owner’s.',
        'Runs client projects for their own clients, end to end.',
        'Has their own Today and a work report.',
        'Sees the team list and who is in today, but not attendance history.',
        'Sees others’ work on the calendar only as Busy.',
        'Edits the clients assigned to them, and manages lists and templates.',
        'Marks their own attendance and requests leave, like Crew.',
      ],
      never: ['Decides attendance or leave.', 'Sees money.'],
      soon: [],
    },
    {
      key: 'crew',
      name: 'Crew',
      tagline: 'The people doing the work.',
      can: [
        'Taps Start day and End day.',
        'Taps Task Noted on every task assigned to them.',
        'Has My Day: only what needs them today, then the week ahead.',
        'Sees only their own day and their own calendar.',
        'Suggests tasks.',
        'Requests leave, and adds a note when they worked extra.',
        'Submits expense claims. Only they and the Owner see them.',
      ],
      never: ['Sees client work.', 'Sees money.'],
      soon: [],
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
      text: 'Encrypted every night and kept for a month.',
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
  headline: 'Four steps.',
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
      key: 'how-assign',
      title: 'Assign the work. They tap Noted.',
      text: 'You or an Admin assign a task. Every assignee taps Task Noted, so you know it was seen.',
    },
    {
      key: 'how-decide',
      title: 'You decide',
      text: 'You approve the day, decide leave, comp leave and expense claims, and give the final approval on crew tasks.',
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

/** Crew's My Day: only what needs them today, then the week ahead. Demo data. */
export const myDayScreen = {
  label:
    'Illustration of a crew member’s My Day screen: a task to note, a task due today, an overdue task, and today’s shoot.',
  time: '10:24',
  zone: 'IST',
  title: 'My Day',
  date: 'Tue 29 Sep',
  company: 'Northwind Studio',
  day: { label: 'Your day', status: 'Started 9:05' },
  sections: [
    {
      heading: 'Not noted',
      rows: [
        {
          title: 'Sound mix, launch film',
          sub: 'From Isha, due Thu',
          action: 'Task Noted',
          tone: 'action',
        },
      ],
    },
    {
      heading: 'Due today',
      rows: [
        { title: 'Cut the launch film', sub: 'Primary owner, due 6:00 PM', action: '', tone: '' },
      ],
    },
    {
      heading: 'Overdue',
      rows: [{ title: 'Colour pass, teaser', sub: 'Due yesterday', action: '', tone: 'warn' }],
    },
    {
      heading: 'Today and tomorrow',
      rows: [
        { title: 'Shoot, 2:00 PM', sub: 'Studio floor, with Tara', action: '', tone: '' },
        { title: 'Meeting, tomorrow 11:00 AM', sub: 'Launch film review', action: '', tone: '' },
      ],
    },
  ],
  tabs: ['My Day', 'Tasks', 'Calendar', 'Me'],
} as const;

/** The Admin's own Today: their approval step, their clients' projects and the team's day. Demo data. */
export const adminTodayScreen = {
  label:
    'Illustration of an Admin’s Today screen: a done task waiting for the Admin approval step, two client project items due, and who is in today.',
  time: '10:24',
  zone: 'IST',
  title: 'Today',
  date: 'Tue 29 Sep',
  company: 'Northwind Studio',
  needs: {
    heading: 'Needs you',
    rows: [
      {
        who: 'A',
        title: 'Cut the launch film',
        sub: 'Done by Aarav. Your approval, then the Owner’s',
        action: 'Approve',
      },
      {
        who: 'S',
        title: 'Saffron Café, October',
        sub: 'Reel 3 and Reel 4 due today',
        action: 'Open',
      },
    ],
  },
  team: { heading: 'Team today', text: 'In 4 · On leave 1 · Not started 1' },
  report: {
    heading: 'Work report, this week',
    stats: [
      { value: '9', label: 'Done' },
      { value: '3', label: 'Due' },
      { value: '1', label: 'Overdue' },
    ],
  },
  tabs: ['Today', 'Tasks', 'Clients', 'Calendar'],
} as const;

/** The Owner's week on the calendar, with who's free. Demo data. */
export const calendarScreen = {
  label:
    'Illustration of the Owner’s calendar for the week: a shoot, a meeting, Kabir on leave, a holiday, and who is free on Wednesday.',
  time: '10:24',
  zone: 'IST',
  title: 'Calendar',
  views: ['Day', 'Week', 'Month'],
  view: 1,
  days: [
    { day: 'Tue 29', items: [{ kind: 'shoot', text: 'Shoot, Saffron Café · Aarav, Tara' }] },
    { day: 'Wed 30', items: [{ kind: 'meeting', text: 'Meeting, launch film review · Isha' }] },
    { day: 'Thu 1', items: [{ kind: 'shoot', text: 'Site visit · Meera' }] },
    { day: 'Fri 2', items: [{ kind: 'holiday', text: 'Holiday' }] },
    { day: 'Tue 6', items: [{ kind: 'leave', text: 'Kabir on leave, 2 days' }] },
  ],
  free: { heading: 'Who’s free, Wed 30', names: 'Meera, Rohan, Tara' },
  tabs: ['Today', 'Tasks', 'Calendar', 'People'],
} as const;

/** A day in the studio: one ordinary day at Northwind Studio, beat by beat. Demo data. */
export const day = {
  eyebrow: 'A day',
  headline: 'A day in the studio.',
  intro: 'One ordinary Wednesday at Northwind Studio.',
  beats: [
    {
      time: '09:05',
      title: 'Start day',
      text: 'Aarav taps Start day. You see who’s in, in one row.',
    },
    {
      time: '10:10',
      title: 'Assigned, and noted',
      text: 'Isha assigns “Cut the launch film”. Aarav and Tara tap Task Noted.',
    },
    {
      time: '13:40',
      title: 'A shoot',
      text: 'The Saffron Café shoot is on the calendar, with who’s free that day.',
    },
    {
      time: '17:20',
      title: 'Done, then approved',
      text: 'Aarav marks the task Done. Isha approves it, and the final say is yours.',
    },
    {
      time: '18:30',
      title: 'End day',
      text: 'Everyone taps End day. Your end-of-day report is saved.',
    },
    {
      time: '08:00',
      title: 'Next morning',
      text: 'Saffron Café’s October cycle is ready, with its items lined up.',
    },
  ],
} as const;

/** The role switcher: one app, three views. */
export const views = {
  eyebrow: 'Views',
  headline: 'One app. Three views.',
  intro: 'Each role sees what it needs, and nothing it shouldn’t.',
  legend: 'Choose a role',
  tabs: [
    {
      key: 'owner',
      label: 'Owner',
      caption: 'The Owner’s calendar: the week, leave, holidays and who’s free.',
    },
    {
      key: 'admin',
      label: 'Admin',
      caption: 'An Admin’s Today: their approval step, their clients’ projects, the team’s day.',
    },
    { key: 'crew', label: 'Crew', caption: 'A crew member’s My Day: only what needs them today.' },
  ],
} as const;

/**
 * The Owner's Today, in the hero. It plays one moment once: Kabir's leave is approved, a
 * six-second Undo appears and fades, and the "Needs you" count goes from 3 to 2. Demo data.
 */
export const todayScreen = {
  label:
    'Illustration of the Owner’s Today screen: three items need you, with how long each has waited; Kabir’s leave is approved, with Undo; today’s attendance in one row and today’s tasks.',
  time: '10:24',
  zone: 'IST',
  title: 'Today',
  date: 'Tue 29 Sep',
  company: 'Northwind Studio',
  needs: {
    heading: 'Needs you first',
    before: '3',
    after: '2',
    rows: [
      {
        who: 'K',
        title: 'Kabir: Leave',
        sub: '6–7 Oct, 2 days · waited 2 h',
        action: 'Approve',
        done: 'Approved',
      },
      {
        who: 'R',
        title: 'Rohan: Attendance',
        sub: 'Mon 28 Sep · waited 1 day',
        action: 'Review',
        done: '',
      },
      {
        who: 'A',
        title: 'Cut the launch film',
        sub: 'Final approval · waited 40 min',
        action: 'Review',
        done: '',
      },
    ],
  },
  attendance: { heading: 'Today', text: 'In 4 · On leave 1 · Not started 1' },
  tasks: {
    heading: 'Today’s tasks',
    rows: [
      { title: 'Cut the launch film', sub: 'Due 6:00 PM', tone: '' },
      { title: 'Colour pass, teaser', sub: 'Overdue by a day', tone: 'warn' },
    ],
  },
  toast: { text: 'Leave approved', undo: 'Undo' },
  tabs: ['Today', 'Tasks', 'Calendar', 'People'],
} as const;

/**
 * The privacy page: short and plain. No form data (there is no form), cookie-less analytics only,
 * emails answered by the developer. The agency name may appear here (the data controller).
 */
export const privacy = {
  title: 'Privacy: MaxOff',
  description:
    'What the MaxOff website collects: no form data, cookie-less analytics, and emails answered by the developer.',
  headline: 'Privacy',
  intro: 'This site collects very little.',
  items: [
    {
      heading: 'No form data',
      paragraphs: ['There is no form on this site, so none is collected.'],
    },
    {
      heading: 'Analytics',
      paragraphs: [
        'We count visits with cookie-less analytics. No cookies are set.',
        'Like any website, our host processes technical data such as IP addresses to deliver these pages; it is not used to track you.',
      ],
    },
    {
      heading: 'Your theme choice',
      paragraphs: [
        'If you switch between light and dark, that choice is saved only in your own browser and never sent anywhere.',
      ],
    },
  ],
  email: {
    heading: 'Email',
    /** The address sits between these two, written as entities (see src/lib/contact.ts). */
    before: 'Emails to ',
    after:
      ' are answered by Pixora Agencies, the developer of MaxOff and the data controller for those emails.',
  },
} as const;

export const notFound = {
  eyebrow: '404',
  headline: 'Page not found',
  body: 'There is nothing at this address. The home page has everything MaxOff does today.',
  cta: 'Back to home',
} as const;
