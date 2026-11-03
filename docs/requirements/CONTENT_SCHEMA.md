# Content Schema

**Phase:** 03 — Requirements & Content Specification
**Date:** 2026-11-03

This document defines **what content the site holds, its shape, and where each value comes from**. It is format-agnostic. Phase 05 turns it into TypeScript types and chooses the file format. Implementation must satisfy NFR-MNT-03, which requires one typed content source.

**Rules**

1. Every value traces to a source:
   - `[R]`: resume of 03 Nov 2026
   - `[S]`: live site
   - `D#`: an owner decision
   - `UI`: new functional interface copy (see §13)
2. Verbatim text lives in [CONTENT_INVENTORY.md](../audit/CONTENT_INVENTORY.md), and this schema references its sections. If the two disagree, the owner decisions in [PRD.md §8](PRD.md#8-decisions) win.
3. Optional fields are **omitted** when no verified value exists. Nothing is invented to fill a field.
4. Field types:
   - `string`: plain text
   - `RichText`: text that may contain `**bold**` emphasis only, following [R] styling
   - `YearMonth`: `YYYY-MM`
   - `Url`: absolute `https://` URL
   - `Path`: site-relative path

---

## 1. `SiteMeta`

| Field | Type | Req. | Value / source | Validation |
|---|---|---|---|---|
| `title` | string | ✓ | "Mohd Shahrukh \| Software Development Engineer – Frontend" `[S]` | ≤ 70 chars |
| `description` | string | ✓ | Draft below (derived only from [R] facts) | ≤ 160 chars |
| `canonicalUrl` | Url | ✓ | `https://mohdshahrukh.in/` | Trailing slash |
| `locale` | string | ✓ | `en` | BCP 47 |
| `ogImage` | Image | ✓ | 1200×630, built from existing assets. **Generated in Phase 11** (`app/opengraph-image.tsx`); Phase 06 emits the title, description, canonical URL and Open Graph/Twitter text only | Absolute URL when emitted |
| `themeColor` | {light, dark} | ✓ | Phase 04 tokens | — |

**Draft description:** "Mohd Shahrukh — Software Development Engineer | Frontend with 6+ years building fintech, proptech and enterprise web apps in React.js, Next.js and TypeScript." Every fact in it comes from [R]. The owner approves it in this PR.

## 2. `Profile`

| Field | Type | Req. | Value / source |
|---|---|---|---|
| `name` | string | ✓ | "Mohd Shahrukh" `[R][S]` |
| `title` | string | ✓ | "Software Development Engineer \| Frontend" `[R]`, D12 |
| `location` | string | ✓ | "Bangalore, Karnataka, India" `[R]`, D14 |
| `heroLocationLine` | string | ✓ | "Based in Bangalore, Karnataka, India." `[S]` |
| `summary` | string | ✓ | [R] executive summary, word for word ([CONTENT_INVENTORY §6.1](../audit/CONTENT_INVENTORY.md#61-current--r-executive-summary-)) |
| `yearsOfExperience` | string | ✓ | "6+" `[R]`. Stored as a string, not computed from dates. |
| `portrait` | Image | ✓ | `headshot` (ASSET_INVENTORY #3); alt "Portrait of Mohd Shahrukh" |
| `cv` | Document | ✓ | See §11 |

Excluded: the typed roles (D12), "Targeting SDE-2 / Senior Frontend roles." (D13), the About sub-heading "Hi, I'm Mohd Shahrukh" (it duplicates the `<h1>`; Phase 04 may reinstate it).

## 3. `NavItem[]`

| Order | `label` | `href` | Source |
|---|---|---|---|
| 1 | About | `#about` | D15 |
| 2 | Services | `#services` | D15 |
| 3 | Experience | `#experience` | D15 |
| 4 | Skills | `#skills` | D15 |
| 5 | Projects | `#projects` | D15 |
| 6 | Testimonials | `#testimonials` | D15 |
| 7 | Contact | `#contact` | D15 |

Plus a header action: Download CV (§11).

## 4. `Section` headings

| Section id | `eyebrow` (matches nav, D15) | `heading` (`<h2>`) | Source of heading |
|---|---|---|---|
| `about` | About | Know Me More | `[S]` |
| `services` | Services | How I Can Help Your Next Project | `[S]` |
| `experience` | Experience | My Experience | `[S]` |
| `skills` | Skills | My Skills | `[S]` |
| `certifications` | — | Certifications | `[S]` |
| `education` | — | My Education | `[S]` |
| `projects` | Projects | Some Of My Most Recent Projects | `[S]` |
| `testimonials` | Testimonials | What My Colleagues Say | `[S]` |
| `contact` | Contact | Let's get in touch | `[S]` |

Hero calls to action: "View My Work" → `#projects` and "Contact Me" → `#contact` `[S]`.

## 5. `Service[]`

| Field | Type | Req. |
|---|---|---|
| `title` | string | ✓ |
| `description` | string | ✓ |
| `icon` | IconKey | ✓ (decorative) |

Instances: 4, word for word per D20 ([CONTENT_INVENTORY §7](../audit/CONTENT_INVENTORY.md#7-services--what-i-do-services-s-)). Icon keys (`desktop`, `pencil-ruler`, `universal-access`, `vial`) express intent only; the icon set is chosen in Phase 04.

## 6. `Experience[]`

| Field | Type | Req. | Notes |
|---|---|---|---|
| `id` | slug | ✓ | `altinvest`, `brandsystems`, `sosudatech` |
| `company` | string | ✓ | |
| `companyNote` | string | — | Only for AltInvest: "formerly PropShare" |
| `role` | string | ✓ | |
| `location` | string | ✓ | |
| `start` | YearMonth | ✓ | |
| `end` | YearMonth | ✓ | No "Present" (D1) |
| `tagline` | string | — | |
| `highlights` | RichText[] | ✓ | Word for word, in order |

| `id` | company | companyNote | role | location | start | end | tagline | highlights |
|---|---|---|---|---|---|---|---|---|
| `altinvest` | AltInvest Online Platform | formerly PropShare | Software Development Engineer | Bangalore | 2024-05 | 2026-10 | India's SEBI-regulated SM REIT investment platform | 11 ([CONTENT_INVENTORY §8.1](../audit/CONTENT_INVENTORY.md#81-altinvest-online-platform-formerly-propshare--bangalore)) |
| `brandsystems` | BrandSystems India Pvt. Ltd. | — | Web Developer | Bangalore | 2021-12 | 2024-04 | — | 4 ([§8.2](../audit/CONTENT_INVENTORY.md#82-brandsystems-india-pvt-ltd--bangalore)) |
| `sosudatech` | SOSUDATECH Pvt. Ltd. | — | UI/UX Developer | Noida | 2020-09 | 2021-11 | — | 2 ([§8.3](../audit/CONTENT_INVENTORY.md#83-sosudatech-pvt-ltd--noida)) |

Source: `[R]`, D1. Display format: `MMM YYYY – MMM YYYY` (e.g. "May 2024 – Oct 2026").

## 7. `SkillGroup[]`

| Field | Type | Req. | Notes |
|---|---|---|---|
| `label` | string | ✓ | |
| `skills` | string[] | ✓ | Word for word |
| `context` | string | — | Trailing qualifier from [R] |

| # | label | skills | context |
|---|---|---|---|
| 1 | Frontend | React.js, Next.js, JavaScript (ES6+), TypeScript, HTML5, CSS3, SCSS/SASS, Tailwind CSS, Bootstrap 5, responsive UI | — |
| 2 | State & APIs | Redux Toolkit, React Query (TanStack Query), REST APIs, async request handling | — |
| 3 | Testing | Jest, React Testing Library, Playwright | unit, component, UI/API integration and end-to-end testing |
| 4 | Architecture | Reusable React components, component libraries, design systems, frontend architecture, code reviews | — |
| 5 | Performance & Accessibility | Lighthouse, Core Web Vitals, API request optimization, image optimization, WCAG 2.1 AA, ARIA, keyboard navigation, screen-reader support | — |
| 6 | Frontend Security | SSO, token lifecycle handling, session management, secure redirects | — |
| 7 | Cloud & Delivery | AWS S3, CloudFront, Docker, Vite, Git, GitHub/GitLab/Bitbucket, CI/CD collaboration, frontend release coordination, Agile/Scrum | — |
| 8 | AI-Assisted Development | Claude Code, Codex | feature development, test-case writing, PR and code reviews |
| 9 | Design | Figma, Balsamiq, wireframing, prototyping, usability feedback | — |

Source: `[R]`, D5. There is **no** proficiency or percentage field.

## 8. `Certification[]`

| Field | Type | Req. |
|---|---|---|
| `name` | string | ✓ |
| `issuer` | string | ✓ |
| `credentialType` | string | — |
| `issued` | YearMonth | — (no verified value) |
| `credentialUrl` | Url | — (no verified value) |

| # | name | issuer | credentialType | Source |
|---|---|---|---|---|
| 1 | IBM Full Stack Software Developer | IBM / Coursera | Professional Certificate | `[R][S]` |
| 2 | JavaScript: The Complete Guide | Udemy | — | `[S]`, D3 |
| 3 | React — The Complete Guide (incl. Next.js, Redux) | Udemy | — | `[R]` |

## 9. `Education[]`

| Field | Type | Req. | Value |
|---|---|---|---|
| `degree` | string | ✓ | B.Tech, Electronics & Communication Engineering |
| `institution` | string | ✓ | Bipin Tripathi Kumaon Institute of Technology, Dwarahat |
| `graduated` | number (year) | ✓ | 2019 |

Source: `[R]`, D2. One entry only.

## 10. `Project[]`

| Field | Type | Req. | Notes |
|---|---|---|---|
| `id` | slug | ✓ | Stable key |
| `title` | string | ✓ | `[S]` (D16 for #1) |
| `subtitle` | string | ✓ | `[S]` category line (typo fixes allowed) |
| `group` | `"enterprise"` \| `"website"` | ✓ | D10 |
| `image` | Image | ✓ | ASSET_INVENTORY #8–17 |
| `linkStatus` | `"live"` \| `"pending"` \| `"none"` | ✓ | Controls link rendering (FR-PRJ-03/04) |
| `url` | Url | when `live` | Must be verified as returning HTTP 200 before being set to `live` |
| `note` | string | — | D11 for `none` |
| `description` | string | — | Owner-supplied only (Q8) |
| `date` | string | — | Verified only |
| `stack` | string[] | — | Verified only |
| `role` | string | — | Owner-supplied only |
| `relatedExperienceId` | slug | — | Only where [R] states the relationship |

Group labels: `enterprise` → "Enterprise products"; `website` → "Websites" (D10).

| # | id | title | subtitle | group | linkStatus | url | note | Extra verified fields |
|---|---|---|---|---|---|---|---|---|
| 1 | `digital-asset-management` | Digital Asset Management | Marketing Resource Management (MRM) | enterprise | none | — | Internal product — no public link | — |
| 2 | `approval-software-management` | Approval Software Management | Collaborate - Approval & Review Workflows | enterprise | none | — | Internal product — no public link | — |
| 3 | `campaign-management` | Campaign Management | LAM - Campaign Management Software | enterprise | none | — | Internal product — no public link | `relatedExperienceId: brandsystems` ([R] names LAM at BrandSystems) |
| 4 | `job-listing-website` | Job Listing Website | Latest Jobs, Results, & more... | website | pending | — | — | — |
| 5 | `sosudatech` | SOSUDATECH Pvt. Ltd. | Education | website | **live** | `https://www.sosudatech.com/` | — | `date: "Nov 2020"`, `stack: [HTML5, CSS3, JavaScript, jQuery, Bootstrap 4.5, Photoshop]` ([R] Projects) |
| 6 | `virtual-university` | Virtual University | Education | website | pending | — | — | — |
| 7 | `quickcashtx` | QuickCashTx | Banking & Fund Transfer | website | pending | — | — | — |
| 8 | `niles-academy` | Niles Academy | Education & Teaching | website | pending | — | — | — |
| 9 | `swiss-cosmetics` | Swiss Cosmetics | Beauty & Fashion | website | pending | — | — | — |
| 10 | `frontier-mining-solutions` | Frontier Mining Solutions | Mining Services | website | pending | — | — | — |

**Image alt text.** This is new descriptive text, derived only from the verified titles:

| # | alt |
|---|---|
| 1 | Blurred screenshot of the Digital Asset Management platform |
| 2 | Blurred screenshot of the Approval Software Management (Collaborate) application |
| 3 | Blurred screenshot of the LAM campaign management software |
| 4 | Screenshot of the SarkariJobKhoj job listing website |
| 5 | Screenshot of the SOSUDATECH Pvt. Ltd. website |
| 6 | Screenshot of the Virtual University website |
| 7 | Screenshot of the QuickCashTx banking and fund transfer app |
| 8 | Screenshot of the Niles Academy website |
| 9 | Screenshot of the Swiss Cosmetics website |
| 10 | Screenshot of the Frontier Mining Solutions website |

The old dead URLs are kept in [CONTENT_INVENTORY §12](../audit/CONTENT_INVENTORY.md#12-portfolio-projects-portfolio) for reference only. They are **not** content values. New URLs arrive through Q11.

## 11. `Document` (CV)

| Field | Type | Req. | Value |
|---|---|---|---|
| `path` | Path | ✓ | e.g. `/Mohd_Shahrukh_Resume_03_Nov_2026.pdf` (final path set in Phase 05/06) |
| `label` | string | ✓ | "Download CV" |
| `format` | string | ✓ | "PDF" |
| `sizeLabel` | string | ✓ | "72 KB" (the actual file size, recalculated whenever the file changes) |
| `updated` | YearMonth | ✓ | 2026-11 |

Source: D7 (`C:\Users\saurabh bhatt\Downloads\Mohd_Shahrukh_Resume_03_nov_2026.pdf`).

## 12. `Testimonial[]`, `CtaBand`, `Contact`, `SocialLink[]`, `Footer`

### `Testimonial[]`

| Field | Type | Req. |
|---|---|---|
| `quote` | string | ✓ |
| `name` | string | ✓ |
| `role` | string | ✓ |
| `photo` | Image | ✓ |
| `company` | string | — (omitted, D18) |

Instances: Sowmit Nag ("Sr. Web Designer \| Co-Owner") and Divesh Kumar ("CTO \| Technology Evangelist"), with quotes word for word ([CONTENT_INVENTORY §14](../audit/CONTENT_INVENTORY.md#14-testimonials-testimonial-s-)). Typographic clean-up only, such as removing the stray space after the opening quote. Photo alt: "Photo of {name}".

### `CtaBand`

- **heading:** "Interested in working with me?" `[S]`
- **actions:**
  - "Call Me!" → `tel:+919760787661` (D19)
  - "Hire Me!" → `#contact` `[S]`

### `Contact`

| Field | Value | Source |
|---|---|---|
| `intro` | "I enjoy discussing new projects and design challenges. Please share as much info as possible so we can get the most out of our first catch-up." | `[S]` |
| `location` | Bangalore, Karnataka, India | D14 |
| `phone.display` | (+91) 9760787661 | `[S][R]`, D4 |
| `phone.tel` | `+919760787661` | — |
| `email` | khan.shahrukh156@gmail.com | `[S][R]` |
| `form.heading` | Send Me a Message | `[S]` |
| `form.fields` | name: "What is Your Name" · email: "Your Email Address" · message: "How can I Help you?" | `[S]` (trailing colons dropped) |
| `form.submitLabel` | Send | `[S]` |
| `form.endpoint` | Provider URL | Phase 05 |

### `SocialLink[]`

| id | label (accessible name) | url |
|---|---|---|
| `linkedin` | LinkedIn profile | `https://www.linkedin.com/in/mohd-shah-rukh-703aa3153/` |
| `github` | GitHub profile | `https://github.com/Srk0o007` |
| `email` | Email Mohd Shahrukh | `mailto:khan.shahrukh156@gmail.com` |

Twitter/X is excluded (D4).

### `Footer`

| Field | Value | Source |
|---|---|---|
| `copyright` | "Copyright © {year} Mohd Shahrukh. All Rights Reserved." | `[S]`; year computed at build time |
| `credit` | "Designed by Mohd Shahrukh" | `[S]` |

## 13. `UiCopy`: new functional interface text

This is new text needed for functionality and accessibility. It contains **no personal claims**, and the owner approves it in this PR.

| Key | Text |
|---|---|
| `skipLink` | Skip to main content |
| `menuOpen` / `menuClose` | Open menu / Close menu |
| `themeToDark` / `themeToLight` | Switch to dark theme / Switch to light theme |
| `cvAccessibleSuffix` | (PDF, {size}) |
| `newTab` | (opens in new tab) |
| `filterAll` / `filterEnterprise` / `filterWebsites` | All / Enterprise products / Websites |
| `filterStatus` | Showing {n} of {total} projects |
| `projectLink` | Visit {title} website |
| `projectInternalNote` | Internal product — no public link (D11) |
| `required` | (required) |
| `errName` | Please enter your name. |
| `errEmail` | Please enter a valid email address. |
| `errMessage` | Please enter a message. |
| `errTooLong` | Please shorten this to {max} characters or fewer. |
| `sending` | Sending… |
| `sendSuccess` | Thank you! Your message has been sent. |
| `sendError` | Sorry, your message couldn't be sent. Please try again or email khan.shahrukh156@gmail.com. |
| `backToTop` | Back to top |
| `highlightsMore` / `highlightsLess` | Show all {n} highlights / Show fewer highlights (only if FR-RES-02 is adopted) |
| `marqueePause` / `marqueePlay` | Pause animation / Play animation (only if FR-INT-06 is adopted) |
| `notFoundHeading` | Page not found |
| `notFoundText` | The page you're looking for doesn't exist. |
| `notFoundLink` | Back to home |
| `statLabel` | Years of Experience (`[S]`) |
| `errorHeading` | Something went wrong (added in Phase 06 for the error boundaries) |
| `errorText` | This page could not be displayed. Please try again. (Phase 06) |
| `errorRetry` | Try again (Phase 06) |

## 14. `Image` type

| Field | Type | Req. | Notes |
|---|---|---|---|
| `src` | Path | ✓ | Optimised asset (Phase 06), renamed without spaces or parentheses |
| `alt` | string | ✓ | `""` only for decorative images |
| `width` / `height` | number | ✓ | Intrinsic size (prevents CLS) |
| `blurred` | boolean | — | `true` for projects 1–3 |

## 15. Validation rules for the content source

These are checked at build time (Phase 05 implements them).

| Rule | Checked by |
|---|---|
| Every required field present; no empty strings | Type system and schema validation |
| `Project.url` is present **if and only if** `linkStatus = "live"` | Schema validation |
| `Experience.start` ≤ `end`; experiences sorted newest first | Schema validation |
| All `Url` values use `https://` (except `mailto:`/`tel:`) | Schema validation |
| `Image.alt` is not empty unless the image is decorative | Schema validation |
| No duplicate `id`s | Schema validation |
