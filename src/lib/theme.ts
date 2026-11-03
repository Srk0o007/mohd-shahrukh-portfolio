import { siteConfig } from '@/config/site'

export type Theme = 'light' | 'dark'

/**
 * Pre-paint theme script (ADR 0005). A static string: it runs before first paint, sets
 * `data-js` (progressive-enhancement flag) and `data-theme` on <html>, and never throws.
 * Kept ≤ 1 KB (NFR-PERF-03); covered by unit tests in theme.test.ts.
 */
export const THEME_SCRIPT = `(function(){var d=document.documentElement;d.setAttribute('data-js','');var t=null;try{t=localStorage.getItem('${siteConfig.themeStorageKey}')}catch(e){}if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t);d.style.colorScheme=t})()`
