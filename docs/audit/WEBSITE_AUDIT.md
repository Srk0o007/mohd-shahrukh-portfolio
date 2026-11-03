# Website Audit: mohdshahrukh.in

**Phase:** 02 — Existing Website Investigation
**Audit date:** 2026-11-03
**Subject:** https://mohdshahrukh.in/ (live production site; nothing was modified)

Related deliverables: [CONTENT_INVENTORY.md](CONTENT_INVENTORY.md) · [ASSET_INVENTORY.md](ASSET_INVENTORY.md) · [SECTION_MAPPING.md](SECTION_MAPPING.md) · [REFERENCE_DESIGN_ANALYSIS.md](REFERENCE_DESIGN_ANALYSIS.md)

---

## 1. Method

| Check | How | Notes |
|---|---|---|
| Markup, content, scripts | Downloaded the raw `index.html`, `css/style.css`, `css/responsive.css`, `js/theme.js`, `js/switcher.min.js` | Read-only HTTP GET requests |
| Links and assets | HTTP status checks on all 49 `src`/`href` URLs | `curl -L` |
| Dead project links | DNS lookup through the local resolver **and** Cloudflare `1.1.1.1` | Both resolvers agreed |
| Site-level files | `robots.txt`, `sitemap.xml`, a random 404 path, `/images/` directory listing, `http://` and `www.` variants | |
| Responsive behaviour | Headless Chrome screenshots at 375, 768 and 1440 px | Screenshots kept outside the repo |
| Contrast | WCAG relative-luminance formula on colors taken from the CSS | Spot checks only; a full audit happens in Phase 10 |
| Resume | Text extracted from the linked PDF (`Mohd_shahrukh_resume_072026.pdf`) and compared with the latest resume (03 Nov 2026) | See [CONTENT_INVENTORY.md](CONTENT_INVENTORY.md) |

**Limitations**
- LinkedIn answers automated requests with HTTP `999`, so profile availability could not be verified by tooling.
- X/Twitter returns `200` for any handle, so the account's existence is unverified. The owner has decided to drop it, so this no longer matters.
- The contact form was **not submitted**, because a test submission would send a real message to the owner.

---

## 2. Technology and hosting

| Aspect | Finding |
|---|---|
| Architecture | One static page (`index.html`) with in-page anchor navigation. No other pages exist (`/about.html` returns 404). |
| Origin | Header comment says "Personal Portfolio HTML Template"; built on Bootstrap 4 class conventions (`ml-auto`, `float-right`, `data-toggle`) |
| Hosting | Hostinger (`platform: hostinger`, `server: hcdn` response headers). According to the 03 Nov 2026 resume, it deploys through a Bitbucket CI/CD pipeline. |
| Last modified | `Wed, 22 Jul 2026 18:47:39 GMT` (HTTP `last-modified` header) |
| Font | Google Fonts **Poppins**, with all 9 weights (100–900) requested |
| CSS libraries | Bootstrap (211 KB), Animate.css (84 KB), Font Awesome 5 (75 KB), Owl Carousel, Magnific Popup |
| JS libraries | jQuery (151 KB), Bootstrap bundle (135 KB), jQuery Easing, jQuery Appear, WOW.js, imagesLoaded, Typed.js, Parallaxie, Owl Carousel, Isotope, Magnific Popup |
| Form backend | Formspree (`https://formspree.io/f/xleyzgzo`), plain HTML `POST` |
| Analytics | None found |

**Page weight (uncompressed transfer sizes, excluding web fonts):**

| Type | Size |
|---|---|
| HTML | 56.6 KB |
| CSS (7 files) | ≈ 472 KB |
| JavaScript (13 files) | ≈ 492 KB |
| Images (17 files) | ≈ 9.73 MB |

---

## 3. Broken links and availability

| # | Link | Used by | Result | Evidence |
|---|---|---|---|---|
| 1 | `https://sarkarijobkhoj.com/` | Project "Job Listing Website" | ❌ Dead | NXDOMAIN on both resolvers |
| 2 | `https://universitytemplate.mohdshahrukh.in/` | Project "Virtual University" | ❌ Dead | Subdomain has no A/AAAA record |
| 3 | `https://quickcashtx.mohdshahrukh.in/` | Project "QuickCashTx" | ❌ Dead | NXDOMAIN |
| 4 | `https://nilesacademy.mohdshahrukh.in/` | Project "Niles Academy" | ❌ Dead | NXDOMAIN |
| 5 | `https://swisscosmetics.mohdshahrukh.in/` | Project "Swiss Cosmetics" | ❌ Dead | NXDOMAIN |
| 6 | `https://frontierminingsssolutions.mohdshahrukh.in/` | Project "Frontier Mining Solutions" | ❌ Dead | NXDOMAIN. The hostname contains a triple "s" ("mining**sss**olutions"). |
| 7 | `#portfolio` with `target="_blank"` | The 3 confidential projects (MARCOM / DAM, Collaborate, LAM) | ⚠️ Misleading | Clicking opens a duplicate tab of the same page |
| 8 | `https://www.sosudatech.com/` | Project "SOSUDATECH Pvt. Ltd." | ✅ 200 | |
| 9 | `https://github.com/Srk0o007` | Nav, About, Contact | ✅ 200 | |
| 10 | `https://www.linkedin.com/in/mohd-shah-rukh-703aa3153/` | Nav, About, Contact | ⚠️ Unverifiable | HTTP 999 (LinkedIn blocks bots) |
| 11 | `https://twitter.com/shahrukh156` | Contact | ⚠️ Unverifiable | Owner decision: remove |
| 12 | `./Mohd_shahrukh_resume_072026.pdf` | "Download CV" | ✅ 200 (627 KB, 2 pages) | Content is superseded by the 03 Nov 2026 resume |
| 13 | Footer "Mohd Shahrukh" links (×2) | Footer | ⚠️ `href="#"` | Placeholder links that go nowhere |
| 14 | Back-to-top | Floating button | ⚠️ `href="javascript:void(0)"` | Works only with JavaScript |

All 33 local CSS, JS and image assets return **200**.

**Owner decision (2026-11-03):** all 10 projects stay, with their images. The owner will re-deploy the 6 dead demos and supply new URLs. Until then the new site shows those projects **without** a link.

---

## 4. SEO and metadata

| Finding | Severity | Detail |
|---|---|---|
| No `robots.txt` | Medium | `/robots.txt` returns 404 |
| No sitemap | Medium | `/sitemap.xml` returns 404 |
| `www` not canonicalised | Medium | `https://www.mohdshahrukh.in/` serves 200 with no redirect, so the same content is available on two hosts. There is no `<link rel="canonical">`. |
| Relative `og:image` / `twitter:image` | Medium | `./images/headshot-2.png`. Social crawlers need absolute URLs. |
| Wrong geo meta | Low | `ICBM` is `28.58794;77.33045` (the Noida area), while `geo.placename` and the page copy say Bangalore |
| Non-standard meta | Low | `COPYRIGHT` holds an email address. `keywords`, `rating` and `distribution` have no SEO value. |
| Outdated description | Medium | Meta, OG and Twitter descriptions say "5+ years" and "IBM Full Stack certified"; the latest resume says **6+ years** |
| 404 handling | Low | Unknown paths return the host's default 404 page |
| `http → https` | ✅ | 301 redirect in place |
| Title and description present | ✅ | |

---

## 5. Accessibility (WCAG 2.2 AA spot audit)

| # | Issue | WCAG | Severity |
|---|---|---|---|
| A1 | Hero typing animation loops forever with no pause control | 2.2.2 Pause, Stop, Hide | High |
| A2 | Testimonial carousel autoplays and loops with no pause control | 2.2.2 | High |
| A3 | Services body text `#6c757d` on `#f8f9fa` measures **4.45:1** (needs 4.5:1) | 1.4.3 Contrast (Minimum) | High |
| A4 | Menu toggle `<button>` has no accessible name and no `aria-expanded` or `aria-controls` | 4.1.2 Name, Role, Value | High |
| A5 | Icon-only social links have an empty `title=""`; their names exist only in `data-original-title` (tooltip) | 2.4.4 / 4.1.2 | High |
| A6 | Portfolio overlay links (`<a class="stretched-link">`) are empty anchors with no accessible name | 2.4.4 / 4.1.2 | High |
| A7 | No skip link to main content | 2.4.1 Bypass Blocks | Medium |
| A8 | Heading structure: the `<h1>` is only "Hi, I'm"; the name and role are in an `<h2>` that JS rewrites; several `<h2>` elements are used as sub-headings; portfolio uses `<h5>` straight after `<h2>` | 1.3.1 Info and Relationships | Medium |
| A9 | Portfolio filter tabs are `<a href="">` elements acting as buttons, with no state exposed to assistive technology | 4.1.2 | Medium |
| A10 | No `prefers-reduced-motion` handling (WOW, Animate.css, smooth scroll, Typed.js, parallax) | 2.3.3 (AAA, best practice) | Medium |
| A11 | A preloader covers the page until `window.load` (all images, about 9.7 MB) | Usability / performance | Medium |
| A12 | Decorative `faq.png` has `alt="faq"` instead of `alt=""` | 1.1.1 Non-text Content | Low |
| A13 | Main landmark is `<div role="main">` instead of `<main>` | Best practice | Low |
| A14 | Form has proper `<label>` elements ✅, but errors rely on native browser bubbles only, and success sends the user off-site | 3.3.1 / 3.3.3 | Low |
| A15 | `lang="en"` is set ✅ | 3.1.1 | — |

**Contrast reference (computed):**

| Pair | Ratio | Result |
|---|---|---|
| Brand yellow `#f5df4e` with dark text `#212529` | 11.42:1 | ✅ Safe as a background |
| Brand yellow `#f5df4e` as text on white | 1.35:1 | ❌ Never use as text on light backgrounds |
| `#6c757d` on `#f8f9fa` | 4.45:1 | ❌ Fails AA |
| `#6c757d` on white | 4.69:1 | ✅ Passes |
| `#939597` on white | 3.01:1 | ❌ Fails AA for body text |

---

## 6. Performance

| # | Finding | Impact |
|---|---|---|
| P1 | Images total about **9.73 MB**, all PNG/JPEG with no modern formats and no responsive `srcset` | High |
| P2 | `headshot-2.png` is **1.46 MB** at 1024×1024, displayed at roughly 380 px | High |
| P3 | `collaborate-blur.png` is 1.88 MB and `frontierminingsssolutions…png` is 1.64 MB (both 1600×900) | High |
| P4 | No `loading="lazy"` on below-the-fold images | Medium |
| P5 | About 964 KB of CSS and JS across 20 render-blocking requests, much of it unused (Magnific Popup, YTPlayer hook, colour switcher) | High |
| P6 | Poppins loads all 9 weights | Medium |
| P7 | `<link id="color-switcher" href="#">` makes the browser request the **page itself** as a stylesheet | Low |
| P8 | Preloader delays first meaningful paint until every image has loaded | High |

---

## 7. Responsive behaviour

Observed in headless Chrome at three viewport widths. Confirm on real devices in Phase 10.

| Width | Observation | Severity |
|---|---|---|
| 375 px | **Horizontal overflow** in the hero: the typed heading ("A SOFTWARE DEVELOPMENT ENGINEER"), the headshot and the location line are clipped on the right, and the menu toggle is pushed out of view | High |
| 375 / 768 px | Large empty yellow areas above and below the hero content (fullscreen hero plus `padding-top: 15%` on the profile image) | Medium |
| 768 px | Location line is left-aligned while the headings and buttons are centred | Low |
| 768 px | Scroll-down arrow is barely visible | Low |
| < 768 px | WOW entrance animations are disabled by script (`$(window).width() > 767`) | Info |
| 1440 px | Layout renders as intended | — |

---

## 8. Security and privacy

| Finding | Severity |
|---|---|
| Only one security header observed: `content-security-policy: upgrade-insecure-requests`. No HSTS, `X-Content-Type-Options`, `Referrer-Policy` or `Permissions-Policy`. | Medium |
| `target="_blank"` without `rel="noopener noreferrer"` (modern browsers imply `noopener`) | Low |
| The `/images/` directory listing is blocked (403) ✅ | — |
| Phone numbers and email are published in plain text, which exposes them to scraping. The owner has decided to keep **one** phone number and the email. | Info |

---

## 9. Code quality and dead code

| Finding |
|---|
| The colour-switcher stylesheet and `switcher.min.js` have no UI. They are dead code. |
| `theme.js` initialises `#testimonial-slider`, which does not exist |
| Magnific Popup, YTPlayer (`.player`) and the side-header logic are loaded but unused |
| A CSS table of contents lists "Light mode & Dark mode variables", but the section is empty. **The site has no dark mode.** |
| The smooth-scroll handler relies on the implicit global `event` |
| Typo: `frontierminingsssolutions` in both the hostname and the image filename |
| Image filenames contain spaces and parentheses (e.g. `www.sosudatech.com_(Desktop 1920).png`) |

---

## 10. Content inconsistencies

| # | Inconsistency | Resolution |
|---|---|---|
| C1 | Nav says "What I Do"; the section eyebrow says "What I Do?" | Phase 03 copy decision |
| C2 | Nav says "Testimonials"; the section eyebrow says "Endorsements" | Phase 03 copy decision |
| C3 | "Bangalore" (hero, resume) vs "Bengaluru" (contact) | Phase 03 copy decision |
| C4 | Typo: "Collaborate - Approval& Review Workflows" | Fix in rebuild |
| C5 | Header shows one phone number; contact shows two | ✅ Owner decision: keep only `+91 9760787661` |
| C6 | Site says "5+ years"; latest resume says "6+ years" | ✅ Resume wins (6+) |
| C7 | Site says AltInvest "2024 – Present"; resume says "May 2024 – Oct 2026" | ✅ Resume wins; no availability statement is added |
| C8 | Site lists 3 education entries; resume lists B.Tech only | ✅ Owner decision: B.Tech only |
| C9 | Site certifications differ from the resume's | ✅ Owner decision: IBM, JavaScript, React |
| C10 | Skill percentages are self-rated with no supporting evidence | ✅ Owner decision: replace with grouped skills |
| C11 | Site's "Learning: TypeScript, Next.js, Node.js" is outdated (the resume lists TS and Next.js as hands-on) | ✅ Resume wins |
| C12 | Portfolio filters: only 1 of 10 items is in "Web Design"; the cosmetics and mining sites are in "Front-End Development" | Phase 03 taxonomy decision |
| C13 | Hero alt text says "Software Engineer"; the page title says "Software Development Engineer – Frontend" | Fix in rebuild |

Full content detail is in [CONTENT_INVENTORY.md](CONTENT_INVENTORY.md).

---

## 11. Interactions and animations

| Interaction | Library | Trigger | Notes |
|---|---|---|---|
| Preloader (4-dot ellipsis) | Custom + jQuery | Page load | Fades out after `window.load` |
| Sticky header | Custom | Scroll > 1 px | Adds `sticky-on-top` |
| Full-screen overlay menu | Bootstrap collapse (customised) | Hamburger toggle | Closes when a link is clicked |
| Smooth anchor scroll | jQuery + Easing (`easeInOutExpo`, 1500 ms) | Nav, CTAs | 50 px offset |
| Typing headline | Typed.js | Load; loops forever | Strings: "Mohd Shahrukh", "a Software Development Engineer", "a Frontend Developer", "a UI/UX Designer" |
| Entrance animations | WOW.js + Animate.css | Scroll into view, ≥ 768 px only | `fadeInUp`, `zoomIn`, `heartBeat`, `rubberBand`, `fadeIn` |
| Scroll-down arrow | CSS animation | — | Links to `#about` |
| Portfolio filter | Isotope (masonry) | Click on tab | All / Front-End Development / Web Design |
| Portfolio hover overlay | CSS | Hover | Icon, title and category |
| Parallax CTA background | Parallaxie | Scroll | `intro-bg-2.jpg` |
| Testimonial carousel | Owl Carousel | Autoplay, loop, prev/next arrows | 1 item per view |
| Tooltips | Bootstrap tooltip | Hover/focus on social icons | |
| Back-to-top | jQuery | Appears after scrolling 400 px | Animated scroll to top |
| Contact form | Native HTML + Formspree | Submit | `required` validation only; navigates away to Formspree |

---

## 12. Summary of priorities for the rebuild

1. Content from the 03 Nov 2026 resume, plus the owner's decisions (see [CONTENT_INVENTORY.md](CONTENT_INVENTORY.md)).
2. Fix the responsive overflow and adopt a mobile-first layout.
3. Meet WCAG 2.2 AA: motion controls, accessible names, heading structure, contrast, reduced motion.
4. Cut image weight by more than 90% (AVIF/WebP, `next/image`, lazy loading) and remove jQuery and the plugin stack.
5. SEO baseline: canonical host, `robots.txt`, sitemap, absolute OG image, structured data.
6. No dead links: projects without a live URL render without a link.
