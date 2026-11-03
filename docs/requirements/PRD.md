# Product Requirements Document (PRD)

**Product:** Mohd Shahrukh — Personal Portfolio (rebuild)
**Phase:** 03 — Requirements & Content Specification
**Date:** 2026-11-03
**Status:** Draft for owner approval (PR)

Related documents: [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md) · [NON_FUNCTIONAL_REQUIREMENTS.md](NON_FUNCTIONAL_REQUIREMENTS.md) · [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md) · [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) · Phase 02 audit: [docs/audit/](../audit/)

---

## 1. Summary

Rebuild https://mohdshahrukh.in/ as a fast, accessible, maintainable single-page portfolio using Next.js (App Router), React, TypeScript (strict) and Tailwind CSS. The content is updated to the owner's resume of 03 Nov 2026. The design follows a modern editorial direction informed by the reference site, which supplies patterns only.

## 2. Background

The Phase 02 audit ([WEBSITE_AUDIT.md](../audit/WEBSITE_AUDIT.md)) found these problems with the current site:

| Area | Problem |
|---|---|
| Content | Outdated against the latest resume: years of experience, employment dates, job titles, tech stack, certifications |
| Links | 6 of 10 project demo links are dead; 3 project cards open a duplicate tab |
| Accessibility | Infinite animations, unnamed controls, a contrast failure, broken heading structure; no reduced-motion support |
| Responsive | Hero overflows horizontally at 375 px |
| Performance | About 9.73 MB of images, about 964 KB of CSS and JS (jQuery plus 10 plugins), a blocking preloader |
| SEO | No robots.txt, sitemap or canonical host; relative OG image |
| Theme | No dark mode, although the CSS advertises one |

## 3. Goals

| ID | Goal | Measured by |
|---|---|---|
| G1 | Present accurate, current professional information | 100% of displayed facts trace to [CONTENT_INVENTORY.md](../audit/CONTENT_INVENTORY.md) sources or owner decisions; zero invented content |
| G2 | Make the work easy to find and evaluate | All 10 projects presented; zero dead links |
| G3 | Make contact effortless | The contact form works in place with clear feedback; phone and email are one tap away |
| G4 | Be accessible to everyone | WCAG 2.2 AA; zero axe violations |
| G5 | Be fast on mobile | Core Web Vitals "good"; Lighthouse ≥ 95 in every category |
| G6 | Be easy to maintain | Content lives in one typed source; strict TypeScript; documented |

## 4. Non-goals (v1)

| Non-goal | Reason |
|---|---|
| Blog or articles | No content exists |
| Separate project detail pages or modals | No project has detailed content (D9) |
| Analytics or tracking | Not requested; avoids privacy and consent work (D21) |
| CMS or admin UI | Content changes rarely; a typed file in the repo is enough |
| Multi-language support | Existing content is English only |
| Personal photo gallery, client logo wall | No such content or assets exist |
| Skill percentage bars | Removed by D5 |
| Preloader, custom cursor, scroll hijacking | Rejected in [REFERENCE_DESIGN_ANALYSIS.md](../audit/REFERENCE_DESIGN_ANALYSIS.md) |

## 5. Audience

These audiences are inferred from the existing site's content: its "Hire Me!" call to action, its "How I Can Help Your Next Project" services and its resume download.

| Audience | Primary needs |
|---|---|
| Recruiters and hiring managers | Title, experience, dates, skills, CV download, contact |
| Engineering leads and interviewers | Depth of experience (bullets), stack, accessibility and testing practice, project evidence |
| Prospective clients | Services, project examples, testimonials, contact |

## 6. Key user tasks

| # | Task | Requirements |
|---|---|---|
| T1 | Understand Mohd Shahrukh's role and focus within seconds | FR-HERO-01, FR-ABT-01 |
| T2 | Review work history and skills | FR-RES-01 … FR-RES-05 |
| T3 | Download the CV | FR-RES-06 |
| T4 | Browse and filter projects; open live ones | FR-PRJ-01 … FR-PRJ-06 |
| T5 | Read endorsements | FR-TST-01 |
| T6 | Get in touch by form, phone, email or social link | FR-CON-01 … FR-CON-07, FR-CTA-01, FR-SOC-01 |
| T7 | Use the site comfortably: any device, theme, input method or assistive technology | FR-NAV-*, FR-THM-*, FR-INT-*, NFR-A11Y-*, NFR-RSP-* |

## 7. Scope (v1): page structure

Single page, in this order. Final visual layout is decided in Phase 04.

| # | Section | Anchor | In nav |
|---|---|---|---|
| 1 | Header (name, nav, theme toggle, Download CV) | — | — |
| 2 | Hero | `#top` | (name/logo link) |
| 3 | About | `#about` | About |
| 4 | Services | `#services` | Services |
| 5 | Experience | `#experience` | Experience |
| 6 | Skills | `#skills` | Skills |
| 7 | Certifications | `#certifications` | — |
| 8 | Education | `#education` | — |
| 9 | Projects | `#projects` | Projects |
| 10 | Hire CTA band | — | — |
| 11 | Testimonials | `#testimonials` | Testimonials |
| 12 | Contact | `#contact` | Contact |
| 13 | Footer | — | — |
| — | 404 page | separate route | — |

## 8. Decisions

### From Phase 02 (D1–D7)

See [CONTENT_INVENTORY.md §2](../audit/CONTENT_INVENTORY.md#2-owner-decisions-2026-11-03).

- **D1:** AltInvest shown as May 2024 – Oct 2026, with no availability statement.
- **D2:** Education is B.Tech only.
- **D3:** Certifications are IBM, JavaScript and React.
- **D4:** No second phone number and no Twitter.
- **D5:** Grouped skills, no percentages.
- **D6:** All 10 projects kept; dead links hidden.
- **D7:** The 03 Nov 2026 CV.

### Phase 03 (approved by owner, 2026-11-03)

| ID | Topic | Decision |
|---|---|---|
| D8 | Theme | Light and dark themes; default follows the system setting; toggle with a persisted choice |
| D9 | Project details | Details appear on the card; no detail pages or modals in v1 |
| D10 | Project filter | **All / Enterprise products / Websites**. Enterprise products are projects 1–3; Websites are projects 4–10. |
| D11 | Projects 1–3 label | "Internal product — no public link" |
| D12 | Hero headline | Static title "Software Development Engineer \| Frontend". No typing animation; "a UI/UX Designer" is dropped. |
| D13 | Targeting statement | "Targeting SDE-2 / Senior Frontend roles." is dropped |
| D14 | Location spelling | "Bangalore" everywhere |
| D15 | Navigation | About · Services · Experience · Skills · Projects · Testimonials · Contact, plus a Download CV button. Section eyebrow labels match the nav labels. |
| D16 | Project #1 title | Kept as on the live site: "Digital Asset Management" / "Marketing Resource Management (MRM)" |
| D17 | New projects | mohdshahrukh.in and PropShare Titania are not added in v1; the schema allows adding them later |
| D18 | Testimonials | Both kept; owner confirms they may continue to be published; no company names |
| D19 | "Call Me!" | Becomes a `tel:+919760787661` link |
| D20 | Services copy | Kept word for word; factual corrections only |
| D21 | Analytics | Won't have in v1 |

## 9. Assumptions

| # | Assumption |
|---|---|
| AS1 | The owner keeps the domain `mohdshahrukh.in` and has Hostinger DNS access (Phase 12) |
| AS2 | Hosting target is Vercel (roadmap Phase 12) |
| AS3 | A third-party form endpoint is acceptable for the contact form; the provider is chosen in Phase 05 (currently Formspree) |
| AS4 | Existing images may be reused and optimised; the owner holds the rights to the project screenshots and the portrait |
| AS5 | Content changes are made by editing files in the repository |

## 10. Constraints

- Stack: Next.js App Router, React, TypeScript strict, Tailwind CSS.
- No unnecessary dependencies (global instruction); each runtime dependency must be justified.
- No fabricated personal information; all content traces to [CONTENT_INVENTORY.md](../audit/CONTENT_INVENTORY.md) or owner decisions.
- Reference site: patterns only; no code, assets or content reused.
- The repository is public: no secrets.

## 11. Dependencies

| Dependency | Needed for | Phase |
|---|---|---|
| Design tokens and layouts | All UI requirements | 04 |
| Architecture: content format, form provider, rendering strategy | FR-CON-*, NFR-MNT-*, NFR-PERF-09 | 05 |
| Optimised assets and the CV PDF in the repo | FR-RES-06, FR-PRJ-06, NFR-PERF-06 | 06 |
| New URLs for the 6 re-deployed projects (owner) | FR-PRJ-03 (non-blocking) | Any time |
| Hostinger DNS access (owner) | NFR-SEO-02, NFR-SEC-01 | 12 |

## 12. Risks

See the register in [PROJECT_STATUS.md](../../PROJECT_STATUS.md). Requirement-specific risks:

| Risk | Mitigation |
|---|---|
| The first-load JS budget (NFR-PERF-05) is tight with the App Router | Server Components by default; client components only for interactive islands |
| Three low-resolution project images (375×393) look soft in 16:9 frames | `object-fit` framing (FR-PRJ-06); the owner may supply new captures after re-deployment |
| Contact form provider limits (rate limits, free tier) | Chosen in Phase 05; failure path offers an email fallback (FR-CON-04) |

## 13. Release criteria (v1 launch)

The site may be released when **all** of these hold:

1. Every **Must** requirement in [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md) and [NON_FUNCTIONAL_REQUIREMENTS.md](NON_FUNCTIONAL_REQUIREMENTS.md) passes its acceptance criteria.
2. The release checklist in [ACCEPTANCE_CRITERIA.md §4](ACCEPTANCE_CRITERIA.md#4-release-checklist-v1) is complete.
3. The owner has signed off the content against [CONTENT_SCHEMA.md](CONTENT_SCHEMA.md).

**Should** items not met at launch are logged in PROJECT_STATUS.md with a target phase.

## 14. Non-blocking open items

| Item | Owner action |
|---|---|
| Q8: extra project details (descriptions, stack, dates) | Optional; the schema supports them |
| Q11: new URLs for the 6 re-deployed projects | Supply when available; each link appears once its URL is verified live |
