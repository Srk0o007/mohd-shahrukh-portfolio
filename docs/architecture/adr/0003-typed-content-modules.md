# ADR 0003: Typed content modules

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

Content is owned and edited by the developer-owner, changes rarely, and must stay faithful to verified sources (no fabrication).

**Requirements:**
- Content separated from components (NFR-MNT-03)
- Build-time validation (CONTENT_SCHEMA §15)
- Simple future edits, such as adding project URLs (Q11)

## Decision

- Store content as **TypeScript modules** in `src/content/`, typed by `src/content/types.ts` ([DATA_MODEL.md](../DATA_MODEL.md)) and declared with `as const satisfies T`.
- Enforce rules with:
  - TypeScript types (a discriminated union for project link status; template-literal URL types);
  - **Vitest invariant tests** (`content.test.ts`) that run in CI before the build.
- Reference images by static import inside the content modules.

## Alternatives considered

| Option | Why not |
|---|---|
| Headless CMS | External service, credentials and network fetches for content that changes a few times a year |
| MDX / Markdown with front-matter | Needs parsers and a schema-validation layer; the content is structured data, not prose |
| JSON files + Zod | JSON loses image imports and literal types; Zod adds a runtime dependency to validate data that types and tests already cover |

## Consequences

- No runtime dependency is added.
- Type errors surface in the editor.
- Content edits are code changes reviewed through PRs, which matches the approval-gated workflow.
- A non-developer editor is not supported (an accepted trade-off for a personal site).
