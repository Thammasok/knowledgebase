# Test Data Catalogue — Knowledgebase GPT

**Traces to:** REQ-PLATFORM-001, docs/test-design/test-cases.md
**Date:** 2026-03-28

---

## Rules

- Never use real PII — all data is synthetic
- Store fixtures in `service/src/tests/__fixtures__/`
- Use factory functions for complex object creation
- Tag each set by environment: `local | dev | staging`

---

## AUTH — User & Credentials

### Valid Data Sets

| ID | Description | Data |
|----|-------------|------|
| TD-AUTH-V-001 | Standard valid registration | `{ displayName: "JohnDoe", email: "newuser@example.com", password: "SecurePass1!" }` |
| TD-AUTH-V-002 | displayName at min boundary (2 chars) | `{ displayName: "Jo", email: "minname@example.com", password: "SecurePass1!" }` |
| TD-AUTH-V-003 | displayName at max boundary (50 chars) | `{ displayName: "a".repeat(50), email: "maxname@example.com", password: "SecurePass1!" }` |
| TD-AUTH-V-004 | Password at min length (8 chars) | `{ ..., password: "Secure1!" }` |
| TD-AUTH-V-005 | Valid login credentials | `{ email: "verified@example.com", password: "SecurePass1!" }` |
| TD-AUTH-V-006 | Google OAuth mock token | `{ idToken: "mock-google-id-token-valid" }` |

### Invalid / Boundary Data Sets

| ID | Description | Data | Expected Error |
|----|-------------|------|----------------|
| TD-AUTH-I-001 | displayName 1 char (below min) | `{ displayName: "A" }` | 400 TOO_SHORT |
| TD-AUTH-I-002 | displayName 51 chars (above max) | `{ displayName: "a".repeat(51) }` | 400 TOO_LONG |
| TD-AUTH-I-003 | Password 7 chars (below min) | `{ password: "Secur1!" }` | 400 PASSWORD_TOO_SHORT |
| TD-AUTH-I-004 | Password no uppercase | `{ password: "securepass1!" }` | 400 PASSWORD_MISSING_UPPERCASE |
| TD-AUTH-I-005 | Password no digit | `{ password: "SecurePass!" }` | 400 PASSWORD_MISSING_DIGIT |
| TD-AUTH-I-006 | Password no special char | `{ password: "SecurePass1" }` | 400 PASSWORD_MISSING_SPECIAL |
| TD-AUTH-I-007 | Malformed email (no @) | `{ email: "not-an-email" }` | 400 INVALID_EMAIL |
| TD-AUTH-I-008 | Empty body | `{}` | 400 per required field |
| TD-AUTH-I-009 | Duplicate email | `{ email: "existing@example.com" }` | 409 EMAIL_ALREADY_EXISTS |
| TD-AUTH-I-010 | Wrong password on login | `{ email: "verified@example.com", password: "WrongPass1!" }` | 401 |
| TD-AUTH-I-011 | Unknown email on login | `{ email: "ghost@example.com", password: "AnyPass1!" }` | 401 |

### Edge Cases

| ID | Description | Data | Expected |
|----|-------------|------|----------|
| TD-AUTH-E-001 | Special chars in displayName | `{ displayName: "O'Brien" }` | 400 or 201 depending on format rules |
| TD-AUTH-E-002 | XSS payload in displayName | `{ displayName: "<script>alert(1)</script>" }` | 400 INVALID_FORMAT |
| TD-AUTH-E-003 | SQL injection in email | `{ email: "'; DROP TABLE users;--" }` | 400 INVALID_EMAIL |
| TD-AUTH-E-004 | Whitespace-only displayName | `{ displayName: "   " }` | 400 INVALID_FORMAT |
| TD-AUTH-E-005 | Unicode displayName | `{ displayName: "日本語" }` | 201 (if Unicode allowed) or 400 |
| TD-AUTH-E-006 | Expired verification token | `{ token: "expired-token-25h-old" }` | 410 TOKEN_EXPIRED |
| TD-AUTH-E-007 | Expired refresh token | `{ refreshToken: "expired-refresh-token" }` | 401 TOKEN_EXPIRED |

---

## WS — Workspace

### Valid Data Sets

| ID | Description | Data |
|----|-------------|------|
| TD-WS-V-001 | Standard workspace name | `{ name: "My Engineering Workspace" }` |
| TD-WS-V-002 | Min name (2 chars) | `{ name: "KB" }` |
| TD-WS-V-003 | Max name (100 chars) | `{ name: "a".repeat(100) }` |
| TD-WS-V-004 | Workspace with duplicate name (different user) | `{ name: "Test Workspace" }` — expects unique slug variant |

### Invalid Data Sets

| ID | Description | Data | Expected Error |
|----|-------------|------|----------------|
| TD-WS-I-001 | Name 1 char (below min) | `{ name: "A" }` | 400 TOO_SHORT |
| TD-WS-I-002 | Name 101 chars (above max) | `{ name: "a".repeat(101) }` | 400 TOO_LONG |
| TD-WS-I-003 | Empty name | `{ name: "" }` | 400 REQUIRED |
| TD-WS-I-004 | Free user inviting member | action: `POST /invite` | 403 PLAN_REQUIRED |

### Block Quota Test Data

| ID | Description | Setup State |
|----|-------------|-------------|
| TD-WS-B-001 | Workspace at 999 blocks | Seed 999 blocks via factory |
| TD-WS-B-002 | Workspace at 1,000 blocks | Seed 1,000 blocks via factory |
| TD-WS-B-003 | Workspace at 0 blocks | Empty workspace (default state) |

---

## COLLAB — Collaboration

### Valid Data Sets

| ID | Description | Data |
|----|-------------|------|
| TD-COLLAB-V-001 | Invite new member | `{ email: "newmember@example.com", role: "member" }` |
| TD-COLLAB-V-002 | Invite viewer | `{ email: "viewer@example.com", role: "viewer" }` |
| TD-COLLAB-V-003 | Valid invite token (within 7 days) | `{ token: "valid-invite-token-6d-old" }` |

### Invalid Data Sets

| ID | Description | Data | Expected Error |
|----|-------------|------|----------------|
| TD-COLLAB-I-001 | Duplicate invite email | `{ email: "pending@example.com" }` (already invited) | 409 PENDING_INVITE_EXISTS |
| TD-COLLAB-I-002 | Expired invite token (8 days old) | `{ token: "expired-invite-token-8d" }` | 410 INVITE_EXPIRED |
| TD-COLLAB-I-003 | Invalid role value | `{ role: "superadmin" }` | 400 INVALID_ROLE |
| TD-COLLAB-I-004 | Owner removes self | DELETE `/members/{ownerId}` | 400 OWNER_CANNOT_REMOVE_SELF |

---

## FILE — File Upload

### Valid Data Sets

| ID | Description | File | Tier |
|----|-------------|------|------|
| TD-FILE-V-001 | PDF within Free limit | `sample.pdf` (2MB) | Free |
| TD-FILE-V-002 | PDF at Free limit boundary | `boundary-5mb.pdf` (exactly 5,242,880 bytes) | Free |
| TD-FILE-V-003 | PDF within Personal limit | `large-doc.pdf` (50MB) | Personal |
| TD-FILE-V-004 | Markdown file | `notes.md` (100KB) | Any |
| TD-FILE-V-005 | DOCX file | `report.docx` (3MB) | Any |
| TD-FILE-V-006 | PNG image | `screenshot.png` (1MB) | Any |
| TD-FILE-V-007 | XLSX spreadsheet | `data.xlsx` (2MB) | Any |

### Invalid Data Sets

| ID | Description | File | Expected Error |
|----|-------------|------|----------------|
| TD-FILE-I-001 | Unsupported type (.exe) | `malware.exe` (1MB) | 400 UNSUPPORTED_FILE_TYPE |
| TD-FILE-I-002 | Unsupported type (.zip) | `archive.zip` (1MB) | 400 UNSUPPORTED_FILE_TYPE |
| TD-FILE-I-003 | Free user: 5MB + 1 byte | file (5,242,881 bytes) | 400 FILE_TOO_LARGE |
| TD-FILE-I-004 | Personal user: 100MB + 1 byte | file (104,857,601 bytes) | 400 FILE_TOO_LARGE |

---

## LINK — Links

### Valid Data Sets

| ID | Description | URL |
|----|-------------|-----|
| TD-LINK-V-001 | Standard HTTPS URL | `https://example.com/article` |
| TD-LINK-V-002 | HTTP URL | `http://example.com/page` |
| TD-LINK-V-003 | URL with query params | `https://example.com/search?q=knowledge+base` |
| TD-LINK-V-004 | URL with path | `https://docs.example.com/api/v1/auth` |

### Invalid Data Sets

| ID | Description | URL | Expected Error |
|----|-------------|-----|----------------|
| TD-LINK-I-001 | Not a URL | `not-a-url` | 400 INVALID_URL |
| TD-LINK-I-002 | FTP scheme | `ftp://files.example.com` | 400 INVALID_URL |
| TD-LINK-I-003 | Empty URL | `""` | 400 REQUIRED |

### Crawl State Data

| ID | Description | Mock Setup |
|----|-------------|-----------|
| TD-LINK-C-001 | Reachable URL (mock 200 + HTML body) | HTTP mock returns valid HTML |
| TD-LINK-C-002 | Unreachable URL (mock 503) | HTTP mock returns 503 |
| TD-LINK-C-003 | URL robots.txt blocks crawl | HTTP mock returns `robots.txt` disallowing all |
| TD-LINK-C-004 | Oversized content (>500KB text) | HTTP mock returns 600KB text body |

---

## SEARCH — Semantic Search

### Fixture Workspace Content

| ID | Content Type | Title | Contains |
|----|-------------|-------|----------|
| TD-SRCH-F-001 | Note | "Machine Learning Overview" | "supervised learning, neural networks" |
| TD-SRCH-F-002 | File (PDF) | "AI Research Paper" | "deep learning, transformer models" |
| TD-SRCH-F-003 | Link | "Qdrant Vector DB Docs" | "vector similarity, embedding" |
| TD-SRCH-F-004 | Diary | "2026-03-20 Notes" | "thoughts on project alpha" |

**Dependency:** TD-SRCH-F-001, TD-SRCH-F-002 available for Free tier; TD-SRCH-F-003 only for Personal/Startup

---

## AI — Artificial Intelligence

### BYOK Config Data

| ID | Description | Data |
|----|-------------|------|
| TD-AI-V-001 | Valid OpenAI key (mocked) | `{ provider: "openai", apiKey: "sk-mock-valid-key" }` |
| TD-AI-V-002 | Valid Anthropic key (mocked) | `{ provider: "anthropic", apiKey: "sk-ant-mock-valid" }` |
| TD-AI-V-003 | Valid Gemini key (mocked) | `{ provider: "gemini", apiKey: "AIza-mock-valid" }` |
| TD-AI-V-004 | Ollama base URL | `{ provider: "ollama", baseUrl: "http://localhost:11434", model: "llama2" }` |

| ID | Description | Data | Expected Error |
|----|-------------|------|----------------|
| TD-AI-I-001 | Invalid OpenAI key | `{ provider: "openai", apiKey: "sk-invalid" }` (mock 401) | 400 KEY_VALIDATION_FAILED |
| TD-AI-I-002 | Empty API key | `{ provider: "openai", apiKey: "" }` | 400 REQUIRED |

### Chat Message Data

| ID | Description | Message |
|----|-------------|---------|
| TD-AI-M-001 | Standard question | `"Summarize my notes on project alpha"` |
| TD-AI-M-002 | Question matching no content | `"Tell me about quantum physics in my notes"` |
| TD-AI-M-003 | Folder-scoped query | `{ message: "What's in Engineering docs?", folderId: "eng-folder-id" }` |
| TD-AI-M-004 | Oversized prompt (>8000 tokens) | Generated 8001-token string | 400 CONTEXT_TOO_LONG |

---

## Pre-Built User Fixtures

```typescript
// service/src/tests/__fixtures__/users.ts

export const freeUser = {
  email: "free@test.knowledgebase.local",
  password: "TestPass1!",
  tier: "free",
};

export const personalUser = {
  email: "personal@test.knowledgebase.local",
  password: "TestPass1!",
  tier: "personal",
};

export const startupOwner = {
  email: "owner@test.knowledgebase.local",
  password: "TestPass1!",
  tier: "startup",
  role: "owner",
};

export const startupMember = {
  email: "member@test.knowledgebase.local",
  password: "TestPass1!",
  tier: "startup",
  role: "member",
};

export const startupViewer = {
  email: "viewer@test.knowledgebase.local",
  password: "TestPass1!",
  tier: "startup",
  role: "viewer",
};
```
