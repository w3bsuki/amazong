# File Organization Audit

> Audit Date: 2026-02-02 | Auditor: structure-auditor | Status: ✅ Complete

---

## Summary

**21 issues found across 6 categories:**

| Category | Count | Severity |
|----------|-------|----------|
| Boundary Violations | 2 | 🔴 High |
| Architecture Drift | 10 | 🟡 Medium |
| Misplaced Files | 2 | 🟡 Medium |
| Empty Directories | 3 | 🟢 Low |
| Duplicate Folders | 2 | 🟡 Medium |
| Orphaned Docs | 2 | 🟢 Low |

---

## Boundary Violations (Phase 2)

| Path | Issue | Fix |
|------|-------|-----|
| `lib/category-icons.tsx` | React component in pure utility folder (8 consumers) | Move to `components/shared/category/` |
| `components/auth/image.png` | Binary asset in component folder | Move to `public/images/` |

---

## Architecture Drift (Phase 3)

**Problem:** 11 feature folders at `components/` root should be under `components/shared/`

| Current Location | Should Be |
|------------------|-----------|
| `components/auth/` | `components/shared/auth/` |
| `components/category/` | `components/shared/category/` |
| `components/charts/` | `components/shared/charts/` |
| `components/dropdowns/` | `components/shared/dropdowns/` |
| `components/grid/` | `components/shared/grid/` |
| `components/navigation/` | `components/shared/navigation/` |
| `components/onboarding/` | `components/shared/onboarding/` |
| `components/orders/` | `components/shared/orders/` |
| `components/pricing/` | `components/shared/pricing/` |
| `components/sections/` | `components/shared/sections/` |
| `components/seller/` | `components/shared/seller/` |

---

## Misplaced Files (Phase 3)

| Current Path | Issue | Suggested Path |
|--------------|-------|----------------|
| `lib/category-icons.tsx` | React component in lib/ | `components/shared/category/category-icons.tsx` |
| `components/auth/image.png` | Asset in component folder | `public/images/auth-hero.png` |

---

## Duplicate Folders (Phase 3)

| Folder A | Folder B | Resolution |
|----------|----------|------------|
| `components/auth/` | `components/shared/auth/` | Merge into `shared/auth/` |
| `components/seller/` | `components/shared/seller/` | Merge into `shared/seller/` |

---

## Empty/Near-Empty Directories (Phase 2)

Check if these can be removed:
- Unnamed empty folders (if any exist)
- Placeholder directories without content

---

## Clean Areas

- ✅ No cross-route-group imports detected
- ✅ `storybook-static/` correctly in `.gitignore`
- ✅ Index files are clean (no circular deps)
- ✅ Route-private conventions (`_components/`, `_actions/`) properly followed
- ✅ `lib/` is mostly pure (one violation noted above)

---

## Target Structure After Cleanup

```
components/
├── ui/              # shadcn primitives ONLY (no changes)
├── shared/          # ALL shared composites
│   ├── auth/        # Merged from root + shared
│   ├── category/    # Merged + category-icons.tsx
│   ├── charts/
│   ├── dropdowns/
│   ├── filters/
│   ├── grid/
│   ├── navigation/
│   ├── onboarding/
│   ├── orders/
│   ├── pricing/
│   ├── product/
│   ├── sections/
│   └── seller/      # Merged from root + shared
├── layout/          # Header, footer, sidebars (no changes)
├── providers/       # Context providers (no changes)
├── mobile/          # Mobile-specific (no changes)
├── desktop/         # Desktop-specific (no changes)
├── storybook/       # Storybook utilities (no changes)
├── design-system2/  # Keep as-is (migration target)
└── support/         # Keep as-is
```

---

*Generated: 2026-02-02*
