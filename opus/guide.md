# Execution Guide — Treido Marketplace Refactor

> **Generated**: January 2026  
> **Purpose**: How to execute the refactor safely and efficiently  
> **Audience**: Developers (human and AI agents) working on this codebase

---

## 🎯 Philosophy

### Core Principles

1. **No rewrites** - Small, verifiable changes only
2. **No redesigns** - Preserve existing behavior and styling
3. **Gate everything** - Run verification after each batch
4. **Document changes** - What changed, how verified
5. **Prefer deletion** - Remove dead code over reorganizing

### What NOT to Do

- ❌ Add new architectural layers (stores, DI, etc.)
- ❌ Change folder structures "for neatness"
- ❌ Touch secrets or log sensitive data
- ❌ Make changes without running gates
- ❌ Batch more than 3-5 files per change

---

## 🛠️ Development Environment

### Required Tools

```bash
# Node.js 18+ 
node --version  # v18.x or higher

# pnpm
pnpm --version  # 8.x or higher

# Git (clean working directory recommended)
git status
```

### Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run gates (in another terminal)
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

### VS Code Tasks

Use the built-in tasks for common operations:

- **Dev Server**: `pnpm dev`
- **Typecheck**: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- **E2E Smoke**: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- **Unit Tests**: `pnpm test:unit`
- **Kill Port 3000**: Available if port conflict

---

## ✅ Verification Gates

### Minimum Gate (Every Change)

```bash
# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E smoke (with dev server running)
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

### Extended Gate (Data/Auth/Checkout Changes)

```bash
# Minimum gate
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke

# Plus unit tests
pnpm test:unit

# Plus relevant E2E specs
REUSE_EXISTING_SERVER=true pnpm test:e2e -- e2e/auth.spec.ts
```

### Pre-Release Gate

```bash
# All gates
pnpm -s exec tsc -p tsconfig.json --noEmit
pnpm test:unit
REUSE_EXISTING_SERVER=true pnpm test:e2e

# Production build
pnpm build
```

---

## 📝 Change Workflow

### 1. Pick a Task

From `opus/tasks.md`, select ONE task or batch.

### 2. Create Branch (Optional)

```bash
git checkout -b fix/gradient-removal
```

### 3. Make Changes

- Edit 1-3 files max per batch
- Follow existing patterns
- Use design tokens from `globals.css`

### 4. Verify

```bash
# Always run
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

### 5. Commit

```bash
git add .
git commit -m "fix: remove gradients from wishlist components

- Replaced bg-gradient-to-r with bg-primary in wishlist-page-client.tsx
- Updated toast.tsx to use solid colors
- Verified: tsc + e2e:smoke pass"
```

### 6. Document

Update `opus/tasks.md` to mark task complete:
```markdown
- [x] `wishlist-page-client.tsx` ✅
```

---

## 🎨 Design System Guide

### Token Usage

**Typography**:
```tsx
// ❌ Arbitrary
className="text-[13px]"

// ✅ Token-based
className="text-sm"        // 14px
className="text-xs"        // 12px
className="text-2xs"       // 10px (custom)
```

**Spacing**:
```tsx
// ❌ Arbitrary
className="gap-[6px] p-[10px]"

// ✅ Token-based
className="gap-1.5 p-2.5"  // 6px, 10px
```

**Sizing**:
```tsx
// ❌ Arbitrary
className="w-[560px] h-[42px]"

// ✅ Token-based
className="w-(--container-modal) h-10"
```

**Colors**:
```tsx
// ❌ Gradient
className="bg-gradient-to-r from-blue-500 to-blue-600"

// ✅ Solid semantic
className="bg-primary"
className="bg-cta-trust-blue"
className="bg-brand"
```

### Common Replacements

| Arbitrary | Replace With |
|-----------|-------------|
| `w-[560px]` | `w-(--container-modal)` |
| `w-[400px]` | `w-(--container-modal-sm)` |
| `w-[352px]` | `w-(--container-dropdown-sm)` |
| `w-[384px]` | `w-(--container-dropdown)` |
| `h-[42px]` | `h-10` (40px) or `h-11` (44px) |
| `h-[36px]` | `h-touch-lg` |
| `h-[32px]` | `h-touch` |
| `h-[28px]` | `h-touch-sm` |
| `text-[13px]` | `text-sm` |
| `text-[11px]` | `text-xs` |
| `text-[10px]` | `text-2xs` |
| `gap-[6px]` | `gap-1.5` |
| `rounded-[4px]` | `rounded-md` |
| `rounded-[8px]` | `rounded-xl` |

---

## 🔧 Backend Patterns

### Supabase Client Selection

```typescript
// Server Component with caching
'use cache'
const supabase = createStaticClient()

// Server Action with auth
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

// Route Handler
const { supabase, applyCookies } = createRouteHandlerClient(request)

// Admin bypass (server-internal only)
const supabase = createAdminClient()
```

### Cache Invalidation

```typescript
// Correct pattern (two arguments)
revalidateTag('products', 'max')
revalidateTag(`product-${id}`, 'max')

// Cache profiles from next.config.ts
// 'categories', 'products', 'deals', 'user'
```

### Field Projection

```typescript
// ❌ Over-fetching
.select('*')

// ✅ Specific fields
.select('id, title, price, images, slug')
```

---

## 🔍 Common Pitfalls

### 1. Missing `'use cache'` Tags

```typescript
// ❌ Wrong - cached function without tags
'use cache'
export async function getData() {
  // No cacheTag or cacheLife
}

// ✅ Correct
'use cache'
cacheTag('data', 'specific-tag')
cacheLife('products')
export async function getData() { ... }
```

### 2. Cookies in Cached Functions

```typescript
// ❌ Wrong - cookies make cache per-user
'use cache'
const supabase = await createClient()  // Uses cookies!

// ✅ Correct
'use cache'
const supabase = createStaticClient()  // No cookies
```

### 3. Client Directive Leakage

```typescript
// ❌ Wrong - unnecessary client directive
'use client'
export function StaticComponent() {
  return <div>No hooks here</div>
}

// ✅ Correct - remove directive if not needed
export function StaticComponent() {
  return <div>No hooks here</div>
}
```

### 4. Import Path Errors

```typescript
// ❌ Wrong - using next/navigation on locale routes
import { useRouter } from 'next/navigation'

// ✅ Correct - using i18n routing
import { useRouter } from '@/i18n/routing'
```

---

## 🧪 Testing Guide

### Running Specific Tests

```bash
# Single E2E file
REUSE_EXISTING_SERVER=true pnpm test:e2e -- e2e/auth.spec.ts

# Single unit test file
pnpm test:unit -- __tests__/shipping.test.ts

# Unit tests with coverage
pnpm test:unit -- --coverage
```

### Writing Tests

**Unit Test Pattern**:
```typescript
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/my-module'

describe('myFunction', () => {
  it('should handle normal input', () => {
    expect(myFunction('input')).toBe('expected')
  })

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('default')
  })
})
```

**E2E Test Pattern**:
```typescript
import { test, expect } from '@playwright/test'

test('should load homepage', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Treido')
})
```

---

## 📋 Batch Template

Use this template when documenting changes:

```markdown
## Batch: [Name]

**Date**: YYYY-MM-DD
**Scope**: [1-3 files/features]
**Risk**: low / medium / high

### Changes
- [ ] File 1: [what changed]
- [ ] File 2: [what changed]

### Verification
- [ ] `tsc --noEmit` passes
- [ ] `e2e:smoke` passes
- [ ] [any additional checks]

### Notes
[Any relevant observations or follow-ups]
```

---

## 🚨 Emergency Procedures

### Gate Failure

1. Don't panic
2. Read the error message carefully
3. Check if it's your change or pre-existing
4. Revert if needed: `git checkout -- .`
5. Fix and re-run gates

### Production Issues

1. Check Vercel deployment logs
2. Check Supabase logs
3. Rollback deployment if critical
4. Document issue in `issues.md`

### Breaking Changes

1. Never merge without gates passing
2. If something breaks after merge:
   - Immediate: `git revert [commit]`
   - Document what broke
   - Fix in separate PR

---

## 📚 Reference Documents

### In This Folder (`opus/`)

- [frontend.md](./frontend.md) - Frontend architecture and patterns
- [backend.md](./backend.md) - Backend architecture and patterns
- [issues.md](./issues.md) - Known issues registry
- [tasks.md](./tasks.md) - Phased execution plan

### In `docs/`

- `ENGINEERING.md` - Engineering rules and patterns
- `DESIGN.md` - Design system rules
- `PRODUCTION.md` - Production launch checklist

### In `cleanup/`

- `DESIGN-SYSTEM-STATUS.md` - Detailed token audit
- `palette-scan-report.txt` - Color scan results

### Configuration

- `next.config.ts` - Next.js + cache profiles
- `proxy.ts` - Middleware configuration
- `tailwind.config.ts` - Tailwind configuration
- `components.json` - shadcn/ui configuration

---

## 🎯 Success Criteria

The refactor is complete when:

1. ✅ All critical issues resolved (SEC-*, PAY-*)
2. ✅ Gradient violations: 13 → 0
3. ✅ Arbitrary values: 189 → < 20
4. ✅ All gates pass consistently
5. ✅ Manual acceptance checklist complete
6. ✅ Production deployment successful

---

## 💬 Questions?

If unsure about any pattern:

1. Check existing code for examples
2. Consult the relevant audit doc
3. Follow the most conservative approach
4. When in doubt, make smaller changes

Remember: **Safe > Fast**
