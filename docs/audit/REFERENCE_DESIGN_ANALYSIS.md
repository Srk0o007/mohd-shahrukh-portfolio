# Reference Design Analysis

**Phase:** 02 — Existing Website Investigation
**Date:** 2026-11-03
**Reference:** https://designerankitsinha.web.app/index.html

**Purpose:** extract **design patterns and principles** to inform Phase 04 (UI/UX Research & Design System).

**Ground rules:**
- The reference belongs to another person. **No content, copy, images, logos, code or assets** are taken from it.
- Its markup carries template documentation comments and a consistent `tt-` component prefix, which indicates it is built on a **commercial HTML template**. Its source code and stylesheets must not be reused; only general, widely used patterns are adopted, re-implemented from scratch.
- Everything is re-implemented to meet WCAG 2.2 AA, which the reference does not.

---

## 1. Method and limitations

- Analysed the raw HTML (about 115 KB) and the main theme stylesheet (`assets/css/theme.css`, about 208 KB): tokens, component inventory, breakpoints and interaction hooks.
- Headless Chrome captures at 375 and 1440 px (with up to a 30 s budget) show **only the preloader**. The page keeps its content hidden until its scripts finish, so visual observations come from code, not pixels. A manual browser review in Phase 04 is recommended.

---

## 2. Page structure

| # | Section | Pattern |
|---|---|---|
| 0 | Preloader + page transition | Full-screen dark loader with a circular logo mark |
| 1 | Header | Logo (light/dark variants) + a "Menu" text toggle that opens a **full-screen overlay menu** with collapsible sub-groups and social links |
| 2 | Hero / page header | **Text-first**: one oversized statement sentence, a large "ghost" word behind it, and an animated "scroll down" cue. No photo. |
| 3 | Portfolio grid | Large image-led project cards (16 items), each with image, title, short category line and a "View Project" cursor label; cards link to external case studies |
| 4 | Capabilities | Section eyebrow + large heading + intro paragraph, followed by an **accordion** of 14 capability items (title → expandable description) |
| 5 | Scrolling text | Two oversized **marquee strips** of keyword phrases separated by arrows, moving in opposite directions |
| 6 | Collaborations | Logo wall of companies or clients |
| 7 | Testimonials | Slider with quote, name and role; prev/next arrows and pagination |
| 8 | Personal gallery | Photo gallery ("the face behind the pixels") |
| 9 | Contact | Big CTA heading, contact info list, social links |
| 10 | Footer | "Back to Top" text link, social links, attribution |

---

## 3. Visual language (design tokens)

| Token | Reference value | Observation |
|---|---|---|
| Background | `#0a0a0a` (near-black) | Dark-first design |
| Accent | `#b12c0d` (rust red) | Used sparingly |
| Text | `#fff`; secondary `#999` / `#ccc` | High contrast |
| Body font | Poppins, **19px / 1.6** | Large, comfortable body size |
| Display / label font | **Syne** (400–800) | Labels, buttons, marquee, pagination: a distinctive "editorial" voice |
| Hero title | `clamp(38px, 5vw, 82px)`, weight 600 | Fluid type scale |
| XL section heading | `calc(24px + 3vw)`, line-height 1.2 | Fluid |
| Outline ("stroke") text | `-webkit-text-stroke` with transparent fill | Decorative ghost and outline headings |
| Container | Boxed, `max-width: 1282px`, 15px gutters | |
| Breakpoints | 767/768, 1024/1025, 1400 | Tablet threshold at 1024 |
| Theme | Dark by default; `-light` / `-dark` logo variants and a "light background" mode class | Theme-aware assets |

### Contrast check (computed)

| Pair | Ratio | Result |
|---|---|---|
| `#fff` on `#0a0a0a` | 19.8:1 | ✅ |
| `#999` on `#0a0a0a` | 6.95:1 | ✅ |
| `#ccc` on `#0a0a0a` | 12.33:1 | ✅ |
| Accent `#b12c0d` as text on `#0a0a0a` | **3.05:1** | ❌ Fails for body text (large text only) |
| `#fff` on accent `#b12c0d` | 6.49:1 | ✅ |
| *Owner brand yellow* `#f5df4e` on `#0a0a0a` | 14.66:1 | ✅ The existing brand colour works very well on a dark base |

---

## 4. Interaction and motion inventory

| Pattern | Implementation in the reference | Notes |
|---|---|---|
| Page preloader and transitions | Custom + jQuery | Hides content until JS finishes |
| Smooth "virtual" scrolling | `smooth-scrollbar.js` (scroll hijacking) | Replaces native scrolling |
| Custom "magic" cursor | Custom JS (`data-cursor` labels, e.g. "View Project") | Pointer devices only |
| Magnetic hover on logo and buttons | `magnetic-item` class | |
| Scroll-triggered reveals and parallax | GSAP + ScrollTrigger | |
| Image zoom on hover | `anim-zoomin` | |
| Marquee text | `data-scroll-speed`, scroll-linked | Infinite motion |
| Accordion | Custom | 14 items |
| Testimonial slider | Swiper | |
| Masonry/filter grid | Isotope + Packery | |
| Lightbox gallery | lightGallery | |
| Analytics | 2 × Google Analytics tags | |

**Weight:** jQuery, GSAP (3 files), smooth-scrollbar, Swiper, Isotope (3 files), lightGallery and Font Awesome, plus about 208 KB of theme CSS.

---

## 5. Accessibility observations

| Finding | Impact |
|---|---|
| **0** `aria-*` attributes in the whole document | Menu toggle, accordion and slider state are not exposed to assistive technology |
| Generic alt text ("Logo", "image", "Image") on 50 images | Fails 1.1.1 for informative images |
| No `prefers-reduced-motion` handling | Marquees, parallax, transitions and smooth scrolling are always on |
| Scroll hijacking | Can break keyboard scrolling, find-in-page, anchor links and assistive technology |
| Content hidden behind the preloader | Slow first paint; nothing visible without JS |
| Infinite marquee with no pause | WCAG 2.2.2 |
| Custom cursor | Must never hide the native cursor or carry essential information |

---

## 6. Recommendations for Phase 04: Adopt / Adapt / Avoid

### ✅ Adopt (as general patterns, re-implemented)

| Pattern | Why it fits this portfolio |
|---|---|
| **Text-first hero** with one strong statement | Lets the [R] positioning ("6+ years… fintech, proptech… SEBI-regulated") lead |
| **Fluid type scale** (`clamp()`) with oversized display headings | Editorial feel, fully responsive, no breakpoint jumps |
| **Two-typeface system**: a characterful display face + a highly readable body face | Brand voice plus readability (final faces chosen in Phase 04) |
| **Large image-led project cards** | Shows the 10 existing project images at their best; handles 16:9 and near-square images with a fixed-ratio frame |
| **Section eyebrow + large heading + short intro** rhythm | Consistent section headers |
| **Accordion for detailed content** (e.g. long experience bullets or services) | Keeps 11 AltInvest bullets scannable |
| **Generous whitespace and a boxed container** (about 1280px) | Calm, premium layout |
| **Theme-aware assets** (logo in light and dark variants) | Supports the Phase 09 light/dark toggle |

### 🔧 Adapt (keep the idea, fix the accessibility and performance)

| Pattern | Adaptation |
|---|---|
| Full-screen overlay menu | Real `<button>` with an accessible name and `aria-expanded`/`aria-controls`, focus trap, Esc to close, focus returned to the toggle, page scroll locked |
| Keyword marquee strips | Content drawn from the [R] skill groups; CSS-only animation; **paused under `prefers-reduced-motion`**, with a visible pause control and duplicated text hidden with `aria-hidden` |
| Scroll reveals | Short, subtle, CSS or IntersectionObserver based; disabled under reduced motion; content visible without JS |
| Hover zoom on project images | Subtle scale on hover **and** on `:focus-visible`, no layout shift |
| Testimonial slider | With only 2 testimonials, show both statically, or use a manual carousel with no autoplay |
| Dark-first aesthetic | Offer both themes with a toggle; the existing brand yellow becomes the accent (passes on dark at 14.66:1; on light it is used only as a **background** with dark text) |
| "Back to Top" text link | Real anchor to `#top`, visible focus style |

### ❌ Avoid

| Pattern | Reason |
|---|---|
| Preloader and page-transition curtain | Hurts LCP; content must render immediately |
| Scroll hijacking (virtual smooth scroll) | Accessibility and usability risk; use native scrolling with `scroll-behavior: smooth` behind a reduced-motion check |
| Custom cursor / magnetic effects | Low value, adds JS, and is not accessible to touch or keyboard users |
| jQuery, GSAP, Isotope, lightGallery and similar plugin stacks | Unnecessary dependencies; React + CSS cover the needs |
| Accent colour as body text when it fails contrast | WCAG 1.4.3 |
| Generic alt text | WCAG 1.1.1 |
| Personal-photo gallery, client logo wall | **No such content exists** for this owner; do not invent it |

---

## 7. Mapping reference patterns to owner content

| Reference pattern | Owner content that could fill it | Status |
|---|---|---|
| Text-first hero statement | [R] executive summary / title | ✅ Available |
| Portfolio grid | 10 projects + images ([S]) | ✅ Available (6 links pending, D6) |
| Capabilities accordion | 4 services ([S]) or 9 skill groups ([R]) | ✅ Available |
| Marquee | [R] skill keywords | ✅ Available |
| Logo wall | Employers (AltInvest, BrandSystems, SOSUDATECH) | ⚠️ Would need logo assets and usage permission; **not available** |
| Testimonials | 2 testimonials ([S]) | ✅ Available (consent ⚠️ Q9) |
| Personal gallery | — | ❌ No content; do not build |
| Contact CTA | [S] contact section | ✅ Available |
