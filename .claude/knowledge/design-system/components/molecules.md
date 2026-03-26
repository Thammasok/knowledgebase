# Molecules — Composite Components (shadcn/ui)

Molecules are components built from 2+ atoms working together as a functional unit.

> **Note:** Install components via CLI: `pnpm shadcn add <component>`

---

## Form Field

**Install:** `pnpm shadcn add form` (uses react-hook-form + zod)

Combines: Label + Input + Helper Text + Error Message

### Anatomy
```
<div role="group">          ← optional, use when grouping related fields
  <Label />                 ← htmlFor={inputId}
  <Input />                 ← id={inputId}, aria-describedby={helpId errorId}
  <HelperText />            ← id={helpId}
  <ErrorMessage />          ← id={errorId}, role="alert"
</div>
```

### States
| State | Label color | Border | Message |
|---|---|---|---|
| Default | neutral-700 | border-DEFAULT | helper text (neutral-500) |
| Focus | neutral-700 | border-focus (blue) | helper text |
| Error | error-DEFAULT | border-error (red) | error message |
| Disabled | neutral-400 | border-subtle | – |
| Success | success-DEFAULT | border-success | success message |

### Rules
- Error replaces helper text (never show both)
- `aria-required="true"` on required inputs
- Field width defaults to 100% of container

### Usage (shadcn/ui Form)
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
})

<Form {...form}>
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input placeholder="you@example.com" {...field} />
        </FormControl>
        <FormDescription>We'll never share your email.</FormDescription>
        <FormMessage />  {/* Shows validation errors */}
      </FormItem>
    )}
  />
</Form>
```

---

## Search Bar

Combines: Input + Search Icon (prefix) + Clear Button (suffix) + optional Dropdown

### Anatomy
```
[🔍] [search input              ] [✕ clear?]
      [suggestion dropdown?          ]
```

### Behavior
- Trigger search: on Enter or after 300ms debounce
- Clear button: visible only when input has content
- Dropdown: `role="listbox"`, results are `role="option"`
- Arrow keys navigate dropdown options
- Escape: close dropdown, keep typed text

### Accessibility
```tsx
<div role="search">
  <label htmlFor="search" className="sr-only">Search</label>
  <input
    id="search"
    type="search"
    role="combobox"
    aria-expanded={open}
    aria-controls="search-results"
    aria-autocomplete="list"
  />
  <ul id="search-results" role="listbox" />
</div>
```

---

## Card

**Install:** `pnpm shadcn add card`

Combines: Surface + Shadow + Padding + optional Header / Body / Footer

### Anatomy (shadcn)
```
┌─────────────────────────────────┐
│ CardHeader                      │
│   CardTitle + CardDescription   │
│─────────────────────────────────│
│ CardContent                     │
│─────────────────────────────────│
│ CardFooter                      │
└─────────────────────────────────┘
```

### Usage (shadcn/ui Card)
```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Interactive Card
```tsx
// Entire card is clickable — use wrapper with relative positioning
<Card className="cursor-pointer hover:border-primary transition-colors">
  <CardHeader>
    <CardTitle>
      <a href={href} className="after:absolute after:inset-0">
        {title}
      </a>
    </CardTitle>
  </CardHeader>
</Card>
```

---

## Navigation Item

Combines: Icon (optional) + Label + Badge (optional) + Active Indicator

### States
- default | hover | active/current | disabled | collapsed (icon-only)

```tsx
<a
  href={href}
  aria-current={isActive ? 'page' : undefined}
  className={cn('nav-item', isActive && 'nav-item--active')}
>
  <Icon aria-hidden="true" />
  <span>{label}</span>
  {badge && <Badge>{badge}</Badge>}
</a>
```

- `aria-current="page"` on active navigation item
- Keyboard: Tab to navigate, Enter/Space to activate

---

## Alert

**Install:** `pnpm shadcn add alert`

**Variants (shadcn):** `default` | `destructive`

### Usage (shadcn/ui Alert)
```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, AlertCircle } from "lucide-react"

// Default (info-style)
<Alert>
  <Terminal className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the CLI.
  </AlertDescription>
</Alert>

// Destructive (error-style)
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>
```

### Custom Variants (extend via className)
| Need | Approach |
|---|---|
| Success | `className="border-green-500 text-green-700"` |
| Warning | `className="border-yellow-500 text-yellow-700"` |

- shadcn Alert has `role="alert"` built-in
- Icon must be `aria-hidden` — meaning is conveyed by color + text

---

## Dropdown Menu

**Install:** `pnpm shadcn add dropdown-menu`

Combines: Trigger Button + Floating Menu + Menu Items

### Usage (shadcn/ui DropdownMenu)
```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">
      Delete Account
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Advanced Features
```tsx
// With keyboard shortcuts
<DropdownMenuItem>
  New Tab <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
</DropdownMenuItem>

// With checkboxes
<DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
  Show Toolbar
</DropdownMenuCheckboxItem>

// With radio groups
<DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
  <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>

// Submenus
<DropdownMenuSub>
  <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>Sub Item</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>
```

- shadcn DropdownMenu uses Radix UI (handles all ARIA + keyboard automatically)
- Keyboard: Arrow keys navigate, Enter/Space activate, Escape closes
