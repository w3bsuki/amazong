import { getCategoryType, type CategoryType } from "@/lib/utils/category-type";
import { isUuid } from "@/lib/utils/is-uuid";
import type { HeroSpec } from "@/lib/data/product-page";
import { normalizeImageUrl, normalizeImageUrls, PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url";
export type { HeroSpec };
export { isUuid };

/**
 * Resolved hero spec ready for rendering.
 * Now sourced from database via get_hero_specs RPC.
 */
export interface ResolvedHeroSpec {
  label: string;
  value: string;
  priority: number;
}

export interface GalleryImage {
  src: string;
  altKey: string;
  altParams: Record<string, string | number>;
  width: number;
  height: number;
}

export interface ItemSpecificDetail {
  key: string;
  value: string;
}

export interface ProductPageItemSpecifics {
  details: ItemSpecificDetail[];
  attributes: Record<string, unknown>;
}

export interface SellerProductsGridItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number | null;
  image: string;
  rating: number;
  reviews: number;
  sellerName: string;
  sellerVerified: boolean;
  sellerAvatarUrl: string;
  condition: string;
  freeShipping: boolean;
  categorySlug: string;
  attributes: Record<string, string>;
  storeSlug?: string | null;
  slug?: string | null;
}

export interface ProductPageViewModel {
  sellerName: string;
  sellerAvatarUrl: string;
  sellerVerified: boolean;
  galleryImages: GalleryImage[];
  itemSpecifics: ProductPageItemSpecifics;
  relatedProducts: SellerProductsGridItem[];
  jsonLd: Record<string, unknown>;
  breadcrumbJsonLd: Record<string, unknown>;
  /** Category-adaptive hero specs (up to 4 key attributes) */
  heroSpecs: ResolvedHeroSpec[];
  /** Category type for CTA customization */
  categoryType: CategoryType;
}

export type ProductPageProductLike = {
  id: string;
  title: string;
  description?: string | null;
  meta_description?: string | null;
  images?: unknown;
  attributes?: unknown;
  condition?: string | null;
  price?: unknown;
  list_price?: unknown;
  rating?: unknown;
  review_count?: unknown;
  stock?: unknown;
  free_shipping?: unknown;
} & Record<string, unknown>;

export type ProductPageSellerLike = {
  id: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  verified?: unknown;
} & Record<string, unknown>;

export type ProductPageCategoryLike = {
  id: string;
  name?: string | null;
  slug?: string | null;
  parent_id?: string | null;
} & Record<string, unknown>;

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function toFiniteNumber(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toStringAttributes(value: unknown): Record<string, string> {
  const source = toRecord(value);
  const normalized: Record<string, string> = {};

  for (const [key, attributeValue] of Object.entries(source)) {
    if (attributeValue == null) continue;
    normalized[key] = String(attributeValue);
  }

  return normalized;
}

function buildItemSpecificsDetails(attributes: unknown, condition?: string | null) {
  const details: ItemSpecificDetail[] = [];
  
  // Condition comes from dedicated column only (not attributes JSONB)
  if (condition) {
    details.push({ key: "condition", value: condition });
  }

  const attrs = toRecord(attributes);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null) continue;
    // Skip 'condition' from attributes - it's already shown from the dedicated column above
    if (key.toLowerCase() === 'condition') continue;
    details.push({ key, value: String(value) });
  }

  return details;
}

function buildGalleryImages(productTitle: string, images: string[]) {
  return images.map((src, idx) => ({
    src,
    altKey: "imageAlt",
    altParams: { title: productTitle, index: idx + 1 },
    width: 1200,
    height: 1200,
  }));
}

/**
 * Get product images - prioritizes normalized product_images table (WebP),
 * falls back to legacy images JSON array
 */
function getProductImages(product: ProductPageProductLike): string[] {
  // First check for product_images relation (normalized table with WebP images)
  const productImages = (product as { product_images?: Array<{ image_url: string; is_primary?: boolean; display_order?: number }> }).product_images;
  
  if (Array.isArray(productImages) && productImages.length > 0) {
    // Sort by display_order, then prioritize primary image first
    const sorted = [...productImages].sort((a, b) => {
      // Primary image always comes first
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      // Then sort by display_order
      return (a.display_order ?? 0) - (b.display_order ?? 0);
    });
    return sorted.map((img) => normalizeImageUrl(img.image_url));
  }
  
  // Fallback to legacy images JSON array
  const raw = product.images;
  if (Array.isArray(raw) && raw.length > 0) {
    const normalized = normalizeImageUrls(raw as Array<string | null | undefined>);
    return normalized.length > 0 ? normalized : [PLACEHOLDER_IMAGE_PATH];
  }
  return [PLACEHOLDER_IMAGE_PATH];
}

/**
 * Build the product page view model from raw product/seller/category records.
 * Normalizes gallery, item specifics, related products, and hero specs for UI rendering.
 */
export function buildProductPageViewModel(args: {
  username: string;
  product: ProductPageProductLike;
  seller: ProductPageSellerLike;
  category: ProductPageCategoryLike | null;
  parentCategory: ProductPageCategoryLike | null;
  relatedProductsRaw: unknown[];
  /** Database-driven hero specs (preferred). Falls back to config-based if not provided. */
  heroSpecs?: HeroSpec[];
  jsonLd: Record<string, unknown>;
  breadcrumbJsonLd: Record<string, unknown>;
}): ProductPageViewModel {
  const { username, product, seller, category, parentCategory, relatedProductsRaw, heroSpecs: dbHeroSpecs, jsonLd, breadcrumbJsonLd } = args;

  const sellerName = seller.display_name || seller.username || username;
  const sellerAvatarUrl = seller.avatar_url || "";
  const sellerVerified = Boolean(seller.verified);

  const images = getProductImages(product);
  const galleryImages = buildGalleryImages(product.title, images);

  const itemSpecifics = {
    details: buildItemSpecificsDetails(product.attributes, product.condition),
    attributes: toRecord(product.attributes),
  } satisfies ProductPageItemSpecifics;

  const relatedProducts = (Array.isArray(relatedProductsRaw) ? relatedProductsRaw : []).flatMap((p) => {
    if (!p || typeof p !== "object") return [];

    const row = p as Record<string, unknown>;
    const rowImages = row.images;
    const id =
      typeof row.id === "string" || typeof row.id === "number" ? String(row.id).trim() : "";
    const title = typeof row.title === "string" ? row.title.trim() : "";
    const price = toFiniteNumber(row.price);

    if (!id || !title || price == null) {
      return [];
    }

    const originalPrice = toFiniteNumber(row.list_price);

    return [{
      id,
      title,
      price,
      originalPrice,
      image: normalizeImageUrl(
        (Array.isArray(rowImages) ? (rowImages[0] as string | undefined) : undefined) ?? null,
      ),
      rating: toFiniteNumber(row.rating) ?? 0,
      reviews: toFiniteNumber(row.review_count) ?? 0,
      sellerName,
      sellerVerified,
      sellerAvatarUrl,
      condition: typeof row.condition === "string" ? row.condition : "",
      freeShipping: row.free_shipping === true,
      categorySlug: row.category_id == null ? "" : String(row.category_id),
      attributes: toStringAttributes(row.attributes),
      storeSlug: (seller.username ?? username) ?? null,
      slug: typeof row.slug === "string" ? row.slug : null,
    } satisfies SellerProductsGridItem];
  });

  // Hero specs are database-driven via get_hero_specs RPC
  // Returns up to 4 key attributes based on category_attributes.is_hero_spec
  const heroSpecs: ResolvedHeroSpec[] = (dbHeroSpecs ?? []).map(spec => ({
    label: spec.label,
    value: spec.value,
    priority: spec.priority,
  }));
  
  const categorySlug = category?.slug ?? null;
  const parentSlug = parentCategory?.slug ?? null;
  const categoryType = getCategoryType(categorySlug, parentSlug);

  return {
    sellerName,
    sellerAvatarUrl,
    sellerVerified,
    galleryImages,
    itemSpecifics,
    relatedProducts,
    jsonLd,
    breadcrumbJsonLd,
    heroSpecs,
    categoryType,
  };
}
