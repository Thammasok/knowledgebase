# Wireframes — Knowledgebase GPT

**Traces to:** REQ-PLATFORM-001, docs/ux-design/user-journeys.md
**Framework:** Next.js 16 + Tailwind v4 + shadcn/ui
**Date:** 2026-03-28

---

## WF-AUTH-001 — Registration Screen

**Traces to:** UJ-AUTH-001, US-AUTH-001
**Screen Purpose:** New user creates an account

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│           🔖  Knowledgebase                             │
│                                                         │
│         ┌─────────────────────────────────┐             │
│         │         Create your account     │             │
│         │                                 │             │
│         │  ┌─────────────────────────┐    │             │
│         │  │ Continue with Google    │    │             │
│         │  └─────────────────────────┘    │             │
│         │                                 │             │
│         │  ──────── or ────────           │             │
│         │                                 │             │
│         │  Display name                   │             │
│         │  [________________________]     │             │
│         │                                 │             │
│         │  Email address                  │             │
│         │  [________________________]     │             │
│         │                                 │             │
│         │  Password                       │             │
│         │  [________________________] 👁  │             │
│         │  ░░░░░░░░░░░░ strength meter     │             │
│         │  ✓ 8+ chars  ✓ uppercase        │             │
│         │  ✓ digit     ✗ special char     │             │
│         │                                 │             │
│         │  [   Create account   ]         │             │
│         │                                 │             │
│         │  Already have an account?       │             │
│         │  Sign in →                      │             │
│         └─────────────────────────────────┘             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Elements

| Element | Type | Interaction |
|---------|------|-------------|
| Google OAuth button | Button (outline, full width) | Opens Google OAuth flow |
| displayName input | Text input | Validate on blur: 2–50 chars, alphanumeric |
| Email input | Email input | Validate on blur: RFC email |
| Password input | Password input + eye toggle | Strength meter updates live |
| Password requirements | Checklist | Live: tick each rule as met |
| Create account button | Button (primary, full width) | Submit; disabled until all rules met |
| Sign in link | Text link | Navigate to `/login` |

### States

- **Default:** All fields empty; button disabled
- **Filling:** Live validation; requirement checklist updates
- **Error:** Red border + error message below field; button disabled
- **Loading:** Button shows spinner; form disabled
- **Success:** Redirect to email confirmation screen

### Responsive
| Breakpoint | Layout |
|------------|--------|
| Desktop | Centered card (440px wide) on white/grey background |
| Mobile | Full-width card; edge-to-edge with 16px horizontal padding |

---

## WF-AUTH-002 — Login Screen

**Traces to:** UJ-AUTH-002, US-AUTH-002

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│           🔖  Knowledgebase                             │
│                                                         │
│         ┌─────────────────────────────────┐             │
│         │         Welcome back            │             │
│         │                                 │             │
│         │  ┌─────────────────────────┐    │             │
│         │  │ Continue with Google    │    │             │
│         │  └─────────────────────────┘    │             │
│         │                                 │             │
│         │  ──────── or ────────           │             │
│         │                                 │             │
│         │  Email address                  │             │
│         │  [________________________]     │             │
│         │                                 │             │
│         │  Password                       │             │
│         │  [________________________] 👁  │             │
│         │                       Forgot?   │             │
│         │                                 │             │
│         │  [        Sign in        ]      │             │
│         │                                 │             │
│         │  Don't have an account?         │             │
│         │  Create one for free →          │             │
│         └─────────────────────────────────┘             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Error State (invalid credentials)
```
│  ┌────────────────────────────────────┐  │
│  │ ⚠ Invalid email or password        │  │
│  └────────────────────────────────────┘  │
```

Note: Generic error — does not disclose whether email exists.

---

## WF-APP-001 — Main Application Layout

**Traces to:** US-ORG-001, US-PAGE-001, all content features
**Screen Purpose:** Primary working environment after login

```
┌──────────────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────────────────────────┐  │
│ │          │ │ Breadcrumb: My Workspace / Engineering / Spec  │  │
│ │  SIDEBAR │ │                           [Search] [AI] [···]  │  │
│ │  (240px) │ ├────────────────────────────────────────────────┤  │
│ │          │ │                                                │  │
│ │ 🔖 Logo  │ │              PAGE EDITOR AREA                 │  │
│ │          │ │                                                │  │
│ │ ⌕ Search │ │  # Authentication Architecture                │  │
│ │          │ │                                                │  │
│ │ + New    │ │  Start writing, or press / for commands…      │  │
│ │          │ │                                                │  │
│ │ Favorites│ │                                                │  │
│ │ ──────── │ │                                                │  │
│ │ 📁 Eng   │ │                                                │  │
│ │  📄 Auth │ │                                                │  │
│ │  📄 DB   │ │                                                │  │
│ │ 📁 Ops   │ │                                                │  │
│ │  📄 SRE  │ │                                                │  │
│ │ ──────── │ │                                                │  │
│ │ 📔 Diary │ │                                                │  │
│ │ 🤖 AI    │ │                                                │  │
│ │ 📁 Files │ │                                                │  │
│ │ 🔗 Links │ │                                                │  │
│ │ ──────── │ │                                                │  │
│ │ ⚙ Settings│ │                                               │  │
│ │ 👤 Alex  │ │                                                │  │
│ └──────────┘ └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Sidebar Sections

| Section | Contents | Tier |
|---------|----------|------|
| Search | `Cmd+K` trigger | All |
| New | Quick-create: Page, Folder, Link, File | Owner/Member |
| Favorites | Pinned pages (user-defined) | All |
| Workspace tree | Folders → Pages (collapsible, drag-drop) | All |
| Diary | Link to Diary module | Personal/Startup only |
| AI | Link to AI Chat | Owner/Member |
| Files | File library | All |
| Links | Saved links | All |
| Settings | Workspace settings | Owner |
| User avatar | Profile + logout | All |

### Responsive
| Breakpoint | Layout |
|------------|--------|
| Desktop (≥1024px) | Sidebar fixed left; editor fills rest |
| Tablet (768–1024px) | Sidebar collapsible; hamburger to toggle |
| Mobile (<768px) | Sidebar hidden; bottom nav bar for primary sections |

---

## WF-EDITOR-001 — Page Editor

**Traces to:** US-PAGE-001, US-AI-003

```
┌───────────────────────────────────────────────────────┐
│  [←] My Workspace / Engineering / Auth Spec   [···]   │
│  ─────────────────────────────────────────────────    │
│                                                       │
│  Authentication Architecture                          │  ← title input
│  ──────────────────────────────────────────────────  │
│                                                       │
│  We decided to use JWT + refresh token strategy...    │  ← paragraph block
│                                                       │
│  > [+] │  ← hover affordance for block insertion     │
│                                                       │
│  ┌──────────────────────────────────────┐             │
│  │ Type '/' for commands               │             │  ← empty block hint
│  └──────────────────────────────────────┘             │
│                                                       │
│                                                       │
│  ─────────────────────────────────────── Saved ✓     │  ← autosave indicator
└───────────────────────────────────────────────────────┘
```

### Block Insert Menu (`/` command)

```
┌─────────────────────────────┐
│ /text    Paragraph          │
│ /h1      Heading 1          │
│ /h2      Heading 2          │
│ /list    Bulleted list       │
│ /num     Numbered list       │
│ /code    Code block          │
│ /table   Table               │
│ /image   Image               │
│ /file    Attach file         │
│ /link    Embed link          │
│ /ai      ✨ AI Generate      │  ← Personal/Startup only
└─────────────────────────────┘
```

### AI Generation Overlay (`/ai`)

```
┌────────────────────────────────────────────────┐
│ ✨ AI Generate                            [×]  │
│ ─────────────────────────────────────────────  │
│ What would you like to write?                  │
│ [Write an introduction to JWT auth...       ]  │
│                                                │
│ [   Generate   ]  [  Cancel  ]                 │
└────────────────────────────────────────────────┘
```

After generation:
```
┌────────────────────────────────────────────────┐
│ ✨ AI Suggestion                          [×]  │
│ ─────────────────────────────────────────────  │
│ JWT (JSON Web Token) is a compact, URL-safe   │
│ means of representing claims between two       │
│ parties...                                     │
│                                                │
│ [  Accept  ]  [  Discard  ]  [  Regenerate  ] │
└────────────────────────────────────────────────┘
```

### Inline Toolbar (text selected)

```
  ┌───────────────────────────────────────┐
  │ B  I  U  S  Code  Link  Color  ···   │
  └───────────────────────────────────────┘
```

---

## WF-EDITOR-002 — Version History Panel

**Traces to:** US-VERSION-001
**Trigger:** `···` menu → "Version history" (Personal/Startup only)

```
┌─────────────────────────────────────────────────────┐
│ Editor (dimmed)          │ Version History          │
│ ─────────────────────────│ ───────────────────────  │
│ [Page content shown in   │ Today                    │
│  read-only mode]         │  ● 2:34 PM   You         │
│                          │  ● 11:20 AM  Sam Lee     │
│  Viewing version from    │                          │
│  2:34 PM — Today         │ Yesterday                │
│  [Restore this version]  │  ○ 4:51 PM   You         │
│  [← Back to current]     │  ○ 9:14 AM   Jordan K.  │
│                          │                          │
│                          │  3 days ago              │
│                          │  ○ 2:00 PM   You         │
└─────────────────────────────────────────────────────┘
```

**Free Tier Gate:**
```
┌─────────────────────────────────────────────┐
│                                             │
│  🔒  Version History                        │
│                                             │
│  Track every change and restore past        │
│  versions on the Personal plan.             │
│                                             │
│  [  Upgrade to Personal  ]                  │
│  [  Not now              ]                  │
│                                             │
└─────────────────────────────────────────────┘
```

---

## WF-AI-001 — AI Chat Interface

**Traces to:** US-AI-002, US-AI-FREE-001

```
┌───────────────────────────────────────────────────────┐
│  AI Chat                          [+ New chat]  [···] │
│  ─────────────────────────────────────────────────    │
│                                                       │
│  ┌──────────┐                                         │
│  │ History  │  ←  conversation list (left panel)     │
│  │ ──────── │                                         │
│  │ Auth Q   │  ●                                      │
│  │ DB perf  │                                         │
│  │ Onboard  │                                         │
│  └──────────┘                                         │
│                                                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │  What did we decide about authentication?        │ │
│  └────────────────────────────────────── [You] ──── │ │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ 🤖 Based on your notes, you decided to use     │  │
│  │    JWT access tokens (15 min) paired with      │  │
│  │    refresh tokens (30 days). The key reason    │  │
│  │    was support for multi-device sessions...    │  │
│  │                                                │  │
│  │    Sources:                                    │  │
│  │    📄 Auth Spec  📄 ADR-001  📄 April Meeting  │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Ask anything about your knowledge base...      │  │
│  │                               [Scope ▾] [Send] │  │
│  └─────────────────────────────────────────────────┘  │
│  Searching: All content  ▾  (Folder: None)            │
└───────────────────────────────────────────────────────┘
```

### Scope Selector Dropdown

```
┌──────────────────────────┐
│ Scope RAG to:            │
│ ● All content            │
│ ○ Folder: Engineering    │
│ ○ Folder: Ops            │
│ ○ Current page only      │
└──────────────────────────┘
```

### Viewer Blocked State

```
│  ┌──────────────────────────────────────────────┐  │
│  │                                              │  │
│  │  🔒 AI Chat is not available for Viewers.   │  │
│  │                                              │  │
│  │  Ask your workspace Owner to upgrade your    │  │
│  │  role to Member to use AI features.          │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│  [Chat input disabled]                              │
```

---

## WF-SEARCH-001 — Global Search Modal (`Cmd+K`)

**Traces to:** US-SEARCH-001

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔍  Search your knowledge base...     [Esc] │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Searching by meaning  ·  All content types         │
│                                                     │
│  ─── Results ────────────────────────────────       │
│                                                     │
│  📄  Authentication Architecture          Note      │
│      "…decided to use JWT + refresh token…"         │
│      Engineering / Auth Spec  ·  2 days ago         │
│                                                     │
│  📎  AI Research Paper.pdf               File       │
│      "…transformer models achieve state-of-art…"   │
│      Files  ·  1 week ago                          │
│                                                     │
│  🔗  Qdrant Vector DB Docs               Link       │
│      "…vector similarity search for embeddings…"   │
│      Links  ·  3 days ago               (Personal+) │
│                                                     │
│  ─── Recent pages ───────────────────────────       │
│  📄  DB Schema  📄  Onboarding Guide               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Free Tier:** Link results row hidden entirely (not greyed out).

---

## WF-COLLAB-001 — Workspace Members Settings

**Traces to:** US-COLLAB-001, US-COLLAB-002

```
┌───────────────────────────────────────────────────────┐
│  Settings / Members                                   │
│                                                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │ [Invite member by email]               [+Invite]│  │
│  └─────────────────────────────────────────────────┘  │
│                                                       │
│  Members (4)                                          │
│  ─────────────────────────────────────────────────── │
│  👤  Jordan Kim       you@company.com    Owner    [·] │
│  👤  Sam Lee          sam@company.com    Member   [·] │
│  👤  Casey Park       casey@company.com  Viewer   [·] │
│                                                       │
│  Pending invitations (1)                              │
│  ─────────────────────────────────────────────────── │
│  ✉   bob@company.com               Pending  Expires 6d│
│                                    [Resend] [Revoke]  │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### Role Change Dropdown (clicking `[·]` on Member row)

```
┌──────────────────┐
│ Change role      │
│ ─────────────    │
│ ○  Owner         │
│ ●  Member        │
│ ○  Viewer        │
│ ─────────────    │
│ 🗑 Remove member │
└──────────────────┘
```

---

## WF-FILE-001 — File Upload Widget

**Traces to:** US-FILE-001

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   ┌─────────────────────────────────────────────┐  │
│   │                                             │  │
│   │   📎  Drag files here or click to browse    │  │
│   │                                             │  │
│   │   Supported: PDF, MD, DOC, DOCX,            │  │
│   │   XLS, XLSX, PNG, JPG, WEBP, GIF            │  │
│   │                                             │  │
│   │   Max size: 5MB (Free) · 100MB (Personal+)  │  │
│   │                                             │  │
│   └─────────────────────────────────────────────┘  │
│                                                     │
│   Uploading: research-paper.pdf                     │
│   ████████████░░░░░░  68%  1.2MB / 1.8MB           │
│                                                     │
│   Recently uploaded                                 │
│   📄 auth-spec.pdf         Indexed ✓    2.1MB      │
│   🖼 diagram.png           Stored ✓     0.4MB      │
│   📊 metrics.xlsx          Indexed ✓    0.8MB      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Error States

**Unsupported type:**
```
│  ❌ .exe files are not supported.                    │
│     Supported: PDF, MD, DOC, DOCX, XLS, XLSX,       │
│     PNG, JPG, WEBP, GIF                              │
```

**File too large (Free):**
```
│  ❌ File exceeds the 5MB limit for the Free plan.   │
│     [  Upgrade to Personal — 100MB limit  ]         │
```

---

## WF-TIER-001 — Tier Gate Prompt (Reusable Pattern)

**Traces to:** US-WS-001 AC-3, US-AI-003 AC-5, multiple
**Screen Purpose:** Consistent upgrade prompt for feature-gated actions

```
┌─────────────────────────────────────────────────────┐
│  🔒  {Feature Name}                           [×]  │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  {1-line benefit statement}                         │
│  Available on the {Tier} plan.                      │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ What you get:                                │  │
│  │ ✓  {Feature benefit 1}                       │  │
│  │ ✓  {Feature benefit 2}                       │  │
│  │ ✓  {Feature benefit 3}                       │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  [    Upgrade to {Plan}    ]  (primary CTA)         │
│  [    Not now              ]  (ghost/text)          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Usage examples:**
- Block limit reached → "Upgrade to Personal for unlimited blocks"
- Diary on Free → "Upgrade to Personal to access Diary"
- In-editor AI on Free → "Upgrade to Personal for AI writing assistance"
- Invite members on Free/Personal → "Upgrade to Startup for team workspaces"
