# SEO Checklist

**Phase:** 11 — Performance, SEO & Quality Assurance
**Date:** 2026-11-04
**Requirements:** NFR-SEO-01–09
**Build checked:** production build (`next build` + `next start`) of branch `phase/11-performance-seo-qa`

**Status key:**
- ✅ done and verified in this build;
- ⏳ can only be verified on the public domain (Phase 12 or the owner).

Lighthouse SEO: **100** in all 10 runs (mobile and desktop, 5 each; see [PERFORMANCE_REPORT.md](PERFORMANCE_REPORT.md)).

## 1. Page metadata

| Item | Value in this build | Status | Evidence |
|---|---|---|---|
| `<title>` | "Mohd Shahrukh \| Software Development Engineer – Frontend" (56 characters) | ✅ | Content invariant I-7; E2E `foundation.spec.ts` |
| Meta description | 158 characters, built only from resume facts | ✅ | I-7 (length limits) |
| `<html lang>` | `en` | ✅ | axe `html-has-lang` |
| Viewport | `width=device-width, initial-scale=1` (zoom not disabled) | ✅ | Lighthouse `viewport` |
| Theme colour | Light `#f5f2ea`, dark `#121211` (by system preference) | ✅ | Two `theme-color` tags |
| Headings | One `h1` (name), 10 section `h2`s, no skipped levels | ✅ | Accessibility report §3 (1.3.1) |
| Images | Every `<img>` has `alt` text from content | ✅ | axe `image-alt`; Lighthouse |
| Crawlable content | All text is in the prerendered HTML; no content needs JS | ✅ | Static prerender; no-JS E2E tests |
| Crawlable links | Real `<a href>` anchors; CV, `tel:`, `mailto:` and the project link work without JS | ✅ | Lighthouse `crawlable-anchors`; E2E |

## 2. Canonical URL and indexing

| Item | Value | Status | Evidence |
|---|---|---|---|
| Canonical | `<link rel="canonical" href="https://mohdshahrukh.in">`. Absolute; the root with or without a trailing slash is the same URL. | ✅ | E2E `foundation.spec.ts` |
| Home page indexable | No `noindex` | ✅ | Lighthouse `is-crawlable` |
| 404 page | HTTP 404 with `<meta name="robots" content="noindex">` | ✅ | `curl -I`; E2E |
| One canonical host | `mohdshahrukh.in`; `www` and `*.vercel.app` should redirect or point to it | ⏳ Phase 12 | Configure the domain redirect on Vercel |
| HTTPS only | HSTS header sent (`max-age=63072000; includeSubDomains; preload`) | ✅ header / ⏳ certificate | Certificate is issued by Vercel in Phase 12 |

## 3. Open Graph and social cards

| Item | Value | Status | Evidence |
|---|---|---|---|
| `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale`, `og:type` | From `siteMeta` | ✅ | E2E |
| `og:image` | `/opengraph-image`: 1200×630 PNG (55 KB), built once at build time from content (name, title, location, host) in the site's tokens | ✅ | E2E checks type, size and alt |
| `og:image:alt` | "Mohd Shahrukh — Software Development Engineer \| Frontend" | ✅ | E2E |
| X / Twitter | `summary_large_image` with the same image and alt | ✅ | E2E |
| Real-world preview | LinkedIn Post Inspector, X card preview, WhatsApp / Slack unfurl | ⏳ Phase 12 | Needs the public URL; crawlers cannot reach localhost |

## 4. Sitemap and robots.txt

| Item | Value | Status |
|---|---|---|
| `/robots.txt` | `User-Agent: *`, `Allow: /`, `Sitemap: https://mohdshahrukh.in/sitemap.xml` | ✅ |
| `/sitemap.xml` | One URL (`https://mohdshahrukh.in/`) with `lastmod` set at build time | ✅ |
| Submit the sitemap to Google Search Console and Bing Webmaster Tools | Owner, after the domain is live | ⏳ Phase 12 / owner |

The single-page site has one indexable URL. The CV PDF is linked from the page and is crawlable; it doesn't need a sitemap entry.

## 5. Structured data (JSON-LD)

| Item | Value | Status | Evidence |
|---|---|---|---|
| Format | One `<script type="application/ld+json">` with an `@graph` | ✅ | E2E parses it |
| `WebSite` | `@id`, `url`, `name`, `inLanguage: en`, `publisher` → Person | ✅ | Unit `structured-data.test.ts` |
| `Person` | `name`, `jobTitle`, `url`, `image` (portrait), `sameAs` (GitHub, LinkedIn), `address` (Bangalore, Karnataka, IN) | ✅ | Unit and E2E |
| No phone or email | Owner decision 3 | ✅ | Unit and E2E assert their absence |
| Safe serialisation | `<` escaped, so the data can't close the script element | ✅ | Unit test |
| Google Rich Results Test / Schema.org validator | Needs the public URL | ⏳ Phase 12 | Paste the live URL into `search.google.com/test/rich-results` |

## 6. Icons and manifest

| Item | Value | Status |
|---|---|---|
| Favicon | `/icon.svg` ("MS" monogram) | ✅ |
| Apple touch icon | `/apple-icon`: 180×180 PNG, built at build time | ✅ |
| Web manifest | `/manifest.webmanifest`: name, short name, description, colours, icons (SVG, 192 and 512 PNG) | ✅ (E2E checks every icon returns a PNG) |

## 7. Performance signals (search ranking uses Core Web Vitals field data)

| Item | Status |
|---|---|
| Lab: CLS 0, desktop LCP 0.7–0.8 s, mobile LCP about 3.2–3.4 s under Lighthouse's slow-4G simulation | ✅ measured (PERFORMANCE_REPORT) |
| Field data (CrUX / Search Console Core Web Vitals) | ⏳ Only exists after the live site has real traffic (about 28 days) |

## 8. Owner actions after launch (Phase 12)

1. Add `mohdshahrukh.in` to **Google Search Console** (DNS verification at Hostinger), then submit `https://mohdshahrukh.in/sitemap.xml`. Optionally do the same in **Bing Webmaster Tools**.
2. Run the live URL through the **Rich Results Test** and **LinkedIn Post Inspector**, so LinkedIn refreshes its cached preview of the old site.
3. Update the website link on **LinkedIn and GitHub** profiles if needed (same domain, so no change is expected).
4. After about four weeks, check **Core Web Vitals** in Search Console.
