export { CategoryNavItem, TabContent } from "./category-nav-item"
export { CategoryTabs } from "./category-tabs"
export type { CategoryTabsProps } from "./category-tabs"
export { CategoryQuickPills } from "./category-quick-pills"
export type { CategoryQuickPillsProps } from "./category-quick-pills"
export { CategoryCircles } from "./category-circles"
export type { CategoryCirclesProps } from "./category-circles"
export { AllTabFilters } from "./all-tab-filters"
export type { AllTabFiltersProps } from "./all-tab-filters"
export { QuickFilterRow } from "./quick-filter-row"

// Phase 1: Contextual category navigation (Vinted-style)
// ContextualCategoryHeader is handled by AppHeader
export { FilterSortBar } from "./filter-sort-bar"
export type { FilterSortBarProps } from "./filter-sort-bar"

// Phase 2: Treido-mock Smart Anchor Navigation (Morphing Row)

// Phase 3: Native Drawer-based Category Browse (2026-02-01)
export { CategoryDrawerProvider, useCategoryDrawer, useCategoryDrawerOptional } from "./category-drawer-context"
export type { CategoryDrawerProviderProps, CategoryDrawerState, CategoryDrawerActions, DrawerSnap } from "./category-drawer-context"
export { CategoryCirclesSimple } from "./category-circles-simple"
export type { CategoryCirclesSimpleProps } from "./category-circles-simple"

