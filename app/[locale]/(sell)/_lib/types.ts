// ============================================================================
// SELL PAGE TYPES - Single Source of Truth
// ============================================================================

/**
 * Category type with recursive children support
 * Supports unlimited nesting levels for hierarchical categories
 */
export interface Category {
  id: string;
  name: string;
  name_bg?: string | null;
  slug: string;
  parent_id: string | null;
  display_order?: number | null;
  children?: Category[]; // Optional to support both flat and nested structures
}

export type CategoryPathItem = Pick<Category, "id" | "name" | "name_bg" | "slug">;

/**
 * Seller/Store information
 */
export interface Seller {
  id: string;
  store_name: string;
  store_slug?: string;
}

