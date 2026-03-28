# ADR-002: Denormalized Block Counter for Free Tier Quota Enforcement

**Status:** Accepted
**Date:** 2026-03-28
**Scenario:** SC-WS-003, SC-ORG-005
**Deciders:** Architecture team

---

## Context

Free tier users are limited to 1,000 Editor.js blocks across all pages in their workspace (BC-2 US-WS-001). The platform must:
- Check quota on every block creation (must be fast)
- Accurately reflect current count at all times
- Support both adding and removing blocks

---

## Decision

Maintain a **denormalized `block_count` integer column** on the `workspaces` table, updated transactionally on every block create/delete.

Additionally, maintain a `block_count` on each `pages` row for per-page statistics.

Quota check before insert:
```sql
SELECT block_count FROM workspaces WHERE id = $1 FOR UPDATE;
-- if block_count >= 1000 AND tier = 'free': reject with BLOCK_LIMIT_REACHED
-- else: insert block + increment block_count in same transaction
```

---

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| COUNT(*) on every request | Always accurate | Expensive full table scan on large workspaces; N+1 problem |
| Redis counter | Fast; atomic INCR | Additional dependency; risk of divergence from DB |
| **Denormalized DB column** ✓ | Fast single-row read; transactional consistency | Requires careful update on delete/restore; slight denormalization |
| Event sourcing | Perfect audit trail | Massive over-engineering for a quota counter |

---

## Consequences

### Positive
- Quota check is a single indexed row read — O(1)
- Counter stays consistent within the same DB transaction as the write
- Works without Redis dependency

### Negative
- Must update `block_count` on block delete, page delete (cascade), and version restore
- Risk of drift if a block delete fails silently — mitigated by periodic reconciliation job
- `FOR UPDATE` row lock on workspace during block creation may create contention under high concurrent writes

---

## Implementation Notes

- On `pages.content` update (auto-save): calculate delta = `new_block_count - old_block_count`; apply delta to `workspaces.block_count`
- On soft-delete of page: decrement `workspaces.block_count` by `pages.block_count`
- Reconciliation: nightly job re-counts actual blocks and corrects any drift

---

## Related

- SC-WS-003 (Free tier block limit)
- SC-ORG-005 (Block limit on page edit)
