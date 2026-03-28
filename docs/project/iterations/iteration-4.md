# Iteration 4 — Diary Entries (Personal/Startup)

**Goal:** Personal and Startup tier users can create private daily diary entries in a calendar view. Diary entries are indexed in Qdrant for future RAG queries. Free-tier users see an upgrade prompt.

**Duration:** 1 week
**Stories in scope:** US-DIARY-001
**Priority:** Should Have

---

## Scenarios in Scope

- SC-DIARY-001: Create diary entry and retrieve past entry
- SC-DIARY-002: One entry per date per user (unique constraint)
- SC-DIARY-003: Free tier blocked from diary
- SC-DIARY-004: Diary entries private to owner

---

## Test Cases — Definition of Done

**P1 (must all pass):**
- TC-DIARY-001: Personal user creates diary entry for today; appears in calendar
- TC-DIARY-002: Past entry retrieved by date
- TC-DIARY-003: Duplicate date → redirected to existing entry, no duplicate created
- TC-DIARY-004: Free user navigates to diary — upgrade prompt shown; cannot create
- TC-DIARY-005: Workspace Member/Viewer cannot see Owner's diary entries

**P2 (target):**
- Diary content appears in semantic search results after indexing (pre-req for Iteration 7)

---

## Developer Tasks

| Task | Title | Layer | Complexity |
|------|-------|-------|-----------|
| DEV-SEARCH-001 | Qdrant collection manager (needed for indexing) | Infra | M |
| DEV-SEARCH-002 | Embedding service — OpenAI text-embedding-3-small | Integration | M |
| DEV-DIARY-001 | DiaryEntry schema + migration | DB | S |
| DEV-DIARY-006 | Diary privacy guard middleware | Middleware | S |
| DEV-DIARY-002 | GET /workspace/:id/diary (list by month) | API | S |
| DEV-DIARY-003 | GET /workspace/:id/diary/:date | API | S |
| DEV-DIARY-004 | POST /workspace/:id/diary (create, enforce one-per-date) | API+Domain | S |
| DEV-DIARY-005 | PATCH /workspace/:id/diary/:id | API | S |
| DEV-DIARY-007 | Background job: diary RAG indexing → Qdrant | Integration | M |
| DEV-DIARY-008 | Frontend: Diary calendar view + editor | Frontend | L |

> **Note:** DEV-SEARCH-001 and DEV-SEARCH-002 are shipped in this iteration to unblock diary indexing. They also unblock file and link indexing in Iterations 5–6. These should be built first (Days 1–2) so the rest of the team can proceed in parallel.

---

## NFRs Enforced This Iteration

- NFR-SEC: Diary entries are never returned to other workspace members — enforced at middleware layer
- NFR-PERF: Qdrant indexing happens asynchronously (does not block diary save response)

---

## Increment

At the end of Iteration 4, the following works end-to-end:

> Personal and Startup tier users can navigate to the Diary section, see a calendar with highlighted dates, create a new entry for today (using the same Editor.js editor as pages), and retrieve past entries by clicking calendar dates. Entries are private to the owner — no other workspace member can access them. Diary content is indexed in Qdrant in the background for use by search and AI in later iterations. Free-tier users see an upgrade prompt on the Diary section.
