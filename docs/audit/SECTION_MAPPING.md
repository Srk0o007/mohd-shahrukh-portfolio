# Section Mapping

**Phase:** 02 — Existing Website Investigation
**Date:** 2026-11-03

Part 1 records the live site's structure exactly as it is today. Part 2 is a **draft** mapping to the new site, for Phase 03 to finalise. It is not an approved information architecture.

---

## Part 1 — Live site structure

Single page: `index.html`. The order below is the DOM order.

| # | Section | Anchor | In nav | Background | Headings (actual levels) | Components | Interactions / libraries |
|---|---|---|---|---|---|---|---|
| 0 | Preloader | — | — | White overlay | — | 4-dot ellipsis | jQuery fade-out on `window.load` |
| 1 | Header | `#header` | — | Transparent → sticky | — | Logo image, phone number, hamburger, overlay nav (7 links), LinkedIn/GitHub icons | Sticky on scroll; Bootstrap collapse (customised); smooth scroll |
| 2 | Hero / Intro | `#home` | Home | Yellow `#f5df4e`, fullscreen | `h1` "Hi, I'm" → `h2` typed text | Typed headline, location line, 2 CTAs, circular headshot, scroll-down arrow | Typed.js loop; WOW `zoomIn` on photo; CSS-animated arrow |
| 3 | About | `#about` | About Me | Default (`#ddd` body) | Eyebrow `p` → `h2` "Know Me More" → `h2` "Hi, I'm Mohd Shahrukh" → `h3` "Years of Experience" | 2 paragraphs, GitHub/LinkedIn buttons, "5+ Years" badge | WOW `fadeInUp`, `heartBeat`, `rubberBand` |
| 4 | Services | `#services` | What I Do | `bg-light` `#f8f9fa` | Eyebrow → `h2` → 4 × `h3` | 4 icon feature boxes | WOW `fadeInUp` (staggered) |
| 5 | Resume | `#resume` | Resume | Default | `h2` summary → `h2` My Education → `h3` ×3 → `h2` My Experience → `h3` ×3 → `h2` My Skills → `h3` Tools → `h2` Certifications → `h3` ×3 | Timeline-style lists (left border), 8 progress bars, tools list, certificate list, "Download CV" button | WOW `fadeInUp` |
| 6 | Portfolio | `#portfolio` | Portfolio | `bg-light` | Eyebrow → `h2` → 10 × `h5` | Filter tabs (3), 10 image cards with hover overlay | Isotope masonry filter; hover overlay |
| 7 | CTA band | — (no id) | ✗ | Parallax photo plus 80% dark mask | `h2` | Heading, "Call Me!" and "Hire Me!" buttons | Parallaxie; WOW `rubberBand` |
| 8 | Testimonials | `#testimonial` | Testimonials | `bg-secondary` `#2f2f2f` | Eyebrow "Endorsements" → `h2` | Carousel of 2 quotes with avatar, name and role | Owl Carousel (autoplay, loop, arrows) |
| 9 | Contact | `#contact` | Contact Me | `#f8f9fa` | `h2` → `h3` ×3 → `h2` "Send Me a Message" | Contact details, 4 social icons, decorative image, 3-field form | Formspree POST; tooltips |
| 10 | Footer | `#footer` | — | Dark `#111418` | — | Copyright, "Designed by" | — |
| 11 | Back to top | `#back-to-top` | — | Floating | — | Circular icon button | Appears after scrolling 400 px; animated scroll |

### Responsive layout of the live site

Bootstrap 4 breakpoints: `sm` 576, `md` 768, `lg` 992, `xl` 1200.

| Section | < 992 px | ≥ 992 px |
|---|---|---|
| Hero | Photo above text, centred (overflow at 375 px; see the audit) | Text 7 cols left, photo 5 cols right |
| About | Stacked, centred | Text 9 cols, badge 3 cols |
| Services | 2 columns (`sm`), then 1 | 4 columns |
| Resume | Single column, 8-col centred | Same |
| Skills | 1 column (< 768), then 2 | 2 columns |
| Portfolio | 1 column (< 576), then 2 | 3 columns |
| Contact | Stacked | Details 5 cols plus image 6 cols; form full width |

---

## Part 2 — Draft mapping to the new site (for Phase 03)

**Status:** ⚠️ Draft. The final IA, section names and order are decided in Phase 03 (requirements) and Phase 04 (design).

| Live section | → New section (draft) | Content source | Key changes (per owner decisions and the audit) |
|---|---|---|---|
| Preloader | **Removed** | — | Content renders immediately (performance and accessibility) |
| Header + overlay nav | Header + accessible nav (overlay menu pattern from the reference, adapted) | [S] | Accessible toggle (name, `aria-expanded`, focus trap, Esc to close); skip link |
| Hero | Hero | [R] title + [S] structure | Real `h1` with name and title; static or pausable role text (WCAG 2.2.2); optimised portrait |
| About | About | [R] executive summary | 6+ years; no availability or targeting statement (D1, Q2) |
| Services | Services / What I Do | [S] | Same 4 services; optional copy refresh (Q12) |
| Resume → Experience | Experience | [R] | 3 roles with exact dates (D1) and 11 + 4 + 2 bullets |
| Resume → Skills | Skills | [R] | 9 skill groups, no percentages (D5) |
| Resume → Certifications | Certifications | [R] + [S] | IBM, JavaScript, React (D3) |
| Resume → Education | Education | [R] | B.Tech only (D2) |
| Resume → Download CV | CV download (in hero/header and resume area) | 03 Nov 2026 PDF (D7) | |
| Portfolio | Projects / Work | [S] + [R] metadata | All 10 kept with images; links only where live (D6); filter taxonomy reviewed (Q5) |
| CTA band | Hire/contact CTA | [S] | Wording and "Call Me!" behaviour reviewed (Q10) |
| Testimonials | Testimonials | [S] | No autoplay, or with a pause control; consent check (Q9) |
| Contact | Contact | [S] + [R] | One phone number, no Twitter (D4); inline validation and success state |
| Footer | Footer | [S] | Real links; copyright year |
| Back to top | Back to top | [S] | Real `<a href="#top">` or button; respects reduced motion |
| — | **New candidates** (Phase 03/04 decision) | — | Theme toggle (Phase 09, light/dark); keyword marquee (reference pattern, reduced-motion safe) |

### Draft heading outline for the new site

```
h1  Mohd Shahrukh — Software Development Engineer | Frontend
  h2  About
  h2  Services
    h3  (each service)
  h2  Experience
    h3  (each role)
  h2  Skills
    h3  (each group)
  h2  Certifications
  h2  Education
  h2  Projects
    h3  (each project)
  h2  Testimonials
  h2  Contact
```
