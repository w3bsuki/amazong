import { createStaticClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { normalizeImageUrl } from "@/lib/normalize-image-url"

// NOTE: This endpoint serves public data (no user cookies required).
// In Cache Components mode, avoid Dynamic APIs like `connection()` and avoid
// cookie-backed clients in route handlers to keep responses stable.

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

  console.log(`[buildCategoryTree] Input rows: ${rows.length}`)
  
  // Filter out deprecated categories (display_order >= 9000)
  const activeRows = rows.filter(row => (row.display_order ?? 0) < 9000)
  
  console.log(`[buildCategoryTree] Active rows after filter: ${activeRows.length}`)
  
  // Log root categories before building tree
  const rootRowsBefore = activeRows.filter(r => r.depth === 0)
  console.log(`[buildCategoryTree] Root rows (depth=0): ${rootRowsBefore.length}`)

  // First pass: create all category objects
  for (const row of activeRows) {
    categoryMap.set(row.id, {
      id: row.id,
      name: row.name,
      name_bg: row.name_bg,
      slug: row.slug,
      icon: row.icon,
      image_url: normalizeImageUrl(row.image_url),
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentSlug = searchParams.get("parent")
    const includeChildren = searchParams.get("children") === "true"
    const depth = Number.parseInt(searchParams.get("depth") || "1")

    let supabase
    try {
      supabase = createStaticClient()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Database connection failed"
      return NextResponse.json({ error: message }, { status: 500 })
    }

    if (parentSlug) {
      // Use RPC for specific parent category hierarchy
      const { data: hierarchyData, error } = await supabase.rpc('get_category_hierarchy', {
        p_slug: parentSlug,
        p_depth: depth
      })

      if (error) {
        console.error("RPC Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      const rows = (hierarchyData || []) as CategoryHierarchyRow[]
      const tree = buildCategoryTree(rows)

      // Find the parent from the tree (depth=0)
      const parent = tree.length > 0 ? {
        id: tree[0].id,
        name: tree[0].name,
        name_bg: tree[0].name_bg,
        slug: tree[0].slug
      } : null

      // Return children of the parent
      return NextResponse.json({
        categories: tree.length > 0 ? tree[0].children || [] : [],
        parent
      })
    }

    if (includeChildren) {
      // Fetch L0 categories (root) first
      const { data: rootCats, error: rootError } = await supabase
        .from("categories")
        .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
        .is("parent_id", null)
        .lt("display_order", 9000)
        .order("display_order", { ascending: true })

      if (rootError) {
        console.error("Root Categories Query Error:", rootError)
        return NextResponse.json({ error: rootError.message }, { status: 500 })
      }

      console.log(`[API] Found ${rootCats?.length || 0} root categories`)

      // Fetch L1 categories (children of root)
      const rootIds = (rootCats || []).map(c => c.id)
      const { data: l1Cats, error: l1Error } = await supabase
        .from("categories")
        .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
        .in("parent_id", rootIds)
        .lt("display_order", 9000)
        .order("display_order", { ascending: true })

      if (l1Error) {
        console.error("L1 Categories Query Error:", l1Error)
        return NextResponse.json({ error: l1Error.message }, { status: 500 })
      }

      console.log(`[API] Found ${l1Cats?.length || 0} L1 categories`)

      // Fetch L2 categories (grandchildren) if depth >= 2
      // Batch in chunks of 50 to avoid header overflow with large IN clauses
      let l2Cats: typeof l1Cats = []
      if (depth >= 2 && l1Cats && l1Cats.length > 0) {
        const l1Ids = l1Cats.map(c => c.id)
        const BATCH_SIZE = 50
        const CONCURRENCY = 4
        
        // Build batches
        const batches: Array<{ index: number; ids: string[] }> = []
        for (let i = 0; i < l1Ids.length; i += BATCH_SIZE) {
          batches.push({ index: i / BATCH_SIZE, ids: l1Ids.slice(i, i + BATCH_SIZE) })
        }

        // Fetch batches with limited concurrency to keep TTFB low.
        // Sequential batching can exceed typical client/server timeouts.
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
        console.log(`[API] Found ${l2Cats.length} L2 categories (from ${batches.length} batches, concurrency=${CONCURRENCY})`)
      }

      // Combine all categories
      const allCategories = [...(rootCats || []), ...(l1Cats || []), ...l2Cats]

      const cats = allCategories || []
      
      // Build tree structure
      const categoryMap = new Map<string, CategoryWithChildren>()
      const rootCategories: CategoryWithChildren[] = []

      // First pass: create all category objects
      for (const cat of cats) {
        categoryMap.set(cat.id, {
          id: cat.id,
          name: cat.name,
          name_bg: cat.name_bg,
          slug: cat.slug,
          icon: cat.icon,
          image_url: normalizeImageUrl(cat.image_url),
          display_order: cat.display_order,
          children: []
        })
      }

      // Second pass: build tree
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

      // Sort children
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

      // Return debug info
      return NextResponse.json({ 
        categories: rootCategories, 
        _debug: {
          totalCount: cats.length,
          rootCount: rootCategories.length,
          rootCategories: rootCategories.map(c => ({ name: c.name, slug: c.slug, display_order: c.display_order }))
        }
      })
    }

    // Simple query for just root categories (no children) - exclude deprecated
    const { data: categories, error } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, icon, image_url, parent_id, display_order")
      .is("parent_id", null)
      .lt("display_order", 9000)
      .order("display_order", { ascending: true })
      .order("name", { ascending: true })

    if (error) {
      console.error("Categories Query Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      categories: (categories || []).map(cat => ({
        ...cat,
        image_url: normalizeImageUrl(cat.image_url)
      }))
    })
  } catch (error) {
    console.error("Categories API Error:", error)
    const message = error instanceof Error ? error.message : "Internal Server Error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}