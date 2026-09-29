import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CONTACT,
  findBuiltProblems,
  findRepoProblems,
  findWranglerProblems,
} from './check-static.mjs';

const word = (...parts) => parts.join('');
const other = word('someone', '@', 'example', '.com');

test('the built site may not contain an address or a plain mailto link', () => {
  assert.equal(findBuiltProblems('dist/index.html', `<p>${CONTACT}</p>`).length, 1);
  assert.equal(findBuiltProblems('dist/index.html', `<a href="mailto:x">x</a>`).length, 1);
  assert.equal(findBuiltProblems('dist/_astro/app.js', `const a="${other}"`).length, 1);
});

test('entity-encoded addresses and runtime assembly pass', () => {
  const encoded = Array.from(CONTACT, (c) => `&#${c.codePointAt(0)};`).join('');
  assert.deepEqual(
    findBuiltProblems('dist/index.html', `<p>${encoded}</p><a href="${encoded}">x</a>`),
    [],
  );
  assert.deepEqual(findBuiltProblems('dist/_astro/app.js', `const a=d.user+"@"+d.domain`), []);
  assert.deepEqual(
    findBuiltProblems('dist/index.html', `<style>@media (min-width:1px){a{color:red}}</style>`),
    [],
  );
});

test('the repo may contain the contact address and no other', () => {
  assert.deepEqual(findRepoProblems('docs/BRIEF.md', `Write to ${CONTACT}.`), []);
  assert.equal(
    findRepoProblems('docs/BRIEF.md', `Write to ${word('leads', '@mail.', 'maxoff.in')}.`).length,
    1,
  );
  assert.equal(findRepoProblems('src/x.ts', `const a = '${other}'`).length, 1);
});

test('the original brief and the lockfile are exempt', () => {
  assert.deepEqual(
    findRepoProblems('docs/BRIEF-ORIGINAL.md', `${word('LEADS', '_TO')} ${other}`),
    [],
  );
  assert.deepEqual(findRepoProblems('pnpm-lock.yaml', `${word('resend')} ${other}`), []);
});

test('mentions of a form backend, mail API, bot check or API route are rejected', () => {
  assert.equal(findRepoProblems('docs/ROADMAP.md', `Use ${word('Turn', 'stile')} here.`).length, 1);
  assert.equal(findRepoProblems('docs/ROADMAP.md', `Send with ${word('Re', 'send')}.`).length, 1);
  assert.equal(findRepoProblems('docs/ROADMAP.md', `Set ${word('LEADS', '_TO')}.`).length, 1);
  assert.equal(findRepoProblems('src/x.ts', `fetch('${word('/a', 'pi/', 'x')}')`).length, 1);
  assert.equal(
    findRepoProblems('package.json', `"@cloudflare/${word('workers', '-types')}": "1"`).length,
    1,
  );
});

test('ordinary words are not mistaken for the banned ones', () => {
  assert.deepEqual(findRepoProblems('docs/ROADMAP.md', 'Please resend the email if it fails.'), []);
  assert.deepEqual(
    findRepoProblems('docs/ROADMAP.md', 'Cloudflare Web Analytics is cookie-less.'),
    [],
  );
});

test('wrangler.jsonc may hold static assets only', () => {
  const ok = `{ "name": "maxoff-website", "assets": { "directory": "./dist" }, // main is not set\n "workers_dev": true }`;
  assert.deepEqual(findWranglerProblems(ok), []);
  assert.equal(findWranglerProblems(`{ "main": "worker/index.ts" }`).length, 1);
  assert.equal(findWranglerProblems(`{ "assets": { "run_worker_first": ["/x/*"] } }`).length, 1);
  assert.equal(findWranglerProblems(`{ "vars": { "A": "b" } }`).length, 1);
});
