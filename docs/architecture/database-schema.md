# Database Schema — Knowledgebase GPT

**Traces to:** REQ-PLATFORM-001, docs/test-design/test-cases.md
**ORM:** Prisma
**Database:** PostgreSQL (multi-schema: `public` + `main`)
**ID Strategy:** ULID (`@default(ulid())`) for most entities; UUID for `AuthSession`
**Date:** 2026-03-28 (updated to match actual source code)

> **Implementation Status:** Phase 1 (Auth + Workspace) is implemented.
> Content tables (folders, pages, diary, files, links) and AI tables are Phase 2 — not yet implemented.

---

## Divergence from Original Design

| Aspect | Original Design | Actual Implementation |
|--------|----------------|----------------------|
| Model name | `users` | `Accounts` |
| Primary key type | UUID | ULID (via `ulid()`) |
| Email verification | `email_verification_tokens` table | OTP stored in Redis (no DB table) |
| Session tracking | `refresh_tokens` table | `AuthSession` table |
| Workspace tier fields | `tier`, `block_count`, `slug` | Not present (no tier model yet) |
| DB schema | `public` only | Multi-schema: `@@schema("main")` |
| Settings | Part of `users` | Separate `AccountSetting` model |
| Request access | Not designed | `AccountRequestAccess` model |
| Forgot password | Not designed | `AccountForgotPassword` model |

---

## Implemented — Phase 1 (Auth + Account + Workspace)

---

### Model: `Accounts`

Core user account record. Supports both email/password and OAuth sign-in.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | String (ULID) | No | `ulid()` | PK |
| displayName | String | No | — | 3–50 chars |
| firstName | String? | Yes | NULL | Optional |
| lastName | String? | Yes | NULL | Optional |
| email | String | No | — | UNIQUE |
| password | String? | Yes | NULL | bcrypt hash; NULL for OAuth-only accounts |
| image | String? | Yes | NULL | Avatar URL |
| isExternalAccount | Boolean | No | false | true for OAuth accounts |
| externalProvider | String? | Yes | NULL | `"google"` \| `"github"` \| `"facebook"` |
| source | String? | Yes | NULL | Origin tracking |
| isVerify | Boolean | No | false | Email verification status |
| isRemove | Boolean | No | false | Soft-delete flag |
| createdAt | DateTime | No | `now()` | — |
| updatedAt | DateTime | No | auto | — |

**Relations:** AccountForgotPassword, AuthSession (many), AccountSetting, Workspace (many)

**Schema:** `@@schema("main")`

**Diverges from design:** `users` → `Accounts`; no `tier` column yet; OTP verification is Redis-based (not in DB); `password_hash` → `password`; adds `firstName`, `lastName`, `image`, `isExternalAccount`, `externalProvider`, `source`, `isRemove`.

---

### Model: `AccountRequestAccess`

Waitlist / invite-gated registration. Users request access; admin approves.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | String (ULID) | No | `ulid()` | PK |
| email | String | No | — | UNIQUE |
| allowed | Boolean | No | false | Admin approval flag |
| createdAt | DateTime | No | `now()` | — |
| updatedAt | DateTime | No | auto | — |

**Schema:** `@@schema("main")`

**Note:** Not in original design. Supports invite-gated onboarding where users must be approved before they can register.

---

### Model: `AccountForgotPassword`

Password reset tokens. One record per account (upserted).

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| accountId | String | No | — | PK, FK → Accounts.id |
| token | String | No | — | Reset token (opaque) |
| expiredAt | DateTime | No | — | Token expiry |
| createdAt | DateTime | No | `now()` | — |
| updatedAt | DateTime | No | auto | — |

**Schema:** `@@schema("main")`

---

### Model: `AuthSession`

Tracks active login sessions per device. Replaces the designed `refresh_tokens` table.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | String (UUID) | No | `uuid()` | PK — UUID (not ULID) |
| accountId | String | No | — | FK → Accounts.id |
| deviceId | String | No | — | Client-supplied device identifier |
| ip | String? | Yes | NULL | Request IP address |
| userAgent | String? | Yes | NULL | Browser/client user agent |
| ipInfo | Json? | Yes | NULL | IP geolocation: `{ country, city, region }` |
| isActive | Boolean | No | true | Session active flag (false = logged out) |
| createdAt | DateTime | No | `now()` | — |
| updatedAt | DateTime | No | auto | — |

**Schema:** `@@schema("main")`

**Diverges from design:** Replaces `refresh_tokens` with session-based tracking. The refresh token itself is a short-lived JWT; `AuthSession` validates that the session/device is still active.

---

### Model: `AccountSetting`

Per-account preferences. One record per account (upserted).

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| accountId | String | No | — | PK, FK → Accounts.id |
| language | String | No | `"en"` | `"en"` \| `"th"` |
| theme | Theme | No | `system` | See Theme enum |
| createdAt | DateTime | No | `now()` | — |
| updatedAt | DateTime | No | auto | — |

**Schema:** `@@schema("main")`

---

### Model: `Workspace`

A user's workspace container. Each account can own multiple workspaces.

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | String (ULID) | No | `ulid()` | PK |
| accountId | String | No | — | FK → Accounts.id (owner) |
| name | String | No | — | 1–255 chars |
| logo | String? | Yes | NULL | Logo URL or emoji |
| color | String | No | `"#18181b"` | Workspace accent color |
| isRemove | Boolean | No | false | Soft-delete flag |
| createdAt | DateTime | No | `now()` | — |
| updatedAt | DateTime | No | auto | — |

**Schema:** `@@schema("main")`

**Diverges from design:** No `slug`, `type`, `block_count`, `tier_limit` fields. No workspace members or invitations yet (Phase 2 for Startup tier).

---

### Enum: `Theme`

```prisma
enum Theme {
  light
  dark
  system

  @@schema("main")
}
```

---

## Email Verification — Redis (not a DB table)

OTP-based email verification is implemented via **Redis**, not a database table.

| Key | Value | TTL |
|-----|-------|-----|
| `otp:{email}:{ref}` | 6-digit OTP string | ~5 minutes |

Flow:
1. `POST /api/v1/auth/verify/mail` → generates OTP, stores in Redis, sends email via Mailtrap, returns `ref` code
2. `PATCH /api/v1/auth/verify/mail` → validates `{ email, ref, otp }` against Redis, marks `Accounts.isVerify = true`, deletes key

**Diverges from design:** Original design used `email_verification_tokens` DB table with UUID tokens. Actual uses Redis OTP with reference codes.

---

## Not Yet Implemented — Phase 2+

The following tables were designed in the original architecture but are **not yet in the Prisma schema**. They will be added when the corresponding features are implemented.

| Planned Table | Planned Feature | Design Reference |
|---------------|-----------------|-----------------|
| `workspace_members` | Startup tier: team collaboration | SC-COLLAB-001 |
| `workspace_invitations` | Startup tier: invite flow | SC-COLLAB-001 |
| `folders` | Page organization | SC-PAGE-001 |
| `pages` | Note/document editing | SC-PAGE-001 |
| `page_versions` | Version history | SC-VERSION-001 |
| `diary_entries` | Private diary (Personal tier) | SC-DIARY-001 |
| `files` | File upload + RAG | SC-FILE-001 |
| `links` | Link saving + content fetch | SC-LINK-001 |
| `ai_model_configs` | BYOK AI models (Personal/Startup) | SC-AI-001 |
| `ai_conversations` | AI chat history | SC-AI-001 |
| `ai_messages` | Chat messages + source citations | SC-AI-001 |

---

## Prisma Configuration

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["public", "main"]
}
```

All current models use `@@schema("main")`. The `public` schema is reserved for future system-level tables.
