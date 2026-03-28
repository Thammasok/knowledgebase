# UI Specifications — Knowledgebase GPT

**Traces to:** docs/ux-design/wireframes.md, REQ-PLATFORM-001
**Framework:** Next.js 16 + Tailwind v4 + shadcn/ui + CVA
**Design System Config:** `.claude/knowledge/design-system/design-system.config.json`
**WCAG Level:** AA
**Date:** 2026-03-28

---

## UI-AUTH-001 — AuthCard

**Traces to:** WF-AUTH-001, WF-AUTH-002
**Component Type:** Template

### Visual Specification

| Property | Value |
|----------|-------|
| Width | 440px (desktop) / 100% (mobile) |
| Padding | 40px (desktop) / 24px (mobile) |
| Border Radius | `var(--radius-lg)` |
| Border | `1px solid var(--border)` |
| Background | `var(--card)` |
| Shadow | `var(--shadow-sm)` |
| Centered | Vertically + horizontally on auth background |

### Typography

| Element | Style | Token |
|---------|-------|-------|
| Title ("Create your account") | 24px / 600 | `text-2xl font-semibold` |
| Field label | 14px / 500 | `text-sm font-medium` |
| Body / helper text | 14px / 400 | `text-sm text-muted-foreground` |
| Link text | 14px / 400 | `text-sm text-primary` |

### Password Strength Meter

```tsx
// Strength levels → color + label
weak:     bg-destructive   "Weak"
fair:     bg-warning       "Fair"
good:     bg-info          "Good"
strong:   bg-success       "Strong"
```

Visual: 4-segment bar below password input. Fills from left as strength increases.

### Password Requirements Checklist

- Rendered as `<ul role="list">` with `<li>` items
- Unchecked: `text-muted-foreground` + `○` or `✗` icon
- Checked: `text-success` + `✓` icon
- Updates on every keypress (live validation — no submit required)

### Accessibility

- `role="main"` on auth page
- `aria-label="Registration form"` on `<form>`
- Each input has `<label>` with `htmlFor` matching input `id`
- Error messages: `role="alert"` + `aria-live="polite"`
- Password requirements: `aria-label="Password requirements"` on `<ul>`
- Submit button: `aria-disabled="true"` when requirements not met
- Focus: auto-focus on first empty field on mount

---

## UI-LAYOUT-001 — AppSidebar

**Traces to:** WF-APP-001
**Component Type:** Organism

### Dimensions

| Property | Value |
|----------|-------|
| Width | 240px (expanded) / 0px (collapsed mobile) |
| Background | `var(--sidebar)` |
| Border Right | `1px solid var(--sidebar-border)` |
| Z-index | `z-40` |

### Sidebar Sections

```tsx
// Section structure
<nav aria-label="Workspace navigation">
  <SidebarSearch />      {/* Cmd+K trigger */}
  <SidebarNewButton />   {/* Create dropdown */}
  <SidebarFavorites />   {/* Pinned pages */}
  <SidebarPageTree />    {/* Workspace tree */}
  <SidebarModules />     {/* Diary | AI | Files | Links */}
  <SidebarFooter />      {/* Settings | User */}
</nav>
```

### Page Tree Item

| State | Background | Text | Icon |
|-------|------------|------|------|
| Default | transparent | `var(--sidebar-foreground)` | `text-muted-foreground` |
| Hover | `var(--sidebar-accent)` | `var(--sidebar-accent-foreground)` | `text-foreground` |
| Active/Selected | `var(--sidebar-primary)` | `var(--sidebar-primary-foreground)` | `text-primary-foreground` |
| Drag over | `var(--sidebar-accent)` with dashed border | — | — |

### Tier-Gated Items (Diary on Free)

```
📔 Diary  [Pro] badge     ← visible but with badge
```

- Item still visible (discovery) but clicking opens WF-TIER-001
- Badge: `bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-sm` "Personal"

### Accessibility

- `<nav aria-label="Workspace navigation">`
- Tree: `role="tree"` → `role="treeitem"` per item
- Nested items: `aria-expanded` on folder items
- Active item: `aria-current="page"`
- Keyboard: ↑↓ navigate tree; Enter/Space open; →/← expand/collapse folders
- Escape: collapse open folder; return focus to parent

### Responsive

- Desktop (≥1024px): Always visible; fixed position
- Tablet (768–1024px): Collapsible; `<Sheet>` from shadcn/ui; hamburger button in header
- Mobile (<768px): Hidden; replaced by bottom tab bar with 4 primary icons

---

## UI-EDITOR-001 — PageEditor

**Traces to:** WF-EDITOR-001, US-PAGE-001
**Component Type:** Organism

### Layout

```
<article>
  <PageTitle />           {/* h1 input, auto-resize */}
  <EditorContent />       {/* Editor.js mount point */}
  <AutoSaveIndicator />   {/* "Saved" / "Saving…" */}
</article>
```

### PageTitle Input

| Property | Value |
|----------|-------|
| Font size | 32px (desktop) / 24px (mobile) |
| Font weight | 700 |
| Placeholder | "Untitled" (muted foreground) |
| Border | None (transparent) |
| Focus outline | None (editor handles its own focus ring) |
| Max chars | 255 |

### Block Insert Menu (`/`)

| Property | Value |
|----------|-------|
| Trigger | First character `/` on empty block |
| Max height | 320px with scroll |
| Width | 240px |
| Keyboard | ↑↓ navigate; Enter select; Escape dismiss |
| Filter | Narrows as user continues typing after `/` |

**Free tier:** `/ai` item visible with lock icon + tooltip "Available on Personal plan"
**Personal/Startup:** `/ai` item fully interactive

### AutoSave Indicator

```
States:
  idle:    hidden
  saving:  "Saving…" with spinner (12px)  →  text-muted-foreground
  saved:   "Saved ✓"                      →  text-success (fades after 2s)
  error:   "Save failed — click to retry" →  text-destructive
```

Position: Top-right of editor area, below header breadcrumb.

### AI Generation Overlay

| Property | Value |
|----------|-------|
| Presentation | `<Dialog>` (shadcn) — modal |
| Width | 480px (desktop) / full (mobile) |
| Prompt input | `<Textarea>` auto-resize, min 2 rows |
| Loading | Skeleton lines animate while generating |
| Generated content | Shown in scrollable preview area |

Buttons:
- Accept: `Button` variant="default" — inserts block
- Discard: `Button` variant="ghost" — closes, no insertion
- Regenerate: `Button` variant="outline" — re-runs generation

### Accessibility

- Editor container: `role="main"`, `aria-label="Page editor"`
- Title input: `aria-label="Page title"` + `aria-required="true"`
- Block menu: `role="listbox"`, items are `role="option"`
- AI overlay: `role="dialog"`, `aria-labelledby` pointing to heading
- Focus trap in AI overlay; Escape dismisses

---

## UI-AI-001 — AIChatInterface

**Traces to:** WF-AI-001, US-AI-002
**Component Type:** Organism

### Layout

```
<section>
  <ConversationList />   {/* Left panel: past conversations */}
  <ChatArea>
    <MessageList />      {/* Scrollable; newest at bottom */}
    <SourcesPanel />     {/* Collapsible; shown after AI response */}
    <ChatInput />        {/* Textarea + Send + Scope selector */}
  </ChatArea>
</section>
```

### Message Bubbles

| Role | Alignment | Background | Text |
|------|-----------|------------|------|
| User | Right | `var(--primary)` | `var(--primary-foreground)` |
| Assistant | Left | `var(--muted)` | `var(--foreground)` |

Max width: 80% of chat area.

### Streaming Response

- Render text incrementally as tokens arrive
- Show blinking cursor `|` at end of incomplete text
- Sources panel appears after generation completes (sliding in from right, 200ms)

### Source Citations

```tsx
<SourceList>
  {sources.map(s => (
    <SourceChip type={s.type} title={s.title} href={s.url} />
  ))}
</SourceList>
```

Source chip styles:
```
📄 Note:  bg-blue-50   border-blue-200
📎 File:  bg-orange-50 border-orange-200
🔗 Link:  bg-green-50  border-green-200
📔 Diary: bg-purple-50 border-purple-200
```

### Scope Selector

```tsx
<Select>
  <SelectItem value="all">All content</SelectItem>
  {folders.map(f => <SelectItem value={f.id}>{f.name}</SelectItem>)}
  <SelectItem value="page">Current page only</SelectItem>
</Select>
```

### Empty State (no conversations yet)

```
      🤖
 Ask anything about
  your knowledge base

[  Ask a question  ]   {/* focuses chat input */}
```

### Viewer Blocked State

`<Alert variant="destructive">` with lock icon.
Chat input: `<Textarea disabled>` with `placeholder="AI chat not available for Viewers"`.
No send button rendered.

### Accessibility

- Chat region: `role="log"`, `aria-live="polite"`, `aria-relevant="additions"`
- Each message: `role="article"`, `aria-label="Message from {role}"`
- Source chips: `role="link"` with descriptive `aria-label`
- Send button: `aria-label="Send message"`
- Scope selector: labelled with `<Label>` for screen readers

---

## UI-SEARCH-001 — GlobalSearchModal

**Traces to:** WF-SEARCH-001, US-SEARCH-001
**Component Type:** Molecule (uses shadcn `<CommandDialog>`)

### Trigger

| Method | Behaviour |
|--------|-----------|
| `Cmd+K` / `Ctrl+K` | Opens modal |
| Click sidebar search icon | Opens modal |

### Visual

| Property | Value |
|----------|-------|
| Presentation | `<CommandDialog>` over backdrop |
| Width | 560px (desktop) / 90vw (mobile) |
| Max height | 60vh with scroll |
| Input | Full-width, 16px, autofocus on open |

### Result Item

```tsx
<CommandItem>
  <ContentTypeIcon type={result.contentType} />
  <div>
    <p className="text-sm font-medium">{result.title}</p>
    <p className="text-xs text-muted-foreground">{result.excerpt}</p>
    <p className="text-xs text-muted-foreground">{result.breadcrumb} · {result.relativeDate}</p>
  </div>
  <ContentTypeBadge type={result.contentType} />
</CommandItem>
```

### Debounce

Search fires after 250ms idle on input. Loading: spinner in top-right of modal.

### Keyboard

- `↑` / `↓` : navigate results
- `Enter` : open selected result
- `Escape` : close modal
- Results announce via `aria-live` when they change

---

## UI-TIER-001 — TierGateDialog

**Traces to:** WF-TIER-001
**Component Type:** Molecule (shadcn `<Dialog>`)

### Props Interface

```tsx
interface TierGateDialogProps {
  feature: string;           // e.g. "Version History"
  benefit: string;           // e.g. "Track every change and restore past versions"
  requiredTier: 'personal' | 'startup';
  benefits: string[];        // 3 bullet points
  onUpgrade: () => void;
  onDismiss: () => void;
}
```

### Visual

| Property | Value |
|----------|-------|
| Width | 400px (desktop) / 90vw (mobile) |
| Icon | Lock icon (`LockIcon` from lucide-react), 40px, `text-muted-foreground` |
| Upgrade button | `Button variant="default"` full width |
| Dismiss button | `Button variant="ghost"` full width |

### Colour coding by tier

| Required Tier | Badge Color | Accent |
|---------------|-------------|--------|
| Personal | `bg-blue-50 text-blue-700` | Blue primary |
| Startup | `bg-purple-50 text-purple-700` | Purple primary |

### Accessibility

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Focus trapped within dialog
- Initial focus on Upgrade button
- Escape closes (equivalent to "Not now")

---

## UI-COLLAB-001 — MembersTable

**Traces to:** WF-COLLAB-001, US-COLLAB-002
**Component Type:** Organism

### Table Columns

| Column | Width | Content |
|--------|-------|---------|
| Avatar + Name | 40% | `<Avatar size="sm">` + display name |
| Email | 30% | Email address, `text-muted-foreground` |
| Role | 15% | Badge: Owner (default) / Member (secondary) / Viewer (outline) |
| Actions | 15% | `<DropdownMenu>` for role change + remove |

### Role Badges

```
Owner:   bg-foreground text-background         (dark solid)
Member:  bg-secondary  text-secondary-foreground
Viewer:  border text-muted-foreground          (outline)
```

### Pending Invite Row

```
Avatar: ✉ envelope icon (muted)
Name: email address (italic, muted)
Role: selected role badge
Status: "Pending" badge (warning) + "Expires in Xd"
Actions: [Resend] [Revoke]
```

### Accessibility

- `<table>` with `<thead>` and `<tbody>`
- `aria-label="Workspace members"`
- Role dropdown: `aria-label="Change role for {name}"`
- Remove action: `aria-label="Remove {name} from workspace"` + confirmation dialog before execute

---

## UI-FILE-001 — FileUploadZone

**Traces to:** WF-FILE-001, US-FILE-001
**Component Type:** Molecule

### States

| State | Visual |
|-------|--------|
| Idle | Dashed border `border-border`; upload icon + instructions |
| Drag over | `border-primary` dashed; `bg-primary/5`; "Drop to upload" |
| Uploading | Progress bar + filename + percentage |
| Success | File row with status badge "Indexed" / "Stored" |
| Error | Red border; `<Alert variant="destructive">` with error message |

### File Row (post-upload)

```
[ContentTypeIcon] filename.pdf    [Indexed ✓]  2.1 MB   [···]
```

Status badge colors:
```
processing: bg-yellow-50 text-yellow-700  "Processing…"
indexed:    bg-green-50  text-green-700   "Indexed ✓"
stored:     bg-blue-50   text-blue-700    "Stored ✓"
failed:     bg-red-50    text-red-700     "Failed ✗"
```

### Size Limit Display

Text below drop zone, always visible:
- Free: "Max 5MB per file"
- Personal/Startup: "Max 100MB per file"

### Accessibility

- Drop zone: `role="button"`, `tabindex="0"`, `aria-label="Upload files"`
- `onKeyDown`: Enter/Space triggers file picker
- Progress: `<progress>` element with `aria-valuenow`, `aria-valuemax`
- Error: `role="alert"` on error message

---

## Design Token Quick Reference (Tailwind v4 CSS Variables)

| Token | CSS Variable | Usage |
|-------|-------------|-------|
| Primary action | `var(--primary)` | Buttons, links, focus rings |
| Primary text | `var(--primary-foreground)` | Text on primary bg |
| Destructive | `var(--destructive)` | Error states, delete actions |
| Muted background | `var(--muted)` | Subtle backgrounds, AI messages |
| Muted text | `var(--muted-foreground)` | Secondary labels, placeholders |
| Border | `var(--border)` | All borders |
| Radius | `var(--radius)` | Base border radius (0.625rem = 10px) |
| Sidebar bg | `var(--sidebar)` | Sidebar background |
| Sidebar accent | `var(--sidebar-accent)` | Sidebar item hover |
| Card | `var(--card)` | Card / panel backgrounds |
| Ring | `var(--ring)` | Focus ring color |
