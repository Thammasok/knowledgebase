# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Knowledgebase GPT — an AI assistant platform with Express backend (service/), Next.js frontend (web/), and Qdrant vector database for semantic search.

## Development Commands

### Infrastructure
```bash
docker-compose up -d          # Start PostgreSQL, Redis, Qdrant, MongoDB
docker-compose down           # Stop services
```

### Backend (service/)
```bash
pnpm dev                      # Dev server at localhost:3030
pnpm build                    # Compile TypeScript
pnpm test                     # Run Jest tests
pnpm test:watch               # Watch mode
pnpm test:cov                 # Coverage report
pnpm lint && pnpm format      # Lint and format

# Prisma
pnpm run prisma:generate      # Generate client
pnpm run prisma:mig:init      # Initial migration
pnpm run prisma:mig:deploy    # Deploy migrations
pnpm run prisma:seed          # Seed database
```

### Frontend (web/)
```bash
pnpm dev                      # Dev server at localhost:3000
pnpm build                    # Production build
pnpm lint && pnpm format      # Lint and format
pnpm shadcn add <component>   # Add shadcn/ui component
```

## Architecture

### Backend (service/)
Express + TypeScript with feature-based modules:
- `src/api/{feature}/` — route → controller → service → repository pattern
- `src/boot/` — Express setup, router, validation, rate limiting, logger
- `src/libs/` — Shared utilities (JWT, mail, Redis, DB)
- `src/middleware/` — Auth, error handling
- `prisma/schema.prisma` — Database schema

API prefix: `/api/v1`. Auth uses JWT access + refresh tokens with `x-device-id` header.

### Frontend (web/)
Next.js 16 App Router + React 19:
- `app/(main)/` — Authenticated routes with shared sidebar layout
- `components/ui/` — shadcn/ui primitives (do not edit manually)
- `components/layouts/` — Main and chat layout components
- Path alias: `@/*` → `web/*`

Styling: Tailwind CSS v4 with oklch color tokens in `styles/globals.css`.

### Infrastructure (docker-compose.yml)
- PostgreSQL:5432 — Primary database (Prisma)
- Redis:6379 — Caching
- Qdrant:6333/6334 — Vector search
- MongoDB:27017 — Document storage

## Environment Setup

```bash
cp service/.env.example service/.env
cp web/.env.example web/.env.local
```

See `docs/env-setup.md` for variable details.

## AI Agent Workflow

This repo uses a multi-agent workflow (see `AI-AGENT-WORKFLOW.md`) with skills located in `.claude/skills/`:
- `business-analysis` — Requirements (US/FR/NFR)
- `software-tester-design` — Test design before implementation
- `software-architecture` — API contracts, DB schema, OpenAPI
- `ai-orchestrator` — TDD loop (Red-Green-Refactor)
- `project-management` — Sprint planning, task breakdown
- `software-engineer` — Code implementation and review
- `software-tester` — Testing assistance
- `software-tester-automation` — Test automation scripts
- `technical-writer` — User documentation
- `ux-ui-designer` — UX/UI design assistance
- `agent-team-development` — Parallel team development

Artifacts follow `.claude/artifacts/ARTIFACTS.md` conventions (e.g., `US-AUTH-001`, `TC-AUTH-001`).
