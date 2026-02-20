/**
 * Category Icons — Re-exports from shared locations.
 *
 * Color/tone logic: `lib/category-colors.ts` (pure, no React).
 * Icon rendering:   `components/shared/category-icons.tsx` (React + Lucide).
 *
 * This file re-exports both so existing consumers within (main) keep working.
 */

// Re-export color utilities
export {
  getCategoryColor,
  resolveCategoryTone,
  type CategoryColorScheme,
  type CategoryTone,
} from "@/lib/category-colors"

// Re-export icon renderer
export { getCategoryIcon, type IconSize } from "@/components/shared/category-icons"
