/**
 * MaxOff site Worker.
 *
 * Static assets are served by Cloudflare directly; this Worker only runs for /api/* paths
 * (see `assets.run_worker_first` in wrangler.jsonc). Phase 4 implements the early-access
 * endpoint here: validate input, verify Turnstile, send one email through Resend, rate-limit
 * by IP, return JSON. No database.
 */

export interface Env {
  ASSETS: Fetcher;
  // Set in the Cloudflare dashboard, never in the repo. Names listed in .env.example.
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  LEADS_TO?: string;
  LEADS_FROM?: string;
}

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
} as const;

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/early-access') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
          status: 405,
          headers: { ...JSON_HEADERS, allow: 'POST' },
        });
      }
      // Phase 4 replaces this stub.
      return new Response(JSON.stringify({ ok: false, error: 'not_available_yet' }), {
        status: 503,
        headers: JSON_HEADERS,
      });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
