"use cache"
/**
 * Server-only Badge Specs Functions
 * 
 * This file contains cached server functions for fetching badge specs.
 * Import from 'category-badge-specs.ts' for client-safe utilities.
 */

import { createStaticClient } from "@/lib/supabase/server"
import { cacheLife, cacheTag } from "next/cache"

export interface BadgeSpec {
  attributeKey: string
  label: string
  value: string
  priority: number
  unitSuffix: string | null
}

/**
 * Get badge specs for a product via RPC.
 * Server-side only (uses 'use cache').
 */
export async function getBadgeSpecs(
  productId: string,
  locale: string = "en"
): Promise<BadgeSpec[]> {
  cacheLife("products")
  cacheTag(`product:${productId}:badges`)

  const supabase = createStaticClient()

  const { data, error } = await supabase.rpc("get_badge_specs", {
    p_product_id: productId,
    p_locale: locale,
  })

  if (error) {
    console.error("[getBadgeSpecs] Error:", error.message)
    return []
  }

  return (data || []).map((row) => ({
    attributeKey: row.attribute_key,
    label: row.label,
    value: row.value,
    priority: row.priority,
    unitSuffix: row.unit_suffix,
  }))
}
