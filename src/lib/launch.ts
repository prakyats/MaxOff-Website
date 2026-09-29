/**
 * The pre-launch switch. While true, every page carries <meta name="robots" content="noindex">
 * and robots.txt disallows everything. maxoff.in went live in Phase 6, so it is false: pages are
 * indexable and robots.txt allows crawling and lists the sitemap. The 404 page stays noindex
 * either way (see Base.astro). Set it back to true to take the site out of search again.
 */
export const PRE_LAUNCH = false;
