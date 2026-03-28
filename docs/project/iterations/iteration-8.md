# Iteration 8 — AI Chat Foundation (Free tier + BYOK Configuration)

**Goal:** Free users can ask questions via built-in AI chat and get answers grounded in their workspace content. Personal/Startup users can configure their own AI keys (BYOK). API keys are never exposed in responses.

**Duration:** 2 weeks
**Stories in scope:** US-AI-FREE-001, US-AI-001 (BYOK config)
**Priority:** Must Have (Free tier chat) / Should Have (BYOK)

---

## Scenarios in Scope

- SC-AI-001: Free tier uses built-in AI chat with workspace context
- SC-AI-002: BYOK AI configuration (valid/invalid keys for all providers)
- SC-AI-003: API keys never exposed in responses

---

## Test Cases — Definition of Done

**P1 (must all pass):**
- TC-AI-001: Free user asks question; platform model answers with clickable source references
- TC-AI-002: Conversation history persisted and retrievable
- TC-AI-003: Valid OpenAI key accepted and saved (encrypted)
- TC-AI-004: Invalid OpenAI key rejected — 400 KEY_VALIDATION_FAILED
- TC-AI-005: Valid Gemini, Anthropic, and Ollama keys accepted
- TC-AI-006: GET /ai/settings response omits / masks raw API key

**P2 (target):**
- TC-AI-009: Viewer blocked from AI chat — 403 FORBIDDEN

---

## Developer Tasks

| Task | Title | Layer | Complexity |
|------|-------|-------|-----------|
| DEV-AI-001 | AI model config schema + migration | DB | S |
| DEV-AI-002 | AI conversation + message schemas + migration | DB | M |
| DEV-AI-003 | API key encryption service (AES-256-GCM) | Domain | M |
| DEV-AI-005 | Provider validation service (OpenAI/Gemini/Anthropic/Ollama) | Integration | M |
| DEV-AI-006 | Platform AI service — Free tier built-in model | Integration | M |
| DEV-AI-007 | RAG pipeline — retrieve → inject context → stream | Domain | L |
| DEV-AI-008 | POST /workspace/:id/ai/chat — RAG chat endpoint (SSE) | API | M |
| DEV-AI-009 | GET /workspace/:id/ai/chat — conversation history | API | S |
| DEV-AI-004 | GET/POST/PATCH /workspace/:id/ai/settings (BYOK) | API | M |
| DEV-AI-011 | Frontend: AI chat UI + sources + conversation history | Frontend | L |
| DEV-AI-012 | Frontend: AI settings page (BYOK config) | Frontend | M |

> **Build order within this iteration:**
> 1. DEV-AI-001, DEV-AI-002, DEV-AI-003, DEV-AI-005, DEV-AI-006 in parallel (Days 1–3)
> 2. DEV-AI-007 (RAG pipeline) — depends on DEV-AI-006 + DEV-SEARCH-001/002 (done in Iter 4)
> 3. DEV-AI-008, DEV-AI-009, DEV-AI-004 in parallel (depend on above)
> 4. Frontend (DEV-AI-011, DEV-AI-012) in parallel with API work

---

## NFRs Enforced This Iteration

- NFR-SEC (ADR-004): API keys encrypted at rest with AES-256-GCM; never returned in API responses
- NFR-SEC: BYOK endpoints protected by tierGuard('personal') — Free tier cannot configure BYOK
- NFR-PERF: AI chat uses Server-Sent Events (SSE) for streaming — first token within 2s
- NFR-SEC: Viewer role blocked from AI chat (DEV-COLLAB-007 guards the route)

---

## Increment

At the end of Iteration 8, the following works end-to-end:

> Free users can open the AI Chat panel, ask a question in natural language, and receive an answer grounded in their workspace content (notes, files) — with clickable source citations. Conversation history is saved and retrievable. Personal and Startup users can navigate to AI Settings, select their preferred provider (OpenAI, Gemini, Anthropic, or Ollama), enter their API key, and validate it — with clear success/failure feedback. The raw API key is never shown after saving. All communication is end-to-end through the RAG pipeline using indexed Qdrant content.
