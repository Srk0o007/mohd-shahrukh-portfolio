# Project Roadmap

**Mohd Shahrukh Portfolio — 2026 · Full-stack frontend engineering project**

The project runs in 12 sequential phases, with an approval gate on every phase:

> Each phase starts only after **explicit approval**. Approval of one phase never authorizes the next one.
> See [ENGINEERING_WORKFLOW.md](ENGINEERING_WORKFLOW.md) for the process every phase follows.

Live status is tracked in [PROJECT_STATUS.md](../PROJECT_STATUS.md).

---

## Phase 01 — Repository & Project Initialization

GitHub repository, project setup, baseline configuration.

- **Exit criteria:** repository pushed with baseline docs, git/editor configuration, conventions and a status tracker.

## Phase 02 — Existing Website Investigation

Inspect current portfolio, identify every section, content, asset and interaction.

- **Exit criteria:** a complete, verified inventory of the content, assets, links and interactions on https://mohdshahrukh.in/.

## Phase 03 — Requirements & Content Specification

Define functional requirements, content inventory and acceptance criteria.

- **Exit criteria:** approved requirements document and content specification, with acceptance criteria for each section.

## Phase 04 — UI/UX Research & Design System

Analyze references, visual direction, typography, colors, grids and responsive behavior.

- **Exit criteria:** approved design direction and design-token specification (type scale, color, spacing, grid, breakpoints, motion).

## Phase 05 — Technical Architecture

Next.js architecture, component hierarchy, data models, routing and engineering standards.

- **Exit criteria:** approved architecture document covering folder structure, component tree, typed content models and coding standards.

## Phase 06 — Foundation & Design System Implementation

Initialize Next.js, TypeScript, Tailwind, fonts, tokens and reusable primitives.

- **Exit criteria:** app builds; lint and typecheck pass; tokens and primitives are implemented.

## Phase 07 — Core Portfolio Development

Build navigation, hero, about, services, resume, skills and certifications.

- **Exit criteria:** core sections are rendered from typed content and meet the acceptance criteria.

## Phase 08 — Projects & Content Showcase

Build the portfolio grid, project details, endorsements and hiring CTA.

- **Exit criteria:** projects, testimonials and the hire CTA are complete and meet the acceptance criteria.

## Phase 09 — Contact & Interactive Features

Contact form, validation, theme switching, navigation and interaction states.

- **Exit criteria:** the contact form works with accessible validation, theme switching persists, and all interaction states are implemented.

## Phase 10 — Accessibility & Responsive Engineering

WCAG 2.2 AA target, keyboard accessibility, screen readers, mobile and tablet testing.

- **Exit criteria:** accessibility audit with no open AA issues, and responsive QA signed off.

## Phase 11 — Performance, SEO & Quality Assurance

Lighthouse, Core Web Vitals, metadata, testing, security and production build.

- **Exit criteria:** performance and SEO targets met, tests passing, production build verified, and the CSP hash-source evaluation completed and recorded ([ADR 0008](architecture/adr/0008-csp-for-static-pages.md)).

## Phase 12 — Deployment & Domain Configuration

Vercel deployment, Hostinger DNS, custom domain, SSL and production verification.

- **Exit criteria:** site is live on https://mohdshahrukh.in/ over HTTPS, and production is verified. Before go-live, the hosting plan is confirmed against Vercel's current usage limits, image-optimisation pricing and acceptable-use terms ([ADR 0002](architecture/adr/0002-static-prerendering-on-vercel.md)).
