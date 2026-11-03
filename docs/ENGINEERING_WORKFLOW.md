# Engineering Workflow

This document defines how the project is executed. It applies to every phase in the [roadmap](ROADMAP.md).

## Engineering principles

- Production-quality, modular and reusable components
- Lightweight architecture, with no unnecessary dependencies
- Accessibility-first (WCAG 2.2 AA target) and performance-first
- TypeScript strict mode and semantic HTML
- **No fabricated personal information.** All content must trace back to the verified existing website or be supplied by the owner.
- Preserve all verified content from the existing website

## Execution strategy

Every phase follows the same controlled workflow:

| Step | Name | What it means |
|---|---|---|
| 01 | **Investigate** | Understand the existing state and gather evidence. |
| 02 | **Propose** | Present the solution, decisions and trade-offs. |
| 03 | **Wait for approval** | No implementation without approval. |
| 04 | **Implement** | Work in small, reviewable steps. |
| 05 | **Validate & Handover** | Test, document, record decisions and obtain approval for the next phase. |

Approval of one phase never authorizes the next phase.

## Project status tracking

[PROJECT_STATUS.md](../PROJECT_STATUS.md) is kept up to date throughout the project. It records:

- Completed phases
- Pending work
- Decisions
- Blockers
- The next approved action

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
