# ADR-006: OTP-Based Email Verification via Redis

**Status:** Accepted
**Date:** 2026-03-28
**Deciders:** Engineering team

---

## Context

Email verification is required after registration to confirm ownership of the email address. The original architecture design specified a DB-backed token-link flow (`email_verification_tokens` table, UUID token, link in email). The actual implementation uses a 6-digit OTP stored in Redis.

## Decision

Email verification uses a two-step OTP flow:
1. `POST /auth/verify/mail` → generate 6-digit OTP + reference code, store in Redis with TTL, send via Mailtrap
2. `PATCH /auth/verify/mail` → validate `{ email, ref, otp }` against Redis, mark account verified, delete from Redis

No database table is used for OTP storage.

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| DB token-link (original design) | Persistent, auditable | Requires `email_verification_tokens` table; token in URL can be forwarded/leaked |
| Redis OTP (chosen) | No DB table; short-lived (Redis TTL); familiar UX (OTP entry) | Requires Redis; OTP can expire while user is away |
| Magic link via Redis | Passwordless-style, simple flow | Less user control; link sharing risk |

## Consequences

**Positive:**
- No `email_verification_tokens` table required — simpler schema
- Redis TTL handles expiry automatically — no cleanup job needed
- OTP is short-lived; reference code required in addition to OTP (rate-limit mitigation)
- User enters OTP on-site rather than being redirected from email

**Negative:**
- No audit trail of verification attempts in DB
- If Redis goes down, all pending verifications are lost
- User must complete verification promptly before OTP TTL expires
- OTP approach requires separate `/auth/otp` frontend page

## Frontend Impact

The web app:
1. After signup → stores email (CryptoJS-encrypted) in `localStorage` key `temp-to`
2. Redirects to `/auth/otp` page
3. OTP page calls send-OTP endpoint on mount, shows 6-digit input
4. On verify → redirects to `/auth/signup/complete`

Same flow used when unverified user attempts login.

## Related

- ADR-001 (JWT auth strategy)
- SC-AUTH-002 (email verification scenario)
- TC-AUTH-017 → TC-AUTH-020
