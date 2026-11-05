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

## 2. Backup: the Hostinger zone

Public lookups cannot list every record. Before the change, the owner exports or screenshots the full zone in **hPanel → Domains → mohdshahrukh.in → DNS / Nameservers** and keeps it with this file. Any record that §3 does not list stays as it is.

## 3. Planned changes

Vercel shows the exact values when each domain is added, and those values win if they differ from this table.

| Name | Action | New record |
|---|---|---|
| `@` (apex) | Replace the A and AAAA records above | `A 76.76.21.21` (Vercel) |
| `@` AAAA | Remove the two Hostinger AAAA records | none (otherwise IPv6 visitors would still reach the old host) |
| `www` | Replace the CNAME | `CNAME cname.vercel-dns.com.` |
| `_vercel` TXT | Add, only if Vercel asks for verification | the value Vercel shows |
| `ftp` | **Keep** | unchanged |

Any Hostinger "CDN" or "website" toggle for the domain must be turned off, so that Hostinger does not override the apex or `www` record.

## 4. Canonical host

- **Canonical:** `https://mohdshahrukh.in` (the apex). It is the address used in `src/config/site.ts`, the canonical tags, the sitemap and `robots.txt`.
- **`www`:** `https://www.mohdshahrukh.in` gets a 308 redirect to the apex, set in Vercel under **Domains**.
- **`*.vercel.app`:** stays reachable; its canonical tag points to the apex.

## 5. Rollback

1. Restore the records in §1 in hPanel; the TTL is short, so this takes effect in minutes to an hour.
2. The old Hostinger site is not touched, so it comes back as soon as DNS points to it again.

## 6. Change log

| Date | Change | By |
|---|---|---|
| 2026-11-05 | Backup taken (§1). No change made. | Claude (read-only lookup) |
