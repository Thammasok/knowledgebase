# API Contracts — Knowledgebase GPT

**Traces to:** REQ-PLATFORM-001, docs/test-design/test-cases.md
**Base path:** `/api/v1`
**Auth:** Bearer JWT access token in `Authorization` header (except public endpoints)
**Device:** `x-device-id` header required on all authenticated requests
**Date:** 2026-03-28

### Standard Error Shape

```json
{
  "code": "ERROR_CODE",
  "message": "Human-readable description.",
  "errors": [
    { "field": "email", "code": "INVALID_FORMAT", "message": "Email format is invalid." }
  ]
}
```

`errors[]` only present on `400 VALIDATION_ERROR`.

---

## AUTH — Authentication

---

### POST /api/v1/auth/register

**Description:** Register a new user account with email and password.
**Actor:** Unauthenticated visitor
**Auth:** None
**Scenarios:** SC-AUTH-001, SC-AUTH-002, SC-AUTH-003
**Test Cases:** TC-AUTH-001 → TC-AUTH-016

**Request Body:**
```json
{
  "displayName": "string (2–50 chars, alphanumeric only)",
  "email": "string (valid RFC email)",
  "password": "string (≥8 chars, ≥1 uppercase, ≥1 digit, ≥1 special char)"
}
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 201 | — | Account created |
| 400 | VALIDATION_ERROR | Field validation failed (per-field errors array) |
| 409 | EMAIL_ALREADY_EXISTS | Email is already registered |
| 429 | RATE_LIMITED | Too many registration attempts |

**201 Body:**
```json
{
  "userId": "uuid",
  "email": "string",
  "tier": "free"
}
```

**Side Effects:**
- Creates `users` record with `email_verified: false`, `tier: "free"`
- Creates `email_verification_tokens` record (expires 24h)
- Dispatches verification email via email service

**Rate Limiting:** Redis key `register_ip:{ip}` — max 10 per IP per hour

---

### POST /api/v1/auth/verify-email

**Description:** Consume an email verification token to activate the account.
**Auth:** None
**Scenarios:** SC-AUTH-001

**Request Body:**
```json
{ "token": "string" }
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Email verified |
| 400 | TOKEN_INVALID | Token not found |
| 410 | TOKEN_EXPIRED | Token older than 24 hours |

**Side Effects:** Sets `users.email_verified = true`; marks token as `used_at = now()`

---

### POST /api/v1/auth/resend-verification

**Description:** Resend the email verification link.
**Auth:** None
**Scenarios:** SC-AUTH-009

**Request Body:**
```json
{ "email": "string" }
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Email resent |
| 429 | RATE_LIMITED | More than 3 requests in 1 hour for this email |

**Rate Limiting:** Redis key `verify_resend:{email}` — max 3 per hour

---

### POST /api/v1/auth/login

**Description:** Authenticate with email and password; receive JWT tokens.
**Auth:** None
**Scenarios:** SC-AUTH-004, SC-AUTH-005, SC-AUTH-008
**Test Cases:** TC-AUTH-017, TC-AUTH-018, TC-AUTH-019, TC-AUTH-023

**Request Headers:** `x-device-id: string (required)`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Login successful |
| 401 | INVALID_CREDENTIALS | Wrong email or password (generic — no info disclosure) |
| 429 | RATE_LIMITED | > 10 failed attempts per IP per minute |

**200 Body:**
```json
{
  "accessToken": "string (JWT, expires 15 min)",
  "refreshToken": "string (opaque, expires 30 days)",
  "tier": "free | personal | startup"
}
```

**Side Effects:**
- Creates or rotates `refresh_tokens` record for `device_id`

**Rate Limiting:** Redis key `login_fail:{ip}` — max 10 failures per minute → 429

**Security:** Response is identical for wrong password AND unknown email (prevents email enumeration)

---

### POST /api/v1/auth/oauth/google

**Description:** Authenticate via Google OAuth. Creates account on first login.
**Auth:** None
**Scenarios:** SC-AUTH-006
**Test Cases:** TC-AUTH-020, TC-AUTH-021

**Request Headers:** `x-device-id: string (required)`

**Request Body:**
```json
{ "idToken": "string (Google ID token from OAuth callback)" }
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Authenticated |
| 400 | INVALID_TOKEN | Google token validation failed |

**200 Body:** Same as `POST /login`

**Side Effects:** Upserts `users` record from Google profile; `email_verified: true` on creation

---

### POST /api/v1/auth/refresh

**Description:** Exchange a valid refresh token for a new access token.
**Auth:** None (token in body)
**Scenarios:** SC-AUTH-007
**Test Cases:** TC-AUTH-022

**Request Body:**
```json
{
  "refreshToken": "string",
  "deviceId": "string"
}
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | New access token issued |
| 401 | TOKEN_INVALID | Refresh token not found or revoked |
| 401 | TOKEN_EXPIRED | Refresh token past 30-day expiry |

**200 Body:**
```json
{ "accessToken": "string (JWT, expires 15 min)" }
```

---

### POST /api/v1/auth/logout

**Description:** Revoke the refresh token for the current device.
**Auth:** Bearer token

**Request Body:**
```json
{ "refreshToken": "string" }
```

**Response:** `200 {}`

**Side Effects:** Sets `refresh_tokens.revoked_at = now()` for matched token

---

## WORKSPACE

---

### POST /api/v1/workspaces

**Description:** Create a new workspace.
**Auth:** Bearer token
**Scenarios:** SC-WS-001, SC-WS-002, SC-WS-004
**Test Cases:** TC-WS-001 → TC-WS-006, TC-WS-009

**Request Body:**
```json
{
  "name": "string (2–100 chars)"
}
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 201 | — | Workspace created |
| 400 | VALIDATION_ERROR | Name out of range |

**201 Body:**
```json
{
  "workspaceId": "uuid",
  "name": "string",
  "slug": "string",
  "type": "personal | shared",
  "ownerId": "uuid"
}
```

**Side Effects:**
- Inserts into `workspaces`; `type` = "personal" for Free/Personal, "shared" for Startup
- Inserts into `workspace_members` (role = "owner")
- Slug auto-generated: kebab-case of name, unique suffix on collision

---

### GET /api/v1/workspaces/:workspaceId

**Description:** Get workspace details.
**Auth:** Bearer token (must be member or owner)

**Response:** `200` with workspace object

**Errors:** `403 FORBIDDEN`, `404 NOT_FOUND`

---

### POST /api/v1/workspaces/:workspaceId/invite

**Description:** Invite a user to a shared workspace by email.
**Auth:** Bearer token (Owner role required)
**Scenarios:** SC-COLLAB-001, SC-COLLAB-002, SC-WS-005
**Test Cases:** TC-COLLAB-001, TC-COLLAB-003, TC-WS-010, TC-WS-011

**Request Body:**
```json
{
  "email": "string (valid email)",
  "role": "member | viewer"
}
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Invitation sent |
| 403 | PLAN_REQUIRED | Caller not on Startup tier |
| 403 | FORBIDDEN | Caller is not Owner |
| 409 | PENDING_INVITE_EXISTS | Email already has a pending invite |

**Side Effects:** Creates `workspace_invitations` record; dispatches invite email

---

### POST /api/v1/invitations/:token/accept

**Description:** Accept a workspace invitation using the token from the invite email.
**Auth:** Bearer token (invitee must be logged in)
**Scenarios:** SC-COLLAB-001, SC-COLLAB-003
**Test Cases:** TC-COLLAB-002, TC-COLLAB-004

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Joined workspace |
| 410 | INVITE_EXPIRED | Token older than 7 days |
| 404 | NOT_FOUND | Token not found |
| 409 | ALREADY_MEMBER | User already in workspace |

**Side Effects:** Creates `workspace_members` record; sets `workspace_invitations.status = "accepted"`

---

### PATCH /api/v1/workspaces/:workspaceId/members/:userId

**Description:** Update a member's role.
**Auth:** Bearer token (Owner only)
**Scenarios:** SC-COLLAB-004
**Test Cases:** TC-COLLAB-005, TC-COLLAB-006

**Request Body:**
```json
{ "role": "member | viewer" }
```

**Response:** `200 { userId, role }`

**Errors:** `403 FORBIDDEN`, `404 NOT_FOUND`

---

### DELETE /api/v1/workspaces/:workspaceId/members/:userId

**Description:** Remove a member from the workspace.
**Auth:** Bearer token (Owner only)
**Scenarios:** SC-COLLAB-004, SC-COLLAB-006
**Test Cases:** TC-COLLAB-006, TC-COLLAB-009

**Response:** `200 {}`

**Errors:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | OWNER_CANNOT_REMOVE_SELF | Owner attempting to remove themselves |
| 403 | FORBIDDEN | Not Owner |
| 404 | NOT_FOUND | Member not found |

---

## CONTENT ORGANIZATION

---

### POST /api/v1/workspaces/:workspaceId/folders

**Description:** Create a folder in the workspace.
**Auth:** Bearer token (Owner or Member)
**Scenarios:** SC-ORG-001, SC-ORG-002
**Test Cases:** TC-ORG-001, TC-ORG-003

**Request Body:**
```json
{
  "name": "string (1–100 chars)",
  "parentFolderId": "uuid | null"
}
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 201 | — | Folder created |
| 400 | MAX_NESTING_DEPTH | Would exceed depth 3 |
| 400 | VALIDATION_ERROR | Name invalid |

**201 Body:**
```json
{
  "folderId": "uuid",
  "name": "string",
  "parentFolderId": "uuid | null",
  "depth": 1
}
```

---

### POST /api/v1/workspaces/:workspaceId/pages

**Description:** Create a new page.
**Auth:** Bearer token (Owner or Member)
**Scenarios:** SC-ORG-001, SC-ORG-003
**Test Cases:** TC-ORG-002, TC-ORG-004, TC-ORG-005

**Request Body:**
```json
{
  "title": "string (1–255 chars)",
  "folderId": "uuid | null",
  "parentPageId": "uuid | null"
}
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 201 | — | Page created |
| 400 | MAX_NESTING_DEPTH | Sub-page depth would exceed 5 |
| 403 | BLOCK_LIMIT_REACHED | Free tier workspace at 1,000 blocks |

**201 Body:**
```json
{
  "pageId": "uuid",
  "title": "string",
  "folderId": "uuid | null",
  "parentPageId": "uuid | null",
  "depth": 1
}
```

**Side Effects:** Increments `workspaces.block_count` by 1 (the page title block)

---

### GET /api/v1/workspaces/:workspaceId/pages/:pageId

**Description:** Get page content.
**Auth:** Bearer token (Owner, Member, or Viewer)

**Response:** `200` with `{ pageId, title, content, updatedAt, createdBy }`

---

### PUT /api/v1/workspaces/:workspaceId/pages/:pageId

**Description:** Full update of page title and content (called by auto-save).
**Auth:** Bearer token (Owner or Member)
**Scenarios:** SC-ORG-004
**Test Cases:** TC-ORG-005

**Request Body:**
```json
{
  "title": "string (1–255 chars)",
  "content": { "blocks": [...] },
  "blockCount": 42
}
```

**Response:** `200 { pageId, updatedAt }`

**Side Effects:**
- Updates `pages.content`, `pages.block_count`
- Recalculates `workspaces.block_count` delta
- Creates `page_versions` snapshot (Personal/Startup tiers only)

---

### POST /api/v1/workspaces/:workspaceId/pages/:pageId/blocks

**Description:** Add a single block to a page (incremental block tracking).
**Auth:** Bearer token (Owner or Member)
**Scenarios:** SC-ORG-005, SC-WS-003
**Test Cases:** TC-ORG-006, TC-WS-007, TC-WS-008

**Request Body:**
```json
{ "block": { "type": "paragraph", "data": {} } }
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 201 | — | Block added |
| 403 | BLOCK_LIMIT_REACHED | Free tier workspace at 1,000 blocks |

**Side Effects:** Increments `workspaces.block_count` and `pages.block_count` by 1

---

### GET /api/v1/workspaces/:workspaceId/pages/:pageId/versions

**Description:** List page version history.
**Auth:** Bearer token (Owner or Member)
**Scenarios:** SC-VERSION-001, SC-VERSION-002
**Test Cases:** TC-VERSION-001, TC-VERSION-003

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Version list returned |
| 403 | PLAN_REQUIRED | User on Free tier |

**200 Body:**
```json
{
  "versions": [
    { "versionId": "uuid", "createdAt": "ISO8601", "authorName": "string", "blockCount": 42 }
  ]
}
```

---

### POST /api/v1/workspaces/:workspaceId/pages/:pageId/versions/:versionId/restore

**Description:** Restore a page to a previous version.
**Auth:** Bearer token (Owner or Member)
**Scenarios:** SC-VERSION-001
**Test Cases:** TC-VERSION-002

**Response:** `200 { pageId, restoredVersionId, newVersionId }`

**Side Effects:** Overwrites `pages.content`; creates new `page_versions` snapshot for the restore event

---

## DIARY

---

### POST /api/v1/workspaces/:workspaceId/diary

**Description:** Create a diary entry for a specific date.
**Auth:** Bearer token (Owner or Member — not Viewer)
**Scenarios:** SC-DIARY-001, SC-DIARY-002, SC-DIARY-003
**Test Cases:** TC-DIARY-001, TC-DIARY-003, TC-DIARY-004

**Request Body:**
```json
{
  "date": "YYYY-MM-DD",
  "content": { "blocks": [...] }
}
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 201 | — | Entry created |
| 302 | — | Entry already exists for date — redirect to existing |
| 403 | PLAN_REQUIRED | Free tier user |

**201 Body:**
```json
{ "entryId": "uuid", "date": "YYYY-MM-DD", "userId": "uuid" }
```

---

### GET /api/v1/workspaces/:workspaceId/diary/:date

**Description:** Get diary entry for a specific date.
**Auth:** Bearer token (caller must own the entry)
**Scenarios:** SC-DIARY-001, SC-DIARY-004
**Test Cases:** TC-DIARY-002, TC-DIARY-005

**Path Params:** `date` = ISO date string `YYYY-MM-DD`

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Entry returned |
| 403 | FORBIDDEN | Caller is not the entry owner |
| 404 | NOT_FOUND | No entry for this date |

---

### PUT /api/v1/workspaces/:workspaceId/diary/:date

**Description:** Update diary entry content (auto-save, same as pages).
**Auth:** Bearer token (owner of entry only)

**Request Body:** `{ "content": { "blocks": [...] } }`

**Response:** `200 { entryId, updatedAt }`

---

## FILES

---

### POST /api/v1/workspaces/:workspaceId/files

**Description:** Upload a file to the workspace.
**Auth:** Bearer token (Owner or Member)
**Scenarios:** SC-FILE-001, SC-FILE-002, SC-FILE-003
**Test Cases:** TC-FILE-001 → TC-FILE-007

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| file | Binary | File content |
| pageId | UUID (optional) | Attach to specific page |

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Upload accepted; processing started |
| 400 | UNSUPPORTED_FILE_TYPE | MIME type not in allowed list |
| 400 | FILE_TOO_LARGE | Exceeds tier size limit |

**200 Body:**
```json
{
  "fileId": "uuid",
  "filename": "string",
  "sizeBytes": 2048000,
  "status": "processing",
  "mimeType": "application/pdf"
}
```

**Tier Size Limits:**
- Free: 5MB (5,242,880 bytes)
- Personal / Startup: 100MB (104,857,600 bytes)

**Supported MIME types:** `application/pdf`, `text/markdown`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `image/png`, `image/jpeg`, `image/webp`, `image/gif`

**Side Effects:** Enqueues background job for text extraction + Qdrant indexing (indexable types only)

---

### GET /api/v1/workspaces/:workspaceId/files/:fileId

**Description:** Get file metadata and status.
**Auth:** Bearer token (Owner, Member, Viewer)

**Response:** `200` with file object including `status` (processing → indexed/stored)

---

## LINKS

---

### POST /api/v1/workspaces/:workspaceId/links

**Description:** Save a URL. Free tier: bookmark only. Personal/Startup: crawl + index.
**Auth:** Bearer token (Owner or Member)
**Scenarios:** SC-LINK-001, SC-LINK-003
**Test Cases:** TC-LINK-001, TC-LINK-003, TC-LINK-004

**Request Body:**
```json
{ "url": "string (http:// or https:// only)" }
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 201 | — | Link saved |
| 400 | INVALID_URL | Not a valid http/https URL |

**201 Body:**
```json
{
  "linkId": "uuid",
  "url": "string",
  "savedAt": "ISO8601",
  "status": "saved | crawled | crawl_failed",
  "contentFetch": false
}
```

**Side Effects (Personal/Startup only):** Enqueues background crawl job

---

### POST /api/v1/workspaces/:workspaceId/links/:linkId/fetch

**Description:** Trigger manual re-crawl of a saved link.
**Auth:** Bearer token (Owner or Member — Personal/Startup tier)
**Scenarios:** SC-LINK-002, SC-LINK-005
**Test Cases:** TC-LINK-002, TC-LINK-006

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Crawl enqueued |
| 403 | PLAN_REQUIRED | Free tier user |
| 429 | RECRAWL_TOO_SOON | Last crawl < 1 hour ago |

---

## SEARCH

---

### GET /api/v1/workspaces/:workspaceId/search

**Description:** Semantic search across indexed workspace content.
**Auth:** Bearer token (all roles including Viewer)
**Scenarios:** SC-SEARCH-001, SC-SEARCH-002
**Test Cases:** TC-SEARCH-001, TC-SEARCH-002, TC-SEARCH-003

**Query Parameters:**
| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| q | string | Yes | — | Search query |
| limit | integer | No | 20 | Max results (max 20) |
| folderId | uuid | No | — | Scope to folder |

**Response:** `200`
```json
{
  "results": [
    {
      "contentType": "note | file | link | diary",
      "title": "string",
      "excerpt": "string",
      "sourceUrl": "string",
      "score": 0.92
    }
  ],
  "total": 12
}
```

**Tier Scoping:**
- Free: results exclude `contentType: "link"` (links not indexed on Free)
- Personal/Startup: all content types included

**Business Rules:** Max 20 results; workspace-scoped only; Viewer can search

---

## AI

---

### POST /api/v1/workspaces/:workspaceId/ai/chat

**Description:** Send a message to AI chat with RAG over workspace content.
**Auth:** Bearer token (Owner or Member — Viewer FORBIDDEN)
**Scenarios:** SC-AI-001, SC-AI-004, SC-AI-005
**Test Cases:** TC-AI-001, TC-AI-007, TC-AI-008, TC-AI-009

**Request Body:**
```json
{
  "message": "string",
  "conversationId": "uuid | null",
  "folderId": "uuid | null"
}
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | AI response returned |
| 403 | FORBIDDEN | Viewer role |
| 403 | PLAN_REQUIRED | Free tier attempting Personal-only feature |

**200 Body:**
```json
{
  "answer": "string",
  "conversationId": "uuid",
  "sources": [
    { "type": "note | file | link | diary", "title": "string", "url": "string" }
  ]
}
```

**RAG Scope by Tier:**
- Free: notes + files only (no diary, no links)
- Personal: all content types (including diary + crawled links)
- Startup: all team members' indexed content (excluding private diary)

---

### GET /api/v1/workspaces/:workspaceId/ai/conversations

**Description:** List user's conversations in workspace.
**Auth:** Bearer token

**Response:** `200 { conversations: [{ conversationId, title, updatedAt }] }`

---

### GET /api/v1/workspaces/:workspaceId/ai/conversations/:conversationId

**Description:** Get full conversation history.
**Auth:** Bearer token (owner of conversation only)
**Scenarios:** SC-AI-001
**Test Cases:** TC-AI-002

**Response:** `200 { conversationId, messages: [{ role, content, sources, createdAt }] }`

**Errors:** `403 FORBIDDEN` if caller did not own this conversation

---

### GET /api/v1/workspaces/:workspaceId/ai/settings

**Description:** Get user's AI model configuration (keys masked).
**Auth:** Bearer token
**Scenarios:** SC-AI-003
**Test Cases:** TC-AI-006

**Response:**
```json
{
  "configs": [
    {
      "configId": "uuid",
      "provider": "openai | gemini | anthropic | ollama | platform",
      "apiKey": "sk-****",
      "isActive": true
    }
  ]
}
```

**Security:** Raw API key NEVER returned. `apiKey` field is always masked.

---

### POST /api/v1/workspaces/:workspaceId/ai/settings

**Description:** Save a BYOK AI model configuration.
**Auth:** Bearer token (Personal or Startup tier)
**Scenarios:** SC-AI-002
**Test Cases:** TC-AI-003, TC-AI-004, TC-AI-005

**Request Body:**
```json
{
  "provider": "openai | gemini | anthropic | ollama",
  "apiKey": "string | null",
  "baseUrl": "string | null",
  "modelName": "string | null"
}
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Config saved and validated |
| 400 | KEY_VALIDATION_FAILED | Test call to provider API failed |
| 400 | VALIDATION_ERROR | Missing required fields |
| 403 | PLAN_REQUIRED | Free tier |

**200 Body:**
```json
{ "configId": "uuid", "provider": "string", "status": "active" }
```

**Side Effects:** Encrypts `api_key` with AES-256 before persisting

---

### POST /api/v1/workspaces/:workspaceId/ai/editor/generate

**Description:** Generate content inline within the page editor.
**Auth:** Bearer token (Personal or Startup — Owner or Member)
**Scenarios:** SC-AI-006, SC-AI-007
**Test Cases:** TC-AI-010, TC-AI-012

**Request Body:**
```json
{
  "prompt": "string (max 8,000 tokens of context)",
  "pageId": "uuid",
  "selectionContext": "string | null"
}
```

**Response:**
| Status | Code | Description |
|--------|------|-------------|
| 200 | — | Generated block returned |
| 400 | CONTEXT_TOO_LONG | Input exceeds 8,000 token limit |
| 403 | PLAN_REQUIRED | Free tier user |

**200 Body:**
```json
{
  "block": {
    "type": "paragraph",
    "data": { "text": "Generated content..." }
  }
}
```

---

## Tier × Endpoint Permission Matrix

| Endpoint | Free | Personal | Startup Member | Startup Viewer |
|----------|------|----------|----------------|----------------|
| POST /auth/register | ✓ | ✓ | ✓ | ✓ |
| POST /workspaces | ✓ | ✓ | ✓ | ✓ |
| POST /workspaces/:id/invite | ✗ PLAN_REQUIRED | ✗ PLAN_REQUIRED | ✗ (Owner only) | ✗ |
| POST /pages | ✓ (block quota) | ✓ | ✓ | ✗ |
| POST /diary | ✗ PLAN_REQUIRED | ✓ | ✓ | ✗ |
| POST /files | ✓ (5MB limit) | ✓ (100MB) | ✓ (100MB) | ✗ |
| POST /links/:id/fetch | ✗ PLAN_REQUIRED | ✓ | ✓ | ✗ |
| GET /search | ✓ (notes+files) | ✓ (all) | ✓ (all) | ✓ |
| POST /ai/chat | ✓ (built-in) | ✓ (BYOK) | ✓ (BYOK) | ✗ |
| POST /ai/settings | ✗ PLAN_REQUIRED | ✓ | ✓ | ✗ |
| POST /ai/editor/generate | ✗ PLAN_REQUIRED | ✓ | ✓ | ✗ |
| GET /pages/:id/versions | ✗ PLAN_REQUIRED | ✓ | ✓ | ✓ (read) |
