# Production Readiness

**Phase:** 11 — Performance, SEO & Quality Assurance
**Date:** 2026-11-04
**Verdict: ready for Phase 12 (deployment).** No code or content blockers remain. Three owner actions must be done before or at launch (§9).

**Status key:**
- ✅ done and verified;
- ⏳ done in Phase 12 or by the owner;
- ⚠ accepted with a reason.

## 1. Build and runtime

| Item | Status | Evidence |
|---|---|---|
| Production build succeeds from a clean checkout (`npm ci && npm run build`) | ✅ | Fresh-clone pipeline (PR) and GitHub CI |
| Every output is static (prerendered); no Server Actions, no `proxy.ts`, no per-request code | ✅ | Build output: 10 static outputs (ARCHITECTURE §2) |
| Runtime dependencies are only `next`, `react` and `react-dom` | ✅ | `package.json` |
| Node version pinned (`.nvmrc` 24, `engines >=24`) | ✅ | |
| No console errors or warnings in production | ✅ | E2E `foundation.spec.ts` in three engines |

## 2. Quality gates

| Item | Status | Evidence |
|---|---|---|
| TypeScript strict, ESLint, Prettier | ✅ 0 errors | [TEST_REPORT.md](TEST_REPORT.md) |
| Unit, component and content tests | ✅ 187 passed | TEST_REPORT §2 |
| E2E, navigation, form and accessibility tests in Chromium, Firefox and WebKit | ✅ 344 passed, 7 skipped (reasons recorded), 0 failed | TEST_REPORT §3 |
| CI blocks merge on any failure | ✅ | `.github/workflows/ci.yml` |

## 3. Performance

| Item | Status | Evidence |
|---|---|---|
| Lighthouse desktop Performance | ✅ 100 (every run) | [PERFORMANCE_REPORT.md](PERFORMANCE_REPORT.md) |
| Lighthouse mobile Performance | ✅ 90–91 at full host speed; 80–81 when the host slowed, equally for `main` and Phase 11 (A/B) | PERFORMANCE_REPORT §3 |
| CLS 0, including the hydration shift fix | ✅ | PERFORMANCE_REPORT §4 |
| First-load JS ≤ 150 KB; project code ≤ 15 KB above the framework | ✅ 144.8 KB / about 7.9 KB | `npm run size` (CI) |
| Page weight ≤ 1.5 MB after a full scroll | ✅ about 0.5 MB transferred | PERFORMANCE_REPORT §6 |
| Real-world measurement | ⏳ Phase 12: PageSpeed Insights on the live URL; field Core Web Vitals after launch | |

## 4. SEO

| Item | Status | Evidence |
|---|---|---|
| Title, description, canonical, `lang`, Open Graph, X/Twitter large card with 1200×630 image | ✅ | [SEO_CHECKLIST.md](SEO_CHECKLIST.md) |
| robots.txt, sitemap.xml, web manifest, favicon, Apple and manifest icons | ✅ | SEO_CHECKLIST §4, §6 |
| JSON-LD WebSite + Person (no phone or email) | ✅ | SEO_CHECKLIST §5 |
| Lighthouse SEO | ✅ 100 (every run) | |
| Search Console, Rich Results Test, social preview refresh | ⏳ Owner, after launch | SEO_CHECKLIST §8 |

## 5. Accessibility

| Item | Status | Evidence |
|---|---|---|
| WCAG 2.2 AA: no open failures | ✅ | [ACCESSIBILITY_REPORT.md](ACCESSIBILITY_REPORT.md) |
| Lighthouse Accessibility | ✅ 100 (every run) | |
| Screen-reader smoke test (NVDA / VoiceOver) | ⏳ Owner | ACCESSIBILITY_REPORT §7 |

## 6. Security

| Item | Status | Evidence |
|---|---|---|
| **No exposed secrets** | ✅ All 41 commits scanned (every blob, common token and private-key patterns): none found. No `.env` file was ever committed; `.env*` is git-ignored. | Phase 11 review |
| **Environment variables** | ✅ None needed. The Formspree form ID, site URL and CV path are public by design (`src/config/site.ts`). Only `NODE_ENV` is read (CSP dev allowance). | |
| **Input validation** | ✅ Client: name 1–100, email format ≤ 254, message 1–5,000 characters, trimmed (`lib/validate-contact.ts`, unit-tested). Server-side: Formspree validates and stores; the site renders no user input. | |
| **Contact form protection** | ✅ Honeypot `_gotcha` (Formspree drops filled submissions); Formspree spam filtering; no faked success; 15 s timeout; email fallback. ⏳ Owner checks reCAPTCHA / allowed-domain settings (§9). | ADR 0006 |
| **Security headers** | ✅ CSP (`default-src 'self'`; only `formspree.io` for connect and form-action; `frame-ancestors 'none'`; `object-src 'none'`), HSTS with preload, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`; no `X-Powered-By` | `curl -I`; E2E `foundation.spec.ts` |
| CSP `'unsafe-inline'` scripts | ⚠ Accepted (owner decision 5). Next.js inline RSC scripts change every build, so hashes would need per-request code. No user content is rendered. | ADR 0008 addendum |
| **Dependency review** | ✅ Production dependencies: 0 advisories. ⚠ Dev tooling: 17 moderate, all one `minimatch` ReDoS in the ESLint chain; the fix needs ESLint 10, blocked by plugin peer ranges (ADR 0012); never shipped. TypeScript 7 / ESLint 10 / `@types/node` 26 are deliberately not adopted (ADR 0011, ADR 0012, Node 24). | `npm audit`, `npm outdated` |
| Third-party scripts, analytics, cookies | ✅ None. No cookie banner is needed. | |
| `dangerouslySetInnerHTML` | ✅ Two reviewed uses only: the static theme script and JSON-LD with `<` escaped | ENGINEERING_GUIDELINES §3 |

## 7. Content

| Item | Status |
|---|---|
| All content from the 03 Nov 2026 resume and the live site, verified; content invariants in CI | ✅ |
| CV PDF (03 Nov 2026) served as `application/pdf` | ✅ |
| Six projects without public links show neither a link nor a note | ✅ (owner will add URLs after launch, Q11) |
| Extra project details (Q8) | ⏳ Owner, after launch (content-only change) |

## 8. Deployment readiness (Phase 12 inputs)

| Item | Status |
|---|---|
| Hosting: Vercel (ADR 0002). Plan terms and image-optimisation limits to confirm. | ⏳ Phase 12 (R17) |
| Domain `mohdshahrukh.in`: DNS at Hostinger; apex and `www` → Vercel; one canonical host | ⏳ Phase 12: **needs your Hostinger access** (R3) |
| HTTPS certificate | ⏳ Issued automatically by Vercel once DNS points to it |
| Rollback | ⏳ Vercel keeps every deployment; rollback is instant. The old Hostinger site stays untouched until DNS switches. |
| Preview deployments for PRs | ⏳ Set up with the Vercel Git integration |

## 9. Owner actions

**Before or at launch:**
1. **Formspree** (form `xleyzgzo`):
   - reCAPTCHA **off** (Spam protection);
   - notification email `khan.shahrukh156@gmail.com`;
   - allowed domain `mohdshahrukh.in` if domain restriction is on.
2. **Vercel account:** sign in with GitHub (Hobby plan, ADR 0002) so the repository can be imported in Phase 12.
3. **Hostinger access:** for the DNS change from the old host to Vercel.

**After launch:**
4. Send one real test message from the live site (decision 4b).
5. Screen-reader smoke test (ACCESSIBILITY_REPORT §7).
6. Google Search Console: verify and submit the sitemap; check social previews (SEO_CHECKLIST §8).
7. Add project URLs and details when ready (Q8, Q11): content-only edits in `src/content/projects.ts` and the matching link-status test.
