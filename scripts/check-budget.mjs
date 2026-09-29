#!/usr/bin/env node
/**
 * Performance budget check for the home page (CLAUDE.md, "Budgets").
 *
 * Run after `astro build`. Reads dist/index.html and fails when:
 *   - JavaScript loaded by / exceeds 30 KB gzipped (external modules + inline scripts),
 *   - CSS loaded by / exceeds 40 KB gzipped (external stylesheets + inline styles),
 *   - total first-load weight (HTML + CSS + JS + preloaded fonts + eager images) exceeds 500 KB,
 *   - any script, stylesheet, font or image is requested from a third-party host
 *     (the Cloudflare Web Analytics beacon is the one allowed exception).
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = resolve('dist');
const BUDGET = { js: 30 * 1024, css: 40 * 1024, total: 500 * 1024 };
const OWN_HOSTS = new Set(['maxoff.in', 'www.maxoff.in']);
const ALLOWED_THIRD_PARTY = new Set(['static.cloudflareinsights.com']);

const indexPath = join(DIST, 'index.html');
if (!existsSync(indexPath)) {
  console.error('check-budget: dist/index.html not found. Run `pnpm build` first.');
  process.exit(1);
}

const html = readFileSync(indexPath, 'utf8');
const gz = (input) => gzipSync(input).length;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

/** Parse an attribute string into a lower-cased map. Attribute order is not guaranteed. */
function attrs(source) {
  const out = {};
  const re = /([a-zA-Z_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  for (const m of source.matchAll(re)) out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  return out;
}

const external = { js: new Set(), css: new Set(), font: new Set(), img: new Set() };
const thirdParty = [];
const missing = [];
let inlineJs = 0;
let inlineCss = 0;

function record(url, bucket) {
  if (!url || url.startsWith('data:')) return;
  if (/^(https?:)?\/\//i.test(url)) {
    const { host } = new URL(url, 'https://maxoff.in');
    if (!OWN_HOSTS.has(host) && !ALLOWED_THIRD_PARTY.has(host)) thirdParty.push(url);
    return;
  }
  external[bucket].add(url.split(/[?#]/)[0]);
}

for (const m of html.matchAll(/<(script|link|img)\b([^>]*)>/gi)) {
  const tag = m[1].toLowerCase();
  const a = attrs(m[2]);
  if (tag === 'script' && a.src) record(a.src, 'js');
  if (tag === 'img' && a.src && a.loading !== 'lazy') record(a.src, 'img');
  if (tag === 'link') {
    const rel = (a.rel ?? '').toLowerCase();
    if (rel === 'stylesheet') record(a.href, 'css');
    else if (rel === 'modulepreload') record(a.href, 'js');
    else if (rel === 'preload' && a.as === 'font') record(a.href, 'font');
    else if (rel === 'preload' && a.as === 'image') record(a.href, 'img');
  }
}

for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  const a = attrs(m[1]);
  if (a.src) continue;
  if ((a.type ?? '').includes('json')) continue; // JSON-LD is data, not JavaScript
  inlineJs += gz(m[2]);
}
for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) inlineCss += gz(m[1]);

function sizeOf(url, compressed) {
  const file = join(DIST, url.replace(/^\//, ''));
  if (!existsSync(file)) {
    missing.push(url);
    return 0;
  }
  return compressed ? gz(readFileSync(file)) : statSync(file).size;
}

const sum = (set, compressed) => [...set].reduce((n, url) => n + sizeOf(url, compressed), 0);

const js = inlineJs + sum(external.js, true);
const css = inlineCss + sum(external.css, true);
const fonts = sum(external.font, false); // woff2 is already compressed
const images = sum(external.img, false);
const document = gz(html);
const total = document + js + css + fonts + images;

const rows = [
  ['HTML (gzip)', document, null],
  ['JavaScript (gzip)', js, BUDGET.js],
  ['CSS (gzip)', css, BUDGET.css],
  ['Fonts (preloaded)', fonts, null],
  ['Images (eager)', images, null],
  ['Total first load', total, BUDGET.total],
];

const failures = [];
console.log('\nBudget check for /\n');
for (const [label, size, limit] of rows) {
  const status = limit == null ? '' : size <= limit ? 'ok' : 'OVER';
  if (status === 'OVER') failures.push(`${label} ${kb(size)} exceeds ${kb(limit)}`);
  console.log(
    `  ${label.padEnd(20)} ${kb(size).padStart(10)}${limit == null ? '' : `  / ${kb(limit)}  ${status}`}`,
  );
}
console.log('');

if (missing.length) failures.push(`referenced files missing from dist: ${missing.join(', ')}`);
if (thirdParty.length) failures.push(`third-party requests on /: ${thirdParty.join(', ')}`);

if (failures.length) {
  for (const f of failures) console.error(`check-budget: ${f}`);
  process.exit(1);
}
console.log('check-budget: within budget');
