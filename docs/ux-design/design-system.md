# Design System — Knowledgebase GPT

**Framework:** Next.js 16 + Tailwind v4 + shadcn/ui
**Component library:** shadcn/ui (default registry)
**Config:** `.claude/knowledge/design-system/design-system.config.json`
**Date:** 2026-03-28

---

## 1. Color Tokens (oklch — light/dark)

All colors use oklch for perceptual uniformity. CSS variables defined in `globals.css`.

| Semantic Token | Light | Dark | Usage |
|----------------|-------|------|-------|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | Primary text |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` | Primary actions |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` | Text on primary |
| `--secondary` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Secondary buttons |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Subtle backgrounds |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` | Placeholder, meta text |
| `--border` | `oklch(0.922 0 0)` | `oklch(0.269 0 0)` | Borders, dividers |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` | Error states |
| `--ring` | `oklch(0.708 0 0)` | `oklch(0.556 0 0)` | Focus rings |
| `--sidebar` | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` | Sidebar background |
| `--sidebar-accent` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` | Sidebar hover state |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0 0)` | Cards, panels |

**Custom semantic additions for this app:**

```css
/* Add to globals.css :root */
--success:           oklch(0.6 0.17 145);     /* Green — indexed, saved */
--success-foreground: oklch(0.985 0 0);
--warning:           oklch(0.75 0.16 70);     /* Amber — processing, pending */
--warning-foreground: oklch(0.145 0 0);
--info:              oklch(0.6 0.15 245);     /* Blue — info states */
--info-foreground:   oklch(0.985 0 0);

/* Tier accent colors */
--tier-personal:     oklch(0.55 0.2 245);    /* Blue */
--tier-startup:      oklch(0.5 0.22 290);    /* Purple */
--tier-free:         oklch(0.55 0 0);         /* Grey */
```

---

## 2. Typography

Font: **Inter** (sans-serif, loaded via `next/font/google`)
Mono: **JetBrains Mono** (code blocks)

| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Display Large | 40px | 700 | 48px | Marketing / landing hero |
| Display Medium | 32px | 700 | 40px | Page title (editor) |
| Heading 1 | 28px | 600 | 36px | Section headings |
| Heading 2 | 24px | 600 | 32px | Sub-section headings |
| Heading 3 | 20px | 600 | 28px | Card headings |
| Body Large | 16px | 400 | 24px | Primary reading copy |
| Body Medium | 14px | 400 | 20px | UI labels, secondary copy |
| Body Small | 12px | 400 | 16px | Captions, meta info |
| Label Medium | 14px | 500 | 20px | Form labels, nav items |
| Label Small | 12px | 500 | 16px | Badge text, tag text |
| Code | 13px | 400 | 20px | Code blocks, inline code |

**Tailwind v4 class mapping:**
```
text-4xl font-bold      →  Display Large
text-3xl font-bold      →  Page title
text-2xl font-semibold  →  Heading 1
text-xl  font-semibold  →  Heading 2
text-lg  font-semibold  →  Heading 3
text-base               →  Body Large
text-sm                 →  Body Medium / Label Medium
text-xs                 →  Body Small / Label Small
font-mono text-[13px]   →  Code
```

---

## 3. Spacing Scale

Base unit: **4px grid**

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon gaps, tight padding |
| `space-2` | 8px | Between related items |
| `space-3` | 12px | Component inner padding (sm) |
| `space-4` | 16px | Component inner padding (md) |
| `space-5` | 20px | — |
| `space-6` | 24px | Component inner padding (lg) |
| `space-8` | 32px | Section gaps |
| `space-10` | 40px | Auth card padding |
| `space-12` | 48px | Between major sections |
| `space-16` | 64px | Page-level margins |

---

## 4. Border Radius

Base: `--radius: 0.625rem` (10px)

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Badges, chips, small inputs |
| `radius-md` | 8px | Buttons, inputs, dropdowns |
| `radius-lg` | 10px | Cards, dialogs, panels |
| `radius-xl` | 14px | Floating elements, tooltips |
| `radius-2xl` | 18px | Large cards, sheets |
| `radius-full` | 9999px | Pill badges, avatars |

---

## 5. Shadows / Elevation

| Level | Shadow | Usage |
|-------|--------|-------|
| `shadow-none` | None | Flat elements, sidebar items |
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Cards, auth cards |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | Dropdowns, popovers |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1)` | Modals, dialogs |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1)` | Floating action elements |

Focus ring (all interactive elements):
```css
/* Applied by shadcn/ui base styles */
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

---

## 6. Component Inventory

### Installed shadcn/ui Components

| Component | Usage in App |
|-----------|-------------|
| `Button` | All CTAs, actions |
| `Input` | Auth forms, settings |
| `Textarea` | AI chat input, diary |
| `Label` | All form fields |
| `Card` | Auth cards, file cards, tier gate |
| `Dialog` | Tier gate, AI generation overlay, confirmations |
| `Sheet` | Mobile sidebar, right-side panels |
| `Command` | Global search modal |
| `DropdownMenu` | Role management, page `···` menu, new item menu |
| `Select` | AI scope selector, role picker |
| `Badge` | Status badges (file, link, tier) |
| `Avatar` | User avatars in member list |
| `Alert` | Error states, Viewer blocked state |
| `Progress` | File upload progress |
| `Tooltip` | Disabled action explanations |
| `Separator` | Section dividers |
| `Skeleton` | Loading states |
| `Toast / Sonner` | Success/error toasts |
| `Tabs` | Settings panels |
| `ScrollArea` | Sidebar tree, chat messages |
| `Sidebar` | Main app sidebar (shadcn sidebar component) |

### Custom Components (to build)

| Component | File Path | Traces to |
|-----------|-----------|-----------|
| `PasswordStrengthMeter` | `components/auth/password-strength-meter.tsx` | UI-AUTH-001 |
| `PasswordRequirements` | `components/auth/password-requirements.tsx` | UI-AUTH-001 |
| `PageEditor` | `components/editor/page-editor.tsx` | UI-EDITOR-001 |
| `AIGenerateOverlay` | `components/editor/ai-generate-overlay.tsx` | UI-EDITOR-001 |
| `AutoSaveIndicator` | `components/editor/autosave-indicator.tsx` | UI-EDITOR-001 |
| `AIChatInterface` | `components/ai/chat-interface.tsx` | UI-AI-001 |
| `SourceChip` | `components/ai/source-chip.tsx` | UI-AI-001 |
| `GlobalSearchModal` | `components/search/global-search-modal.tsx` | UI-SEARCH-001 |
| `TierGateDialog` | `components/upgrade/tier-gate-dialog.tsx` | UI-TIER-001 |
| `MembersTable` | `components/workspace/members-table.tsx` | UI-COLLAB-001 |
| `FileUploadZone` | `components/files/file-upload-zone.tsx` | UI-FILE-001 |
| `VersionHistoryPanel` | `components/editor/version-history-panel.tsx` | WF-EDITOR-002 |
| `SidebarPageTree` | `components/sidebar/page-tree.tsx` | UI-LAYOUT-001 |
| `TierBadge` | `components/ui/tier-badge.tsx` | Multiple |
| `ContentTypeIcon` | `components/ui/content-type-icon.tsx` | Search, file list |

---

## 7. Accessibility Checklist

**P0 — Must never ship without:**
- [ ] All interactive elements reachable by keyboard (Tab order)
- [ ] Focus indicator always visible (never `outline: none` alone)
- [ ] Every `<input>` / `<textarea>` / `<select>` has `<label>` or `aria-label`
- [ ] Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text + UI
- [ ] No information conveyed by color alone (icons + text used too)
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Modal/dialog traps focus; Escape dismisses
- [ ] Error messages have `role="alert"` or `aria-live="polite"`
- [ ] Images have `alt` text; decorative images have `alt=""`
- [ ] Form validation errors linked to fields via `aria-describedby`

**P1 — Should fix before launch:**
- [ ] Skip-to-content link at top of page
- [ ] Logical heading hierarchy (h1 → h2 → h3, no skips)
- [ ] Reduced motion respected (`@media (prefers-reduced-motion)`)
- [ ] Loading states announced (`aria-busy`, `aria-live`)
- [ ] Screen reader testing on VoiceOver (macOS) + NVDA (Windows)

---

## 8. Dark Mode Strategy

Toggle: `class="dark"` on `<html>` (shadcn/ui class strategy).
Default: `system` (prefers-color-scheme).
Persisted: localStorage key `theme`.

All CSS variables automatically switch via Tailwind's `dark:` variant.
Custom variables (success, warning, info, tier) must define dark mode values.

```css
.dark {
  --success:           oklch(0.7 0.17 145);
  --warning:           oklch(0.8 0.16 70);
  --tier-personal:     oklch(0.65 0.2 245);
  --tier-startup:      oklch(0.65 0.22 290);
}
```

---

## 9. Animation Guidelines

Library: `motion` (framer-motion v11+)

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Fade in | 150ms | ease-out | Tooltips, dropdowns appearing |
| Slide in | 200ms | ease-out | Panels, sheets sliding in |
| Scale | 100ms | ease-out | Dialog open/close |
| Skeleton pulse | 1.5s | ease-in-out | Loading placeholders |

Respect reduced motion:
```tsx
const prefersReducedMotion = useReducedMotion();
// Pass prefersReducedMotion to motion props → disable animations
```

All motion animations: wrap in `AnimatePresence` for enter/exit transitions.
