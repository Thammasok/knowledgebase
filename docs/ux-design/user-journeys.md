# User Journeys — Knowledgebase GPT

**Traces to:** REQ-PLATFORM-001, docs/ux-design/user-personas.md
**Date:** 2026-03-28

---

## UJ-AUTH-001 — New User Registers and Activates Account

**Traces to:** US-AUTH-001, US-AUTH-002
**Persona:** Alex (Free User)
**Goal:** Create an account and reach an active workspace

| Stage | User Action | System Response | Emotion | Touchpoint |
|-------|-------------|-----------------|---------|------------|
| 1. Landing | Visits homepage; clicks "Get started free" | Marketing page loads | 😊 Curious | `/` landing page |
| 2. Register form | Fills displayName, email, password | Inline validation on blur | 😐 Focused | `/register` |
| 3. Submit | Clicks "Create account" | Shows "Check your inbox" confirmation screen | 😊 Hopeful | `/register` → confirmation UI |
| 4. Email | Opens verification email | Clicks "Verify email" link | 😊 Engaged | Email client |
| 5. Verified | Lands on app post-verification | Redirect to workspace creation prompt | 😊 Excited | `/onboarding` |
| 6. Workspace | Names first workspace | Workspace created; empty sidebar shown | 😊 Ready | `/workspace/new` |

**Pain Points:**
- Verification email may land in spam — mitigation: "Didn't get it? Resend" visible immediately
- Password requirements not obvious until error — mitigation: show requirements on focus, not on error

**Opportunities:**
- Inline password strength meter (shows progress as user types)
- Skip to "Continue with Google" above the form (reduces friction for OAuth users)

---

## UJ-AUTH-002 — Returning User Logs In

**Traces to:** US-AUTH-002
**Persona:** Alex, Jordan, Sam

| Stage | User Action | System Response | Emotion | Touchpoint |
|-------|-------------|-----------------|---------|------------|
| 1. Login page | Enters email + password | — | 😐 Routine | `/login` |
| 2. Submit | Clicks "Sign in" | Validates, issues tokens | 😊 | `/login` |
| 3. Workspace | — | Redirects to last-visited workspace | 😊 Efficient | `/workspace/:slug` |

**Alternate: OAuth path**

| Stage | User Action | System Response | Emotion | Touchpoint |
|-------|-------------|-----------------|---------|------------|
| 1. Login | Clicks "Continue with Google" | OAuth popup / redirect | 😊 | `/login` |
| 2. Google | Selects Google account | Callback returns token | 😊 | Google OAuth |
| 3. App | — | Redirects to workspace | 😊 Fast | `/workspace/:slug` |

---

## UJ-WS-001 — Owner Invites Team Members

**Traces to:** US-COLLAB-001, US-WS-002
**Persona:** Jordan (Owner, Startup)
**Goal:** Add three engineers to a new shared workspace

| Stage | User Action | System Response | Emotion | Touchpoint |
|-------|-------------|-----------------|---------|------------|
| 1. Settings | Opens Workspace Settings → Members | Member list loads | 😊 | `/settings/members` |
| 2. Invite | Clicks "Invite member"; enters email + role | Form opens inline | 😊 | Settings modal |
| 3. Send | Clicks "Send invite" | Toast: "Invite sent to bob@co.com" | 😊 | Settings / toast |
| 4. Pending | Sees pending invite in list | Row shows "Pending" badge + expiry | 😊 | Members table |
| 5. Accepted | Bob accepts invite (email flow) | Bob's row updates to "Member" | 😊 Satisfied | Members table |

**Pain Points:**
- Inviting 3 people one at a time is tedious → opportunity for bulk invite (Phase 2)
- No visibility into whether invite email was delivered

**Opportunities:**
- Copy invite link as fallback when email unreachable
- "Re-send" action on pending invites

---

## UJ-PAGE-001 — User Creates and Writes a Page

**Traces to:** US-PAGE-001, US-AI-003
**Persona:** Sam (Member)
**Goal:** Write a technical spec using the editor

| Stage | User Action | System Response | Emotion | Touchpoint |
|-------|-------------|-----------------|---------|------------|
| 1. New page | Clicks "+" next to folder in sidebar | Untitled page created; cursor in title | 😊 Fast | Sidebar |
| 2. Title | Types page title | Title saved on blur | 😊 | Editor title field |
| 3. Write | Types content in editor; uses `/` for block types | Block menu appears | 😊 Engaged | Editor body |
| 4. AI assist | Types `/ai`, enters prompt | AI generation overlay; content inserted | 😊 Delighted | Editor |
| 5. Auto-save | Stops typing for 2s | Subtle "Saved" indicator in header | 😊 Reassured | Editor header |
| 6. Navigate away | Clicks another page in sidebar | — | 😊 Content navigates | Sidebar |
| 7. Return | Clicks back to page | Content exactly as left | 😊 | Editor |

**Pain Points:**
- Block toolbar hidden until hovered — discoverability issue for new users
- Auto-save indicator too subtle (easy to miss) → use a consistent "Saved" pill

**Opportunities:**
- Floating `/ai` shortcut visible when paragraph is empty (like Notion's "+" affordance)
- Keyboard shortcut `Cmd+/` for block type switcher

---

## UJ-AI-001 — User Queries Knowledge Base via AI Chat

**Traces to:** US-AI-002, US-AI-FREE-001
**Persona:** Alex (Personal), Jordan (Startup Owner)
**Goal:** Get an answer from accumulated notes without manually searching

| Stage | User Action | System Response | Emotion | Touchpoint |
|-------|-------------|-----------------|---------|------------|
| 1. Open chat | Clicks "AI Chat" in sidebar | Chat interface opens; empty state shown | 😊 | `/chat` |
| 2. Type question | Types "What did I decide about auth approach?" | Streaming response appears | 😊 Engaged | Chat input |
| 3. Answer | Reads AI answer | Sources panel shows 3 referenced pages | 😊 Satisfied | Chat + sources |
| 4. Navigate | Clicks source link | Opens page in new tab/pane | 😊 | Source citation |
| 5. Follow-up | Types follow-up question | Maintains conversation context | 😊 | Chat |
| 6. History | Returns next day; opens past conversation | Full history preserved | 😊 | Conversation list |

**Pain Points:**
- No clear indication of RAG scope on Free (notes+files only) — user may wonder why link content isn't surfaced
- Streaming response latency anxiety — add typing indicator immediately

**Opportunities:**
- Conversation title auto-generated from first message
- "Copy answer" and "Share" actions on responses
- Folder scope toggle for focused queries

---

## UJ-FILE-001 — User Uploads and Queries a PDF

**Traces to:** US-FILE-001, US-AI-002
**Persona:** Alex (Personal)
**Goal:** Upload a research paper and ask questions about it

| Stage | User Action | System Response | Emotion | Touchpoint |
|-------|-------------|-----------------|---------|------------|
| 1. Upload | Drags PDF onto page editor | Upload progress indicator | 😊 | Editor / file widget |
| 2. Processing | Waits | "Processing…" badge; turns "Indexed" after ~10s | 😐 Waiting | File card |
| 3. Query | Opens AI chat; asks about PDF content | AI retrieves chunks from PDF | 😊 Delighted | Chat |
| 4. Free tier attempt | Free user uploads 6MB PDF | "File too large — 5MB max on Free plan. Upgrade?" prompt | 😟 Frustrated | Upload widget |

**Pain Points:**
- Processing time uncertainty — progress indicator helps but no ETA
- Free tier 5MB limit hit unexpectedly — must be communicated before upload, not after

**Opportunities:**
- Show file size limit in upload widget before selection
- "Upgrade" CTA in tier-limit error is contextual (not generic)

---

## UJ-SEARCH-001 — User Performs Semantic Search

**Traces to:** US-SEARCH-001
**Persona:** All

| Stage | User Action | System Response | Emotion | Touchpoint |
|-------|-------------|-----------------|---------|------------|
| 1. Trigger | Presses `Cmd+K` or clicks search bar | Command palette / search modal opens | 😊 | Global search |
| 2. Type query | Starts typing natural language query | Optimistic results appear as typing (debounced) | 😊 | Search modal |
| 3. Results | Reads result list | Each result: type icon, title, excerpt, source | 😊 | Search results |
| 4. Navigate | Clicks result | Navigates to source page, highlights match | 😊 | Page |
| 5. No results | Query returns empty | "No results found — try broader terms" + suggestion | 😐 | Search modal |

**Pain Points:**
- Users type exact keywords by habit; semantic search may return unexpected results initially
- Need visual indication this is semantic (not keyword) search

**Opportunities:**
- Show "Searching by meaning" badge to set expectations
- Keyboard-navigable results (↑↓ arrows + Enter)
- Recent searches persisted in local storage
