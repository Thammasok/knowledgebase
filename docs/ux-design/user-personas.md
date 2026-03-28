# User Personas — Knowledgebase GPT

**Traces to:** REQ-PLATFORM-001 §2 Actors
**Date:** 2026-03-28

---

## P1 — Alex, the Solo Knowledge Worker (Free → Personal)

**Role:** Independent consultant / researcher
**Tier:** Starts Free, upgrades to Personal within 30 days
**Age:** 28–40 | **Tech savvy:** High

### Goals
- Capture research notes, bookmarks, and documents in one place
- Find information fast without remembering exact wording
- Use AI to summarize and synthesize without paying for multiple tools

### Pain Points
- Current tools (Notion + browser bookmarks + Google Drive) are fragmented
- Loses track of links saved weeks ago
- Spends time re-reading whole documents to find one fact

### Behaviours
- Heavy keyboard user; prefers shortcuts
- Creates a lot of pages with sub-pages (hierarchical note-taker)
- Opens 10–20 browser tabs of research; needs to save them fast
- Checks diary entries to track how thinking evolved on a topic

### Key Scenarios
- US-AUTH-001 (register), US-WS-001 (workspace), US-PAGE-001 (writing), US-LINK-002 (link fetch), US-DIARY-001 (diary), US-AI-002 (full RAG chat)

### Design Implications
- **Speed of capture is critical** — saving a link or creating a page must be ≤2 taps/clicks
- Sidebar tree must handle 50+ pages without feeling cluttered
- Search must feel instant (optimistic UI while Qdrant responds)
- Upgrade prompts must be informative, not punitive

---

## P2 — Jordan, the Team Lead (Startup Tier)

**Role:** Engineering manager at a 12-person startup
**Tier:** Startup (Owner)
**Age:** 32–45 | **Tech savvy:** High

### Goals
- Build a shared team knowledge base (RFCs, runbooks, meeting notes)
- Control who can edit vs. read (interns = Viewer, engineers = Member)
- Query the team knowledge base via AI — "what did we decide about auth?"

### Pain Points
- Team knowledge is siloed in Slack threads and private Notion pages
- New hires take weeks to get up to speed
- Meeting notes never get updated; stale docs cause bugs

### Behaviours
- Creates workspaces per project/quarter
- Assigns Viewer role broadly; Member role to active contributors
- Uses AI chat daily to cross-reference decisions across docs
- Shares specific pages with stakeholders (Viewer link)

### Key Scenarios
- US-WS-002, US-COLLAB-001, US-COLLAB-002, US-AI-002 (team RAG)

### Design Implications
- Member list and role management must be scannable at a glance
- Invitation flow must handle bulk invites (Phase 2)
- AI chat must clearly attribute sources to specific team members' docs
- Permission denied states must be clear and non-blocking for Viewers

---

## P3 — Sam, the Team Contributor (Member)

**Role:** Software engineer at a startup
**Tier:** Startup (Member via invitation)
**Age:** 24–35 | **Tech savvy:** High

### Goals
- Find answers in the team knowledge base without bothering teammates
- Write and update docs as part of daily workflow
- Use AI on the team's docs, not just their own

### Pain Points
- Can never find the right doc on first try
- Doesn't know which version of a doc is current
- Wants AI suggestions while writing, not just in a separate chat

### Behaviours
- Writes docs collaboratively; references other pages frequently
- Uses in-editor AI to draft first versions of specs
- Searches multiple times per day
- Rarely changes workspace settings

### Key Scenarios
- US-PAGE-001, US-AI-003 (in-editor), US-SEARCH-001, US-AI-002

### Design Implications
- In-editor `/ai` command must feel native (slash command UX pattern)
- Search bar should be persistent and accessible from keyboard shortcut
- Version history must be easy to find without hunting through menus

---

## P4 — Casey, the Viewer / Stakeholder

**Role:** Product manager / external stakeholder
**Tier:** Startup (Viewer)
**Age:** 28–50 | **Tech savvy:** Medium

### Goals
- Read team documents without needing to create an account for every workspace
- Search for specific information in shared workspaces
- Not accidentally edit or break anything

### Pain Points
- Frustrated by read-only restrictions when they want to comment
- Confused by feature-gated UI (why is the button greyed out?)

### Key Scenarios
- US-COLLAB-002 AC-3 (Viewer restrictions), US-SEARCH-001

### Design Implications
- Blocked actions must explain WHY (tooltip: "Viewers cannot edit — ask your Owner to upgrade your role")
- UI should not show disabled buttons for every write action — hide where appropriate, disable with explanation where visible
- Search and reading must work flawlessly for Viewers
