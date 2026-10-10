import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CREDIT, FORMER, findCommitViolations, findViolations } from './check-brand.mjs';

const page = (head, body) => `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;
const clean = (file, text) => assert.deepEqual(findViolations(file, text), []);
const dirty = (file, text, needle) => {
  const problems = findViolations(file, text);
  assert.ok(problems.length > 0, `expected a violation in ${file}`);
  if (needle) assert.match(problems.join('\n'), needle);
};
/** The former credit, rebuilt from parts for the tests. */
const FORMER_CREDIT = `${FORMER} ${['Agen', 'cies'].join('')}`;

test('the exact credit is allowed in the copy file and the privacy page', () => {
  clean('src/content/copy.ts', `export const credit = 'MaxOff is developed by ${CREDIT}.';`);
  clean('src/pages/privacy.astro', `<p>The data controller is ${CREDIT}.</p>`);
});

test('the exact credit is allowed in the docs that state the rule', () => {
  clean('CLAUDE.md', `The name "${CREDIT}" may appear only in the credit.`);
  clean('docs/BRIEF.md', `Developed by ${CREDIT}.`);
});

test('the exact credit is rejected in any other file', () => {
  dirty('src/components/SiteFooter.astro', `<p>${CREDIT}</p>`, /outside the credit files/);
  dirty('docs/PROGRESS.md', `${CREDIT}`, /outside the credit files/);
  dirty('src/styles/global.css', `/* ${CREDIT} */`, /outside the credit files/);
});

test('any other spelling of the developer name is rejected, even in the credit files', () => {
  for (const spelling of [
    // Built from CREDIT at runtime, so this file never spells a variant out.
    CREDIT.toUpperCase(),
    CREDIT.replace('not', 'Not').replace('studios', 'Studios'),
    CREDIT.replace('8', '8 '),
    CREDIT.replace('3', '3 ').replace('not', 'not ').replace('8', '8 '),
    CREDIT.replace('8', '8-'),
    CREDIT.slice(0, -1),
    `${CREDIT}x`,
    `x${CREDIT}`,
  ]) {
    dirty('src/content/copy.ts', `by ${spelling}.`, /spelled other than exactly/);
  }
});

test('the former developer name is banned everywhere, credit files and rule docs included', () => {
  for (const file of [
    'src/content/copy.ts',
    'src/pages/privacy.astro',
    'CLAUDE.md',
    'docs/BRIEF.md',
    'docs/PROGRESS.md',
  ]) {
    dirty(file, `MaxOff is developed by ${FORMER_CREDIT}.`, /former developer name/);
    dirty(file, `${FORMER} Clips`, /former developer name/);
    dirty(file, FORMER.toLowerCase(), /former developer name/);
  }
  dirty(
    'dist/index.html',
    page('', `<footer><p>${FORMER_CREDIT}</p></footer>`),
    /former developer name/,
  );
});

test('the original brief is exempt', () => {
  clean('docs/BRIEF-ORIGINAL.md', `Never write ${FORMER} Clips.`);
});

test('a built page may carry the credit in plain body text only', () => {
  clean(
    'dist/index.html',
    page('<title>MaxOff</title>', `<footer><p>MaxOff is developed by ${CREDIT}.</p></footer>`),
  );
  clean('dist/privacy.html', page('', `<footer><span>${CREDIT}</span></footer>`));
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
    page('', `<script type="application/ld+json">{"author":"${CREDIT}"}</script>`),
    /outside plain body text/,
  );
  dirty('dist/index.html', page('', `<!-- ${CREDIT} -->`), /outside plain body text/);
});

test('built assets other than HTML may not carry the credit', () => {
  dirty('dist/_astro/app.js', `"${CREDIT}"`, /outside the credit files/);
  dirty('dist/sitemap-0.xml', `<loc>${CREDIT}</loc>`, /outside the credit files/);
});

test('commit messages may carry neither name, not even the credit', () => {
  assert.deepEqual(findCommitViolations('Add footer\n\nBody text'), []);
  assert.equal(findCommitViolations(`Add the ${CREDIT} credit`).length, 1);
  assert.equal(
    findCommitViolations(`Credit ${CREDIT.replace('8', '8 ').replace('s', 'S')}`).length,
    1,
  );
  assert.equal(findCommitViolations(`Remove ${FORMER} Clips`).length, 1);
});
