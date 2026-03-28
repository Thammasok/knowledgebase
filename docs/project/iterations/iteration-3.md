# Iteration 3 — Team Collaboration (Startup Tier)

**Goal:** A Startup-tier workspace owner can invite members, assign roles, and the permission system (Owner/Member/Viewer) is enforced across all content endpoints.

**Duration:** 2 weeks
**Stories in scope:** US-COLLAB-001, US-COLLAB-002
**Priority:** Must Have

---

## Scenarios in Scope

- SC-COLLAB-001: Owner invites team member
- SC-COLLAB-002: Duplicate invitation blocked
- SC-COLLAB-003: Invitation link expiry
- SC-COLLAB-004: Owner changes member role
- SC-COLLAB-005: Viewer access enforcement
- SC-COLLAB-006: Owner cannot remove themselves
- SC-WS-004: Startup user creates shared workspace
- SC-WS-005: Non-Startup user cannot invite members

---

## Test Cases — Definition of Done

**P1 (must all pass):**
- TC-WS-009: Startup user creates shared workspace; invite flow available
- TC-WS-010: Personal tier blocked from invite — 403 PLAN_REQUIRED
- TC-WS-011: Free tier blocked from invite — 403 PLAN_REQUIRED
- TC-COLLAB-001: Invite sent; email dispatched; user added on accept
- TC-COLLAB-002: Invite works for new user (creates account) and existing user
- TC-COLLAB-003: Duplicate invite rejected — 409 PENDING_INVITE_EXISTS
- TC-COLLAB-004: Expired invite token — 410 INVITE_EXPIRED
- TC-COLLAB-005: Viewer upgraded to Member; new permissions apply immediately
- TC-COLLAB-006: Member downgraded to Viewer
- TC-COLLAB-007: Viewer cannot create content — 403 FORBIDDEN
- TC-COLLAB-008: Viewer cannot access AI chat
- TC-COLLAB-009: Owner cannot remove themselves — 400 OWNER_CANNOT_REMOVE_SELF

**P2 (target):**
- Edge cases: invitation email delivery failure (account still created)
- Multiple pending invites management

---

## Developer Tasks

| Task | Title | Layer | Complexity |
|------|-------|-------|-----------|
| DEV-COLLAB-001 | WorkspaceMember + WorkspaceInvitation schemas + migrations | DB | M |
| DEV-COLLAB-007 | Permission guard middleware (Owner/Member/Viewer) | Middleware | M |
| DEV-COLLAB-002 | POST /workspace/:id/invitations | API+Email | M |
| DEV-COLLAB-003 | POST /workspace/invitations/accept | API | M |
| DEV-COLLAB-004 | GET /workspace/:id/members | API | S |
| DEV-COLLAB-005 | PATCH /workspace/:id/members/:memberId | API | S |
| DEV-COLLAB-006 | DELETE /workspace/:id/members/:memberId | API | M |
| DEV-COLLAB-008 | Frontend: Members settings page + invite form | Frontend | M |
| DEV-COLLAB-009 | Frontend: Invitation accept page | Frontend | S |

> **Note:** DEV-COLLAB-007 must ship before DEV-CONTENT-003/004 are updated — apply roleGuard to folder and page write routes as part of this iteration.

---

## NFRs Enforced This Iteration

- NFR-SEC: Invitation tokens are cryptographically random (≥32 bytes)
- NFR-SEC: Viewer role enforced at API middleware layer — not just UI
- Invite expiry: 7 days from send time (enforced server-side)

---

## Increment

At the end of Iteration 3, the following works end-to-end:

> A Startup-tier workspace owner can send email invitations to new or existing users, assign them Member or Viewer roles, and manage the team from the Members settings page. Invitees can accept via the invite link. Viewers can read content but are blocked from all write operations and AI chat. Free and Personal tier users see an upgrade prompt when they try to invite members.
