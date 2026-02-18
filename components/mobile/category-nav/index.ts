export { CategoryPillRail } from "./category-pill-rail"
export type { CategoryPillRailProps, CategoryPillRailItem } from "./category-pill-rail"

export { CategoryDrilldownRail } from "./category-drilldown-rail"
export type { CategoryDrilldownRailProps, DrilldownSegment, DrilldownOption } from "./category-drilldown-rail"

// Phase 1: Contextual category navigation (Vinted-style)
// ContextualCategoryHeader is handled by AppHeader
export { FilterSortBar } from "./filter-sort-bar"
export type { FilterSortBarProps, FilterSortBarQuickPill } from "./filter-sort-bar"

// Phase 2: Treido-mock Smart Anchor Navigation (Morphing Row)

// Phase 3: Native Drawer-based Category Browse (2026-02-01)
export { CategoryDrawerProvider, useCategoryDrawer, useCategoryDrawerOptional } from "./category-drawer-context"
export type { CategoryDrawerProviderProps, CategoryDrawerState, CategoryDrawerActions, DrawerSnap } from "./category-drawer-context"

