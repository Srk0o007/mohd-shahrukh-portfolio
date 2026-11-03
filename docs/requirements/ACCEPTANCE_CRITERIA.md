# Acceptance Criteria

**Phase:** 03 — Requirements & Content Specification
**Date:** 2026-11-03

Each requirement in [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md) and [NON_FUNCTIONAL_REQUIREMENTS.md](NON_FUNCTIONAL_REQUIREMENTS.md) carries its own acceptance criteria. This document adds:

1. How criteria are verified (methods and tools)
2. The Definition of Done
3. End-to-end acceptance scenarios (Given / When / Then) for the key user flows
4. The v1 release checklist
5. A traceability matrix

---

## 1. Verification methods

| Code | Method | Tool | Introduced |
|---|---|---|---|
| **AUTO-A11Y** | Automated accessibility scan | axe-core (via Playwright or the browser extension), Lighthouse | Phase 10/11 |
| **AUTO-PERF** | Lab performance | Lighthouse (mobile, simulated throttling), Next.js build output (JS sizes) | Phase 11 |
| **AUTO-TEST** | Component and end-to-end tests | Test runner (Phase 05 choice) + Playwright | Phase 11 |
| **AUTO-CI** | Static checks | `tsc --noEmit`, ESLint, Prettier, `next build`, `npm audit` | Phase 06 |
| **MAN-KB** | Manual keyboard pass | Keyboard only (Tab, Shift+Tab, Enter, Space, Esc) | Phase 10 |
| **MAN-SR** | Screen-reader smoke test | NVDA + Chrome (Windows), VoiceOver + Safari (iOS) | Phase 10 |
| **MAN-RSP** | Responsive check | Browser DevTools plus at least one real phone | Phase 10 |
| **MAN-CNT** | Content fidelity review | Compare the rendered page against [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md); owner sign-off | Phase 08/11 |
| **MAN-HDR** | Header and SEO inspection | `curl -I`, securityheaders.com, Schema.org validator, social preview debugger | Phase 11/12 |

## 2. Definition of Done

### 2.1 Per feature or PR (from Phase 06 onward)

- [ ] Implements only approved requirements; requirement IDs are listed in the PR description
- [ ] All acceptance criteria of those requirements pass
- [ ] Content comes from the typed content source; no hard-coded copy in components (NFR-MNT-03)
- [ ] `tsc`, lint and build pass (AUTO-CI)
- [ ] Keyboard pass and visible focus checked (MAN-KB) for any interactive change
- [ ] Checked at 320, 768 and 1280 px in light **and** dark themes
- [ ] Reduced-motion behaviour checked for any animation
- [ ] Docs and PROJECT_STATUS.md updated

### 2.2 Per phase

- [ ] All in-scope requirements meet the per-feature Definition of Done
- [ ] Deferred items are logged in PROJECT_STATUS.md with a target phase
- [ ] PR reviewed and approved by the owner; merged into `main`

---

## 3. Acceptance scenarios

### AC-NAV: Navigation

**AC-NAV-1 · Desktop navigation** (FR-NAV-01, FR-NAV-05)
- **Given** a 1280 px viewport and the page scrolled to any position
- **When** I activate "Projects" in the header
- **Then** the page moves to the Projects section, its heading is fully visible below the sticky header, and the URL hash becomes `#projects`

**AC-NAV-2 · Mobile menu with keyboard** (FR-NAV-02, NFR-A11Y-05)
- **Given** a 375 px viewport
- **When** I Tab to "Open menu" and press Enter
- **Then** the menu opens, `aria-expanded="true"`, focus is on the first menu item, and Tab cycles only through menu items
- **When** I press Esc
- **Then** the menu closes and focus returns to the menu button

**AC-NAV-3 · Mobile menu link** (FR-NAV-02)
- **Given** the mobile menu is open
- **When** I select "Contact"
- **Then** the menu closes, page scrolling is restored, and the Contact section is shown with its heading visible

**AC-NAV-4 · Skip link** (FR-NAV-03)
- **Given** the page has just loaded
- **When** I press Tab once
- **Then** "Skip to main content" becomes visible
- **When** I press Enter
- **Then** focus moves to `<main>`

### AC-HERO: First impression

**AC-HERO-1** (FR-HERO-01, NFR-RSP-01)
- **Given** a 320 px viewport
- **When** the page loads
- **Then** I see "Mohd Shahrukh" (`<h1>`), "Software Development Engineer | Frontend" and "Based in Bangalore, Karnataka, India."; there is no typing animation and no horizontal scrollbar

### AC-RES: Resume content

**AC-RES-1 · Experience** (FR-RES-01)
- **Given** the Experience section
- **Then** roles appear in this order: AltInvest Online Platform (formerly PropShare), May 2024 – Oct 2026; BrandSystems India Pvt. Ltd., Dec 2021 – Apr 2024; SOSUDATECH Pvt. Ltd., Sep 2020 – Nov 2021
- **And** they have 11, 4 and 2 highlights respectively, matching the resume word for word
- **And** "Present" does not appear anywhere on the page

**AC-RES-2 · Skills, certifications, education** (FR-RES-03 … 05)
- **Then** 9 skill groups are shown without percentages; 3 certifications (IBM, JavaScript, React); and 1 education entry (B.Tech, 2019)

**AC-RES-3 · CV download** (FR-RES-06)
- **Given** any viewport
- **When** I activate "Download CV" in the header
- **Then** the 03 Nov 2026 resume PDF opens or downloads, the response is `200 application/pdf`, and the link's accessible name includes "PDF"

### AC-PRJ: Project browsing

**AC-PRJ-1 · Default view** (FR-PRJ-01, FR-PRJ-06)
- **Given** the Projects section
- **Then** 10 cards are visible in content order, every image sits in a consistent frame, and no layout shift occurs as images load

**AC-PRJ-2 · Filtering** (FR-PRJ-02)
- **When** I activate "Enterprise products"
- **Then** exactly 3 cards are shown (Digital Asset Management, Approval Software Management, Campaign Management), the button is marked pressed, and "Showing 3 of 10 projects" is announced
- **When** I activate "Websites"
- **Then** exactly 7 cards are shown
- **When** I activate "All"
- **Then** all 10 are shown

**AC-PRJ-3 · Links** (FR-PRJ-03, FR-PRJ-04)
- **Then** only the SOSUDATECH Pvt. Ltd. card has a link ("Visit SOSUDATECH Pvt. Ltd. website", opens in a new tab with `rel="noopener noreferrer"`)
- **And** cards 1–3 show "Internal product — no public link"
- **And** cards 4 and 6–10 show neither a link nor a note
- **And** the page contains no `href="#"` and no empty links

**AC-PRJ-4 · Adding a URL later** (FR-PRJ-04, NFR-MNT-03)
- **Given** a verified live URL for "Niles Academy"
- **When** only the content entry is changed (`linkStatus: "live"`, `url`)
- **Then** the card shows a working link after rebuild, with no component changes

**AC-PRJ-5 · Without JavaScript** (FR-PRJ-02, NFR-BRW-03)
- **Given** JavaScript is disabled
- **Then** all 10 projects are visible and no non-functional filter buttons are shown

### AC-CON: Contact

**AC-CON-1 · Validation** (FR-CON-02, FR-CON-03)
- **Given** an empty form
- **When** I press "Send"
- **Then** no request is sent, each field shows its error message, each field has `aria-invalid="true"` linked to its message, and focus moves to the name field
- **When** I type "abc" in the email field and move on
- **Then** "Please enter a valid email address." is shown

**AC-CON-2 · Success** (FR-CON-04)
- **Given** valid inputs
- **When** I press "Send"
- **Then** the button shows "Sending…" and is disabled
- **And** on success, "Thank you! Your message has been sent." is announced via `role="status"` and the form clears, while the URL and page stay the same

**AC-CON-3 · Failure** (FR-CON-04)
- **Given** the provider returns an error, or the network is offline
- **When** I submit
- **Then** the error message with the email fallback is announced (`role="alert"`) and my input is preserved

**AC-CON-4 · Spam honeypot** (FR-CON-05)
- **Given** an automated submission that fills the hidden honeypot field
- **Then** the message is not delivered to the owner

**AC-CON-5 · Direct contact** (FR-CON-01, FR-CTA-01)
- **Then** the phone number is a `tel:+919760787661` link and "Call Me!" uses the same `tel:` link; the email is a `mailto:` link; there is no second phone number and no Twitter/X link

### AC-THM: Theme

**AC-THM-1 · System default** (FR-THM-01)
- **Given** a first visit with the OS set to dark
- **Then** the dark theme renders on first paint, with no light flash

**AC-THM-2 · Persistence** (FR-THM-02)
- **When** I switch to the light theme and reload
- **Then** the light theme is applied on first paint, and the toggle's accessible name reads "Switch to dark theme"

**AC-THM-3 · Contrast in both themes** (FR-THM-03, NFR-A11Y-04)
- **Then** AUTO-A11Y reports no contrast violations in either theme

### AC-INT: Motion and interaction

**AC-INT-1 · Reduced motion** (FR-INT-02, NFR-A11Y-08)
- **Given** `prefers-reduced-motion: reduce`
- **Then** no entrance animation, smooth scroll, parallax or zoom effect runs, and all content is visible immediately

**AC-INT-2 · No perpetual motion** (FR-INT-03)
- **Given** the page has been idle for 10 s
- **Then** nothing on screen is moving, unless it has a visible pause control

**AC-INT-3 · No preloader** (FR-INT-04)
- **Then** content is visible in the first render; no full-screen loader appears

### AC-A11Y / PERF / SEO / SEC / RSP / BRW: Quality gates

| Scenario | Check | Pass condition | Requirements |
|---|---|---|---|
| AC-Q-1 | AUTO-A11Y on home and 404, both themes, 375 and 1280 px | 0 axe violations; Lighthouse Accessibility ≥ 95 | NFR-A11Y-01/02 |
| AC-Q-2 | Heading outline | One `<h1>`; `<h2>` per section; no skipped levels | NFR-A11Y-03 |
| AC-Q-3 | MAN-KB full-page pass | Every control reachable and operable; focus always visible and never hidden under the header | NFR-A11Y-05, FR-INT-01 |
| AC-Q-4 | MAN-SR smoke test | Menu, filter, form, theme and CV link understandable and operable | NFR-A11Y-11 |
| AC-Q-5 | 400% zoom at 1280 px | No horizontal scrolling; no content lost | NFR-A11Y-10 |
| AC-Q-6 | AUTO-PERF (mobile) | LCP ≤ 2.5 s, CLS ≤ 0.1, TBT ≤ 200 ms; all four Lighthouse scores ≥ 95 | NFR-PERF-01…04 |
| AC-Q-7 | Build output | First-load JS ≤ 150 KB gzip | NFR-PERF-05 |
| AC-Q-8 | Network panel (mobile, before scrolling) | ≤ 500 KB transferred; no third-party requests; fonts self-hosted | NFR-PERF-06…08 |
| AC-Q-9 | MAN-HDR SEO | Canonical, robots.txt, sitemap.xml, absolute OG image renders in a preview debugger, JSON-LD valid | NFR-SEO-01…05 |
| AC-Q-10 | MAN-HDR security | HSTS, CSP, nosniff, Referrer-Policy and Permissions-Policy present; no CSP console errors | NFR-SEC-01…03 |
| AC-Q-11 | AUTO-CI | `npm audit` shows no high or critical issues; no secrets in the repo; lockfile committed | NFR-SEC-05/06 |
| AC-Q-12 | Storage | No cookies; `localStorage` holds only the theme key | NFR-SEC-08 |
| AC-Q-13 | MAN-RSP | 320, 375, 768, 1024, 1280, 1440 and 1920 px, portrait and landscape: no overflow; layout intact | NFR-RSP-01…03 |
| AC-Q-14 | Browser matrix | Chrome, Edge, Firefox, Safari (macOS), iOS Safari and Android Chrome: flows AC-NAV, AC-PRJ, AC-CON and AC-THM pass; no console errors | NFR-BRW-01/02 |
| AC-Q-15 | JS disabled | All content, anchors and links work | NFR-BRW-03 |
| AC-Q-16 | MAN-CNT | Every rendered value matches CONTENT_SCHEMA; no "Present", Twitter, second phone, percentages, Diploma, Intermediate or SCSS certificate | All content FRs, D1–D21 |

---

## 4. Release checklist (v1)

- [ ] All **Must** functional requirements pass (traceability matrix below)
- [ ] All **Must** non-functional requirements pass (AC-Q-1 … AC-Q-16)
- [ ] Owner content sign-off (MAN-CNT)
- [ ] CV PDF (03 Nov 2026) is served correctly
- [ ] Production domain `https://mohdshahrukh.in/` is live with HTTPS; `www` and `http` redirect
- [ ] Contact form verified end to end on production (a test message is sent **with owner consent**)
- [ ] Unmet **Should** items logged in PROJECT_STATUS.md
- [ ] Old site backed up before the DNS switch (Phase 12)

---

## 5. Traceability matrix

| Requirement | Priority | Scenario(s) | Source | Verified in phase |
|---|---|---|---|---|
| FR-NAV-01 | Must | AC-NAV-1 | [S], D15 | 07 |
| FR-NAV-02 | Must | AC-NAV-2, AC-NAV-3 | A4 | 07, 10 |
| FR-NAV-03 | Must | AC-NAV-4 | A7 | 07 |
| FR-NAV-04 | Should | AC-NAV-1 (manual) | [S] | 09 |
| FR-NAV-05 | Must | AC-NAV-1 | WCAG 2.4.11 | 07 |
| FR-NAV-06 | Could | — | [S] | 09 |
| FR-HERO-01 | Must | AC-HERO-1 | A1, A8, D12 | 07 |
| FR-HERO-02 | Should | AC-Q-6 | [S] | 07 |
| FR-ABT-01 | Must | AC-Q-16 | [R], D13 | 07 |
| FR-SRV-01 | Must | AC-Q-16 | [S], D20 | 07 |
| FR-RES-01 | Must | AC-RES-1 | [R], D1 | 07 |
| FR-RES-02 | Could | — | REF | 07 |
| FR-RES-03 | Must | AC-RES-2 | [R], D5 | 07 |
| FR-RES-04 | Must | AC-RES-2 | D3 | 07 |
| FR-RES-05 | Must | AC-RES-2 | D2 | 07 |
| FR-RES-06 | Must | AC-RES-3 | D7 | 07 |
| FR-RES-07 | Must | AC-Q-2 | D15 | 07 |
| FR-PRJ-01 | Must | AC-PRJ-1 | D6 | 08 |
| FR-PRJ-02 | Must | AC-PRJ-2, AC-PRJ-5 | C12, D10 | 08 |
| FR-PRJ-03 | Must | AC-PRJ-3 | Audit §3, A6 | 08 |
| FR-PRJ-04 | Must | AC-PRJ-3, AC-PRJ-4 | D6, D11 | 08 |
| FR-PRJ-05 | Must | AC-PRJ-1 | D9 | 08 |
| FR-PRJ-06 | Must | AC-PRJ-1, AC-Q-6 | P1–P4 | 08 |
| FR-PRJ-07 | Could | AC-INT-1 | REF | 08 |
| FR-CTA-01 | Must | AC-CON-5 | D19 | 08 |
| FR-TST-01 | Must | AC-INT-2, AC-Q-16 | A2, D18 | 08 |
| FR-CON-01 | Must | AC-CON-5 | D4, D14 | 09 |
| FR-CON-02 | Must | AC-CON-1 | A14 | 09 |
| FR-CON-03 | Must | AC-CON-1 | A14 | 09 |
| FR-CON-04 | Must | AC-CON-2, AC-CON-3 | Audit §11 | 09 |
| FR-CON-05 | Must | AC-CON-4 | NFR-SEC-07 | 09 |
| FR-CON-06 | Should | AC-Q-15 | NFR-BRW-03 | 09 |
| FR-CON-07 | Could | — | Usability | 09 |
| FR-SOC-01 | Must | AC-CON-5, AC-Q-1 | A5, D4 | 07 |
| FR-SOC-02 | Must | AC-PRJ-4 (pattern) | NFR-MNT-03 | 05/06 |
| FR-THM-01 | Must | AC-THM-1 | D8 | 09 |
| FR-THM-02 | Must | AC-THM-2 | D8 | 09 |
| FR-THM-03 | Must | AC-THM-3 | Audit §5 | 09, 10 |
| FR-THM-04 | Should | AC-THM-1 (manual) | D8 | 09 |
| FR-INT-01 | Must | AC-Q-3 | A4–A6, A9 | 10 |
| FR-INT-02 | Must | AC-INT-1 | A10 | 09, 10 |
| FR-INT-03 | Must | AC-INT-2 | A1, A2 | 09 |
| FR-INT-04 | Must | AC-INT-3 | A11, P8 | 06 |
| FR-INT-05 | Should | AC-Q-3 | [S] | 09 |
| FR-INT-06 | Could | AC-INT-1, AC-INT-2 | REF | 09 |
| FR-FTR-01 | Must | AC-Q-16 | [S] | 07 |
| FR-ERR-01 | Should | AC-Q-1 | Audit §4 | 11 |
| NFR-A11Y-01…12 | Must / Should | AC-Q-1 … AC-Q-5, AC-CON-1 | GI, A1–A14 | 10 |
| NFR-PERF-01…09 | Must / Should | AC-Q-6 … AC-Q-8 | P1–P8 | 11 |
| NFR-SEO-01…09 | Must / Should | AC-Q-9 | Audit §4 | 11, 12 |
| NFR-SEC-01…09 | Must / Should | AC-Q-10 … AC-Q-12 | Audit §8, D21 | 11, 12 |
| NFR-MNT-01…09 | Must / Should | AC-Q-11, AUTO-CI | GI | 06 onward |
| NFR-RSP-01…06 | Must / Should | AC-HERO-1, AC-Q-13 | Audit §7 | 10 |
| NFR-BRW-01…04 | Must / Should | AC-Q-14, AC-Q-15 | — | 10, 11 |
