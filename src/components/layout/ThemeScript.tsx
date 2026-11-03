import { THEME_SCRIPT } from '@/lib/theme'

/**
 * Pre-paint theme initialisation (ADR 0005). Rendered inside <head> by the root layout.
 * A static string constant — one of the two reviewed `dangerouslySetInnerHTML` uses (ADR 0008).
 */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
}
