# ADR 0008: CSP for statically rendered pages

- **Status:** Accepted. **Amends NFR-SEC-02** (owner decision, 2026-11-04).
- **Date:** 2026-11-04

## Context

NFR-SEC-02 originally required `script-src` limited to `'self'` plus a nonce or hash for inline scripts.

**What the Next.js 16 documentation says (Content Security Policy guide):**
- Nonces require **dynamic rendering** of every page: "you **must use dynamic rendering to add nonces**", and with nonces "Static optimization and Incremental Static Regeneration (ISR) are disabled" and "Pages cannot be cached by CDNs".
- For static pages without nonces, the documented policy uses `script-src 'self' 'unsafe-inline'`. The App Router emits inline bootstrap scripts, and so does the theme script ([ADR 0005](0005-custom-theme-script.md)).
- A hash-based alternative (Subresource Integrity, `experimental.sri`) exists, but it is **experimental**.

This conflicts with ADR 0002 (static) and NFR-PERF-09.

**Threat model:** the site renders no user-generated or third-party content, loads no third-party scripts (D21), and only *sends* form input to Formspree. The XSS injection surface is minimal.

## Decision

Keep pages static and send this policy from `next.config.ts` `headers()` for all routes:

```
default-src 'self';
script-src 'self' 'unsafe-inline';          (+ 'unsafe-eval' in development only)
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self';
connect-src 'self' https://formspree.io;
form-action 'self' https://formspree.io;
frame-ancestors 'none';
base-uri 'self';
object-src 'none';
upgrade-insecure-requests
```

The same `headers()` block also sends:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` (no deprecated features, which would log console warnings; NFR-BRW-02) |
| `X-Frame-Options` | `DENY` (legacy companion to `frame-ancestors`) |

**NFR-SEC-02 is amended** to match this policy (see the updated row in [NON_FUNCTIONAL_REQUIREMENTS.md](../../requirements/NON_FUNCTIONAL_REQUIREMENTS.md)).

## Alternatives considered

| Option | Why not (now) |
|---|---|
| Nonce CSP + dynamic rendering via `proxy.ts` | Strictest, but every request is server-rendered: no CDN caching, slower TTFB, more cost and complexity for a static portfolio |
| `experimental.sri` (hash-based) | Experimental and may change; may not cover inline bootstrap scripts. **Re-evaluate in Phase 11**; if it can remove `'unsafe-inline'` without breakage, supersede this ADR. |

## Consequences

- Third-party script origins remain blocked; framing is blocked; form posts are restricted to Formspree.
- Inline script injection would not be stopped by CSP. This is mitigated by never rendering user input and by `dangerouslySetInnerHTML` being limited to two static, reviewed uses ([ENGINEERING_GUIDELINES.md §3](../ENGINEERING_GUIDELINES.md#3-react-and-nextjs)).
- securityheaders.com may grade below A+ because of `'unsafe-inline'`. NFR-SEC-03's "A or better" target is still expected.
