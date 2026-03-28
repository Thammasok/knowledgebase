# API Contracts — Knowledgebase GPT

**Traces to:** REQ-PLATFORM-001, docs/test-design/test-cases.md
**Base path:** `/api/v1`
**Auth:** `Authorization: Bearer {accessToken}` + `x-device-id: {deviceId}` on all authenticated requests
**Date:** 2026-03-28 (updated to match actual source code)

> **Implementation Status:** Phase 1 (Auth + Account + Workspace) is fully implemented.
> Content and AI endpoints (folders, pages, diary, files, links, AI) are Phase 2 — not yet implemented.

---

## Divergence from Original Design

| Original Endpoint | Actual Endpoint | Change |
|-------------------|----------------|--------|
| POST `/auth/register` | POST `/auth/signup` | Path renamed |
| POST `/auth/verify-email` (token link) | POST `/auth/verify/mail` + PATCH `/auth/verify/mail` | OTP flow (send + verify) |
| POST `/auth/oauth/google` | POST `/auth/oauth` (all providers) | Unified OAuth endpoint |
| GET/POST `/workspaces` (plural) | GET/POST `/workspace` (singular) | Path renamed |
| — | POST `/auth/request-access` | New: invite-gated waitlist |
| — | POST `/auth/signup/request-access` | New: sign-up via invite |
| — | POST `/auth/forgot/mail` | New: forgot password |
| — | POST `/auth/password` | New: reset password |
| — | GET `/account/` | New: get profile |
| — | PATCH `/account/` | New: update profile |
| — | GET `/account/setting/basic` | New: get settings |
| — | PATCH `/account/setting/basic` | New: update settings |
| — | GET `/auth-session/` | New: list sessions |
| — | DELETE `/auth-session/deactivate/:id` | New: deactivate session |

---

### Standard Error Shape

```json
{
  "message": "Human-readable description."
}
```

Validation errors return `400` with field-level message from Joi. Prisma unique violations return `409`.

---

## AUTH — Authentication

---

### POST /api/v1/auth/signup

**Description:** Register a new account with email and password.
**Auth:** None
**Scenarios:** SC-AUTH-001, SC-AUTH-002, SC-AUTH-003

**Request Body:**
```json
{
  "displayName": "string (3–50 chars, required)",
  "email": "string (valid email, max 80 chars, required)",
  "password": "string (8–32 chars, must contain uppercase, lowercase, digit, special char)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 201 | `{ "message": "account created" }` |
| 400 | Validation error (Joi) |
| 409 | Email already registered (Prisma P2002) |

**Side Effects:** Creates `Accounts` record with `isVerify: false`.

---

### POST /api/v1/auth/request-access

**Description:** Submit email to waitlist for invite-gated registration.
**Auth:** None

**Request Body:**
```json
{
  "email": "string (valid email, max 80 chars, required)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 201 | `{}` |
| 400 | Validation error |
| 409 | Email already submitted |

**Side Effects:** Creates `AccountRequestAccess` record with `allowed: false`.

---

### POST /api/v1/auth/signup/request-access

**Description:** Register using an approved invite (from `AccountRequestAccess`).
**Auth:** None

**Request Body:**
```json
{
  "requestId": "string (required)",
  "displayName": "string (3–50 chars, required)",
  "password": "string (8–32 chars, password complexity required)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 201 | `{ "message": "account created" }` |
| 400 | Validation error |
| 404 | Request ID not found or not approved |

---

### POST /api/v1/auth/login

**Description:** Authenticate with email and password. Returns JWT tokens.
**Auth:** None

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | Tokens + account info (see below) |
| 400 | Validation error |
| 401 | Invalid credentials |

**200 Body:**
```json
{
  "token": {
    "accessToken": "string (JWT)",
    "refreshToken": "string (JWT)"
  },
  "account": {
    "displayName": "string",
    "email": "string",
    "image": "string | null",
    "isVerify": "boolean"
  }
}
```

**Side Effects:** Creates `AuthSession` record with device ID, IP, user agent.

---

### POST /api/v1/auth/refresh

**Description:** Refresh access token using refresh token.
**Auth:** `Authorization: Bearer {refreshToken}` + `x-device-id` (refresh token middleware)

**Request Body:** None

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | New tokens + account info (same shape as login) |
| 401 | Invalid or expired refresh token |

---

### POST /api/v1/auth/logout

**Description:** Invalidate the current session.
**Auth:** Required (access token)

**Request Body:** None

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | `{ "message": "Logout success" }` |
| 401 | Unauthorized |

**Side Effects:** Sets `AuthSession.isActive = false` for the current device session.

---

### POST /api/v1/auth/verify/mail

**Description:** Send a 6-digit OTP to the account's email for verification.
**Auth:** None

**Request Body:**
```json
{
  "email": "string (required)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | `{ "mail": { "message": "send email is successed" }, "ref": "string" }` |
| 400 | Validation error |
| 404 | Email not found |

**Side Effects:** Generates OTP, stores in Redis with TTL, sends email via Mailtrap.

---

### PATCH /api/v1/auth/verify/mail

**Description:** Verify email by submitting the OTP received.
**Auth:** None

**Request Body:**
```json
{
  "email": "string (required)",
  "ref": "string (reference code from send-OTP response, required)",
  "otp": "string (6-digit code, required)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | `{ "message": "verify account is successed" }` |
| 400 | Invalid OTP or ref code |

**Side Effects:** Sets `Accounts.isVerify = true`, deletes OTP from Redis.

---

### POST /api/v1/auth/forgot/mail

**Description:** Request a password reset email.
**Auth:** None

**Request Body:**
```json
{
  "email": "string (required)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | `{ "message": "send mail for request change password success" }` |
| 400 | Validation error |

**Side Effects:** Creates/updates `AccountForgotPassword` record, sends reset email.

---

### POST /api/v1/auth/password

**Description:** Set a new password using the reset token.
**Auth:** None

**Request Body:**
```json
{
  "token": "string (reset token, required)",
  "password": "string (8–64 chars, required)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Validation error |
| 404 | Token not found or expired |

**Side Effects:** Updates `Accounts.password` (bcrypt hash), deletes `AccountForgotPassword` record.

---

### POST /api/v1/auth/oauth

**Description:** Sign in or sign up via OAuth provider (Google, GitHub, Facebook).
**Auth:** None

**Request Body:**
```json
{
  "provider": "string (enum: 'google' | 'github' | 'facebook', required)",
  "providerId": "string (required)",
  "email": "string (valid email, required)",
  "displayName": "string (required)",
  "image": "string | null (optional)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | Tokens + account info (same shape as login) |
| 400 | Validation error |

**Side Effects:** Creates `Accounts` with `isExternalAccount: true` if first login; updates existing account if returning. Creates `AuthSession`.

---

## ACCOUNT — Profile & Settings

---

### GET /api/v1/account/

**Description:** Get the authenticated account's profile.
**Auth:** Required

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | Account profile (see below) |
| 401 | Unauthorized |

**200 Body:**
```json
{
  "id": "string (ULID)",
  "displayName": "string",
  "email": "string",
  "image": "string | null",
  "firstName": "string | null",
  "lastName": "string | null",
  "isVerify": "boolean",
  "createdAt": "ISO 8601 datetime",
  "updatedAt": "ISO 8601 datetime"
}
```

---

### PATCH /api/v1/account/

**Description:** Update profile fields.
**Auth:** Required

**Request Body:**
```json
{
  "displayName": "string (max 255, optional)",
  "firstName": "string (max 255, optional, allow empty)",
  "lastName": "string (max 255, optional, allow empty)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | Updated profile |
| 400 | Validation error |
| 401 | Unauthorized |

---

### GET /api/v1/account/setting/basic

**Description:** Get account preferences (language, theme).
**Auth:** Required

**200 Body:**
```json
{
  "language": "string ('en' | 'th')",
  "theme": "string ('light' | 'dark' | 'system')"
}
```

---

### PATCH /api/v1/account/setting/basic

**Description:** Update account preferences.
**Auth:** Required

**Request Body:**
```json
{
  "language": "string (enum: 'en' | 'th', optional)",
  "theme": "string (enum: 'light' | 'dark' | 'auto', optional)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | `{ "language": "string", "theme": "string", "updatedAt": "datetime" }` |
| 400 | Validation error |
| 401 | Unauthorized |

---

## AUTH SESSIONS — Device Session Management

---

### GET /api/v1/auth-session/

**Description:** List all active and inactive sessions for the authenticated account.
**Auth:** Required

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Results per page |

**200 Body:**
```json
{
  "data": [
    {
      "id": "string (UUID)",
      "accountId": "string",
      "deviceId": "string",
      "ipAddress": "string",
      "userAgent": "string",
      "ipInfo": { "country": "string", "city": "string", "region": "string" },
      "isActive": "boolean",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 3 }
}
```

---

### DELETE /api/v1/auth-session/deactivate/:id

**Description:** Deactivate a specific session (remote sign-out from another device).
**Auth:** Required

**Path Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| id | string | Session UUID |

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | `{ "message": "deactivate success" }` |
| 401 | Unauthorized |
| 404 | Session not found |
| 409 | Cannot deactivate your own current session |

---

## WORKSPACE

---

### GET /api/v1/workspace

**Description:** List workspaces owned by the authenticated account.
**Auth:** Required

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| search | string | `""` | Filter by name (max 100 chars) |
| page | integer | 1 | Page number (min 1) |
| limit | integer | 20 | Results per page (min 1, max 100) |

**200 Body:**
```json
{
  "data": [
    {
      "id": "string (ULID)",
      "name": "string",
      "logo": "string | null",
      "color": "string",
      "accountId": "string",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 5 }
}
```

---

### POST /api/v1/workspace

**Description:** Create a new workspace.
**Auth:** Required

**Request Body:**
```json
{
  "name": "string (1–255 chars, required)",
  "logo": "string | null (max 128 chars, optional)",
  "color": "string (max 32 chars, optional)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| 201 | Workspace created (same shape as GET item) |
| 400 | Validation error |
| 401 | Unauthorized |

---

### PATCH /api/v1/workspace/:id

**Description:** Update an existing workspace.
**Auth:** Required

**Path Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| id | string | Workspace ULID |

**Request Body:** Same as POST (name, logo, color)

**Responses:**
| Status | Description |
|--------|-------------|
| 200 | Updated workspace |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Account does not own this workspace |
| 404 | Workspace not found |

---

## HEALTH

### GET /api/v1/health

**Description:** Health check endpoint.
**Auth:** None

**200 Body:** Service status response.

---

## Not Yet Implemented — Phase 2+

The following endpoint groups were designed in the original architecture but are not yet implemented.

| Endpoint Group | Phase | Design Reference |
|----------------|-------|-----------------|
| Workspace members: GET/POST/PATCH/DELETE `/workspace/:id/members` | 2 | SC-COLLAB-001 |
| Workspace invitations: POST `/workspace/:id/invitations` | 2 | SC-COLLAB-001 |
| Folders: GET/POST/PATCH/DELETE `/workspace/:id/folders` | 2 | SC-PAGE-001 |
| Pages: GET/POST/PATCH/DELETE `/workspace/:id/pages` | 2 | SC-PAGE-001 |
| Page versions: GET `/pages/:id/versions` | 2 | SC-VERSION-001 |
| Diary: GET/POST/PATCH/DELETE `/workspace/:id/diary` | 2 | SC-DIARY-001 |
| Files: POST `/workspace/:id/files`, GET, DELETE | 2 | SC-FILE-001 |
| Links: GET/POST/DELETE `/workspace/:id/links` | 2 | SC-LINK-001 |
| Search: GET `/workspace/:id/search` | 2 | SC-SEARCH-001 |
| AI chat: POST/GET `/workspace/:id/ai/chat` | 3 | SC-AI-001 |
| AI settings: GET/POST/PATCH `/workspace/:id/ai/settings` | 3 | SC-AI-001 |

---

## Auth Middleware Details

Two middleware functions in `src/middleware/auth.middleware.ts`:

**`authAccessMiddleware`** (standard protected routes):
- Validates JWT with `sub === "access_token"` (HS256)
- Requires `Authorization: Bearer {accessToken}` header
- Requires `x-device-id` header
- Verifies active `AuthSession` exists in DB for this device
- Attaches account to `req.account`

**`authRefreshMiddleware`** (token refresh endpoint):
- Validates JWT with `sub === "refresh_token"`
- Verifies active session
- Attaches account to `req.account`

---

## Tier Permission Matrix

> Note: Tier enforcement is not yet implemented in Phase 1. The `Accounts` model has no `tier` field. The matrix below represents the planned Phase 2+ design.

| Feature | Free | Personal | Startup |
|---------|------|----------|---------|
| Workspaces | 1 | Unlimited | Unlimited |
| Pages / Blocks | 1,000 blocks | Unlimited | Unlimited |
| Files | 5 MB per file | 100 MB per file | 100 MB per file |
| Diary | ✗ | ✓ | ✓ |
| Version History | ✗ | ✓ | ✓ |
| BYOK AI | ✗ | ✓ | ✓ |
| AI Chat | Basic RAG | Full RAG | Full RAG |
| Team members | ✗ | ✗ | ✓ |
| Role management | ✗ | ✗ | Owner/Member/Viewer |
