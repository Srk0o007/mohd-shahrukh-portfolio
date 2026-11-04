/**
 * Sends the contact form to Formspree (ADR 0006, FR-CON-04).
 *
 * Success is reported **only** when Formspree confirms acceptance: an HTTP 2xx response whose
 * JSON body says `"ok": true`. Everything else is a failure: a non-2xx status (validation,
 * rate limit, reCAPTCHA required, server error), a body that is not that JSON, a network error,
 * or no response within the timeout. The caller keeps the visitor's input on failure.
 */
export type SubmitResult = 'success' | 'error'

export const SUBMIT_TIMEOUT_MS = 15_000

export async function submitContact(
  endpoint: string,
  body: FormData,
  options: { fetch?: typeof fetch; timeoutMs?: number } = {},
): Promise<SubmitResult> {
  const fetchImpl = options.fetch ?? fetch
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? SUBMIT_TIMEOUT_MS)
  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body,
      signal: controller.signal,
    })
    if (!response.ok) return 'error'
    const data: unknown = await response.json()
    return isAccepted(data) ? 'success' : 'error'
  } catch {
    return 'error'
  } finally {
    clearTimeout(timer)
  }
}

function isAccepted(data: unknown): boolean {
  return typeof data === 'object' && data !== null && (data as { ok?: unknown }).ok === true
}
