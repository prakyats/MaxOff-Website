#!/usr/bin/env node
/**
 * Static-site check (CLAUDE.md rule 3 and "Contact by email").
 *
 * The site is fully static and contact is email only. This fails when:
 *   1. the built site contains any email address or a plain mailto: link (simple scrapers match
 *      raw HTML; the address must be written as entities or assembled at runtime);
 *   2. the repo contains an email address other than the one contact address;
 *   3. the repo mentions a form backend, a mail API or a bot-check service, or an /api route;
 *   4. wrangler.jsonc configures a Worker, a binding, a variable or a route to a Worker;
 *   5. a worker/ directory exists.
 *
 * The contact address and the banned words are stored as fragments so this script never trips
 * itself.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

/** The one address allowed anywhere in the repo. */
export const CONTACT = ['hello', '@', 'maxoff', '.in'].join('');

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
const MAILTO = /mailto:/i;

/** Words that mean a backend or a third-party service crept back in. */
const BANNED_WORDS = [
  { name: 'a bot-check service', pattern: new RegExp(['turn', 'stile'].join(''), 'i') },
  { name: 'a mail API', pattern: new RegExp(`\\b${['Re', 'send'].join('')}\\b`) },
  { name: 'a leads variable', pattern: new RegExp(`${['LEADS', '_'].join('')}(?:TO|FROM)`) },
  { name: 'an API route', pattern: new RegExp(`/${['a', 'pi'].join('')}/`) },
  {
    name: 'Worker types',
    pattern: new RegExp(['workers', '-types'].join('-').replace('-', ''), 'i'),
  },
];

/** Files that may say anything: the original brief states the old plan verbatim. */
export const EXEMPT = new Set(['docs/BRIEF-ORIGINAL.md', 'pnpm-lock.yaml']);
/** This script and its tests spell out the banned words to check them. */
const SELF = new Set(['scripts/check-static.mjs', 'scripts/check-static.test.mjs']);

/** wrangler.jsonc keys that mean code or bindings, which a static site never has. */
const WRANGLER_BANNED = [
  'main',
  'vars',
  'binding',
  'run_worker_first',
  'services',
  'kv_namespaces',
  'd1_databases',
  'r2_buckets',
  'durable_objects',
  'queues',
  'ai',
  'browser',
  'triggers',
];

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

/** Email problems in the built site: no address and no plain mailto: anywhere. */
export function findBuiltProblems(file, text) {
  const problems = [];
  for (const match of text.matchAll(EMAIL)) {
    problems.push(
      `${file}:${lineOf(text, match.index)}: the built site contains an email address as plain text`,
    );
  }
  const mailto = MAILTO.exec(text);
  if (mailto)
    problems.push(
      `${file}:${lineOf(text, mailto.index)}: the built site contains a plain mailto: link`,
    );
  return problems;
}

/** Problems in one repo file: other addresses and banned words. */
export function findRepoProblems(file, text) {
  if (EXEMPT.has(file)) return [];
  const problems = [];
  for (const match of text.matchAll(EMAIL)) {
    if (match[0].toLowerCase() !== CONTACT) {
      problems.push(
        `${file}:${lineOf(text, match.index)}: an email address other than the contact address`,
      );
    }
  }
  if (!SELF.has(file)) {
    for (const { name, pattern } of BANNED_WORDS) {
      const found = pattern.exec(text);
      if (found)
        problems.push(
          `${file}:${lineOf(text, found.index)}: mentions ${name}; the site is fully static`,
        );
    }
  }
  return problems;
}

/** Problems in wrangler.jsonc: static assets only. */
export function findWranglerProblems(text) {
  const code = text.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const problems = [];
  for (const key of WRANGLER_BANNED) {
    if (new RegExp(`"${key}"\\s*:`).test(code)) {
      problems.push(
        `wrangler.jsonc: "${key}" configures code or a binding; the site is fully static`,
      );
    }
  }
  return problems;
}

const TEXT_BUILT = /\.(html|js|mjs|css|xml|txt|json|svg|webmanifest|map)$/i;
const BINARY = /\.(woff2?|ttf|otf|png|jpe?g|gif|webp|avif|ico|pdf|zip|gz|br|mp4|webm|wasm)$/i;

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path.split('\\').join('/'));
  }
  return out;
}

function main() {
  const problems = [];

  if (existsSync('worker'))
    problems.push('worker/: a Worker directory exists; the site is fully static');
  if (existsSync('wrangler.jsonc'))
    problems.push(...findWranglerProblems(readFileSync('wrangler.jsonc', 'utf8')));

  const tracked = git(['ls-files', '-z', '--cached', '--others', '--exclude-standard'])
    .split('\0')
    .filter(Boolean)
    .filter((f) => !BINARY.test(f) && existsSync(f) && statSync(f).isFile());
  for (const file of tracked) {
    const buffer = readFileSync(file);
    if (buffer.subarray(0, 8000).includes(0)) continue;
    problems.push(...findRepoProblems(file, buffer.toString('utf8')));
  }

  const built = existsSync('dist') ? walk('dist').filter((f) => TEXT_BUILT.test(f)) : [];
  for (const file of built) problems.push(...findBuiltProblems(file, readFileSync(file, 'utf8')));

  if (problems.length) {
    console.error('check-static: the site must be fully static, with email as the only contact.');
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
  }
  console.log(`check-static: clean (${tracked.length} repo files, ${built.length} built files)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
