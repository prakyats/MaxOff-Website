#!/usr/bin/env node
/**
 * Live www check (docs/ROADMAP.md Phase 6, owner step 2).
 *
 * www.maxoff.in must answer 301 to https://maxoff.in with the same path and query, over both
 * http and https. The redirect is a Redirect Rule in the Cloudflare dashboard (a static site has no
 * code that could do it), so this checks the live site, not the build. It needs the network and is
 * not part of `pnpm check`; run it with `pnpm check:www` after changing the rule or DNS.
 */
import { pathToFileURL } from 'node:url';

export const APEX = 'https://maxoff.in';

/** The URLs probed: root, a page, a query string, and plain http. */
export const PROBES = [
  'https://www.maxoff.in/',
  'https://www.maxoff.in/privacy',
  'https://www.maxoff.in/privacy?utm_source=check&x=1',
  'http://www.maxoff.in/',
  'http://www.maxoff.in/privacy?x=1',
];

/** Where a www URL must redirect: the apex over https, same path, same query. */
export function expectedLocation(url) {
  const { pathname, search } = new URL(url);
  return `${APEX}${pathname}${search}`;
}

/** Problems with one response, as strings; empty when the redirect is right. */
export function findRedirectProblems(url, status, location) {
  const problems = [];
  const want = expectedLocation(url);
  if (status !== 301) problems.push(`${url}: status ${status}, expected 301`);
  if (location !== want)
    problems.push(`${url}: Location ${location ?? '(none)'}, expected ${want}`);
  return problems;
}

async function main() {
  const problems = [];
  for (const url of PROBES) {
    const res = await fetch(url, { redirect: 'manual' });
    const found = findRedirectProblems(url, res.status, res.headers.get('location'));
    problems.push(...found);
    console.log(
      `${found.length ? 'FAIL' : 'ok  '} ${url} -> ${res.status} ${res.headers.get('location') ?? ''}`,
    );
  }
  if (problems.length) {
    console.error(`\nwww check failed:\n  ${problems.join('\n  ')}`);
    process.exit(1);
  }
  console.log('\nwww check passed.');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
