#!/usr/bin/env node
/**
 * Brand check (CLAUDE.md rule 1): the only brand is MaxOff.
 *
 * Fails when a banned former-brand name appears, case-insensitive, in any tracked or
 * untracked-but-not-ignored file, in the build output, or in a commit message on this
 * branch that is not yet on main. The original brief is exempt because it states the rule.
 * The banned term is stored as joined fragments so this script never trips itself.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BANNED = [['pix', 'ora']].map((parts) => parts.join(''));
const EXEMPT = new Set(['docs/BRIEF-ORIGINAL.md']);
const BINARY = /\.(woff2?|ttf|otf|png|jpe?g|gif|webp|avif|ico|pdf|zip|gz|br|mp4|webm|wasm)$/i;

const pattern = new RegExp(BANNED.join('|'), 'i');

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

const tracked = git(['ls-files', '-z', '--cached', '--others', '--exclude-standard'])
  .split('\0')
  .filter(Boolean);
const built = existsSync('dist') ? walk('dist') : [];

const files = [...new Set([...tracked, ...built])].filter(
  (f) => !EXEMPT.has(f) && !BINARY.test(f) && existsSync(f) && statSync(f).isFile(),
);

const hits = [];
for (const file of files) {
  const buffer = readFileSync(file);
  if (buffer.subarray(0, 8000).includes(0)) continue; // binary content
  const text = buffer.toString('utf8');
  if (!pattern.test(text)) continue;
  text.split('\n').forEach((line, i) => {
    if (pattern.test(line)) hits.push(`${file}:${i + 1}`);
  });
}

try {
  const log = git(['log', '--format=%h %B', 'origin/main..HEAD']);
  for (const line of log.split('\n')) {
    if (pattern.test(line)) hits.push(`commit message: ${line.trim().slice(0, 80)}`);
  }
} catch {
  /* origin/main not available (shallow clone): file scan only */
}

if (hits.length) {
  console.error('check-brand: a banned brand name was found. The only brand is MaxOff.');
  for (const hit of hits) console.error(`  ${hit}`);
  process.exit(1);
}
console.log(`check-brand: clean (${files.length} files scanned)`);
