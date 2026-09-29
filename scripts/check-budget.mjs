#!/usr/bin/env node
/**
 * Performance budget check for every built page (CLAUDE.md, "Budgets").
 *
 * Run after `astro build`. Reads every dist/**\/*.html and fails, per page, when:
 *   - JavaScript loaded by the page exceeds 30 KB gzipped (external modules + inline scripts),
 *   - CSS loaded by the page exceeds 40 KB gzipped (external stylesheets + inline styles),
 *   - total first-load weight (HTML + CSS + JS + preloaded fonts + eager images) exceeds 500 KB,
 *   - any script, stylesheet, font or image is requested from a third-party host
 *     (the Cloudflare Web Analytics beacon is the one allowed exception),
 *   - a referenced file is missing from dist.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = resolve('dist');
const BUDGET = { js: 30 * 1024, css: 40 * 1024, total: 500 * 1024 };
const OWN_HOSTS = new Set(['maxoff.in', 'www.maxoff.in']);
const ALLOWED_THIRD_PARTY = new Set(['static.cloudflareinsights.com']);

const gz = (input) => gzipSync(input).length;
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

/** Parse an attribute string into a lower-cased map. Attribute order is not guaranteed. */
function attrs(source) {
  const out = {};
  const re = /([a-zA-Z_:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  for (const m of source.matchAll(re)) out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  return out;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

/** Measure what one built page loads on first view. */
function measure(htmlPath) {
  const html = readFileSync(htmlPath, 'utf8');
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
  return {
    js,
    css,
    fonts,
    images,
    document,
    total: document + js + css + fonts + images,
    thirdParty,
    missing,
  };
}

if (!existsSync(DIST)) {
  console.error('check-budget: dist/ not found. Run `pnpm build` first.');
  process.exit(1);
}

const pages = walk(DIST)
  .filter((f) => f.endsWith('.html'))
  .sort();
if (pages.length === 0) {
  console.error('check-budget: no built pages found in dist/.');
  process.exit(1);
}

const failures = [];
const pad = (text, n) => String(text).padEnd(n);

console.log(
  `\nBudget check (JS < ${kb(BUDGET.js)}, CSS < ${kb(BUDGET.css)}, total < ${kb(BUDGET.total)}, all gzipped)\n`,
);
console.log(
  `  ${pad('page', 26)}${pad('HTML', 10)}${pad('JS', 10)}${pad('CSS', 10)}${pad('fonts', 10)}total`,
);

for (const file of pages) {
  const route = `/${file
    .slice(DIST.length + 1)
    .replace(/\\/g, '/')
    .replace(/\.html$/, '')
    .replace(/^index$/, '')}`;
  const m = measure(file);
  console.log(
    `  ${pad(route, 26)}${pad(kb(m.document), 10)}${pad(kb(m.js), 10)}${pad(kb(m.css), 10)}${pad(kb(m.fonts), 10)}${kb(m.total)}`,
  );
  if (m.js > BUDGET.js) failures.push(`${route}: JavaScript ${kb(m.js)} exceeds ${kb(BUDGET.js)}`);
  if (m.css > BUDGET.css) failures.push(`${route}: CSS ${kb(m.css)} exceeds ${kb(BUDGET.css)}`);
  if (m.total > BUDGET.total)
    failures.push(`${route}: total ${kb(m.total)} exceeds ${kb(BUDGET.total)}`);
  if (m.missing.length)
    failures.push(`${route}: referenced files missing from dist: ${m.missing.join(', ')}`);
  if (m.thirdParty.length)
    failures.push(`${route}: third-party requests: ${m.thirdParty.join(', ')}`);
}
console.log('');

if (failures.length) {
  for (const f of failures) console.error(`check-budget: ${f}`);
  process.exit(1);
}
console.log(`check-budget: ${pages.length} pages within budget`);
