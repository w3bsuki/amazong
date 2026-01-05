# Phase 4: shadcn/ui Best Practices & Audit ✅ CONFIGURED (Ongoing Maintenance)

> **Priority:** ✅ Configured  
> **Status:** 42+ components installed, New York style configured; ongoing updates via shadcn CLI  
> **Goal:** Ensure shadcn/ui follows latest v4 best practices, accessibility, and consistent patterns

---

## 📋 Current Configuration Status

### ✅ `components.json` Review

This repo’s `components.json` is valid JSON (no comments) and is the source of truth for shadcn/ui config.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "registries": {
    "@shadcnblocks": {
      "url": "https://shadcnblocks.com/r/{name}",
      "headers": {
        "Authorization": "Bearer ${SHADCNBLOCKS_API_KEY}"
      }
    }
  },
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

Notes:
- Tailwind v4: `tailwind.config` is intentionally `""` (blank).
- Custom registry: `@shadcnblocks` requires `SHADCNBLOCKS_API_KEY` (CI/production env).

### ✅ Installed Components (42 total)

```
accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb,
button, card, carousel, chart, checkbox, collapsible, command, count-badge,
dialog, drawer, dropdown-menu, form, hover-card, input, label, navigation-menu,
pagination, popover, progress, radio-group, scroll-area, select, separator,
sheet, skeleton, slider, spinner, switch, table, tabs, textarea, toast,
toggle-group, toggle, tooltip
```

---

## 🔍 Audit Tasks

### 1. Component Version & Updates

**Goal:** Keep components updated to latest shadcn v4 patterns

#### Action Items:
- [ ] Run component update check:
  ```bash
  npx shadcn@latest diff
  ```
- [ ] Update all components to latest:
  ```bash
  npx shadcn@latest add --all --overwrite
  ```
  > ⚠️ **Commit changes first** - this overwrites existing components!

- [ ] Only add new components if the app actually needs them (avoid adding primitives “just because”).
- [ ] IMPORTANT: This repo already has a Field system at `components/common/field.tsx`.
  - Treat `Field` / `FieldLabel` / `FieldError` / `FieldContent` as the canonical “Field” concept in this codebase.
  - Do **not** introduce another component named `Field` from any registry or snippet.
  - Using shadcn’s `components/ui/form.tsx` (`FormField`, `FormItem`, etc.) is fine — it’s a different API and is already present.

---

### 2. Form Best Practices (React Hook Form + Zod)

**Goal:** All forms follow shadcn v4 patterns with proper validation

#### ✅ Best Practice Pattern:

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldContent } from "@/components/common/field"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  username: z.string().min(2, "Username must be at least 2 characters."),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Real-time validation
    defaultValues: {
      email: "",
      username: "",
    },
  })

  const onSubmit = (_values: z.infer<typeof formSchema>) => {
    // Implement submission (Server Action or client mutation)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>Your email address.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

#### Audit Checklist:
- [ ] All forms use `react-hook-form` with `zodResolver`
- [ ] All inputs have `aria-invalid={fieldState.invalid}`
- [ ] All fields use `data-invalid` for styling
- [ ] `FieldError` component displays validation messages
- [ ] Forms support `disabled` state during submission
- [ ] Review existing form components:
  - [ ] `components/auth/` forms
  - [ ] `components/seller/` forms
  - [ ] `components/buyer/` forms

---

### 3. Accessibility (a11y) Audit

**Goal:** WCAG 2.1 AA compliance

#### Required Patterns:

```tsx
"use client"

import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/common/field"

export function ExampleA11yPatterns() {
  const selectId = useId()
  const [flavor, setFlavor] = useState<string>("")
  const [notifications, setNotifications] = useState<boolean>(false)
  const isInvalid = false

  return (
    <div className="space-y-6">
      {/* ✅ Dialog/Sheet - Focus trap, escape handling (Radix) */}
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button">Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* ✅ Select - keyboard navigation + screen reader */}
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={selectId}>Flavor</FieldLabel>
        <FieldContent>
          {/* If this needs to submit via <form>, add a hidden input with name/value */}
          <input type="hidden" name="flavor" value={flavor} />
          <Select value={flavor} onValueChange={setFlavor}>
            <SelectTrigger id={selectId} aria-invalid={isInvalid}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectItem value="vanilla">Vanilla</SelectItem>
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>

      {/* ✅ Switch - proper labeling */}
      <Field orientation="horizontal" data-invalid={isInvalid}>
        <FieldContent>
          <FieldLabel htmlFor="notifications">Enable notifications</FieldLabel>
          <FieldDescription>Receive email notifications.</FieldDescription>
        </FieldContent>
        <Switch
          id="notifications"
          checked={notifications}
          onCheckedChange={setNotifications}
          aria-invalid={isInvalid}
        />
      </Field>

      {/* ✅ Checkbox Group - Fieldset + Legend */}
      <FieldSet>
        <FieldLegend>Preferences</FieldLegend>
        <FieldGroup data-slot="checkbox-group">
          <Field orientation="horizontal" data-invalid={isInvalid}>
            <Checkbox id="option1" aria-invalid={isInvalid} />
            <FieldLabel htmlFor="option1">Option 1</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>

      {/* ✅ Button grouping - ARIA labeling */}
      <div role="group" aria-label="Navigation options" className="inline-flex gap-2">
        <Button type="button">Previous</Button>
        <Button type="button">Next</Button>
      </div>
    </div>
  )
}
```

#### Audit Checklist:
- [ ] All `Dialog` have `DialogTitle` and `DialogDescription`
- [ ] All `Sheet` have proper titles
- [ ] All `Select` triggers have `aria-invalid` when needed
- [ ] All `Switch` components have associated labels
- [ ] All `Checkbox` groups use `FieldSet` + `FieldLegend`
- [ ] All interactive elements have minimum 44x44px touch targets
- [ ] Charts have `accessibilityLayer` prop enabled

---

### 4. Component Customization Standards

**Goal:** Consistent customization patterns

#### ✅ Best Practice Patterns:

```tsx
// ✅ Using cn() for class merging
import { cn } from "@/lib/utils"

<Button className={cn("custom-class", className)} />

// ✅ Using CSS variables for theming
<div className="bg-background text-foreground" />

// ✅ Using data attributes for states
<Field data-invalid={hasError} data-disabled={isDisabled}>
  {/* ... */}
</Field>

// ✅ Extending with cva() for variants
import { cva } from "class-variance-authority"

const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

// ❌ Avoid inline styles
<Button style={{ marginTop: 10 }} />  // Bad

// ❌ Avoid !important overrides
<Button className="bg-red-500!" />  // Bad
```

#### Audit Checklist:
- [ ] All customizations use `cn()` utility
- [ ] No inline `style` props on shadcn components
- [ ] No `!important` overrides
- [ ] Custom variants use `cva()` when needed
- [ ] Props are properly forwarded with spread operator

---

### 5. Theming & CSS Variables

**Goal:** Consistent theming using shadcn v4 patterns

#### Current Theme Structure (this repo)

This repo’s Tailwind v4 entrypoint is `app/globals.css`.

Key facts (repo-verified):
- Tailwind is imported via `@import "tailwindcss";`
- Animations currently come from `@plugin "tailwindcss-animate";`
- Dark mode uses `.dark` on the root (managed by `next-themes` with `attribute="class"`)

Minimal excerpt (copy/paste-safe):
```css
@import "tailwindcss";
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));
```

#### Token checklist (must remain true)

Confirm these token families exist and are used consistently in `app/globals.css`:
- `--color-background`, `--color-foreground`, `--color-muted`, `--color-border`, `--color-ring`
- `--color-primary` and `--color-primary-foreground`
- `--color-destructive` and `--color-destructive-foreground`
- `--color-chart-1..5`
- Sidebar tokens are mapped via `@theme inline` (see end of `app/globals.css`).

#### Tailwind v4 animation guidance (shadcn v4)

shadcn’s Tailwind v4 docs recommend migrating from `tailwindcss-animate` to `tw-animate-css` by replacing:

```diff
- @plugin "tailwindcss-animate";
+ @import "tw-animate-css";
```

This repo currently uses `tailwindcss-animate` successfully; treat the migration as an explicit decision (do not partially migrate).

#### Audit Checklist:
- [ ] All shadcn semantic variables defined (background, foreground, primary, etc.)
- [ ] Dark mode variables properly configured in `.dark` class
- [ ] Custom tokens follow naming convention (`--color-*`)
- [ ] `@theme inline` block maps CSS vars to Tailwind colors
- [ ] Using oklch() color format for modern color management
- [x] Tailwind v4 cursor behavior: `cursor: pointer` rule is already present in `app/globals.css`
- [ ] Tailwind v4 animations: decide whether to migrate from `tailwindcss-animate` → `tw-animate-css` (shadcn guidance)

---

### 6. Dark Mode Implementation

**Goal:** Proper dark mode with next-themes

#### Required Setup:

```tsx
// components/providers/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// app/[locale]/layout.tsx
// Status: implemented in this repo via ThemeProvider wrapping the app.
<html lang={locale} suppressHydrationWarning>
  <body>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="amzn-theme"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  </body>
</html>
```

#### Theme Toggle Component:
```tsx
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

#### Audit Checklist:
- [ ] `next-themes` installed and configured
- [ ] `ThemeProvider` wraps app in root layout
- [ ] `suppressHydrationWarning` on `<html>` tag
- [ ] Theme toggle component works correctly
- [ ] All custom components support dark mode

Note: if you render UI based on `theme`/`resolvedTheme`, follow next-themes guidance to avoid hydration mismatch (gate UI behind a mounted check).

---

### 7. Component Organization

**Goal:** Clean, maintainable structure

#### Repo Structure (keep it consistent)
```
components/
├── ui/          # shadcn/ui primitives (installed + updated via shadcn CLI)
├── common/      # shared primitives (incl. components/common/field.tsx)
├── mobile/      # mobile-specific components
├── desktop/     # desktop-specific components
├── auth/        # auth UI
├── product/     # product UI
└── ...
```

#### Audit Checklist:
- [ ] `components/ui/` contains only shadcn components
- [ ] Prefer updating `components/ui/*` via shadcn CLI; local edits are allowed but must be intentional (re-check with `npx shadcn@latest diff`)
- [ ] Consistent naming conventions
- [ ] No duplicate component implementations

---

### 8. Performance Optimizations

**Goal:** Optimal bundle size and rendering

#### Best Practices:
```tsx
// ✅ Import only what you need
import { Button } from "@/components/ui/button"

// ✅ Use React Server Components where possible
// Most shadcn/ui primitives are Client Components (Radix). Avoid pushing "use client" up the tree;
// let the CLI-managed primitives remain client components and keep feature pages/layouts server-first.

// ✅ Lazy load heavy components
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const Chart = dynamic(() => import("@/components/ui/chart"), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px]" />,
})

// ✅ Use Skeleton for loading states
<Skeleton className="h-4 w-[200px]" />
```

#### Audit Checklist:
- [ ] Run Knip to find unused components:
  ```bash
  pnpm -s exec knip
  ```
- [ ] Avoid deleting from `components/ui/` unless you also update all imports (treat it as a managed set)
- [ ] Heavy components (Chart, Calendar) are lazy loaded
- [ ] Loading states use Skeleton component

---

### 9. Server Actions & Form Handling (Next.js)

**Goal:** Proper server-side form handling

This repo already uses Server Actions in two primary patterns:

1) **Simple `FormData` actions** (example: `updateProfile` in `app/actions/profile.ts`)
2) **Stateful actions with `useActionState`** (example: auth actions in `app/[locale]/(auth)/_actions/auth.ts`)

Both patterns are valid in Next.js 16.

#### Pattern A — Simple FormData action (repo example)

```tsx
import Form from "next/form"
import { updateProfile } from "@/app/actions/profile"

export function UpdateProfileForm() {
  return (
    <Form action={updateProfile}>
      <label htmlFor="full_name">Full name</label>
      <input id="full_name" name="full_name" />

      <button type="submit">Save</button>
    </Form>
  )
}
```

#### Pattern B — useActionState + prevState (repo example)

See `app/[locale]/(auth)/_components/login-form.tsx` and the action signatures in `app/[locale]/(auth)/_actions/auth.ts`.

Notes:
- Next.js 16 includes the `Form` component (`import Form from "next/form"`) and it works with Server Actions.
- `useActionState` requires the Server Action signature to include `prevState` as the first argument.

---

## ✅ Phase 4 Completion Checklist

### Configuration
- [ ] `components.json` follows latest schema
- [ ] All aliases properly configured
- [ ] Registries configured (if using custom)

### Components
- [ ] Component versions up to date (`npx shadcn@latest diff`)
- [ ] Unused components removed (Knip audit)
- [ ] New components added only where beneficial (install via `npx shadcn@latest add <name>`), and without introducing duplicate primitives

### Forms
- [ ] All forms use react-hook-form + Zod
- [ ] Validation errors display correctly
- [ ] Loading/disabled states implemented
- [ ] Field pattern is consistent (use the existing `components/common/field.tsx` primitives)
- [ ] Server actions follow best practices

### Accessibility
- [ ] All dialogs have `DialogTitle` + `DialogDescription`
- [ ] All forms have proper `<label>` associations
- [ ] All inputs have `aria-invalid` on error
- [ ] All interactive elements keyboard accessible
- [ ] Touch targets meet WCAG 44px minimum
- [ ] Charts have `accessibilityLayer` enabled

### Theming
- [ ] All shadcn CSS variables defined in globals.css
- [ ] Dark mode working with next-themes
- [ ] Custom tokens follow `--color-*` convention
- [ ] Using oklch() color format

### Code Quality
- [ ] No inline styles on shadcn components
- [ ] All customizations use `cn()` utility
- [ ] No `!important` overrides
- [ ] Components properly TypeScript typed
- [ ] Props forwarded correctly

---

## 📚 Resources

- [shadcn/ui Docs](https://ui.shadcn.com)
- [shadcn/ui GitHub](https://github.com/shadcn-ui/ui)
- [Radix UI Primitives](https://www.radix-ui.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
- [next-themes](https://github.com/pacocoursey/next-themes)

---

## 🏁 Next Step

→ Proceed to [Phase 5: i18n](../docs/production/05-i18n.md)
