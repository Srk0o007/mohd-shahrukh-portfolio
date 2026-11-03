# Content Inventory

**Phase:** 02 — Existing Website Investigation
**Date:** 2026-11-03

This is the complete record of existing content and of the owner-approved source rules. **Nothing in this document is invented.** Where content is missing, it is marked as missing.

---

## 1. Sources and precedence

| Code | Source | Role |
|---|---|---|
| **[R]** | **Resume dated 03 Nov 2026** (`Mohd_Shahrukh_Resume_03_nov_2026.pdf`, supplied by the owner) | **Primary** source for career data: summary, experience, dates, skills, certifications, education, project metadata |
| **[S]** | Live site https://mohdshahrukh.in/ (as of 2026-11-03) | Primary for content the resume does not cover: services, the 10 portfolio entries, testimonials, contact form, CTA, footer |
| **[O]** | Old resume `Mohd_shahrukh_resume_072026.pdf` (linked from the live site) | Historical reference only |

**Rule:** where [R] and [S] conflict on career data, [R] wins. Any remaining conflict is listed as ⚠️ and decided by the owner.

### Status tags

| Tag | Meaning |
|---|---|
| ✅ | Verified. Use as-is (subject to Phase 03 copy editing that does not change facts) |
| 🔄 | Superseded. Replaced by newer content from [R] |
| ⚠️ | Needs a decision, to be resolved in Phase 03 |
| ❌ | Missing. Not present in any source; must be supplied by the owner or omitted |
| 🗑️ | Removed by owner decision |

---

## 2. Owner decisions (2026-11-03)

| # | Topic | Decision |
|---|---|---|
| D1 | Current status | AltInvest is shown as **May 2024 – Oct 2026**, exactly as in [R]. No "current role" or availability statement is added. |
| D2 | Education | **B.Tech only.** The Diploma and Intermediate entries are removed. |
| D3 | Certifications | Keep **IBM Full Stack Software Developer**, **JavaScript: The Complete Guide** and **React — The Complete Guide (incl. Next.js, Redux)**. Drop SCSS/SASS. |
| D4 | Contact | Remove the second phone number (`9458156004`) and the Twitter/X link |
| D5 | Skills | Replace the percentage bars with the resume's **grouped skills** |
| D6 | Projects | Keep **all 10 projects with their images**. The 6 dead links get new URLs from the owner later; until then each renders **without a link**. |
| D7 | CV download | Use the **03 Nov 2026 resume PDF** |

---

## 3. Identity and header

| Field | Value | Source | Status |
|---|---|---|---|
| Name | Mohd Shahrukh | [R] [S] | ✅ |
| Professional title | Software Development Engineer \| Frontend | [R] | ✅ |
| Title (live site) | Software Development Engineer – Frontend | [S] | 🔄 Same meaning; [R] punctuation preferred |
| Location | Bangalore, Karnataka, India | [R] [S hero] | ✅ |
| Location (contact section variant) | Bengaluru, Karnataka, India | [S] | ⚠️ Spelling: Bangalore or Bengaluru (Phase 03) |
| Header phone | (+91) 9760787661 | [S] [R] | ✅ |
| Logo | Image `images/logo.png` (alt "Mohd Shahrukh") | [S] | ✅ See [ASSET_INVENTORY.md](ASSET_INVENTORY.md) |

---

## 4. Navigation [S]

| Order | Label | Target |
|---|---|---|
| 1 | Home | `#home` |
| 2 | About Me | `#about` |
| 3 | What I Do | `#services` |
| 4 | Resume | `#resume` |
| 5 | Portfolio | `#portfolio` |
| 6 | Testimonials | `#testimonial` |
| 7 | Contact Me | `#contact` |

The overlay menu also contains LinkedIn and GitHub icon links. The "Hire" CTA band has no nav entry. Status: ✅ (the final IA is decided in Phase 03).

---

## 5. Hero (`#home`) [S]

| Element | Verbatim content | Status |
|---|---|---|
| H1 | Hi, I'm | ✅ |
| Typed string 1 | Mohd Shahrukh | ✅ |
| Typed string 2 | a Software Development Engineer | ✅ |
| Typed string 3 | a Frontend Developer | ✅ |
| Typed string 4 | a UI/UX Designer | ⚠️ Not a title in [R] (Phase 03) |
| Location line | Based in Bangalore, Karnataka, India. | ✅ |
| Primary CTA | View My Work → `#portfolio` | ✅ |
| Secondary CTA | Contact Me → `#contact` | ✅ |
| Image | `headshot-2.png`, alt "Mohd Shahrukh - Software Engineer", title "I'm Mohd Shahrukh" | ✅ (alt text to be corrected) |

---

## 6. About / Executive summary

### 6.1 Current — [R] Executive summary ✅

> Frontend Engineer with 6+ years of experience building fintech, proptech and enterprise web applications. At AltInvest (formerly PropShare), delivered SSO, investor onboarding, video KYC, document signing and compliance journeys for a SEBI-regulated SM REIT platform. Hands-on experience with React.js, Next.js, TypeScript, Redux Toolkit and React Query, with testing in Jest, React Testing Library and Playwright. Strong in frontend performance, API request optimization and WCAG 2.1 AA accessibility.

### 6.2 Live site About section [S] 🔄 (superseded by 6.1)

- Eyebrow: "About Me". Heading: "Know Me More". Sub-heading: "Hi, I'm **Mohd Shahrukh**"
- Paragraph 1:
  > Frontend-focused Software Development Engineer with **5+ years** building regulated, investor-facing web applications across proptech and fintech. I own end-to-end delivery of compliance-critical product flows — SSO authentication, video KYC, document signing, and investor onboarding — on a **SEBI-regulated SM REIT platform serving 5,000+ investors**.
- Paragraph 2:
  > Deep React.js and design-system expertise, with a track record of driving **WCAG 2.1 AA accessibility** (150+ issues resolved) and shipping scalable, reusable frontend architecture. IBM Full Stack certified; skilled in Playwright E2E testing, SCSS/SASS, Tailwind CSS, and modern JavaScript (ES6+). Targeting SDE-2 / Senior Frontend roles.
- Buttons: GitHub, LinkedIn
- Stat badge: "**5+** Years of **Experience**". 🔄 Becomes **6+** per [R].

| Item | Status |
|---|---|
| "Targeting SDE-2 / Senior Frontend roles." | ⚠️ Not in [R]. Under D1, no availability or targeting statement is added. Phase 03 decides whether to drop it. |
| Years stat | 🔄 6+ |

---

## 7. Services — "What I Do" (`#services`) [S] ✅

Eyebrow: "What I Do?" · Heading: "How I Can Help Your Next Project"

| # | Title | Icon (FA) | Verbatim description |
|---|---|---|---|
| 1 | Web Design | `fa-desktop` | I design compelling, visually attractive websites using HTML5, CSS3, Bootstrap, and Figma — from wireframes and high-fidelity prototypes to production, focused on clean, conversion-driven design. |
| 2 | Frontend Engineering | `fa-pencil-ruler` | I build scalable React.js applications with reusable component libraries, design-system conventions, REST API integration, and compliance-critical flows — SSO, vKYC, document signing, and multi-step onboarding. |
| 3 | Accessibility & Compliance | `fa-universal-access` | I audit and remediate web applications to WCAG 2.1 AA — implementing ARIA roles, keyboard navigation, and screen-reader support. Delivered 150+ fixes across a SEBI-regulated investor onboarding platform. |
| 4 | Testing & QA | `fa-vial` | I author end-to-end Playwright suites and Jest / React Testing Library unit & component tests across compliance-critical flows — catching regressions before release and stabilising high-risk paths across browsers. |

Note: the services are consistent with [R]. Phase 03 may refresh the wording to reflect the [R] stack (Next.js, TypeScript, performance) **only with owner approval**.

---

## 8. Experience — [R] ✅ (supersedes [S] and [O])

### 8.1 AltInvest Online Platform (formerly PropShare) · Bangalore

- **Role:** Software Development Engineer
- **Dates:** May 2024 – Oct 2026 (D1)
- **Tagline:** India's SEBI-regulated SM REIT investment platform
- **Bullets (verbatim):**
  1. Built and maintained investor-facing features for a SEBI-regulated SM REIT platform serving 5,000+ registered investors using React.js, Next.js and TypeScript, with Redux Toolkit for client state and React Query for server state, caching and submission mutations.
  2. Delivered the Single Sign-On (SSO) module, implementing secure token lifecycle handling, session expiry, protected cross-module redirects and error-recovery states.
  3. Owned key investor journeys including multi-step onboarding, profile/taxation resubmission, disclosures and payment interfaces, with conditional flows for resident and NRI investors.
  4. Integrated the DigiO video-KYC SDK, implementing asynchronous verification states, session polling and fallback handling for incomplete or failed attempts.
  5. Implemented document-signing and consent-capture experiences with signature-status tracking, confirmation states and audit-trail support.
  6. Developed the compliance document upload module using AI-assisted development with Claude Code, defining its component architecture and folder conventions with reusable React components and shared UI patterns.
  7. Wrote Jest and React Testing Library tests for components and UI/API integration, and Playwright end-to-end tests for SSO, onboarding, vKYC and document-signing journeys; used Claude Code and Codex to write test cases and support PR and code reviews.
  8. Optimized an API-dependent workflow from ~110 seconds to 2–3 seconds by removing duplicate requests, parallelizing independent calls, improving payload handling and resolving asynchronous race conditions.
  9. Reduced large image assets from ~15–30 MB to 300–400 KB through compression and render-size optimization, and resolved 150+ WCAG 2.1 AA accessibility issues across critical investor journeys.
  10. Integrated AWS S3 for file uploads and storage and CloudFront for static asset and document delivery; prepared frontend builds and coordinated releases with DevOps and backend teams.
  11. Built the PropShare Titania commercial real-estate listings experience with responsive, filterable property search.

### 8.2 BrandSystems India Pvt. Ltd. · Bangalore

- **Role:** Web Developer
- **Dates:** Dec 2021 – Apr 2024
- **Bullets (verbatim):**
  1. Owned frontend development of LAM, a multi-channel campaign-management platform, building analytics dashboards and campaign-scheduling interfaces.
  2. Built data visualizations for impressions, CTR and conversions; worked with backend developers on API contracts and data integration.
  3. Prototyped feature and module flows in Balsamiq to align product and stakeholders before development.
  4. Built MARCOM, a responsive market-research management tool using JavaScript and Tailwind CSS, delivering production UI from wireframes and prototypes.

### 8.3 SOSUDATECH Pvt. Ltd. · Noida

- **Role:** UI/UX Developer
- **Dates:** Sep 2020 – Nov 2021
- **Bullets (verbatim):**
  1. Delivered 10+ client websites and web applications, owning frontend implementation from wireframes through production deployment.
  2. Built reusable UI components and design patterns, and improved maintainability through clean, modular frontend code.

### 8.4 Superseded experience data [S] 🔄

| Field | Live site [S] | Now [R] |
|---|---|---|
| AltInvest company name | AltInvest Online Platform Private Limited | AltInvest Online Platform (formerly PropShare) |
| AltInvest dates | 2024 – Present | May 2024 – Oct 2026 |
| AltInvest tagline | India's SM REIT investment platform (SEBI-regulated) — serving 5,000+ investors | India's SEBI-regulated SM REIT investment platform |
| AltInvest bullets | 9 bullets | 11 bullets (above) |
| BrandSystems role | Frontend Developer | Web Developer |
| BrandSystems dates | 2021 – 2024 | Dec 2021 – Apr 2024 |
| SOSUDATECH dates | 2020 – 2021 | Sep 2020 – Nov 2021 |
| SOSUDATECH bullets | 3 bullets | 2 bullets |

---

## 9. Skills — [R] grouped skills ✅ (D5)

| Group | Skills (verbatim) |
|---|---|
| Frontend | React.js, Next.js, JavaScript (ES6+), TypeScript, HTML5, CSS3, SCSS/SASS, Tailwind CSS, Bootstrap 5, responsive UI |
| State & APIs | Redux Toolkit, React Query (TanStack Query), REST APIs, async request handling |
| Testing | Jest, React Testing Library, Playwright — unit, component, UI/API integration and end-to-end testing |
| Architecture | Reusable React components, component libraries, design systems, frontend architecture, code reviews |
| Performance & Accessibility | Lighthouse, Core Web Vitals, API request optimization, image optimization, WCAG 2.1 AA, ARIA, keyboard navigation, screen-reader support |
| Frontend Security | SSO, token lifecycle handling, session management, secure redirects |
| Cloud & Delivery | AWS S3, CloudFront, Docker, Vite, Git, GitHub/GitLab/Bitbucket, CI/CD collaboration, frontend release coordination, Agile/Scrum |
| AI-Assisted Development | Claude Code, Codex — feature development, test-case writing, PR and code reviews |
| Design | Figma, Balsamiq, wireframing, prototyping, usability feedback |

### Superseded skills content [S] 🔄 / 🗑️

| Live-site item | Status |
|---|---|
| Percentage bars: HTML5 / CSS3 95%, JavaScript (ES6+) 85%, React.js 80%, SCSS / SASS 80%, Tailwind CSS 85%, Bootstrap 5 90%, Accessibility (WCAG 2.1 AA) 85%, Testing (Playwright / Jest / RTL) 75% | 🗑️ D5 |
| Tools & Technologies — Design: Figma, Wireframing, Prototyping, Usability Testing | 🔄 [R] "Design" |
| Tools & Technologies — DevOps & Tooling: Git, GitHub / GitLab / Bitbucket, Docker, CI/CD, Agile / Scrum | 🔄 [R] "Cloud & Delivery" |
| Tools & Technologies — Architecture: Component libraries, Design systems, REST API integration, Responsive / Mobile-first | 🔄 [R] "Architecture" |
| Tools & Technologies — Fintech / Compliance: SSO, vKYC, Document signing, Consent capture & audit trails, SEBI-regulated flows | 🔄 [R] "Frontend Security" (fintech items covered in Experience) |
| Tools & Technologies — Learning: TypeScript, Next.js, Node.js | 🗑️ Outdated. TS and Next.js are hands-on in [R]; Node.js is not in [R]. |

---

## 10. Certifications ✅ (D3)

| # | Certification | Issuer | Source |
|---|---|---|---|
| 1 | IBM Full Stack Software Developer | IBM / Coursera (Professional Certificate) | [R] [S] |
| 2 | JavaScript: The Complete Guide | Udemy | [S] (kept per D3) |
| 3 | React — The Complete Guide (incl. Next.js, Redux) | Udemy | [R] |
| — | ~~SCSS / SASS: The Complete Course — Udemy~~ | | 🗑️ D3 |

Missing for all certifications: ❌ completion dates and ❌ credential URLs. Omit them unless the owner supplies them.

---

## 11. Education ✅ (D2)

| Degree | Institution | Date | Source |
|---|---|---|---|
| B.Tech, Electronics & Communication Engineering | Bipin Tripathi Kumaon Institute of Technology, Dwarahat | Graduated 2019 | [R] |

Removed under D2: 🗑️ Diploma in Electronics Engineering — Government Polytechnic Nainital / 2012 - 2015; 🗑️ Intermediate — Mahatma Gandhi Inter College / 2010 - 2012. The live-site Bachelor entry ("Bachelor in Electronics & Communication Engineering … 2016 - 2019") is 🔄 superseded by the [R] wording.

---

## 12. Portfolio projects (`#portfolio`)

Eyebrow: "Portfolio" · Heading: "Some Of My Most Recent Projects" · Filters: **All**, **Front-End Development** (`.mockups`), **Web Design** (`.detailed`)

| # | Title [S] | Subtitle / category [S] | Filter [S] | Image | Live link [S] | Link status | Decision |
|---|---|---|---|---|---|---|---|
| 1 | Digital Asset Management | Marketing Resource Management (MRM) | Front-End Development | `marcom-blurr.png` (blurred) | none (`#portfolio`) | Confidential | ✅ Keep, no link |
| 2 | Approval Software Management | Collaborate - Approval& Review Workflows | Front-End Development | `collaborate-blur.png` (blurred) | none (`#portfolio`) | Confidential | ✅ Keep, no link; fix "Approval&" typo |
| 3 | Campaign Management | LAM - Campaign Management Software | Front-End Development | `lam-blur.png` (blurred) | none (`#portfolio`) | Confidential | ✅ Keep, no link |
| 4 | Job Listing Website | Latest Jobs, Results, & more... | Web Design | `sarkarijobskhoj.com_(Desktop 1920).png` | `https://sarkarijobkhoj.com/` | ❌ Dead | ✅ Keep with image; link pending (D6) |
| 5 | SOSUDATECH Pvt. Ltd. | Education | Front-End Development | `www.sosudatech.com_(Desktop 1920).png` | `https://www.sosudatech.com/` | ✅ Live | ✅ Keep with link |
| 6 | Virtual University | Education | Front-End Development | `virtual_375x393.png` | `https://universitytemplate.mohdshahrukh.in/` | ❌ Dead | ✅ Keep with image; link pending (D6) |
| 7 | QuickCashTx | Banking & Fund Transfer | Front-End Development | `e-wallet_375x393.png` | `https://quickcashtx.mohdshahrukh.in/` | ❌ Dead | ✅ Keep with image; link pending (D6) |
| 8 | Niles Academy | Education & Teaching | Front-End Development | `nile_1_375x393.png` | `https://nilesacademy.mohdshahrukh.in/` | ❌ Dead | ✅ Keep with image; link pending (D6) |
| 9 | Swiss Cosmetics | Beauty & Fashion | Front-End Development | `swisscosmetics.mohdshahrukh.in_(Desktop 1920).png` | `https://swisscosmetics.mohdshahrukh.in/` | ❌ Dead | ✅ Keep with image; link pending (D6) |
| 10 | Frontier Mining Solutions | Mining Services | Front-End Development | `frontierminingsssolutions.mohdshahrukh.in_(Desktop 1920).png` | `https://frontierminingsssolutions.mohdshahrukh.in/` | ❌ Dead | ✅ Keep with image; link pending (D6) |

**Image alt text on the live site (verbatim):** 1 "Digital Asset Management - MRM platform" · 2 "Approval and Review Workflow Software" · 3 "LAM Campaign Management Software" · 4 "SarkariJobKhoj - Government job listing website" · 5 " SOSUDATECH Pvt. Ltd. - Education and teaching website" · 6 " Virtual University - Education and teaching website" · 7 "QuickCashTx - Banking and fund transfer app" · 8 "Niles Academy - Education and teaching website" · 9 "Swiss Cosmetics - Beauty and fashion website" · 10 "Frontier Mining Solutions - Mining services website"

### 12.1 Project metadata from [R]

| Project | Data in [R] |
|---|---|
| SOSUDATECH (#5) | "sosudatech.com · Sosuda Tech corporate website", **Nov 2020**: "Designed and developed the company's corporate website using HTML5, CSS3, JavaScript, jQuery and Bootstrap 4.5, creating UI assets in Photoshop." ✅ |
| LAM (#3) | Experience bullet at BrandSystems (see 8.2) ✅ |
| MARCOM (#1, "Digital Asset Management") | Experience bullet at BrandSystems (see 8.2) ✅. ⚠️ The live site titles this "Digital Asset Management / MRM" while its image filename is `marcom-blurr.png`, and [R] describes MARCOM as a "market-research management tool". Confirm the title and description in Phase 03. |
| mohdshahrukh.in | [R] project, **Mar 2023 – Present**: "Personal site showcasing my work across web design, frontend engineering, accessibility & compliance, and testing & QA, with resume, project portfolio, testimonials and contact sections." / "Designed and built a responsive, accessible UI in HTML5, CSS3, JavaScript, Bootstrap 5 and Tailwind CSS, with automated deployment to Hostinger through a Bitbucket CI/CD pipeline." ⚠️ Not a portfolio entry on the live site; the stack description becomes outdated after the rebuild (Phase 03). |
| PropShare Titania | Experience bullet only (8.1 #11). ⚠️ Not a portfolio entry; no image available. |

### 12.2 Missing project data ❌

For **all** projects, the following are missing: individual descriptions (beyond the one-line subtitle), dates (except SOSUDATECH), tech stack (except SOSUDATECH), role, client, and outcomes. Phase 03 will **not invent** them. The owner may supply them or the cards will show only verified fields.

---

## 13. Call-to-action band [S] ✅

| Element | Verbatim |
|---|---|
| Heading | Interested in working with me? |
| Button 1 | Call Me! → `#contact` |
| Button 2 | Hire Me! → `#contact` |

⚠️ "Call Me!" scrolls to the contact section instead of starting a `tel:` call (Phase 03).

---

## 14. Testimonials (`#testimonial`) [S] ✅

Eyebrow: "Endorsements" · Heading: "What My Colleagues Say"

| # | Quote (verbatim) | Name | Attribution | Photo |
|---|---|---|---|---|
| 1 | "Always available to help, incredibly proficient, hits deadlines without fail, hard working and trustworthy. In my experience, no project is too much trouble, and with Mohd Shahrukh you really get a rare entity – someone that can simplify what can be a very complex industry at times." | Sowmit Nag | Sr. Web Designer \| Co-Owner | `testimonial/sowmit.png` |
| 2 | “I’m always impressed by how you treat everyone with the same respect and a positive attitude. You genuinely embody the company’s spirit and our core values in everything you do and you inspire us all to do the same!” (the live HTML has a stray space after the opening quote) | Divesh Kumar | CTO \| Technology Evangelist | `testimonial/Divesh-sir.jpg` |

Missing: ❌ company names for both testimonials, ❌ dates, ❌ LinkedIn or source links. ⚠️ Confirm in Phase 03 that both endorsements (and photos) may continue to be published.

---

## 15. Contact (`#contact`)

| Element | Verbatim / value | Status |
|---|---|---|
| Heading | Let's get in touch | ✅ |
| Intro | I enjoy discussing new projects and design challenges. Please share as much info as possible so we can get the most out of our first catch-up. | ✅ |
| "Based In:" | Bengaluru, Karnataka, India | ✅ (spelling ⚠️, see §3) |
| "Phone:" | (+91) 9760787661 | ✅ |
| Second phone | (+91) 9458156004 | 🗑️ D4 |
| "Email:" | khan.shahrukh156@gmail.com | ✅ |
| LinkedIn | https://www.linkedin.com/in/mohd-shah-rukh-703aa3153/ | ✅ |
| GitHub | https://github.com/Srk0o007 | ✅ |
| Twitter | https://twitter.com/shahrukh156 | 🗑️ D4 |
| Website | mohdshahrukh.in | ✅ [R] |
| Decorative image | `images/faq.png` | ✅ (decorative) |
| Form heading | Send Me a Message | ✅ |
| Field 1 | "What is Your Name:" (text, required, `name="name"`) | ✅ |
| Field 2 | "Your Email Address:" (email, required, `name="email"`) | ✅ |
| Field 3 | "How can I Help you?:" (textarea, required, `name="form-message"`) | ✅ |
| Submit | Send → | ✅ |
| Form endpoint | Formspree `xleyzgzo`, HTML POST | ⚠️ Keep Formspree or change provider (Phase 05) |

---

## 16. Footer [S] ✅

| Element | Verbatim |
|---|---|
| Left | Copyright © 2026 **Mohd Shahrukh**. All Rights Reserved. |
| Right | Designed by **Mohd Shahrukh** |
| Back to top | Floating button, tooltip "Back to Top" |

---

## 17. Metadata [S] 🔄

| Field | Current value | Status |
|---|---|---|
| `<title>` | Mohd Shahrukh \| Software Development Engineer – Frontend | ✅ |
| `description` | Mohd Shahrukh — Frontend-focused Software Development Engineer with 5+ years building regulated, investor-facing web applications. SEBI-regulated SM REIT platform, SSO, vKYC, WCAG 2.1 AA. IBM Full Stack certified. Based in Bangalore, India. | 🔄 Rewrite from [R] (6+ years) |
| `og:description` | Frontend-focused Software Development Engineer with 5+ years building regulated, investor-facing web applications. SSO, vKYC, WCAG 2.1 AA. IBM Full Stack certified. Bangalore, India. | 🔄 |
| `twitter:description` | Frontend SDE with 5+ years in React.js, WCAG 2.1 AA accessibility, fintech/proptech platforms. IBM Full Stack certified. Based in Bangalore, India. | 🔄 |
| `og:image` | `./images/headshot-2.png` | 🔄 Absolute URL plus a dedicated 1200×630 image |
| `keywords`, `COPYRIGHT`, `ICBM`, `geo.*`, `rating`, `distribution` | (see the audit) | 🗑️ No value; recommend removing |

---

## 18. Old resume [O] vs current [R] (for the record)

| Topic | [O] Jul 2026 | [R] 03 Nov 2026 |
|---|---|---|
| Years | 5+ | 6+ |
| AltInvest dates | 2024 – Present | May 2024 – Oct 2026 |
| Stack | "Expanding: TypeScript, Next.js, Node.js" | Next.js, TypeScript, Redux Toolkit, React Query are hands-on |
| Sections | Key Engineering Achievements, Selected Projects (AltInvest Accessibility Overhaul, Personal Portfolio) | Projects (mohdshahrukh.in, sosudatech.com) |
| Certifications | IBM, JavaScript: The Complete Guide, SCSS/SASS | IBM, React — The Complete Guide |
| Phone | 9760787661 | 9760787661 |

[O] content that is not in [R] is **not** carried forward unless it also appears on [S] and is kept by an owner decision.

---

## 19. Open items for Phase 03

| # | Item |
|---|---|
| Q1 | Typed role "a UI/UX Designer": keep or drop? |
| Q2 | "Targeting SDE-2 / Senior Frontend roles.": drop (consistent with D1)? |
| Q3 | "Bangalore" vs "Bengaluru": pick one |
| Q4 | Nav and section labels: "What I Do" / "What I Do?", "Testimonials" / "Endorsements" |
| Q5 | Portfolio filter taxonomy (only 1 item is in "Web Design") |
| Q6 | MARCOM vs "Digital Asset Management / MRM" title for project #1 |
| Q7 | Add mohdshahrukh.in and/or PropShare Titania as portfolio entries? |
| Q8 | Any additional project details (descriptions, stack, dates) the owner wants to supply |
| Q9 | Testimonial publishing consent and company names |
| Q10 | "Call Me!" button behaviour (`tel:` link or scroll to contact) |
| Q11 | New URLs for the 6 re-deployed projects (when available) |
| Q12 | Services copy refresh to reflect the [R] stack (owner approval needed) |
