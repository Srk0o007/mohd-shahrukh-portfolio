import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitContact } from './submit-contact'

const ENDPOINT = 'https://formspree.io/f/test'
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

function body() {
  const data = new FormData()
  data.set('name', 'Asha')
  data.set('email', 'asha@example.com')
  data.set('message', 'Hello')
  return data
}

describe('submitContact (FR-CON-04, ADR 0006)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('POSTs the form data as a JSON-accepting request', async () => {
    const fetch = vi.fn().mockResolvedValue(json(200, { ok: true, next: '/thanks' }))
    const data = body()
    await submitContact(ENDPOINT, data, { fetch })
    expect(fetch).toHaveBeenCalledWith(
      ENDPOINT,
      expect.objectContaining({
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      }),
    )
  })

  it('succeeds only on 2xx with "ok": true', async () => {
    const fetch = vi.fn().mockResolvedValue(json(200, { ok: true }))
    expect(await submitContact(ENDPOINT, body(), { fetch })).toBe('success')
  })

  it.each([
    ['validation error', () => json(422, { errors: [{ message: 'email invalid' }] })],
    ['rate limit', () => json(429, { error: 'Too many submissions' })],
    ['reCAPTCHA required / forbidden', () => json(403, { error: 'reCAPTCHA failed' })],
    ['server error', () => json(500, {})],
    ['2xx without ok: true', () => json(200, { next: '/thanks' })],
    ['2xx with ok: false', () => json(200, { ok: false })],
    ['2xx HTML instead of JSON', () => new Response('<html>Thanks</html>', { status: 200 })],
  ])('reports an error for: %s', async (_, response) => {
    const fetch = vi.fn().mockResolvedValue(response())
    expect(await submitContact(ENDPOINT, body(), { fetch })).toBe('error')
  })

  it('reports an error when the network fails', async () => {
    const fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    expect(await submitContact(ENDPOINT, body(), { fetch })).toBe('error')
  })

  it('aborts and reports an error after the timeout', async () => {
    vi.useFakeTimers()
    const fetch = vi.fn(
      (_: string, init: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          )
        }),
    )
    const result = submitContact(ENDPOINT, body(), {
      fetch: fetch as typeof globalThis.fetch,
      timeoutMs: 1000,
    })
    await vi.advanceTimersByTimeAsync(1000)
    expect(await result).toBe('error')
  })
})
