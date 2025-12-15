import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/server'

// =============================================================================
// DYNAMIC SITEMAP GENERATION FOR SEO
// Generates sitemap.xml with all products, categories, and profiles
// =============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://amazong.com'
const LOCALES = ['en', 'bg']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  if (categories) {
    for (const category of categories) {
      for (const locale of LOCALES) {
        entries.push({
          url: `${BASE_URL}/${locale}/categories/${category.slug}`,
          lastModified: category.created_at ? new Date(category.created_at) : new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        })
      }
    }
  }

  // Add seller profiles (users with is_seller = true)
  const { data: sellers } = await supabase
    .from('profiles')
    .select('username, updated_at')
    .eq('is_seller', true)
    .not('username', 'is', null)

  if (sellers) {
    for (const seller of sellers) {
      if (!seller.username) continue
      for (const locale of LOCALES) {
        entries.push({
          url: `${BASE_URL}/${locale}/${seller.username}`,
          lastModified: seller.updated_at ? new Date(seller.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  }

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

  if (products) {
    for (const product of products) {
      if (!product.slug) continue
      const username = (product.seller as { username: string | null } | null)?.username
      if (!username) continue

      for (const locale of LOCALES) {
        entries.push({
          url: `${BASE_URL}/${locale}/${username}/${product.slug}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
          changeFrequency: 'daily',
          priority: 0.9, // Products are highest priority for e-commerce
        })
      }
    }
  }

  return entries
}

// Static pages that should always be in the sitemap
function getStaticPages(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/categories', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/search', priority: 0.8, changeFrequency: 'hourly' as const },
    { path: '/todays-deals', priority: 0.8, changeFrequency: 'hourly' as const },
    { path: '/sellers', priority: 0.7, changeFrequency: 'weekly' as const },
    { path: '/sell', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/help', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  const entries: MetadataRoute.Sitemap = []

  for (const page of staticPages) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    }
  }

  return entries
}
