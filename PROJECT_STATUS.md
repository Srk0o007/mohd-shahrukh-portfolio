# Project Status

**Last updated:** 2026-11-03
**Current phase:** Phase 02 — Existing Website Investigation 🔍 Deliverables in review (PR on `phase/02-website-investigation`)
**Next phase:** Phase 03 — Requirements & Content Specification ⏸️ Awaiting approval

## Current state

| Item | Status |
|---|---|
| **Next approved action** | Owner reviews the Phase 02 PR. Once approved, it is merged into `main` and Phase 02 is marked complete. Phase 03 needs separate approval. |
| **Blockers** | None |
| **Pending work** | Phase 02 PR review and merge; Phases 03–12 not started; open content questions Q1–Q12 (see below) |

## Phase tracker

| # | Phase | Status | Completed |
|---|---|---|---|
| 01 | Repository & Project Initialization | ✅ Complete | 2026-11-03 |
| 02 | Existing Website Investigation | 🔍 In review | — |
| 03 | Requirements & Content Specification | ⏸️ Awaiting approval | — |
| 04 | UI/UX Research & Design System | ⏳ Not started | — |
| 05 | Technical Architecture | ⏳ Not started | — |
| 06 | Foundation & Design System Implementation | ⏳ Not started | — |
| 07 | Core Portfolio Development | ⏳ Not started | — |
| 08 | Projects & Content Showcase | ⏳ Not started | — |
| 09 | Contact & Interactive Features | ⏳ Not started | — |
| 10 | Accessibility & Responsive Engineering | ⏳ Not started | — |
| 11 | Performance, SEO & Quality Assurance | ⏳ Not started | — |
| 12 | Deployment & Domain Configuration | ⏳ Not started | — |

Legend: ✅ Complete · 🔍 In review · 🚧 In progress · ⏸️ Awaiting approval · ⏳ Not started

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

## Open content questions (resolved in Phase 03)

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

## Risks & dependencies

| ID | Risk / dependency | Impact | Mitigation | Phase |
|---|---|---|---|---|
| R1 | `create-next-app` refuses to run in a non-empty directory (e.g. one with `README.md`, `PROJECT_STATUS.md`) | Medium | Scaffold into a temporary directory and merge, or set up manually | 06 |
| R2 | Repository is public; all pushed content is visible and may be cached | Medium | Never commit secrets; `.env*` ignored from day one; review diffs before pushing | All |
| R3 | Custom domain DNS depends on Hostinger account access | High | Confirm access before Phase 12 starts | 12 |
| R4 | Content fidelity: existing site content must be preserved without fabrication | High | Full verified inventory in Phase 02; content spec sign-off in Phase 03 | 02–03 |
| R5 | Existing-site assets (headshot, project screenshots, resume PDF) must be obtained in usable quality | Medium | ✅ Inventoried in Phase 02; all 17 images are available. Three project images are low resolution (375×393). | 02 → 06 |
| R6 | 6 project demo links are dead | Medium | D6: render without links until the owner supplies new URLs (Q11) | 08 |
| R7 | Testimonials and photos are third-party personal data | Medium | Confirm consent in Phase 03 (Q9) | 03 |
| R8 | The reference site is built on a commercial template | Medium | Patterns only; no code, CSS or assets reused | 04–09 |
| R9 | Mixed project image aspect ratios (16:9 and about 1:1) | Low | Fixed-ratio card frames with `object-fit` in Phase 04 | 04 |

## Change log

| Date | Change |
|---|---|
| 2026-11-03 | Phase 01 complete: repository initialized and pushed |
| 2026-11-03 | Added "Current state" section (next approved action, blockers, pending work); aligned workflow doc with the 5-step execution strategy |
| 2026-11-03 | Phase 02 deliverables written in `docs/audit/`; owner decisions D1–D7 recorded; PR opened for review |
