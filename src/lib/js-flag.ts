/**
 * Pre-paint progressive-enhancement flag (ADR 0005, amended by ADR 0014).
 * The site is dark only, so this script no longer chooses a theme: it only sets `data-js` on
 * <html> before first paint, which the CSS uses for no-JS fallbacks (`js-only`, `no-js-only`,
 * `js-collapsed`, the education journey). A static string; never throws.
 */
export const JS_FLAG_SCRIPT = `document.documentElement.setAttribute('data-js','')`
