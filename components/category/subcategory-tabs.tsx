import { SubcategoryCircles } from "@/components/category/subcategory-circles"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url?: string | null
}

interface SubcategoryTabsProps {
  currentCategory: Category | null
  subcategories: Category[]
  parentCategory?: Category | null  // Kept for backward compatibility (not used here, breadcrumb is separate)
  basePath?: string // "/categories" or undefined for "/search?category="
}

/**
 * Category header section with title and subcategory circles.
 * Breadcrumb is now handled separately at page level for full-width centered layout.
 */
export function SubcategoryTabs({ currentCategory, subcategories, basePath }: SubcategoryTabsProps) {
  if (!currentCategory) return null

  // Title is now shown in sidebar, so we only show subcategory circles here
  return (
    <div className="mb-4 pb-2 border-b border-border">
      {/* Subcategory Circles - horizontal scroll */}
      {subcategories.length > 0 && (
        <SubcategoryCircles
          subcategories={subcategories}
          currentCategory={currentCategory}
          {...(basePath ? { basePath } : {})}
        />
      )}
    </div>
  )
}
