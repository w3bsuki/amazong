import { requireDashboardAccess, getBusinessProducts } from "@/lib/auth/business"
import { createClient } from "@/lib/supabase/server"
import { connection } from "next/server"
import { ProductsTable } from "@/components/business/products-table"

// Category types
interface CategoryNode {
  id: string
  name: string
  slug: string
  parent_id: string | null
  display_order: number | null
  children: CategoryNode[]
}

interface RawCategory {
  id: string
  name: string
  slug: string
  parent_id: string | null
  display_order: number | null
}

// Build category tree from flat array
function buildCategoryTree(categories: RawCategory[]): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>()
  
  // First pass: create all nodes
  for (const cat of categories) {
    categoryMap.set(cat.id, {
      ...cat,
      children: []
    })
  }
  
  // Second pass: build tree structure
  const rootCategories: CategoryNode[] = []
  
  for (const cat of categories) {
    const node = categoryMap.get(cat.id)!
    
    if (cat.parent_id && categoryMap.has(cat.parent_id)) {
      categoryMap.get(cat.parent_id)!.children.push(node)
    } else if (!cat.parent_id) {
      rootCategories.push(node)
    }
  }
  
  // Sort children recursively by display_order
  function sortChildren(nodes: CategoryNode[]): CategoryNode[] {
    nodes.sort((a, b) => {
      const orderA = a.display_order ?? 999
      const orderB = b.display_order ?? 999
      if (orderA !== orderB) return orderA - orderB
      return a.name.localeCompare(b.name)
    })
    for (const node of nodes) {
      if (node.children.length > 0) {
        sortChildren(node.children)
      }
    }
    return nodes
  }
  
  return sortChildren(rootCategories)
}

// Fetch categories with hierarchy (L0 → L1 → L2 → L3)
async function getCategories(): Promise<CategoryNode[]> {
  const supabase = await createClient()
  
  // Fetch root categories (L0) - exclude hidden/system categories
  const { data: rootCats, error: rootError } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, display_order")
    .is("parent_id", null)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })
  
  if (rootError || !rootCats?.length) {
    console.error("[ProductsPage] Error fetching root categories:", rootError)
    return []
  }
  
  // Fetch L1 categories
  const rootIds = rootCats.map(c => c.id)
  const { data: l1Cats } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, display_order")
    .in("parent_id", rootIds)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })
  
  // Fetch L2 categories
  let l2Cats: RawCategory[] = []
  if (l1Cats && l1Cats.length > 0) {
    const l1Ids = l1Cats.map(c => c.id)
    const { data: l2Data } = await supabase
      .from("categories")
      .select("id, name, slug, parent_id, display_order")
      .in("parent_id", l1Ids)
      .lt("display_order", 9000)
      .order("display_order", { ascending: true })
    
    if (l2Data) l2Cats = l2Data
  }
  
  // Fetch L3 categories
  let l3Cats: RawCategory[] = []
  if (l2Cats.length > 0) {
    const l2Ids = l2Cats.map(c => c.id)
    const { data: l3Data } = await supabase
      .from("categories")
      .select("id, name, slug, parent_id, display_order")
      .in("parent_id", l2Ids)
      .lt("display_order", 9000)
      .order("display_order", { ascending: true })
    
    if (l3Data) l3Cats = l3Data
  }
  
  // Combine all and build tree
  const allCategories = [...rootCats, ...(l1Cats || []), ...l2Cats, ...l3Cats]
  console.log(`[ProductsPage] Fetched ${allCategories.length} categories (${rootCats.length} L0, ${l1Cats?.length || 0} L1, ${l2Cats.length} L2, ${l3Cats.length} L3)`)
  
  return buildCategoryTree(allCategories)
}

export default async function BusinessProductsPage() {
  await connection()
  
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const { products, total } = await getBusinessProducts(businessSeller.id)
  const categories = await getCategories()
  
  return (
    <ProductsTable 
      initialProducts={products}
      categories={categories}
      total={total}
      sellerId={businessSeller.id}
    />
  )
}
