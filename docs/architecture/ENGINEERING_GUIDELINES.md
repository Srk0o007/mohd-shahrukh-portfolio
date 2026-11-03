# Engineering Guidelines

**Phase:** 05 — Technical Architecture
**Date:** 2026-11-04

These guidelines apply to all code from Phase 06 onward. They complement [ENGINEERING_WORKFLOW.md](../ENGINEERING_WORKFLOW.md), which covers process, branches and commits.

---

## 1. Toolchain

| Tool | Version policy |
|---|---|
| Node.js | 24 (`.nvmrc`); `engines.node: ">=24"` |
| npm | Lockfile committed; `npm ci` in CI |
| Next.js / React | Caret ranges on the current minor (`next@^16.4`, `react@^19.3`) |
| TypeScript | **Exact `6.0.3`** until `typescript-eslint` supports 7.x ([ADR 0011](adr/0011-pin-typescript-6.md)) |
| Others | Caret ranges; Renovate or Dependabot is not added in v1 (manual monthly check) |

### Scripts (`package.json`)

| Script | Command |
|---|---|
| `dev` | `next dev` |
| `build` | `next build` |
| `start` | `next start` |
| `lint` | `eslint .` |
| `typecheck` | `tsc --noEmit` |
| `format` / `format:check` | `prettier --write .` / `prettier --check .` |
| `test` | `vitest run` |
| `test:watch` | `vitest` |
| `test:e2e` | `playwright test` |
| `check` | `npm run format:check && npm run lint && npm run typecheck && npm test` |

## 2. TypeScript

`tsconfig.json` essentials:

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "verbatimModuleSyntax": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

**Rules:**
- No `any`. Use `unknown` and narrow. A justified exception needs an inline `// eslint-disable-next-line` with a reason.
- Prefer `type` imports (`import type`).
- Props are named `XxxProps` and defined in the component file.
- No enums; use string-literal unions.
- No non-null assertions (`!`) except on DOM refs, with a comment.
- Content uses `as const satisfies T` ([DATA_MODEL.md](DATA_MODEL.md)).

## 3. React and Next.js

| Rule | Detail |
|---|---|
| Server first | A component is a Server Component unless it needs state, effects, events or browser APIs |
| Islands | `'use client'` at the top; serialisable props only; keep them leaf-level |
| No data fetching | Content is imported; there is no `fetch` at runtime except the contact form submit |
| Effects | Only for subscriptions (IntersectionObserver, matchMedia) and DOM focus; always clean up |
| Keys | Stable IDs from content, never array indices for reorderable lists |
| `next/image` | Always via static import; `alt` from content; `sizes` per [COMPONENT_ARCHITECTURE.md §6](COMPONENT_ARCHITECTURE.md#6-image-sizes); `fetchPriority="high"` + `loading="eager"` only for the LCP portrait (`priority` is deprecated in Next 16) |
| `next/link` | Not needed for in-page anchors; plain `<a href="#id">`. Use `Link` only for `/` on the 404 page |
| Metadata | Only via the `metadata`/`viewport` exports and file conventions; never hand-written `<head>` tags except `ThemeScript` |
| Rendering check | `next build` output must list `/` as static (○); a dynamic route is a regression |
| No `dangerouslySetInnerHTML` | Except `ThemeScript` (a static string constant) and the JSON-LD (`JSON.stringify` of typed content) |

## 4. Styling (Tailwind v4)

| Rule | Detail |
|---|---|
| Tokens only | Colours, fonts, type scale, spacing and radii come from `@theme` tokens; the default palette is removed (`--color-*: initial`) |
| No arbitrary colours | `bg-[#123456]` is forbidden (lint via review) |
| Dark mode | `dark:` variant bound to `[data-theme=dark]` |
| Motion | Transitions use the motion tokens; every animation has a `motion-reduce:` counterpart |
| Class order | `prettier-plugin-tailwindcss` sorts classes |
| Composition | `cn()` (local helper) for conditional classes; no `clsx` or `tailwind-merge` dependency |
| No inline styles | Except dynamic CSS variables (e.g. `--offset`) |

## 5. Accessibility (non-negotiable)

- Semantic elements first (`button`, `a`, `nav`, `section`, `ul`, `dl`, `figure`); ARIA only to fill gaps.
- Every interactive element is keyboard-operable with a visible focus ring; targets ≥ 44 px.
- Every image has an `alt` from content; decorative SVGs are `aria-hidden`.
- Never convey information by colour alone.
- New-tab links only through `ExternalLink`.
- Run the axe E2E checks locally before opening a PR that changes UI.
- Lint: `jsx-a11y` recommended rules are errors.

## 6. Testing

| Kind | Location | Conventions |
|---|---|---|
| Unit | `src/lib/*.test.ts`, `src/content/content.test.ts` | Pure functions; table-driven cases |
| Component | `src/components/**/X.test.tsx` | Testing Library queries by **role/name** (never by class or test-id unless unavoidable); `user-event` for interaction |
| E2E | `tests/e2e/*.spec.ts` | One spec per flow (navigation, projects, contact, theme, no-JS); Formspree mocked with `page.route` |
| Accessibility | `tests/a11y/*.spec.ts` | `AxeBuilder` with WCAG 2.2 AA tags; both themes; 375 and 1280 px |

**Minimum coverage expectations (not a numeric gate):** every client island has component tests for its keyboard and ARIA behaviour, and every `lib` function has unit tests.

**Acceptance mapping:** test names reference scenario IDs from [ACCEPTANCE_CRITERIA.md](../requirements/ACCEPTANCE_CRITERIA.md), e.g. `test('AC-PRJ-2 filters to enterprise products', …)`.

## 7. Code style

| Item | Convention |
|---|---|
| Formatting | Prettier (2 spaces, single quotes, no semicolons, trailing commas, 100 columns) |
| Files | Components `PascalCase.tsx`; everything else `kebab-case.ts` |
| Exports | Named exports only (except Next route files, which need default exports) |
| Comments | Explain *why*, not *what*; reference requirement or decision IDs where relevant (`// FR-PRJ-03`) |
| Strings | User-facing text only from `@/content` (no literals in components except ARIA glue already in `UiCopy`) |

## 8. Security

- No secrets in the repo; public config lives in `src/config/site.ts`.
- `npm audit --audit-level=high` must pass in CI.
- Never render user input; never use `eval` or `new Function`.
- Security headers are changed only via `next.config.ts`, and only with an ADR update.

## 9. Performance budgets (checked in review and later in Lighthouse CI)

| Budget | Limit |
|---|---|
| First-load JS for `/` | ≤ 150 KB gzip (target ≤ 120) |
| Client islands | Each ≤ 5 KB gzip of own code |
| Fonts | 2 files |
| Third-party requests at load | 0 |

## 10. Pull request checklist (in addition to the template)

- [ ] Requirement IDs listed; only approved scope
- [ ] `npm run check` passes locally; the build marks `/` static
- [ ] New UI: keyboard pass, both themes, 320 / 768 / 1280 px, reduced motion
- [ ] No new runtime dependency (or an ADR is included)
- [ ] Docs and PROJECT_STATUS.md updated
