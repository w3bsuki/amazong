import { createClient } from "@/lib/supabase/server"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function extractProductId(slugOrId: string): { isFullUUID: boolean; idOrSlug: string } {
  if (UUID_REGEX.test(slugOrId)) {
    return { isFullUUID: true, idOrSlug: slugOrId }
  }
  return { isFullUUID: false, idOrSlug: slugOrId }
}

export async function fetchProductByIdOrSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  idOrSlug: string
) {
  if (!supabase) return null

  const { isFullUUID } = extractProductId(idOrSlug)

  if (isFullUUID) {
    const { data } = await supabase.from("products").select("*").eq("id", idOrSlug).single()
    return data
  }

  const { data: bySlug } = await supabase.from("products").select("*").eq("slug", idOrSlug).single()
  if (bySlug) return bySlug

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
