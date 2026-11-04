# Component Architecture

**Phase:** 05 — Technical Architecture
**Date:** 2026-11-04

Visual specifications live in [COMPONENT_VISUAL_SPEC.md](../design/COMPONENT_VISUAL_SPEC.md). This document defines **structure, boundaries, props and behaviour**. Types refer to [DATA_MODEL.md](DATA_MODEL.md).

---

## 1. Layers

| Layer | Folder | Knows about content? | May use hooks? | Examples |
|---|---|---|---|---|
| Routes | `src/app/` | Yes (composes) | No | `layout.tsx`, `page.tsx`, `not-found.tsx` |
| Sections | `components/sections/` | **Yes**, imports from `@/content` | No (server) | `Experience`, `Projects` |
| Feature components | `components/{layout,projects,experience,contact}/` | Via props only | Client islands only | `ProjectGallery`, `ContactForm` |
| UI primitives | `components/ui/` | **No** | No (except trivial) | `Button`, `SectionHeader`, icons |
| Logic | `lib/` | No (pure functions) | — | `validateContact`, `projectLayout` |

## 2. Component tree

Legend: `[C]` client component · `[S]` server component · `{props}` key props.

```
RootLayout [S]                                   app/layout.tsx
├── ThemeScript [S → inline <script>]
├── SkipLink [S]
├── SiteHeader [S]
│   ├── Wordmark (TextLink to #top)
│   ├── PrimaryNav [S] {items: NavItem[]}                 (visible ≥1280, and when no JS)
│   ├── ThemeToggle [C] {labels}                          (every width; also in the menu)
│   ├── ButtonLink "Download CV" {cv: CvDocument}
│   └── MobileMenu [C] {items, footer (server slot), labels}  (<1280, JS only)
├── children → HomePage [S]                       app/page.tsx
│   ├── Hero [S] {profile, cv}
│   ├── (SkillsStrip — not built: owner decision 2026-11-04, Phase 09)
│   ├── About [S] {profile, social}
│   ├── Services [S] {services}
│   ├── Experience [S] {experience}
│   │   └── ExperienceEntry [S] ×3
│   │       └── HighlightsDisclosure [C] {count, labels, children}
│   ├── Skills [S] {skillGroups}
│   ├── Certifications [S] {certifications}
│   ├── Education [S] {education}
│   ├── Projects [S] {heading}                          (ADR 0013)
│   │   └── ProjectGallery [C] {filters: FilterOption[], children}
│   │       └── <li> ×10 [S] (classes for every filter state)
│   │           └── ProjectCard [S] {project: ProjectView, frameClassName, sizes}
│   │               └── CategoryTag [S] {group, label}
│   ├── HireCta [S] {cta}
│   ├── Testimonials [S] {testimonials}
│   ├── Contact [S] {contact, social}
│   │   └── ContactForm [C] {endpoint, copy}
│   │       ├── FormField ×3, honeypot
│   │       └── FormStatus (role="status" / role="alert")
│   └── PersonJsonLd [S] {profile, social}              (Phase 11)
├── BackToTop [C] {label}                                (home page)
├── ActiveSectionObserver [C] {navIds}                   (home page; renders nothing)
└── SiteFooter [S] {footer, social}
```

## 3. Client islands: contracts

| Island | Props (serialisable) | State | Behaviour and accessibility | Requirements |
|---|---|---|---|---|
| **ThemeToggle** | `labels: {toDark, toLight}` | None in React. A module-level per-visit choice covers blocked storage. | Toggles `data-theme` and `color-scheme`; persists to `localStorage['theme']` (try/catch). The icon **and** the accessible name ("Switch to dark/light theme") are chosen by CSS from `data-theme` (`dark:` variants on `sr-only` spans), so they are right before hydration with no server/client mismatch. While no choice exists it follows `matchMedia('(prefers-color-scheme: dark)')`, re-syncing on mount to catch a change between paint and hydration. `js-only`. | FR-THM-01–04 |
| **MobileMenu** | `items`, `footer` (server-rendered CV, social links, theme toggle), `labels` | `open`, `currentId` | Button with `aria-expanded`/`aria-controls`; the overlay is a modal dialog (`role="dialog"`, `aria-modal`, named by the wordmark; Phase 10); on open: focus the first link, contain Tab, `inert` on everything else, lock scroll, mark the current section (`<html data-section>`); Esc/Close → close and return focus; selecting a link → close, scroll to and focus the section (`goToSection`) | FR-NAV-02, FR-NAV-04 |
| **ActiveSectionObserver** | `navIds: string[]` | none (DOM only) | IntersectionObserver on a reading line 40% down the viewport (plus the footer for the page end) → `currentSectionId()`; sets `aria-current="true"` on matching nav links and `<html data-section>` for the menu; sections without a nav item clear it; maps legacy hashes (`#home → #top`, `#resume → #experience`, `#portfolio → #projects`, `#testimonial → #testimonials`) on load and `hashchange` | FR-NAV-04, FR-NAV-06 |
| **ProjectGallery** | `filters: FilterOption[]` (value, label, pre-formatted status), `children` (server-rendered `<li>` cards) | `filter: 'all'\|ProjectGroup` | Writes `data-filter` on `<ul class="group/gallery">`; cards carry precomputed classes for every state (`layoutsByFilter` → `cardLayoutClasses`), so CSS shows and lays them out. Filter buttons with `aria-pressed`, focus stays on the button; `aria-live="polite"` status "Showing n of total projects". Chips are server-rendered in a `js-only` wrapper (no layout shift; hidden without JS). Amended by [ADR 0013](adr/0013-server-rendered-project-filter.md). | FR-PRJ-01–07, DS-07 |
| **HighlightsDisclosure** | `total`, `visible` (default 4), `labels`, `children` (server-rendered `<li>`s) | `expanded` | Before hydration all items are shown; after mount, collapses to `visible` and renders a button with `aria-expanded` and `aria-controls`; keeps focus on the button | FR-RES-02, DS-13 |
| **ContactForm** | `endpoint`, `copy: ContactFormCopy` (strings only; too-long messages pre-formatted per field) | `values`, `errors`, `attempted`, `status: 'idle'\|'sending'\|'success'\|'error'` | See §5 | FR-CON-02–07 |
| **BackToTop** | `label` | `visible` | Rendered inside `<main>` (landmark; Phase 10). IntersectionObserver on `#top`; `<a href="#top">`, `invisible` while hidden (not focusable); click → `goToSection('top')` (scroll, focus, hash); instant under reduced motion | FR-INT-05 |

**Hydration safety:** islands never read `window` or `localStorage` during render. They read in effects, or from attributes set by the pre-paint script. `<html>` carries `suppressHydrationWarning` because the script adds attributes before hydration.

## 4. UI primitives

| Primitive | API (sketch) | Notes |
|---|---|---|
| `Button` | `{variant: 'primary'\|'secondary', size: 'md'\|'lg', icon?, …ButtonHTMLAttributes}` | Always a `<button>`; `type="button"` by default |
| `ButtonLink` | `{href, variant, size, download?, …AnchorHTMLAttributes}` | `<a>` styled as a button (e.g. CV, `tel:`) |
| `TextLink` | `{href, arrow?: 'right'\|'external', children}` | Underline behaviour from the design system |
| `ExternalLink` | `{href, children}` | Forces `target="_blank" rel="noopener noreferrer"` plus `VisuallyHidden` "(opens in new tab)" (NFR-SEC-04, NFR-A11Y-12) |
| `Section` | `{id, labelledBy, index, children}` | `<section id aria-labelledby>` with rule and padding tokens |
| `SectionHeader` | `{index: string, eyebrow: string, heading: string, headingId: string, intro?}` | Renders "01 — About" label and `<h2>` (DS-02) |
| `Container` | `{children, as?}` | Grid margins and max width |
| `VisuallyHidden` | `{children}` | Screen-reader-only text |
| `Icon*` | `{size?: 16\|20\|24, title?}` | `aria-hidden` unless `title` is given |

Primitives accept `className` for layout only (spacing and placement), never for colours, so tokens stay centralised.

## 5. Contact form: internal design

```
type Status = 'idle' | 'sending' | 'success' | 'error'

onSubmit(e):
  e.preventDefault()
  if status === 'sending' → return                        // no double submit
  const result = validateContact(values)                  // lib/validate-contact.ts, pure
  if (!result.ok) → setErrors, setAttempted(true), focus first invalid; return
  setStatus('sending')
  outcome = await submitContact(endpoint, new FormData(form))   // lib/submit-contact.ts
  // 'success' only for HTTP 2xx + JSON {"ok": true}; non-2xx, other bodies, network
  // errors and a 15 s timeout are all 'error' (ADR 0006 implementation notes)
  outcome === 'success' ? (clear values, setStatus('success')) : setStatus('error')  // input kept
```

- **Honeypot:** `_gotcha` is always sent and Formspree discards filled submissions. The page never shows a success that did not happen (owner requirement); the Phase 05 sketch that faked success client-side was dropped.
- **No-JS:** `action`/`method="POST"` with native `required`; `noValidate` is applied only after hydration.

- **Field components:** `FormField` renders the label with the "(required)" suffix, the input, the error text (`id` linked with `aria-describedby`) and `aria-invalid`.
- **Validation trigger:** on submit. After the first submit attempt, also on blur and change (FR-CON-03).
- **Message counter:** passive "{n} / 5000" (DS-15); not in a live region.
- **`FormStatus`:** `role="status"` for success, `role="alert"` for error. The error text includes a `mailto:` link.
- **Double submit:** prevented by the `sending` state plus `aria-disabled` on the button.

## 6. Image sizes

| Context | `sizes` attribute | Loading |
|---|---|---|
| Portrait (hero) | `(min-width: 1280px) 400px, (min-width: 1024px) 30vw, (min-width: 768px) 36vw, min(100vw, 360px)` | `fetchPriority="high"`, `loading="eager"` |
| Project card, 7-col | `(min-width: 1280px) 760px, (min-width: 1024px) 56vw, (min-width: 768px) 46vw, 100vw` | lazy |
| Project card, 5-col | `(min-width: 1280px) 540px, (min-width: 1024px) 40vw, (min-width: 768px) 46vw, 100vw` | lazy |
| Testimonial photo | `56px` | lazy |

## 7. Project layout logic (DS-07)

`lib/project-layout.ts` is a pure function that maps a **visible index** to layout tokens. It is unit-tested for every filter state (all 10, 3, 7). `layoutsByFilter(items)` precomputes each item's layout in every state (`null` = hidden), which `components/projects/layout-classes.ts` turns into state-keyed Tailwind classes ([ADR 0013](adr/0013-server-rendered-project-filter.md)).

```ts
type CardLayout = {
  span: 'wide' | 'narrow'          // 7 or 5 columns at ≥1024
  offset: 'none' | 'sm' | 'lg'     // 0 / +64 / +96 px at ≥1024
  frame: '16/10' | '4/3'           // at ≥1024 (tablet 4:3, mobile 16:10)
  tabletShift: boolean             // +48 px for odd visible items at 768–1023
}
projectLayout(index: number, total: number): CardLayout
layoutsByFilter(items): Record<'all' | ProjectGroup, CardLayout | null>[]
```

Image fit (`cover` vs `contain`) comes from the image's intrinsic ratio (DS-08), computed from `StaticImageData.width/height`, so there is no per-project flag.

## 8. Accessibility contracts (summary)

| Concern | Owner component |
|---|---|
| Single `h1` | `Hero` (`404`: `not-found.tsx`) |
| `h2` per section, `aria-labelledby` | `Section` + `SectionHeader` |
| Skip link → `#main` | `SkipLink` + `<main id="main" tabIndex={-1}>` |
| Focus visible everywhere | Global CSS (`:focus-visible`) |
| Focus not obscured | `scroll-margin-top` on `main`/`footer` content in `globals.css` (not `scroll-padding` on `<html>`, which made focusing sticky-header controls scroll the page) |
| Reduced motion | Global CSS plus the islands that animate (strip, menu) |
| Live regions | `ProjectGallery` status, `FormStatus` |
| New-tab links | `ExternalLink` only |
