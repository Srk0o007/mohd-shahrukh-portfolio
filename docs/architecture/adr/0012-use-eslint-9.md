# ADR 0012: Use ESLint 9

- **Status:** Accepted (owner decision, 2026-11-04)
- **Date:** 2026-11-04

## Context

Phase 05 listed `eslint` without a major version; the registry's `latest` is **10.14.0**. `eslint-config-next@16.4.5` bundles several plugins, and on 2026-11-04 these declared the following `eslint` peer ranges:

| Plugin (bundled by `eslint-config-next`) | Version | `peerDependencies.eslint` | Supports ESLint 10? |
|---|---|---|---|
| `eslint-plugin-react` | 7.37.5 | `^3 \|\| … \|\| ^9.7` | **No** |
| `eslint-plugin-jsx-a11y` | 6.10.2 | `^3 \|\| … \|\| ^9` | **No** |
| `eslint-plugin-import` | 2.32.0 | `^2 \|\| … \|\| ^9` | **No** |
| `eslint-plugin-react-hooks` | 7.1.1 | `… \|\| ^9.0.0 \|\| ^10.0.0` | Yes |
| `eslint-config-prettier` | 10.1.8 | `>=7.0.0` | Yes |

The Next.js ESLint docs confirm: "Some of the plugins included in `eslint-config-next` don't list ESLint 10 in their peer dependencies yet, so your package manager may show peer dependency warnings, or fail when strict peer dependencies are enabled." npm (v7+) treats such conflicts as install errors (`ERESOLVE`).

## Decision

- Install **`eslint@9.39.5`**, the latest 9.x release, which every bundled plugin supports. Use a caret range within 9.x (`^9.39.5`).
- Use the flat config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`, the `jsx-a11y` recommended rules as errors, and `eslint-config-prettier/flat`.
- **Do not** use `--legacy-peer-deps`, `--force` or `overrides` to bypass the peer ranges.
- TypeScript stays pinned at exactly **6.0.3** ([ADR 0011](0011-pin-typescript-6.md)).

## Alternatives considered

| Option | Why not |
|---|---|
| ESLint 10 + `--legacy-peer-deps` / `overrides` | Hides real incompatibilities; every `npm ci` must carry the flag; plugins may break at runtime |
| Use `@next/eslint-plugin-next` alone without the bundled config | Loses React, hooks and accessibility rule sets, weakening NFR-MNT-02 |

## Consequences

- A clean, supported install with no peer-dependency workarounds.
- **Re-evaluate** when `eslint-plugin-react`, `eslint-plugin-jsx-a11y` and `eslint-plugin-import` declare ESLint 10 support; the upgrade is recorded in a superseding ADR.
