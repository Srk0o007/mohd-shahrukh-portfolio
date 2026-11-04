# ADR 0006: Formspree contact form with progressive enhancement

- **Status:** Accepted
- **Date:** 2026-11-04

## Context

A contact form is a Must:
- FR-CON-02–05: fields, validation, in-page asynchronous status, spam protection.
- FR-CON-06 (Should): it must also work without JS.

A statically rendered site cannot send email itself. The live site already uses Formspree (form `xleyzgzo`). The brief asks to avoid unnecessary backend infrastructure.

## Decision

Keep **Formspree** as the form endpoint. The form:
- renders as a real `<form action="https://formspree.io/f/<id>" method="post">`, so it works without JS;
- with JS, the `ContactForm` island intercepts submit, validates with `lib/validate-contact.ts`, and POSTs `FormData` with `Accept: application/json`;
- shows success and error in place (`role="status"` / `role="alert"`);
- carries the Formspree honeypot field `_gotcha`, visually and programmatically hidden;
- keeps the form ID in `src/config/site.ts`. It is public by design (it appears in the HTML), so it is not a secret.

The CSP allows `https://formspree.io` in `connect-src` and `form-action` ([ADR 0008](0008-csp-for-static-pages.md)). Field names become `name`, `email` and `message`; the old `form-message` field name is retired.

## Alternatives considered

| Option | Why not |
|---|---|
| Next.js Route Handler or Server Action + email API (e.g. Resend) | Adds serverless runtime, a secret API key, sender-domain DNS records and abuse handling: a backend for one form |
| Other form services (Web3Forms, Getform, etc.) | No advantage over the provider already in use |
| `mailto:` only | Fails FR-CON-02/04 (no form, no in-page status) |

## Consequences

- No backend and no secrets.
- **Dependency on a third party:** its availability and free-tier submission limits. The failure path offers the email address (FR-CON-04).
- Without JS, users land on Formspree's confirmation page. That is acceptable for a Should requirement.
- **Open item:** the owner confirms access to the existing Formspree form in Phase 09 (notification email, spam settings, allowed domain). Otherwise a new free form is created and only the config value changes.

## Implementation notes (Phase 09, 2026-11-04)

- **Access:** the owner confirmed access to form `xleyzgzo` (2026-11-04). A read-only `GET` confirmed the endpoint exists (`405 Please submit POST request`); no submission was made.
- **Success rule** (`lib/submit-contact.ts`, owner requirement): success is shown **only** when Formspree confirms acceptance. That means an HTTP 2xx whose JSON body has `"ok": true`. Every other outcome shows the error message with the email fallback and keeps the visitor's input:
  - any non-2xx (validation, rate limit, reCAPTCHA required, server error);
  - any other body;
  - a network error;
  - no response within **15 s** (`AbortController`).
- **Honeypot:** `_gotcha` is always sent. Formspree discards filled submissions itself, so the page **never fakes a success** client-side. This replaces the Phase 05 sketch, which showed success when the honeypot was filled.
- **No-JS:** the form is a plain `POST` with native `required` checks. `noValidate` is set only after hydration, when the accessible inline errors take over.
- **Owner checklist before launch** (Formspree dashboard):
  - reCAPTCHA **off** in Spam protection: forms created before February 2020 had it on by default, which can reject in-page submissions;
  - notification email `khan.shahrukh156@gmail.com`;
  - allowed domains include `mohdshahrukh.in`.
- **Testing:** every automated test intercepts `formspree.io`, so nothing is sent. The real delivery test is sent by the owner from the live site after deployment (owner decision, option b), so no free-plan submissions are used during development.
