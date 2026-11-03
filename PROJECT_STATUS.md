# Project Status

**Last updated:** 2026-11-03
**Current phase:** Phase 03 — Requirements & Content Specification ✅ Complete (PR #2 merged)
**Next phase:** Phase 04 — UI/UX Research & Design System ⏸️ Awaiting approval

## Current state

| Item | Status |
|---|---|
| **Next approved action** | None. Awaiting approval to start Phase 04 — UI/UX Research & Design System. |
| **Blockers** | None |
| **Pending work** | Phase 04 awaits approval; Phases 05–12 not started; non-blocking owner inputs Q8 (extra project details) and Q11 (new project URLs) |

## Phase tracker

| # | Phase | Status | Completed |
|---|---|---|---|
| 01 | Repository & Project Initialization | ✅ Complete | 2026-11-03 |
| 02 | Existing Website Investigation | ✅ Complete | 2026-11-03 |
| 03 | Requirements & Content Specification | ✅ Complete | 2026-11-03 |
| 04 | UI/UX Research & Design System | ⏸️ Awaiting approval | — |
| 05 | Technical Architecture | ⏳ Not started | — |
| 06 | Foundation & Design System Implementation | ⏳ Not started | — |
| 07 | Core Portfolio Development | ⏳ Not started | — |
| 08 | Projects & Content Showcase | ⏳ Not started | — |
| 09 | Contact & Interactive Features | ⏳ Not started | — |
| 10 | Accessibility & Responsive Engineering | ⏳ Not started | — |
| 11 | Performance, SEO & Quality Assurance | ⏳ Not started | — |
| 12 | Deployment & Domain Configuration | ⏳ Not started | — |

Legend: ✅ Complete · 🔍 In review · 🚧 In progress · ⏸️ Awaiting approval · ⏳ Not started

## Phase 03 summary

**Delivered** (in `docs/requirements/`)

- [PRD.md](docs/requirements/PRD.md): goals, non-goals, audience, scope, decisions D1–D21, assumptions, constraints, release criteria
- [FUNCTIONAL_REQUIREMENTS.md](docs/requirements/FUNCTIONAL_REQUIREMENTS.md): 47 functional requirements (FR-NAV … FR-ERR) plus a Won't-have list
- [NON_FUNCTIONAL_REQUIREMENTS.md](docs/requirements/NON_FUNCTIONAL_REQUIREMENTS.md): 58 non-functional requirements (accessibility, performance, SEO, security, maintainability, responsive, browser)
- [CONTENT_SCHEMA.md](docs/requirements/CONTENT_SCHEMA.md): content models with sources, project data, new UI copy, validation rules
- [ACCEPTANCE_CRITERIA.md](docs/requirements/ACCEPTANCE_CRITERIA.md): verification methods, Definition of Done, Given/When/Then scenarios, release checklist, traceability matrix

Every requirement has an ID, description, priority (MoSCoW), acceptance criteria, dependencies and a source.

**Open questions Q1–Q7, Q9, Q10 and Q12 are resolved** by decisions D8–D21. Q5 is resolved by D10. Q8 and Q11 remain non-blocking owner inputs.

## Phase 02 summary

**Delivered** (in `docs/audit/`)

- [WEBSITE_AUDIT.md](docs/audit/WEBSITE_AUDIT.md): technology, broken links, SEO, accessibility, performance, responsive, security and interaction audit
- [CONTENT_INVENTORY.md](docs/audit/CONTENT_INVENTORY.md): all content with source precedence and status tags; owner decisions D1–D7; open questions Q1–Q12
- [ASSET_INVENTORY.md](docs/audit/ASSET_INVENTORY.md): 17 images, documents, fonts, icons, services, missing assets
- [SECTION_MAPPING.md](docs/audit/SECTION_MAPPING.md): live structure plus a draft mapping to the new site
- [REFERENCE_DESIGN_ANALYSIS.md](docs/audit/REFERENCE_DESIGN_ANALYSIS.md): reference patterns, tokens, and an adopt/adapt/avoid list

**Key findings**

- 6 of 10 project demo links are dead (NXDOMAIN); the 3 confidential projects link to a duplicate tab
- Hero overflows horizontally at 375 px
- WCAG issues: infinite animations with no pause, unnamed controls, contrast failure (4.45:1), heading structure
- Images total about 9.73 MB (headshot alone is 1.46 MB); about 964 KB of CSS and JS with jQuery and 10 plugins
- No `robots.txt`, sitemap or canonical host; relative OG image
- Live content is outdated compared with the 03 Nov 2026 resume (years, dates, stack, titles)

**Not done in this phase (by design):** no assets copied, no screenshots committed, live site untouched.

## Open content questions (raised in Phase 02; resolved in Phase 03 except Q8 and Q11)

Q1 typed role "UI/UX Designer" · Q2 "Targeting SDE-2" line · Q3 Bangalore vs Bengaluru · Q4 nav/section labels · Q5 portfolio filter taxonomy · Q6 MARCOM vs "Digital Asset Management" title · Q7 add mohdshahrukh.in / PropShare Titania as projects · Q8 extra project details · Q9 testimonial consent and companies · Q10 "Call Me!" behaviour · Q11 new URLs for the 6 re-deployed projects · Q12 services copy refresh. Details: [CONTENT_INVENTORY.md §19](docs/audit/CONTENT_INVENTORY.md#19-open-items-for-phase-03).

## Phase 01 summary

**Delivered**

- Baseline documentation: `README.md`, `PROJECT_STATUS.md`, `docs/ROADMAP.md`, `docs/ENGINEERING_WORKFLOW.md`
- Repository configuration: `.gitignore`, `.gitattributes` (LF normalization), `.editorconfig`, `.nvmrc` (Node 24)
- Pull request template: `.github/pull_request_template.md`
- First commit pushed to `origin/main`; GitHub description, homepage and topics set

**Environment at initialization**

- Node v24.11.1, npm 11.6.4, git 2.39.1, GitHub CLI 2.96.0
- Remote: `git@github.com:Srk0o007/mohd-shahrukh-portfolio.git` (public)

## Decisions log

| Date | Decision | Rationale |
|---|---|---|
| 2026-11-03 | No open-source license ("all rights reserved") | Personal portfolio holding personal content, images and a resume |
| 2026-11-03 | npm as package manager | Already installed, so no extra global tooling; can be revisited in Phase 05 |
| 2026-11-03 | LF line endings enforced via `.gitattributes` | Windows dev machine uses `core.autocrlf=true`; this prevents mixed line endings |
| 2026-11-03 | Next.js scaffolding deferred to Phase 06 | Follows the roadmap; Phase 01 is the repository baseline only |
| 2026-11-03 | Branches named `phase/NN-slug`; Conventional Commits | Keeps phase scope traceable and reviewable |
| 2026-11-03 | **Content source precedence:** the 03 Nov 2026 resume governs career data; the live site governs everything else; the Jul 2026 PDF is historical only | Owner instruction to update the site from the latest resume |
| 2026-11-03 | D1: AltInvest shown as May 2024 – Oct 2026; no availability statement | Owner decision |
| 2026-11-03 | D2: Education is B.Tech only | Owner decision |
| 2026-11-03 | D3: Certifications are IBM Full Stack, JavaScript: The Complete Guide, React — The Complete Guide | Owner decision |
| 2026-11-03 | D4: Remove the second phone number and Twitter/X | Owner decision |
| 2026-11-03 | D5: Grouped skills replace percentage bars | Owner decision; self-ratings are unverifiable |
| 2026-11-03 | D6: Keep all 10 projects with images; dead links hidden until the owner supplies new URLs | Owner decision |
| 2026-11-03 | D7: CV download uses the 03 Nov 2026 resume PDF (copied in Phase 06) | Owner decision |
| 2026-11-03 | Reference site used for patterns only; no code, assets or content reused | It is another person's site, built on a commercial template |
| 2026-11-03 | D8: Light and dark themes; follows the system setting; toggle with persisted choice | Owner approved (Phase 03) |
| 2026-11-03 | D9: Project details on cards; no detail pages or modals in v1 | No detailed project content exists |
| 2026-11-03 | D10: Project filter is All / Enterprise products (1–3) / Websites (4–10) | Fixes the inaccurate live taxonomy |
| 2026-11-03 | D11: Projects 1–3 labelled "Internal product — no public link" | Neutral; avoids claiming confidentiality |
| 2026-11-03 | D12: Static hero title; no typing animation; "UI/UX Designer" dropped | Matches the resume; WCAG 2.2.2 |
| 2026-11-03 | D13: "Targeting SDE-2 / Senior Frontend roles." dropped | Consistent with D1 |
| 2026-11-03 | D14: "Bangalore" spelling everywhere | Matches the resume |
| 2026-11-03 | D15: Nav is About · Services · Experience · Skills · Projects · Testimonials · Contact, plus Download CV | Fixes mismatched labels |
| 2026-11-03 | D16: Project #1 keeps its live title "Digital Asset Management" / "Marketing Resource Management (MRM)" | Owner decision |
| 2026-11-03 | D17: No new projects in v1 (mohdshahrukh.in, PropShare Titania) | No images; schema allows adding later |
| 2026-11-03 | D18: Both testimonials kept; owner confirms they may continue to be published; no company names | Owner decision |
| 2026-11-03 | D19: "Call Me!" becomes a `tel:` link | The button label promises a call |
| 2026-11-03 | D20: Services copy kept word for word | No invented copy |
| 2026-11-03 | D21: No analytics in v1 | Not requested; privacy |

## Risks & dependencies

| ID | Risk / dependency | Impact | Mitigation | Phase |
|---|---|---|---|---|
| R1 | `create-next-app` refuses to run in a non-empty directory (e.g. one with `README.md`, `PROJECT_STATUS.md`) | Medium | Scaffold into a temporary directory and merge, or set up manually | 06 |
| R2 | Repository is public; all pushed content is visible and may be cached | Medium | Never commit secrets; `.env*` ignored from day one; review diffs before pushing | All |
| R3 | Custom domain DNS depends on Hostinger account access | High | Confirm access before Phase 12 starts | 12 |
| R4 | Content fidelity: existing site content must be preserved without fabrication | High | Full verified inventory in Phase 02; content spec sign-off in Phase 03 | 02–03 |
| R5 | Existing-site assets (headshot, project screenshots, resume PDF) must be obtained in usable quality | Medium | ✅ Inventoried in Phase 02; all 17 images are available. Three project images are low resolution (375×393). | 02 → 06 |
| R6 | 6 project demo links are dead | Medium | D6: render without links until the owner supplies new URLs (Q11) | 08 |
| R7 | Testimonials and photos are third-party personal data | Medium | ✅ Owner confirmed continued publication (D18); company names omitted | 03 |
| R10 | First-load JS budget (≤ 150 KB gzip) with the App Router | Medium | Server Components by default; client components only for interactive parts | 05–06 |
| R11 | Contact form provider limits (rate limits, free tier) | Low | Provider chosen in Phase 05; failure state offers an email fallback | 05, 09 |
| R8 | The reference site is built on a commercial template | Medium | Patterns only; no code, CSS or assets reused | 04–09 |
| R9 | Mixed project image aspect ratios (16:9 and about 1:1) | Low | Fixed-ratio card frames with `object-fit` in Phase 04 | 04 |

## Change log

| Date | Change |
|---|---|
| 2026-11-03 | Phase 01 complete: repository initialized and pushed |
| 2026-11-03 | Added "Current state" section (next approved action, blockers, pending work); aligned workflow doc with the 5-step execution strategy |
| 2026-11-03 | Phase 02 deliverables written in `docs/audit/`; owner decisions D1–D7 recorded; PR opened for review |
| 2026-11-03 | Phase 02 approved by owner; PR #1 merged into `main` |
| 2026-11-03 | Merged branch `phase/02-website-investigation` deleted |
| 2026-11-03 | Phase 03 deliverables written in `docs/requirements/`; decisions D8–D21 recorded; PR opened for review |
| 2026-11-03 | Phase 03 approved by owner; PR #2 merged into `main`; branch `phase/03-requirements-specification` deleted |
