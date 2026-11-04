import { siteConfig } from '@/config/site'

export type Theme = 'light' | 'dark'

/**
 * Pre-paint theme script (ADR 0005). A static string: it runs before first paint, sets
 * `data-js` (progressive-enhancement flag) and `data-theme` on <html>, and never throws.
 * Kept ≤ 1 KB (NFR-PERF-03); covered by unit tests in theme.test.ts.
 */
export const THEME_SCRIPT = `(function(){var d=document.documentElement;d.setAttribute('data-js','');var t=null;try{t=localStorage.getItem('${siteConfig.themeStorageKey}')}catch(e){}if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t);d.style.colorScheme=t})()`

type ThemeStorage = Pick<Storage, 'getItem' | 'setItem'>
type ThemeRoot = Pick<HTMLElement, 'setAttribute' | 'getAttribute'> & {
  style: { colorScheme: string }
}

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

/** The stored choice, or null when there is none or storage is unavailable (FR-THM-02). */
export function readStoredTheme(storage: ThemeStorage | undefined): Theme | null {
  try {
    const value = storage?.getItem(siteConfig.themeStorageKey)
    return isTheme(value) ? value : null
  } catch {
    return null
  }
}

/** Persists the choice; returns false when storage is unavailable (the toggle still works). */
export function storeTheme(storage: ThemeStorage | undefined, theme: Theme): boolean {
  try {
    if (!storage) return false
    storage.setItem(siteConfig.themeStorageKey, theme)
    return true
  } catch {
    return false
  }
}

/** Same attributes the pre-paint script sets. */
export function applyTheme(root: ThemeRoot, theme: Theme): void {
  root.setAttribute('data-theme', theme)
  root.style.colorScheme = theme
}

export function currentTheme(root: Pick<HTMLElement, 'getAttribute'>): Theme {
  return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}
