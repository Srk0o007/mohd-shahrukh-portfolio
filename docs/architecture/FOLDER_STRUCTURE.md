# Folder Structure

**Phase:** 05 — Technical Architecture
**Date:** 2026-11-04

This is the target layout created in Phase 06. Files marked `(later)` arrive in the phase noted.

```
mohd-shahrukh-portfolio/
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
│       └── ci.yml                       # format, lint, typecheck, test, build, e2e (Phase 06)
├── docs/                                # audit, requirements, design, architecture (+ adr/), quality
├── public/
│   └── Mohd_Shahrukh_Resume_03_Nov_2026.pdf   # CV (FR-RES-06)
├── src/
│   ├── app/                             # Next.js App Router (routes + route files only)
│   │   ├── layout.tsx                   # <html>, ThemeScript, fonts, metadata, header/footer
│   │   ├── page.tsx                     # composes the sections; JSON-LD
│   │   ├── not-found.tsx                # 404 (FR-ERR-01)
│   │   ├── error.tsx                    # segment error boundary (client)
│   │   ├── global-error.tsx             # root error boundary (client)
│   │   ├── globals.css                  # Tailwind import, tokens, base styles, no-JS rules
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── manifest.ts
│   │   ├── opengraph-image.tsx          # 1200×630, built once (later: Phase 11)
│   │   ├── icon.svg
│   │   └── apple-icon.png               # (later: Phase 11)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SiteHeader.tsx
│   │   │   ├── PrimaryNav.tsx
│   │   │   ├── MobileMenu.tsx           # client
│   │   │   ├── ThemeScript.tsx          # inline pre-paint script
│   │   │   ├── ThemeToggle.tsx          # client; label/icon chosen by CSS from data-theme
│   │   │   ├── ActiveSectionObserver.tsx # client
│   │   │   ├── SiteFooter.tsx
│   │   │   ├── SocialLinks.tsx          # text-labelled social links (pure; also used in the menu)
│   │   │   ├── CvLink.tsx               # CV download link (header, menu, Experience)
│   │   │   ├── SkipLink.tsx
│   │   │   └── BackToTop.tsx            # client
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Experience.tsx           # uses HighlightsDisclosure (client)
│   │   │   ├── Skills.tsx
│   │   │   ├── Certifications.tsx
│   │   │   ├── CredentialRow.tsx        # shared row + section for Certifications / Education
│   │   │   ├── Education.tsx
│   │   │   ├── Projects.tsx             # server: builds ProjectViews + layouts; cards as children
│   │   │   ├── HireCta.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── Contact.tsx              # server shell + ContactForm (client)
│   │   ├── projects/                    # ADR 0013
│   │   │   ├── ProjectGallery.tsx       # client: filter chips + status + <ul data-filter>
│   │   │   ├── ProjectCard.tsx          # server
│   │   │   ├── CategoryTag.tsx
│   │   │   └── layout-classes.ts        # per-filter-state Tailwind classes (DS-07)
│   │   ├── experience/
│   │   │   ├── ExperienceEntry.tsx
│   │   │   └── HighlightsDisclosure.tsx # client
│   │   ├── contact/
│   │   │   ├── ContactForm.tsx          # client
│   │   │   ├── FormField.tsx
│   │   │   └── FormStatus.tsx
│   │   └── ui/                          # design-system primitives (no content imports)
│   │       ├── Button.tsx               # <button> variants
│   │       ├── ButtonLink.tsx           # <a> styled as a button
│   │       ├── TextLink.tsx
│   │       ├── ExternalLink.tsx         # enforces rel + new-tab announcement
│   │       ├── SectionHeader.tsx
│   │       ├── Section.tsx
│   │       ├── Container.tsx
│   │       ├── VisuallyHidden.tsx
│   │       ├── ResponsiveImage.tsx      # getImageProps() + <img> (no client JS; ADR 0010 addendum)
│   │       └── icons/                   # one file per icon (inline SVG) + index.ts + LICENSES.md
│   ├── content/                         # SINGLE content source (DATA_MODEL.md)
│   │   ├── types.ts
│   │   ├── site.ts                      # SiteMeta, nav, section headings
│   │   ├── profile.ts
│   │   ├── services.ts
│   │   ├── experience.ts
│   │   ├── skills.ts
│   │   ├── certifications.ts
│   │   ├── education.ts
│   │   ├── projects.ts
│   │   ├── testimonials.ts
│   │   ├── contact.ts                   # contact details, social links, CTA band, footer
│   │   ├── ui-copy.ts                   # UiCopy
│   │   ├── index.ts
│   │   └── content.test.ts              # invariants (Vitest)
│   ├── config/
│   │   └── site.ts                      # siteUrl, form endpoint, CV path (non-secret)
│   ├── lib/                             # framework-free, pure, unit-tested
│   │   ├── cn.ts                        # tiny className joiner (no dependency)
│   │   ├── dates.ts                     # YearMonth → "May 2024", <time> values
│   │   ├── project-layout.ts            # visible index → spans/offsets, per filter state (DS-07)
│   │   ├── project-view.ts              # Project → ProjectView; image fit (DS-08)
│   │   ├── validate-contact.ts          # FR-CON-03 rules
│   │   ├── submit-contact.ts            # Formspree POST; success only on 2xx + ok:true (ADR 0006)
│   │   ├── section-nav.ts               # goToSection, current section, legacy anchors
│   │   ├── theme.ts                     # pre-paint script; storage and apply helpers
│   │   ├── links.ts                     # siteAnchor("#id") → "/#id"; anchorId()
│   │   └── *.test.ts                    # colocated unit tests
│   └── assets/
│       ├── images/
│       │   ├── portrait/headshot.png
│       │   ├── projects/<project-id>.png  # renamed from the live site
│       │   └── testimonials/<name>.(png|jpg)
│       └── fonts/                       # Fraunces TTF + OFL.txt for the OG image only (later: Phase 11)
├── tests/
│   ├── e2e/                             # Playwright specs (navigation, projects, contact, theme, no-js)
│   ├── a11y/                            # axe scans
│   └── setup/                           # Vitest setup (jest-dom matchers)
├── scripts/
│   └── check-bundle-size.mjs            # first-load JS budget check (Phase 06)
├── eslint.config.mjs
├── next.config.ts                       # headers (CSP), images
├── postcss.config.mjs
├── prettier.config.mjs
├── playwright.config.ts
├── vitest.config.mts
├── tsconfig.json
├── package.json / package-lock.json
├── .nvmrc  .editorconfig  .gitattributes  .gitignore
├── README.md  PROJECT_STATUS.md
```

## Rules

| Rule | Detail |
|---|---|
| `app/` holds route files only | No reusable components in `app/` |
| Dependency direction | `app → components/sections → components/{projects,experience,contact,layout} → components/ui → lib`. `content` is imported by `app` and `components/sections`/`layout` only; `ui` and `lib` never import `content`. |
| Client islands | Must start with `'use client'`, live next to their feature, and never import server-only modules |
| One component per file | PascalCase filename = export name |
| Tests | Unit and component tests colocated as `*.test.ts(x)`; E2E and a11y under `tests/` |
| Path alias | `@/*` → `src/*` |
| Assets | Lowercase kebab-case filenames; no spaces or parentheses |
| Generated files | `.next/`, `next-env.d.ts`, `test-results/`, `playwright-report/`, `coverage/` are git-ignored (already in `.gitignore`) |
