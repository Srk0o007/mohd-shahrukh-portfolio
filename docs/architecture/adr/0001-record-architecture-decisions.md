# ADR 0001: Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-11-04
- **Deciders:** Owner (Mohd Shahrukh), engineering lead

## Context

The project runs in approval-gated phases. Architectural choices must be traceable and reviewable, and they must be revisitable without archaeology.

## Decision

Record significant decisions as lightweight Architecture Decision Records in `docs/architecture/adr/`. Each file is named `NNNN-kebab-title.md`.

**Sections:**
- Status (Proposed / Accepted / Superseded by NNNN / Deprecated)
- Date
- Context
- Decision
- Alternatives considered
- Consequences

**Rules:**
- A new runtime dependency, a change to security headers, a rendering-mode change or a requirement amendment **requires** an ADR.
- Accepted ADRs are not edited for substance; a new ADR supersedes them.

## Alternatives considered

- **Decisions only in PROJECT_STATUS.md:** too terse for rationale and trade-offs.
- **Wiki or issues:** live outside the repository and drift from the code.

## Consequences

- Every Phase 05+ decision has a citable ID (e.g. "ADR 0008").
- PROJECT_STATUS.md's decisions log links to ADRs instead of repeating them.

## Index

| ADR | Title | Status |
|---|---|---|
| 0001 | Record architecture decisions | Accepted |
| 0002 | Static prerendering on Vercel | Accepted |
| 0003 | Typed content modules | Accepted |
| 0004 | Tailwind CSS v4 with design tokens | Accepted |
| 0005 | Custom theme script | Accepted |
| 0006 | Formspree contact form with progressive enhancement | Accepted |
| 0007 | Testing stack: Vitest and Playwright | Accepted |
| 0008 | CSP for statically rendered pages | Accepted (amends NFR-SEC-02) |
| 0009 | Inline SVG icons | Accepted |
| 0010 | Image handling | Accepted |
| 0011 | Pin TypeScript to 6.0 | Accepted |
| 0012 | Use ESLint 9 | Accepted |
