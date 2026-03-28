# Iteration 7 — Semantic Search

**Goal:** Users can search across their workspace content by meaning (not just keywords). Results are ranked by vector similarity and scoped by tier.

**Duration:** 1 week
**Stories in scope:** US-SEARCH-001
**Priority:** Must Have

---

## Scenarios in Scope

- SC-SEARCH-001: Semantic search returns relevant results (ranked by similarity)
- SC-SEARCH-002: Search scope by tier (Free: notes + files only; Personal/Startup: + links + diary)

---

## Test Cases — Definition of Done

**P1 (must all pass):**
- TC-SEARCH-001: Query returns up to 20 results ordered by similarity; each shows type, title, excerpt, link
- TC-SEARCH-002: Free user: link content NOT in search results
- TC-SEARCH-003: Personal/Startup user: link content included in results

**P2 (target):**
- Empty workspace returns empty results (no error)
- Qdrant unavailable → graceful 503 with user-facing message

---

## Developer Tasks

| Task | Title | Layer | Complexity |
|------|-------|-------|-----------|
| DEV-SEARCH-003 | GET /workspace/:id/search?q= — semantic search endpoint | API+Domain | M |
| DEV-SEARCH-004 | Frontend: Search bar (Cmd+K) + results panel | Frontend | M |

> **Pre-requisites:** DEV-SEARCH-001 (Qdrant service) and DEV-SEARCH-002 (EmbeddingService) were shipped in Iteration 4. All indexing jobs (notes in DEV-CONTENT-005, files in DEV-FILE-006, links in DEV-LINK-007, diary in DEV-DIARY-007) must be working from Iterations 1–6 before search returns meaningful results.

---

## NFRs Enforced This Iteration

- NFR-PERF: Search response < 2 seconds for a workspace with 1,000 indexed chunks (Qdrant SLA)
- Graceful degradation: Qdrant unavailable returns 503 SERVICE_UNAVAILABLE (not 500)
- Tier-scoped search: Free users cannot receive link or diary content in results

---

## Increment

At the end of Iteration 7, the following works end-to-end:

> Users can press Cmd+K from anywhere in the app to open the global search bar. Typing a query returns semantically relevant results from their workspace — matching meaning, not just keywords. Results are grouped by type (Notes, Files, Links, Diary) and ranked by similarity score with a 150-character excerpt. Free users only see results from notes and files. Personal/Startup users also see results from crawled links and diary entries (their own). Clicking a result navigates to the source page, file, link, or diary entry.
