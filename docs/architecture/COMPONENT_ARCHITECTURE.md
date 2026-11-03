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
│   ├── ThemeToggle [C] {labels}
│   ├── ButtonLink "Download CV" {cv: CvDocument}
│   └── MobileMenu [C] {items, cv, social, labels}        (<1280, JS only)
├── children → HomePage [S]                       app/page.tsx
│   ├── Hero [S] {profile, cv}
│   ├── SkillsStrip [S] {skills: string[]}
│   │   └── SkillsStripControl [C] {labels}
│   ├── About [S] {profile, social}
│   ├── Services [S] {services}
│   ├── Experience [S] {experience}
│   │   └── ExperienceEntry [S] ×3
│   │       └── HighlightsDisclosure [C] {count, labels, children}
│   ├── Skills [S] {skillGroups}
│   ├── Certifications [S] {certifications}
│   ├── Education [S] {education}
│   ├── Projects [S] {heading}
│   │   └── ProjectGallery [C] {projects: ProjectView[], filters, labels}
│   │       ├── ProjectFilter {value, onChange, options}
│   │       └── ProjectCard ×n {project: ProjectView, layout: CardLayout}
│   │           └── CategoryTag {group}
│   ├── HireCta [S] {cta}
│   ├── Testimonials [S] {testimonials}
│   ├── Contact [S] {contact, social}
│   │   └── ContactForm [C] {endpoint, fields, copy}
│   └── PersonJsonLd [S] {profile, social}
├── SiteFooter [S] {footer, social}
├── BackToTop [C] {label}
└── ActiveSectionObserver [C] {sectionIds}               (renders nothing)
```

## 3. Client islands: contracts

| Island | Props (serialisable) | State | Behaviour and accessibility | Requirements |
|---|---|---|---|---|
| **ThemeToggle** | `labels: {toDark, toLight}` | `theme: 'light'\|'dark'` (initialised from `document.documentElement.dataset.theme`) | Toggles `data-theme` and `color-scheme`; persists to `localStorage['theme']` (try/catch); while no stored choice, listens to `matchMedia('(prefers-color-scheme: dark)')` changes; `aria-label` describes the action | FR-THM-01–04 |
| **MobileMenu** | `items`, `cv`, `social`, `labels` | `open: boolean` | Button with `aria-expanded`/`aria-controls`; on open: focus the first link, contain Tab, `inert` on `<main>`/footer, lock scroll; Esc/Close → close and return focus; selecting a link → close and let the anchor scroll | FR-NAV-02 |
| **ActiveSectionObserver** | `sectionIds: string[]` | none (DOM only) | One IntersectionObserver; sets `aria-current="true"` on the matching nav link (desktop and menu); maps legacy hashes (`#home → #top`, `#resume → #experience`, `#portfolio → #projects`, `#testimonial → #testimonials`) on load and `hashchange` | FR-NAV-04, FR-NAV-06 |
| **ProjectGallery** | `projects: ProjectView[]`, `filters: FilterOption[]`, `labels` | `filter: 'all'\|ProjectGroup` | Filter buttons with `aria-pressed`; `aria-live="polite"` status "Showing n of total projects"; layout from `projectLayout(index, breakpoint-agnostic)` → CSS classes; renders filter chips only after mount | FR-PRJ-01–07, DS-07 |
| **HighlightsDisclosure** | `total`, `visible` (default 4), `labels`, `children` (server-rendered `<li>`s) | `expanded` | Before hydration all items are shown; after mount, collapses to `visible` and renders a button with `aria-expanded` and `aria-controls`; keeps focus on the button | FR-RES-02, DS-13 |
| **SkillsStripControl** | `labels: {pause, play}` | `paused` | Toggles `data-paused` on the strip; IntersectionObserver starts motion only when ≥ 50% visible; not rendered under reduced motion (CSS hides it) | FR-INT-03/06, DS-12 |
| **ContactForm** | `endpoint`, `copy: ContactFormCopy`, `limits` | `status: 'idle'\|'sending'\|'success'\|'error'`, `errors: FieldErrors`, `submitted: boolean` | See §5 | FR-CON-02–07 |
| **BackToTop** | `label` | `visible` | IntersectionObserver on `#top`; renders `<a href="#top">`; respects reduced motion via CSS | FR-INT-05 |

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
  if honeypot filled → set success (silently drop)        // FR-CON-05
  const result = validateContact(formValues)              // lib, pure
  if (!result.ok) → setErrors, setSubmitted(true), focus first invalid; return
  setStatus('sending')
  try:
    res = await fetch(endpoint, { method:'POST', headers:{Accept:'application/json'}, body:new FormData(form) })
    res.ok ? (setStatus('success'), form.reset()) : setStatus('error')
  catch: setStatus('error')
```

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

`lib/project-layout.ts` is a pure function that maps a **visible index** to layout tokens. It is unit-tested for every filter state (all 10, 3, 7).

```ts
type CardLayout = {
  span: 'wide' | 'narrow'          // 7 or 5 columns at ≥1024
  offset: 'none' | 'sm' | 'lg'     // 0 / +64 / +96 px at ≥1024; +48 px for odd items at 768–1023
  frame: '16/10' | '4/3'
}
projectLayout(index: number, total: number): CardLayout
```

Image fit (`cover` vs `contain`) comes from the image's intrinsic ratio (DS-08), computed from `StaticImageData.width/height`, so there is no per-project flag.

## 8. Accessibility contracts (summary)

| Concern | Owner component |
|---|---|
| Single `h1` | `Hero` (`404`: `not-found.tsx`) |
| `h2` per section, `aria-labelledby` | `Section` + `SectionHeader` |
| Skip link → `#main` | `SkipLink` + `<main id="main" tabIndex={-1}>` |
| Focus visible everywhere | Global CSS (`:focus-visible`) |
| Focus not obscured | `scroll-padding-top` in `globals.css` |
| Reduced motion | Global CSS plus the islands that animate (strip, menu) |
| Live regions | `ProjectGallery` status, `FormStatus` |
| New-tab links | `ExternalLink` only |
