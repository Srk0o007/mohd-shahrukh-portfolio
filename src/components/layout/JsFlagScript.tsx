import { JS_FLAG_SCRIPT } from '@/lib/js-flag'

/**
 * Pre-paint `data-js` flag (ADR 0005 as amended by ADR 0014). Rendered inside <head> by the
 * root layout. A static string constant — one of the two reviewed `dangerouslySetInnerHTML`
 * uses (ADR 0008).
 */
export function JsFlagScript() {
  return <script dangerouslySetInnerHTML={{ __html: JS_FLAG_SCRIPT }} />
}
