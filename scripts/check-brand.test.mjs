import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  BANNED_EXAMPLE,
  CREDIT,
  STEM,
  findCommitViolations,
  findViolations,
} from './check-brand.mjs';

const page = (head, body) => `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;
const clean = (file, text) => assert.deepEqual(findViolations(file, text), []);
const dirty = (file, text, needle) => {
  const problems = findViolations(file, text);
  assert.ok(problems.length > 0, `expected a violation in ${file}`);
  if (needle) assert.match(problems.join('\n'), needle);
};

test('the exact credit is allowed in the copy file and the privacy page', () => {
  clean('src/content/copy.ts', `export const credit = 'MaxOff is developed by ${CREDIT}.';`);
  clean('src/pages/privacy.astro', `<p>The data controller is ${CREDIT}.</p>`);
});

test('the exact credit is allowed in the docs that state the rule', () => {
  clean('CLAUDE.md', `The name "${CREDIT}" may appear only in the credit.`);
  clean('docs/BRIEF.md', `Developed by ${CREDIT}.`);
});

test('the rule docs may cite the banned example, and no other file may', () => {
  clean('CLAUDE.md', `"${BANNED_EXAMPLE}" stays banned everywhere.`);
  clean('docs/BRIEF.md', `"${BANNED_EXAMPLE}" stays banned everywhere.`);
  dirty('docs/PROGRESS.md', `${BANNED_EXAMPLE}`, /banned family/);
  dirty('src/content/copy.ts', `${BANNED_EXAMPLE}`, /banned family/);
  dirty('CLAUDE.md', `${STEM} Studios`, /banned family/);
});

test('the original brief is exempt', () => {
  clean('docs/BRIEF-ORIGINAL.md', `Never write ${STEM} Clips.`);
});

test('the exact credit is rejected in any other file', () => {
  dirty('src/components/SiteFooter.astro', `<p>${CREDIT}</p>`, /outside the credit files/);
  dirty('docs/PROGRESS.md', `${CREDIT}`, /outside the credit files/);
  dirty('src/styles/global.css', `/* ${CREDIT} */`, /outside the credit files/);
});

test('every other name in the banned family is rejected, even in the credit files', () => {
  dirty('src/content/copy.ts', `${STEM} Clips`, /banned family/);
  dirty('src/content/copy.ts', `${STEM} Agency`, /banned family/);
  dirty('src/content/copy.ts', `${STEM}`, /banned family/);
  dirty('src/content/copy.ts', `${CREDIT.toLowerCase()}`, /banned family/);
  dirty('src/content/copy.ts', `${CREDIT.toUpperCase()}`, /banned family/);
  dirty('src/content/copy.ts', `x${CREDIT}`, /banned family/);
});

test('a built page may carry the credit in plain body text only', () => {
  clean(
    'dist/index.html',
    page('<title>MaxOff</title>', `<footer><p>MaxOff is developed by ${CREDIT}.</p></footer>`),
  );
  clean('dist/preview/glass.html', page('', `<footer><span>${CREDIT}</span></footer>`));
});

test('a built page must not carry the credit in the head, headings, attributes or scripts', () => {
  const body = '<main><h1>MaxOff</h1></main>';
  dirty('dist/index.html', page(`<title>${CREDIT}</title>`, body), /outside plain body text/);
  dirty(
    'dist/index.html',
    page(`<meta name="description" content="By ${CREDIT}">`, body),
    /outside plain body text/,
  );
  dirty('dist/index.html', page('', `<h2>${CREDIT}</h2>`), /outside plain body text/);
  dirty(
    'dist/index.html',
    page('', `<img src="/x.png" alt="${CREDIT}">`),
    /outside plain body text/,
  );
  dirty(
    'dist/index.html',
    page('', `<a href="/" aria-label="${CREDIT}">x</a>`),
    /outside plain body text/,
  );
  dirty(
    'dist/index.html',
    page('', `<script type="application/ld+json">{"author":"${CREDIT}"}</script>`),
    /outside plain body text/,
  );
  dirty('dist/index.html', page('', `<!-- ${CREDIT} -->`), /outside plain body text/);
});

test('built assets other than HTML may not carry the credit', () => {
  dirty('dist/_astro/app.js', `"${CREDIT}"`, /outside the credit files/);
  dirty('dist/sitemap-0.xml', `<loc>${CREDIT}</loc>`, /outside the credit files/);
});

test('commit messages may not carry the name at all, not even the credit', () => {
  assert.deepEqual(findCommitViolations('Add footer\n\nBody text'), []);
  assert.equal(findCommitViolations(`Add the ${CREDIT} credit`).length, 1);
  assert.equal(findCommitViolations(`Remove ${STEM} Clips`).length, 1);
});
