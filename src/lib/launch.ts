/**
 * Until maxoff.in is attached (Phase 6), the site must not be indexed: every page carries
 * <meta name="robots" content="noindex"> and robots.txt disallows everything.
 * Phase 6 sets this to false, which removes both, and updates the tests that assert them.
 */
export const PRE_LAUNCH = true;
