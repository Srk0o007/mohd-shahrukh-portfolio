# Mohd Shahrukh — Portfolio

Source code for the personal portfolio of **Mohd Shahrukh**, Software Development Engineer (Frontend).

- **Live site:** https://mohdshahrukh.in/
- **Status:** see [PROJECT_STATUS.md](PROJECT_STATUS.md)

This repository rebuilds the existing portfolio site on a modern, accessible and performance-focused stack while keeping all verified existing content.

## Target stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS](https://tailwindcss.com/)
- Semantic HTML, with a WCAG 2.2 AA accessibility target

## Roadmap

The project runs in 12 approval-gated phases:

| # | Phase |
|---|---|
| 01 | Repository & Project Initialization |
| 02 | Existing Website Investigation |
| 03 | Requirements & Content Specification |
| 04 | UI/UX Research & Design System |
| 05 | Technical Architecture |
| 06 | Foundation & Design System Implementation |
| 07 | Core Portfolio Development |
| 08 | Projects & Content Showcase |
| 09 | Contact & Interactive Features |
| 10 | Accessibility & Responsive Engineering |
| 11 | Performance, SEO & Quality Assurance |
| 12 | Deployment & Domain Configuration |

Details: [docs/ROADMAP.md](docs/ROADMAP.md). Process and conventions: [docs/ENGINEERING_WORKFLOW.md](docs/ENGINEERING_WORKFLOW.md).

## Getting started

> **Status:** Phase 09. The home page is complete: site header with theme switcher, mobile menu, Hero, About, Services, Experience, Skills, Certifications, Education, Projects (with filter), the hire band, Testimonials and Contact (Formspree form), plus current-section highlighting, legacy-anchor redirects and back-to-top. Accessibility hardening, performance/SEO and deployment follow in Phases 10–12.

### Prerequisites

- Node.js 24 (`nvm use` reads `.nvmrc`)
- npm
- Network access during `npm run build`: `next/font/google` fetches Fraunces and Inter at build time and self-hosts them. Browsers never contact Google Fonts.

### Install and run

```bash
npm ci                 # install exact locked dependencies
npm run dev            # development server on http://localhost:3000
npm run build          # production build (all routes are statically prerendered)
npm run start          # serve the production build
```

### Quality checks

| Command | What it does |
|---|---|
| `npm run check` | Format check, lint, type check and unit/component tests |
| `npm run lint` | ESLint 9 (Next.js core-web-vitals + TypeScript + jsx-a11y) |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` (TypeScript 6.0.3, strict) |
| `npm test` | Vitest unit, component and content-invariant tests |
| `npm run size` | First-load JS budget for `/` (run after `build`) |
| `npm run test:e2e` | Playwright E2E + axe accessibility scans (run after `build`; first time: `npx playwright install chromium`) |

CI (`.github/workflows/ci.yml`) runs all of the above on every pull request, plus `npm audit --audit-level=high`.

### Updating content

All copy, links and images live in `src/content/` (typed, single source). For example, when a re-deployed project gets a URL, set `linkStatus: 'live'` and `url` on its entry in `src/content/projects.ts`; no component changes are needed. The card then shows "Visit … website ↗" and the hover zoom automatically. Also update the approved link statuses in `src/content/content.test.ts` (I-2/I-3), which pin which projects are live. The content tests (`src/content/content.test.ts`) guard the approved facts: ten projects, employment dates, and the owner decisions.

## Repository structure

```
.
├── .github/                  # PR template, CI workflow
├── src/
│   ├── app/                  # Routes, root layout, metadata files, globals.css (tokens)
│   ├── components/           # ui/ primitives, layout/ (header, menu, footer), sections/, experience/
│   ├── content/              # Typed content (single source) + invariant tests
│   ├── config/               # Public, non-secret site configuration
│   ├── lib/                  # Pure helpers (cn, dates, theme script)
│   └── assets/images/        # Verified images from the live site
├── public/                   # CV PDF (03 Nov 2026)
├── tests/                    # Playwright e2e/ and a11y/ specs, Vitest setup
├── scripts/                  # check-bundle-size.mjs
├── docs/
│   ├── architecture/         # Phase 05: technical architecture
│   │   ├── ARCHITECTURE.md
│   │   ├── FOLDER_STRUCTURE.md
│   │   ├── COMPONENT_ARCHITECTURE.md
│   │   ├── DATA_MODEL.md
│   │   ├── ENGINEERING_GUIDELINES.md
│   │   └── adr/              # Architecture decision records 0001–0013
│   ├── audit/                # Phase 02: audit and inventories of the existing site
│   │   ├── WEBSITE_AUDIT.md
│   │   ├── CONTENT_INVENTORY.md
│   │   ├── ASSET_INVENTORY.md
│   │   ├── SECTION_MAPPING.md
│   │   └── REFERENCE_DESIGN_ANALYSIS.md
│   ├── design/               # Phase 04: design direction and design system
│   │   ├── DESIGN_DIRECTION.md
│   │   ├── DESIGN_SYSTEM.md
│   │   ├── COLOR_TOKENS.md
│   │   ├── TYPOGRAPHY.md
│   │   └── COMPONENT_VISUAL_SPEC.md
│   ├── requirements/         # Phase 03: product specification
│   │   ├── PRD.md
│   │   ├── FUNCTIONAL_REQUIREMENTS.md
│   │   ├── NON_FUNCTIONAL_REQUIREMENTS.md
│   │   ├── CONTENT_SCHEMA.md
│   │   └── ACCEPTANCE_CRITERIA.md
│   ├── ROADMAP.md            # 12-phase roadmap with exit criteria
│   └── ENGINEERING_WORKFLOW.md
├── PROJECT_STATUS.md         # Live phase tracker, decisions, risks
└── README.md
```

## License

**All rights reserved.** © 2026 Mohd Shahrukh.

This repository is public for transparency and portfolio purposes only. No license is granted to copy, modify or redistribute its code, content, images or resume.
