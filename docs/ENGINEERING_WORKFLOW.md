# Engineering Workflow

This document defines how the project is executed. It applies to every phase in the [roadmap](ROADMAP.md).

## Engineering principles

- Production-quality, modular and reusable components
- Lightweight architecture, with no unnecessary dependencies
- Accessibility-first (WCAG 2.2 AA target) and performance-first
- TypeScript strict mode and semantic HTML
- **No fabricated personal information.** All content must trace back to the verified existing website or be supplied by the owner.
- Preserve all verified content from the existing website

## Phase execution process

Every phase follows these steps in order:

1. **Investigate.** Inspect the current state before changing anything.
2. **Explain** findings and recommendations.
3. **Identify** risks and dependencies.
4. **Plan.** Present a clear implementation plan.
5. **Approval gate.** Wait for explicit approval.
6. **Implement** only the approved scope.
7. **Validate.** Run the relevant checks (lint, typecheck, build, tests, a11y).
8. **Document.** Update the docs and [PROJECT_STATUS.md](../PROJECT_STATUS.md).
9. **Stop.** The next phase needs its own explicit approval.

## Branching

- `main` is always in a releasable, documented state.
- Phase work happens on `phase/NN-short-slug` branches (for example, `phase/02-website-investigation`).
- A branch merges into `main` through a pull request once its phase is approved and validated. The PR template is in [.github/pull_request_template.md](../.github/pull_request_template.md).

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <summary>
```

| Type | Use for |
|---|---|
| `feat` | New user-facing functionality |
| `fix` | Bug fixes |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `build` | Build system or dependencies |
| `ci` | CI configuration |
| `chore` | Maintenance and repository housekeeping |

## Tooling baseline

| Concern | Choice |
|---|---|
| Node.js | v24 (see `.nvmrc`) |
| Package manager | npm |
| Line endings | LF, enforced via `.gitattributes` |
| Editor settings | `.editorconfig` |

Lint, format, typecheck and test tooling is introduced in Phase 06 and documented here at that point.
