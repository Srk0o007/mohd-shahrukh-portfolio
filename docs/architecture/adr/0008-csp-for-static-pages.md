# ADR 0008: CSP for statically rendered pages

- **Status:** Accepted. **Amends NFR-SEC-02** (owner decision, 2026-11-04).
- **Date:** 2026-11-04
- **Revision:** 2026-11-04, before merge, per owner review. CSP hash sources and SRI are now described as separate mechanisms, and the Phase 11 evaluation plan is made explicit. The decision is unchanged.

## Context

NFR-SEC-02 originally required `script-src` limited to `'self'` plus a nonce or hash for inline scripts. The static App Router pages ([ADR 0002](0002-static-prerendering-on-vercel.md)) contain **two kinds of inline script**:

1. **Next.js/React bootstrap scripts.** The App Router streams the RSC payload through inline `<script>` elements, whose content depends on the page content and build.
2. **The theme initialisation script** ([ADR 0005](0005-custom-theme-script.md)), a static string that must run before first paint.

**Threat model:** the site renders no user-generated or third-party content, loads no third-party scripts (D21), and only *sends* form input to Formspree. The XSS injection surface is minimal.

### Three distinct mechanisms

They are often conflated, so each is listed separately:

| Mechanism | What it is | What it protects | Applies to inline scripts? | Works with static pages? |
|---|---|---|---|---|
| **CSP nonce source** (`'nonce-…'`) | A random value per response, placed in the CSP header and on each allowed `<script nonce>` | Allows only scripts carrying this response's nonce | **Yes** | **No.** The Next.js 16 CSP guide says you "must use dynamic rendering to add nonces"; "Static optimization and Incremental Static Regeneration (ISR) are disabled" and "Pages cannot be cached by CDNs". |
| **CSP hash source** (`'sha256-…'` in `script-src`) | The base64 SHA-256/384/512 of an inline script's exact text, listed in the CSP header | Allows only inline scripts whose content matches a listed hash | **Yes** | **Potentially**, if every inline script's content is known at build time and its hash is emitted into the header |
| **Subresource Integrity (SRI)** (`integrity="sha256-…"` attribute) | A hash of an **external** file's bytes on its `<script src>` / `<link>` tag; the browser refuses mismatched files | Detects tampering of fetched script files (CDN or transit) | **No.** SRI does not authorise inline scripts. | **Yes.** Next.js offers this as `experimental.sri`, which adds `integrity` to its script tags at build. |

**Key interactions:**
- `experimental.sri` alone does **not** remove the need for `'unsafe-inline'`, because the bootstrap and theme scripts are inline.
- In CSP Level 2+ browsers, once a `script-src` contains **any** nonce or hash source, `'unsafe-inline'` is **ignored**. A partial hash list (for example, only the theme script) would therefore block the un-hashed Next.js bootstrap scripts and break hydration.
- CSP Level 3 `'strict-dynamic'` (scripts loaded by already-trusted scripts become trusted) is relevant to any future hash- or nonce-based policy.

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

**NFR-SEC-02 is amended** to match this policy (see the updated row in [NON_FUNCTIONAL_REQUIREMENTS.md](../../requirements/NON_FUNCTIONAL_REQUIREMENTS.md)). **This decision stays in force until the Phase 11 evaluation below is completed and accepted.**

## Phase 11 evaluation: can a hash-based CSP replace `'unsafe-inline'`?

**Question:** can `script-src 'unsafe-inline'` be replaced by **CSP hash sources** for every inline script, optionally combined with SRI for external scripts and `'strict-dynamic'`, without breaking Next.js bootstrap/hydration or theme initialisation?

**Method** (against a production build, `next build && next start`, and a Vercel preview):

1. **Inventory inline scripts.** Count and capture every inline `<script>` in the built HTML of `/` and the 404 page, and classify each as bootstrap (RSC payload/runtime) or theme.
2. **Stability check.** Rebuild twice without changes. Do the inline bootstrap contents (and therefore their hashes) change between builds? Do they differ per route?
3. **Hash generation feasibility.** Can the hashes be produced at build time and injected into the CSP header without dynamic rendering? Options: framework support if available, or a post-build step that hashes the emitted HTML and writes the headers configuration. Assess maintenance cost.
4. **Theme script.** Compute its SHA-256 and confirm it still runs before paint with no flash under the hash-only policy.
5. **External scripts.** Enable `experimental.sri`, confirm `integrity` attributes are present and valid, and decide whether `'strict-dynamic'` is needed for chunks loaded at runtime.
6. **Verification under the candidate policy:**
   - zero CSP violations in the console (Chromium, Firefox, WebKit);
   - hydration works (client islands interactive);
   - theme: no flash, toggle and persistence work (AC-THM-1/2);
   - the full Playwright E2E and axe suites pass;
   - Lighthouse Best Practices ≥ 95.

**Outcomes:**
- **All checks pass** and the maintenance cost is acceptable → write a new ADR superseding this one; NFR-SEC-02 is tightened back to "no `'unsafe-inline'`".
- **Any check fails** → keep this ADR, and record the evaluation results and reasons in PROJECT_STATUS.md and an addendum to this ADR. SRI may still be adopted on its own for external-script integrity if it causes no breakage.

## Alternatives considered

| Option | Why not (now) |
|---|---|
| Nonce CSP + dynamic rendering via `proxy.ts` | Strictest, but every request is server-rendered: no CDN caching, slower TTFB, more cost and complexity for a static portfolio |
| Hash-based CSP (hash sources for all inline scripts) | Feasibility with Next.js inline bootstrap scripts is unproven; a partial list breaks hydration (see Key interactions). **Evaluated in Phase 11.** |
| `experimental.sri` alone | Protects external files only; does not authorise inline scripts, so it cannot remove `'unsafe-inline'` by itself |

## Consequences

- Third-party script origins remain blocked; framing is blocked; form posts are restricted to Formspree.
- Inline script injection would not be stopped by CSP. This is mitigated by never rendering user input and by `dangerouslySetInnerHTML` being limited to two static, reviewed uses ([ENGINEERING_GUIDELINES.md §3](../ENGINEERING_GUIDELINES.md#3-react-and-nextjs)).
- securityheaders.com may grade below A+ because of `'unsafe-inline'`. NFR-SEC-03's "A or better" target is still expected.

## Addendum (Phase 11, 2026-11-04): evaluation result — keep this ADR

**Measured:** the prerendered home page has **9 executable inline scripts**:
- the theme pre-paint script;
- **6 RSC payload chunks** (`self.__next_f.push(…)`), whose content changes with every build;
- 2 Next.js bootstrap snippets.

The 404 page has 4. The JSON-LD block is a data block and is not executed, so `script-src` does not govern it.

**Why hash sources do not fit:**
- The hashes can only be known *after* the build.
- The headers in `next.config.ts` are fixed *before* pages are generated.
- Serving per-page hashes would need either a post-build rewrite of deployment headers, or per-request code (`proxy.ts` / nonces). Per-request code ends static rendering and CDN caching (see Alternatives).
- A partial hash list breaks hydration.

**Decision:** keep `'unsafe-inline'` (owner decision 5, Phase 11). The mitigations stand:
- no user content is ever rendered;
- third-party script origins are blocked;
- `dangerouslySetInnerHTML` is still limited to the two reviewed uses planned in ENGINEERING_GUIDELINES §3: the static theme script, and, from Phase 11, the JSON-LD data block. JSON-LD is built from typed content and serialised with `<` escaped (`lib/structured-data.ts`, unit-tested).

**SRI (`experimental.sri`):** not adopted. Every script is same-origin and served from the app's own deployment, so SRI would add build complexity without a meaningful threat to mitigate. Revisit if third-party scripts are ever added.
