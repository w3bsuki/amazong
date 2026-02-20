import CategoryPage, { generateMetadata as generateMetadataSingle } from "../page"
import { createStaticClient } from "@/lib/supabase/server"
import { routing } from "@/i18n/routing"

const PLACEHOLDER_SLUG = '__placeholder__'
const PLACEHOLDER_SUBSLUG = '__placeholder_sub__'

// Generate static params for parent/child category pairs (for SSG)
// Uses createStaticClient because this runs at build time outside request scope
export async function generateStaticParams() {
  const supabase = createStaticClient()
  const MAX_STATIC_SUBCATEGORY_PAIRS = 50
  
  // Fallback when Supabase isn't configured (e.g. local/E2E)
  if (!supabase) {
    return routing.locales.map((locale) => ({
      locale,
      slug: PLACEHOLDER_SLUG,
      subslug: PLACEHOLDER_SUBSLUG,
    }))
  }

  // Fetch categories with their parent's slug for nested routes
  // Only include categories that have a parent (subcategories)
  const { data: categories } = await supabase
    .from("categories")
    .select(`
      slug,
      display_order,
      parent:parent_id (slug)
    `)
    .not("parent_id", "is", null)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })
    .limit(MAX_STATIC_SUBCATEGORY_PAIRS)

  if (!categories || categories.length === 0) {
    return routing.locales.map((locale) => ({
      locale,
      slug: PLACEHOLDER_SLUG,
      subslug: PLACEHOLDER_SUBSLUG,
    }))
  }

  // Build locale × slug × subslug combinations
  const params: Array<{ locale: string; slug: string; subslug: string }> = []
  
  for (const cat of categories) {
    const subslug = cat.slug
    // Parent is returned as array from Supabase relations, take first
    const parentData = Array.isArray(cat.parent) ? cat.parent[0] : cat.parent
    const slug = (parentData as { slug: string } | null)?.slug
    
    if (slug && subslug) {
      for (const locale of routing.locales) {
        params.push({ locale, slug, subslug })
      }
    }
  }

  // Fallback if no valid pairs found
  if (params.length === 0) {
    return routing.locales.map((locale) => ({
      locale,
      slug: PLACEHOLDER_SLUG,
      subslug: PLACEHOLDER_SUBSLUG,
    }))
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subslug: string; locale: string }>
}) {
  const { locale, subslug } = await params
  return generateMetadataSingle({ params: Promise.resolve({ locale, slug: subslug }) })
}

export default async function CategoryNestedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; subslug: string; locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale, subslug } = await params
  const mappedParams = Promise.resolve({ locale, slug: subslug })

  return <CategoryPage params={mappedParams} searchParams={searchParams} />
}
