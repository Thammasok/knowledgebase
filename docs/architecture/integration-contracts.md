# Integration Contracts — Knowledgebase GPT

**Traces to:** REQ-PLATFORM-001, docs/test-design/sut-definition.md
**Date:** 2026-03-28

---

## 1. Email Service (SendGrid / SMTP)

**Provider:** SendGrid (Phase 1); configurable SMTP (Phase 2)
**Purpose:** Verification emails, workspace invitations
**Scenarios:** SC-AUTH-001, SC-AUTH-009, SC-COLLAB-001
**Test Approach:** Mock in all automated tests — never send real email

### Outbound: Send Verification Email

**Trigger:** On successful user registration
**Endpoint:** `POST https://api.sendgrid.com/v3/mail/send`
**Auth:** `Authorization: Bearer {SENDGRID_API_KEY}`

```json
{
  "to": [{ "email": "user@example.com" }],
  "from": { "email": "noreply@knowledgebase.app" },
  "subject": "Verify your email address",
  "content": [
    {
      "type": "text/html",
      "value": "<a href='https://app.knowledgebase.app/verify?token={token}'>Verify Email</a>"
    }
  ]
}
```

**Success:** `202 Accepted`
**Failure Handling:**

| Status | Handling |
|--------|----------|
| 429 | Retry with exponential backoff (3 attempts max) |
| 5xx | Retry up to 3 times; log failure; do NOT block registration |
| 401 | Alert ops; fail immediately |

**Mock Contract:**
```typescript
// service/src/tests/__mocks__/email.service.ts
export const mockSendEmail = jest.fn().mockResolvedValue({ messageId: 'mock-123' });
```

---

### Outbound: Send Workspace Invitation Email

**Trigger:** Owner invites member via `POST /workspaces/:id/invite`

```json
{
  "to": [{ "email": "invitee@example.com" }],
  "subject": "You've been invited to join {workspaceName}",
  "content": [
    {
      "type": "text/html",
      "value": "<a href='https://app.knowledgebase.app/invite/{token}'>Join Workspace</a>"
    }
  ]
}
```

**Token expires:** 7 days from send time

---

## 2. Google OAuth

**Provider:** Google Identity Services
**Purpose:** Social login / registration
**Scenarios:** SC-AUTH-006
**Test Approach:** Mock `idToken` validation in unit/API tests; real Google login in E2E only

### Inbound: OAuth Callback

**Flow:** Frontend receives `idToken` from Google SDK → sends to backend → backend validates

**Backend Validation (using Google Auth Library):**
```
POST https://oauth2.googleapis.com/tokeninfo?id_token={token}
```

**Expected Response:**
```json
{
  "sub": "google-user-id",
  "email": "user@gmail.com",
  "name": "Display Name",
  "picture": "https://...",
  "email_verified": "true"
}
```

**Failure Handling:**
| Condition | Handling |
|-----------|----------|
| Invalid token | Return `400 INVALID_TOKEN` |
| Token expired | Return `400 INVALID_TOKEN` (generic) |
| Network error | Return `502 BAD_GATEWAY` |

**Mock Contract:**
```typescript
// service/src/tests/__mocks__/google-auth.ts
export const mockVerifyIdToken = jest.fn().mockResolvedValue({
  getPayload: () => ({
    sub: 'mock-google-sub-123',
    email: 'mockuser@gmail.com',
    name: 'Mock User',
    email_verified: true,
  }),
});
```

---

## 3. AI Providers (BYOK)

**Providers:** OpenAI, Google Gemini, Anthropic, Ollama (local)
**Purpose:** LLM inference for RAG chat and in-editor generation
**Scenarios:** SC-AI-002, SC-AI-004, SC-AI-006
**Test Approach:** Mock all provider calls in unit/API tests; optional sandbox key in E2E

### OpenAI — Validation Test Call

**Trigger:** `POST /ai/settings` with `provider: "openai"`
**Endpoint:** `POST https://api.openai.com/v1/chat/completions`
**Auth:** `Authorization: Bearer {api_key}`

```json
{
  "model": "gpt-4o-mini",
  "messages": [{ "role": "user", "content": "ping" }],
  "max_tokens": 1
}
```

**Success:** `200` → key is valid
**Failure (401):** Key invalid → return `400 KEY_VALIDATION_FAILED`

### OpenAI — RAG Chat Call

```json
{
  "model": "gpt-4o",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant. Use the provided context to answer.\n\nContext:\n{retrieved_chunks}" },
    { "role": "user", "content": "{user_message}" }
  ],
  "max_tokens": 1024
}
```

**Mock Contract:**
```typescript
export const mockOpenAIChat = jest.fn().mockResolvedValue({
  choices: [{ message: { content: 'Mock AI response' } }]
});
```

### Anthropic — Validation Test Call

**Endpoint:** `POST https://api.anthropic.com/v1/messages`
**Auth:** `x-api-key: {api_key}`, `anthropic-version: 2023-06-01`

```json
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 1,
  "messages": [{ "role": "user", "content": "ping" }]
}
```

### Gemini — Validation Test Call

**Endpoint:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}`

```json
{
  "contents": [{ "parts": [{ "text": "ping" }] }]
}
```

### Ollama — Validation Test Call

**Endpoint:** `GET {base_url}/api/tags` (list available models)
**Auth:** None (local runtime)

**Success:** `200` with model list → URL is reachable
**Failure:** Network error → return `400 KEY_VALIDATION_FAILED`

**Mock Contract:**
```typescript
export const mockOllamaCheck = jest.fn().mockResolvedValue({ models: [{ name: 'llama2' }] });
```

---

## 4. Qdrant (Vector Database)

**Provider:** Qdrant (self-hosted via Docker)
**Purpose:** Semantic search index — storing and querying content embeddings
**Scenarios:** SC-FILE-004, SC-LINK-003, SC-SEARCH-001
**Test Approach:** Use real Qdrant instance in integration tests; mock HTTP client in unit tests

### Collections

| Collection Name | Content Type | Vector Dimensions |
|----------------|-------------|-------------------|
| `workspace_{id}_notes` | Pages / notes | 1536 (OpenAI text-embedding-3-small) |
| `workspace_{id}_files` | File chunks | 1536 |
| `workspace_{id}_links` | Crawled link chunks | 1536 |
| `workspace_{id}_diary` | Diary entry chunks | 1536 |

### Upsert Vectors

**Endpoint:** `PUT http://qdrant:6333/collections/{collection}/points`

```json
{
  "points": [
    {
      "id": "uuid",
      "vector": [0.1, 0.2, ...],
      "payload": {
        "sourceId": "page-uuid",
        "sourceType": "note",
        "title": "Page Title",
        "chunkIndex": 0,
        "workspaceId": "workspace-uuid",
        "userId": "user-uuid"
      }
    }
  ]
}
```

### Search

**Endpoint:** `POST http://qdrant:6333/collections/{collection}/points/search`

```json
{
  "vector": [0.1, 0.2, ...],
  "limit": 20,
  "filter": {
    "must": [
      { "key": "workspaceId", "match": { "value": "workspace-uuid" } }
    ]
  },
  "with_payload": true
}
```

**Failure Handling:**
| Condition | Handling |
|-----------|----------|
| Qdrant unavailable | Return `503 SERVICE_UNAVAILABLE`; search degrades gracefully |
| Collection not found | Return empty results (not an error) |

---

## 5. Link Crawler (HTTP Client)

**Provider:** Built-in (Node.js `fetch` or `axios` with cheerio for HTML parsing)
**Purpose:** Fetch and extract text content from saved URLs
**Scenarios:** SC-LINK-003, SC-LINK-004
**Test Approach:** Mock HTTP fetch in all automated tests

### Crawl Request

```
GET {url}
User-Agent: Knowledgebase-Bot/1.0 (+https://knowledgebase.app/bot)
```

**robots.txt Check:** Before crawling, fetch `{origin}/robots.txt` and check `Disallow` rules for `Knowledgebase-Bot`.

**Content Extraction:**
1. Parse HTML with cheerio; extract `<title>`, `<meta name="description">`, `<main>` / `<article>` / `<body>`
2. Strip scripts, styles, nav, footer
3. Truncate extracted text to 500KB (BC-2 US-LINK-002)

**Failure Handling:**
| Condition | Link Status |
|-----------|-------------|
| HTTP 4xx/5xx | `crawl_failed` |
| Network timeout (10s) | `crawl_failed` |
| robots.txt disallows | `crawl_failed` (with reason) |
| Content > 500KB (truncated) | `crawled` (partial) |

**Mock Contract:**
```typescript
export const mockCrawlUrl = jest.fn().mockResolvedValue({
  title: 'Mock Article Title',
  description: 'Mock description',
  body: 'Mock extracted body text...',
  statusCode: 200,
});

export const mockCrawlUrlFailed = jest.fn().mockRejectedValue(
  new Error('ECONNREFUSED')
);
```
