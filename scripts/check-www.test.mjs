import assert from 'node:assert/strict';
import { test } from 'node:test';
import { expectedLocation, findRedirectProblems, PROBES } from './check-www.mjs';

test('the target keeps the path and the query and always uses https on the apex', () => {
  assert.equal(expectedLocation('https://www.maxoff.in/'), 'https://maxoff.in/');
  assert.equal(
    expectedLocation('http://www.maxoff.in/privacy?x=1&y=2'),
    'https://maxoff.in/privacy?x=1&y=2',
  );
});

test('a 301 to the right place passes', () => {
  const url = 'https://www.maxoff.in/privacy?x=1';
  assert.deepEqual(findRedirectProblems(url, 301, 'https://maxoff.in/privacy?x=1'), []);
});

test('serving the page, a 302, a dropped query or a dropped path fail', () => {
  const url = 'https://www.maxoff.in/privacy?x=1';
  assert.equal(findRedirectProblems(url, 200, null).length, 2);
  assert.equal(findRedirectProblems(url, 302, 'https://maxoff.in/privacy?x=1').length, 1);
  assert.equal(findRedirectProblems(url, 301, 'https://maxoff.in/privacy').length, 1);
  assert.equal(findRedirectProblems(url, 301, 'https://maxoff.in/').length, 1);
});

test('the probes cover http, https, a page and a query string', () => {
  assert.ok(PROBES.some((u) => u.startsWith('http://')));
  assert.ok(PROBES.some((u) => u.startsWith('https://')));
  assert.ok(PROBES.some((u) => new URL(u).pathname !== '/'));
  assert.ok(PROBES.some((u) => new URL(u).search));
});
