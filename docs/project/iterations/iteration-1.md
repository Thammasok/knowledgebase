# Iteration 1 — Tier Foundation + Content Organization (Happy Path)

**Goal:** A logged-in user can create folders and pages in their workspace, edit page content, and the system enforces the Free tier block limit infrastructure.

**Duration:** 2 weeks
**Stories in scope:** US-WS-001 (block limit infra), US-ORG-001, US-PAGE-001 (happy path)
**Priority:** Must Have

---

## Scenarios in Scope

- SC-WS-003: Free tier block limit enforcement
- SC-ORG-001: Create folder and nested page
- SC-ORG-004: Page auto-save

---

## Test Cases — Definition of Done

**P1 (must all pass before iteration is done):**
- TC-WS-007: Free user at 1,000 blocks — blocked (403 BLOCK_LIMIT_REACHED)
- TC-WS-008: Block limit hit — upgrade prompt data returned
- TC-ORG-001: Folder created; appears in sidebar
- TC-ORG-002: Page created under folder
- TC-ORG-005: Content persisted after 2s idle; navigating away and back shows latest

**P2 (target — carry to Iteration 2 if not ready):**
- TC-WS-009: Startup user creates shared workspace (needs COLLAB)
- TC-ORG-003: 4th-level folder rejected (nesting depth)
- TC-ORG-004: 6th-level sub-page rejected

---

## Developer Tasks

| Task | Title | Layer | Complexity |
|------|-------|-------|-----------|
| DEV-TIER-001 | Add tier field to Accounts + migration | DB | S |
| DEV-TIER-002 | Add blockCount to Workspace + migration | DB | S |
| DEV-TIER-004 | BlockQuota service — enforce 1,000 block limit | Domain | M |
| DEV-TIER-005 | Frontend: UpgradeBanner + PlanGate component | Frontend | S |
| DEV-CONTENT-001 | Folder schema + migration | DB | S |
| DEV-CONTENT-002 | Page schema + migration | DB | M |
| DEV-CONTENT-003 | Folders API — GET/POST/PATCH/DELETE | API | M |
| DEV-CONTENT-004 | Pages API — GET/POST/PATCH/DELETE | API | M |
| DEV-CONTENT-005 | Page content update with block quota | API+Domain | M |
| DEV-CONTENT-008 | Frontend: Sidebar with folder/page hierarchy | Frontend | L |
| DEV-CONTENT-009 | Frontend: Editor.js page editor | Frontend | L |
| DEV-CONTENT-010 | Frontend: Auto-save (2s debounce) | Frontend | S |

> **Note:** DEV-TIER-003 (TierGuard middleware) is deferred to Iteration 2 — it's needed for collaboration and diary gating, which ship in Iteration 2–4. DEV-CONTENT-006 and DEV-CONTENT-007 (nesting depth validation) can be shipped mid-iteration as they are simple additions to DEV-CONTENT-003/004.

---

## NFRs Enforced This Iteration

- NFR-PERF: Page content auto-save within 2s of last keystroke (SC-ORG-004)
- ADR-002: Block quota counter maintained atomically in Workspace.blockCount

---

## Increment

At the end of Iteration 1, the following works end-to-end:

> A logged-in user can open their workspace, create folders in the sidebar, create pages inside folders (or as root pages), and edit page content with Editor.js blocks. Changes are automatically saved after 2 seconds. If a Free-tier user adds blocks beyond 1,000, they see an upgrade prompt and the block is not saved. All P1 test cases pass in the dev environment.
