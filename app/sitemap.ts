import { MetadataRoute } from 'next'
import { cacheLife, cacheTag } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'

// =============================================================================
// DYNAMIC SITEMAP GENERATION FOR SEO
// Generates sitemap.xml with all products, categories, and profiles
// =============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://treido.eu'
const LOCALES = ['en', 'bg']
const DEFAULT_LAST_MODIFIED = () => new Date()

const STATIC_PAGES = [
  { path: '', priority: 1.0, changeFrequency: 'daily' as const },
  { path: '/categories', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/search', priority: 0.8, changeFrequency: 'hourly' as const },
  { path: '/todays-deals', priority: 0.8, changeFrequency: 'hourly' as const },
  { path: '/sellers', priority: 0.7, changeFrequency: 'weekly' as const },
  { path: '/sell', priority: 0.6, changeFrequency: 'monthly' as const },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/customer-service', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/returns', priority: 0.4, changeFrequency: 'yearly' as const },
] as const

function pushLocalizedEntry(
  entries: MetadataRoute.Sitemap,
  getPath: (locale: string) => string,
  lastModified: Date,
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
  priority: number
): void {
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}${getPath(locale)}`,
      lastModified,
      changeFrequency,
      priority,
    })
  }
}

function appendCategoryEntries(
  entries: MetadataRoute.Sitemap,
  categories: Array<{ slug: string | null; created_at: string | null }> | null
): void {
  for (const category of categories || []) {
    if (!category.slug) continue
    pushLocalizedEntry(
      entries,
      () => `/categories/${category.slug}`,
      category.created_at ? new Date(category.created_at) : DEFAULT_LAST_MODIFIED(),
      "daily",
      0.8
    )
  }
}

function appendSellerEntries(
  entries: MetadataRoute.Sitemap,
  sellers: Array<{ username: string | null; updated_at: string | null }> | null
): void {
  for (const seller of sellers || []) {
    if (!seller.username) continue
    pushLocalizedEntry(
      entries,
      () => `/${seller.username}`,
      seller.updated_at ? new Date(seller.updated_at) : DEFAULT_LAST_MODIFIED(),
      "weekly",
      0.7
    )
  }
}

function appendProductEntries(
  entries: MetadataRoute.Sitemap,
  products:
    | Array<{
        slug: string | null
        updated_at: string | null
        seller: { username: string | null } | null
      }>
    | null
): void {
  for (const product of products || []) {
    if (!product.slug) continue
    const username = (product.seller as { username: string | null } | null)?.username
    if (!username) continue

    pushLocalizedEntry(
      entries,
      () => `/${username}/${product.slug}`,
      product.updated_at ? new Date(product.updated_at) : DEFAULT_LAST_MODIFIED(),
      "daily",
      0.9
    )
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache'
  cacheTag('sitemap')
  cacheLife('revalidate_1h')

  const supabase = createStaticClient()
  
  if (!supabase) {
    // Return basic sitemap if no database connection
    return getStaticPages()
  }

  const entries: MetadataRoute.Sitemap = []

  // Add static pages
  entries.push(...getStaticPages())

  // Add categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, created_at')
    .order('name')

  appendCategoryEntries(
    entries,
    (categories as Array<{ slug: string | null; created_at: string | null }> | null) ?? null
  )

  // Add seller profiles (users with is_seller = true)
  const { data: sellers } = await supabase
    .from('profiles')
    .select('username, updated_at')
    .eq('is_seller', true)
    .not('username', 'is', null)

  appendSellerEntries(
    entries,
    (sellers as Array<{ username: string | null; updated_at: string | null }> | null) ?? null
  )

  // Add products (active products with slugs)
  // Fetch products with their seller's username for SEO URLs
  const { data: products } = await supabase
    .from('products')
    .select(`
      slug,
      updated_at,
      seller:profiles!products_seller_id_fkey(username)
    `)
    .eq('status', 'active')
    .not('slug', 'is', null)
    .limit(50000) // Sitemap limit

  appendProductEntries(
    entries,
    (products as Array<{
      slug: string | null
      updated_at: string | null
      seller: { username: string | null } | null
    }> | null) ?? null
  )

  return entries
}

// Static pages that should always be in the sitemap
function getStaticPages(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const page of STATIC_PAGES) {
    pushLocalizedEntry(
      entries,
      () => page.path,
      DEFAULT_LAST_MODIFIED(),
      page.changeFrequency,
      page.priority
    )
  }

  return entries
}
