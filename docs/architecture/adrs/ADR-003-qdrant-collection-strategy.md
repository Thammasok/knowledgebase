# ADR-003: Per-Workspace Qdrant Collection Strategy

**Status:** Accepted
**Date:** 2026-03-28
**Scenario:** SC-FILE-004, SC-LINK-003, SC-SEARCH-001
**Deciders:** Architecture team

---

## Context

Qdrant stores vector embeddings for semantic search. We need to decide how to namespace content between workspaces to ensure:
- Search is always scoped to the current workspace
- Diary entries are never visible to other workspace members
- Tier-specific RAG scoping (Free: notes+files only; Personal: all types)

---

## Decision

Use **one Qdrant collection per content type per workspace**:

```
workspace_{workspaceId}_notes
workspace_{workspaceId}_files
workspace_{workspaceId}_links
workspace_{workspaceId}_diary
```

Each point stores a `userId` in the payload. Diary collection is filtered by `userId == callerUserId` at query time, ensuring privacy.

Tier-based scoping is applied at query time by selecting which collections to search:
- Free: `notes` + `files`
- Personal/Startup: `notes` + `files` + `links` + `diary` (diary filtered by userId)

---

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Single global collection with filters | Simple setup | Complex filter logic; risk of cross-workspace leakage if filter missed |
| One collection per workspace | Simpler queries | Mix of content types requires filter on `contentType`; diary privacy harder |
| **Per-type per-workspace** ✓ | Clean separation; tier scoping by collection selection; privacy by design | More collections to manage; collection creation on workspace provisioning |
| One collection per user | Maximum isolation | Too many collections at scale; no team-shared content possible |

---

## Consequences

### Positive
- Workspace isolation is structural — impossible to accidentally cross-query
- Diary privacy enforced by querying diary collection with `userId` filter (not just payload)
- Tier enforcement is a collection selection decision — simple and auditable
- Each collection can be independently tuned for HNSW parameters

### Negative
- 4 collections created per workspace at provisioning time
- Multi-collection search requires parallel Qdrant requests + result merge
- Collection names must be sanitized (UUID slugs, not user-provided names)

---

## Implementation Notes

- Collections provisioned lazily on first content insert (not at workspace creation)
- Collection naming: `ws_{workspaceId_no_hyphens}_{type}` (e.g. `ws_abc123def456_notes`)
- Embedding model: `text-embedding-3-small` (1536 dimensions) for platform model; adapter pattern for BYOK providers
- On workspace deletion: cascade delete all 4 Qdrant collections

---

## Related

- ADR-004 (Embedding model selection — TBD)
- SC-SEARCH-001, SC-SEARCH-002
