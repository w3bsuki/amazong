# Component Inventory & Refactor Needs

**Reference Document**  
**Goal:** Track components that need updating for UI/UX refactor

---

## Components to CREATE

### Onboarding Components
| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| `OnboardingLayout` | ⬜ New | P0 | Full-screen wrapper |
| `AccountTypeSelector` | ⬜ New | P0 | Card-based selection |
| `ProfilePhotoUpload` | ⬜ New | P0 | Circle with camera icon |
| `UsernameInput` | ⬜ New | P0 | Real-time availability |
| `OnboardingProgress` | ⬜ New | P1 | Step indicator dots |
| `LocationPicker` | ⬜ New | P0 | City search + map |
| `BusinessInfoForm` | ⬜ New | P0 | VAT, website, social |
| `OnboardingComplete` | ⬜ New | P1 | Success state + CTAs |

### Landing Page Components
| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| `SellerFeedCard` | ⬜ New | P0 | Social commerce card |
| `ViewToggle` | ⬜ New | P1 | Feed/Grid switcher |
| `AISearchInput` | ⬜ New | P0 | With sparkle indicator |
| `TrendingSection` | ⬜ New | P2 | In drawer |
| `TopSellersRow` | ⬜ New | P2 | Horizontal avatar scroll |

**Note:** CategoryDrawer already exists at `components/mobile/drawers/category-browse-drawer.tsx`

### Navigation Components
| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| `UnifiedSearchDrawer` | ⬜ New | P0 | AI + categories + recent |
| `AISearchChat` | ✅ Exists | - | `components/shared/search/search-ai-chat.tsx` |

**Note:** Use existing drawer system. Key existing components:
- `components/providers/drawer-context.tsx` - Drawer state management
- `app/[locale]/global-drawers.tsx` - Drawer registry
- `components/mobile/drawers/category-browse-drawer.tsx` - Category drawer

### Business Dashboard
| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| `DashboardLayout` | ⬜ New | P1 | Business sidebar |
| `StatCard` | ⬜ New | P1 | Metric display |
| `ProductsTable` | ⬜ New | P1 | Bulk actions |
| `CSVImporter` | ⬜ New | P1 | File upload + mapping |
| `CSVExporter` | ⬜ New | P1 | Format selection |
| `AnalyticsChart` | ⬜ New | P2 | Views/revenue graphs |

---

## Components to MODIFY

### Bottom Navigation
| Component | Current Location | Change |
|-----------|-----------------|--------|
| `MobileNav` | `components/navigation/` | Relabel tabs |
| `MobileNavItem` | `components/navigation/` | Add Search drawer trigger |

### Category Navigation
| Component | Current Location | Change |
|-----------|-----------------|--------|
| `CategoryCircles` | `components/mobile/` | Open drawer instead of pills |
| `QuickPills` | `components/mobile/` | REMOVE or demote |
| `CategoryPills` | `components/mobile/` | Move to drawer only |

### Header
| Component | Current Location | Change |
|-----------|-----------------|--------|
| `MobileHeader` | `components/mobile/` | Simplify, AI search focus |
| `SearchInput` | `components/shared/` | Add AI indicator |

### Product Cards
| Component | Current Location | Change |
|-----------|-----------------|--------|
| `ProductCard` | `components/shared/` | Keep but add seller mini-info |
| `ProductCardCompact` | `components/shared/` | Minor polish |

### Profile
| Component | Current Location | Change |
|-----------|-----------------|--------|
| `ProfileHeader` | `components/seller/` | Support business badges |
| `ProfileSettings` | TBD | Add business fields |

---

## Components to REMOVE

| Component | Location | Reason |
|-----------|----------|--------|
| `ContextualPills` | `components/mobile/` | Replaced by drawer |
| `AccountTypeField` | `components/auth/` | Moved to onboarding |
| (TBD based on audit) | | |

---

## Component Architecture

### Drawer System (EXISTING - Use, Don't Recreate)

**Existing infrastructure:**
- `components/ui/drawer.tsx` - Vaul-based primitive
- `components/providers/drawer-context.tsx` - State management
- `app/[locale]/global-drawers.tsx` - Drawer registry

**Current drawer API pattern:**
```tsx
// DrawerContext provides specific open/close for each drawer type
const { 
  openProductQuickView, closeProductQuickView,
  openCart, closeCart,
  openMessages, closeMessages,
  openAccount, closeAccount 
} = useDrawers();

// To add a new drawer:
// 1. Add state to DrawerState in drawer-context.tsx
// 2. Add open/close methods to DrawerContextValue
// 3. Register drawer component in global-drawers.tsx
```

**Note:** There is NO generic `openDrawer(name)` API. Each drawer has explicit typed methods.

**New drawers to add following this pattern:**
- `openUnifiedSearch()` / `closeUnifiedSearch()`
- Extend category drawer methods if needed
├── trending in category
└── top sellers
```

**DO NOT create:** DrawerManager, new base Drawer, or parallel primitives.

### Onboarding System
```
OnboardingProvider (context)
├── currentStep
├── profileData (accumulated)
├── next() / back() / skip()
└── complete()

OnboardingLayout
├── progress indicator
├── back button
├── children (step content)
└── animation wrapper

Each Step Component
├── reads context
├── updates context on input
├── calls next() on continue
└── handles validation
```

---

## Animation Policy

**Rails Constraint:** No new decorative animations.

Use existing patterns only:
- **Drawers:** Vaul handles all drawer animations (do not override)
- **Buttons/cards:** Use existing Tailwind transitions (`transition-colors`, `transition-transform`)
- **Loading:** Use existing skeleton components
- **Focus states:** Use existing ring utilities

```typescript
// DO NOT create new animation variants
// Use existing infrastructure from:
// - components/ui/drawer.tsx (Vaul-based)
// - Tailwind transition utilities
// - Existing skeleton components
```

---

## File Structure Proposal

**Note:** Follow repo conventions. Route-private components go under `app/[locale]/(group)/_components/`. Shared composites go in `components/shared/`.

```
app/[locale]/
├── (main)/
│   ├── _components/
│   │   └── onboarding/           # Route-private onboarding
│   │       ├── onboarding-modal.tsx
│   │       ├── account-type-step.tsx
│   │       ├── profile-setup-step.tsx
│   │       ├── username-step.tsx
│   │       └── location-step.tsx
│   └── _providers/
│       └── onboarding-provider.tsx  # Already exists, modify
├── (business)/
│   └── dashboard/
│       └── _components/          # Dashboard-specific
│           ├── stat-card.tsx
│           ├── products-table.tsx
│           └── analytics-chart.tsx

components/shared/
├── search/                       # Already exists
│   ├── unified-search-drawer.tsx  # New
│   └── category-drawer.tsx        # New
├── feed/                         # New folder
│   ├── seller-feed-card.tsx
│   ├── feed-list.tsx
│   └── view-toggle.tsx

# DO NOT CREATE:
# - components/onboarding/  (use route-private)
# - components/drawers/     (use existing infra)
# - components/dashboard/   (use route-private)
```

---

## Testing Requirements

Each new component needs:
- [ ] Unit tests (Vitest)
- [ ] Storybook story
- [ ] Mobile viewport test
- [ ] Desktop viewport test
- [ ] Accessibility check

---

## Design Tokens

**IMPORTANT:** Use existing Tailwind v4 semantic tokens only. No new tokens, no hardcoded values.

Refer to `.codex/project/DESIGN.md` for SSOT on:
- Border radius (default: 4px)
- Shadows (use existing Tailwind shadow classes)
- Transitions (use existing patterns in codebase)

**DO NOT add:**
- Custom CSS variables
- Hardcoded rgba() colors
- New transition curves
- Custom shadow definitions

Use existing token system from `app/globals.css` and Tailwind config.
