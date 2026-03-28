# Iteration 5 — File Upload & RAG Indexing

**Goal:** Users can upload supported file types to their workspace. PDFs and documents are indexed in Qdrant for semantic search and RAG queries. Tier-aware size limits are enforced.

**Duration:** 2 weeks
**Stories in scope:** US-FILE-001
**Priority:** Must Have

---

## Scenarios in Scope

- SC-FILE-001: Upload supported file within size limit
- SC-FILE-002: Upload unsupported file type (rejected)
- SC-FILE-003: File exceeds tier size limit
- SC-FILE-004: RAG indexing — PDF indexed; image not indexed

---

## Test Cases — Definition of Done

**P1 (must all pass):**
- TC-FILE-001: PDF uploaded within limit — appears in file library; crawlStatus = pending → indexed
- TC-FILE-002: Image uploaded — appears in library; crawlStatus = not_indexable
- TC-FILE-003: .exe / .zip file — 400 UNSUPPORTED_FILE_TYPE
- TC-FILE-004: Free user uploads 6MB file — 400 FILE_TOO_LARGE
- TC-FILE-005: Personal user uploads 101MB file — 400 FILE_TOO_LARGE
- TC-FILE-006: PDF text extracted and indexed in Qdrant within 60 seconds
- TC-FILE-007: Image stored but not indexed; crawlStatus = not_indexable

**P2 (target):**
- DOCX and Markdown file indexing
- File delete removes Qdrant vectors

---

## Developer Tasks

| Task | Title | Layer | Complexity |
|------|-------|-------|-----------|
| DEV-FILE-001 | File schema + migration | DB | S |
| DEV-FILE-002 | File upload middleware (Multer, tier-aware limits) | API | M |
| DEV-FILE-003 | POST /workspace/:id/files — upload handler | API | M |
| DEV-FILE-004 | GET /workspace/:id/files — list files | API | S |
| DEV-FILE-005 | DELETE /workspace/:id/files/:id + Qdrant cleanup | API | S |
| DEV-FILE-006 | Background job: PDF/MD/DOCX extraction + Qdrant upsert | Integration | L |
| DEV-FILE-007 | Frontend: File library UI + drag-drop upload | Frontend | M |

> **Pre-requisites from Iteration 4:** DEV-SEARCH-001 (Qdrant collections) and DEV-SEARCH-002 (EmbeddingService) must be complete. They were shipped in Iteration 4.

---

## NFRs Enforced This Iteration

- NFR-PERF: File indexing completes within 60 seconds for a standard PDF (≤10MB)
- NFR-SEC: File validation happens server-side (MIME type check) — not just extension
- Tier enforcement: 5MB limit (Free), 100MB limit (Personal/Startup) enforced in middleware

---

## Increment

At the end of Iteration 5, the following works end-to-end:

> Users can drag-drop or click-upload files to their workspace file library. Supported file types (PDF, MD, DOCX, XLSX, images) are accepted; unsupported types are rejected with a clear error. Free users are limited to 5MB per file; Personal/Startup users can upload up to 100MB. PDFs and documents are indexed in Qdrant within 60 seconds and will appear in search results in Iteration 7. Images are stored but not indexed. Users can delete files from the library.
