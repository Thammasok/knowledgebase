# System Under Test — Knowledgebase GPT

**Version:** REQ-PLATFORM-001 (Sprint 1 baseline)
**Date:** 2026-03-28

## Description

An AI-powered SaaS note-taking platform where users capture knowledge (notes, files, links, diary) and query it via RAG-powered AI chat and in-editor assistance. Three pricing tiers — Free, Personal, Startup — gate content types, AI capability, and collaboration features.

---

## Architecture

**Architecture Style:** Modular Monolith (single deployment, feature-based module boundaries)

### Components

| Name | Type | Responsibility |
|------|------|----------------|
| web (Next.js) | Frontend | Customer-facing web UI — workspace, editor, chat, settings |
| service (Express) | Backend API | Handles all business logic: auth, workspace, pages, files, AI, search |
| PostgreSQL | Database | Primary data store (users, workspaces, pages, files, links) |
| Redis | Cache | Session caching, rate limit counters |
| Qdrant | Vector DB | Semantic search index — stores and queries content embeddings |
| MongoDB | Document Store | File metadata, large content blobs |
| Background Jobs | Worker | File processing, link crawling, RAG indexing, version snapshots |

### Communication

- REST API between Frontend and Backend (`/api/v1` prefix)
- Backend → Qdrant via HTTP gRPC for vector operations
- Background jobs via in-process queue (BullMQ / async tasks)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui |
| Backend | Node.js, Express + TypeScript, Prisma ORM |
| Auth | JWT access token (15 min) + Refresh token (30 days), `x-device-id` header |
| Primary DB | PostgreSQL via Prisma |
| Cache | Redis 7 |
| Vector DB | Qdrant |
| Document Store | MongoDB |
| Editor | Editor.js (block-based) |
| AI Providers | Platform built-in (Free); OpenAI, Gemini, Anthropic, Ollama (Personal/Startup) |

---

## External Dependencies & Integration Points

| Name | Type | Test Approach |
|------|------|---------------|
| Google OAuth | Auth Provider | Mock OAuth token in unit/API; real Google login in E2E only |
| SendGrid / Email | Email Service | Mock in all automated tests — never send real email |
| OpenAI API | AI Provider | Mock API responses in unit/API; sandbox key in E2E |
| Google Gemini API | AI Provider | Mock API responses |
| Anthropic API | AI Provider | Mock API responses |
| Ollama | Local AI Runtime | Mock HTTP endpoint in unit/API |
| Link Crawler (HTTP) | External Web | Mock HTTP fetch; test unreachable URL scenarios |

---

## Data Stores

| Name | Type | Owned By | Shared? |
|------|------|----------|---------|
| PostgreSQL (knowledgebase_db) | PostgreSQL | service/ | No |
| Redis (cache) | Redis | service/ | No |
| Qdrant (vectors) | Vector DB | service/ | No |
| MongoDB (docs) | MongoDB | service/ | No |

Rule: All test databases are isolated per test run. No shared state between test suites.

---

## Environments

| Environment | Purpose | Test Types Allowed |
|-------------|---------|-------------------|
| local | Developer machine | Unit, Component, API |
| dev | Shared integration | Unit, Component, API, Integration |
| staging | Pre-production mirror | All types including E2E |
| production | Live system | Smoke tests only (read-only) |

---

## Test Scope Boundaries

### In Scope

- Authentication module (register, login, OAuth, token refresh)
- Workspace management (create, slug generation, block quota)
- Collaboration (invite, roles, permissions enforcement)
- Content organization (folders, pages, sub-pages, nesting limits)
- Content capture: Diary, File upload, Link (bookmark + content-fetch)
- Version history
- Semantic search
- AI chat (Free built-in, BYOK, full RAG)
- In-editor AI generation
- Tier enforcement (feature gates across Free / Personal / Startup)

### Out of Scope

- Google OAuth provider internals (mocked at boundary)
- External AI provider SDKs beyond integration contract
- Infrastructure (Docker, K8s networking, CI/CD pipelines)
- Payment/billing flows (not yet specified in requirements)
- Browser extensions or mobile apps

---

## Test Level Applicability

| Level | Applicable? | Owner | Trigger |
|-------|-------------|-------|---------|
| Unit | Yes | Developer | Every commit |
| Component (Backend) | Yes | Developer | Every commit |
| API | Yes | Dev / QA | Every PR |
| Contract | No | — | — (single service, no inter-service contracts) |
| Integration | Yes | QA | Merge to main |
| Frontend Component | Yes | Developer | Every PR |
| E2E | Yes | QA | Merge to main / nightly |
