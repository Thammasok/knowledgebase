# ADR-005: Use ULID for Primary Keys

**Status:** Accepted
**Date:** 2026-03-28
**Deciders:** Engineering team

---

## Context

Primary key type was needed for all entity tables. The original architecture design specified UUID (`gen_random_uuid()`). The actual implementation uses ULID (`@default(ulid())` via Prisma).

## Decision

Use ULID (Universally Unique Lexicographically Sortable Identifier) for primary keys on `Accounts`, `AccountRequestAccess`, and `Workspace`. Use UUID for `AuthSession` (which uses `@default(uuid())`).

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| UUID v4 | Standard, widely supported, no ordering | Random — not sortable, longer string |
| ULID | Sortable by creation time, URL-safe, same uniqueness guarantees | Less universally supported; needs Prisma extension |
| Auto-increment integer | Simple, compact | Sequential leak, hard to distribute |

## Consequences

**Positive:**
- ULIDs are lexicographically sortable — default `ORDER BY id` gives chronological order without a separate `created_at` index
- URL-safe (no hyphens like UUID)
- Same 128-bit uniqueness as UUID v4

**Negative:**
- Not a standard PostgreSQL type — stored as `VARCHAR` or `TEXT`
- Requires `ulid()` Prisma extension support
- `AuthSession` uses UUID inconsistently (mixed strategy in schema)

## Related

- SC-AUTH-001 (accounts creation)
- ADR-001 (JWT auth strategy)
