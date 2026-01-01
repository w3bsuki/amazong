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

/**
 * Category-specific attribute definition
 */
interface CategoryAttribute {
  id: string;
  category_id: string;
  name: string;
  name_bg: string | null;
  attribute_type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'date';
  is_required: boolean;
  options: string[];
  options_bg: string[];
  placeholder: string | null;
  placeholder_bg: string | null;
  sort_order: number;
}

/**
 * Custom attribute key-value pair
 */
interface CustomAttribute {
  name: string;
  value: string;
}

/**
 * Product image with positioning
 */
interface ProductImage {
  url: string;
  thumbnailUrl?: string;
  position: number;
}

// ============================================================================
// Tag Options for Product Badges
// ============================================================================

export const TAG_OPTIONS = [
  { value: "new", label: "New", labelBg: "Ново", color: "bg-success", description: "Fresh arrival" },
  { value: "sale", label: "Sale", labelBg: "Разпродажба", color: "bg-destructive", description: "Discounted item" },
  { value: "limited", label: "Limited", labelBg: "Лимитирано", color: "bg-secondary-foreground", description: "Limited availability" },
  { value: "trending", label: "Trending", labelBg: "Популярно", color: "bg-warning", description: "Hot right now" },
  { value: "bestseller", label: "Best Seller", labelBg: "Топ продажби", color: "bg-rating", description: "Top selling item" },
  { value: "premium", label: "Premium", labelBg: "Премиум", color: "bg-primary", description: "High quality" },
  { value: "handmade", label: "Handmade", labelBg: "Ръчна изработка", color: "bg-warning", description: "Handcrafted item" },
  { value: "eco-friendly", label: "Eco-Friendly", labelBg: "Еко", color: "bg-success", description: "Environmentally friendly" },
] as const;

type TagOption = typeof TAG_OPTIONS[number];
