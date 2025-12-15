import { notFound, redirect } from "next/navigation"
import { createStaticClient } from "@/lib/supabase/server"

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface ProductPageProps {
  params: Promise<{
    slug: string[]
    locale: string
  }>
}

async function findCanonicalUrl(
  segments: string[],
  locale: string
): Promise<string | null> {
  const supabase = createStaticClient()
  if (!supabase) return null

  let product = null

  if (segments.length === 2) {
    const [, productSlug] = segments
    const { data } = await supabase
      .from("products")
      .select("slug, seller:profiles!seller_id(username)")
      .eq("slug", productSlug)
      .single()
    product = data
  } else if (segments.length === 1) {
    const value = segments[0]
    
    if (UUID_REGEX.test(value)) {
      const { data } = await supabase
        .from("products")
        .select("slug, seller:profiles!seller_id(username)")
        .eq("id", value)
        .single()
      product = data
    } else {
      const { data } = await supabase
        .from("products")
        .select("slug, seller:profiles!seller_id(username)")
        .eq("slug", value)
        .single()
      product = data
    }
  }

  const seller = product?.seller as { username?: string } | null
  if (!product?.slug || !seller?.username) {
    return null
  }

  return "/" + locale + "/" + seller.username + "/" + product.slug
}

export default async function ProductRedirectPage({ params }: ProductPageProps) {
  const { slug: segments, locale } = await params

  const canonicalUrl = await findCanonicalUrl(segments, locale)

  if (!canonicalUrl) {
    notFound()
  }

  redirect(canonicalUrl)
}