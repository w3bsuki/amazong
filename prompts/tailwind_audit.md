# TAILWIND CSS v4 BEST PRACTICES AUDIT

## MANDATORY FIRST STEPS - READ DOCS BEFORE ANYTHING

```
1. mcp_context7_resolve-library-id → libraryName: "tailwindcss"
2. mcp_context7_get-library-docs → topics: "v4", "migration", "css variables", "@theme"
3. Read: https://tailwindcss.com/docs/v4-beta (via fetch_webpage if needed)
```

---

## TAILWIND v4 KEY CHANGES

### NO MORE tailwind.config.js!
Tailwind v4 uses **CSS-first configuration**:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-display: "Inter", sans-serif;
  --breakpoint-3xl: 1920px;
}
```

### New PostCSS Setup
```javascript
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

---

## AUDIT SCOPE

### 1. CONFIGURATION CHECK
**Files to verify:**
- [ ] `postcss.config.mjs` - using `@tailwindcss/postcss`
- [ ] `app/globals.css` - using `@import "tailwindcss"` and `@theme`
- [ ] NO `tailwind.config.ts` (v4 doesn't need it!)

**If `tailwind.config.ts` exists:**
- Is it actually being used?
- Should it be migrated to CSS `@theme`?

### 2. CSS-FIRST THEMING
**Expected in globals.css:**
```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-*: ...;
  
  /* Typography */
  --font-*: ...;
  --text-*: ...;
  
  /* Spacing */
  --spacing-*: ...;
  
  /* Breakpoints */
  --breakpoint-*: ...;
  
  /* Animations */
  --animate-*: ...;
}
```

**Questions:**
- [ ] Are custom colors in `@theme` not inline?
- [ ] Are breakpoints customized via `--breakpoint-*`?
- [ ] Is the design system properly tokenized?

### 3. NEW v4 UTILITIES
**Check usage of:**
```css
/* New in v4 */
text-wrap-balance    /* Better text wrapping */
text-wrap-pretty     /* Prevents orphans */
size-*               /* width + height shorthand */
inset-*              /* top/right/bottom/left shorthand */

/* Improved container queries */
@container
container-type-*
```

### 4. DEPRECATED PATTERNS
**Find and replace:**
```
❌ @apply (overuse)     → ✅ Direct utilities or CSS variables
❌ theme()              → ✅ var(--color-*) 
❌ @screen              → ✅ @media (width >= theme(--breakpoint-md))
❌ divide-* (legacy)    → ✅ Still works but verify
```

**Search for deprecated:**
```typescript
grep_search: "@apply|theme\(|@screen"
```

### 5. CLASS ORGANIZATION
**Good patterns:**
```html
<!-- Logical grouping -->
<div class="
  flex items-center gap-4
  p-4 rounded-lg
  bg-white dark:bg-gray-900
  border border-gray-200
  hover:shadow-md transition-shadow
">
```

**Anti-patterns:**
```html
<!-- ❌ Random order -->
<div class="border p-4 hover:shadow-md flex bg-white gap-4 items-center">

<!-- ❌ Excessive @apply -->
.btn { @apply flex items-center justify-center px-4 py-2 ... }

<!-- ❌ Arbitrary values when token exists -->
<div class="p-[16px]">  <!-- Should be p-4 -->
```

### 6. DARK MODE
**v4 approach:**
```css
@import "tailwindcss";

@theme {
  --color-background: #ffffff;
  --color-foreground: #0a0a0a;
}

@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: #0a0a0a;
    --color-foreground: #fafafa;
  }
}

/* Or with class strategy */
.dark {
  --color-background: #0a0a0a;
}
```

**Questions:**
- [ ] Is dark mode using CSS variables?
- [ ] Is `next-themes` integration correct?
- [ ] Are all components dark-mode aware?

### 7. RESPONSIVE DESIGN
**Check for:**
- [ ] Mobile-first approach (base → sm: → md: → lg:)
- [ ] Consistent breakpoint usage
- [ ] No unnecessary responsive overrides

**Search:**
```typescript
grep_search: "sm:|md:|lg:|xl:|2xl:"
```

### 8. PERFORMANCE
**Check for:**
- [ ] Unused utilities (run Knip or PurgeCSS analysis)
- [ ] Overly specific selectors
- [ ] Large @apply blocks that could be utilities

---

## SPECIFIC SEARCHES

```typescript
// Find all Tailwind usage files
file_search: "*.tsx"

// Check for arbitrary values (potential tokens)
grep_search: "\[#[0-9a-fA-F]+\]|\[\d+px\]|\[\d+rem\]"

// Find @apply usage
grep_search: "@apply"

// Find deprecated theme() function
grep_search: "theme\("

// Find inline styles (should be Tailwind)
grep_search: "style=\{"
```

---

## MIGRATION CHECKLIST (if coming from v3)

- [ ] Remove `tailwind.config.ts` or convert to `@theme`
- [ ] Update `postcss.config.mjs` to use `@tailwindcss/postcss`
- [ ] Replace `@import "tailwindcss/base"` etc. with `@import "tailwindcss"`
- [ ] Move custom colors to `@theme { --color-*: }`
- [ ] Replace `theme()` calls with `var(--*)`
- [ ] Test all responsive breakpoints
- [ ] Verify dark mode still works

---

## DELIVERABLES

1. **OUTDATED**: v3 patterns that should be v4
2. **WRONG**: Anti-patterns in class usage
3. **MISSING**: Design tokens not in `@theme`
4. **ARBITRARY**: Values that should be tokens
5. **PERFORMANCE**: Unused or bloated styles
6. **FIXES**: Specific CSS/class changes

---

## DESIGN TOKEN AUDIT TEMPLATE

| Token Type | Defined in @theme? | Consistent Usage? | Notes |
|------------|-------------------|-------------------|-------|
| Colors     | ✅/❌             | ✅/❌             |       |
| Spacing    | ✅/❌             | ✅/❌             |       |
| Typography | ✅/❌             | ✅/❌             |       |
| Shadows    | ✅/❌             | ✅/❌             |       |
| Borders    | ✅/❌             | ✅/❌             |       |
| Animations | ✅/❌             | ✅/❌             |       |

---

## USEFUL COMMANDS

```bash
# Check what's in node_modules
pnpm list tailwindcss

# Scan for palette usage (if script exists)
pnpm run scan:tailwind

# Build to check for errors
pnpm build
```
