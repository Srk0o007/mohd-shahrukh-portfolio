# Asset Inventory

**Phase:** 02 — Existing Website Investigation
**Date:** 2026-11-03

This document lists every asset the live site uses, plus the new resume PDF. **No assets have been copied into the repository yet.** That happens in Phase 06, after the asset pipeline is defined in Phase 05.

Base URL: `https://mohdshahrukh.in/`. All sizes are uncompressed transfer sizes in decimal KB (1 KB = 1,000 bytes). All assets returned HTTP 200 on 2026-11-03.

---

## 1. Images

| # | Path | Format | Pixels | Size | Used in | Current alt | Reuse | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | `images/favicon.png` | PNG | 16×16 | 0.6 KB | Browser tab | — | ⚠️ Replace | Too small for modern icon sets (needs 32, 180 and 512 px plus SVG). Phase 04/06. |
| 2 | `images/logo.png` | PNG | 278×48 | 2.1 KB | Header | "Mohd Shahrukh" | ⚠️ Rework | Wordmark in Poppins bold. A text or SVG logo is better for theming and dark mode. |
| 3 | `images/headshot-2.png` | PNG | 1024×1024 | **1,464 KB** | Hero, `og:image` | "Mohd Shahrukh - Software Engineer" | ✅ Reuse (optimise) | Primary portrait. Convert to AVIF/WebP with responsive sizes; target under 100 KB. |
| 4 | `images/faq.png` | PNG (alpha) | 467×457 | 11.7 KB | Contact (decorative) | "faq" | ⚠️ Optional | Generic illustration, not personal content |
| 5 | `images/intro-bg-2.jpg` | JPEG | 1600×1066 | 153 KB | CTA band (parallax background) | — (CSS) | ⚠️ Optional | Stock-style background. Licence/source unknown; confirm before reuse. |
| 6 | `images/testimonial/sowmit.png` | PNG | 800×800 | **671 KB** | Testimonial 1 | "Sowmit Nag - Sr. Web Designer" | ✅ Reuse (optimise; consent ⚠️) | Displayed as a small avatar; target under 15 KB |
| 7 | `images/testimonial/Divesh-sir.jpg` | JPEG | 450×450 | 28.2 KB | Testimonial 2 | "Divesh Kumar - CTO" | ✅ Reuse (optimise; consent ⚠️) | Rename (no "-sir" in the filename) |
| 8 | `images/projects/marcom-blurr.png` | PNG | 1600×900 | 570 KB | Project 1 | "Digital Asset Management - MRM platform" | ✅ Reuse | Intentionally blurred (confidential) |
| 9 | `images/projects/collaborate-blur.png` | PNG | 1600×900 | **1,879 KB** | Project 2 | "Approval and Review Workflow Software" | ✅ Reuse | Intentionally blurred. Largest asset. |
| 10 | `images/projects/lam-blur.png` | PNG | 1600×900 | 783 KB | Project 3 | "LAM Campaign Management Software" | ✅ Reuse | Intentionally blurred |
| 11 | `images/projects/sarkarijobskhoj.com_(Desktop 1920).png` | PNG | 1600×900 | 400 KB | Project 4 | "SarkariJobKhoj - Government job listing website" | ✅ Reuse | Rename (spaces and parentheses) |
| 12 | `images/projects/www.sosudatech.com_(Desktop 1920).png` | PNG | 1600×900 | 951 KB | Project 5 | " SOSUDATECH Pvt. Ltd. - Education and teaching website" | ✅ Reuse | Rename; trim the leading space in alt |
| 13 | `images/projects/virtual_375x393.png` | PNG | **375×393** | 219 KB | Project 6 | " Virtual University - Education and teaching website" | ✅ Reuse (low-res ⚠️) | Mobile-size capture, so it looks soft in large cards. A new screenshot would be better after re-deployment. |
| 14 | `images/projects/e-wallet_375x393.png` | PNG | **375×393** | 68 KB | Project 7 | "QuickCashTx - Banking and fund transfer app" | ✅ Reuse (low-res ⚠️) | Same as #13 |
| 15 | `images/projects/nile_1_375x393.png` | PNG | **375×393** | 185 KB | Project 8 | "Niles Academy - Education and teaching website" | ✅ Reuse (low-res ⚠️) | Same as #13 |
| 16 | `images/projects/swisscosmetics.mohdshahrukh.in_(Desktop 1920).png` | PNG | 1600×900 | 705 KB | Project 9 | "Swiss Cosmetics - Beauty and fashion website" | ✅ Reuse | Rename |
| 17 | `images/projects/frontierminingsssolutions.mohdshahrukh.in_(Desktop 1920).png` | PNG | 1600×900 | **1,636 KB** | Project 10 | "Frontier Mining Solutions - Mining services website" | ✅ Reuse | Rename; fix the "sss" typo |

**Totals:** 17 images, about **9.73 MB**. Expected after optimisation (AVIF/WebP, responsive sizes, lazy loading): roughly 1 MB or less in total, with far less loaded on the first view.

**Mixed aspect ratios:** 1600×900 (16:9) for 8 projects versus 375×393 (about 1:1.05) for 3 projects. The Phase 04 card design must handle both (for example with a fixed-ratio frame using `object-fit`), or the owner supplies new 16:9 captures after re-deployment (D6).

---

## 2. Documents

| # | File | Size | Pages | Status | Notes |
|---|---|---|---|---|---|
| 1 | `https://mohdshahrukh.in/Mohd_shahrukh_resume_072026.pdf` | 627 KB | 2 | 🔄 Superseded | Currently linked from "Download CV" |
| 2 | `Mohd_Shahrukh_Resume_03_nov_2026.pdf` (owner's local Downloads folder) | 72 KB | 2 | ✅ **Use (D7)** | To be copied into the repo in Phase 06, for example `public/resume/Mohd_Shahrukh_Resume_03_Nov_2026.pdf`. Its content is recorded in [CONTENT_INVENTORY.md](CONTENT_INVENTORY.md). |

---

## 3. Fonts and icons

| Asset | Source | Status | Notes |
|---|---|---|---|
| Poppins 100–900 | Google Fonts (CSS link) | ⚠️ Phase 04 | The rebuild should self-host via `next/font` and load only the weights it needs |
| Font Awesome 5 Free (solid, regular, brands) | Local `vendor/font-awesome` | 🗑️ Replace | Use inline SVG icons instead (tree-shaken, accessible) |

### Font Awesome icons in use

`fa-phone`, `fa-linkedin-in`, `fa-github`, `fa-twitter` (🗑️ D4), `fa-envelope`, `fa-arrow-down`, `fa-arrow-alt-circle-down`, `fa-arrow-up`, `fa-arrow-right`, `fa-desktop`, `fa-pencil-ruler`, `fa-universal-access`, `fa-vial`, `fa-air-freshener`, `fa-industry`, `fa-ghost`, `fa-file-alt`, `fa-university`, `fa-piggy-bank`, `fa-graduation-cap`, `fa-spa`, `fa-hard-hat`, `fa-quote-left`, `fa-chevron-left`, `fa-chevron-right`

---

## 4. Third-party code (not reused)

All of these are replaced by the Next.js, React and Tailwind stack. None will be carried over.

| Library | Purpose on the live site |
|---|---|
| jQuery | DOM and event handling |
| Bootstrap 4 (CSS and bundle) | Grid, collapse, tooltips |
| jQuery Easing | Smooth-scroll easing |
| jQuery Appear | Scroll detection |
| WOW.js + Animate.css | Entrance animations |
| imagesLoaded + Isotope | Portfolio masonry and filter |
| Typed.js | Typing headline |
| Parallaxie | CTA parallax |
| Owl Carousel | Testimonial slider |
| Magnific Popup | Unused |
| `switcher.min.js` | Unused colour switcher |

---

## 5. External services

| Service | Use | Status |
|---|---|---|
| Formspree (`formspree.io/f/xleyzgzo`) | Contact form backend | ⚠️ Provider decision in Phase 05 |
| Google Fonts | Poppins | ⚠️ Self-host in the rebuild |
| Hostinger | Hosting and DNS | Phase 12 dependency (DNS access needed) |

---

## 6. Missing assets ❌

| Asset | Needed for | Owner action |
|---|---|---|
| Social share image (1200×630) | Open Graph / Twitter cards | Create in Phase 04/06 (from existing assets only) |
| Full-size screenshots for projects 6–8 | Sharp project cards | Optional, after re-deployment (D6) |
| Screenshot of PropShare Titania / mohdshahrukh.in | Only if added as projects (Q7) | Optional |
| High-resolution favicon / app icons | Browser and OS icons | Generated in Phase 06 |

---

## 7. Imported into the repository (Phase 06)

Every file below is a **byte-for-byte copy** of the verified source. Each SHA-256 was compared against a fresh download from the live site on 2026-11-04 and matched. Nothing was edited, recompressed, upscaled or replaced. Optimised variants are produced at request time by `next/image` (ADR 0010).

| Repository path | Source | Pixels | SHA-256 (first 16 hex) | Notes |
|---|---|---|---|---|
| `src/assets/images/portrait/headshot.png` | `images/headshot-2.png` | 1024×1024 | `510afa347139f8f1` | Portrait |
| `src/assets/images/projects/digital-asset-management.png` | `images/projects/marcom-blurr.png` | 1600×900 | `dcc58141e420e30f` | Blurred, as supplied |
| `src/assets/images/projects/approval-software-management.png` | `images/projects/collaborate-blur.png` | 1600×900 | `d173012dfa64c0d3` | Blurred, as supplied |
| `src/assets/images/projects/campaign-management.png` | `images/projects/lam-blur.png` | 1600×900 | `1de9811b1fb0772e` | Blurred, as supplied |
| `src/assets/images/projects/job-listing-website.png` | `images/projects/sarkarijobskhoj.com_(Desktop 1920).png` | 1600×900 | `7e119212bac893d2` | |
| `src/assets/images/projects/sosudatech.png` | `images/projects/www.sosudatech.com_(Desktop 1920).png` | 1600×900 | `7d44f340a17c8d7d` | |
| `src/assets/images/projects/virtual-university.png` | `images/projects/virtual_375x393.png` | **375×393** | `fe8a1c9dc7fdf419` | **Low resolution, kept as is** (`contain`, DS-08) |
| `src/assets/images/projects/quickcashtx.png` | `images/projects/e-wallet_375x393.png` | **375×393** | `2b44d0ffc215c46d` | **Low resolution, kept as is** |
| `src/assets/images/projects/niles-academy.png` | `images/projects/nile_1_375x393.png` | **375×393** | `f231ea78dfb8c8fc` | **Low resolution, kept as is** |
| `src/assets/images/projects/swiss-cosmetics.png` | `images/projects/swisscosmetics.mohdshahrukh.in_(Desktop 1920).png` | 1600×900 | `ce7a9f740829a3c8` | |
| `src/assets/images/projects/frontier-mining-solutions.png` | `images/projects/frontierminingsssolutions.mohdshahrukh.in_(Desktop 1920).png` | 1600×900 | `27707ab7cda243fa` | Filename typo ("sss") fixed in the new name only |
| `src/assets/images/testimonials/sowmit-nag.png` | `images/testimonial/sowmit.png` | 800×800 | `5f6c8d3b36e3d038` | D18 |
| `src/assets/images/testimonials/divesh-kumar.jpg` | `images/testimonial/Divesh-sir.jpg` | 450×450 | `6ed16d58df05d22a` | D18 |
| `public/Mohd_Shahrukh_Resume_03_Nov_2026.pdf` | Owner's `Mohd_Shahrukh_Resume_03_nov_2026.pdf` | 2 pages, 72,379 bytes | `dce4f75fd212d2ef` | D7; served at `/Mohd_Shahrukh_Resume_03_Nov_2026.pdf` |

**Not imported** (not used by the approved design): `favicon.png` (replaced by the monogram below), `logo.png` (the wordmark is text), `faq.png`, `intro-bg-2.jpg` (no parallax band, DS-10), and the July 2026 resume PDF (superseded).

### Favicon (owner-approved, Phase 06)

`src/app/icon.svg`: an "MS" monogram, paper `#F5F2EA` on ink `#161513`, 32×32 viewBox, 2.6 KB. The glyphs are **outlined paths** taken from Fraunces (SIL OFL 1.1), using the same font file `next/font` bundles, instanced at `opsz` 9 and `wght` 600 for sturdiness at 16 px. The SVG contains no text, fonts or external references. This is the favicon only, not a wordmark or identity change. A PNG fallback, the Apple touch icon and the manifest's 192/512 icons follow in Phase 11.

