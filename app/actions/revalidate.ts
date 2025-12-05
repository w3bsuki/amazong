'use server'

import { revalidateTag, updateTag } from 'next/cache'

// =============================================================================
// Cache Invalidation - Two Simple Strategies
// =============================================================================
//
// 1. revalidateTag(tag, 'max') → Stale-while-revalidate (background refresh)
//    Use for: webhooks, admin changes, background jobs
//
// 2. updateTag(tag) → Immediate invalidation (blocking)
//    Use for: user-initiated changes (read-your-own-writes)
//
// =============================================================================

/** Revalidate products (stale-while-revalidate) */
export async function revalidateProducts() {
  revalidateTag('products', 'max')
}

/** Revalidate categories (stale-while-revalidate) */
export async function revalidateCategories() {
  revalidateTag('categories', 'max')
}

/** Revalidate specific product (stale-while-revalidate) */
export async function revalidateProduct(productId: string) {
  revalidateTag(`product-${productId}`, 'max')
  revalidateTag('products', 'max')
}

/** Immediate update after user mutation (read-your-own-writes) */
export async function updateProduct(productId: string) {
  updateTag(`product-${productId}`)
  updateTag('products')
}

/** Revalidate all (use sparingly) */
export async function revalidateAll() {
  revalidateTag('products', 'max')
  revalidateTag('categories', 'max')
  revalidateTag('deals', 'max')
}
