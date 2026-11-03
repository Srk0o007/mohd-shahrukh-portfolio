# ADR 0011: Pin TypeScript to 6.0

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

**Registry state on 2026-11-03:**
- The `latest` TypeScript release is **7.0.2**: the native (Go) compiler, released 2026-07-08.
- `typescript-eslint` **8.72.1**, which `eslint-config-next` 16.4.5 depends on, declares `peerDependencies.typescript: ">=4.8.4 <6.1.0"`.
- The newest compatible release is **TypeScript 6.0.3** (2026-04-16).

Strict typing and linting are required (NFR-MNT-01/02).

## Decision

- Install **`typescript@6.0.3` (exact version)** as a dev dependency.
- Configure `tsconfig.json` per [ENGINEERING_GUIDELINES.md §2](../ENGINEERING_GUIDELINES.md#2-typescript).
- Re-evaluate when `typescript-eslint` adds TypeScript 7 support, and record the upgrade in a superseding ADR.

## Alternatives considered

| Option | Why not |
|---|---|
| TypeScript 7.0.2 | Breaks the supported `typescript-eslint` peer range; type-aware lint rules may fail or misbehave |
| Drop type-aware linting | Weakens NFR-MNT-02 |

## Consequences

- Fully supported, consistent tooling today.
- We miss TypeScript 7's faster type-checking for now, which matters little at this project's size.
- The pin is exact, so the upgrade is a deliberate, reviewed change.
