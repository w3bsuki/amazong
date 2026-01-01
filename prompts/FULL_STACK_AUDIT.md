# FULL STACK AUDIT - MASTER PROMPT

## USE THIS FOR COMPREHENSIVE CODEBASE AUDIT

This prompt instructs you to audit ALL tech stack components systematically.
Run individual audit prompts in `/prompts/` for deep dives.

---

## MANDATORY FIRST STEPS

### 1. Initialize MCP Tools
```
mcp_context7_resolve-library-id → "supabase" → get docs
mcp_context7_resolve-library-id → "next.js" → get docs  
mcp_context7_resolve-library-id → "tailwindcss" → get docs
mcp_context7_resolve-library-id → "react" → get docs
mcp_context7_resolve-library-id → "playwright" → get docs
mcp_context7_resolve-library-id → "shadcn" → get docs

mcp_supabase_search_docs → "best practices"
mcp_next-devtools_init → Initialize Next.js context
mcp_shadcn_get_project_registries → Check shadcn setup
```

### 2. Read Project Config
```
Read: package.json (dependencies/versions)
Read: tsconfig.json (TypeScript config)
Read: next.config.ts (Next.js config)
Read: components.json (shadcn config)
Read: playwright.config.ts (E2E config)
Read: postcss.config.mjs (Tailwind config)
```

---

## TECH STACK OVERVIEW

| Tech | Version | Audit Prompt |
|------|---------|--------------|
| Next.js | 16.x | `/prompts/nextjs_audit.md` |
| React | 19.x | `/prompts/react19_audit.md` |
| Supabase | Latest | `/prompts/supabase_audit.md` |
| Tailwind CSS | 4.x | `/prompts/tailwind_audit.md` |
| shadcn/ui | Latest | `/prompts/shadcn_audit.md` |
| TypeScript | 5.x | `/prompts/typescript_audit.md` |
| Playwright | Latest | `/prompts/playwright_audit.md` |

---

## AUDIT ORDER (Recommended)

### Phase 1: Foundation
1. **TypeScript** - Type safety affects everything
2. **Supabase** - Database patterns are core

### Phase 2: Frontend
3. **Next.js 16** - Framework patterns
4. **React 19** - Component patterns
5. **Tailwind v4** - Styling patterns
6. **shadcn/ui** - UI component patterns

### Phase 3: Quality
7. **Playwright** - E2E test quality

---

## QUICK HEALTH CHECK

Run this to get a quick overview:

```bash
# Type errors
pnpm typecheck

# Lint issues  
pnpm lint

# Unit tests
pnpm test:unit

# E2E smoke tests
pnpm test:e2e e2e/smoke.spec.ts

# Build check
pnpm build
```

---

## RED FLAGS TO FIND

### Supabase
- [ ] RPC functions that duplicate PostgREST
- [ ] Missing RLS policies
- [ ] Service role key in client code
- [ ] N+1 queries

### Next.js
- [ ] `"use client"` on entire pages
- [ ] useEffect for server-fetchable data
- [ ] Missing error boundaries
- [ ] Old caching patterns (unstable_cache)

### React
- [ ] useFormState instead of useActionState
- [ ] forwardRef when not needed
- [ ] Manual form submission handling

### Tailwind
- [ ] tailwind.config.js instead of @theme
- [ ] Excessive @apply
- [ ] Arbitrary values for existing tokens

### shadcn
- [ ] Modified ui/ components
- [ ] Missing dark mode support
- [ ] Inconsistent component usage

### TypeScript
- [ ] `any` usage
- [ ] Missing return types
- [ ] Unsafe type assertions

### Playwright
- [ ] CSS selectors instead of roles
- [ ] waitForTimeout
- [ ] Test interdependencies

---

## DELIVERABLE FORMAT

After completing audit, provide:

```markdown
# AUDIT RESULTS

## 🔴 Critical Issues
1. [Issue] - [Location] - [Fix]

## 🟡 Improvements
1. [Issue] - [Location] - [Fix]

## 🟢 Good Patterns Found
1. [Pattern] - [Location]

## 📋 Action Items
- [ ] Fix: [description]
- [ ] Refactor: [description]  
- [ ] Add: [description]
```

---

## AUTOMATION SCRIPTS

If these don't exist, consider creating:

```bash
# Type safety score
scripts/audit-types.mjs

# Bundle analysis
scripts/analyze-bundle.mjs

# Unused code detection
pnpm knip

# Dependency audit
pnpm audit
```
