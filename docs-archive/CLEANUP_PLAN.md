# Amazong Marketplace - Cleanup Plan

> **Created:** January 4, 2026  
> **Goal:** Reduce bloat without breaking functionality  
> **Related:** See [Production Master Plan](./production/MASTER_PLAN.md) for launch checklist

---

## 📊 Current State Summary

| Category | Issue | Impact | Status |
|----------|-------|--------|--------|
| Icon Libraries | 3 libraries (Phosphor, Tabler, Lucide) | Bundle size, inconsistency | ⚠️ Review |
| AI SDKs | 3 providers installed | May be unused | ⚠️ Audit |
| Dead Code | 4 unused files, 7 unused exports | Maintenance burden | 🔴 Fix |
| Capacitor iOS | Not used in code | Unnecessary dependency | ⚠️ Decision |
| Artifacts | coverage/, playwright-report/, test-results/ | Disk space | 🟢 Easy |

---

## ✅ Phase 1: Safe Cleanups (No Risk)

These changes won't affect functionality.

### 1.1 Clean Build Artifacts
```bash
pnpm clean:artifacts
```
Or manually remove:
- `coverage/`
- `playwright-report/`
- `test-results/`
- `.next/` (will regenerate on build)

### 1.2 Remove Unused Files (from knip-report)
```bash
# Review these files first, then delete if confirmed unused:
rm components/auth/auth-form-field.tsx
rm components/providers/auth-state-listener.tsx
rm app/[locale]/(main)/seller/dashboard/_components/seller-dashboard-client.tsx
rm app/[locale]/(main)/seller/dashboard/_lib/types.ts
```

**Verification:** Run `pnpm build` after removal to ensure no breakage.

---

## ⚠️ Phase 2: Dependency Audit (Low Risk)

### 2.1 Remove Unused Exports
The following exports are flagged as unused:
- `getCategoryPathsBatch` in `lib/data/categories.ts`
- `useOnboarding` in `components/providers/onboarding-provider.tsx`
- `getFeedProducts` in `lib/data/products.ts`
- `paginatedResponse` in `lib/api/response-helpers.ts`
- `requireAuth` in `lib/api/response-helpers.ts`
- `getSubheaderIcon` in `lib/category-icons.tsx`
- `getMegaMenuIcon` in `lib/category-icons.tsx`

**Action:** Run `pnpm knip` to verify, then manually remove or use `pnpm knip:fix`.

### 2.2 Capacitor iOS
The `@capacitor/ios` package is listed in `package.json` but:
- Not imported anywhere in code
- Already in `ignoreDependencies` in knip.json

**Decision Required:**
- If iOS build is planned → Keep it
- If not needed → Remove with `pnpm remove @capacitor/ios`

---

## 🔶 Phase 3: Icon Library Consolidation (Medium Risk)

### Current Usage:
| Library | Official shadcn? | Usage Areas |
|---------|------------------|-------------|
| `lucide-react` | ✅ Yes (in components.json) | UI components, shadcn |
| `@phosphor-icons/react` | ❌ No | Category icons, sell flow, account |
| `@tabler/icons-react` | ❌ No | Admin, business dashboard, account |

### Recommendation:
**Keep `lucide-react`** (shadcn default) and migrate others gradually.

### Migration Strategy:
1. **Do NOT remove Phosphor/Tabler yet** - they're heavily used
2. Create icon mapping file for equivalents
3. Migrate component by component
4. Test each area after migration
5. Remove old libraries only after full migration

### Icon Mapping Reference:
Create `lib/icon-migration.ts` to track replacements:
```typescript
// Example mappings - verify visual equivalence
// Phosphor -> Lucide
// ShoppingCart -> ShoppingCart ✅
// Heart -> Heart ✅
// MagnifyingGlass -> Search
// etc.
```

**Estimated Effort:** 2-4 hours for full migration

---

## 🔴 Phase 4: AI SDK Consolidation (Higher Risk)

### Current State:
- `@ai-sdk/google` - Google AI provider
- `@ai-sdk/groq` - Groq provider  
- `@ai-sdk/openai` - OpenAI provider

### Before Removing:
1. Audit which providers are actually used:
```bash
# Search for usage
grep -r "google" lib/ai --include="*.ts"
grep -r "groq" lib/ai --include="*.ts"
grep -r "openai" lib/ai --include="*.ts"
```

2. Check environment variables for API keys
3. Review AI feature requirements

**Action:** Only remove providers confirmed unused in both code AND business requirements.

---

## 📦 Phase 5: Radix/shadcn Audit

### Why Radix packages exist:
You're using **shadcn/ui** which wraps Radix primitives. The Radix packages in `package.json` are **required** by your `components/ui/` folder.

### Currently Used UI Components:
All components in `components/ui/` are shadcn components that wrap Radix:
- ✅ accordion, alert-dialog, avatar, checkbox, dialog, dropdown-menu
- ✅ hover-card (used in dropdowns)
- ✅ collapsible (used in AI reasoning)
- ✅ slider (used in filters)
- ✅ aspect-ratio (used in product-card)

### Unused UI Components to Investigate:
```bash
# Check if these are used anywhere outside components/ui/
grep -r "from '@/components/ui/toggle'" --include="*.tsx" app/ components/
grep -r "from '@/components/ui/toggle-group'" --include="*.tsx" app/ components/
```

**Verdict:** Do NOT remove Radix packages - they're shadcn dependencies.

---

## 📋 Execution Checklist

### Week 1: Safe Cleanups
- [ ] Run `pnpm clean:artifacts`
- [ ] Verify and remove 4 unused files
- [ ] Run `pnpm build` to verify
- [ ] Run `pnpm test` to verify

### Week 2: Dependency Cleanup
- [ ] Run `pnpm knip` and review output
- [ ] Remove unused exports with `pnpm knip:fix`
- [ ] Decide on @capacitor/ios
- [ ] Audit AI SDK usage

### Week 3+: Icon Migration (Optional)
- [ ] Create icon mapping document
- [ ] Migrate one component area at a time
- [ ] Visual QA each area
- [ ] Remove old libraries after full migration

---

## 🧪 Verification Commands

After each phase, run:
```bash
# Type check
pnpm typecheck

# Lint
pnpm lint

# Build
pnpm build

# Unit tests
pnpm test:unit

# E2E smoke test
pnpm test:e2e:smoke
```

---

## 📈 Expected Results

| Metric | Before | After Phase 1 | After All |
|--------|--------|---------------|-----------|
| Unused files | 4 | 0 | 0 |
| Unused exports | 7 | 0 | 0 |
| Icon libraries | 3 | 3 | 1 |
| AI SDKs | 3 | TBD | TBD |

---

## ⚠️ Do NOT Remove

These may look unused but are required:
1. **Radix packages** - Used by shadcn/ui components
2. **tailwindcss-animate** - Used in CSS animations
3. **@capacitor/android** - If mobile builds are needed
4. **Any package in node_modules** - Let package manager handle this

---

## Notes

- The project uses **shadcn/ui** (New York style) with Radix primitives underneath
- Icon library set in `components.json` is `lucide`
- Capacitor is set up for mobile builds (Android confirmed, iOS unclear)
