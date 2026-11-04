# Project Status

**Last updated:** 2026-11-04
**Current phase:** Phase 07 — Core Portfolio Development 🔍 Implementation in review (PR on `phase/07-core-portfolio`)
**Next phase:** Phase 08 — Projects & Content Showcase ⏸️ Awaiting approval

## Current state

| Item | Status |
|---|---|
| **Next approved action** | Owner reviews the Phase 07 PR. It is **not** merged without the owner's approval. Phase 08 stays unstarted until explicitly approved. |
| **Blockers** | None |
| **Pending work** | Phase 07 PR review; owner to confirm Formspree account access before Phase 09 (ADR 0006); non-blocking owner inputs Q8 and Q11; Phases 07–12 not started |

## Phase tracker

| # | Phase | Status | Completed |
|---|---|---|---|
| 01 | Repository & Project Initialization | ✅ Complete | 2026-11-03 |
| 02 | Existing Website Investigation | ✅ Complete | 2026-11-03 |
| 03 | Requirements & Content Specification | ✅ Complete | 2026-11-03 |
| 04 | UI/UX Research & Design System | ✅ Complete | 2026-11-03 |
| 05 | Technical Architecture | ✅ Complete | 2026-11-04 |
| 06 | Foundation & Design System Implementation | ✅ Complete | 2026-11-04 |
| 07 | Core Portfolio Development | 🔍 In review | — |
| 08 | Projects & Content Showcase | ⏸️ Awaiting approval | — |
| 09 | Contact & Interactive Features | ⏳ Not started | — |
| 10 | Accessibility & Responsive Engineering | ⏳ Not started | — |
| 11 | Performance, SEO & Quality Assurance | ⏳ Not started | — |
| 12 | Deployment & Domain Configuration | ⏳ Not started | — |

Legend: ✅ Complete · 🔍 In review · 🚧 In progress · ⏸️ Awaiting approval · ⏳ Not started

## Phase 07 summary

**Delivered** (page order per D15 / DS-02; no separate Resume section):

- **Site shell** (root layout, so the 404 page has it too):
  - **header:** wordmark; inline nav ≥ 1280 px; Download CV ≥ 768 px; menu button < 1280 px; no theme toggle until Phase 09;
  - **`MobileMenu` island:** focus moves in and is contained; page `inert`; scroll locked; Esc / Close restore focus; a chosen link focuses its section; 404 links go to `/#section`;
  - **footer** with the build-time year;
  - **no-JS fallback:** inline nav and CV link visible at every width.
- **Sections:** Hero, 01 About, 02 Services, 03 Experience, 04 Skills, 05 Certifications, 06 Education. All content comes from `src/content` word for word; no personal information was rewritten.
- **`HighlightsDisclosure` island:** all 17 highlights in the server render and without JS; after hydration the AltInvest role shows 4 plus "Show all 11 highlights".
- **Owner decisions applied:**
  - full navigation and hero links from the start, with the pending-targets test;
  - text-labelled GitHub / LinkedIn / Email (no brand logos);
  - approved order;
  - approved UI copy (Portfolio, Role, Based in, Experience, Primary).
- **Icons:** 7 Lucide icons copied verbatim from `lucide-static` 1.67.0; the Phase 06 icons were re-verified against it.
- **Performance work:** the portrait is rendered with `getImageProps()` + `<img>` (no `next/image` client JS), and the menu's CV/social links are a server-rendered slot. Together they brought first-load JS from 145.1 back to 139.5 KB gzip (ADR 0010 addendum).

**Validation (2026-11-04):**

| Check | Result |
|---|---|
| Build | ✅ All 6 routes static (○) |
| TypeScript, ESLint, Prettier | ✅ 0 errors |
| Unit, component and content tests | ✅ 104 passed (19 files) |
| E2E + axe (Chromium) | ✅ 43 passed. Coverage: section order; pending-targets-only internal links; header per breakpoint; desktop nav lands below the header; menu keyboard containment, inert, scroll lock, Esc/Close focus restore, link → section focus; 404 → home sections (desktop and menu); 17 highlights and the disclosure; CV accessible name and PDF response; no-JS nav, CV and highlights; no overflow at 320/375/768/1024/1280/1440; axe on home and 404 in both themes at 375/1280 and with the menu open |
| First-load JS | ✅ 139.5 KB gzip (budget 150; ⚠ above the 120 KB target) |
| `npm audit --audit-level=high` | ✅ 0 high or critical |
| Visual review | ✅ Screenshots reviewed at 375 / 768 / 1280 / 1440 px, light and dark, menu open, 404 |

**Pending internal targets (by design, owner decision):** `#projects` and `#testimonials` (Phase 08), `#contact` (Phase 09). The E2E test fails on any other missing target, and this list must be empty by the end of Phase 09.

## Phase 06 summary

**Delivered** (application foundation; no portfolio sections):

- **Toolchain:**
  - Next.js 16.4.5 (App Router, Turbopack), React 19.3.1, TypeScript **6.0.3** strict.
  - Tailwind CSS 4.3.4, ESLint **9.39.5** (ADR 0012), Prettier.
  - Vitest 5 + Testing Library, Playwright + axe-core.
- **Runtime dependencies:** only `next`, `react` and `react-dom`.
- **Design tokens** (`src/app/globals.css`):
  - all Phase 04 colours in light and dark, the fluid type scale, breakpoints, radii and motion;
  - Tailwind's default palette and scales removed;
  - focus, selection, reduced motion, no-JS and forced-colours rules.
- **Fonts:** Fraunces and Inter via `next/font/google`, fetched at build time and self-hosted. The browser loads **2 files**, with **no Google requests**.
- **Theme:** the ADR 0005 pre-paint script on `<html>`. Scoped `data-theme` is used only by the temporary preview.
- **Primitives:** `Button`, `ButtonLink`, `TextLink`, `ExternalLink`, `Container`, `Section`, `SectionHeader`, `VisuallyHidden`, `SkipLink`, `ThemeScript`, plus 3 icons copied from Lucide (ISC).
- **Metadata:** title, description, canonical URL, Open Graph and Twitter text, `viewport` theme colour, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, and the **"MS" monogram favicon** (outlined Fraunces). The social image follows in Phase 11.
- **Error pages:** `not-found`, `error`, `global-error`.
- **Content layer:**
  - all typed content modules (CONTENT_SCHEMA);
  - **10 projects** with the approved groups and link statuses;
  - the 03 Nov 2026 CV;
  - 13 verified images, byte-identical to the live site ([ASSET_INVENTORY §7](docs/audit/ASSET_INVENTORY.md#7-imported-into-the-repository-phase-06)).
- **Temporary preview at `/`:** real primitives and tokens in light and dark panels. Phase 07 replaces it.
- **CI** (`.github/workflows/ci.yml`): audit (high), format, lint, typecheck, unit tests, build, JS budget, E2E + axe.
- **Documents reconciled:**
  - social image deferred to Phase 11 (CONTENT_SCHEMA, FOLDER_STRUCTURE, ARCHITECTURE);
  - font sourcing made explicit;
  - ESLint 9 (ADR 0012, ENGINEERING_GUIDELINES);
  - theme-scope addenda in ADR 0004 and 0005;
  - new error-page UI copy added to CONTENT_SCHEMA §13.

**Validation (2026-11-04):**

| Check | Result |
|---|---|
| Production build | ✅ All 6 routes static (○) |
| Development server | ✅ Ready in 1.6 s; `/` 200; unknown route 404; no errors |
| TypeScript, ESLint, Prettier | ✅ 0 errors / all formatted |
| Unit, component and content tests | ✅ 52 passed (10 files) |
| E2E + axe (Chromium) | ✅ 19 passed: zero axe violations on home and 404, both themes, 375 and 1280 px |
| First-load JS for `/` | ✅ 136.9 KB gzip (budget 150; ⚠ above the 120 KB target, mostly the framework runtime) |
| `npm audit --audit-level=high` | ✅ 0 high or critical; 0 issues in runtime deps; 17 moderate, all in the ESLint dev toolchain |
| GitHub Actions CI (PR #5) | ✅ All 16 steps passed (run 41705994672, commit `2f4191f`). The first run failed at the type check (see change log); fixed and re-verified on a fresh clone. |

## Phase 05 summary

**Delivered** (in `docs/architecture/`)

- [ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md): overview, external services, routing, Server vs Client Components, layout, content flow, styling, images, fonts, metadata, errors, contact form, security, testing, CI, dependency budget
- [FOLDER_STRUCTURE.md](docs/architecture/FOLDER_STRUCTURE.md): target tree and dependency rules
- [COMPONENT_ARCHITECTURE.md](docs/architecture/COMPONENT_ARCHITECTURE.md): layers, component tree, 8 client-island contracts, primitives, form design, image `sizes`, layout logic
- [DATA_MODEL.md](docs/architecture/DATA_MODEL.md): TypeScript types for all content, view models, invariants I-1 to I-11, owner update workflow
- [ENGINEERING_GUIDELINES.md](docs/architecture/ENGINEERING_GUIDELINES.md): toolchain, TypeScript, React/Next, Tailwind, accessibility, testing, style, security, budgets
- [adr/](docs/architecture/adr/): ADR 0001–0011

**Key decisions:**
- Static prerendering on Vercel.
- Only 3 runtime dependencies (`next`, `react`, `react-dom`).
- Typed content modules.
- Tailwind v4 tokens.
- Custom theme script.
- Formspree with progressive enhancement.
- Vitest + Playwright + axe.
- Static CSP with `'unsafe-inline'` (NFR-SEC-02 amended); Phase 11 evaluates CSP hash sources (SRI considered separately).
- Inline SVG icons.
- `next/image`, with Vercel-managed image optimisation (runtime, cached).
- No application-owned server code at runtime. Image optimisation is the only platform runtime processing; the hosting plan is verified in Phase 12.
- TypeScript pinned to 6.0.3.

**Versions verified 2026-11-03:** Next.js 16.4.5 · React 19.3.1 · Tailwind CSS 4.3.4 · TypeScript 6.0.3 (7.0.2 is incompatible with typescript-eslint 8.72) · ESLint 9.39.5 (ADR 0012; ESLint 10 is blocked by bundled plugin peer ranges) · Vitest 5.1 · Playwright 1.64.

## Phase 04 summary

**Direction:** A — Editorial Grid (owner-selected), with numbered sections and a technical hierarchy from C, and the optional skills strip and category distinction from B.

**Delivered** (in `docs/design/`)

- [DESIGN_DIRECTION.md](docs/design/DESIGN_DIRECTION.md): content verification, directions explored, principles, decisions DS-01 to DS-20, originality, open questions
- [DESIGN_SYSTEM.md](docs/design/DESIGN_SYSTEM.md): breakpoints, grid, asymmetric project rhythm, spacing, shape, motion, focus, icons, imagery, theming, layering
- [COLOR_TOKENS.md](docs/design/COLOR_TOKENS.md): 21 primitives, 19 semantic tokens (light and dark), 43 verified contrast pairings
- [TYPOGRAPHY.md](docs/design/TYPOGRAPHY.md): Fraunces + Inter, loading strategy, 13-step fluid scale, hierarchy per section
- [COMPONENT_VISUAL_SPEC.md](docs/design/COMPONENT_VISUAL_SPEC.md): 25 components with anatomy, states and responsive behaviour

**Content verification (owner request):** 10 projects confirmed on the live site (byte-identical to the Phase 02 snapshot). "Nine" traces to the live "Front-End Development" filter, which holds 9 of the 10. "6+ years" and all employment dates match the 03 Nov 2026 resume (74 consecutive months).

**Visual exploration canvas:** a private artifact owned by the site owner (three directions, desktop and mobile, light and dark).

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
| 2026-11-03 | DS-01: Direction A — Editorial Grid, with borrowings from C (numbered sections, technical hierarchy) and B (optional skills strip, category distinction) | Owner selection (Phase 04) |
| 2026-11-03 | DS-02 to DS-20: design decisions (sections 01–09, nav at 1280 px, fonts, palette rules, border tokens, project rhythm, image fit, category tags, CTA band, motion limits, …) | See [DESIGN_DIRECTION.md §5](docs/design/DESIGN_DIRECTION.md#5-design-decisions-ds) |
| 2026-11-03 | Could items adopted: FR-RES-02 (collapsible highlights), FR-INT-06 (skills strip), FR-PRJ-07 (hover zoom), FR-CON-07 (character counter) | Decided in Phase 04 as planned |
| 2026-11-03 | Phase 04 open questions resolved to their defaults (OQ-1: no extra About facts; OQ-2: skills strip after the hero; OQ-3: canvas not updated) | PR #3 merged without changes |
| 2026-11-04 | Architecture decisions ADR 0001–0011 accepted | Owner approved the Phase 05 proposal with recommendations; see [docs/architecture/adr/](docs/architecture/adr/) |
| 2026-11-04 | **NFR-SEC-02 amended:** static CSP with `script-src 'self' 'unsafe-inline'`; retained until the Phase 11 evaluation of CSP hash sources (SRI is a separate mechanism for external files) | ADR 0008; nonces would force dynamic rendering (Next.js 16 docs) |
| 2026-11-04 | Hosting plan is a deployment-stage decision: Vercel Hobby intended; limits, image-optimisation pricing and acceptable-use terms verified in Phase 12 | Owner review of PR #4; ADR 0002 |
| 2026-11-04 | ESLint 9.39.5 instead of 10 (ADR 0012); TypeScript stays exactly 6.0.3 | Bundled plugins do not declare ESLint 10 support (owner approved) |
| 2026-11-04 | Content layer, images and CV implemented in Phase 06 | Owner approved: Phase 07 consumes a typed, tested content layer |
| 2026-11-04 | Temporary component preview at `/` with scoped light/dark panels | Owner approved; replaced in Phase 07 |
| 2026-11-04 | Favicon: Fraunces "MS" monogram, paper on ink, outlined paths | Owner approved; favicon only, not an identity change |
| 2026-11-04 | Social image generated in Phase 11; Phase 06 emits the OG/Twitter text (`card: summary`) | Owner refinement 1 |
| 2026-11-04 | Test worker limits: Vitest `maxWorkers: 2`, Playwright `workers: 1` | One worker per CPU exhausted memory on the development machine |
| 2026-11-04 | First-load JS guarded by `npm run size` in CI (fails > 150 KB gzip) | NFR-PERF-05; `noModule` polyfill excluded (never loaded by supported browsers) |
| 2026-11-04 | Phase 07: final nav and hero links from the start; missing targets allowed only for #projects, #testimonials (Phase 08) and #contact (Phase 09), enforced by E2E | Owner decision 1 (option A) with conditions |
| 2026-11-04 | Social links are text links (GitHub, LinkedIn, Email) everywhere; no brand logos | Owner decision 2: no permissively licensed LinkedIn mark exists |
| 2026-11-04 | Approved UI copy: Portfolio, Role, Based in, Experience, Primary; "Graduated {year}" taken from the resume wording | Owner decision 4 |
| 2026-11-04 | Menu trigger and close are 44 px icon buttons named with the approved "Open menu" / "Close menu" copy (instead of "Menu" / "Close" pill text) | Avoids adding unapproved visible copy; spec updated, owner may revise |
| 2026-11-04 | Server images via `getImageProps()` + `<img>` (ADR 0010 addendum) | About 6 KB less first-load JS than the `next/image` client component |
| 2026-11-04 | `agentRules: false` in `next.config.ts`; the auto-generated `AGENTS.md` is not committed | Next.js 16 `next dev` writes AI-agent instructions into the repo root by default; not an approved deliverable (owner may reverse) |
| 2026-11-04 | Test runner: Vitest (Jest-compatible API) | ADR 0007 |

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
| R12 | The asymmetric project grid can create awkward gaps with filtered subsets on tablet and desktop | Low | Layout by visible index; unpaired card spans 7; verify every filter state in Phase 08 | 08 |
| R13 | The skills strip adds motion and a control (WCAG 2.2.2) | Low | Pause control, static under reduced motion, `aria-hidden` duplicate; can be dropped without layout impact | 09 |
| R14 | TypeScript pinned below the latest major (7.x) | Low | ADR 0011; upgrade when typescript-eslint supports 7 | 06+ |
| R15 | Formspree account access unconfirmed (existing form `xleyzgzo`) | Medium | Owner confirms before Phase 09; fallback: new free form, config-only change | 09 |
| R16 | `'unsafe-inline'` scripts weaken CSP against inline injection | Low | No user content rendered; two reviewed inline uses only; Phase 11 evaluates replacing it with CSP hash sources (ADR 0008 evaluation plan) | 11 |
| R17 | Vercel plan limits, image-optimisation cost or acceptable-use terms may not fit | Medium | Verify against current terms in Phase 12; fallbacks: paid plan, pre-optimised images with `images.unoptimized`, or `output: 'export'` (ADR 0002, ADR 0010) | 12 |
| R18 | First-load JS (136.9 KB after Phase 06; **139.5 KB after Phase 07**) is above the 120 KB target, though within the 150 KB budget; the framework runtime dominates, and the Phase 08–09 islands (project gallery, contact form, theme toggle, active section, back-to-top, skills strip) add to it | Medium | CI budget gate (`npm run size`); server-rendered slots and `getImageProps()` patterns; keep islands small; review in Phase 11 | 08–11 |
| R19 | 17 moderate `npm audit` advisories in the ESLint dev toolchain (none in runtime deps) | Low | Not shipped to users; CI fails only on high or critical; re-check when updating the lint stack | 06+ |
| R20 | Local machine memory pressure caused a transient Turbopack build crash (`os error 1450`) and Vitest worker OOMs | Low | Worker limits set; retry succeeded; CI runners are unaffected | 06+ |
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
| 2026-11-03 | Phase 04: three visual directions presented on a canvas; owner selected A with C and B borrowings; content re-verified; five design documents written in `docs/design/`; PR opened for review |
| 2026-11-03 | Phase 04 approved by owner; PR #3 merged into `main`; branch `phase/04-design-system` deleted |
| 2026-11-04 | Phase 05: architecture documents and ADR 0001–0011 written in `docs/architecture/`; NFR-SEC-02 amended; PR opened for review |
| 2026-11-04 | PR #4 review clarifications: runtime-compute boundaries (ADR 0002, 0010, ARCHITECTURE §2.1); CSP hash sources vs SRI separated, plus a Phase 11 evaluation plan (ADR 0008, NFR-SEC-02); hosting plan deferred to Phase 12; ten-project invariant confirmed (no change) |
| 2026-11-04 | Phase 05 approved by owner; PR #4 merged into `main`; branch `phase/05-technical-architecture` deleted |
| 2026-11-04 | Phase 06: application foundation, design tokens, primitives, metadata, content layer, assets, temporary preview, tests and CI implemented on `phase/06-foundation`; documents reconciled; PR opened for review |
| 2026-11-04 | First CI run failed at the type check: the git-ignored `next-env.d.ts` (image-import declarations) did not exist on a clean checkout. Fixed with `typecheck: next typegen && tsc --noEmit`; the full pipeline was re-run on a fresh clone and CI now passes |
| 2026-11-04 | Phase 06 approved by owner; PR #5 merged into `main` (`agentRules: false` accepted with the merge); branch `phase/06-foundation` deleted |
| 2026-11-04 | Phase 07: site shell (header, mobile menu, footer) and sections Hero → 06 Education implemented on `phase/07-core-portfolio`, one commit per section, each tested; specs and docs updated; PR opened for review |
