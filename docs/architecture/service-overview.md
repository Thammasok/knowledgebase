# Backend Service Overview — Knowledgebase GPT

**Path:** `service/`
**Type:** Node.js REST API
**Date:** 2026-03-28

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | 20+ |
| Framework | Express | 4.19 |
| Language | TypeScript | 5.4 |
| ORM | Prisma | 7.6 |
| Database | PostgreSQL | multi-schema (`public` + `main`) |
| Cache | Redis | 5 |
| Auth | JWT (jsonwebtoken) | 9.0 |
| Email | Mailtrap / SendGrid | — |
| Validation | Joi | 17 |
| Logging | Pino + pino-pretty | 9 |
| Testing | Jest + Supertest | 29 |
| Password | bcrypt (cost 12) | 5 |
| File Upload | Multer (memory, 5 MB) | 1.4 |
| ID Generation | ULID / UUID v7 | — |
| Dev Server | ts-node-dev | 2 |

---

## Development Commands

```bash
# Dev server at localhost:3030
pnpm dev

# Build TypeScript
pnpm build

# Start compiled output
pnpm start

# Tests
pnpm test
pnpm test:watch
pnpm test:cov

# Lint & format
pnpm lint && pnpm format

# Prisma
pnpm prisma:generate       # Regenerate client after schema change
pnpm prisma:mig:init       # Create initial migration
pnpm prisma:mig:deploy     # Apply pending migrations
pnpm prisma:seed           # Run seed script
pnpm prisma:reset          # Reset DB (dev only)
```

---

## Directory Structure

```
service/
├── prisma/
│   └── schema.prisma          # Database schema (@@schema("main"))
├── generated/
│   └── prisma/                # Auto-generated Prisma client
├── src/
│   ├── server.ts              # HTTP server entry point, graceful shutdown
│   ├── api/                   # Feature modules (route → controller → service → repository)
│   ├── boot/                  # Express app initialization
│   ├── middleware/            # Auth, error, file-upload middleware
│   ├── libs/                  # Shared utility libraries
│   ├── config/                # Configuration (env vars)
│   ├── exceptions/            # Custom HTTP exception classes
│   ├── utils/                 # Pure utility functions
│   ├── types/                 # TypeScript type definitions
│   ├── constant/              # Application constants
│   ├── test/                  # Shared test helpers
│   └── views/                 # Handlebars templates (email layouts)
├── package.json
├── tsconfig.json
├── jest.config.ts
├── prisma.config.ts
└── .env / .env.example
```

---

## Architecture Pattern

Each feature follows a strict layered pattern:

```
HTTP Request
    │
    ▼
Route (.route.ts)
    │  Applies: auth middleware, validator, rate limiter
    ▼
Controller (.controller.ts)
    │  Parses req, calls service, sends res
    ▼
Service (.service.ts)
    │  Business logic, orchestration
    ▼
Repository (.repository.ts)
    │  Prisma DB queries only
    ▼
Database (PostgreSQL via Prisma)
```

Logic files (`.logic.ts`) exist in some features for pure, testable business rules (e.g., token generation, OTP generation).

---

## API Modules

### Base URL: `/api/v1`

| Module | Path | Auth | Files |
|--------|------|------|-------|
| Health | `/health` | None | `health/` |
| Auth — Signup | `/auth/signup`, `/auth/request-access`, `/auth/signup/request-access` | None | `auth/signup/` |
| Auth — Login | `/auth/login`, `/auth/refresh`, `/auth/logout` | Mixed | `auth/login/` |
| Auth — OTP | `/auth/verify/mail` (POST + PATCH) | None | `auth/otp/` |
| Auth — Forgot | `/auth/forgot/mail`, `/auth/password` | None | `auth/forgot/` |
| Auth — OAuth | `/auth/oauth` | None | `auth/oauth/` |
| Account — Profile | `/account/` (GET + PATCH) | Required | `account/profile/` |
| Account — Settings | `/account/setting/basic` (GET + PATCH) | Required | `account/setting/` |
| Auth Sessions | `/auth-session/` (GET), `/auth-session/deactivate/:id` (DELETE) | Required | `auth-session/` |
| Workspace | `/workspace` (GET + POST), `/workspace/:id` (PATCH) | Required | `workspace/` |

See `docs/architecture/api-contracts.md` for full request/response shapes.

---

## Boot Layer (`src/boot/`)

| File | Purpose |
|------|---------|
| `app.ts` | Creates Express app: CORS, JSON body parser, cookie-parser, useragent, static files, routes, 404, error handler |
| `router.ts` | Registers routes dynamically from `RouteTypes[]`; composes middleware chain per route |
| `logger.ts` | Pino instance — `pretty` output in dev, JSON in prod; exposes `logInfo`, `logError`, `logWarn`, `logDebug`, `createChildLogger` |
| `rate-limit.ts` | express-rate-limit: 200 req/min per IP, returns 429 |
| `validator.ts` | Joi middleware factory — validates `body`, `query`, or `params`; returns 422 on failure |
| `express.dto.ts` | Extends `Request` with `account: Accounts` for authenticated routes |

### Route Registration Pattern

```typescript
// Each module exports RouteTypes[]
{
  version: '1',
  path: 'workspace',
  method: 'get',
  auth: true,           // → authAccessMiddleware
  useRefreshToken: false,
  validate: querySchema, // → validator middleware
  controller: getWorkspaces
}
// router.ts builds: GET /api/v1/workspace
```

---

## Middleware (`src/middleware/`)

### `auth.middleware.ts`

Two exported middlewares:

**`authAccessMiddleware`** — for standard protected routes:
1. Reads `Authorization: Bearer {token}` header
2. Reads `x-device-id` header (required)
3. Verifies JWT: `sub === "access_token"`, HS256 algorithm
4. Looks up `AuthSession` in DB: must exist and `isActive = true`
5. Attaches `account` to `req.account`; returns 401 on any failure

**`authRefreshMiddleware`** — for `/auth/refresh`:
1. Same as above but verifies `sub === "refresh_token"`

### `error.middleware.ts`

Global Express error handler (called via `next(err)`):

| Error Type | HTTP Status | Handling |
|------------|-------------|---------|
| `HttpException` | as set | Custom message |
| Joi `ValidationError` | 400 | Field errors from Joi details |
| Prisma `P2002` | 409 | Unique constraint (duplicate) |
| Prisma `P2025` | 404 | Record not found |
| Other Prisma errors | 500 | Generic DB error |
| Unknown | 500 | Internal server error |

Response shape: `{ "message": "string" }`

### `multer.middleware.ts`

Memory storage, 5 MB file size limit. Used for file upload endpoints (Phase 2).

---

## Libraries (`src/libs/`)

### `db/prisma.ts`
Prisma client with PostgreSQL adapter (`@prisma/adapter-pg`). Singleton pattern. Environment-based query logging.

### `jwt/index.ts`
Async `signJwt(payload, options)` and `verifyJwt(token)`. Uses HS256 with `JWT_SECRET` env var. Expiration configured via `config/jwt.ts`.

### `redis/index.ts`
Redis client (v5). Methods:
- `setValue(key, value, ttl?)` — stores string with optional TTL (seconds)
- `getValue(key)` — returns string or null
- `deleteValue(key)` — removes key

Used by OTP service for short-lived verification codes.

### `mail/index.ts`
Email abstraction. Default provider: **Mailtrap** (dev/staging). SendGrid available as alternative. Sends using template variables: `{ name, email, ref, otp }`.

### `uuid/index.ts`
UUID v7 generation (time-ordered, monotonic).

---

## Configuration (`src/config/`)

All config reads from environment variables with defaults:

| File | Key Variables |
|------|--------------|
| `app.ts` | `PORT` (3030), `NODE_ENV`, `APP_KEY`, `APP_NAME`, `ALLOWED_ORIGIN_CLIENT_URL`, `IP_API_URL` |
| `jwt.ts` | `JWT_SECRET`, `ACCESS_TOKEN_EXPIRES_IN` (default: 1h), `REFRESH_TOKEN_EXPIRES_IN` (default: 7d) |
| `mail.ts` | `MAIL_API_KEY`, `MAIL_IS_SANDBOX`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_DEFAULT_FROM_EMAIL` |
| `auth.ts` | `ADMIN_LIST` — max 4 concurrent devices per account |
| `google.ts` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |

---

## Exception Classes (`src/exceptions/`)

| Class | HTTP Code | When |
|-------|-----------|------|
| `HttpException` | configurable | Base class for all custom HTTP errors |
| `EmailAlreadyExistsException` | 409 | Email already registered |

---

## Utilities (`src/utils/`)

| File | Purpose |
|------|---------|
| `hash-password.ts` | bcrypt hash (cost 12) + compare |
| `page.ts` | Pagination helper: calculates `skip`, `take`, returns `{ data, pagination }` |
| `slug.ts` | URL-safe slug generation from strings |
| `ip-address.ts` | IP extraction from request headers |
| `user-agent-detect.ts` | User agent parsing (browser, OS, device) |
| `db-utils.ts` | Prisma query helpers |

---

## Testing

| Type | Tool | Pattern |
|------|------|---------|
| Unit | Jest + ts-jest | `.test.ts` files co-located with source |
| Integration (API) | Supertest | Tests against real Express app + test DB |
| Coverage | `jest --coverage` | Collected from all `src/**/*.ts` |

Test files pattern: `**/*.test.ts` (also `__tests__/` subdirectories).

Mock helpers in `src/test/mock-authentication.ts` — provides authenticated request fixtures.

Logic files (`.logic.ts`) have dedicated unit tests (e.g., `login-token.logic.test.ts`, `otp.logic.test.ts`, `forgot-token.logic.test.ts`).

---

## Environment Variables Reference

```bash
# App
PORT=3030
NODE_ENV=development
APP_KEY=your-app-key
APP_NAME=KnowledgeBase
ALLOWED_ORIGIN_CLIENT_URL=http://localhost:3000
IP_API_URL=https://ipapi.co

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/knowledgebase

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Mail (Mailtrap)
MAIL_API_KEY=your-mailtrap-api-key
MAIL_IS_SANDBOX=true
MAIL_DEFAULT_FROM_EMAIL=noreply@knowledgebase.app
MAIL_DEFAULT_FROM_NANE=Knowledgebase

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

See `service/.env.example` for the full list.
