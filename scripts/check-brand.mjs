#!/usr/bin/env node
/**
 * Brand check (CLAUDE.md rule 1): the only brand is MaxOff.
 *
 * One name is permitted, and only in the developer credit: the developer's current name, spelled
 * exactly, in the two credit files (and the two docs that state the rule). Everything else fails:
 * any other spelling of it, the name in any other file, in a <head>, a heading, an attribute or a
 * script, and in commit messages. The former developer name and its whole family are banned
 * everywhere, the credit files and the rule docs included.
 *
 * Both names are stored as joined fragments so this script never trips itself.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

/** The developer's name: the one permitted string, matched exactly (lower case, no space). */
export const CREDIT = ['3not8', 'studios'].join('');
/** Any spelling of the developer's name: spaces, dashes, capitals, a missing "s". */
export const CREDIT_FAMILY = new RegExp(
  ['3', '\\s*not', '[\\s_-]*8', '[\\s_-]*studios?'].join(''),
  'gi',
);
/** The former developer name's stem, banned everywhere in every form, case-insensitive. */
export const FORMER = ['Pix', 'ora'].join('');

/** Source files where the credit may appear (copy lives in copy.ts; the privacy page names the controller). */
export const CREDIT_SOURCES = new Set(['src/content/copy.ts', 'src/pages/privacy.astro']);
/** Docs that state the rule, so they must be able to name the credit. */
export const RULE_DOCS = new Set(['CLAUDE.md', 'docs/BRIEF.md']);
/** The original brief is kept verbatim, from before both names. */
export const EXEMPT = new Set(['docs/BRIEF-ORIGINAL.md']);

const BINARY = /\.(woff2?|ttf|otf|png|jpe?g|gif|webp|avif|ico|pdf|zip|gz|br|mp4|webm|wasm)$/i;
const formerPattern = new RegExp(FORMER, 'gi');

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

/** Is the match exactly the credit name, with no letter or digit glued to either side? */
function isExactCredit(text, index, length) {
  return (
    length === CREDIT.length &&
    text.startsWith(CREDIT, index) &&
    !/[A-Za-z0-9]/.test(text[index - 1] ?? '') &&
    !/[A-Za-z0-9]/.test(text[index + length] ?? '')
  );
}

/**
 * Indexes of plain body text in built HTML. Anything in <head>, in a heading, in a script or style,
 * in a comment or inside a tag (attributes such as alt, content, aria-label) is not plain body text.
 */
function bodyTextRanges(html) {
  const ranges = [];
  const token = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>|[^<]+|</g;
  let inBody = false;
  let raw = false;
  let heading = 0;
  for (const m of html.matchAll(token)) {
    const [whole, closing, name] = m;
    if (name) {
      const tag = name.toLowerCase();
      if (tag === 'body' && !closing) inBody = true;
      if (tag === 'script' || tag === 'style') raw = !closing;
      if (/^h[1-6]$/.test(tag)) heading = Math.max(0, heading + (closing ? -1 : 1));
    } else if (inBody && !raw && heading === 0 && !whole.startsWith('<')) {
      ranges.push([m.index, m.index + whole.length]);
    }
  }
  return ranges;
}

/** Violations in one file's text. `file` is a repo-relative path with forward slashes. */
export function findViolations(file, text) {
  if (EXEMPT.has(file)) return [];
  const problems = [];
  for (const match of text.matchAll(formerPattern)) {
    problems.push(
      `${file}:${lineOf(text, match.index)}: the former developer name (banned everywhere)`,
    );
  }
  const isBuiltHtml = /^dist\/(.+\/)?[^/]+\.html$/.test(file);
  const bodyRanges = isBuiltHtml ? bodyTextRanges(text) : [];
  for (const match of text.matchAll(CREDIT_FAMILY)) {
    const at = `${file}:${lineOf(text, match.index)}`;
    if (!isExactCredit(text, match.index, match[0].length)) {
      problems.push(`${at}: the developer's name spelled other than exactly "${CREDIT}"`);
    } else if (isBuiltHtml) {
      const inBodyText = bodyRanges.some(([a, b]) => match.index >= a && match.index < b);
      if (!inBodyText)
        problems.push(
          `${at}: the credit outside plain body text (head, heading, attribute or script)`,
        );
    } else if (!CREDIT_SOURCES.has(file) && !RULE_DOCS.has(file)) {
      problems.push(`${at}: the credit outside the credit files`);
    }
  }
  return problems;
}

/** Violations in a commit message: neither name may appear at all, not even the credit. */
export function findCommitViolations(message) {
  const named =
    new RegExp(FORMER, 'i').test(message) || new RegExp(CREDIT_FAMILY.source, 'i').test(message);
  return named ? [`commit message: ${message.trim().split('\n')[0].slice(0, 80)}`] : [];
}

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
  const tracked = git(['ls-files', '-z', '--cached', '--others', '--exclude-standard'])
    .split('\0')
    .filter(Boolean);
  const built = existsSync('dist') ? walk('dist') : [];
  const files = [...new Set([...tracked, ...built])].filter(
    (f) => !EXEMPT.has(f) && !BINARY.test(f) && existsSync(f) && statSync(f).isFile(),
  );

  const problems = [];
  for (const file of files) {
    const buffer = readFileSync(file);
    if (buffer.subarray(0, 8000).includes(0)) continue; // binary content
    problems.push(...findViolations(file, buffer.toString('utf8')));
  }

  try {
    const log = git(['log', '--format=%B%x00', 'origin/main..HEAD']);
    for (const message of log.split('\0').filter((m) => m.trim()))
      problems.push(...findCommitViolations(message));
  } catch {
    /* origin/main not available (shallow clone): file scan only */
  }

  if (problems.length) {
    console.error(
      'check-brand: MaxOff is the only brand. The one permitted name is the exact developer credit, in the credit files; the former developer name is banned everywhere.',
    );
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
  }
  console.log(`check-brand: clean (${files.length} files scanned)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
