# DNS Configuration — mohdshahrukh.in

Phase 12. DNS is hosted at **Hostinger** (nameservers `ns1.dns-parking.com`, `ns2.dns-parking.com`; SOA `dns.hostinger.com`). The nameservers stay at Hostinger: only the records listed in §3 change.

**Rules:**
- Never change DNS before the records are backed up (§1, §2).
- Never delete an email record without the owner's explicit confirmation.

## 1. Backup: public records before the change

Captured on 2026-11-05 from Cloudflare's resolver (`1.1.1.1`).

| Name | Type | Value |
|---|---|---|
| `mohdshahrukh.in` | A | `88.222.243.152` |
| `mohdshahrukh.in` | A | `93.127.173.39` |
| `mohdshahrukh.in` | AAAA | `2a02:4780:3c:cc15:17d6:2578:d0b2:98d7` |
| `mohdshahrukh.in` | AAAA | `2a02:4780:20:cd1f:d185:daf5:2749:57bc` |
| `www.mohdshahrukh.in` | CNAME | `www.mohdshahrukh.in.cdn.hstgr.net` (Hostinger CDN) |
| `ftp.mohdshahrukh.in` | A | `82.112.239.33` |
| `mohdshahrukh.in` | NS | `ns1.dns-parking.com`, `ns2.dns-parking.com` |

These names returned no record:
- **Mail:** `mohdshahrukh.in` MX and TXT (so no SPF), `_dmarc`, the `default` and `hostingermail-a/b/c` DKIM selectors, `mail`, `autodiscover` and `autoconfig`.
- **CAA:** none.

**Email:** the domain has no email records today, so the change cannot affect email. If any MX, SPF, DKIM or DMARC record appears in the Hostinger panel, it stays as it is.

## 2. Backup: the Hostinger zone (hPanel, 2026-11-05 14:53)

Taken from the owner's screenshot of **hPanel → Domains → mohdshahrukh.in → DNS / Nameservers**. This is the authoritative list.

| # | Type | Name | Content | TTL | Phase 12 |
|---|---|---|---|---|---|
| 1 | ALIAS | `@` | `mohdshahrukh.in.cdn.hstgr.net` | 300 | **Replace** (§3) |
| 2 | CNAME | `www` | `www.mohdshahrukh.in.cdn.hstgr.net` | 300 | **Edit** (§3) |
| 3 | A | `ftp` | `82.112.239.33` | 1800 | Keep |
| 4 | CNAME | `hostingermail-a._domainkey.universitytemplate` | `hostingermail-a.dkim.mail.hostinger.com` | 300 | Keep (email) |
| 5 | CNAME | `hostingermail-b._domainkey.universitytemplate` | `hostingermail-b.dkim.mail.hostinger.com` | 300 | Keep (email) |
| 6 | CNAME | `hostingermail-c._domainkey.universitytemplate` | `hostingermail-c.dkim.mail.hostinger.com` | 300 | Keep (email) |
| 7 | CNAME | `autodiscover.universitytemplate` | `autodiscover.mail.hostinger.com` | 300 | Keep (email) |
| 8 | CNAME | `autoconfig.universitytemplate` | `autoconfig.mail.hostinger.com` | 300 | Keep (email) |
| 9 | TXT | `universitytemplate` | `"v=spf1 include:_spf.mail.hostinger.com ~all"` | 3600 | Keep (email, SPF) |

**Email:** rows 4–9 are Hostinger Mail records (DKIM, SPF and client autoconfiguration) for the subdomain `universitytemplate.mohdshahrukh.in`. The site does not use that subdomain. **None of these rows change.**

There is no MX record for that subdomain, publicly or in the panel. That is an existing state, not something Phase 12 changes.

The apex `@` has no MX, SPF or DMARC, so moving the website cannot affect email. The A and AAAA addresses in §1 are what the Hostinger CDN `ALIAS` (row 1) resolves to; they are not separate records.

## 3. Planned changes (two rows only)

The values below are the usual Vercel targets. **Use exactly what Vercel shows** under **Project → Settings → Domains** for each domain; newer projects may show a project-specific A address or CNAME target.

| Row | Action in hPanel | Result |
|---|---|---|
| 1 `ALIAS @` | Delete it, then add `A`, name `@`, the value Vercel shows (e.g. `76.76.21.21`), TTL 300 | Apex → Vercel |
| 2 `CNAME www` | Edit the content to the target Vercel shows (e.g. `cname.vercel-dns.com`), TTL 300 | `www` → Vercel, which redirects (308) to the apex |
| — | Add `TXT _vercel` only if Vercel asks for ownership verification | Verification |
| 3–9 | No change | FTP and email untouched |

Order: add the domains in Vercel first. Then change row 2, then row 1. Then wait for Vercel to show **Valid Configuration** and issue the certificates.

## 4. Canonical host

- **Canonical:** `https://mohdshahrukh.in` (the apex). It is the address used in `src/config/site.ts`, the canonical tags, the sitemap and `robots.txt`.
- **`www`:** `https://www.mohdshahrukh.in` gets a 308 redirect to the apex, set in Vercel under **Domains**.
- **`*.vercel.app`:** stays reachable; its canonical tag points to the apex.

## 5. Rollback

1. In hPanel, restore rows 1 and 2 of §2. Delete the new `A @`, re-add `ALIAS @ → mohdshahrukh.in.cdn.hstgr.net`, and set `www` back to `www.mohdshahrukh.in.cdn.hstgr.net`. The TTL is 300 s, so this takes effect in minutes.
2. The old Hostinger site is not touched, so it comes back as soon as DNS points to it again.

## 6. Change log

| Date | Change | By |
|---|---|---|
| 2026-11-05 | Backup taken (§1 public lookup, §2 hPanel screenshot). No change made. | Claude (read-only) |
