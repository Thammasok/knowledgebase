# Test Cases — Knowledgebase GPT

**Traces to:** REQ-PLATFORM-001, docs/test-design/test-scenarios.md
**SUT:** docs/test-design/sut-definition.md
**Date:** 2026-03-28

---

## AUTH — Authentication

---

### TC-AUTH-001 — Successful Registration with Valid Input

**Traces to:** SC-AUTH-001, US-AUTH-001 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:**
- Email `newuser@example.com` not registered
- Email service mocked

**Input:**
| Field | Value | Why |
|-------|-------|-----|
| displayName | `"JohnDoe"` | Valid: 7 chars, alphanumeric |
| email | `"newuser@example.com"` | Valid RFC email |
| password | `"SecurePass1!"` | Valid: ≥8 chars, uppercase, digit, special |

**Steps:**
1. POST `/api/v1/auth/register` with above body
2. Assert response

**Expected Output:**
- Status: `201 Created`
- Response: `{ userId, email, tier: "free" }`
- Side effects: User record created with `emailVerified: false`; verification email dispatched (mocked)

**Automation:**
- Target file: `service/src/tests/auth/register.api.test.ts`
- Mock needed: Email service (SendGrid)

---

### TC-AUTH-002 — Registration Sets Default Tier to Free

**Traces to:** SC-AUTH-001, US-AUTH-001 BC-5

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | EP |

**Preconditions:** Email not registered

**Input:**
| Field | Value |
|-------|-------|
| displayName | `"ValidUser"` |
| email | `"freetier@example.com"` |
| password | `"SecurePass1!"` |

**Steps:**
1. POST `/api/v1/auth/register`
2. Query user record for tier

**Expected Output:**
- Status: `201`
- Side effects: User record has `tier: "free"`

**Automation:**
- Target file: `service/src/tests/auth/register.api.test.ts`

---

### TC-AUTH-003 — Verification Email Token Expires After 24 Hours

**Traces to:** SC-AUTH-001, US-AUTH-001 BC-3

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | API |
| Technique | State Transition |

**Preconditions:** User registered; verification token created 25 hours ago (time-travel mock)

**Steps:**
1. POST `/api/v1/auth/verify-email` with expired token

**Expected Output:**
- Status: `410 Gone` or `400`
- Response: `{ code: "TOKEN_EXPIRED" }`

**Automation:**
- Target file: `service/src/tests/auth/verify-email.api.test.ts`
- Mock needed: Date/time (set token created_at to 25h ago)

---

### TC-AUTH-004 — Registration Rejected for Duplicate Email

**Traces to:** SC-AUTH-002, US-AUTH-001 AC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Error Guessing |

**Preconditions:** User with `existing@example.com` already registered

**Input:**
| Field | Value |
|-------|-------|
| email | `"existing@example.com"` |
| displayName | `"AnotherUser"` |
| password | `"SecurePass1!"` |

**Steps:**
1. POST `/api/v1/auth/register` with duplicate email

**Expected Output:**
- Status: `409 Conflict`
- Response: `{ code: "EMAIL_ALREADY_EXISTS" }`
- Side effects: No new user record created; no email sent

**Automation:**
- Target file: `service/src/tests/auth/register.api.test.ts`

---

### TC-AUTH-005 — displayName Below Minimum Length (BVA: min-1)

**Traces to:** SC-AUTH-003, US-AUTH-001 BC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** `displayName: "a"` (1 char — below min of 2)

**Expected Output:**
- Status: `400`
- Response: `{ field: "displayName", code: "TOO_SHORT" }`

---

### TC-AUTH-006 — displayName At Minimum Length (BVA: min)

**Traces to:** SC-AUTH-003

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** `displayName: "ab"` (2 chars — exactly min)

**Expected Output:** `201 Created`

---

### TC-AUTH-007 — displayName At Maximum Length (BVA: max)

**Traces to:** SC-AUTH-003

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** `displayName: "a".repeat(50)` (50 chars — exactly max)

**Expected Output:** `201 Created`

---

### TC-AUTH-008 — displayName Exceeds Maximum Length (BVA: max+1)

**Traces to:** SC-AUTH-003

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** `displayName: "a".repeat(51)` (51 chars)

**Expected Output:**
- Status: `400`
- Response: `{ field: "displayName", code: "TOO_LONG" }`

---

### TC-AUTH-009 — Password Too Short (BVA: below min)

**Traces to:** SC-AUTH-003, US-AUTH-001 BC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** `password: "Ab1!"` (4 chars — below min of 8)

**Expected Output:**
- Status: `400`
- Response: `{ field: "password", code: "PASSWORD_TOO_SHORT" }`

---

### TC-AUTH-010 — Password At Minimum Length (BVA: min = 8)

**Traces to:** SC-AUTH-003

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** `password: "Secure1!"` (8 chars, has uppercase, digit, special)

**Expected Output:** `201 Created`

---

### TC-AUTH-011 — Password Missing Uppercase Letter

**Traces to:** SC-AUTH-003, US-AUTH-001 BC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | EP |

**Input:** `password: "securepass1!"` (no uppercase)

**Expected Output:**
- Status: `400`
- Response: `{ field: "password", code: "PASSWORD_MISSING_UPPERCASE" }`

---

### TC-AUTH-012 — Password Missing Digit

**Traces to:** SC-AUTH-003

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | EP |

**Input:** `password: "SecurePass!"` (no digit)

**Expected Output:**
- Status: `400`
- Response: `{ field: "password", code: "PASSWORD_MISSING_DIGIT" }`

---

### TC-AUTH-013 — Password Missing Special Character

**Traces to:** SC-AUTH-003

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | EP |

**Input:** `password: "SecurePass1"` (no special char)

**Expected Output:**
- Status: `400`
- Response: `{ field: "password", code: "PASSWORD_MISSING_SPECIAL" }`

---

### TC-AUTH-014 — Malformed Email Address

**Traces to:** SC-AUTH-003

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | EP |

**Input:** `email: "not-an-email"` (missing @)

**Expected Output:**
- Status: `400`
- Response: `{ field: "email", code: "INVALID_EMAIL" }`

---

### TC-AUTH-015 — Missing Required Fields

**Traces to:** SC-AUTH-003

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Error Guessing |

**Input:** `{}` (empty body)

**Expected Output:**
- Status: `400`
- Response: errors for each required field

---

### TC-AUTH-016 — Error Response Does Not Leak Password Hash

**Traces to:** SC-AUTH-003

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Security |

**Steps:** Attempt registration with invalid data; inspect error response body

**Expected Output:** Response body does NOT contain `passwordHash`, `password`, or any credential field

---

### TC-AUTH-017 — Successful Login Returns Tokens

**Traces to:** SC-AUTH-004, US-AUTH-002 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** User registered, email verified

**Input:**
| Field | Value |
|-------|-------|
| email | `"verified@example.com"` |
| password | `"SecurePass1!"` |

**Steps:**
1. POST `/api/v1/auth/login` with credentials

**Expected Output:**
- Status: `200`
- Response: `{ accessToken, refreshToken, tier }`
- accessToken expires in 15 min; refreshToken expires in 30 days

**Automation:**
- Target file: `service/src/tests/auth/login.api.test.ts`

---

### TC-AUTH-018 — Login with Wrong Password

**Traces to:** SC-AUTH-005, US-AUTH-002 AC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Negative / Security |

**Input:** Correct email, wrong password

**Expected Output:**
- Status: `401`
- Response: `{ message: "invalid email or password" }` (generic — no info disclosure)
- Response does NOT indicate whether email exists

---

### TC-AUTH-019 — Login with Unknown Email

**Traces to:** SC-AUTH-005

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Security |

**Input:** Email not registered, any password

**Expected Output:**
- Status: `401`
- Response: identical message to TC-AUTH-018 (prevents email enumeration)

---

### TC-AUTH-020 — Google OAuth Creates New Account

**Traces to:** SC-AUTH-006, US-AUTH-002 AC-3

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** Google OAuth mocked with valid token; email not registered

**Steps:**
1. POST `/api/v1/auth/oauth/google` with mock OAuth code

**Expected Output:**
- Status: `200`
- Response: `{ accessToken, refreshToken, tier: "free" }`
- Side effects: New user record created with `emailVerified: true`

---

### TC-AUTH-021 — Google OAuth Logs In Existing User

**Traces to:** SC-AUTH-006

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | State Transition |

**Preconditions:** User already registered via Google OAuth

**Steps:**
1. POST `/api/v1/auth/oauth/google` with same mock identity

**Expected Output:**
- Status: `200`
- Side effects: No duplicate user record created

---

### TC-AUTH-022 — Silent Token Refresh

**Traces to:** SC-AUTH-007, US-AUTH-002 AC-4

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | State Transition |

**Preconditions:** Valid refresh token; access token expired (time-travel mock)

**Steps:**
1. POST `/api/v1/auth/refresh` with valid refreshToken

**Expected Output:**
- Status: `200`
- Response: `{ accessToken }` (new token with fresh 15-min expiry)

---

### TC-AUTH-023 — Rate Limit After 10 Failed Login Attempts

**Traces to:** SC-AUTH-008, US-AUTH-002 BC-1

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | API |
| Technique | BVA / Business Rule |

**Steps:**
1. Send 10 POST `/api/v1/auth/login` with wrong password from same IP
2. Send 11th request

**Expected Output:**
- Attempts 1–10: `401`
- Attempt 11: `429 Too Many Requests`

**Automation:**
- Mock needed: Redis rate limit counter

---

### TC-AUTH-024 — Verification Resend Rate Limit (max 3/hour)

**Traces to:** SC-AUTH-009, US-AUTH-001 BC-4

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | API |
| Technique | BVA |

**Steps:**
1. Send 3 POST `/api/v1/auth/resend-verification` within 1 hour
2. Send 4th request

**Expected Output:**
- Requests 1–3: `200`
- Request 4: `429`

---

## WS — Workspace

---

### TC-WS-001 — Create Personal Workspace

**Traces to:** SC-WS-001, US-WS-001 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** User authenticated

**Input:** `{ name: "My Workspace" }`

**Expected Output:**
- Status: `201`
- Response: `{ workspaceId, name, slug, ownerId }`
- Side effects: User assigned Owner role; slug is URL-safe unique string derived from name

---

### TC-WS-002 — Workspace Slug Is Auto-Generated and Unique

**Traces to:** SC-WS-001, US-WS-001 BC-4

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | EP |

**Steps:**
1. Create workspace with name `"Test Workspace"`
2. Create second workspace (different user) with same name

**Expected Output:** Both created; slugs are distinct (e.g., `test-workspace` and `test-workspace-2`)

---

### TC-WS-003 — Workspace Name: 1 Character (Below Min of 2)

**Traces to:** SC-WS-002

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** `{ name: "A" }` (1 char)

**Expected Output:** `400 { field: "name", code: "TOO_SHORT" }`

---

### TC-WS-004 — Workspace Name: 2 Characters (Min Boundary)

**Traces to:** SC-WS-002

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** `{ name: "AB" }` (2 chars)

**Expected Output:** `201 Created`

---

### TC-WS-005 — Workspace Name: 100 Characters (Max Boundary)

**Traces to:** SC-WS-002

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** `{ name: "a".repeat(100) }` (100 chars)

**Expected Output:** `201 Created`

---

### TC-WS-006 — Workspace Name: 101 Characters (Exceeds Max)

**Traces to:** SC-WS-002

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** `{ name: "a".repeat(101) }` (101 chars)

**Expected Output:** `400 { field: "name", code: "TOO_LONG" }`

---

### TC-WS-007 — Free Tier Block Limit: 1000th Block Succeeds

**Traces to:** SC-WS-003, US-WS-001 BC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Preconditions:** Free user; workspace has 999 blocks

**Steps:** Add 1 block

**Expected Output:** `201 Created` (reaches exactly 1,000)

---

### TC-WS-008 — Free Tier Block Limit: 1001st Block Blocked

**Traces to:** SC-WS-003

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Preconditions:** Free user; workspace at exactly 1,000 blocks

**Steps:** Add 1 block

**Expected Output:**
- Status: `403`
- Response: `{ code: "BLOCK_LIMIT_REACHED" }`
- Side effects: Block NOT created in DB

---

### TC-WS-009 — Startup User Creates Shared Workspace

**Traces to:** SC-WS-004, US-WS-002 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** User on Startup tier

**Expected Output:**
- Status: `201`
- Workspace created with `type: "shared"`; user assigned `role: "owner"`

---

### TC-WS-010 — Free User Cannot Invite Members

**Traces to:** SC-WS-005, US-WS-002 AC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Business Rule |

**Preconditions:** Free-tier user; workspace exists

**Steps:** POST `/api/v1/workspaces/{id}/invite` with valid email and role

**Expected Output:** `403 { code: "PLAN_REQUIRED" }`

---

### TC-WS-011 — Personal User Cannot Invite Members

**Traces to:** SC-WS-005

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Business Rule |

**Preconditions:** Personal-tier user

**Expected Output:** `403 { code: "PLAN_REQUIRED" }`

---

## COLLAB — Collaboration

---

### TC-COLLAB-001 — Owner Invites Existing User as Member

**Traces to:** SC-COLLAB-001, US-COLLAB-001 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** Owner on Startup tier; target email is a registered user; email service mocked

**Input:** `{ email: "member@example.com", role: "member" }`

**Expected Output:**
- Status: `200`
- Side effects: Invitation record created; invite email dispatched (mocked)

---

### TC-COLLAB-002 — Invitee Accepts and Joins Workspace

**Traces to:** SC-COLLAB-001, US-COLLAB-001 AC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | State Transition |

**Preconditions:** Valid invite token exists

**Steps:** POST `/api/v1/invitations/{token}/accept`

**Expected Output:**
- Status: `200`
- Side effects: User added to workspace with assigned role; invite marked accepted

---

### TC-COLLAB-003 — Duplicate Invitation Rejected

**Traces to:** SC-COLLAB-002, US-COLLAB-001 AC-4

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | API |
| Technique | Error Guessing |

**Preconditions:** Pending invite already exists for `member@example.com`

**Expected Output:** `409 { code: "PENDING_INVITE_EXISTS" }`

---

### TC-COLLAB-004 — Expired Invitation Cannot Be Accepted

**Traces to:** SC-COLLAB-003, US-COLLAB-001 BC-1

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | API |
| Technique | State Transition / BVA |

**Preconditions:** Invite token created 8 days ago (time-travel mock)

**Expected Output:**
- Status: `410` or `400`
- Response: `{ code: "INVITE_EXPIRED" }`
- Side effects: User NOT added to workspace

---

### TC-COLLAB-005 — Owner Changes Viewer to Member

**Traces to:** SC-COLLAB-004, US-COLLAB-002 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | State Transition |

**Steps:** PATCH `/api/v1/workspaces/{id}/members/{userId}` with `{ role: "member" }`

**Expected Output:**
- Status: `200`
- Side effects: User's role updated in DB immediately; subsequent write requests succeed

---

### TC-COLLAB-006 — Owner Removes Member

**Traces to:** SC-COLLAB-004, US-COLLAB-002 AC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | State Transition |

**Steps:** DELETE `/api/v1/workspaces/{id}/members/{userId}`

**Expected Output:**
- Status: `200`
- Side effects: User removed from workspace; subsequent API calls by that user return `403`

---

### TC-COLLAB-007 — Viewer Cannot Create Content

**Traces to:** SC-COLLAB-005, US-COLLAB-002 AC-3

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Security |

**Preconditions:** Authenticated as Viewer

**Steps:** POST `/api/v1/pages` (create page)

**Expected Output:** `403 FORBIDDEN`

---

### TC-COLLAB-008 — Viewer Cannot Access AI Features

**Traces to:** SC-COLLAB-005, US-COLLAB-002 AC-4

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Security |

**Preconditions:** Authenticated as Viewer

**Steps:** POST `/api/v1/ai/chat`

**Expected Output:** `403 FORBIDDEN`

---

### TC-COLLAB-009 — Owner Cannot Remove Themselves

**Traces to:** SC-COLLAB-006, US-COLLAB-002 BC-2

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | API |
| Technique | Business Rule / Error Guessing |

**Steps:** DELETE `/api/v1/workspaces/{id}/members/{ownerId}` (own user ID)

**Expected Output:** `400 { code: "OWNER_CANNOT_REMOVE_SELF" }`

---

## ORG — Content Organization

---

### TC-ORG-001 — Create Folder in Workspace

**Traces to:** SC-ORG-001, US-ORG-001 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Input:** `{ name: "Engineering", workspaceId }`

**Expected Output:**
- Status: `201`
- Response: `{ folderId, name }`
- Side effects: Folder appears in workspace sidebar tree

---

### TC-ORG-002 — Create Page Inside Folder

**Traces to:** SC-ORG-001, US-PAGE-001 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Input:** `{ title: "Architecture Notes", folderId }`

**Expected Output:**
- Status: `201`
- Response: `{ pageId, title, folderId }`

---

### TC-ORG-003 — Folder Nesting: 4th Level Blocked

**Traces to:** SC-ORG-002, US-ORG-001 BC-2

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | API |
| Technique | BVA / Business Rule |

**Preconditions:** Workspace → Folder → Sub-folder → Sub-sub-folder (depth 3) exists

**Steps:** Create folder inside sub-sub-folder (depth 4)

**Expected Output:** `400 { code: "MAX_NESTING_DEPTH" }`

---

### TC-ORG-004 — Sub-Page Nesting: 6th Level Blocked

**Traces to:** SC-ORG-003, US-PAGE-001 BC-2

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | API |
| Technique | BVA |

**Preconditions:** 5-level page hierarchy exists (depth 5)

**Steps:** Create sub-page under 5th-level page

**Expected Output:** `400 { code: "MAX_NESTING_DEPTH" }`

---

### TC-ORG-005 — Page Title Boundary: 255 Characters (Max)

**Traces to:** SC-ORG-001, US-PAGE-001 BC-3

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** `{ title: "a".repeat(255) }`

**Expected Output:** `201 Created`

---

### TC-ORG-006 — Free Tier Block Limit on Block Creation via Page

**Traces to:** SC-ORG-005, US-PAGE-001 AC-4

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Business Rule |

**Preconditions:** Free user; workspace at 1,000 blocks

**Steps:** POST `/api/v1/pages/{id}/blocks` (add block)

**Expected Output:** `403 { code: "BLOCK_LIMIT_REACHED" }`

---

## DIARY — Diary Entries

---

### TC-DIARY-001 — Create Today's Diary Entry

**Traces to:** SC-DIARY-001, US-DIARY-001 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** Personal-tier user; no diary entry for today

**Input:** `{ date: "2026-03-28", content: { blocks: [...] } }`

**Expected Output:**
- Status: `201`
- Response: `{ entryId, date, userId }`

---

### TC-DIARY-002 — Retrieve Past Diary Entry by Date

**Traces to:** SC-DIARY-001, US-DIARY-001 AC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** Entry exists for `2026-03-20`

**Steps:** GET `/api/v1/diary/2026-03-20`

**Expected Output:** `200` with correct entry content

---

### TC-DIARY-003 — Cannot Create Duplicate Entry for Same Date

**Traces to:** SC-DIARY-002, US-DIARY-001 AC-3

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | API |
| Technique | Business Rule |

**Preconditions:** Entry already exists for today

**Steps:** POST `/api/v1/diary` with same date

**Expected Output:**
- Status: `302` redirect or `409` with redirect URL
- Side effects: No duplicate entry created

---

### TC-DIARY-004 — Free Tier Cannot Create Diary Entries

**Traces to:** SC-DIARY-003, US-DIARY-001 AC-4

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Business Rule |

**Preconditions:** Free-tier user

**Steps:** POST `/api/v1/diary`

**Expected Output:** `403 { code: "PLAN_REQUIRED" }`

---

### TC-DIARY-005 — Workspace Member Cannot Read Another User's Diary

**Traces to:** SC-DIARY-004, US-DIARY-001 BC-3

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Security |

**Preconditions:** Startup workspace; Owner has diary entry; Member user authenticated

**Steps:** Member attempts GET `/api/v1/diary/{ownerId}/2026-03-28`

**Expected Output:** `403 FORBIDDEN` or `404 NOT_FOUND`

---

## FILE — File Upload

---

### TC-FILE-001 — Upload PDF Within Free Tier Limit (≤5MB)

**Traces to:** SC-FILE-001, US-FILE-001 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** Free-tier user; PDF file 2MB

**Input:** Multipart form with `file = sample.pdf` (2MB)

**Expected Output:**
- Status: `200`
- Response: `{ fileId, filename, size, status: "processing" }`

---

### TC-FILE-002 — Upload at Boundary: Exactly 5MB (Free Tier Max)

**Traces to:** SC-FILE-001, US-FILE-001 BC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** File exactly 5,242,880 bytes (5MB)

**Expected Output:** `200 Created`

---

### TC-FILE-003 — Upload Unsupported File Type

**Traces to:** SC-FILE-002, US-FILE-001 AC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | EP |

**Input:** File with `.exe` extension

**Expected Output:**
- Status: `400`
- Response: `{ code: "UNSUPPORTED_FILE_TYPE", supportedTypes: [...] }`

---

### TC-FILE-004 — Free User: File Exceeds 5MB Limit

**Traces to:** SC-FILE-003, US-FILE-001 BC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** File 5,242,881 bytes (5MB + 1 byte) uploaded by Free user

**Expected Output:** `400 { code: "FILE_TOO_LARGE", maxBytes: 5242880 }`

---

### TC-FILE-005 — Personal User: File Exceeds 100MB Limit

**Traces to:** SC-FILE-003

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | BVA |

**Input:** File 104,857,601 bytes (100MB + 1) uploaded by Personal user

**Expected Output:** `400 { code: "FILE_TOO_LARGE", maxBytes: 104857600 }`

---

### TC-FILE-006 — PDF Upload Triggers RAG Indexing

**Traces to:** SC-FILE-004, US-FILE-001 AC-4

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | Integration |
| Technique | Happy Path |

**Preconditions:** Qdrant available

**Steps:**
1. Upload PDF file
2. Wait for processing job (or poll status endpoint)
3. Check Qdrant for inserted vectors

**Expected Output:**
- File status: `"indexed"` within 60 seconds
- Qdrant: vector entries created for file chunks

---

### TC-FILE-007 — Image Upload Is Stored But Not Indexed

**Traces to:** SC-FILE-004, US-FILE-001 AC-5

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | Integration |
| Technique | EP |

**Steps:** Upload `.png` image; check Qdrant

**Expected Output:**
- File stored; status: `"stored"`
- Qdrant: NO vector entries for this file

---

## LINK — Link Management

---

### TC-LINK-001 — Free User Saves Valid URL as Bookmark

**Traces to:** SC-LINK-001, US-LINK-001 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** Free-tier user

**Input:** `{ url: "https://example.com/article" }`

**Expected Output:**
- Status: `201`
- Response: `{ linkId, url, savedAt, contentFetch: false }`

---

### TC-LINK-002 — Free User Cannot Trigger Content Fetch

**Traces to:** SC-LINK-002, US-LINK-001 AC-3

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Business Rule |

**Steps:** POST `/api/v1/links/{id}/fetch` (Free user)

**Expected Output:** `403 { code: "PLAN_REQUIRED" }`

---

### TC-LINK-003 — Personal User Saves Link with Content Fetch

**Traces to:** SC-LINK-003, US-LINK-002 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | Integration |
| Technique | Happy Path |

**Preconditions:** Personal user; URL crawl mocked to return HTML

**Input:** `{ url: "https://example.com/article" }`

**Expected Output:**
- Status: `201`
- Response: `{ linkId, title, description, status: "crawled" }`

---

### TC-LINK-004 — Crawled Link Content Indexed in Qdrant

**Traces to:** SC-LINK-003, US-LINK-002 AC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | Integration |
| Technique | Happy Path |

**Steps:**
1. Save link (Personal user); wait for indexing
2. Check Qdrant for link content vectors

**Expected Output:** Vector entries exist for the link's content chunks

---

### TC-LINK-005 — Crawl Failure Sets Status to crawl_failed

**Traces to:** SC-LINK-004, US-LINK-002 AC-3

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | Integration |
| Technique | Negative |

**Preconditions:** Link crawler mocked to return HTTP 503

**Expected Output:**
- Status: `201` (link is saved)
- Response: `{ status: "crawl_failed" }`
- No vectors in Qdrant for this link

---

### TC-LINK-006 — Manual Recrawl Blocked Within 1 Hour

**Traces to:** SC-LINK-005, US-LINK-002 BC-5

| Attribute | Value |
|-----------|-------|
| Priority | P3 |
| Level | API |
| Technique | BVA / Business Rule |

**Preconditions:** Link crawled 30 minutes ago

**Steps:** POST `/api/v1/links/{id}/fetch`

**Expected Output:** `429 { code: "RECRAWL_TOO_SOON" }`

---

## VERSION — Version History

---

### TC-VERSION-001 — View Version History List

**Traces to:** SC-VERSION-001, US-VERSION-001 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** Personal user; page has 3 saved versions

**Steps:** GET `/api/v1/pages/{id}/versions`

**Expected Output:**
- Status: `200`
- Response: array of `{ versionId, createdAt, authorName }` ordered newest first

---

### TC-VERSION-002 — Restore Previous Version

**Traces to:** SC-VERSION-001, US-VERSION-001 AC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | State Transition |

**Steps:** POST `/api/v1/pages/{id}/versions/{versionId}/restore`

**Expected Output:**
- Status: `200`
- Side effects: Page content replaced with selected version; new version snapshot created for the restore action

---

### TC-VERSION-003 — Free Tier Cannot Access Version History

**Traces to:** SC-VERSION-002, US-VERSION-001 AC-3

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Business Rule |

**Preconditions:** Free-tier user

**Steps:** GET `/api/v1/pages/{id}/versions`

**Expected Output:** `403 { code: "PLAN_REQUIRED" }`

---

## SEARCH — Semantic Search

---

### TC-SEARCH-001 — Semantic Search Returns Up to 20 Results

**Traces to:** SC-SEARCH-001, US-SEARCH-001 AC-1, BC-3

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | Integration |
| Technique | Happy Path |

**Preconditions:** Workspace with 25 indexed content items

**Input:** `{ query: "machine learning fundamentals" }`

**Expected Output:**
- Status: `200`
- Response: array of ≤20 results, each with `{ contentType, title, excerpt, sourceUrl, score }`
- Results ordered by similarity score descending

---

### TC-SEARCH-002 — Free Tier Search Excludes Link Content

**Traces to:** SC-SEARCH-002, US-SEARCH-001 AC-3

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | Integration |
| Technique | Business Rule |

**Preconditions:** Free user; workspace has notes, files, and link content in Qdrant

**Steps:** Search for term that matches link content only

**Expected Output:** `200` with empty or no results containing `contentType: "link"`

---

### TC-SEARCH-003 — Personal Tier Search Includes Link Content

**Traces to:** SC-SEARCH-002, US-SEARCH-001 AC-4

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | Integration |
| Technique | Business Rule |

**Preconditions:** Personal user; same workspace data as TC-SEARCH-002

**Expected Output:** Results include items with `contentType: "link"`

---

## AI — Artificial Intelligence

---

### TC-AI-001 — Free User Sends Chat Message Using Built-in Model

**Traces to:** SC-AI-001, US-AI-FREE-001 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** Free user; notes indexed; built-in AI model mocked

**Input:** `{ message: "Summarize my notes on project alpha" }`

**Expected Output:**
- Status: `200`
- Response: `{ answer, sources: [{ type, title, url }] }`

---

### TC-AI-002 — Chat History Persisted and Private

**Traces to:** SC-AI-001, US-AI-FREE-001 AC-3

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | State Transition |

**Steps:**
1. Send message; note conversationId
2. GET `/api/v1/ai/conversations/{id}`

**Expected Output:** Full conversation history returned; not accessible by other users

---

### TC-AI-003 — BYOK: Save Valid OpenAI API Key

**Traces to:** SC-AI-002, US-AI-001 AC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** Personal user; OpenAI API mocked to return 200 on test call

**Input:** `{ provider: "openai", apiKey: "sk-test-valid-key" }`

**Expected Output:**
- Status: `200`
- Response: `{ provider: "openai", status: "active" }` — key NOT returned in response

---

### TC-AI-004 — BYOK: Invalid API Key Rejected

**Traces to:** SC-AI-002, US-AI-001 AC-3

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Negative |

**Preconditions:** OpenAI API mocked to return 401

**Input:** `{ provider: "openai", apiKey: "sk-invalid-key" }`

**Expected Output:** `400 { code: "KEY_VALIDATION_FAILED" }`

---

### TC-AI-005 — Startup User Can Configure Multiple Models

**Traces to:** SC-AI-002, US-AI-001 AC-5

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | API |
| Technique | Business Rule |

**Preconditions:** Startup-tier user

**Steps:** Add OpenAI key, then add Anthropic key

**Expected Output:** Both saved; user can select active model per conversation

---

### TC-AI-006 — API Key Never Returned in Response

**Traces to:** SC-AI-003, US-AI-001 BC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Security |

**Steps:** GET `/api/v1/ai/settings` after saving API key

**Expected Output:** Response body does NOT contain raw API key; key field is absent or masked (`"sk-****"`)

---

### TC-AI-007 — Personal User Full RAG Chat

**Traces to:** SC-AI-004, US-AI-002 AC-1

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | Integration |
| Technique | Happy Path |

**Preconditions:** Personal user; diary, links, notes, and files indexed; BYOK configured (mocked)

**Input:** `{ message: "What did I write about last Tuesday?" }`

**Expected Output:**
- Status: `200`
- Answer references diary or note content with clickable sources

---

### TC-AI-008 — Folder-Scoped RAG Chat

**Traces to:** SC-AI-004, US-AI-002 AC-3

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | Integration |
| Technique | EP |

**Input:** `{ message: "...", folderId: "engineering-folder" }`

**Expected Output:** Sources in response all belong to the specified folder

---

### TC-AI-009 — Viewer Cannot Use AI Chat

**Traces to:** SC-AI-005, US-AI-002 AC-6

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Security |

**Preconditions:** Viewer-role user authenticated

**Steps:** POST `/api/v1/ai/chat`

**Expected Output:** `403 FORBIDDEN`

---

### TC-AI-010 — In-Editor AI Generates Block Content

**Traces to:** SC-AI-006, US-AI-003 AC-2

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Happy Path |

**Preconditions:** Personal user; AI model configured (mocked)

**Input:** `{ prompt: "Write an introduction to microservices", pageId, cursorPosition }`

**Expected Output:**
- Status: `200`
- Response: `{ block: { type: "paragraph", data: { text: "..." } } }`

---

### TC-AI-011 — In-Editor AI Discard Restores Original Content

**Traces to:** SC-AI-006, US-AI-003 AC-4

| Attribute | Value |
|-----------|-------|
| Priority | P2 |
| Level | Frontend |
| Technique | State Transition |

**Steps:**
1. Invoke /ai, receive generated content
2. Click Discard

**Expected Output:** Editor content reverts to pre-generation state; no block added to DB

---

### TC-AI-012 — Free Tier Cannot Use In-Editor AI

**Traces to:** SC-AI-007, US-AI-003 AC-5

| Attribute | Value |
|-----------|-------|
| Priority | P1 |
| Level | API |
| Technique | Business Rule |

**Preconditions:** Free-tier user

**Steps:** POST `/api/v1/ai/editor/generate`

**Expected Output:** `403 { code: "PLAN_REQUIRED" }`
