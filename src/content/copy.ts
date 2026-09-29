/**
 * All page copy in one place so the owner can review it.
 * Every claim must match docs/BRIEF.md §1. Feature labels are Live or Coming, nothing else.
 * Tone: calm, confident, precise. Short sentences. No hype words. No exclamation marks.
 */

export const site = {
  name: 'MaxOff',
  url: 'https://maxoff.in',
  appUrl: 'https://app.maxoff.in',
  contactEmail: 'hello@maxoff.in',
  title: 'MaxOff: operations for small studios',
  description:
    'Attendance, leave and approvals in one app your team already has on their phone. The final say is always yours.',
} as const;

/** Phase 0 placeholder. Replaced in Phase 2 and 3 once the owner has chosen a headline. */
export const placeholder = {
  eyebrow: 'Operations for studios',
  headline: 'Run your studio from your phone.',
  supporting:
    'Who is in today, what was assigned, and what is waiting on you. Attendance, leave and approvals in one place, and the final say is always yours.',
  primaryCta: 'Request early access',
  footerLine: 'Operations for small creative studios.',
} as const;

export const notFound = {
  eyebrow: '404',
  headline: 'Page not found',
  body: 'There is nothing at this address. The home page has everything MaxOff does today.',
  cta: 'Back to home',
} as const;
