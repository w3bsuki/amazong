# Opus Hotspots — High-Risk Frontend Areas

Areas requiring immediate attention due to complexity, size, or regression risk.

---

## Critical Hotspots

### 1. Filter System (808+ LOC scattered)

**Location**: `components/shared/filters/`

**Problem**: 
- `filter-hub.tsx` (808 LOC) — monolithic filter implementation
- `filter-modal.tsx` (688 LOC) — secondary implementation
- Logic duplicated between hub/modal/sidebar
- State management spread across multiple files

**Risk**:
- Regression when modifying filter behavior
- Inconsistent UX between mobile/desktop
- Performance issues from re-renders

**Evidence**:
```
components/shared/filters/
├── filter-hub.tsx               # 808 LOC ← HOTSPOT
├── filter-modal.tsx             # 688 LOC ← HOTSPOT
├── filter-list.tsx
├── filter-chips.tsx
├── desktop-filters.tsx
├── price-slider.tsx
├── sort-modal.tsx
├── color-swatches.tsx
├── size-tiles.tsx
└── (5 unused per Knip)
```

**Mitigation**:
1. Extract shared filter logic to `lib/filters/`
2. Create single `FilterProvider` for state management
3. Delete unused filter files first
4. Test thoroughly after any filter changes

---

### 2. Server Actions (God Files)

**Location**: `app/actions/`

**Problem**:
- `orders.ts` (863 LOC) — order lifecycle, status, refunds
- `products.ts` (669 LOC) — CRUD, attributes, images
- `username.ts` (646 LOC) — username, profile, verification
- `seller-feedback.ts` (596 LOC) — ratings, disputes

**Risk**:
- High regression risk (every order flow change)
- Difficult to test in isolation
- Merge conflicts when multiple people edit

**Evidence**: File size scan from ARCHITECTURE-AUDIT.md

**Mitigation**:
1. Split by operation type:
   ```
   actions/orders/
   ├── create.ts
   ├── update-status.ts
   ├── cancel.ts
   └── queries.ts
   ```
2. Extract shared logic to `lib/` (fee calculations, validations)
3. Add unit tests for each action file

---

### 3. Header Variant Explosion

**Location**: `components/layout/header/`

**Problem**:
- 7+ header variants with subtle differences
- Mobile has 5 variants, desktop has 3
- Hard to know which variant to use where
- Styling inconsistencies between variants

**Evidence**:
```
components/layout/header/
├── app-header.tsx               # Main adaptive
├── dashboard-header.tsx         # Dashboard
├── minimal-header.tsx           # Checkout/auth
├── site-header-unified.tsx      # UNUSED
├── desktop/
│   ├── standard-header.tsx
│   └── minimal-header.tsx
└── mobile/
    ├── default-header.tsx
    ├── homepage-header.tsx
    ├── contextual-header.tsx
    ├── product-header.tsx
    └── minimal-header.tsx
```

**Risk**:
- Inconsistent branding/UX
- Header bugs affect all pages
- Difficult to make global header changes

**Mitigation**:
1. Audit which routes use which header
2. Consolidate to single adaptive `app-header.tsx`
3. Use props/context for variant behavior, not separate files
4. Delete unused variants after migration

---

### 4. Mobile Category Browser (517 LOC)

**Location**: `components/mobile/mobile-category-browser.tsx`

**Problem**:
- Single large file handling category navigation
- Complex state management (drill-down, breadcrumb, animation)
- Touch gesture handling
- Performance-sensitive (frequent re-renders)

**Risk**:
- Mobile navigation regression
- Performance degradation
- Hard to debug category issues

**Mitigation**:
1. Extract state to custom hook
2. Split into sub-components (CategoryList, CategoryBreadcrumb, etc.)
3. Add performance monitoring

---

### 5. Sidebar (700 LOC)

**Location**: `components/layout/sidebar/sidebar.tsx`

**Problem**:
- Monolithic sidebar implementation
- Handles navigation, state, animations
- Two versions exist (`sidebar.tsx` vs `sidebar-menu-v2.tsx`)

**Evidence**:
```
components/layout/sidebar/
├── sidebar.tsx          # 700 LOC
└── sidebar-menu-v2.tsx  # 511 LOC
```

**Risk**:
- Confusion about which version is canonical
- Navigation regressions
- Desktop layout issues

**Mitigation**:
1. Determine which version is active
2. Delete unused version
3. Split into SidebarNav, SidebarMenu, SidebarFooter

---

### 6. Desktop Filter Modal (515 LOC)

**Location**: `components/desktop/desktop-filter-modal.tsx`

**Problem**:
- Duplicates logic from `filter-hub.tsx`
- Desktop-specific filter UX
- May be out of sync with mobile filter behavior

**Risk**:
- Filter inconsistency between desktop/mobile
- Feature parity issues
- Double maintenance burden

**Mitigation**:
1. Consider merging into responsive `filter-hub.tsx`
2. Or extract shared logic to `lib/filters/`
3. Ensure both use same filter state management

---

### 7. Demo Surfaces (32+ files)

**Location**: `app/demo/`, `app/[locale]/demo/`

**Problem**:
- 32+ demo pages with experimental code
- Styling violations (arbitrary values, hardcoded colors)
- Not covered by tests
- May reference deleted/renamed components

**Evidence**:
- `app/demo/sell2/page.tsx` (1077 LOC) — largest file in repo
- Multiple product page experiments
- Multiple sell flow experiments

**Risk**:
- Styling audits show false positives from demo code
- Build failures from stale imports
- Confusion about canonical implementations

**Mitigation**:
1. Decision: delete vs. keep for internal testing
2. If keeping: move to separate workspace or branch
3. If deleting: verify no production code imports from demo

---

## Hotspot Priority Matrix

| Priority | Hotspot | Risk | Effort | Impact |
|----------|---------|------|--------|--------|
| P0 | Demo surfaces | Medium | Low | High (cleanup) |
| P0 | Unused files (49) | Low | Low | Medium (cleanup) |
| P1 | Header variants | Medium | Medium | High (UX consistency) |
| P1 | Filter system | High | High | High (core feature) |
| P2 | Server actions | High | Medium | Medium (maintainability) |
| P2 | Sidebar versions | Low | Low | Low |
| P3 | Mobile category | Medium | Medium | Medium |

---

## Monitoring Commands

### Check file sizes
```bash
# Find files > 500 lines
find . -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -n | tail -20
```

### Check for new hotspots
```bash
# Run Knip for unused code
pnpm knip

# Check for styling violations
pnpm -s exec node scripts/scan-tailwind-palette.mjs
```

### Verify after changes
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

## Related Documentation

- Architecture audit: `codex-xhigh/ARCHITECTURE-AUDIT.md`
- Folder audit: `codex-xhigh/FOLDER-AUDIT.md`
- Knip report: `codex-xhigh/typescript/knip-2026-01-20.log`
- Layout refactor history: `REFACTOR-LAYOUT-ARCHITECTURE.md`
