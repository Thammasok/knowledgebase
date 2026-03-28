# Traceability Matrix — Knowledgebase GPT (Phase 2 & 3)

**Traces to:** REQ-PLATFORM-001, docs/test-design/test-cases.md, docs/project/backlog.md
**Date:** 2026-03-28

---

## Workspace & Tier

| User Story | Functional Req | Dev Task(s) | Test Case(s) | Iteration | Status |
|-----------|---------------|-------------|--------------|-----------|--------|
| US-WS-001 (block limit) | FR-TIER-001, FR-TIER-002 | DEV-TIER-001, DEV-TIER-002, DEV-TIER-004 | TC-WS-007, TC-WS-008 | 1 | Planned |
| US-WS-002 (startup invite) | FR-TIER-003, FR-WS-002 | DEV-TIER-003, DEV-COLLAB-002 | TC-WS-009, TC-WS-010, TC-WS-011 | 2–3 | Planned |

---

## Content Organization

| User Story | Functional Req | Dev Task(s) | Test Case(s) | Iteration | Status |
|-----------|---------------|-------------|--------------|-----------|--------|
| US-ORG-001 (folders) | FR-PAGE-001, FR-PAGE-002 | DEV-CONTENT-001, DEV-CONTENT-003, DEV-CONTENT-006 | TC-ORG-001, TC-ORG-003 | 1–2 | Planned |
| US-PAGE-001 (pages + blocks) | FR-PAGE-003, FR-PAGE-004, FR-PAGE-005 | DEV-CONTENT-002, DEV-CONTENT-004, DEV-CONTENT-005, DEV-CONTENT-007 | TC-ORG-002, TC-ORG-004, TC-ORG-005, TC-ORG-006 | 1–2 | Planned |
| — | NFR-PERF (auto-save 2s) | DEV-CONTENT-010 | TC-ORG-005 | 1 | Planned |

---

## Collaboration

| User Story | Functional Req | Dev Task(s) | Test Case(s) | Iteration | Status |
|-----------|---------------|-------------|--------------|-----------|--------|
| US-COLLAB-001 (invite) | FR-COLLAB-001, FR-COLLAB-002 | DEV-COLLAB-001, DEV-COLLAB-002, DEV-COLLAB-003 | TC-COLLAB-001, TC-COLLAB-002, TC-COLLAB-003, TC-COLLAB-004 | 3 | Planned |
| US-COLLAB-002 (roles) | FR-COLLAB-003, FR-COLLAB-004 | DEV-COLLAB-004, DEV-COLLAB-005, DEV-COLLAB-006, DEV-COLLAB-007 | TC-COLLAB-005, TC-COLLAB-006, TC-COLLAB-007, TC-COLLAB-008, TC-COLLAB-009 | 3 | Planned |

---

## Diary

| User Story | Functional Req | Dev Task(s) | Test Case(s) | Iteration | Status |
|-----------|---------------|-------------|--------------|-----------|--------|
| US-DIARY-001 | FR-TIER-004 (personal gate), FR-PAGE-006 | DEV-DIARY-001, DEV-DIARY-002, DEV-DIARY-003, DEV-DIARY-004, DEV-DIARY-005, DEV-DIARY-006 | TC-DIARY-001, TC-DIARY-002, TC-DIARY-003, TC-DIARY-004, TC-DIARY-005 | 4 | Planned |
| — | NFR-SEC (diary private) | DEV-DIARY-006 | TC-DIARY-005 | 4 | Planned |

---

## Version History

| User Story | Functional Req | Dev Task(s) | Test Case(s) | Iteration | Status |
|-----------|---------------|-------------|--------------|-----------|--------|
| US-VERSION-001 | FR-TIER-005 (personal gate) | DEV-VERSION-001, DEV-VERSION-002, DEV-VERSION-003, DEV-VERSION-004 | TC-VERSION-001, TC-VERSION-002, TC-VERSION-003 | 2 | Planned |

---

## File Upload

| User Story | Functional Req | Dev Task(s) | Test Case(s) | Iteration | Status |
|-----------|---------------|-------------|--------------|-----------|--------|
| US-FILE-001 (upload + indexing) | FR-FILE-001, FR-FILE-002, FR-FILE-003 | DEV-FILE-001, DEV-FILE-002, DEV-FILE-003, DEV-FILE-004, DEV-FILE-005 | TC-FILE-001, TC-FILE-002, TC-FILE-003, TC-FILE-004, TC-FILE-005 | 5 | Planned |
| US-FILE-001 (RAG indexing) | FR-SEARCH-001 | DEV-FILE-006, DEV-SEARCH-001, DEV-SEARCH-002 | TC-FILE-006, TC-FILE-007 | 5 | Planned |

---

## Link Management

| User Story | Functional Req | Dev Task(s) | Test Case(s) | Iteration | Status |
|-----------|---------------|-------------|--------------|-----------|--------|
| US-LINK-001 (bookmark, Free) | FR-LINK-001, FR-LINK-002 | DEV-LINK-001, DEV-LINK-002, DEV-LINK-003 | TC-LINK-001, TC-LINK-002 | 6 | Planned |
| US-LINK-002 (content fetch, Personal) | FR-LINK-003, FR-LINK-004, FR-LINK-005, FR-LINK-006, FR-LINK-007 | DEV-LINK-004, DEV-LINK-005, DEV-LINK-006, DEV-LINK-007 | TC-LINK-003, TC-LINK-004, TC-LINK-005, TC-LINK-006 | 6 | Planned |

---

## Semantic Search

| User Story | Functional Req | Dev Task(s) | Test Case(s) | Iteration | Status |
|-----------|---------------|-------------|--------------|-----------|--------|
| US-SEARCH-001 (search) | FR-SEARCH-001, FR-SEARCH-002, FR-SEARCH-003, FR-SEARCH-004 | DEV-SEARCH-003, DEV-SEARCH-004 | TC-SEARCH-001, TC-SEARCH-002, TC-SEARCH-003 | 7 | Planned |

---

## AI Features

| User Story | Functional Req | Dev Task(s) | Test Case(s) | Iteration | Status |
|-----------|---------------|-------------|--------------|-----------|--------|
| US-AI-FREE-001 (built-in chat) | FR-AI-001, FR-AI-002, FR-AI-003 | DEV-AI-002, DEV-AI-006, DEV-AI-007, DEV-AI-008, DEV-AI-009 | TC-AI-001, TC-AI-002 | 8 | Planned |
| US-AI-001 (BYOK config) | FR-AI-004, FR-AI-005, FR-AI-006 | DEV-AI-001, DEV-AI-003, DEV-AI-004, DEV-AI-005 | TC-AI-003, TC-AI-004, TC-AI-005, TC-AI-006 | 8 | Planned |
| US-AI-002 (full RAG chat) | FR-AI-007, FR-AI-008, FR-AI-009, FR-AI-010 | DEV-AI-007 (extended), DEV-AI-008 | TC-AI-007, TC-AI-008, TC-AI-009 | 9 | Planned |
| US-AI-003 (in-editor AI) | FR-AI-011, FR-AI-012, FR-AI-013, FR-AI-014 | DEV-AI-010, DEV-AI-013 | TC-AI-010, TC-AI-011, TC-AI-012 | 9 | Planned |
| — | NFR-SEC (keys encrypted, ADR-004) | DEV-AI-003 | TC-AI-006 | 8 | Planned |

---

## Coverage Summary

| Domain | User Stories | Dev Tasks | Test Cases | Iterations |
|--------|-------------|-----------|-----------|-----------|
| Tier & Permissions | 2 | 5 | 5 | 1–2 |
| Content (Folders + Pages) | 2 | 10 | 6 | 1–2 |
| Collaboration | 2 | 9 | 9 | 3 |
| Diary | 1 | 8 | 5 | 4 |
| Version History | 1 | 5 | 3 | 2 |
| File Upload | 1 | 7 | 7 | 5 |
| Link Management | 2 | 8 | 6 | 6 |
| Semantic Search | 1 | 4 | 3 | 7 |
| AI Features | 4 | 13 | 12 | 8–9 |
| **Total** | **16** | **69** | **56** | **9 iterations** |

**Status values:** `Planned` | `In Progress` | `In Review` | `Done` | `Blocked`
