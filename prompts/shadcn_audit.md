# SHADCN/UI BEST PRACTICES AUDIT

## MANDATORY FIRST STEPS - READ DOCS BEFORE ANYTHING

```
1. mcp_context7_resolve-library-id → libraryName: "shadcn"
2. mcp_context7_get-library-docs → topics: "components", "theming", "best practices"
3. mcp_shadcn_get_project_registries → Check components.json setup
4. mcp_shadcn_list_items_in_registries → See available components
5. mcp_shadcn_search_items_in_registries → Find specific patterns
```

---

## AUDIT SCOPE

### 1. PROJECT CONFIGURATION
**Check `components.json`:**
```json
{
  "style": "new-york",        // or "default"
  "rsc": true,                // React Server Components
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",   // or slate, zinc, etc.
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**Questions:**
- [ ] Is `rsc: true` set for Next.js 16?
- [ ] Are aliases matching tsconfig paths?
- [ ] Is the style consistent across all components?

### 2. COMPONENT STRUCTURE
**Expected structure:**
```
components/
├── ui/           # shadcn primitives (DON'T MODIFY)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── common/       # composed/custom components
├── layout/       # layout components
└── [feature]/    # feature-specific
```

**Questions:**
- [ ] Are `ui/` components unmodified from shadcn?
- [ ] Are customizations in wrapper components, not ui/?
- [ ] Is `cn()` utility used for class merging?

### 3. COMPONENT USAGE PATTERNS

**Good patterns:**
```typescript
// ✅ Using cn() for conditional classes
<Button className={cn("base-class", isActive && "active-class")} />

// ✅ Extending with variants
const buttonVariants = cva("base", {
  variants: { size: { sm: "...", lg: "..." } }
})

// ✅ Composition over modification
<Card>
  <CardHeader>
    <CardTitle>...</CardTitle>
  </CardHeader>
  <CardContent>...</CardContent>
</Card>
```

**Anti-patterns:**
```typescript
// ❌ Modifying ui/ components directly
// ❌ Not using cn() for class concatenation
<Button className={`base ${isActive ? 'active' : ''}`} />

// ❌ Inline styles instead of Tailwind
<Button style={{ marginTop: '10px' }} />

// ❌ Duplicating component logic
```

### 4. THEMING & CSS VARIABLES
**Check `globals.css`:**
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    /* ... */
  }
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
  }
}
```

**Questions:**
- [ ] Are all colors using CSS variables?
- [ ] Is dark mode properly configured?
- [ ] Are custom colors added consistently?
- [ ] Is `next-themes` configured for theme switching?

### 5. ACCESSIBILITY
**Check for:**
- [ ] Are all interactive elements keyboard accessible?
- [ ] Do modals trap focus correctly?
- [ ] Are ARIA labels present where needed?
- [ ] Is color contrast sufficient?
- [ ] Are form errors announced to screen readers?

**Components to audit:**
- `Dialog` - focus trap, escape key
- `DropdownMenu` - keyboard navigation
- `Toast` - screen reader announcements
- `Form` - error messages, labels

### 6. FORM PATTERNS
**Expected setup with react-hook-form:**
```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
```

**Questions:**
- [ ] Is Zod used for validation?
- [ ] Are FormField components used (not raw inputs)?
- [ ] Is error display consistent?
- [ ] Are loading states handled?

---

## SPECIFIC SEARCHES

```typescript
// Find all shadcn components
file_search: "components/ui/*.tsx"

// Check for direct modifications
grep_search: "// Modified from shadcn|// Custom"

// Find cn() usage
grep_search: "cn\(|clsx\(|twMerge"

// Find inline styles (anti-pattern)
grep_search: "style=\{|style:"

// Find form patterns
grep_search: "useForm|FormField|zodResolver"
```

---

## COMPONENT INVENTORY

**Run this to list all shadcn components:**
```bash
ls components/ui/
```

**Check if using latest versions:**
```
mcp_shadcn_get_add_command_for_items → items: ["@shadcn/button", "@shadcn/card"]
```

---

## DELIVERABLES

1. **WRONG**: Anti-patterns in component usage
2. **MODIFIED**: ui/ components that should be wrappers instead
3. **MISSING**: Components that should use shadcn but don't
4. **INCONSISTENT**: Style/variant inconsistencies
5. **ACCESSIBILITY**: A11y issues in component usage
6. **FIXES**: Specific refactors needed

---

## QUICK REFERENCE - ADDING COMPONENTS

```bash
# Add a new component
pnpm dlx shadcn@latest add button

# Add multiple
pnpm dlx shadcn@latest add card dialog dropdown-menu

# Update existing
pnpm dlx shadcn@latest add button --overwrite
```

## EXAMPLE AUDIT CHECKLIST

| Component | In ui/? | Unmodified? | A11y OK? | Notes |
|-----------|---------|-------------|----------|-------|
| Button    | ✅      | ✅          | ✅       |       |
| Dialog    | ✅      | ❌ Modified | ⚠️       | Check focus |
| Card      | ✅      | ✅          | ✅       |       |
