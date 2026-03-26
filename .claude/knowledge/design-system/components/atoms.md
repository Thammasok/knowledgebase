# Atoms — Base Components (shadcn/ui)

Atoms are the smallest indivisible UI components. They accept no other components as children (only primitive content like text, icons, or images).

> **Note:** Install components via CLI: `pnpm shadcn add <component>`

---

## Button

**Variants (shadcn):** `default` | `secondary` | `outline` | `ghost` | `link` | `destructive`
**Sizes (shadcn):** `default` | `sm` | `lg` | `icon`
**States:** default | hover | active/pressed | focus | disabled | loading

### Anatomy
```
[leading-icon?] [label] [trailing-icon?]
```

### Spec
| Property | Value |
|---|---|
| Min height | 44px (touch target) |
| Padding (md) | 12px 16px |
| Font | `labelMd` (500 weight) |
| Radius | `semantic.radius.button` from config |
| Focus ring | `shadows.focusRing.default` |
| Transition | `bg, border, color 150ms ease` |

### States
- **disabled** — `opacity: 0.4`, `cursor: not-allowed`, no pointer events
- **loading** — replace leading icon with spinner, maintain width, `aria-busy="true"`

### Accessibility
- Must be a `<button>` element (not `<div>`)
- `aria-label` required when icon-only
- `aria-disabled="true"` + `tabindex="-1"` for disabled
- `aria-busy="true"` when loading

### Usage (shadcn/ui — install via `pnpm shadcn add button`)
```tsx
import { Button } from "@/components/ui/button"

// Default (primary action)
<Button>Click me</Button>

// Variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><IconComponent /></Button>

// With asChild for custom elements
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

---

## Input

**Variants (shadcn):** single base style (customize via className)
**Sizes (shadcn):** `default` (h-9), customize via className
**Types:** text | email | password | number | search | tel | url
**States:** default | focus | filled | error | disabled | readonly

### Anatomy
```
[label]
[prefix?] [input-field] [suffix? / clear-btn? / password-toggle?]
[helper-text / error-message]
```

### Spec
| Property | Value |
|---|---|
| Height (md) | 40px |
| Padding | 12px |
| Font | `textMd` |
| Border | 1px `semantic.border.DEFAULT` |
| Focus border | `semantic.border.focus` |
| Error border | `semantic.error.DEFAULT` |

### Accessibility
- `<label>` must be associated via `for`/`htmlFor` or `aria-labelledby`
- Error message needs `role="alert"` or `aria-live="polite"`
- `aria-invalid="true"` on error state
- `aria-describedby` links input to helper/error text

### Usage (shadcn/ui — install via `pnpm shadcn add input`)
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Basic
<Input type="email" placeholder="Email" />

// With label (use shadcn Label component)
<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>

// Disabled
<Input disabled type="email" placeholder="Email" />

// With error styling (apply via className)
<Input type="email" className="border-destructive" aria-invalid="true" />
```

---

## Label

**Install:** `pnpm shadcn add label`

```tsx
import { Label } from "@/components/ui/label"

// Basic
<Label htmlFor="email">Email</Label>

// With required indicator
<Label htmlFor="email">
  Email <span className="text-destructive">*</span>
</Label>

// Disabled state (via peer)
<Label htmlFor="email" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
  Email
</Label>
```

- Never use `color` alone to indicate required state — pair with text or symbol
- shadcn Label uses Radix UI Label primitive for accessibility

---

## Icon

- Use `lucide-react` as default icon library (config: `framework.iconLibrary`)
- Always provide `aria-hidden="true"` on decorative icons
- Use `aria-label` + `role="img"` on standalone meaningful icons
- Size scale: `16px` (sm) | `20px` (md, default) | `24px` (lg) | `32px` (xl)

```tsx
<Icon name="ChevronDown" size={20} aria-hidden="true" />
```

---

## Badge

**Variants:** `default` | `primary` | `success` | `warning` | `error` | `outline`
**Sizes:** `sm` | `md`

```
Padding: 2px 8px | Radius: semantic.radius.badge | Font: labelSm
```

- Max width: 120px with text truncation
- Never use color alone to convey status — pair with icon or text
- `role="status"` for live-updating badges

---

## Avatar

**Variants:** image | initials | fallback-icon
**Sizes:** `xs` (24px) | `sm` (32px) | `md` (40px) | `lg` (48px) | `xl` (64px) | `2xl` (96px)

- Always provide `alt` text for image avatars
- Initials are `aria-hidden` — wrap with `<span aria-label="User name">`
- Status dot (online/away/offline) needs `aria-label`

---

## Checkbox

**Install:** `pnpm shadcn add checkbox`
**States:** unchecked | checked | indeterminate | disabled

```tsx
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Basic
<Checkbox id="terms" />

// With label
<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>

// Disabled
<Checkbox id="terms" disabled />
```

- shadcn Checkbox uses Radix UI Checkbox (not native input)
- `data-state="checked"` | `data-state="unchecked"` | `data-state="indeterminate"`
- Click target minimum 44×44px (includes visible label)

---

## Radio

**States:** unselected | selected | disabled

- Group wrapped in `<fieldset>` with `<legend>`
- `name` attribute must be same for all radios in group
- Arrow key navigation within group (native behavior)

---

## Switch (Toggle)

**Install:** `pnpm shadcn add switch`
**States:** off | on | disabled

```tsx
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Basic
<Switch id="airplane-mode" />

// With label
<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>

// Controlled
<Switch checked={enabled} onCheckedChange={setEnabled} />
```

- shadcn Switch uses Radix UI Switch primitive
- Handles `role="switch"` + `aria-checked` automatically
- Click + Enter + Space activate toggle

---

## Tooltip

**Install:** `pnpm shadcn add tooltip`
**Trigger:** hover (150ms delay) | focus (immediate)
**Position:** top | right | bottom | left (auto-flip when near viewport edge)

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Wrap app or section with TooltipProvider
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Tooltip content</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

// With positioning
<TooltipContent side="right" sideOffset={5}>
  <p>Right side tooltip</p>
</TooltipContent>
```

- shadcn Tooltip uses Radix UI Tooltip primitive
- Max width: 240px with text wrapping
- Never put interactive content inside tooltip
- Don't use for critical information — it's not accessible on touch
