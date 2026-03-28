# Iteration 9 — Full RAG Chat + In-Editor AI Generation

**Goal:** Personal/Startup users can query across all content types (including diary and links) with their BYOK model. Users can invoke AI generation directly inside the page editor. Viewer role is fully blocked from AI access.

**Duration:** 2 weeks
**Stories in scope:** US-AI-002, US-AI-003
**Priority:** Should Have

---

## Scenarios in Scope

- SC-AI-004: Full RAG chat (Personal/Startup) — diary + links + notes + files
- SC-AI-005: Viewer blocked from AI chat
- SC-AI-006: In-editor AI generation
- SC-AI-007: Free tier blocked from in-editor AI

---

## Test Cases — Definition of Done

**P1 (must all pass):**
- TC-AI-007: Personal user's query returns results from all content types (notes, files, links, diary)
- TC-AI-008: Folder-scoped AI query: only pages within that folder's content returned
- TC-AI-009: Viewer navigates to AI chat — chat input disabled; 403 on API
- TC-AI-010: Personal user invokes /ai in editor; content generated and inserted as Editor.js blocks
- TC-AI-011: Discard action removes generated blocks; original content restored
- TC-AI-012: Free user invokes /ai command — upgrade prompt shown; command blocked

**P2 (target):**
- Multiple AI provider switching (change from OpenAI to Gemini mid-session)
- RAG context window management (very long conversations)
- In-editor generation for specific commands: "summarize", "expand", "translate"

---

## Developer Tasks

| Task | Title | Layer | Complexity |
|------|-------|-------|-----------|
| DEV-AI-010 | POST /workspace/:id/ai/generate — in-editor generation endpoint | API | M |
| DEV-AI-013 | Frontend: In-editor /ai command + generation overlay | Frontend | M |

> **Note:** The RAG pipeline (DEV-AI-007) and BYOK model routing shipped in Iteration 8 already support multi-tier search scoping. In this iteration:
> - DEV-AI-007 is extended to include diary + links in the Qdrant search for Personal/Startup (the scope was already parameterized in Iter 8 but diary/link indexing is now fully live from Iters 4–6)
> - TC-AI-009 (Viewer blocked) is confirmed via DEV-COLLAB-007 already applied to the chat route
> - Main new work: in-editor generation endpoint + frontend slash command

---

## NFRs Enforced This Iteration

- NFR-SEC: Free tier cannot access in-editor generation — tierGuard('personal') on /ai/generate
- NFR-SEC: Viewer role blocked at API middleware (DEV-COLLAB-007) — not just UI
- NFR-PERF: In-editor generation streams first token within 2 seconds
- NFR-PERF: Full RAG response (retrieve + LLM) completes within 10 seconds for 95th percentile

---

## Increment

At the end of Iteration 9, the following works end-to-end:

> Personal and Startup users querying AI chat receive answers grounded in all their content types — notes, files, crawled links, and private diary entries. Folder-scoped queries limit context to content within that folder. Viewers cannot interact with AI chat (input disabled in UI; API returns 403). Users with Personal/Startup plans can invoke the /ai command inside any page, enter a generation prompt, and see the AI-generated content streamed into the editor as blocks — with a discard option to revert. Free users see an upgrade prompt when they attempt the /ai command. Phase 3 (AI) is complete.

---

## Overall Project Completion

After Iteration 9, all Must Have and Should Have features are delivered:

| Epic | Status |
|------|--------|
| EPIC-TIER-001: Tier Foundation | ✅ Done (Iter 1–2) |
| EPIC-CONTENT-001: Folders + Pages | ✅ Done (Iter 1–2) |
| EPIC-COLLAB-001: Collaboration | ✅ Done (Iter 3) |
| EPIC-DIARY-001: Diary | ✅ Done (Iter 4) |
| EPIC-VERSION-001: Version History | ✅ Done (Iter 2) |
| EPIC-FILE-001: File Upload | ✅ Done (Iter 5) |
| EPIC-LINK-001: Link Management | ✅ Done (Iter 6) |
| EPIC-SEARCH-001: Semantic Search | ✅ Done (Iter 7) |
| EPIC-AI-001: AI Features | ✅ Done (Iter 8–9) |
