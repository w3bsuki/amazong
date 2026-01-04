import { createStaticClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { normalizeOptionalImageUrl } from "@/lib/normalize-image-url"
import { cacheLife, cacheTag } from "next/cache"

// NOTE: This endpoint serves public data (no user cookies required).
// In Cache Components mode, avoid Dynamic APIs like `connection()` and avoid
// cookie-backed clients in route handlers to keep responses stable.

// Align CDN cache headers with next.config.ts cacheLife.categories
// (revalidate: 3600s, stale: 300s)
const CACHE_TTL_SECONDS = 3600
const CACHE_STALE_WHILE_REVALIDATE = 300

const MAX_CHILDREN_DEPTH = 2
const MAX_HIERARCHY_DEPTH = 5

function clampDepth(input: string | null, max: number) {
  const parsed = Number.parseInt(input || "", 10)
  if (!Number.isFinite(parsed)) return 1
  return Math.min(Math.max(parsed, 1), max)
}

// Type for the RPC return
interface CategoryHierarchyRow {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  depth: number
  path: string[]
  image_url: string | null
  icon: string | null
  display_order: number | null
}

// Type for the nested category structure
interface CategoryWithChildren {
  id: string
  name: string
  name_bg: string | null
  slug: string
  icon: string | null
  image_url: string | null
  display_order: number | null
  children?: CategoryWithChildren[]
}

// Transform flat RPC results into nested tree structure
function buildCategoryTree(rows: CategoryHierarchyRow[]): CategoryWithChildren[] {
  const categoryMap = new Map<string, CategoryWithChildren>()
  const rootCategories: CategoryWithChildren[] = []
  
  // Filter out deprecated categories (display_order >= 9000)
  const activeRows = rows.filter(row => (row.display_order ?? 0) < 9000)

  // First pass: create all category objects
  for (const row of activeRows) {
    categoryMap.set(row.id, {
      id: row.id,
      name: row.name,
      name_bg: row.name_bg,
      slug: row.slug,
      icon: row.icon,
      image_url: normalizeOptionalImageUrl(row.image_url),
      display_order: row.display_order,
      children: []
    })
  }

  // Second pass: build tree structure
  for (const row of activeRows) {
    const category = categoryMap.get(row.id)!

    if (row.parent_id && categoryMap.has(row.parent_id)) {
      // Add to parent's children
      const parent = categoryMap.get(row.parent_id)!
      parent.children = parent.children || []
      parent.children.push(category)
    } else if (row.depth === 0) {
      // Root category
      rootCategories.push(category)
    }
  }

  // Sort children by display_order, then by name
  function sortChildren(cats: CategoryWithChildren[]): CategoryWithChildren[] {
    cats.sort((a, b) => {
      const orderA = a.display_order ?? 999
      const orderB = b.display_order ?? 999
      if (orderA !== orderB) return orderA - orderB
      return a.name.localeCompare(b.name)
    })
    for (const cat of cats) {
      if (cat.children && cat.children.length > 0) {
        sortChildren(cat.children)
      }
    }
    return cats
  }

  return sortChildren(rootCategories)
}

// Helper to create cached JSON response with proper headers
function cachedJsonResponse(data: unknown) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
      'CDN-Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
      'Vercel-CDN-Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
    }
  })
}

async function getRootCategoriesCached() {
  'use cache'
  cacheTag('categories', 'root-categories')
  cacheLife('categories')

  const supabase = createStaticClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, name_bg, slug, icon, image_url, parent_id, display_order")
    .is("parent_id", null)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) throw error

  return (data || []).map((cat) => ({
    ...cat,
    image_url: normalizeOptionalImageUrl(cat.image_url),
  }))
}

async function getRootWithChildrenCached(depth: number) {
  'use cache'
  cacheTag('categories', 'root-with-children')
  cacheLife('categories')

  const supabase = createStaticClient()
  if (!supabase) {
    return {
      categories: [],
      _debug: { totalCount: 0, rootCount: 0, rootCategories: [] },
    }
  }

  const { data: rootCats, error: rootError } = await supabase
    .from("categories")
    .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
    .is("parent_id", null)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })

  if (rootError) throw rootError

  const rootIds = (rootCats || []).map((c) => c.id)
  const { data: l1Cats, error: l1Error } = await supabase
    .from("categories")
    .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
    .in("parent_id", rootIds)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })

  if (l1Error) throw l1Error

  let l2Cats: typeof l1Cats = []
  if (depth >= 2 && l1Cats && l1Cats.length > 0) {
    const l1Ids = l1Cats.map((c) => c.id)
    const BATCH_SIZE = 50
    const CONCURRENCY = 4

    const batches: Array<{ index: number; ids: string[] }> = []
    for (let i = 0; i < l1Ids.length; i += BATCH_SIZE) {
      batches.push({ index: i / BATCH_SIZE, ids: l1Ids.slice(i, i + BATCH_SIZE) })
    }

    const results: typeof l1Cats = []
    for (let start = 0; start < batches.length; start += CONCURRENCY) {
      const chunk = batches.slice(start, start + CONCURRENCY)
      const chunkResults = await Promise.all(
        chunk.map(async ({ index, ids }) => {
          try {
            const { data: l2Data, error: l2Error } = await supabase
              .from("categories")
              .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
              .in("parent_id", ids)
              .lt("display_order", 9000)
              .order("display_order", { ascending: true })

            if (l2Error) {
              console.error(`L2 Categories Query Error (batch ${index}):`, l2Error)
              return []
            }
            return l2Data || []
          } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err))
            console.error(`L2 Categories Batch Error (batch ${index}):`, {
              message: error.message,
              details: error.toString(),
            })
            return []
          }
        })
      )

      for (const part of chunkResults) results.push(...part)
    }

    l2Cats = results
  }

  const cats = [...(rootCats || []), ...(l1Cats || []), ...l2Cats]

  const categoryMap = new Map<string, CategoryWithChildren>()
  const rootCategories: CategoryWithChildren[] = []

  for (const cat of cats) {
    categoryMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      name_bg: cat.name_bg,
      slug: cat.slug,
      icon: cat.icon,
      image_url: normalizeOptionalImageUrl(cat.image_url),
      display_order: cat.display_order,
      children: [],
    })
  }

  for (const cat of cats) {
    const category = categoryMap.get(cat.id)!
    if (cat.parent_id && categoryMap.has(cat.parent_id)) {
      const parent = categoryMap.get(cat.parent_id)!
      parent.children = parent.children || []
      parent.children.push(category)
    } else if (!cat.parent_id) {
      rootCategories.push(category)
    }
  }

  function sortChildren(categories: CategoryWithChildren[]) {
    categories.sort((a, b) => {
      const orderA = a.display_order ?? 999
      const orderB = b.display_order ?? 999
      if (orderA !== orderB) return orderA - orderB
      return a.name.localeCompare(b.name)
    })
    for (const cat of categories) {
      if (cat.children && cat.children.length > 0) {
        sortChildren(cat.children)
      }
    }
  }
  sortChildren(rootCategories)

  return {
    categories: rootCategories,
    _debug: {
      totalCount: cats.length,
      rootCount: rootCategories.length,
      rootCategories: rootCategories.map((c) => ({
        name: c.name,
        slug: c.slug,
        display_order: c.display_order,
      })),
    },
  }
}

async function getCategoryHierarchyCached(parentSlug: string, depth: number) {
  'use cache'
  cacheTag('categories', `category-hierarchy-${parentSlug}`)
  cacheLife('categories')

  const supabase = createStaticClient()
  if (!supabase) return { categories: [], parent: null }

  // Use recursive CTE via raw SQL instead of RPC (more efficient, no wrapper overhead)
  // First get the parent category
  const { data: parentCat, error: parentError } = await supabase
    .from('categories')
    .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
    .eq('slug', parentSlug)
    .single()

  if (parentError || !parentCat) {
    return { categories: [], parent: null }
  }

  // Then get all descendants up to depth
  const { data: descendants, error: descendantsError } = await supabase
    .from('categories')
    .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
    .eq('parent_id', parentCat.id)
    .order('display_order')
    .order('name')

  if (descendantsError) throw descendantsError

  const rows = (descendants || []).map((c, idx) => ({
    ...c,
    depth: 1,
    path: [parentSlug, c.slug],
  })) as CategoryHierarchyRow[]

  // Build tree from flat list  
  const tree = buildCategoryTree([
    { ...parentCat, depth: 0, path: [parentSlug] } as CategoryHierarchyRow,
    ...rows,
  ])

  const root = tree[0]
  if (!root) return { categories: [], parent: null }

  return {
    categories: root.children ?? [],
    parent: {
      id: root.id,
      name: root.name,
      name_bg: root.name_bg,
      slug: root.slug,
    },
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentSlug = searchParams.get("parent")
    const includeChildren = searchParams.get("children") === "true"
    const childrenDepth = clampDepth(searchParams.get("depth"), MAX_CHILDREN_DEPTH)
    const hierarchyDepth = clampDepth(searchParams.get("depth"), MAX_HIERARCHY_DEPTH)

    if (parentSlug) {
      const data = await getCategoryHierarchyCached(parentSlug, hierarchyDepth)
      return cachedJsonResponse(data)
    }

    if (includeChildren) {
      const data = await getRootWithChildrenCached(childrenDepth)
      return cachedJsonResponse(data)
    }

    const categories = await getRootCategoriesCached()
    return cachedJsonResponse({ categories })
  } catch (error) {
    console.error("Categories API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}