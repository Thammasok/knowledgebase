# Organisms — Complex UI Sections (shadcn/ui)

Organisms combine molecules and atoms into distinct sections of the UI.

> **Note:** Install components via CLI: `pnpm shadcn add <component>`

---

## Header / Top Navigation

### Layout
```
┌─────────────────────────────────────────────────────┐
│ [Logo/Brand]   [Nav Links]   [Search?]  [User Menu] │
└─────────────────────────────────────────────────────┘
```

### Spec
- Height: 64px desktop / 56px mobile
- `position: sticky; top: 0; z-index: {zIndex.sticky}` (200)
- Background: `surface.DEFAULT` with `border-bottom` or `shadows.elevation.xs`
- Mobile: collapse nav links into hamburger menu

### Semantic HTML
```tsx
<header>
  <nav aria-label="Main navigation">
    <a href="/" aria-label="Go to homepage">
      <Logo />
    </a>
    <ul role="list">
      {links.map(link => (
        <li key={link.href}>
          <a href={link.href} aria-current={isActive(link) ? 'page' : undefined}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
    <button aria-controls="mobile-menu" aria-expanded={mobileOpen}>
      <span className="sr-only">Open menu</span>
      <Menu aria-hidden="true" />
    </button>
  </nav>
</header>
```

---

## Sidebar Navigation

### Variants
- **Fixed** — always visible, pushes content
- **Overlay** — slides over content (mobile)
- **Collapsible** — icon-only when collapsed (64px), full when expanded (240px)

### Layout (Collapsible)
```
┌──────────────────────┐
│ [Logo]         [◀▶]  │  ← collapse toggle
│─────────────────────│
│ [icon] Dashboard     │  ← nav item (aria-current="page" when active)
│ [icon] Analytics     │
│ [icon] Settings      │
│─────────────────────│
│ [icon] User Profile  │  ← bottom section
└──────────────────────┘
```

### Accessibility
```tsx
<nav aria-label="Sidebar navigation">
  <button
    aria-expanded={!collapsed}
    aria-controls="sidebar-nav"
    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
  />
  <ul id="sidebar-nav" role="list">
    {/* nav items */}
  </ul>
</nav>
```

---

## Form (Organism)

A complete form section with field layout, submission, and validation feedback.

### Layout Patterns
- **1-column**: default, max-width 480px
- **2-column**: labels left, inputs right (md+ screens), use CSS grid
- **Section groups**: `<fieldset>` + `<legend>` for logical groups

### Validation Strategy
- **On submit**: validate all fields, scroll to first error, set focus
- **On blur**: validate individual field after user leaves
- **On change**: only after first submit attempt

```tsx
<form
  onSubmit={handleSubmit}
  noValidate
  aria-label="Account settings"
>
  <fieldset>
    <legend className="text-lg font-semibold">Personal Information</legend>
    <FormField name="name" label="Full name" required />
    <FormField name="email" label="Email" type="email" required />
  </fieldset>

  {formError && (
    <div role="alert" className="alert alert--error">
      {formError}
    </div>
  )}

  <div className="flex justify-end gap-3">
    <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
    <Button type="submit" loading={isSubmitting}>Save changes</Button>
  </div>
</form>
```

---

## Data Table

**Install:** `pnpm shadcn add table` (base styles)

For full-featured tables, use [@tanstack/react-table](https://tanstack.com/table) with shadcn Table.

### Features
- Sortable columns
- Row selection (checkbox)
- Pagination or infinite scroll
- Empty state
- Loading skeleton

### Usage (shadcn/ui Table)
```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

<Table>
  <TableCaption>A list of recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((invoice) => (
      <TableRow key={invoice.id}>
        <TableCell className="font-medium">{invoice.id}</TableCell>
        <TableCell>{invoice.status}</TableCell>
        <TableCell className="text-right">{invoice.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### With TanStack Table (sorting, filtering, pagination)
See shadcn Data Table example: https://ui.shadcn.com/docs/components/data-table

- `aria-sort="ascending|descending|none"` on sorted column header
- `aria-selected="true"` on selected rows
- `role="status"` for live row count updates

---

## Modal / Dialog

**Install:** `pnpm shadcn add dialog`

### Usage (shadcn/ui Dialog)
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when done.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Form content */}
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Controlled Dialog
```tsx
const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    {/* ... */}
  </DialogContent>
</Dialog>

// Open programmatically
<Button onClick={() => setOpen(true)}>Open</Button>
```

### Spec
| Size | Class |
|---|---|
| sm | `sm:max-w-[400px]` |
| md | `sm:max-w-[560px]` (default) |
| lg | `sm:max-w-[720px]` |
| xl | `sm:max-w-[960px]` |

- shadcn Dialog uses Radix UI (handles all focus management + ARIA automatically)
- **Close triggers:** Escape key, backdrop click, close button

---

## Drawer / Sheet

**Install:** `pnpm shadcn add sheet`

Like modal but slides in from an edge.

### Usage (shadcn/ui Sheet)
```tsx
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here.
      </SheetDescription>
    </SheetHeader>
    <div className="py-4">
      {/* Content */}
    </div>
    <SheetFooter>
      <SheetClose asChild>
        <Button type="submit">Save changes</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### Placement
```tsx
// Default: right
<SheetContent side="right">...</SheetContent>

// Other sides
<SheetContent side="left">...</SheetContent>
<SheetContent side="top">...</SheetContent>
<SheetContent side="bottom">...</SheetContent>
```

- shadcn Sheet uses Radix UI Dialog (handles focus management + ARIA automatically)
- `z-index: 50` (default from Tailwind)
