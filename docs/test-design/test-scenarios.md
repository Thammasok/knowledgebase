# Test Scenarios — Knowledgebase GPT

**Traces to:** REQ-PLATFORM-001
**SUT:** docs/test-design/sut-definition.md
**Date:** 2026-03-28

---

## AUTH — Authentication

### SC-AUTH-001 — Successful Email/Password Registration

**Traces to:** US-AUTH-001, AC-1

| Field | Value |
|-------|-------|
| Scenario | New user registers with valid display name, email, and password |
| Preconditions | Email not already registered; system email service available |
| Expected | Account created (HTTP 201), verification email dispatched, user starts on Free tier |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-AUTH-001, TC-AUTH-002, TC-AUTH-003

---

### SC-AUTH-002 — Registration Blocked for Duplicate Email

**Traces to:** US-AUTH-001, AC-2

| Field | Value |
|-------|-------|
| Scenario | Duplicate email is rejected without creating a second account |
| Preconditions | An account already exists with the target email |
| Expected | HTTP 409 EMAIL_ALREADY_EXISTS; no new user record created |
| Priority | High |
| Type | Negative |

**Test Cases:** TC-AUTH-004

---

### SC-AUTH-003 — Registration Input Validation (BVA/EP)

**Traces to:** US-AUTH-001, AC-3, BC-1, BC-2

| Field | Value |
|-------|-------|
| Scenario | Invalid display name, email, and password inputs produce inline field errors |
| Preconditions | None |
| Expected | HTTP 400 with per-field error codes; no account created |
| Priority | High |
| Type | Boundary / Negative |

**Test Cases:** TC-AUTH-005 through TC-AUTH-016

---

### SC-AUTH-004 — Successful Email/Password Login

**Traces to:** US-AUTH-002, AC-1

| Field | Value |
|-------|-------|
| Scenario | Verified user logs in and receives access + refresh tokens |
| Preconditions | User registered and email verified |
| Expected | HTTP 200 with accessToken (15 min) + refreshToken (30 days); redirect to workspace |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-AUTH-017

---

### SC-AUTH-005 — Login with Invalid Credentials

**Traces to:** US-AUTH-002, AC-2

| Field | Value |
|-------|-------|
| Scenario | Wrong password or unknown email returns generic error (no information disclosure) |
| Preconditions | None |
| Expected | HTTP 401 with generic message "invalid email or password" |
| Priority | High |
| Type | Negative / Security |

**Test Cases:** TC-AUTH-018, TC-AUTH-019

---

### SC-AUTH-006 — Google OAuth Login / Registration

**Traces to:** US-AUTH-002, AC-3

| Field | Value |
|-------|-------|
| Scenario | New and returning users authenticate via Google OAuth |
| Preconditions | Google OAuth mock configured |
| Expected | New user: account created + redirect. Returning user: login + redirect |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-AUTH-020, TC-AUTH-021

---

### SC-AUTH-007 — Silent Token Refresh

**Traces to:** US-AUTH-002, AC-4

| Field | Value |
|-------|-------|
| Scenario | Expired access token is silently refreshed using refresh token |
| Preconditions | User has valid refresh token; access token is expired |
| Expected | New access token issued; original API call succeeds transparently |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-AUTH-022

---

### SC-AUTH-008 — Rate Limiting on Failed Login

**Traces to:** US-AUTH-002, BC-1

| Field | Value |
|-------|-------|
| Scenario | More than 10 failed login attempts per IP per minute triggers rate limit |
| Preconditions | None |
| Expected | HTTP 429 Too Many Requests after 10th failed attempt within 1 minute |
| Priority | Medium |
| Type | Security / Business Rule |

**Test Cases:** TC-AUTH-023

---

### SC-AUTH-009 — Verification Email Resend Rate Limit

**Traces to:** US-AUTH-001, BC-4

| Field | Value |
|-------|-------|
| Scenario | Maximum 3 verification resend requests per hour per email address |
| Preconditions | User registered but not verified |
| Expected | 4th request within 1 hour returns HTTP 429 |
| Priority | Medium |
| Type | Business Rule |

**Test Cases:** TC-AUTH-024

---

## WS — Workspace

### SC-WS-001 — Create Personal Workspace

**Traces to:** US-WS-001, AC-1, AC-2

| Field | Value |
|-------|-------|
| Scenario | Authenticated user creates a workspace with a valid name |
| Preconditions | User logged in; no existing workspace |
| Expected | Workspace created; user set as owner; slug auto-generated; empty sidebar shown |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-WS-001, TC-WS-002

---

### SC-WS-002 — Workspace Name Boundary Validation

**Traces to:** US-WS-001, BC-1

| Field | Value |
|-------|-------|
| Scenario | Workspace name BVA: 1 char (below min), 2 chars (min), 100 chars (max), 101 chars (above max) |
| Preconditions | User logged in |
| Expected | 2–100 chars accepted; outside range rejected with HTTP 400 |
| Priority | High |
| Type | Boundary |

**Test Cases:** TC-WS-003 through TC-WS-006

---

### SC-WS-003 — Free Tier Block Limit Enforcement

**Traces to:** US-WS-001, AC-3, BC-2

| Field | Value |
|-------|-------|
| Scenario | Free user's workspace has 1,000 blocks; adding one more is blocked |
| Preconditions | Free-tier user; workspace at exactly 1,000 blocks |
| Expected | HTTP 403 BLOCK_LIMIT_REACHED; block not created; upgrade prompt shown |
| Priority | High |
| Type | Business Rule |

**Test Cases:** TC-WS-007, TC-WS-008

---

### SC-WS-004 — Startup User Creates Shared Workspace

**Traces to:** US-WS-002, AC-1

| Field | Value |
|-------|-------|
| Scenario | Startup-tier user creates a shared workspace and can invite members |
| Preconditions | User on Startup tier |
| Expected | Workspace created with Owner role; invite flow available |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-WS-009

---

### SC-WS-005 — Non-Startup User Cannot Invite Members

**Traces to:** US-WS-002, AC-2

| Field | Value |
|-------|-------|
| Scenario | Free or Personal user attempts to invite a member |
| Preconditions | User on Free or Personal tier |
| Expected | HTTP 403 PLAN_REQUIRED; upgrade prompt shown |
| Priority | High |
| Type | Negative / Business Rule |

**Test Cases:** TC-WS-010, TC-WS-011

---

## COLLAB — Collaboration

### SC-COLLAB-001 — Owner Invites Team Member

**Traces to:** US-COLLAB-001, AC-1, AC-2

| Field | Value |
|-------|-------|
| Scenario | Owner sends invitation email to a new or existing user |
| Preconditions | Owner on Startup tier; target email not already a member |
| Expected | Invite email sent; user added to workspace with assigned role on acceptance |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-COLLAB-001, TC-COLLAB-002

---

### SC-COLLAB-002 — Duplicate Invitation Blocked

**Traces to:** US-COLLAB-001, AC-4

| Field | Value |
|-------|-------|
| Scenario | Owner tries to invite an email with a pending invite |
| Preconditions | Existing pending invite for target email |
| Expected | HTTP 409 PENDING_INVITE_EXISTS |
| Priority | Medium |
| Type | Negative |

**Test Cases:** TC-COLLAB-003

---

### SC-COLLAB-003 — Invitation Link Expiry

**Traces to:** US-COLLAB-001, BC-1

| Field | Value |
|-------|-------|
| Scenario | Invitee clicks accept link after 7 days |
| Preconditions | Invitation created 7+ days ago |
| Expected | HTTP 410 INVITE_EXPIRED; not added to workspace |
| Priority | Medium |
| Type | State / Boundary |

**Test Cases:** TC-COLLAB-004

---

### SC-COLLAB-004 — Owner Changes Member Role

**Traces to:** US-COLLAB-002, AC-1

| Field | Value |
|-------|-------|
| Scenario | Owner upgrades a Viewer to Member and downgrades a Member to Viewer |
| Preconditions | Workspace has both Member and Viewer |
| Expected | Role updated immediately; permissions change reflected on next request |
| Priority | High |
| Type | Functional / State |

**Test Cases:** TC-COLLAB-005, TC-COLLAB-006

---

### SC-COLLAB-005 — Viewer Access Enforcement

**Traces to:** US-COLLAB-002, AC-3, AC-4, BC-3

| Field | Value |
|-------|-------|
| Scenario | Viewer attempts to create content and access AI features |
| Preconditions | User has Viewer role in workspace |
| Expected | HTTP 403 FORBIDDEN on all write operations; AI chat input disabled |
| Priority | High |
| Type | Security / Business Rule |

**Test Cases:** TC-COLLAB-007, TC-COLLAB-008

---

### SC-COLLAB-006 — Owner Cannot Remove Themselves

**Traces to:** US-COLLAB-002, BC-2

| Field | Value |
|-------|-------|
| Scenario | Owner attempts to remove themselves from workspace |
| Preconditions | Single owner workspace |
| Expected | HTTP 400 OWNER_CANNOT_REMOVE_SELF; ownership transfer prompt shown |
| Priority | Medium |
| Type | Business Rule |

**Test Cases:** TC-COLLAB-009

---

## ORG — Content Organization

### SC-ORG-001 — Create Folder and Nested Page

**Traces to:** US-ORG-001, US-PAGE-001, AC-1, AC-2

| Field | Value |
|-------|-------|
| Scenario | User creates a folder, then a page inside it |
| Preconditions | User authenticated with write access |
| Expected | Folder appears in sidebar; page nested under folder |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-ORG-001, TC-ORG-002

---

### SC-ORG-002 — Folder Nesting Depth Limit

**Traces to:** US-ORG-001, BC-2

| Field | Value |
|-------|-------|
| Scenario | User attempts to create a 4th-level nested folder (workspace→folder→sub→sub-sub) |
| Preconditions | 3-level folder hierarchy exists |
| Expected | HTTP 400 MAX_NESTING_DEPTH; 4th-level folder not created |
| Priority | Medium |
| Type | Boundary / Business Rule |

**Test Cases:** TC-ORG-003

---

### SC-ORG-003 — Sub-Page Nesting Depth Limit

**Traces to:** US-PAGE-001, BC-2

| Field | Value |
|-------|-------|
| Scenario | User attempts to create a 6th-level sub-page |
| Preconditions | 5-level page hierarchy exists |
| Expected | HTTP 400 MAX_NESTING_DEPTH; 6th-level page not created |
| Priority | Medium |
| Type | Boundary |

**Test Cases:** TC-ORG-004

---

### SC-ORG-004 — Page Auto-Save

**Traces to:** US-PAGE-001, AC-2, BC-1

| Field | Value |
|-------|-------|
| Scenario | Page content is persisted after 2-second debounce following edits |
| Preconditions | User on page with existing content |
| Expected | Changes persisted after 2s idle; navigating away and returning shows latest content |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-ORG-005

---

### SC-ORG-005 — Free Tier Block Limit on Page Edit

**Traces to:** US-PAGE-001, AC-4

| Field | Value |
|-------|-------|
| Scenario | Free user tries to add a block when workspace is at 1,000 block limit |
| Preconditions | Free user; workspace at 1,000 blocks |
| Expected | Block not added; HTTP 403 BLOCK_LIMIT_REACHED; upgrade prompt |
| Priority | High |
| Type | Business Rule |

**Test Cases:** TC-ORG-006

---

## DIARY — Diary Entries

### SC-DIARY-001 — Create Diary Entry (Personal/Startup)

**Traces to:** US-DIARY-001, AC-1, AC-2

| Field | Value |
|-------|-------|
| Scenario | Personal/Startup user creates a diary entry for today and retrieves a past entry |
| Preconditions | User on Personal or Startup tier |
| Expected | Entry created for selected date; past entries retrievable by date |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-DIARY-001, TC-DIARY-002

---

### SC-DIARY-002 — One Entry Per Date Per User

**Traces to:** US-DIARY-001, AC-3, BC-1

| Field | Value |
|-------|-------|
| Scenario | User attempts to create a second diary entry for a date that already has one |
| Preconditions | Diary entry already exists for today |
| Expected | Redirect to existing entry; no duplicate created |
| Priority | Medium |
| Type | Business Rule |

**Test Cases:** TC-DIARY-003

---

### SC-DIARY-003 — Free Tier Blocked from Diary

**Traces to:** US-DIARY-001, AC-4, BC-4

| Field | Value |
|-------|-------|
| Scenario | Free-tier user navigates to Diary section |
| Preconditions | User on Free tier |
| Expected | Upgrade prompt shown; create entry action unavailable |
| Priority | High |
| Type | Business Rule |

**Test Cases:** TC-DIARY-004

---

### SC-DIARY-004 — Diary Entries Private to Owner

**Traces to:** US-DIARY-001, BC-3

| Field | Value |
|-------|-------|
| Scenario | Workspace Member or Viewer cannot see another user's diary entries |
| Preconditions | Startup workspace; Owner has diary entries |
| Expected | Other members cannot read or list Owner's diary entries (HTTP 403 or empty response) |
| Priority | High |
| Type | Security |

**Test Cases:** TC-DIARY-005

---

## FILE — File Upload

### SC-FILE-001 — Upload Supported File Within Size Limit

**Traces to:** US-FILE-001, AC-1

| Field | Value |
|-------|-------|
| Scenario | User uploads a PDF within tier size limit; file appears in library |
| Preconditions | User authenticated |
| Expected | HTTP 200; file appears in file library; processing initiated |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-FILE-001, TC-FILE-002

---

### SC-FILE-002 — Upload Unsupported File Type

**Traces to:** US-FILE-001, AC-2, BC-1

| Field | Value |
|-------|-------|
| Scenario | User uploads a `.exe` or `.zip` file |
| Preconditions | User authenticated |
| Expected | HTTP 400 UNSUPPORTED_FILE_TYPE; error lists supported formats |
| Priority | High |
| Type | Negative |

**Test Cases:** TC-FILE-003

---

### SC-FILE-003 — File Exceeds Tier Size Limit

**Traces to:** US-FILE-001, AC-3, BC-2

| Field | Value |
|-------|-------|
| Scenario | Free user uploads a 6MB file (exceeds 5MB limit); Personal user uploads a 101MB file |
| Preconditions | Free user; file > 5MB |
| Expected | HTTP 400 FILE_TOO_LARGE |
| Priority | High |
| Type | Boundary / Business Rule |

**Test Cases:** TC-FILE-004, TC-FILE-005

---

### SC-FILE-004 — RAG Indexing After File Upload

**Traces to:** US-FILE-001, AC-4, AC-5, BC-3

| Field | Value |
|-------|-------|
| Scenario | PDF and image uploads differ: PDF text is indexed; image is not |
| Preconditions | User authenticated; Qdrant available |
| Expected | PDF: text extracted and chunked into Qdrant within 60s. Image: stored, not indexed |
| Priority | High |
| Type | Integration |

**Test Cases:** TC-FILE-006, TC-FILE-007

---

## LINK — Link Management

### SC-LINK-001 — Free User Saves Bookmark

**Traces to:** US-LINK-001, AC-1, AC-2

| Field | Value |
|-------|-------|
| Scenario | Free user saves a valid HTTP/HTTPS URL as a bookmark |
| Preconditions | Free-tier user |
| Expected | Link saved with URL and date; no content crawled; "Personal plan" indicator shown |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-LINK-001

---

### SC-LINK-002 — Free User Blocked from Content Fetch

**Traces to:** US-LINK-001, AC-3

| Field | Value |
|-------|-------|
| Scenario | Free user attempts to trigger manual content fetch on a saved link |
| Preconditions | Link saved; user on Free tier |
| Expected | HTTP 403 PLAN_REQUIRED |
| Priority | High |
| Type | Business Rule |

**Test Cases:** TC-LINK-002

---

### SC-LINK-003 — Personal User Saves Link with Content Fetch

**Traces to:** US-LINK-002, AC-1, AC-2

| Field | Value |
|-------|-------|
| Scenario | Personal/Startup user saves a URL; system crawls and indexes content |
| Preconditions | User on Personal or Startup tier; URL reachable |
| Expected | Title, description, and body extracted; content chunked into Qdrant |
| Priority | High |
| Type | Functional / Integration |

**Test Cases:** TC-LINK-003, TC-LINK-004

---

### SC-LINK-004 — Crawl Failure Handling

**Traces to:** US-LINK-002, AC-3

| Field | Value |
|-------|-------|
| Scenario | System cannot reach the target URL during crawl |
| Preconditions | URL unreachable (mocked) |
| Expected | Link saved with `crawl_failed` status; user can retry manually |
| Priority | Medium |
| Type | Negative / Integration |

**Test Cases:** TC-LINK-005

---

### SC-LINK-005 — Link Auto-Refresh Rate Limiting

**Traces to:** US-LINK-002, BC-5

| Field | Value |
|-------|-------|
| Scenario | User attempts manual re-crawl within 1 hour of previous crawl |
| Preconditions | Link crawled within the last hour |
| Expected | HTTP 429 RECRAWL_TOO_SOON |
| Priority | Low |
| Type | Business Rule |

**Test Cases:** TC-LINK-006

---

## VERSION — Version History

### SC-VERSION-001 — View and Restore Version History

**Traces to:** US-VERSION-001, AC-1, AC-2

| Field | Value |
|-------|-------|
| Scenario | Personal user views version list and restores a past version |
| Preconditions | User on Personal/Startup tier; page has multiple saved versions |
| Expected | Version list shows timestamps + author; restore replaces content and creates new snapshot |
| Priority | High |
| Type | Functional / State |

**Test Cases:** TC-VERSION-001, TC-VERSION-002

---

### SC-VERSION-002 — Free Tier Blocked from Version History

**Traces to:** US-VERSION-001, AC-3

| Field | Value |
|-------|-------|
| Scenario | Free user navigates to version history for a page |
| Preconditions | User on Free tier |
| Expected | Upgrade prompt shown; version list not accessible |
| Priority | High |
| Type | Business Rule |

**Test Cases:** TC-VERSION-003

---

## SEARCH — Semantic Search

### SC-SEARCH-001 — Semantic Search Returns Relevant Results

**Traces to:** US-SEARCH-001, AC-1, AC-2

| Field | Value |
|-------|-------|
| Scenario | User searches by meaning; results ranked by vector similarity |
| Preconditions | Workspace has indexed content; Qdrant available |
| Expected | Up to 20 results returned, ordered by similarity; each shows type, title, excerpt, link |
| Priority | High |
| Type | Functional / Integration |

**Test Cases:** TC-SEARCH-001

---

### SC-SEARCH-002 — Search Scope by Tier

**Traces to:** US-SEARCH-001, AC-3, AC-4, BC-2

| Field | Value |
|-------|-------|
| Scenario | Free user cannot get link content in search; Personal/Startup user can |
| Preconditions | Workspace with notes, files, and indexed link content |
| Expected | Free: no link results. Personal/Startup: link content included |
| Priority | High |
| Type | Business Rule |

**Test Cases:** TC-SEARCH-002, TC-SEARCH-003

---

## AI — Artificial Intelligence

### SC-AI-001 — Free Tier Uses Built-in AI Chat

**Traces to:** US-AI-FREE-001, AC-1, AC-2, AC-3

| Field | Value |
|-------|-------|
| Scenario | Free user asks a question; system uses platform-managed model; sources shown |
| Preconditions | Free tier; notes and files indexed |
| Expected | Answer with clickable source references; conversation history persisted |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-AI-001, TC-AI-002

---

### SC-AI-002 — BYOK AI Configuration (Personal/Startup)

**Traces to:** US-AI-001, AC-1, AC-2, AC-3

| Field | Value |
|-------|-------|
| Scenario | User configures OpenAI, Gemini, Anthropic, or Ollama with valid/invalid keys |
| Preconditions | User on Personal or Startup tier |
| Expected | Valid key: saved + confirmed via test call. Invalid key: HTTP 400 KEY_VALIDATION_FAILED |
| Priority | High |
| Type | Functional / Negative |

**Test Cases:** TC-AI-003, TC-AI-004, TC-AI-005

---

### SC-AI-003 — API Keys Never Exposed in Responses

**Traces to:** US-AI-001, BC-1

| Field | Value |
|-------|-------|
| Scenario | API key stored encrypted; never returned in any API response |
| Preconditions | User has saved API key |
| Expected | GET /ai/settings response omits or masks the raw API key |
| Priority | High |
| Type | Security |

**Test Cases:** TC-AI-006

---

### SC-AI-004 — Full RAG Chat (Personal/Startup)

**Traces to:** US-AI-002, AC-1, AC-2, AC-3

| Field | Value |
|-------|-------|
| Scenario | Personal user queries across all content; scoped query by folder |
| Preconditions | User on Personal tier with all content types indexed |
| Expected | Answer uses diary + links + notes + files; folder-scope query limits results |
| Priority | High |
| Type | Functional / Integration |

**Test Cases:** TC-AI-007, TC-AI-008

---

### SC-AI-005 — Viewer Blocked from AI Chat

**Traces to:** US-AI-002, AC-6, BC-5

| Field | Value |
|-------|-------|
| Scenario | Viewer navigates to AI chat page |
| Preconditions | User has Viewer role |
| Expected | Chat input disabled; access denied message shown |
| Priority | High |
| Type | Security / Business Rule |

**Test Cases:** TC-AI-009

---

### SC-AI-006 — In-Editor AI Generation

**Traces to:** US-AI-003, AC-1, AC-2, AC-4

| Field | Value |
|-------|-------|
| Scenario | Personal user invokes /ai in editor; content generated and inserted as block |
| Preconditions | User on Personal/Startup; AI model configured |
| Expected | Generation prompt appears; output inserted as Editor.js block; discard restores original |
| Priority | High |
| Type | Functional |

**Test Cases:** TC-AI-010, TC-AI-011

---

### SC-AI-007 — Free Tier Blocked from In-Editor AI

**Traces to:** US-AI-003, AC-5

| Field | Value |
|-------|-------|
| Scenario | Free user invokes /ai command in editor |
| Preconditions | User on Free tier |
| Expected | Upgrade prompt shown; command blocked |
| Priority | High |
| Type | Business Rule |

**Test Cases:** TC-AI-012
