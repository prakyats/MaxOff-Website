import type { APIRoute } from 'astro';
import { site } from '../content/copy';
import { PRE_LAUNCH } from '../lib/launch';

/** Disallow everything until launch (see src/lib/launch.ts); afterwards allow everything. */
export const GET: APIRoute = () => {
  const body = PRE_LAUNCH
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
