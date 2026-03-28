# ADR-001: JWT Access + Refresh Token Authentication Strategy

**Status:** Accepted
**Date:** 2026-03-28
**Scenario:** SC-AUTH-004, SC-AUTH-007
**Deciders:** Architecture team

---

## Context

The platform needs stateless authentication that supports:
- Multiple device sessions per user (`x-device-id` tracking)
- Silent token renewal without re-login
- Fast revocation on logout or security events
- Horizontal scaling (stateless API servers)

---

## Decision

Use **short-lived JWT access tokens (15 min)** combined with **long-lived opaque refresh tokens (30 days)** stored in PostgreSQL.

- Access token: signed JWT containing `userId`, `tier`, `workspaceId`, expires 15 min
- Refresh token: cryptographically random opaque token; only SHA-256 hash stored in DB
- One refresh token per `(user_id, device_id)` pair; rotated on use

---

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Session cookies (server-side) | Easy revocation, no token leakage | Not stateless; requires sticky sessions or Redis session store for all reads |
| Long-lived JWT only | Simple implementation | Cannot revoke without token blacklist; 30-day exposure window if stolen |
| Short JWT + Redis session | Instant revocation; stateless read | Redis becomes critical path for every request |
| **Short JWT + DB refresh token** ✓ | Fast reads (JWT validated locally); revocation via DB; multi-device support | Slightly more complex rotation logic |

---

## Consequences

### Positive
- API servers validate access tokens without DB hit (fast)
- Refresh tokens revocable immediately (DB update)
- Per-device sessions enable targeted revocation (e.g. "log out all devices")
- Aligns with standard OAuth 2.0 patterns

### Negative
- Access tokens cannot be instantly revoked (15-min window after compromise)
- Refresh token rotation adds one extra DB write per token refresh cycle
- Must handle token rotation race condition (concurrent refresh requests)

---

## Related

- SC-AUTH-007 (Silent token refresh)
- ADR-002 (Password hashing strategy — separate concern)
