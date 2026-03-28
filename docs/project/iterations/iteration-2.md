# Iteration 2 — Content Hardening + Tier Guards

**Goal:** Content organization is robust against depth limits, tier guards are in place for future gated features, and version history infrastructure is ready for Personal-tier content.

**Duration:** 1 week
**Stories in scope:** US-ORG-001 (hardening), US-PAGE-001 (hardening), US-VERSION-001
**Priority:** Must Have

---

## Scenarios in Scope

- SC-ORG-002: Folder nesting depth limit (max 3 levels)
- SC-ORG-003: Sub-page nesting depth limit (max 5 levels)
- SC-ORG-005: Free tier block limit on page edit
- SC-VERSION-001: View and restore version history
- SC-VERSION-002: Free tier blocked from version history

---

## Test Cases — Definition of Done

**P1 (must all pass):**
- TC-ORG-003: 4th-level folder rejected — 400 MAX_NESTING_DEPTH
- TC-ORG-004: 6th-level sub-page rejected — 400 MAX_NESTING_DEPTH
- TC-ORG-006: Free user at block limit: block not added, 403 returned
- TC-VERSION-001: Version list shows timestamps + author
- TC-VERSION-002: Restore replaces content; new snapshot created
- TC-VERSION-003: Free tier cannot access version history — 403 PLAN_REQUIRED

**P2 (target):**
- TC-WS-010: Personal tier cannot invite members — 403 PLAN_REQUIRED
- TC-WS-011: Free tier cannot invite members — 403 PLAN_REQUIRED

---

## Developer Tasks

| Task | Title | Layer | Complexity |
|------|-------|-------|-----------|
| DEV-TIER-003 | TierGuard middleware | Middleware | M |
| DEV-CONTENT-006 | Folder nesting depth validation (max 3) | Domain | S |
| DEV-CONTENT-007 | Page nesting depth validation (max 5) | Domain | S |
| DEV-VERSION-001 | PageVersion schema + migration | DB | S |
| DEV-VERSION-002 | Snapshot service — save version on content update | Domain | M |
| DEV-VERSION-003 | GET /pages/:id/versions | API | S |
| DEV-VERSION-004 | POST /pages/:id/versions/:versionId/restore | API+Domain | M |
| DEV-VERSION-005 | Frontend: Version history panel + restore | Frontend | M |

---

## NFRs Enforced This Iteration

- NFR-SEC: TierGuard returns 403 PLAN_REQUIRED (not 401) — no information about feature until upgrade
- ADR-002: Block count remains consistent under concurrent edits (Prisma transaction in BlockQuotaService)

---

## Increment

At the end of Iteration 2, the following works end-to-end:

> Folder and page nesting is enforced at depth limits. Free-tier users cannot exceed 1,000 blocks. Personal/Startup users can view version history for any page and restore past snapshots. Free users see the upgrade prompt on the Version History button. TierGuard middleware is ready to protect diary, collaboration, and AI endpoints in upcoming iterations.
