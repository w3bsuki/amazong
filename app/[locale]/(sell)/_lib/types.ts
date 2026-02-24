// ============================================================================
// SELL PAGE TYPES - Single Source of Truth
// ============================================================================

/**
 * Category type with recursive children support
 * Sell flow enforces a strict 2-level tree (root -> leaf).
 */
export interface Category {
  id: string;
  name: string;
  name_bg?: string | null;
  slug: string;
  parent_id: string | null;
  display_order?: number | null;
  children?: Category[];
  allowed_listing_kinds?: string[] | null;
  allowed_transaction_modes?: string[] | null;
  allowed_fulfillment_modes?: string[] | null;
  allowed_pricing_modes?: string[] | null;
  default_fulfillment_mode?: string | null;
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

