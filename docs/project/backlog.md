# Project Backlog — Knowledgebase GPT (Phase 2 & 3)

**Traces to:** REQ-PLATFORM-001, docs/test-design/test-scenarios.md, docs/test-design/test-cases.md
**Date:** 2026-03-28
**Scope:** Phase 2 (Content, Collaboration, Search) + Phase 3 (AI)
**Phase 1 status:** ✅ Done — Auth, Account, Workspace CRUD, Auth Sessions

> **Note on test case alignment:** TC-AUTH-001 through TC-AUTH-024 reference the original design
> (e.g., `/auth/register`, token-based email verification). The actual Phase 1 implementation uses
> `/auth/signup` and Redis OTP. Test cases need to be updated to match the actual endpoints before
> the ai-orchestrator runs them. Flag this to the tester before Iteration 1 test automation.

---

## 1. Artifact Inventory

| ID | Type | Title | Priority | Source |
|----|------|-------|----------|--------|
| US-AUTH-001 | User Story | Email/password registration | Must Have | business-analysis |
| US-AUTH-002 | User Story | Login + token management | Must Have | business-analysis |
| US-WS-001 | User Story | Create personal workspace | Must Have | business-analysis |
| US-WS-002 | User Story | Startup shared workspace | Must Have | business-analysis |
| US-COLLAB-001 | User Story | Owner invites team member | Must Have | business-analysis |
| US-COLLAB-002 | User Story | Owner manages member roles | Must Have | business-analysis |
| US-ORG-001 | User Story | Create folder and nested page | Must Have | business-analysis |
| US-PAGE-001 | User Story | Edit page with Editor.js blocks | Must Have | business-analysis |
| US-DIARY-001 | User Story | Create/view diary entries | Should Have | business-analysis |
| US-FILE-001 | User Story | Upload file + RAG indexing | Must Have | business-analysis |
| US-LINK-001 | User Story | Save URL as bookmark (Free) | Must Have | business-analysis |
| US-LINK-002 | User Story | Fetch + index link content (Personal/Startup) | Should Have | business-analysis |
| US-VERSION-001 | User Story | View and restore version history | Should Have | business-analysis |
| US-SEARCH-001 | User Story | Semantic search across workspace | Must Have | business-analysis |
| US-AI-FREE-001 | User Story | Free tier uses built-in AI chat | Must Have | business-analysis |
| US-AI-001 | User Story | Configure BYOK AI model | Should Have | business-analysis |
| US-AI-002 | User Story | Full RAG chat (Personal/Startup) | Should Have | business-analysis |
| US-AI-003 | User Story | In-editor AI generation | Should Have | business-analysis |
| SC-WS-001 to SC-WS-005 | Test Scenarios | Workspace scenarios | High | software-tester-design |
| SC-COLLAB-001 to SC-COLLAB-006 | Test Scenarios | Collaboration scenarios | High | software-tester-design |
| SC-ORG-001 to SC-ORG-005 | Test Scenarios | Content organization scenarios | High | software-tester-design |
| SC-DIARY-001 to SC-DIARY-004 | Test Scenarios | Diary scenarios | Medium | software-tester-design |
| SC-FILE-001 to SC-FILE-004 | Test Scenarios | File upload scenarios | High | software-tester-design |
| SC-LINK-001 to SC-LINK-005 | Test Scenarios | Link scenarios | High | software-tester-design |
| SC-VERSION-001 to SC-VERSION-002 | Test Scenarios | Version history scenarios | Medium | software-tester-design |
| SC-SEARCH-001 to SC-SEARCH-002 | Test Scenarios | Semantic search scenarios | High | software-tester-design |
| SC-AI-001 to SC-AI-007 | Test Scenarios | AI scenarios | High | software-tester-design |
| TC-WS-001 to TC-WS-011 | Test Cases | Workspace test cases | P1/P2 | software-tester-design |
| TC-COLLAB-001 to TC-COLLAB-009 | Test Cases | Collaboration test cases | P1/P2 | software-tester-design |
| TC-ORG-001 to TC-ORG-006 | Test Cases | Content org test cases | P1/P2 | software-tester-design |
| TC-DIARY-001 to TC-DIARY-005 | Test Cases | Diary test cases | P1/P2 | software-tester-design |
| TC-FILE-001 to TC-FILE-007 | Test Cases | File upload test cases | P1/P2 | software-tester-design |
| TC-LINK-001 to TC-LINK-006 | Test Cases | Link test cases | P1/P2 | software-tester-design |
| TC-VERSION-001 to TC-VERSION-003 | Test Cases | Version history test cases | P1/P2 | software-tester-design |
| TC-SEARCH-001 to TC-SEARCH-003 | Test Cases | Search test cases | P1/P2 | software-tester-design |
| TC-AI-001 to TC-AI-012 | Test Cases | AI test cases | P1/P2 | software-tester-design |

---

## 2. Backlog

### EPIC-TIER-001: Tier & Permission Foundation

> Cross-cutting concern — must ship first. All tier-gated features depend on this.

| Story ID | Title | Priority | Linked FR | Linked TC |
|----------|-------|----------|-----------|-----------|
| US-WS-001 | Free tier block limit enforcement | Must Have | FR-TIER-001, FR-TIER-002 | TC-WS-007, TC-WS-008 |
| US-WS-002 | Startup shared workspace + invite gate | Must Have | FR-TIER-003, FR-WS-002 | TC-WS-009, TC-WS-010, TC-WS-011 |

---

### EPIC-CONTENT-001: Content Organization (Folders + Pages)

| Story ID | Title | Priority | Linked SC | Linked TC |
|----------|-------|----------|-----------|-----------|
| US-ORG-001 | Create folder and nested page | Must Have | SC-ORG-001, SC-ORG-002 | TC-ORG-001, TC-ORG-002, TC-ORG-003 |
| US-PAGE-001 | Edit page with Editor.js blocks | Must Have | SC-ORG-003, SC-ORG-004, SC-ORG-005 | TC-ORG-004, TC-ORG-005, TC-ORG-006 |

---

### EPIC-COLLAB-001: Team Collaboration (Startup Tier)

| Story ID | Title | Priority | Linked SC | Linked TC |
|----------|-------|----------|-----------|-----------|
| US-COLLAB-001 | Owner invites team member | Must Have | SC-COLLAB-001, SC-COLLAB-002, SC-COLLAB-003 | TC-COLLAB-001, TC-COLLAB-002, TC-COLLAB-003, TC-COLLAB-004 |
| US-COLLAB-002 | Owner manages member roles | Must Have | SC-COLLAB-004, SC-COLLAB-005, SC-COLLAB-006 | TC-COLLAB-005, TC-COLLAB-006, TC-COLLAB-007, TC-COLLAB-008, TC-COLLAB-009 |

---

### EPIC-DIARY-001: Diary Entries (Personal/Startup)

| Story ID | Title | Priority | Linked SC | Linked TC |
|----------|-------|----------|-----------|-----------|
| US-DIARY-001 | Create and view private diary entries | Should Have | SC-DIARY-001, SC-DIARY-002, SC-DIARY-003, SC-DIARY-004 | TC-DIARY-001 through TC-DIARY-005 |

---

### EPIC-VERSION-001: Version History (Personal/Startup)

| Story ID | Title | Priority | Linked SC | Linked TC |
|----------|-------|----------|-----------|-----------|
| US-VERSION-001 | View and restore version history | Should Have | SC-VERSION-001, SC-VERSION-002 | TC-VERSION-001 through TC-VERSION-003 |

---

### EPIC-FILE-001: File Upload & Indexing

| Story ID | Title | Priority | Linked SC | Linked TC |
|----------|-------|----------|-----------|-----------|
| US-FILE-001 | Upload files + RAG indexing for supported types | Must Have | SC-FILE-001, SC-FILE-002, SC-FILE-003, SC-FILE-004 | TC-FILE-001 through TC-FILE-007 |

---

### EPIC-LINK-001: Link Management & Crawling

| Story ID | Title | Priority | Linked SC | Linked TC |
|----------|-------|----------|-----------|-----------|
| US-LINK-001 | Free user saves bookmark | Must Have | SC-LINK-001, SC-LINK-002 | TC-LINK-001, TC-LINK-002 |
| US-LINK-002 | Personal user fetches + indexes link content | Should Have | SC-LINK-003, SC-LINK-004, SC-LINK-005 | TC-LINK-003, TC-LINK-004, TC-LINK-005, TC-LINK-006 |

---

### EPIC-SEARCH-001: Semantic Search

| Story ID | Title | Priority | Linked SC | Linked TC |
|----------|-------|----------|-----------|-----------|
| US-SEARCH-001 | Semantic search across workspace content | Must Have | SC-SEARCH-001, SC-SEARCH-002 | TC-SEARCH-001, TC-SEARCH-002, TC-SEARCH-003 |

---

### EPIC-AI-001: AI Features

| Story ID | Title | Priority | Linked SC | Linked TC |
|----------|-------|----------|-----------|-----------|
| US-AI-FREE-001 | Free tier built-in AI chat | Must Have | SC-AI-001 | TC-AI-001, TC-AI-002 |
| US-AI-001 | Configure BYOK AI model | Should Have | SC-AI-002, SC-AI-003 | TC-AI-003, TC-AI-004, TC-AI-005, TC-AI-006 |
| US-AI-002 | Full RAG chat across all content | Should Have | SC-AI-004, SC-AI-005 | TC-AI-007, TC-AI-008, TC-AI-009 |
| US-AI-003 | In-editor AI generation | Should Have | SC-AI-006, SC-AI-007 | TC-AI-010, TC-AI-011, TC-AI-012 |

---

## 3. Developer Task Breakdown

---

### EPIC-TIER-001 Tasks

```
DEV-TIER-001
Title:       Add tier field to Accounts model + migration
Story:       US-WS-001, US-WS-002
Layer:       DB
Description: Add `tier` enum (free | personal | startup) to the `Accounts` model.
             Default: `free`. Add Prisma migration. No tier upgrade logic yet —
             just the data field needed for gate checks.

Acceptance Check:
  - Migration applies cleanly; existing accounts default to `free`
  - Enum enforced at DB level

Dependencies:
  - Blocked by: —
  - Blocks: DEV-TIER-003, DEV-TIER-004, all tier-gated feature tasks

Complexity: S
```

```
DEV-TIER-002
Title:       Add blockCount to Workspace model + migration
Story:       US-WS-001 (AC-3)
Layer:       DB
Description: Add `blockCount` integer column (default 0) to `Workspace` model.
             This is the authoritative counter for the Free tier 1,000-block limit
             (see ADR-002-block-quota-counter.md).

Acceptance Check:
  - Migration applies cleanly; existing workspaces default to 0
  - Column is non-nullable with default 0

Dependencies:
  - Blocked by: —
  - Blocks: DEV-TIER-004

Complexity: S
```

```
DEV-TIER-003
Title:       TierGuard middleware — enforce tier-gated feature access
Story:       US-WS-002, US-DIARY-001, US-VERSION-001, US-LINK-002, US-AI-001
Layer:       API
Description: Create `tierGuard(requiredTier: 'personal' | 'startup')` middleware.
             Reads `req.account.tier` (set by authAccessMiddleware). Returns
             403 PLAN_REQUIRED if account tier is below the required level.
             Applied on routes for: diary, version history, link crawl, BYOK settings,
             workspace member invite (startup only).

Acceptance Check:
  - TC-WS-010 passes (Personal user blocked from invite)
  - TC-WS-011 passes (Free user blocked from invite)
  - TC-DIARY-004 passes (Free blocked from diary)
  - TC-VERSION-003 passes (Free blocked from version history)

Dependencies:
  - Blocked by: DEV-TIER-001
  - Blocks: DEV-COLLAB-002, DEV-DIARY-002, DEV-VERSION-003, DEV-LINK-005, DEV-AI-004

Complexity: M
```

```
DEV-TIER-004
Title:       BlockQuota service — enforce 1,000-block limit on Free tier
Story:       US-WS-001 (AC-3, BC-2), US-PAGE-001 (AC-4)
Layer:       Domain
Description: Create `BlockQuotaService.increment(workspaceId)` that:
             1. Reads workspace.blockCount and workspace owner's tier
             2. If tier === 'free' and blockCount >= 1000: throws BLOCK_LIMIT_REACHED
             3. Otherwise: increments blockCount atomically (Prisma transaction)
             Call this on every block add operation (page content update adds blocks).

Acceptance Check:
  - TC-WS-007 passes (at 1,000 blocks — blocked)
  - TC-WS-008 passes (upgrade prompt data returned)
  - TC-ORG-006 passes (Free user blocked on page edit at limit)

Dependencies:
  - Blocked by: DEV-TIER-001, DEV-TIER-002
  - Blocks: DEV-CONTENT-005

Complexity: M
```

```
DEV-TIER-005
Title:       Frontend: UpgradeBanner + PlanGate component
Story:       US-WS-001, US-WS-002, US-DIARY-001, US-VERSION-001
Layer:       Frontend
Description: Create two reusable components:
             - `<PlanGate requiredTier="personal|startup">` — wraps content that
               should show upgrade prompt when tier is insufficient
             - `<UpgradeBanner feature="..." />` — displays upgrade call-to-action
             Add global tier context (read from auth store) so components know current tier.

Acceptance Check:
  - Upgrade prompt renders when Free user navigates to diary or version history
  - Component is reusable across all gated features

Dependencies:
  - Blocked by: —
  - Blocks: DEV-DIARY-008, DEV-VERSION-005

Complexity: S
```

---

### EPIC-CONTENT-001 Tasks

```
DEV-CONTENT-001
Title:       Folder schema + migration
Story:       US-ORG-001
Layer:       DB
Description: Add `Folder` model:
             - id: ULID PK
             - workspaceId: FK → Workspace
             - parentId: FK → Folder (nullable, self-referencing)
             - name: String (1–255)
             - depth: Int (computed on create; root = 0)
             - order: Int (sidebar ordering)
             - isRemove: Boolean (soft delete)
             - createdAt, updatedAt
             Index on (workspaceId, parentId) for sidebar tree queries.

Acceptance Check:
  - Migration applies cleanly
  - Self-referencing FK enforced
  - TC-ORG-001 (folder creation) can be exercised against DB

Dependencies:
  - Blocked by: DEV-TIER-001 (tier enforcement needed for workspace context)
  - Blocks: DEV-CONTENT-003

Complexity: S
```

```
DEV-CONTENT-002
Title:       Page schema + migration
Story:       US-PAGE-001
Layer:       DB
Description: Add `Page` model:
             - id: ULID PK
             - workspaceId: FK → Workspace
             - folderId: FK → Folder (nullable)
             - parentPageId: FK → Page (nullable, self-referencing)
             - title: String (max 500)
             - content: Json (Editor.js block array)
             - depth: Int (sub-page depth; root = 0)
             - order: Int
             - isRemove: Boolean
             - createdAt, updatedAt
             Index on (workspaceId, folderId), (workspaceId, parentPageId).

Acceptance Check:
  - Migration applies cleanly
  - Self-referencing FK enforced
  - JSON content column accepts Editor.js block array

Dependencies:
  - Blocked by: DEV-CONTENT-001
  - Blocks: DEV-CONTENT-004, DEV-CONTENT-005, DEV-VERSION-001

Complexity: M
```

```
DEV-CONTENT-003
Title:       Folders API — GET/POST/PATCH/DELETE /workspace/:id/folders
Story:       US-ORG-001
Layer:       API
Description: Implement four folder endpoints:
             - GET /workspace/:id/folders — return tree structure (nested children)
             - POST /workspace/:id/folders — create folder (body: name, parentId?)
             - PATCH /workspace/:id/folders/:folderId — update name/order
             - DELETE /workspace/:id/folders/:folderId — soft delete (isRemove=true),
               cascade soft-delete child folders and pages
             All protected by authAccessMiddleware. Owner or Member can write;
             Viewer returns 403 on writes.

Acceptance Check:
  - TC-ORG-001 passes (folder created, appears in sidebar list)
  - TC-ORG-003 passes (4th-level folder rejected — DEV-CONTENT-006 enforces this)
  - GET returns nested tree correctly

Dependencies:
  - Blocked by: DEV-CONTENT-001, DEV-COLLAB-007
  - Blocks: DEV-CONTENT-008

Complexity: M
```

```
DEV-CONTENT-004
Title:       Pages API — GET/POST/PATCH/DELETE /workspace/:id/pages
Story:       US-ORG-001, US-PAGE-001
Layer:       API
Description: Implement page endpoints:
             - GET /workspace/:id/pages — list pages (flat list with parentPageId for tree)
             - GET /workspace/:id/pages/:pageId — get page with content
             - POST /workspace/:id/pages — create page (body: title, folderId?, parentPageId?)
             - PATCH /workspace/:id/pages/:pageId — update title or metadata
             - DELETE /workspace/:id/pages/:pageId — soft delete
             Content update (blocks) handled by DEV-CONTENT-005 separately.

Acceptance Check:
  - TC-ORG-002 passes (page created under folder)
  - TC-ORG-004 passes (6th-level sub-page rejected)
  - Page appears in sidebar after creation

Dependencies:
  - Blocked by: DEV-CONTENT-002
  - Blocks: DEV-CONTENT-008, DEV-VERSION-001

Complexity: M
```

```
DEV-CONTENT-005
Title:       Page content update — PATCH /pages/:id/content with block quota
Story:       US-PAGE-001 (AC-1, AC-4)
Layer:       API + Domain
Description: Separate endpoint PATCH /workspace/:id/pages/:pageId/content.
             Body: { blocks: Editor.js block array }.
             On receive:
             1. Compute delta (newBlockCount - oldBlockCount)
             2. Call BlockQuotaService.increment(workspaceId, delta) — throws 403 if Free limit hit
             3. Persist content JSON and update blockCount
             4. On success, trigger version snapshot (DEV-VERSION-002) async
             5. On success, trigger Qdrant indexing (DEV-SEARCH-002) async

Acceptance Check:
  - TC-ORG-005 passes (auto-save: content persisted within 2s debounce)
  - TC-ORG-006 passes (Free user at 1,000 blocks cannot add more)
  - TC-WS-007 passes (block limit enforced)

Dependencies:
  - Blocked by: DEV-CONTENT-004, DEV-TIER-004
  - Blocks: DEV-CONTENT-010, DEV-VERSION-002, DEV-SEARCH-003

Complexity: M
```

```
DEV-CONTENT-006
Title:       Folder nesting depth validation (max 3 levels)
Story:       US-ORG-001 (BC-2)
Layer:       Domain
Description: In the folder creation service, traverse parentId chain up to root.
             If depth would exceed 3 levels (workspace → folder → sub → sub-sub),
             return 400 MAX_NESTING_DEPTH.
             Store computed depth on the Folder record for efficient future checks.

Acceptance Check:
  - TC-ORG-003 passes (4th-level folder rejected with MAX_NESTING_DEPTH)

Dependencies:
  - Blocked by: DEV-CONTENT-003
  - Blocks: —

Complexity: S
```

```
DEV-CONTENT-007
Title:       Page nesting depth validation (max 5 levels)
Story:       US-PAGE-001 (BC-2)
Layer:       Domain
Description: In the page creation service, traverse parentPageId chain up to root.
             If depth would exceed 5 levels, return 400 MAX_NESTING_DEPTH.
             Store depth on the Page record.

Acceptance Check:
  - TC-ORG-004 passes (6th-level sub-page rejected)

Dependencies:
  - Blocked by: DEV-CONTENT-004
  - Blocks: —

Complexity: S
```

```
DEV-CONTENT-008
Title:       Frontend: Sidebar with folder/page hierarchy
Story:       US-ORG-001, US-PAGE-001
Layer:       Frontend
Description: Build collapsible sidebar tree:
             - Fetch folder + page tree from API on workspace load
             - Render folders with expand/collapse toggle
             - Render pages nested under folders or as root pages
             - "+ New Folder" and "+ New Page" inline actions
             - Keyboard navigation between items
             - Show upgrade prompt in place of diary/version buttons for Free tier
             State managed in Zustand workspace store.

Acceptance Check:
  - Folder and page created via API appear immediately in sidebar (optimistic update)
  - Navigating to a page loads the correct content in editor

Dependencies:
  - Blocked by: DEV-CONTENT-003, DEV-CONTENT-004, DEV-TIER-005
  - Blocks: DEV-CONTENT-009

Complexity: L
```

```
DEV-CONTENT-009
Title:       Frontend: Editor.js page editor
Story:       US-PAGE-001 (AC-1, AC-2)
Layer:       Frontend
Description: Integrate Editor.js in the page view:
             - Initialize with existing page content (JSON blocks)
             - Support block types: paragraph, heading (H1–H3), bulleted list,
               numbered list, checklist, quote, code, image, divider
             - On change: trigger 2-second debounce timer (DEV-CONTENT-010)
             - Show "Saving..." / "Saved" status indicator
             - Page title editable inline (separate from content)

Acceptance Check:
  - TC-ORG-005 passes (content persisted after 2s idle)
  - Page content renders correctly after reload

Dependencies:
  - Blocked by: DEV-CONTENT-008
  - Blocks: DEV-CONTENT-010, DEV-AI-013

Complexity: L
```

```
DEV-CONTENT-010
Title:       Frontend: Auto-save debounce (2s → PATCH /pages/:id/content)
Story:       US-PAGE-001 (AC-2, BC-1)
Layer:       Frontend
Description: After each editor change event, reset a 2-second debounce timer.
             When timer fires: call PATCH /workspace/:id/pages/:pageId/content.
             Handle 403 BLOCK_LIMIT_REACHED: pause saving, show upgrade banner,
             revert the last block addition in editor.

Acceptance Check:
  - TC-ORG-005 passes (changes persisted; navigating away and back shows latest)
  - Block limit hit: user sees upgrade prompt; editor reverts the blocked block

Dependencies:
  - Blocked by: DEV-CONTENT-009, DEV-CONTENT-005
  - Blocks: —

Complexity: S
```

---

### EPIC-VERSION-001 Tasks

```
DEV-VERSION-001
Title:       PageVersion schema + migration
Story:       US-VERSION-001
Layer:       DB
Description: Add `PageVersion` model:
             - id: ULID PK
             - pageId: FK → Page
             - accountId: FK → Accounts (snapshot author)
             - content: Json (full Editor.js block snapshot at save time)
             - createdAt: DateTime
             Index on (pageId, createdAt DESC) for efficient version listing.

Acceptance Check:
  - Migration applies cleanly
  - Version records created on page save (via DEV-VERSION-002)

Dependencies:
  - Blocked by: DEV-CONTENT-002
  - Blocks: DEV-VERSION-002, DEV-VERSION-003

Complexity: S
```

```
DEV-VERSION-002
Title:       Snapshot service — save version on page content update
Story:       US-VERSION-001 (AC-1)
Layer:       Domain
Description: After every successful PATCH /pages/:id/content, asynchronously create
             a PageVersion snapshot. Only triggered for Personal/Startup tier accounts
             (tier check via workspace owner's tier). Keep last 50 snapshots per page;
             prune older ones.

Acceptance Check:
  - TC-VERSION-001 passes (version list shows multiple snapshots with timestamps)

Dependencies:
  - Blocked by: DEV-VERSION-001, DEV-CONTENT-005, DEV-TIER-003
  - Blocks: DEV-VERSION-003

Complexity: M
```

```
DEV-VERSION-003
Title:       GET /pages/:id/versions — list version history
Story:       US-VERSION-001 (AC-1)
Layer:       API
Description: Return paginated list of versions for a page.
             Response: [{ id, createdAt, authorDisplayName }] — no content payload (too large).
             Protected by tierGuard('personal').
             Returns 403 PLAN_REQUIRED for Free tier.

Acceptance Check:
  - TC-VERSION-001 passes (list shows timestamps + author)
  - TC-VERSION-003 passes (Free tier returns 403)

Dependencies:
  - Blocked by: DEV-VERSION-002, DEV-TIER-003
  - Blocks: DEV-VERSION-005

Complexity: S
```

```
DEV-VERSION-004
Title:       POST /pages/:id/versions/:versionId/restore
Story:       US-VERSION-001 (AC-2)
Layer:       API + Domain
Description: Restore a past version:
             1. Fetch PageVersion.content
             2. Write content back to Page.content (PATCH)
             3. Create a new PageVersion snapshot of the restored content
             4. Re-trigger Qdrant indexing for the page
             Return the updated page with restored content.

Acceptance Check:
  - TC-VERSION-002 passes (restore replaces content; new snapshot created)

Dependencies:
  - Blocked by: DEV-VERSION-003
  - Blocks: DEV-VERSION-005

Complexity: M
```

```
DEV-VERSION-005
Title:       Frontend: Version history panel + restore
Story:       US-VERSION-001
Layer:       Frontend
Description: Add "History" button in page toolbar (Personal/Startup only — use PlanGate for Free).
             Panel shows list of versions (timestamp + author). Clicking a version
             previews the content diff. Restore button calls the restore endpoint and
             reloads the editor with the restored content.

Acceptance Check:
  - Versions listed correctly with timestamps
  - Restore replaces editor content

Dependencies:
  - Blocked by: DEV-VERSION-004, DEV-TIER-005
  - Blocks: —

Complexity: M
```

---

### EPIC-COLLAB-001 Tasks

```
DEV-COLLAB-001
Title:       WorkspaceMember + WorkspaceInvitation schemas + migrations
Story:       US-COLLAB-001, US-COLLAB-002
Layer:       DB
Description: Add two models:

             WorkspaceMember:
             - id: ULID PK
             - workspaceId: FK → Workspace
             - accountId: FK → Accounts
             - role: Enum (owner | member | viewer)
             - joinedAt: DateTime
             Unique on (workspaceId, accountId)

             WorkspaceInvitation:
             - id: ULID PK
             - workspaceId: FK → Workspace
             - invitedBy: FK → Accounts
             - email: String
             - role: Enum (member | viewer)
             - token: String (unique, opaque)
             - expiresAt: DateTime (+7 days from creation)
             - status: Enum (pending | accepted | expired)
             Unique on (workspaceId, email) for pending invites.

Acceptance Check:
  - Migration applies cleanly
  - Unique constraint prevents duplicate invites (TC-COLLAB-003)

Dependencies:
  - Blocked by: DEV-TIER-001
  - Blocks: DEV-COLLAB-002, DEV-COLLAB-004

Complexity: M
```

```
DEV-COLLAB-002
Title:       POST /workspace/:id/invitations — send invite email
Story:       US-COLLAB-001 (AC-1, AC-2)
Layer:       API + Email
Description: Endpoint for workspace Owner to invite a member.
             Body: { email, role: "member" | "viewer" }
             1. Check requester is Owner (DEV-COLLAB-007)
             2. Check tierGuard('startup')
             3. Check no pending invite exists for email (409 PENDING_INVITE_EXISTS)
             4. Generate invite token; store WorkspaceInvitation (expires in 7 days)
             5. Send invitation email with accept link
             Returns 201.

Acceptance Check:
  - TC-COLLAB-001 passes (invite sent; email dispatched)
  - TC-COLLAB-002 passes (invite for new vs existing user)
  - TC-COLLAB-003 passes (duplicate invite rejected — 409)
  - TC-WS-010 passes (Personal tier blocked — 403)
  - TC-WS-011 passes (Free tier blocked — 403)

Dependencies:
  - Blocked by: DEV-COLLAB-001, DEV-TIER-003
  - Blocks: DEV-COLLAB-003

Complexity: M
```

```
DEV-COLLAB-003
Title:       POST /workspace/invitations/accept — accept invite by token
Story:       US-COLLAB-001 (AC-3)
Layer:       API
Description: Public endpoint (no auth required — invitee may not have account).
             Body: { token }
             1. Find WorkspaceInvitation by token
             2. Check status === 'pending' and expiresAt > now (410 INVITE_EXPIRED)
             3. Find or create Accounts record for invitation email
             4. Create WorkspaceMember with invitation role
             5. Mark invitation status = 'accepted'
             Returns 200 with workspace info.

Acceptance Check:
  - TC-COLLAB-001 passes (invitee added to workspace on accept)
  - TC-COLLAB-004 passes (expired token — 410 INVITE_EXPIRED)

Dependencies:
  - Blocked by: DEV-COLLAB-002
  - Blocks: DEV-COLLAB-009

Complexity: M
```

```
DEV-COLLAB-004
Title:       GET /workspace/:id/members — list workspace members
Story:       US-COLLAB-002 (AC-1)
Layer:       API
Description: List all WorkspaceMembers for a workspace.
             Response: [{ id, accountId, displayName, email, role, joinedAt }]
             Accessible by Owner, Member, and Viewer (read-only).

Acceptance Check:
  - Members list returns correct role for each member

Dependencies:
  - Blocked by: DEV-COLLAB-001
  - Blocks: DEV-COLLAB-008

Complexity: S
```

```
DEV-COLLAB-005
Title:       PATCH /workspace/:id/members/:memberId — change member role
Story:       US-COLLAB-002 (AC-1)
Layer:       API
Description: Owner updates a member's role (member ↔ viewer).
             Cannot change role of another Owner.
             Body: { role: "member" | "viewer" }

Acceptance Check:
  - TC-COLLAB-005 passes (Viewer upgraded to Member)
  - TC-COLLAB-006 passes (Member downgraded to Viewer)

Dependencies:
  - Blocked by: DEV-COLLAB-004, DEV-COLLAB-007
  - Blocks: —

Complexity: S
```

```
DEV-COLLAB-006
Title:       DELETE /workspace/:id/members/:memberId — remove member
Story:       US-COLLAB-002 (AC-2, BC-2)
Layer:       API
Description: Remove a WorkspaceMember.
             Rules:
             - Owner cannot remove themselves (400 OWNER_CANNOT_REMOVE_SELF)
             - Only Owner can remove others
             Returns 200.

Acceptance Check:
  - TC-COLLAB-009 passes (Owner cannot remove self)

Dependencies:
  - Blocked by: DEV-COLLAB-004, DEV-COLLAB-007
  - Blocks: —

Complexity: M
```

```
DEV-COLLAB-007
Title:       Permission guard middleware — Owner/Member/Viewer per route
Story:       US-COLLAB-002 (AC-3, AC-4)
Layer:       Middleware
Description: Create `roleGuard(requiredRole: 'owner' | 'member')` middleware.
             - Reads workspaceId from route params
             - Looks up WorkspaceMember record for req.account.id in that workspace
             - If member's role < requiredRole: returns 403 FORBIDDEN
             - Viewer: blocked from all write operations (POST/PATCH/DELETE on content)
             - Member: can write content but not manage members or settings
             - Owner: full access

Acceptance Check:
  - TC-COLLAB-007 passes (Viewer blocked from create content)
  - TC-COLLAB-008 passes (Viewer blocked from AI chat)

Dependencies:
  - Blocked by: DEV-COLLAB-001
  - Blocks: DEV-CONTENT-003, DEV-CONTENT-004, DEV-COLLAB-002, DEV-COLLAB-005, DEV-COLLAB-006

Complexity: M
```

```
DEV-COLLAB-008
Title:       Frontend: Members settings page + invite form
Story:       US-COLLAB-001, US-COLLAB-002
Layer:       Frontend
Description: Workspace settings > Members page:
             - List current members with role badge + role change dropdown (Owner only)
             - Remove member button with confirmation (Owner only)
             - "Invite Member" form: email + role selector → POST /invitations
             - Show PLAN_REQUIRED state for non-Startup tier with upgrade prompt
             - Pending invites list with status

Acceptance Check:
  - Owner can invite, change role, remove member via UI
  - Non-Startup sees upgrade prompt

Dependencies:
  - Blocked by: DEV-COLLAB-004, DEV-COLLAB-005, DEV-COLLAB-006, DEV-TIER-005
  - Blocks: —

Complexity: M
```

```
DEV-COLLAB-009
Title:       Frontend: Invitation accept page
Story:       US-COLLAB-001 (AC-3)
Layer:       Frontend
Description: Public page at `/invite/[token]`:
             - Call POST /workspace/invitations/accept with token
             - If user not logged in: show login/register form first, then redirect
             - On success: redirect to the workspace
             - On expired: show "invite expired" message with option to request new invite
             - Handle 410 INVITE_EXPIRED gracefully

Acceptance Check:
  - TC-COLLAB-004 shows expired invite message on UI

Dependencies:
  - Blocked by: DEV-COLLAB-003
  - Blocks: —

Complexity: S
```

---

### EPIC-DIARY-001 Tasks

```
DEV-DIARY-001
Title:       DiaryEntry schema + migration
Story:       US-DIARY-001
Layer:       DB
Description: Add `DiaryEntry` model:
             - id: ULID PK
             - workspaceId: FK → Workspace
             - accountId: FK → Accounts (owner only)
             - date: Date (not DateTime — calendar date only)
             - content: Json (Editor.js block array)
             - createdAt, updatedAt
             Unique constraint on (workspaceId, accountId, date) — one entry per day per user.

Acceptance Check:
  - Migration applies cleanly
  - Unique constraint enforced (TC-DIARY-003)

Dependencies:
  - Blocked by: DEV-TIER-001
  - Blocks: DEV-DIARY-002, DEV-DIARY-003, DEV-DIARY-004

Complexity: S
```

```
DEV-DIARY-002
Title:       GET /workspace/:id/diary — list entries by month
Story:       US-DIARY-001 (AC-2)
Layer:       API
Description: Query: { month: "2026-03" }
             Returns list of diary dates that have entries (for calendar highlights).
             Protected by tierGuard('personal') + diary privacy guard (DEV-DIARY-006).

Acceptance Check:
  - TC-DIARY-001 passes (list shows diary dates for the month)
  - TC-DIARY-004 passes (Free tier blocked)

Dependencies:
  - Blocked by: DEV-DIARY-001, DEV-TIER-003
  - Blocks: DEV-DIARY-008

Complexity: S
```

```
DEV-DIARY-003
Title:       GET /workspace/:id/diary/:date — get entry for a specific date
Story:       US-DIARY-001 (AC-2)
Layer:       API
Description: Returns the diary entry for a given date (YYYY-MM-DD).
             404 if no entry for that date. Enforces diary privacy guard.

Acceptance Check:
  - TC-DIARY-002 passes (past entry retrieved by date)

Dependencies:
  - Blocked by: DEV-DIARY-001, DEV-DIARY-006
  - Blocks: DEV-DIARY-008

Complexity: S
```

```
DEV-DIARY-004
Title:       POST /workspace/:id/diary — create diary entry (one per date)
Story:       US-DIARY-001 (AC-1, AC-3, BC-1)
Layer:       API + Domain
Description: Body: { date: "YYYY-MM-DD", content: [] }
             Check unique constraint — if entry for date exists, return 409 with
             redirect hint to existing entry (SC-DIARY-002). On success,
             trigger Qdrant indexing async (DEV-DIARY-007).

Acceptance Check:
  - TC-DIARY-001 passes (entry created for today)
  - TC-DIARY-003 passes (duplicate date redirects to existing entry)

Dependencies:
  - Blocked by: DEV-DIARY-001, DEV-TIER-003
  - Blocks: DEV-DIARY-007

Complexity: S
```

```
DEV-DIARY-005
Title:       PATCH /workspace/:id/diary/:id — update diary entry
Story:       US-DIARY-001
Layer:       API
Description: Update diary entry content. Re-trigger Qdrant indexing async.
             Enforces diary privacy guard.

Acceptance Check:
  - Updated content persists and is returned

Dependencies:
  - Blocked by: DEV-DIARY-004
  - Blocks: —

Complexity: S
```

```
DEV-DIARY-006
Title:       Diary privacy guard — entries visible to owner only
Story:       US-DIARY-001 (BC-3)
Layer:       Middleware
Description: Middleware applied to all diary endpoints. Checks:
             req.account.id === diaryEntry.accountId (or for list/create: filters to own entries).
             Other workspace members (even Owners) get 403 or empty list.

Acceptance Check:
  - TC-DIARY-005 passes (workspace member cannot see Owner's diary)

Dependencies:
  - Blocked by: DEV-DIARY-001
  - Blocks: DEV-DIARY-002, DEV-DIARY-003

Complexity: S
```

```
DEV-DIARY-007
Title:       RAG indexing for diary entries — chunk + embed + Qdrant upsert
Story:       US-DIARY-001, US-AI-002 (diary as RAG source)
Layer:       Integration
Description: After diary create/update, asynchronously:
             1. Extract plain text from Editor.js blocks
             2. Chunk text into ~500 token segments
             3. Generate embeddings via OpenAI text-embedding-3-small
             4. Upsert into Qdrant collection `workspace_{id}_diary`
             Payload: { sourceId, sourceType: 'diary', date, accountId, workspaceId }

Acceptance Check:
  - After diary save, diary content appears in semantic search results (TC-SEARCH-001)

Dependencies:
  - Blocked by: DEV-DIARY-004, DEV-SEARCH-001, DEV-SEARCH-002
  - Blocks: —

Complexity: M
```

```
DEV-DIARY-008
Title:       Frontend: Diary calendar view + editor
Story:       US-DIARY-001
Layer:       Frontend
Description: New "/diary" route in app (main) layout:
             - Calendar component highlighting dates with entries
             - Click date → opens diary editor (same Editor.js component as pages)
             - Auto-save (2s debounce) calls PATCH /diary/:id
             - "Today" button for quick navigation
             - PlanGate wrapping entire diary section (Free tier sees upgrade prompt)

Acceptance Check:
  - TC-DIARY-001 passed via UI flow
  - Free tier user sees upgrade prompt, cannot create entry

Dependencies:
  - Blocked by: DEV-DIARY-002, DEV-DIARY-003, DEV-DIARY-004, DEV-TIER-005
  - Blocks: —

Complexity: L
```

---

### EPIC-FILE-001 Tasks

```
DEV-FILE-001
Title:       File schema + migration
Story:       US-FILE-001
Layer:       DB
Description: Add `File` model:
             - id: ULID PK
             - workspaceId: FK → Workspace
             - accountId: FK → Accounts (uploader)
             - name: String (original filename)
             - mimeType: String
             - size: Int (bytes)
             - storageUrl: String (S3/local path)
             - crawlStatus: Enum (pending | indexed | failed | not_indexable)
             - createdAt, updatedAt

Acceptance Check:
  - Migration applies cleanly

Dependencies:
  - Blocked by: —
  - Blocks: DEV-FILE-002, DEV-FILE-003

Complexity: S
```

```
DEV-FILE-002
Title:       File upload middleware — Multer with tier-aware size limits
Story:       US-FILE-001 (AC-3, BC-2)
Layer:       API
Description: Configure Multer middleware:
             - Free tier: max 5MB per file
             - Personal/Startup: max 100MB per file
             Read tier from req.account.tier (set by authAccessMiddleware).
             Reject with 400 FILE_TOO_LARGE if limit exceeded.
             Allowed MIME types: PDF, Markdown, DOCX, XLSX, PNG, JPEG, GIF, WebP.
             Reject others with 400 UNSUPPORTED_FILE_TYPE.

Acceptance Check:
  - TC-FILE-003 passes (unsupported type rejected)
  - TC-FILE-004 passes (Free: 6MB rejected)
  - TC-FILE-005 passes (Personal: 101MB rejected)

Dependencies:
  - Blocked by: DEV-FILE-001, DEV-TIER-001
  - Blocks: DEV-FILE-003

Complexity: M
```

```
DEV-FILE-003
Title:       POST /workspace/:id/files — upload handler
Story:       US-FILE-001 (AC-1)
Layer:       API
Description: Endpoint that:
             1. Applies Multer middleware (DEV-FILE-002)
             2. Stores file to local disk (dev) / S3 (prod)
             3. Creates File DB record with crawlStatus = 'pending'
             4. Returns 200 with file metadata
             5. Enqueues background indexing job (DEV-FILE-006) for PDF/MD/DOCX

Acceptance Check:
  - TC-FILE-001 passes (PDF uploaded; appears in library)
  - TC-FILE-002 passes (image uploaded; appears in library)

Dependencies:
  - Blocked by: DEV-FILE-002
  - Blocks: DEV-FILE-006

Complexity: M
```

```
DEV-FILE-004
Title:       GET /workspace/:id/files — list files
Story:       US-FILE-001
Layer:       API
Description: Paginated list of files for a workspace.
             Response: [{ id, name, mimeType, size, crawlStatus, createdAt }]
             Sorted by createdAt DESC.

Acceptance Check:
  - File list returns uploaded files with correct metadata

Dependencies:
  - Blocked by: DEV-FILE-001
  - Blocks: DEV-FILE-007

Complexity: S
```

```
DEV-FILE-005
Title:       DELETE /workspace/:id/files/:id — delete file
Story:       US-FILE-001
Layer:       API
Description: Soft-delete File record, delete from storage, and delete associated
             Qdrant vectors for the file. Return 200.

Acceptance Check:
  - File removed from list and storage after delete

Dependencies:
  - Blocked by: DEV-FILE-004, DEV-SEARCH-001
  - Blocks: —

Complexity: S
```

```
DEV-FILE-006
Title:       Background job: file text extraction + chunk + Qdrant upsert
Story:       US-FILE-001 (AC-4, AC-5, BC-3)
Layer:       Integration
Description: Async job triggered after file upload for indexable types (PDF, MD, DOCX):
             1. Extract text: PDF → pdfjs-dist; DOCX → mammoth; MD → plain text
             2. Chunk into ~500 token segments
             3. Embed each chunk via OpenAI text-embedding-3-small
             4. Upsert into Qdrant `workspace_{id}_files`
             5. Update File.crawlStatus = 'indexed' (or 'failed')
             Images (PNG/JPEG/GIF/WebP): skip extraction, mark as 'not_indexable'.

Acceptance Check:
  - TC-FILE-006 passes (PDF indexed in Qdrant within 60s)
  - TC-FILE-007 passes (image stored but not indexed; crawlStatus = 'not_indexable')

Dependencies:
  - Blocked by: DEV-FILE-003, DEV-SEARCH-001, DEV-SEARCH-002
  - Blocks: —

Complexity: L
```

```
DEV-FILE-007
Title:       Frontend: File library UI + drag-drop upload
Story:       US-FILE-001
Layer:       Frontend
Description: New "/files" route in app layout:
             - File library grid/list view with name, type, size, status badges
             - Drag-drop upload zone + "Upload" button
             - File type icon per MIME type
             - Delete with confirmation dialog
             - Show indexing status (Pending / Indexed / Failed / Not Indexable)
             - Tier badge showing current upload size limit

Acceptance Check:
  - Files appear in list after upload
  - Status updates from pending to indexed/failed

Dependencies:
  - Blocked by: DEV-FILE-003, DEV-FILE-004, DEV-FILE-005
  - Blocks: —

Complexity: M
```

---

### EPIC-LINK-001 Tasks

```
DEV-LINK-001
Title:       Link schema + migration
Story:       US-LINK-001, US-LINK-002
Layer:       DB
Description: Add `Link` model:
             - id: ULID PK
             - workspaceId: FK → Workspace
             - accountId: FK → Accounts
             - url: String
             - title: String? (crawled)
             - description: String? (crawled)
             - crawlStatus: Enum (bookmark | pending | crawled | crawl_failed)
             - lastCrawledAt: DateTime?
             - createdAt, updatedAt

Acceptance Check:
  - Migration applies cleanly

Dependencies:
  - Blocked by: —
  - Blocks: DEV-LINK-002, DEV-LINK-003

Complexity: S
```

```
DEV-LINK-002
Title:       POST /workspace/:id/links — save URL (tier-aware)
Story:       US-LINK-001 (AC-1), US-LINK-002 (AC-1)
Layer:       API + Domain
Description: Body: { url, fetchContent?: boolean }
             Free tier:
             - Always saves as bookmark (crawlStatus = 'bookmark')
             - fetchContent=true returns 403 PLAN_REQUIRED
             Personal/Startup:
             - crawlStatus = 'pending'; enqueue crawler job (DEV-LINK-007)
             Returns 201 with link record.

Acceptance Check:
  - TC-LINK-001 passes (Free user: bookmark saved, no crawl)
  - TC-LINK-002 passes (Free user: fetchContent blocked — 403)
  - TC-LINK-003 passes (Personal: crawl enqueued)

Dependencies:
  - Blocked by: DEV-LINK-001, DEV-TIER-001
  - Blocks: DEV-LINK-007

Complexity: M
```

```
DEV-LINK-003
Title:       GET /workspace/:id/links — list links
Story:       US-LINK-001, US-LINK-002
Layer:       API
Description: Paginated list of saved links.
             Response: [{ id, url, title, description, crawlStatus, createdAt }]

Acceptance Check:
  - Links appear in list after save

Dependencies:
  - Blocked by: DEV-LINK-001
  - Blocks: DEV-LINK-008

Complexity: S
```

```
DEV-LINK-004
Title:       DELETE /workspace/:id/links/:id — remove link + Qdrant cleanup
Story:       US-LINK-001
Layer:       API
Description: Delete Link record and remove associated Qdrant vectors from
             `workspace_{id}_links` collection.

Acceptance Check:
  - Link removed from list; vectors deleted from Qdrant

Dependencies:
  - Blocked by: DEV-LINK-003, DEV-SEARCH-001
  - Blocks: —

Complexity: S
```

```
DEV-LINK-005
Title:       POST /workspace/:id/links/:id/crawl — manual re-crawl (1/hr rate limit)
Story:       US-LINK-002 (AC-3), US-LINK-002 (BC-5)
Layer:       API
Description: Trigger manual re-crawl for Personal/Startup tier.
             Check Link.lastCrawledAt — if < 1 hour ago, return 429 RECRAWL_TOO_SOON.
             Protected by tierGuard('personal').

Acceptance Check:
  - TC-LINK-006 passes (re-crawl within 1hr rejected — 429)
  - TC-LINK-005 passes (crawl failure stored as crawl_failed status)

Dependencies:
  - Blocked by: DEV-LINK-003, DEV-TIER-003, DEV-LINK-006
  - Blocks: —

Complexity: S
```

```
DEV-LINK-006
Title:       Link crawler service (axios + cheerio)
Story:       US-LINK-002 (AC-1, AC-3)
Layer:       Domain
Description: CrawlerService.crawl(url):
             1. Check robots.txt at {origin}/robots.txt — if disallowed, return crawl_failed
             2. GET url with 10s timeout and User-Agent: Knowledgebase-Bot/1.0
             3. Parse with cheerio: extract <title>, <meta description>, <main>/<article>/<body>
             4. Strip scripts, styles, nav, footer
             5. Truncate to 500KB
             Returns { title, description, body, statusCode } or throws on failure.

Acceptance Check:
  - TC-LINK-004 passes (title + description extracted for reachable URL)
  - TC-LINK-005 passes (ECONNREFUSED → crawl_failed status)

Dependencies:
  - Blocked by: —
  - Blocks: DEV-LINK-007

Complexity: M
```

```
DEV-LINK-007
Title:       Background job: crawl + chunk + embed + Qdrant upsert (Personal/Startup)
Story:       US-LINK-002 (AC-2)
Layer:       Integration
Description: Async job for Personal/Startup tier after link save:
             1. Call CrawlerService.crawl(url)
             2. On success: chunk body text, embed, upsert to Qdrant `workspace_{id}_links`
                Update Link: crawlStatus='crawled', lastCrawledAt=now, title, description
             3. On failure: crawlStatus='crawl_failed'

Acceptance Check:
  - TC-LINK-003 passes (content crawled; link status = crawled)
  - TC-LINK-005 passes (failure: status = crawl_failed; user can retry)

Dependencies:
  - Blocked by: DEV-LINK-006, DEV-SEARCH-001, DEV-SEARCH-002
  - Blocks: —

Complexity: M
```

```
DEV-LINK-008
Title:       Frontend: Link library UI + save link dialog
Story:       US-LINK-001, US-LINK-002
Layer:       Frontend
Description: New "/links" route:
             - Link list with URL, title, description, crawl status badge
             - "Add Link" dialog: URL input + optional "Fetch Content" toggle (Personal/Startup only)
             - Delete with confirmation
             - Show "Personal plan required" when Free user toggles Fetch Content
             - Crawl status indicator: bookmark / indexing / indexed / failed + retry button

Acceptance Check:
  - Free user: can save bookmark; fetch content toggle disabled/gated
  - Personal user: fetch content available; status updates shown

Dependencies:
  - Blocked by: DEV-LINK-002, DEV-LINK-003, DEV-LINK-004, DEV-LINK-005, DEV-TIER-005
  - Blocks: —

Complexity: M
```

---

### EPIC-SEARCH-001 Tasks

```
DEV-SEARCH-001
Title:       Qdrant collection manager — per-workspace collections
Story:       US-SEARCH-001
Layer:       Infra
Description: QdrantService with:
             - ensureCollections(workspaceId): creates four collections if not exist
               * workspace_{id}_notes (vector dim: 1536)
               * workspace_{id}_files
               * workspace_{id}_links
               * workspace_{id}_diary
             - upsertPoints(collection, points): wrapper over Qdrant PUT /points
             - deletePoints(collection, sourceId): delete by sourceId payload filter
             - search(collection, vector, limit, filter): POST /points/search
             Called at workspace creation and by all indexing jobs.

Acceptance Check:
  - Collections created on workspace creation
  - Qdrant unavailable: returns 503 (graceful degradation)

Dependencies:
  - Blocked by: —
  - Blocks: DEV-SEARCH-002, DEV-FILE-006, DEV-LINK-007, DEV-DIARY-007

Complexity: M
```

```
DEV-SEARCH-002
Title:       Embedding service — OpenAI text-embedding-3-small
Story:       US-SEARCH-001, US-AI-002
Layer:       Integration
Description: EmbeddingService.embed(text: string): Promise<number[]>
             Calls OpenAI /embeddings endpoint with model text-embedding-3-small.
             Returns 1536-dimension vector. Used by all indexing jobs and search query handler.
             Mock in tests (return fixed-length zero vector).

Acceptance Check:
  - Returns 1536-dimension vector for any text input
  - Test mock returns predictable vector for assertions

Dependencies:
  - Blocked by: —
  - Blocks: DEV-SEARCH-003, DEV-FILE-006, DEV-LINK-007, DEV-DIARY-007, DEV-CONTENT-005

Complexity: M
```

```
DEV-SEARCH-003
Title:       GET /workspace/:id/search?q= — semantic search endpoint
Story:       US-SEARCH-001 (AC-1, AC-2, AC-3, BC-2)
Layer:       API + Domain
Description: 1. Embed query string via EmbeddingService
             2. Determine collections to search based on tier:
                - Free: notes + files only
                - Personal/Startup: notes + files + links + diary (own entries)
             3. Search each collection with workspaceId filter; limit 20 results
             4. Merge + rank by similarity score
             5. Return: [{ type, title, excerpt (150 chars), similarity, sourceUrl }]

Acceptance Check:
  - TC-SEARCH-001 passes (relevant results returned, ranked by similarity)
  - TC-SEARCH-002 passes (Free: no link results)
  - TC-SEARCH-003 passes (Personal: link results included)

Dependencies:
  - Blocked by: DEV-SEARCH-001, DEV-SEARCH-002
  - Blocks: DEV-SEARCH-004

Complexity: M
```

```
DEV-SEARCH-004
Title:       Frontend: Search bar + results panel
Story:       US-SEARCH-001
Layer:       Frontend
Description: Global search bar in main layout header:
             - Keyboard shortcut Cmd/Ctrl+K opens search
             - Query input triggers GET /search?q= after 300ms debounce
             - Results grouped by type (Notes, Files, Links, Diary)
             - Each result shows: type icon, title, excerpt, link to source
             - Empty state + "no results" message
             - Loading skeleton while fetching

Acceptance Check:
  - Search returns and displays relevant results
  - Clicking result navigates to source page/file/link

Dependencies:
  - Blocked by: DEV-SEARCH-003
  - Blocks: —

Complexity: M
```

---

### EPIC-AI-001 Tasks

```
DEV-AI-001
Title:       AI model config schema + migration
Story:       US-AI-001
Layer:       DB
Description: Add `AIModelConfig` model:
             - id: ULID PK
             - workspaceId: FK → Workspace (unique — one config per workspace)
             - provider: Enum (openai | gemini | anthropic | ollama | platform)
             - model: String (e.g., "gpt-4o")
             - encryptedKey: String? (AES-256-GCM encrypted, NULL for platform/ollama)
             - baseUrl: String? (for Ollama)
             - isActive: Boolean
             - createdAt, updatedAt

Acceptance Check:
  - Migration applies cleanly; unique on workspaceId

Dependencies:
  - Blocked by: —
  - Blocks: DEV-AI-003, DEV-AI-004

Complexity: S
```

```
DEV-AI-002
Title:       AI conversation + message schemas + migration
Story:       US-AI-FREE-001, US-AI-002
Layer:       DB
Description: Add two models:

             AIConversation:
             - id: ULID PK
             - workspaceId: FK → Workspace
             - accountId: FK → Accounts
             - title: String (auto-generated from first message)
             - createdAt, updatedAt

             AIMessage:
             - id: ULID PK
             - conversationId: FK → AIConversation
             - role: Enum (user | assistant)
             - content: Text
             - sources: Json? (array of { sourceId, sourceType, title, excerpt })
             - createdAt

Acceptance Check:
  - Migration applies cleanly
  - Conversation + message created on first chat

Dependencies:
  - Blocked by: —
  - Blocks: DEV-AI-008, DEV-AI-009

Complexity: M
```

```
DEV-AI-003
Title:       API key encryption service (AES-256-GCM)
Story:       US-AI-001 (BC-1)
Layer:       Domain
Description: EncryptionService:
             - encrypt(plaintext: string): string (base64 ciphertext + IV + authTag)
             - decrypt(ciphertext: string): string
             Uses AES-256-GCM with KEY from env var AI_ENCRYPTION_KEY (32 bytes hex).
             Never log or expose plaintext keys.

Acceptance Check:
  - TC-AI-006 passes (API key never appears in GET /ai/settings response)
  - Encrypt → decrypt round-trip produces original key

Dependencies:
  - Blocked by: —
  - Blocks: DEV-AI-004

Complexity: M
```

```
DEV-AI-004
Title:       GET/POST/PATCH /workspace/:id/ai/settings — BYOK configuration
Story:       US-AI-001 (AC-1, AC-2)
Layer:       API
Description: Three endpoints:
             GET /ai/settings: return current config (provider, model, baseUrl).
               Raw API key NEVER returned — omit or return masked (e.g., "sk-...xxxx").
             POST /ai/settings: create or replace AI config. Body: { provider, model, apiKey?, baseUrl? }
               Before saving: call DEV-AI-005 to validate key. On valid: encrypt key, upsert AIModelConfig.
             PATCH /ai/settings: update provider or model.
             All protected by tierGuard('personal').

Acceptance Check:
  - TC-AI-003 passes (valid OpenAI key accepted)
  - TC-AI-004 passes (invalid key rejected — 400)
  - TC-AI-005 passes (Gemini + Anthropic + Ollama validation)
  - TC-AI-006 passes (GET response omits raw key)

Dependencies:
  - Blocked by: DEV-AI-001, DEV-AI-003, DEV-AI-005, DEV-TIER-003
  - Blocks: DEV-AI-012

Complexity: M
```

```
DEV-AI-005
Title:       Provider validation service — test calls to OpenAI/Gemini/Anthropic/Ollama
Story:       US-AI-001 (AC-3)
Layer:       Integration
Description: ProviderValidator.validate(provider, apiKey, model, baseUrl?):
             - openai: POST /v1/chat/completions with gpt-4o-mini, max_tokens:1
             - anthropic: POST /v1/messages with claude-haiku-4-5-20251001, max_tokens:1
             - gemini: POST /v1beta/models/gemini-2.0-flash:generateContent
             - ollama: GET {baseUrl}/api/tags (check reachable)
             Returns { valid: true } or throws KEY_VALIDATION_FAILED.

Acceptance Check:
  - TC-AI-004 passes (invalid key → KEY_VALIDATION_FAILED)

Dependencies:
  - Blocked by: —
  - Blocks: DEV-AI-004

Complexity: M
```

```
DEV-AI-006
Title:       Platform AI service — Free tier built-in model integration
Story:       US-AI-FREE-001 (AC-1)
Layer:       Integration
Description: PlatformAIService wrapping platform-managed model (e.g., Claude Haiku 4.5
             via Anthropic API with platform's own key stored server-side in env var).
             Used when workspace has no AIModelConfig or provider = 'platform'.
             Used by Free tier only.

Acceptance Check:
  - TC-AI-001 passes (Free user gets AI response without BYOK)

Dependencies:
  - Blocked by: —
  - Blocks: DEV-AI-007

Complexity: M
```

```
DEV-AI-007
Title:       RAG pipeline — retrieve chunks → inject context → stream LLM response
Story:       US-AI-002 (AC-1, AC-2)
Layer:       Domain
Description: RAGService.chat(workspaceId, accountId, userMessage, conversationHistory):
             1. Embed userMessage via EmbeddingService
             2. Search Qdrant collections based on tier scope (same as DEV-SEARCH-003)
             3. Retrieve top-10 chunks; format as context block
             4. Build prompt: system message with context + conversation history + user query
             5. Call LLM (platform model for Free tier; decrypted BYOK for Personal/Startup)
             6. Stream response tokens back
             7. Collect sources from retrieved chunks (for citation)
             Returns async iterator of tokens + final sources array.

Acceptance Check:
  - TC-AI-001 passes (Free tier: platform model answers with context)
  - TC-AI-007 passes (Personal: query across all content types)
  - TC-AI-008 passes (folder-scoped query limits Qdrant filter to folder's pages)

Dependencies:
  - Blocked by: DEV-AI-006, DEV-SEARCH-001, DEV-SEARCH-002, DEV-AI-003
  - Blocks: DEV-AI-008

Complexity: L
```

```
DEV-AI-008
Title:       POST /workspace/:id/ai/chat — RAG chat endpoint
Story:       US-AI-FREE-001, US-AI-002
Layer:       API
Description: Body: { message, conversationId? }
             1. Validate Viewer cannot access (DEV-COLLAB-007)
             2. Find or create AIConversation
             3. Store user message in AIMessage
             4. Call RAGService.chat() — stream response
             5. Store assistant message + sources in AIMessage
             6. Return SSE stream of tokens + sources at end.
             For Free tier: use platform model. For Personal/Startup: use BYOK model.

Acceptance Check:
  - TC-AI-001 passes (Free tier response with sources)
  - TC-AI-002 passes (conversation history persisted)
  - TC-AI-009 passes (Viewer blocked — 403)

Dependencies:
  - Blocked by: DEV-AI-007, DEV-AI-002
  - Blocks: DEV-AI-011

Complexity: M
```

```
DEV-AI-009
Title:       GET /workspace/:id/ai/chat — list conversations + messages
Story:       US-AI-FREE-001 (AC-3)
Layer:       API
Description: GET /ai/chat — list conversations for the workspace (paginated)
             GET /ai/chat/:conversationId — get messages for a conversation
             Returns conversation title + message history.

Acceptance Check:
  - TC-AI-002 passes (conversation history retrievable)

Dependencies:
  - Blocked by: DEV-AI-002
  - Blocks: DEV-AI-011

Complexity: S
```

```
DEV-AI-010
Title:       POST /workspace/:id/ai/generate — in-editor generation endpoint
Story:       US-AI-003 (AC-1, AC-2)
Layer:       API
Description: Body: { prompt, context?: string (surrounding blocks) }
             Protected by tierGuard('personal').
             Calls LLM (BYOK model) with user prompt + editor context.
             Returns generated content as Editor.js block array (streamed or full).
             Free tier: returns 403 PLAN_REQUIRED.

Acceptance Check:
  - TC-AI-010 passes (content generated and returned as blocks)
  - TC-AI-012 passes (Free tier — 403)

Dependencies:
  - Blocked by: DEV-AI-007, DEV-TIER-003
  - Blocks: DEV-AI-013

Complexity: M
```

```
DEV-AI-011
Title:       Frontend: AI chat UI + source citations + conversation history
Story:       US-AI-FREE-001, US-AI-002
Layer:       Frontend
Description: New "/ai" route in app layout:
             - Conversation list sidebar (GET /ai/chat)
             - Chat window with message bubbles (user + assistant)
             - Source citations shown as expandable chips below each assistant message
             - Streaming token display (SSE connection)
             - New conversation button
             - Viewer role: chat input disabled with "Read-only" message
             - Free tier: platform model indicator shown

Acceptance Check:
  - TC-AI-001 passed via UI (answer shown with source refs)
  - Viewer cannot type in chat input

Dependencies:
  - Blocked by: DEV-AI-008, DEV-AI-009
  - Blocks: —

Complexity: L
```

```
DEV-AI-012
Title:       Frontend: AI settings page (BYOK config)
Story:       US-AI-001
Layer:       Frontend
Description: Workspace settings > AI page (Personal/Startup only — PlanGate for Free):
             - Provider selector (OpenAI, Gemini, Anthropic, Ollama)
             - API key input (masked, write-only)
             - Model selector (populated per provider)
             - Ollama: base URL input + model selector from /api/tags
             - "Test Connection" button (triggers validation)
             - Success/failure feedback
             - Current config displayed (provider + model; key masked)

Acceptance Check:
  - TC-AI-003 passed via UI (valid key accepted; success shown)
  - TC-AI-004 shown via UI (invalid key shows error message)

Dependencies:
  - Blocked by: DEV-AI-004, DEV-TIER-005
  - Blocks: —

Complexity: M
```

```
DEV-AI-013
Title:       Frontend: In-editor /ai command + generation overlay
Story:       US-AI-003
Layer:       Frontend
Description: In Editor.js:
             - Register /ai slash command (or Cmd+J keyboard shortcut)
             - Opens inline generation popover with prompt input
             - Send prompt + surrounding block context to POST /ai/generate
             - Stream generated content into editor as new blocks
             - "Discard" button restores original state
             - Free tier: command triggers PlanGate upgrade prompt

Acceptance Check:
  - TC-AI-010 passed via UI (generated content inserted as blocks)
  - TC-AI-011 passed via UI (discard removes generated blocks)
  - TC-AI-012 passed via UI (Free tier: upgrade prompt shown)

Dependencies:
  - Blocked by: DEV-AI-010, DEV-CONTENT-009, DEV-TIER-005
  - Blocks: —

Complexity: M
```

---

## 4. Dependency Map

| Task | Blocked By | Blocks |
|------|-----------|--------|
| DEV-TIER-001 | — | DEV-TIER-003, DEV-TIER-004, DEV-COLLAB-001, DEV-DIARY-001 |
| DEV-TIER-002 | — | DEV-TIER-004 |
| DEV-TIER-003 | DEV-TIER-001 | DEV-COLLAB-002, DEV-DIARY-002, DEV-VERSION-003, DEV-LINK-005, DEV-AI-004, DEV-AI-010 |
| DEV-TIER-004 | DEV-TIER-001, DEV-TIER-002 | DEV-CONTENT-005 |
| DEV-TIER-005 | — | DEV-DIARY-008, DEV-VERSION-005, DEV-COLLAB-008, DEV-AI-012, DEV-AI-013 |
| DEV-CONTENT-001 | DEV-TIER-001 | DEV-CONTENT-002, DEV-CONTENT-003 |
| DEV-CONTENT-002 | DEV-CONTENT-001 | DEV-CONTENT-004, DEV-CONTENT-005, DEV-VERSION-001 |
| DEV-CONTENT-003 | DEV-CONTENT-001, DEV-COLLAB-007 | DEV-CONTENT-006, DEV-CONTENT-008 |
| DEV-CONTENT-004 | DEV-CONTENT-002 | DEV-CONTENT-005, DEV-CONTENT-007, DEV-CONTENT-008 |
| DEV-CONTENT-005 | DEV-CONTENT-004, DEV-TIER-004 | DEV-CONTENT-010, DEV-VERSION-002 |
| DEV-CONTENT-006 | DEV-CONTENT-003 | — |
| DEV-CONTENT-007 | DEV-CONTENT-004 | — |
| DEV-CONTENT-008 | DEV-CONTENT-003, DEV-CONTENT-004, DEV-TIER-005 | DEV-CONTENT-009 |
| DEV-CONTENT-009 | DEV-CONTENT-008 | DEV-CONTENT-010, DEV-AI-013 |
| DEV-CONTENT-010 | DEV-CONTENT-009, DEV-CONTENT-005 | — |
| DEV-VERSION-001 | DEV-CONTENT-002 | DEV-VERSION-002, DEV-VERSION-003 |
| DEV-VERSION-002 | DEV-VERSION-001, DEV-CONTENT-005, DEV-TIER-003 | DEV-VERSION-003 |
| DEV-VERSION-003 | DEV-VERSION-002, DEV-TIER-003 | DEV-VERSION-004, DEV-VERSION-005 |
| DEV-VERSION-004 | DEV-VERSION-003 | DEV-VERSION-005 |
| DEV-VERSION-005 | DEV-VERSION-004, DEV-TIER-005 | — |
| DEV-COLLAB-001 | DEV-TIER-001 | DEV-COLLAB-002, DEV-COLLAB-004, DEV-COLLAB-007 |
| DEV-COLLAB-002 | DEV-COLLAB-001, DEV-TIER-003 | DEV-COLLAB-003 |
| DEV-COLLAB-003 | DEV-COLLAB-002 | DEV-COLLAB-009 |
| DEV-COLLAB-004 | DEV-COLLAB-001 | DEV-COLLAB-005, DEV-COLLAB-006, DEV-COLLAB-008 |
| DEV-COLLAB-005 | DEV-COLLAB-004, DEV-COLLAB-007 | — |
| DEV-COLLAB-006 | DEV-COLLAB-004, DEV-COLLAB-007 | — |
| DEV-COLLAB-007 | DEV-COLLAB-001 | DEV-CONTENT-003, DEV-COLLAB-002, DEV-COLLAB-005, DEV-COLLAB-006 |
| DEV-COLLAB-008 | DEV-COLLAB-004, DEV-COLLAB-005, DEV-COLLAB-006, DEV-TIER-005 | — |
| DEV-COLLAB-009 | DEV-COLLAB-003 | — |
| DEV-DIARY-001 | DEV-TIER-001 | DEV-DIARY-002, DEV-DIARY-003, DEV-DIARY-004, DEV-DIARY-006 |
| DEV-DIARY-006 | DEV-DIARY-001 | DEV-DIARY-002, DEV-DIARY-003 |
| DEV-DIARY-002 | DEV-DIARY-001, DEV-TIER-003, DEV-DIARY-006 | DEV-DIARY-008 |
| DEV-DIARY-003 | DEV-DIARY-001, DEV-DIARY-006 | DEV-DIARY-008 |
| DEV-DIARY-004 | DEV-DIARY-001, DEV-TIER-003 | DEV-DIARY-005, DEV-DIARY-007 |
| DEV-DIARY-005 | DEV-DIARY-004 | — |
| DEV-DIARY-007 | DEV-DIARY-004, DEV-SEARCH-001, DEV-SEARCH-002 | — |
| DEV-DIARY-008 | DEV-DIARY-002, DEV-DIARY-003, DEV-DIARY-004, DEV-TIER-005 | — |
| DEV-FILE-001 | — | DEV-FILE-002, DEV-FILE-004 |
| DEV-FILE-002 | DEV-FILE-001, DEV-TIER-001 | DEV-FILE-003 |
| DEV-FILE-003 | DEV-FILE-002 | DEV-FILE-006 |
| DEV-FILE-004 | DEV-FILE-001 | DEV-FILE-005, DEV-FILE-007 |
| DEV-FILE-005 | DEV-FILE-004, DEV-SEARCH-001 | — |
| DEV-FILE-006 | DEV-FILE-003, DEV-SEARCH-001, DEV-SEARCH-002 | — |
| DEV-FILE-007 | DEV-FILE-003, DEV-FILE-004, DEV-FILE-005 | — |
| DEV-LINK-001 | — | DEV-LINK-002, DEV-LINK-003 |
| DEV-LINK-002 | DEV-LINK-001, DEV-TIER-001 | DEV-LINK-007 |
| DEV-LINK-003 | DEV-LINK-001 | DEV-LINK-004, DEV-LINK-005, DEV-LINK-008 |
| DEV-LINK-004 | DEV-LINK-003, DEV-SEARCH-001 | — |
| DEV-LINK-005 | DEV-LINK-003, DEV-TIER-003, DEV-LINK-006 | — |
| DEV-LINK-006 | — | DEV-LINK-007 |
| DEV-LINK-007 | DEV-LINK-006, DEV-SEARCH-001, DEV-SEARCH-002 | — |
| DEV-LINK-008 | DEV-LINK-002, DEV-LINK-003, DEV-LINK-004, DEV-LINK-005, DEV-TIER-005 | — |
| DEV-SEARCH-001 | — | DEV-SEARCH-002, DEV-FILE-006, DEV-LINK-007, DEV-DIARY-007 |
| DEV-SEARCH-002 | — | DEV-SEARCH-003, DEV-FILE-006, DEV-LINK-007, DEV-DIARY-007, DEV-AI-007 |
| DEV-SEARCH-003 | DEV-SEARCH-001, DEV-SEARCH-002 | DEV-SEARCH-004, DEV-AI-007 |
| DEV-SEARCH-004 | DEV-SEARCH-003 | — |
| DEV-AI-001 | — | DEV-AI-004 |
| DEV-AI-002 | — | DEV-AI-008, DEV-AI-009 |
| DEV-AI-003 | — | DEV-AI-004 |
| DEV-AI-004 | DEV-AI-001, DEV-AI-003, DEV-AI-005, DEV-TIER-003 | DEV-AI-012 |
| DEV-AI-005 | — | DEV-AI-004 |
| DEV-AI-006 | — | DEV-AI-007 |
| DEV-AI-007 | DEV-AI-006, DEV-SEARCH-001, DEV-SEARCH-002, DEV-AI-003 | DEV-AI-008, DEV-AI-010 |
| DEV-AI-008 | DEV-AI-007, DEV-AI-002 | DEV-AI-011 |
| DEV-AI-009 | DEV-AI-002 | DEV-AI-011 |
| DEV-AI-010 | DEV-AI-007, DEV-TIER-003 | DEV-AI-013 |
| DEV-AI-011 | DEV-AI-008, DEV-AI-009 | — |
| DEV-AI-012 | DEV-AI-004, DEV-TIER-005 | — |
| DEV-AI-013 | DEV-AI-010, DEV-CONTENT-009, DEV-TIER-005 | — |

### Critical Path

```
Critical Path (longest sequential dependency chain):
DEV-TIER-001 → DEV-CONTENT-001 → DEV-CONTENT-002 → DEV-CONTENT-004
→ DEV-CONTENT-005 → DEV-CONTENT-009 → DEV-AI-013

Parallelisable streams (can start independently of each other):
  Stream A: DEV-TIER-001/002/003/004/005 (tier foundation — unblock all)
  Stream B: DEV-SEARCH-001 + DEV-SEARCH-002 (unblock all indexing jobs)
  Stream C: DEV-FILE-001 + DEV-FILE-002 + DEV-LINK-001 + DEV-LINK-006 (storage + crawler)
  Stream D: DEV-AI-001 + DEV-AI-002 + DEV-AI-003 + DEV-AI-005 + DEV-AI-006 (AI foundation)
  Stream E: DEV-COLLAB-001 (unblock collaboration)
```

---

## 5. Open Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| 1 | Editor.js block schema changes break page content JSON | Medium | High | Version the block schema; migration path for old content |
| 2 | Qdrant not available in dev/CI | Low | High | Mock QdrantService in unit tests; real Qdrant for integration tests via docker-compose |
| 3 | OpenAI embedding costs for indexing at scale | Medium | Medium | Cache embeddings; only re-embed on content change |
| 4 | Link crawler blocked by rate limits / CAPTCHAs | High | Medium | Polite crawling (1 req/domain/min); graceful crawl_failed status |
| 5 | Test cases (TC-AUTH-xxx) reference old endpoint paths | High | Medium | Update test cases to match actual implementation before automation |
| 6 | Tier field not in current Accounts model | High | High | DEV-TIER-001 is pre-requisite for all gated features — ship first |

---

## 6. Out of Scope (This Phase)

- Payment / subscription management (tier upgrades are manual for now)
- Browser extension
- Mobile app
- Email provider migration from Mailtrap to SendGrid in production
- Public page sharing / guest access
- Multi-workspace AI model configs (one per workspace)
