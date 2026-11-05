# Functional Requirements

**Phase:** 03 — Requirements & Content Specification
**Date:** 2026-11-03

## Conventions

- **ID format:** `FR-<AREA>-<NN>`
- **Priority (MoSCoW):**
  - **Must:** required for launch.
  - **Should:** important; launch is possible without it if logged.
  - **Could:** desirable, decided in Phase 04.
  - **Won't:** explicitly out of scope for v1.
- **Source:** the justification. Audit finding IDs (A#, P#, C#) refer to [WEBSITE_AUDIT.md](../audit/WEBSITE_AUDIT.md); decision IDs (D#) refer to [PRD.md §8](PRD.md#8-decisions); `[S]` means feature parity with the live site; `REF` means [REFERENCE_DESIGN_ANALYSIS.md](../audit/REFERENCE_DESIGN_ANALYSIS.md).
- **Content:** all displayed content comes from [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md). Scenario tests are in [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md).

## Areas

| Area | Prefix | Count |
|---|---|---|
| Navigation | NAV | 6 |
| Hero | HERO | 2 |
| About | ABT | 1 |
| Services | SRV | 1 |
| Resume (experience, skills, certifications, education, CV) | RES | 7 |
| Projects | PRJ | 7 |
| Hire CTA | CTA | 1 |
| Testimonials | TST | 1 |
| Contact | CON | 7 |
| Social links | SOC | 2 |
| Theme | THM | 4 |
| Accessible interactions | INT | 6 |
| Footer and error page | FTR / ERR | 2 |
| Won't have (v1) | WONT | — |

---

## 1. Responsive navigation (NAV)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-NAV-01 | A header is visible at all scroll positions. It contains the owner's name (linking to `#top`), the primary navigation, the theme toggle and a Download CV link. | Must | • Header stays visible while scrolling<br>• The name link scrolls to the top<br>• Nav items in order: About, Services, Experience, Skills, Projects, Testimonials, Contact (D15)<br>• Download CV is reachable from the header at every breakpoint | FR-RES-06, FR-THM-02, Phase 04 layout | [S], D15 |
| FR-NAV-02 | On narrow viewports the nav collapses behind a menu button that opens an overlay menu. | Must | • The button has an accessible name ("Open menu" / "Close menu"), `aria-expanded` and `aria-controls`<br>• When the menu opens, focus moves to its first item and is contained within the menu<br>• `Esc`, the close button and selecting a link all close it; focus returns to the toggle (except after link navigation, when focus moves to the target section)<br>• Background content does not scroll while the menu is open<br>• The menu contains the nav items, Download CV and social links | NFR-A11Y-05, Phase 04 breakpoint | A4, [S], REF (Adapt) |
| FR-NAV-03 | A "Skip to main content" link is the first focusable element. | Must | • Visible on focus<br>• Activating it moves focus to `<main>` | — | A7 |
| FR-NAV-04 | The nav item of the section currently in view is indicated. | Should | • The matching nav link gets `aria-current="true"` and a visible style<br>• Updates on scroll without janky re-renders (IntersectionObserver) | FR-NAV-01 | [S] (scrollspy) |
| FR-NAV-05 | In-page navigation lands each section heading fully visible below the sticky header. | Must | • After activating any nav link, the section heading is not covered by the header (WCAG 2.4.11)<br>• Scrolling is smooth only when reduced motion is not preferred<br>• The URL hash updates to the section anchor | FR-INT-02 | WCAG 2.4.11, [S] |
| FR-NAV-06 | Legacy anchors from the old site resolve to the matching new sections. | Could | • `#home → #top`, `#resume → #experience`, `#portfolio → #projects`, `#testimonial → #testimonials` | — | [S] (inbound link continuity) |

## 2. Hero (HERO)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-HERO-01 | The hero shows the name as the page's single `<h1>`, the static title, the location and two calls to action. | Must | • `<h1>` contains "Mohd Shahrukh"<br>• The title "Software Development Engineer \| Frontend" is static text with no typing animation (D12)<br>• The line "Based in Bangalore, Karnataka, India." is shown (D14)<br>• "View My Work" goes to `#projects`; "Contact Me" goes to `#contact`<br>• The content is fully visible at 320 px with no horizontal scroll | NFR-RSP-01 | A1, A8, D12, D14, responsive finding (375 px overflow) |
| FR-HERO-02 | The owner's portrait is shown in or near the hero. | Should | • Uses the optimised `headshot` asset with descriptive alt text "Portrait of Mohd Shahrukh"<br>• It is the LCP candidate if above the fold, so it is prioritised (not lazy-loaded)<br>• No layout shift while it loads | NFR-PERF-01/02/06, Phase 04 placement | [S] |

## 3. About (ABT)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-ABT-01 | The About section presents the executive summary, the years-of-experience stat and profile links. | Must | • Summary text matches `profile.summary` word for word<br>• Stat shows "6+ Years of Experience"<br>• GitHub and LinkedIn links present (FR-SOC-01 rules apply)<br>• No availability or "targeting" statement (D1, D13) | CONTENT_SCHEMA `Profile` | [R], D1, D13 |

## 4. Services (SRV)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-SRV-01 | The Services section lists the 4 services with title, description and a decorative icon. | Must | • 4 items in order: Web Design, Frontend Engineering, Accessibility & Compliance, Testing & QA<br>• Text matches `services[]` word for word (D20)<br>• Icons are decorative (`aria-hidden="true"`)<br>• Each title is an `<h3>` | CONTENT_SCHEMA `Service` | [S], D20 |

## 5. Resume and certification presentation (RES)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-RES-01 | The Experience section lists 3 roles in reverse-chronological order. | Must | • Each role shows company (with "formerly PropShare" note for AltInvest), role, location, date range and tagline (if any)<br>• Dates render as `MMM YYYY – MMM YYYY` inside `<time datetime="YYYY-MM">`<br>• AltInvest: May 2024 – Oct 2026 (D1); BrandSystems: Dec 2021 – Apr 2024; SOSUDATECH: Sep 2020 – Nov 2021<br>• All highlights (11 / 4 / 2) shown word for word as a `<ul>`<br>• Each role heading is an `<h3>` | CONTENT_SCHEMA `Experience` | [R], D1, C6, C7 |
| FR-RES-02 | Long highlight lists can be collapsed to aid scanning. | Could | • If adopted: the first N highlights are visible and a "Show all N highlights" button (`aria-expanded`) reveals the rest<br>• Without JS, all highlights are visible<br>• Decided in Phase 04 | FR-RES-01, Phase 04 | REF (Adopt: accordion) |
| FR-RES-03 | The Skills section shows the 9 skill groups as labelled lists, without percentages. | Must | • 9 groups in [R] order, items word for word<br>• Group label as `<h3>`, items as a list<br>• No progress bars or percentages anywhere (D5) | CONTENT_SCHEMA `SkillGroup` | [R], D5, C10, C11 |
| FR-RES-04 | The Certifications section lists 3 certifications with name and issuer. | Must | • IBM Full Stack Software Developer — IBM / Coursera (Professional Certificate); JavaScript: The Complete Guide — Udemy; React — The Complete Guide (incl. Next.js, Redux) — Udemy (D3)<br>• No dates or credential links unless present in content (none currently) | CONTENT_SCHEMA `Certification` | [R], [S], D3 |
| FR-RES-05 | The Education section lists the B.Tech only. | Must | • "B.Tech, Electronics & Communication Engineering", "Bipin Tripathi Kumaon Institute of Technology, Dwarahat", "Graduated 2019"<br>• No Diploma or Intermediate entries (D2) | CONTENT_SCHEMA `Education` | [R], D2 |
| FR-RES-06 | Visitors can download the current CV (03 Nov 2026 PDF). | Must | • Link points to the PDF served from the site (D7)<br>• Accessible name includes format and size, e.g. "Download CV (PDF, 72 KB)"<br>• Available in the header (FR-NAV-01) and in at least one content section (Experience or About)<br>• Returns HTTP 200 with `Content-Type: application/pdf`<br>• Downloaded filename contains "Mohd_Shahrukh" and the date | Phase 06 (copy PDF into repo) | D7, ASSET_INVENTORY §2 |
| FR-RES-07 | Section ordering for resume content. | Must | • Order: Experience → Skills → Certifications → Education (PRD §7)<br>• Certifications and Education have their own `<h2>` and anchors but are not nav items | PRD §7 | D15 |

## 6. Portfolio project browsing and detail behaviour (PRJ)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-PRJ-01 | The Projects section shows all 10 projects as cards. | Must | • 10 cards in the order of `projects[]`<br>• Each card shows image, title (`<h3>`), subtitle and group label<br>• Card content matches CONTENT_SCHEMA | CONTENT_SCHEMA `Project`, FR-PRJ-06 | [S], D6 |
| FR-PRJ-02 | Visitors can filter projects by group. | Must | • Filter controls: All (default), Enterprise products, Websites (D10)<br>• Controls are `<button>`s with `aria-pressed`, or a radio group; the current state is announced<br>• The visible count is announced politely (`aria-live="polite"`), e.g. "Showing 3 of 10 projects"<br>• Filtering happens instantly without reload and preserves keyboard focus on the control<br>• Without JS, all projects are visible and the filter controls are hidden | FR-PRJ-01 | [S], C12, A9, D10 |
| FR-PRJ-03 | Projects link out only when a verified live URL exists. | Must | • A link is rendered only when `linkStatus = "live"` (currently only SOSUDATECH Pvt. Ltd.)<br>• The link has descriptive text, e.g. "Visit SOSUDATECH Pvt. Ltd. website", and indicates that it opens a new tab (visually hidden text "(opens in new tab)")<br>• `target="_blank"` with `rel="noopener noreferrer"`<br>• No empty anchors; no link to `#` or to the page itself | CONTENT_SCHEMA `Project.url`, NFR-SEC-04 | Audit §3 (#1–#7), A6, D6 |
| FR-PRJ-04 | Projects without a public link communicate their state appropriately. | Must | • Projects 1–3 show the note "Internal product — no public link" (D11)<br>• Projects 4 and 6–10 show no link and no note until a URL is supplied (D6)<br>• Supplying a URL and setting `linkStatus = "live"` in content is the only change needed to show the link | CONTENT_SCHEMA | D6, D11 |
| FR-PRJ-05 | Project details are shown on the card; there are no detail pages or modals. | Must | • Optional fields (`description`, `date`, `stack`, `role`) render on the card only when present<br>• Currently only SOSUDATECH has `date` (Nov 2020) and `stack`<br>• No routes like `/projects/[slug]`; no dialogs | CONTENT_SCHEMA | D9, CONTENT_INVENTORY §12.2 |
| FR-PRJ-06 | Project images display consistently and accessibly. | Must | • All images sit in a fixed-ratio frame (ratio set in Phase 04) using `object-fit` so 16:9 and 375×393 images align<br>• Explicit dimensions, so no layout shift<br>• Lazy-loaded below the fold; responsive sizes<br>• Alt text from content (`image.alt`); blurred images described as blurred | NFR-PERF-06, NFR-A11Y-07, Phase 04 | ASSET_INVENTORY §1, P1–P4 |
| FR-PRJ-07 | Linked cards have a hover and focus affordance. | Could | • Subtle visual change on `:hover` **and** `:focus-visible`<br>• No movement when reduced motion is preferred<br>• No layout shift | FR-INT-02 | REF (Adapt: hover zoom) |

## 7. Hire CTA (CTA)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-CTA-01 | A call-to-action band invites contact. | Must | • Heading "Interested in working with me?"<br>• "Call Me!" is a `tel:+919760787661` link (D19)<br>• "Hire Me!" goes to `#contact`<br>• No parallax effect when reduced motion is preferred (or none at all; Phase 04) | FR-INT-02 | [S], D19 |

## 8. Testimonials (TST)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-TST-01 | Both testimonials are shown statically. | Must | • 2 items, each a `<figure>` with a `<blockquote>` (quote word for word) and a `<figcaption>` (name and role)<br>• Photo shown with alt "Photo of {name}"<br>• No autoplay or carousel (A2); both visible without interaction<br>• No company names (D18) | CONTENT_SCHEMA `Testimonial` | [S], A2, D18 |

## 9. Contact form and details (CON)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-CON-01 | The Contact section shows contact details. | Must | • Heading "Let's get in touch" and the intro paragraph word for word<br>• Location "Bangalore, Karnataka, India" (D14)<br>• Phone "(+91) 9760787661" as a `tel:` link; email as a `mailto:` link<br>• No second phone and no Twitter (D4) | CONTENT_SCHEMA `Contact` | [S], D4, D14 |
| FR-CON-02 | A contact form collects name, email and message. | Must | • Heading "Send Me a Message"<br>• Visible labels: "What is Your Name", "Your Email Address", "How can I Help you?"<br>• All three fields are required, and the requirement is indicated in text, not by colour alone<br>• `autocomplete="name"` and `autocomplete="email"`; `type="email"` | CONTENT_SCHEMA `ContactForm` | [S], A14 |
| FR-CON-03 | The form validates input with accessible inline errors. | Must | • On submit, invalid fields get `aria-invalid="true"` and an error message linked by `aria-describedby`<br>• Focus moves to the first invalid field<br>• After the first submit attempt, errors update on input or blur<br>• Rules: name required, 1–100 chars; email required and a valid format, ≤ 254 chars; message required, 1–5000 chars; whitespace trimmed | — | A14, NFR-A11Y-09 |
| FR-CON-04 | The form submits asynchronously with clear status feedback, without leaving the page. | Must | • The submit button shows a "Sending…" state and is disabled while pending (no double submits)<br>• On success: a status message (`role="status"`) and the form resets<br>• On failure: an error message (`role="alert"`) offering the email address as a fallback; the user's input is preserved<br>• No navigation to a third-party page | Phase 05 (provider) | Audit §11 (Formspree redirects away), A14 |
| FR-CON-05 | The form resists spam. | Must | • A honeypot field, hidden from users and assistive technology, causes silent rejection when filled<br>• Provider-side spam filtering enabled<br>• No CAPTCHA that blocks accessibility | Phase 05 (provider) | NFR-SEC-07 |
| FR-CON-06 | The form works without JavaScript. | Should | • With JS disabled, submitting performs a standard POST to the provider and the message is delivered | Phase 05 | Progressive enhancement (NFR-BRW-03) |
| FR-CON-07 | Message length feedback. | Could | • A live character count for the message field (e.g. "120 / 5000"), announced only on demand (not on every keystroke) | FR-CON-03 | Usability |

## 10. Social links (SOC)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-SOC-01 | Social and profile links are provided: LinkedIn, GitHub, Email. | Must | • Shown in the Contact section and footer; LinkedIn and GitHub also in About; all three in the mobile menu<br>• Icon-only links have accessible names ("LinkedIn profile", "GitHub profile", "Email Mohd Shahrukh")<br>• External links open in a new tab with `rel="noopener noreferrer"` and announce it<br>• Twitter/X is not shown (D4) | CONTENT_SCHEMA `SocialLink` | [S], A5, D4 |
| FR-SOC-02 | Social URLs come from a single content source. | Must | • Changing a URL in one place updates every occurrence | NFR-MNT-03 | Maintainability |

## 11. Theme support (THM)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-THM-01 | The site supports light and dark themes. | Must | • Both themes cover every component and state<br>• On first visit the theme follows `prefers-color-scheme` | Phase 04 tokens | D8, Audit §9 (no dark mode) |
| FR-THM-02 | A theme toggle lets users choose a theme, and the choice persists. | Must | • The toggle in the header is a `<button>` with an accessible name reflecting the action (e.g. "Switch to dark theme") or `aria-pressed`<br>• The choice is stored in `localStorage` and applied on return visits<br>• No flash of the wrong theme on load (theme applied before first paint)<br>• If storage is unavailable, the toggle still works for the session | NFR-PERF-03 | D8 |
| FR-THM-03 | Both themes meet contrast requirements. | Must | • All text and UI meets NFR-A11Y-04 in both themes<br>• Brand yellow `#f5df4e` is never used as text on light backgrounds (1.35:1) | NFR-A11Y-04, Phase 04 | Audit §5 contrast table |
| FR-THM-04 | The theme follows live system changes until the user chooses one explicitly. | Should | • Changing the OS theme updates the site immediately while no stored choice exists | FR-THM-01 | D8 |

> **Superseded (2026-11-05):** FR-THM-01–04 are withdrawn. The site is dark only ([ADR 0014](../architecture/adr/0014-dark-only-theme-and-andika.md)), and AC-Q contrast is checked against the single dark palette.

## 12. Accessible interactions (INT)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-INT-01 | Every interactive element is keyboard-operable and has a visible focus indicator. | Must | • Tab order follows the visual order<br>• Focus indicator meets NFR-A11Y-05<br>• No keyboard traps (the open menu contains focus but `Esc` exits) | NFR-A11Y-05 | A4–A6, A9 |
| FR-INT-02 | Motion respects user preferences. | Must | • With `prefers-reduced-motion: reduce`, entrance animations, smooth scrolling, parallax, hover zoom and any marquee are disabled or replaced by instant transitions | — | A10 |
| FR-INT-03 | No content moves, blinks or auto-updates for more than 5 s without a pause/stop control. | Must | • No auto-advancing carousel or infinite typing animation<br>• Any looping animation (e.g. a marquee) has a visible pause control | — | A1, A2 (WCAG 2.2.2) |
| FR-INT-04 | Content renders immediately without a preloader and does not depend on animations to become visible. | Must | • No full-screen loader<br>• With JS disabled or animations off, all content is visible | — | A11, P8 |
| FR-INT-05 | A Back-to-top control appears after scrolling. | Should | • Appears after the user scrolls past the hero<br>• Real link to `#top` with an accessible name; focus moves to the top of the page<br>• Respects reduced motion | FR-INT-02 | [S] |
| FR-INT-06 | A keyword marquee built from the skill groups. | Could | • If adopted (Phase 04): content from `skillGroups`; duplicate text `aria-hidden`; visible pause control; stops under reduced motion; no information exists only in the marquee | FR-INT-02/03 | REF (Adapt: marquee) |

## 13. Footer and error page (FTR / ERR)

| ID | Description | Priority | Acceptance criteria | Dependencies | Source |
|---|---|---|---|---|---|
| FR-FTR-01 | The footer shows copyright, credit and social links. | Must | • "Copyright © {current year} Mohd Shahrukh. All Rights Reserved." (year computed at build time)<br>• "Designed by Mohd Shahrukh" as plain text (no `href="#"`)<br>• Social links per FR-SOC-01 | — | [S], audit §3 #13 |
| FR-ERR-01 | Unknown URLs show a custom 404 page. | Should | • HTTP status 404<br>• Same header, footer and theme; a heading and a link back to the home page<br>• `noindex` | NFR-SEO-09 | Audit §4 (default host 404) |

## 14. Won't have in v1 (WONT)

Each item below lacks a justified requirement, or was rejected by an owner decision or the audit.

| Item | Reason |
|---|---|
| Project detail pages or modals | D9; no detailed content |
| Typing headline animation | D12, A1 |
| Testimonial carousel or autoplay | A2; only 2 items |
| Skill percentage bars | D5 |
| Preloader, custom cursor, magnetic effects, scroll hijacking | A11, P8, REF (Avoid) |
| Analytics or tracking | D21 |
| Blog, CMS, i18n, newsletter, chat widget | No content or need (PRD §4) |
| Personal gallery, client logo wall | No content or assets (REF §7) |
| New projects (mohdshahrukh.in, PropShare Titania) | D17 (schema supports later addition) |
| Twitter/X link, second phone number | D4 |
