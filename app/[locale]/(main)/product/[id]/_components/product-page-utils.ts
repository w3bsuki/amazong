import { createClient } from "@/lib/supabase/server"

// UUID regex pattern to detect if the id is a full UUID
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Helper function to extract product ID from slug
// Slug format: "product-name-12345678" where last 8 chars are the short UUID
export function extractProductId(slugOrId: string): { isFullUUID: boolean; idOrSlug: string } {
  if (UUID_REGEX.test(slugOrId)) {
    return { isFullUUID: true, idOrSlug: slugOrId }
  }
  return { isFullUUID: false, idOrSlug: slugOrId }
}

// Helper function to get delivery date
export function getDeliveryDate(locale: string): string {
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 3)
  return deliveryDate.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

// Helper to fetch product by UUID or slug
export async function fetchProductByIdOrSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  idOrSlug: string
) {
  if (!supabase) return null

  const { isFullUUID } = extractProductId(idOrSlug)

  if (isFullUUID) {
    // Direct UUID lookup
    const { data } = await supabase.from("products").select("*").eq("id", idOrSlug).single()
    return data
  }

  // Slug lookup - try exact match first
  const { data: bySlug } = await supabase.from("products").select("*").eq("slug", idOrSlug).single()

  if (bySlug) return bySlug

  // Try to extract the short ID from the end of the slug (last 8 chars after the last hyphen)
  const parts = idOrSlug.split("-")
  const shortId = parts[parts.length - 1]
  if (shortId && shortId.length === 8) {
    const { data: byShortId } = await supabase
      .from("products")
      .select("*")
      .ilike("id", `${shortId}%`)
      .single()
    return byShortId
  }

  return null
}
