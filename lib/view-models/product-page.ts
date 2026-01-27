import type { Metadata } from "next";
import { getCategoryType, type CategoryType } from "@/lib/utils/category-type";
import type { HeroSpec } from "@/lib/data/product-page";
export type { HeroSpec };

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
  alt: string;
  width: number;
  height: number;
}

export interface ItemSpecificDetail {
  label: string;
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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_REGEX.test(value);
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function buildItemSpecificsDetails(attributes: unknown, condition?: string | null) {
  const details: ItemSpecificDetail[] = [];
  
  // Condition comes from dedicated column only (not attributes JSONB)
  if (condition) {
    details.push({ label: "Condition", value: condition });
  }

  const attrs = toRecord(attributes);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null) continue;
    // Skip 'condition' from attributes - it's already shown from the dedicated column above
    if (key.toLowerCase() === 'condition') continue;
    const label = key.replaceAll('_', " ").replaceAll(/\b\w/g, (c) => c.toUpperCase());
    details.push({ label, value: String(value) });
  }

  return details;
}

function buildGalleryImages(productTitle: string, images: string[]) {
  return images.map((src, idx) => ({
    src,
    alt: `${productTitle} – image ${idx + 1}`,
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
    return sorted.map(img => img.image_url);
  }
  
  // Fallback to legacy images JSON array
  const raw = product.images;
  return Array.isArray(raw) && raw.length > 0 ? (raw as string[]) : ["/placeholder.svg"];
}

export function buildProductPageViewModel(args: {
  locale: string;
  username: string;
  productSlug: string;
  product: ProductPageProductLike;
  seller: ProductPageSellerLike;
  category: ProductPageCategoryLike | null;
  parentCategory: ProductPageCategoryLike | null;
  relatedProductsRaw: unknown[];
  /** Database-driven hero specs (preferred). Falls back to config-based if not provided. */
  heroSpecs?: HeroSpec[];
}): ProductPageViewModel {
  const { locale, username, productSlug, product, seller, category, parentCategory, relatedProductsRaw, heroSpecs: dbHeroSpecs } = args;

  const sellerName = seller.display_name || seller.username || username;
  const sellerAvatarUrl = seller.avatar_url || "";
  const sellerVerified = Boolean(seller.verified);

  const images = getProductImages(product);
  const galleryImages = buildGalleryImages(product.title, images);

  const itemSpecifics = {
    details: buildItemSpecificsDetails(product.attributes, product.condition),
    attributes: toRecord(product.attributes),
  } satisfies ProductPageItemSpecifics;

  const relatedProducts = (Array.isArray(relatedProductsRaw) ? relatedProductsRaw : []).map((p) => {
    const row = p as Record<string, unknown>;
    const rowImages = row.images;

    return {
      id: String(row.id ?? ""),
      title: String(row.title ?? ""),
      price: Number(row.price ?? 0),
      originalPrice: row.list_price != null ? Number(row.list_price) : null,
      image: (Array.isArray(rowImages) ? (rowImages[0] as string | undefined) : undefined) || "/placeholder.svg",
      rating: Number(row.rating ?? 0),
      reviews: Number(row.review_count ?? 0),
      sellerName,
      sellerVerified,
      sellerAvatarUrl,
      condition: String(row.condition || ""),
      freeShipping: Boolean(row.free_shipping),
      categorySlug: String(row.category_id || ""),
      attributes: (toRecord(row.attributes) as Record<string, string>) ?? {},
      storeSlug: (seller.username ?? username) ?? null,
      slug: (row.slug as string | null | undefined) ?? null,
    } satisfies SellerProductsGridItem;
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://treido.eu";

  // IMPORTANT: Keep key order/structure identical to the original page.tsx JSON-LD.
  const productAttributes = product.attributes as Record<string, unknown> | null | undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: (Array.isArray(product.images) ? product.images : []) || [],
    sku: product.id,
    brand: productAttributes?.brand
      ? { "@type": "Brand", name: productAttributes.brand as string }
      : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability: Number(product.stock ?? 0) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: seller?.display_name || seller?.username || "Seller",
        url: `${siteUrl}/${locale}/${seller?.username}`,
      },
      url: `${siteUrl}/${locale}/${username}/${productSlug}`,
    },
    aggregateRating: Number(product.review_count ?? 0) > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: (product.rating as number | null | undefined) || 0,
          reviewCount: product.review_count,
        }
      : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/${locale}`,
      },
      ...(parentCategory
        ? [{
            "@type": "ListItem",
            position: 2,
            name: parentCategory.name,
            item: `${siteUrl}/${locale}/categories/${parentCategory.slug}`,
          }]
        : []),
      ...(category
        ? [{
            "@type": "ListItem",
            position: parentCategory ? 3 : 2,
            name: category.name,
            item: `${siteUrl}/${locale}/categories/${category.slug}`,
          }]
        : []),
      {
        "@type": "ListItem",
        position: (parentCategory ? 3 : 2) + (category ? 1 : 0),
        name: product.title,
        item: `${siteUrl}/${locale}/${username}/${productSlug}`,
      },
    ],
  };

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

export function buildProductPageMetadata(args: {
  locale: string;
  username: string;
  productSlug: string;
  product: ProductPageProductLike;
  seller: ProductPageSellerLike | null;
}): Metadata {
  const { locale, username, productSlug, product, seller } = args;

  const displayName = seller?.display_name || seller?.username || username;
  const canonicalUrl = `/${locale}/${username}/${productSlug}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://treido.eu";
  const fullCanonicalUrl = `${siteUrl}${canonicalUrl}`;

  const description = product.meta_description
    || (product.description ? product.description.slice(0, 155) : null)
    || `Shop ${product.title} from ${displayName}`;

  const ogImage = Array.isArray(product.images) && product.images?.[0]
    ? (product.images[0] as string)
    : null;

  return {
    title: `${product.title} | ${displayName}`,
    description,
    alternates: {
      canonical: fullCanonicalUrl,
      languages: {
        en: `${siteUrl}/en/${username}/${productSlug}`,
        bg: `${siteUrl}/bg/${username}/${productSlug}`,
      },
    },
    openGraph: {
      title: product.title,
      type: "website",
      url: fullCanonicalUrl,
      siteName: "Treido",
      description,
      images: ogImage
        ? [{
            url: ogImage,
            alt: product.title,
            width: 1200,
            height: 630,
          }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
