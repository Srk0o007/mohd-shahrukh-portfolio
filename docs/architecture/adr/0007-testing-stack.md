# ADR 0007: Testing stack (Vitest and Playwright)

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

**Requirements:**
- Component and unit tests for the interactive parts, and end-to-end smoke tests (NFR-MNT-06)
- Automated accessibility checks with zero axe violations (NFR-A11Y-02)
- CI gates (NFR-MNT-07)
- Content invariants ([ADR 0003](0003-typed-content-modules.md))

The owner's experience includes Jest, React Testing Library and Playwright.

## Decision

| Level | Tooling |
|---|---|
| Unit and component | **Vitest 5** + `@vitejs/plugin-react` + **jsdom** + **@testing-library/react** + **@testing-library/user-event** + **@testing-library/jest-dom** |
| End-to-end | **Playwright** (Chromium in PR CI; Chromium, Firefox and WebKit before release) against a production build (`next build && next start`) |
| Accessibility | **@axe-core/playwright** with WCAG 2.2 AA tags; home and 404 pages; both themes; 375 and 1280 px |
| Performance / SEO | Lighthouse CI, added in Phase 11 |

**Conventions:**
- Query by role and name.
- Test names cite acceptance scenario IDs (`AC-…`).
- Formspree is mocked in E2E with `page.route`; tests never send real messages.

## Alternatives considered

| Option | Why not |
|---|---|
| Jest + RTL | Mature and familiar, but needs extra ESM/TS transform configuration with Next 16; Vitest offers a Jest-compatible API with native ESM/TS and faster runs |
| Cypress | Heavier; Playwright covers three engines and accessibility checks in one tool |
| Testing async Server Components in unit tests | Not needed: sections are synchronous Server Components rendering content; E2E covers the composed page |

## Consequences

- All testing tools are dev-only; there is no runtime impact.
- The Jest knowledge carries over (`describe`, `it`, `expect`, matchers).
- Playwright browsers are installed in CI (`npx playwright install --with-deps chromium`).
