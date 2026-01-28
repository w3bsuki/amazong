import 'server-only'

import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'
import { normalizeOptionalImageUrl } from '@/lib/normalize-image-url'
import { logger } from '@/lib/logger'
import { normalizeAttributeKey } from '@/lib/attributes/normalize-attribute-key'

// =============================================================================
// Type Definitions
// =============================================================================

export interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  image_url: string | null
  icon: string | null
  display_order: number | null
}

export interface CategoryWithParent extends Category {
  parent: Category | null
}

export type AttributeType = 'select' | 'multiselect' | 'boolean' | 'number' | 'text' | 'date'

export interface CategoryAttribute {
  id: string
  category_id: string | null
  name: string
  name_bg: string | null
  attribute_type: AttributeType
  /** Canonical, normalized key (preferred over name for JSONB + URL params). */
  attribute_key: string | null
  options: string[] | null
  options_bg: string[] | null
  placeholder?: string | null
  placeholder_bg?: string | null
  min_value?: number | null
  max_value?: number | null
  is_filterable: boolean | null
  is_required: boolean | null
  is_hero_spec: boolean | null
  hero_priority: number | null
  is_badge_spec: boolean | null
  badge_priority: number | null
  unit_suffix: string | null
  sort_order: number | null
  validation_rules?: unknown | null
}

// Valid attribute types
const VALID_ATTRIBUTE_TYPES: AttributeType[] = ['select', 'multiselect', 'boolean', 'number', 'text', 'date']

const CATEGORY_ATTRIBUTES_SELECT =
  'id,category_id,name,name_bg,attribute_type,attribute_key,options,options_bg,placeholder,placeholder_bg,is_filterable,is_required,is_hero_spec,hero_priority,is_badge_spec,badge_priority,unit_suffix,sort_order,validation_rules,created_at' as const

// Helper to transform DB row to CategoryAttribute
function toCategoryAttribute(row: {
  id: string
  category_id: string | null
  name: string
  name_bg: string | null
  attribute_type: string
  attribute_key?: string | null
  options: unknown | null
  options_bg: unknown | null
  placeholder?: string | null
  placeholder_bg?: string | null
  is_filterable: boolean | null
  is_required: boolean | null
  is_hero_spec?: boolean | null
  hero_priority?: number | null
  is_badge_spec?: boolean | null
  badge_priority?: number | null
  unit_suffix?: string | null
  sort_order: number | null
  validation_rules?: unknown | null
  created_at?: string | null
}): CategoryAttribute {
  // Validate and cast attribute_type - default to 'text' if invalid
  const attrType = VALID_ATTRIBUTE_TYPES.includes(row.attribute_type as AttributeType)
    ? row.attribute_type as AttributeType
    : 'text'
    
  const attributeKey = row.attribute_key ?? (normalizeAttributeKey(row.name) || null)

  return {
    id: row.id,
    category_id: row.category_id,
    name: row.name,
    name_bg: row.name_bg,
    attribute_type: attrType,
    attribute_key: attributeKey,
    options: Array.isArray(row.options) ? row.options as string[] : null,
    options_bg: Array.isArray(row.options_bg) ? row.options_bg as string[] : null,
    placeholder: row.placeholder ?? null,
    placeholder_bg: row.placeholder_bg ?? null,
    is_filterable: row.is_filterable,
    is_required: row.is_required,
    is_hero_spec: row.is_hero_spec ?? null,
    hero_priority: row.hero_priority ?? null,
    is_badge_spec: row.is_badge_spec ?? null,
    badge_priority: row.badge_priority ?? null,
    unit_suffix: row.unit_suffix ?? null,
    sort_order: row.sort_order,
    validation_rules: row.validation_rules ?? null,
  }
}

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

export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[]
}

export interface CategoryTreeNodeLite {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  display_order: number | null
  children: CategoryTreeNodeLite[]
  /** True if this category has children in DB (may not be loaded in tree) */
  has_children: boolean
}

export interface CategoryContext {
  current: Category
  parent: Category | null
  siblings: Category[]
  children: Category[]
  attributes: CategoryAttribute[]
}

function getCategoryAttributeKey(attr: Pick<CategoryAttribute, 'attribute_key' | 'name'>): string {
  return (attr.attribute_key ?? normalizeAttributeKey(attr.name)).trim().toLowerCase()
}

function getCategoryAttributeMapKey(
  attr: Pick<CategoryAttribute, 'attribute_key' | 'name' | 'attribute_type'>
): string {
  return `${getCategoryAttributeKey(attr)}::${attr.attribute_type}`.trim().toLowerCase()
}

function hasAnyOptions(attr: CategoryAttribute): boolean {
  const hasEn = Array.isArray(attr.options) && attr.options.length > 0
  const hasBg = Array.isArray(attr.options_bg) && attr.options_bg.length > 0
  return hasEn || hasBg
}

function withFallbackOptions(
  current: CategoryAttribute,
  fallback: CategoryAttribute
): CategoryAttribute {
  const currentHasOptions = hasAnyOptions(current)
  const fallbackHasOptions = hasAnyOptions(fallback)
  if (currentHasOptions || !fallbackHasOptions) return current

  return {
    ...current,
    // If the category-level attribute is effectively unconfigured, borrow the
    // parent options so the UI can render a real list.
    options: Array.isArray(current.options) && current.options.length > 0
      ? current.options
      : fallback.options,
    options_bg: Array.isArray(current.options_bg) && current.options_bg.length > 0
      ? current.options_bg
      : fallback.options_bg,
    // If the category-level attribute type is too generic, borrow parent's type.
    attribute_type:
      current.attribute_type === 'text' && fallback.attribute_type !== 'text'
        ? fallback.attribute_type
        : current.attribute_type,
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Transform flat RPC results into nested tree structure
 */
function buildCategoryTree(rows: CategoryHierarchyRow[]): CategoryWithChildren[] {
  const categoryMap = new Map<string, CategoryWithChildren>()
  const rootCategories: CategoryWithChildren[] = []
  
  // Filter out deprecated/hidden categories (display_order >= 9000)
  const activeRows = rows.filter(row => (row.display_order ?? 0) < 9000)
  
  // First pass: create all category objects
  for (const row of activeRows) {
    categoryMap.set(row.id, {
      id: row.id,
      name: row.name,
      name_bg: row.name_bg,
      slug: row.slug,
      parent_id: row.parent_id,
      icon: row.icon,
      image_url: row.image_url,
      display_order: row.display_order,
      children: []
    })
  }
  
  // Second pass: build tree structure
  for (const row of activeRows) {
    const category = categoryMap.get(row.id)
    if (!category) continue
    
    if (row.parent_id && categoryMap.has(row.parent_id)) {
      const parent = categoryMap.get(row.parent_id)
      if (!parent) continue
      parent.children = parent.children || []
      parent.children.push(category)
    } else if (row.depth === 0) {
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

type RawCategoryTreeNodeLite = Omit<CategoryTreeNodeLite, 'children' | 'has_children'> & { has_children?: boolean }

function buildCategoryTreeLite(
  categories: RawCategoryTreeNodeLite[],
  childCountMap?: Map<string, number>
): CategoryTreeNodeLite[] {
  const categoryMap = new Map<string, CategoryTreeNodeLite>()
  const roots: CategoryTreeNodeLite[] = []

  const activeCategories = categories.filter((row) => (row.display_order ?? 0) < 9000)

  for (const cat of activeCategories) {
    const dbChildCount = childCountMap?.get(cat.id) ?? 0
    categoryMap.set(cat.id, {
      ...cat,
      children: [],
      // has_children is true if DB says there are children OR if already marked
      has_children: cat.has_children ?? dbChildCount > 0,
    })
  }

  for (const cat of activeCategories) {
    const node = categoryMap.get(cat.id)
    if (!node) continue

    if (cat.parent_id && categoryMap.has(cat.parent_id)) {
      categoryMap.get(cat.parent_id)?.children.push(node)
    } else if (!cat.parent_id) {
      roots.push(node)
    }
  }

  function sortChildren(nodes: CategoryTreeNodeLite[]) {
    nodes.sort((a, b) => {
      const orderA = a.display_order ?? 999
      const orderB = b.display_order ?? 999
      if (orderA !== orderB) return orderA - orderB
      return a.name.localeCompare(b.name)
    })

    for (const node of nodes) {
      // Ensure has_children is true if there are loaded children
      if (node.children.length > 0) {
        node.has_children = true
        sortChildren(node.children)
      }
    }
  }

  sortChildren(roots)
  return roots
}

async function fetchChildCategoriesLiteBatched(
  supabase: ReturnType<typeof createStaticClient>,
  parentIds: string[],
  {
    batchSize,
    concurrency,
    label,
  }: { batchSize: number; concurrency: number; label: string },
): Promise<RawCategoryTreeNodeLite[]> {
  if (parentIds.length === 0) return []

  const batches: Array<{ index: number; ids: string[] }> = []
  for (let i = 0; i < parentIds.length; i += batchSize) {
    batches.push({ index: i / batchSize, ids: parentIds.slice(i, i + batchSize) })
  }

  const out: RawCategoryTreeNodeLite[] = []
  for (let start = 0; start < batches.length; start += concurrency) {
    const chunk = batches.slice(start, start + concurrency)
    const chunkResults = await Promise.all(
      chunk.map(async ({ index, ids }) => {
        const { data, error } = await supabase
          .from("categories")
          .select("id, name, name_bg, slug, parent_id, display_order")
          .in("parent_id", ids)
          .lt("display_order", 9000)
          .order("display_order", { ascending: true })

        if (error) {
          logger.error(`[fetchChildCategoriesLiteBatched] ${label} query error (batch ${index})`, error)
          return []
        }
        return data || []
      }),
    )

    for (const part of chunkResults) out.push(...part)
  }

  return out
}

// =============================================================================
// Data Fetching Functions with Next.js 16 Caching
// =============================================================================
// These functions use 'use cache' because they DON'T use next-intl.
// The caching is applied to data fetching, NOT to pages/layouts that use getTranslations().

/**
 * Fetch category hierarchy starting from root categories.
 * 
 * PERFORMANCE OPTIMIZATION (Jan 2026):
 * - Fetches L0 → L1 → L2 only (~3,400 categories, ~60KB gzipped)
 * - L3 categories (~9,700) are lazy-loaded via /api/categories/[parentId]/children
 * - This reduces initial payload by ~80% (from ~400KB to ~60KB)
 * 
 * @param slug - Reserved for future use (currently ignored)
 * @param depth - Max depth: 0=L0 only, 1=L0+L1, 2=L0+L1+L2 (default & max)
 * @returns Nested category tree structure (L0 → L1 → L2, no L3)
 */
export async function getCategoryHierarchy(
  _slug?: string | null, 
  depth: number = 2
): Promise<CategoryWithChildren[]> {
  'use cache'
  cacheTag('categories:tree')
  cacheLife('categories')
  try {
    const supabase = createStaticClient()
    
    // Clamp depth to max 2 (L3 is always lazy-loaded)
    const effectiveDepth = Math.min(depth, 2)
    
    // Fetch L0 categories (root)
    const { data: rootCats, error: rootError } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
      .is("parent_id", null)
      .lt("display_order", 9000)
      .order("display_order", { ascending: true })

    if (rootError) {
      logger.error('[getCategoryHierarchy] Root query error', rootError)
      return []
    }

    if (!rootCats || rootCats.length === 0) return []

    if (effectiveDepth === 0) {
      return (rootCats || []).map(cat => ({
        ...cat,
        image_url: normalizeOptionalImageUrl(cat.image_url),
        children: []
      }))
    }

    // Fetch L1 categories
    const rootIds = (rootCats || []).map(c => c.id)
    const { data: l1Cats, error: l1Error } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
      .in("parent_id", rootIds)
      .lt("display_order", 9000)
      .order("display_order", { ascending: true })

    if (l1Error) {
      logger.error('[getCategoryHierarchy] L1 query error', l1Error)
    }

    // Fetch L2 categories if depth >= 2 (batched to avoid large IN clauses)
    let l2Cats: typeof l1Cats = []
    if (effectiveDepth >= 2 && l1Cats && l1Cats.length > 0) {
      const l1Ids = l1Cats.map(c => c.id)
      const BATCH_SIZE = 50
      
      // Use Promise.all for parallel fetching
      const batches = []
      for (let i = 0; i < l1Ids.length; i += BATCH_SIZE) {
        batches.push(l1Ids.slice(i, i + BATCH_SIZE))
      }
      
      const results = await Promise.all(
        batches.map(batchIds => 
          supabase
            .from("categories")
            .select("id, name, name_bg, slug, parent_id, icon, image_url, display_order")
            .in("parent_id", batchIds)
            .lt("display_order", 9000)
            .order("display_order", { ascending: true })
        )
      )
      
      for (const result of results) {
        if (result.data) {
          l2Cats.push(...result.data)
        }
      }
    }

    // NOTE: L3 categories are NOT fetched here.
    // They are lazy-loaded via /api/categories/[parentId]/children when L2 is clicked.
    // This reduces initial payload from ~400KB to ~60KB (13K → 3.4K categories).

    // Combine and build tree (L0 + L1 + L2 only)
    const allCats = [...(rootCats || []), ...(l1Cats || []), ...l2Cats]
    
    // Create sets for efficient depth lookups
    const rootIdSet = new Set(rootIds)
    const l1Ids = new Set((l1Cats || []).map(c => c.id))
    
    const rows: CategoryHierarchyRow[] = allCats.map(cat => {
      // Calculate depth based on parent membership
      let catDepth = 0
      if (cat.parent_id === null) {
        catDepth = 0  // Root/L0
      } else if (rootIdSet.has(cat.parent_id)) {
        catDepth = 1  // L1 (parent is L0)
      } else if (l1Ids.has(cat.parent_id)) {
        catDepth = 2  // L2 (parent is L1)
      }
      
      return {
        id: cat.id,
        name: cat.name,
        name_bg: cat.name_bg,
        slug: cat.slug,
        parent_id: cat.parent_id,
        icon: cat.icon,
        image_url: normalizeOptionalImageUrl(cat.image_url),
        display_order: cat.display_order,
        depth: catDepth,
        path: []
      }
    })
    
    return buildCategoryTree(rows)
  } catch (error) {
    logger.error('[getCategoryHierarchy] Unexpected error', error)
    return []
  }
}

/**
 * Category tree for selector UIs that need stable client-side navigation.
 *
 * Used by:
 * - Sell flow (category picker needs L0 → L3 without extra client fetching)
 * - Business dashboard product forms (same selector requirement)
 */
export async function getCategoryTreeDepth3(): Promise<CategoryTreeNodeLite[]> {
  'use cache'
  cacheTag('categories:tree', 'categories:sell', 'categories:sell:depth:3')
  cacheLife('categories')

  const supabase = createStaticClient()

  const { data: rootCats, error: rootError } = await supabase
    .from("categories")
    .select("id, name, name_bg, slug, parent_id, display_order")
    .is("parent_id", null)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })

  if (rootError) {
    logger.error('[getCategoryTreeDepth3] Root query error', rootError)
    return []
  }

  if (!rootCats || rootCats.length === 0) return []

  const rootIds = rootCats.map((c) => c.id)
  const { data: l1Cats, error: l1Error } = await supabase
    .from("categories")
    .select("id, name, name_bg, slug, parent_id, display_order")
    .in("parent_id", rootIds)
    .lt("display_order", 9000)
    .order("display_order", { ascending: true })

  if (l1Error) {
    logger.error('[getCategoryTreeDepth3] L1 query error', l1Error)
  }

  const l1Ids = (l1Cats || []).map((c) => c.id)
  const l2Cats = await fetchChildCategoriesLiteBatched(supabase, l1Ids, {
    batchSize: 100,
    concurrency: 4,
    label: "L2",
  })

  const l2Ids = l2Cats.map((c) => c.id)
  const l3Cats = await fetchChildCategoriesLiteBatched(supabase, l2Ids, {
    batchSize: 100,
    concurrency: 4,
    label: "L3",
  })

  // Fetch child counts for L3 categories to know which have L4 children
  const l3Ids = l3Cats.map((c) => c.id)
  const childCountMap = new Map<string, number>()
  
  if (l3Ids.length > 0) {
    // Query to get count of children for each L3 category
    const BATCH_SIZE = 200
    for (let i = 0; i < l3Ids.length; i += BATCH_SIZE) {
      const batchIds = l3Ids.slice(i, i + BATCH_SIZE)
      const { data: childCounts, error: countError } = await supabase
        .from("categories")
        .select("parent_id")
        .in("parent_id", batchIds)
        .lt("display_order", 9000)
      
      if (!countError && childCounts) {
        // Count children per parent
        for (const row of childCounts) {
          if (row.parent_id) {
            childCountMap.set(row.parent_id, (childCountMap.get(row.parent_id) || 0) + 1)
          }
        }
      }
    }
  }

  const allCats = [...rootCats, ...(l1Cats || []), ...l2Cats, ...l3Cats]
  return buildCategoryTreeLite(allCats, childCountMap)
}

/**
 * Fetch a single category by slug with its parent.
 * Optimized for page metadata and breadcrumbs.
 * 
 * @param slug - Category slug
 * @returns Category with parent or null if not found
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryWithParent | null> {
  'use cache'
  cacheTag(`category:${slug}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select(`
      id, name, name_bg, slug, parent_id, image_url, icon, display_order,
      parent:parent_id (id, name, name_bg, slug, parent_id, image_url, icon, display_order)
    `)
    .eq('slug', slug)
    .single()
  
  if (error || !data) {
    logger.error('[getCategoryBySlug] Query error', error)
    return null
  }
  
  // Supabase returns parent as array for relations, take first element
  const parentData = Array.isArray(data.parent) ? data.parent[0] : data.parent
  
  return {
    ...data,
    parent: parentData as Category | null
  }
}

/**
 * Get full ancestry path for a category.
 * Returns an array of slugs from root (L0) to the target category.
 * 
 * @param slug - Category slug to get ancestry for
 * @returns Array of slugs [L0, L1, L2?, L3?] or null if not found
 */
export async function getCategoryAncestry(slug: string): Promise<string[] | null> {
  'use cache'
  cacheTag(`category:${slug}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  
  // Recursively fetch category and its ancestors
  const ancestry: string[] = []
  let currentSlug: string | null = slug
  
  while (currentSlug) {
    const result = await supabase
      .from('categories')
      .select(`
        slug,
        parent:parent_id (slug)
      `)
      .eq('slug', currentSlug)
      .single()
    
    if (result.error || !result.data) {
      break
    }
    
    const catData = result.data as { slug: string; parent: { slug: string } | { slug: string }[] | null }
    ancestry.unshift(catData.slug) // Add to beginning (building from leaf to root)
    
    // Get parent slug if exists
    const parentData = Array.isArray(catData.parent) ? catData.parent[0] : catData.parent
    currentSlug = parentData?.slug ?? null
  }
  
  return ancestry.length > 0 ? ancestry : null
}

/**
 * Breadcrumb category with minimal fields for sidebar display
 */
export interface BreadcrumbCategory {
  slug: string
  name: string
  name_bg: string | null
}

/**
 * Get full ancestry chain with category objects (for breadcrumb display).
 * Returns array from root (L0) to target category with names for display.
 * 
 * @param slug - Category slug to get ancestry for
 * @returns Array of BreadcrumbCategory objects [L0, L1, L2?, L3?] or empty array
 */
export async function getCategoryAncestryFull(slug: string): Promise<BreadcrumbCategory[]> {
  'use cache'
  cacheTag(`category:${slug}:ancestry`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  
  // Recursively fetch category and its ancestors with names
  const ancestry: BreadcrumbCategory[] = []
  let currentSlug: string | null = slug
  
  while (currentSlug) {
    const result = await supabase
      .from('categories')
      .select(`
        slug,
        name,
        name_bg,
        parent:parent_id (slug)
      `)
      .eq('slug', currentSlug)
      .single()
    
    if (result.error || !result.data) {
      break
    }
    
    const catData = result.data as {
      slug: string
      name: string
      name_bg: string | null
      parent: { slug: string } | { slug: string }[] | null
    }
    
    // Add to beginning (building from leaf to root)
    ancestry.unshift({
      slug: catData.slug,
      name: catData.name,
      name_bg: catData.name_bg,
    })
    
    // Get parent slug if exists
    const parentData = Array.isArray(catData.parent) ? catData.parent[0] : catData.parent
    currentSlug = parentData?.slug ?? null
  }
  
  return ancestry
}

/**
 * Fetch filterable attributes for a category.
 * Used to build dynamic filter UIs on category pages.
 * 
 * @param categoryId - Category UUID
 * @returns Array of filterable attributes
 */
async function getCategoryAttributes(categoryId: string): Promise<CategoryAttribute[]> {
  'use cache'
  cacheTag(`attrs:category:${categoryId}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  
  const { data, error } = await supabase
    .from('category_attributes')
    .select(CATEGORY_ATTRIBUTES_SELECT)
    .eq('category_id', categoryId)
    .eq('is_filterable', true)
    .order('sort_order', { ascending: true })
  
  if (error) {
    logger.error('[getCategoryAttributes] Query error', error)
    return []
  }
  
  return (data || []).map(toCategoryAttribute)
}

/**
 * Fetch sibling categories (same parent).
 * Used for sidebar navigation.
 * 
 * @param parentId - Parent category UUID (null for root categories)
 * @returns Array of sibling categories
 */
async function getSiblingCategories(parentId: string | null): Promise<Category[]> {
  'use cache'
  cacheTag(`category-siblings:${parentId || 'root'}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  
  let query = supabase
    .from('categories')
    .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
    .lt('display_order', 9999)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })
  
  if (parentId) {
    query = query.eq('parent_id', parentId)
  } else {
    query = query.is('parent_id', null)
  }
  
  const { data, error } = await query
  
  if (error) {
    logger.error('[getSiblingCategories] Query error', error)
    return []
  }
  
  return (data || []) as Category[]
}

/**
 * Fetch direct children of a category.
 * Used for subcategory tabs and navigation.
 * 
 * @param categoryId - Parent category UUID
 * @returns Array of child categories
 */
async function getChildCategories(categoryId: string): Promise<Category[]> {
  'use cache'
  cacheTag(`category-children:${categoryId}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
    .eq('parent_id', categoryId)
    .lt('display_order', 9999)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })
  
  if (error) {
    logger.error('[getChildCategories] Query error', error)
    return []
  }
  
  return (data || []) as Category[]
}

/**
 * Fetch complete category context for sidebar navigation.
 * Includes current category, parent, siblings, children, and filterable attributes.
 * 
 * @param slug - Category slug
 * @returns Full category context or null if not found
 */
export async function getCategoryContext(slug: string): Promise<CategoryContext | null> {
  'use cache'
  cacheTag(`category:${slug}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  
  // Get current category with parent
  const { data: current, error: currentError } = await supabase
    .from('categories')
    .select(`
      id, name, name_bg, slug, parent_id, image_url, icon, display_order,
      parent:parent_id (id, name, name_bg, slug, parent_id, image_url, icon, display_order)
    `)
    .eq('slug', slug)
    .single()
  
  if (currentError || !current) {
    logger.error('[getCategoryContext] Category not found', currentError)
    return null
  }
  
  // Fetch siblings, children (DEC-002), and attributes in parallel
  const [siblingsResult, childrenWithCounts, attributesResult] = await Promise.all([
    // Siblings (same parent, exclude hidden)
    current.parent_id
      ? supabase
          .from('categories')
          .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
          .eq('parent_id', current.parent_id)
          .lt('display_order', 9999)
          .order('display_order')
          .order('name')
      : supabase
          .from('categories')
          .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
          .is('parent_id', null)
          .lt('display_order', 9999)
          .order('display_order')
          .order('name'),
    
    // Children: DEC-002 compliant (curated ordering + visibility filtering)
    getSubcategoriesForBrowse(current.id, true),
    
    // Filterable attributes for current category
    supabase
      .from('category_attributes')
      .select(CATEGORY_ATTRIBUTES_SELECT)
      .eq('category_id', current.id)
      .eq('is_filterable', true)
      .order('sort_order')
  ])

  const currentAttributes = (attributesResult.data || []).map(toCategoryAttribute)

  // ---------------------------------------------------------------------------
  // Attribute Inheritance: Always merge ALL ancestor attrs with current.
  // This ensures universal filters (Condition, Brand, Size, Color) are inherited
  // even for deep leaf categories.
  //
  // Priority: current category attrs > parent attrs > ... > root attrs
  // ---------------------------------------------------------------------------

  // Collect ancestor category IDs (parent -> root).
  const ancestorIds: string[] = []
  let cursor: string | null = current.parent_id

  for (let i = 0; i < 6 && cursor; i++) {
    ancestorIds.push(cursor)

    const { data: parentRow, error: parentRowError } = await supabase
      .from('categories')
      .select('parent_id')
      .eq('id', cursor)
      .maybeSingle()

    if (parentRowError) {
      logger.error('[getCategoryContext] Ancestor lookup error', parentRowError)
      break
    }

    cursor = (parentRow as { parent_id?: string | null } | null)?.parent_id ?? null
  }

  let inheritedAttributes: CategoryAttribute[] = []
  if (ancestorIds.length > 0) {
    const { data: inheritedRaw, error: inheritedError } = await supabase
      .from('category_attributes')
      .select(CATEGORY_ATTRIBUTES_SELECT)
      .in('category_id', ancestorIds)
      .eq('is_filterable', true)
      .order('sort_order')

    if (inheritedError) {
      logger.error('[getCategoryContext] Ancestor attributes query error', inheritedError)
    } else {
      inheritedAttributes = (inheritedRaw || []).map(toCategoryAttribute)
    }
  }

  const depthByCategoryId = new Map<string, number>()
  for (let i = 0; i < ancestorIds.length; i++) {
    const ancestorId = ancestorIds[i]
    if (ancestorId) depthByCategoryId.set(ancestorId, i)
  }

  // Sort inherited attrs root -> parent so nearer ancestors override farther ones.
  const inheritedSorted = [...inheritedAttributes].sort((a, b) => {
    const da = depthByCategoryId.get(a.category_id ?? '') ?? 0
    const db = depthByCategoryId.get(b.category_id ?? '') ?? 0
    if (da !== db) return db - da
    return (a.sort_order ?? 999) - (b.sort_order ?? 999)
  })

  // Merge: Build map tracking which attrs are from current category vs inherited
  // Key insight: category-specific attrs should come FIRST, inherited universal attrs second
  const attrMap = new Map<string, CategoryAttribute & { isOwn: boolean }>()
  
  // Add ancestor attrs first (marked as inherited)
  for (const attr of inheritedSorted) {
    attrMap.set(getCategoryAttributeMapKey(attr), { ...attr, isOwn: false })
  }
  // Current category attrs override ancestors (marked as own)
  for (const attr of currentAttributes) {
    const key = getCategoryAttributeMapKey(attr)
    const existing = attrMap.get(key)
    attrMap.set(
      key,
      {
        ...(existing ? withFallbackOptions(attr, existing) : attr),
        isOwn: true
      }
    )
  }

  // Sort: category's OWN attrs first (by sort_order), then inherited (by sort_order)
  // This ensures category-specific filters (Processor, RAM) appear before universal (Condition, Brand)
  const attributes = Array.from(attrMap.values())
    .sort((a, b) => {
      // Own attrs come first
      if (a.isOwn && !b.isOwn) return -1
      if (!a.isOwn && b.isOwn) return 1
      // Within same group, sort by sort_order
      return (a.sort_order ?? 999) - (b.sort_order ?? 999)
    })
    .map(({ isOwn: _isOwn, ...attr }) => attr as CategoryAttribute) // Strip isOwn flag from output
  
  return {
    current: {
      id: current.id,
      name: current.name,
      name_bg: current.name_bg,
      slug: current.slug,
      parent_id: current.parent_id,
      image_url: current.image_url,
      icon: current.icon,
      display_order: current.display_order
    },
    // Supabase returns parent as array for relations, take first element
    parent: (Array.isArray(current.parent) ? current.parent[0] : current.parent) as Category | null,
    siblings: (siblingsResult.data || []) as Category[],
    // DEC-002: Children filtered/sorted via getSubcategoriesForBrowse (curated + populated)
    children: childrenWithCounts as Category[],
    attributes
  }
}

// =============================================================================
// Category Stats (DEC-002 Support)
// =============================================================================

export interface CategoryWithCount extends Category {
  subtree_product_count: number
}

/**
 * Fetch subcategories with their product counts from category_stats.
 * Used for buyer browse UX to filter out empty categories.
 * 
 * @param parentId - Parent category UUID (null for root categories)
 * @param populatedOnly - If true, only return categories with products (default: false)
 * @returns Array of subcategories with subtree_product_count
 */
export async function getSubcategoriesWithCounts(
  parentId: string | null,
  populatedOnly: boolean = false
): Promise<CategoryWithCount[]> {
  'use cache'
  cacheTag(`subcategories:${parentId || 'root'}:counts`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  
  // 2-query merge approach: avoids PostgREST relationship issues with materialized views
  // Query 1: Get categories by parent
  let catQuery = supabase
    .from('categories')
    .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
    .lt('display_order', 9000)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })
  
  if (parentId) {
    catQuery = catQuery.eq('parent_id', parentId)
  } else {
    catQuery = catQuery.is('parent_id', null)
  }
  
  const { data: categories, error: catError } = await catQuery
  
  if (catError) {
    logger.error('[getSubcategoriesWithCounts] Categories query error', catError)
    return []
  }
  
  if (!categories || categories.length === 0) {
    return []
  }
  
  // Query 2: Get counts for these category IDs from category_stats (materialized view)
  const categoryIds = categories.map(c => c.id)
  
  const { data: statsRaw, error: statsError } = await supabase
    .from('category_stats')
    .select('category_id, subtree_product_count')
    .in('category_id', categoryIds)
  
  if (statsError) {
    logger.error('[getSubcategoriesWithCounts] Stats query error', statsError)
    // Fallback: return categories with 0 counts rather than failing completely
  }
  
  const stats = statsRaw ?? []
  
  // Build lookup map for counts
  const countMap = new Map<string, number>()
  for (const stat of stats) {
    if (!stat.category_id) continue
    countMap.set(stat.category_id, stat.subtree_product_count ?? 0)
  }
  
  // Merge categories with counts
  const result: CategoryWithCount[] = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    name_bg: cat.name_bg,
    slug: cat.slug,
    parent_id: cat.parent_id,
    image_url: normalizeOptionalImageUrl(cat.image_url),
    icon: cat.icon,
    display_order: cat.display_order,
    subtree_product_count: countMap.get(cat.id) ?? 0
  }))
  
  // Filter for populated only if requested
  if (populatedOnly) {
    return result.filter(cat => cat.subtree_product_count > 0)
  }
  
  return result
}

/**
 * Get subcategories ordered by curated first, then by product count.
 * Implements DEC-002 ordering: display_order > 0 first, then by subtree_product_count DESC.
 * 
 * DEC-002 visibility rule: show if (count > 0) OR (display_order > 0) — curated empties are visible.
 * 
 * @param parentId - Parent category UUID (null for root categories)
 * @param filterForBrowse - If true (default), only return visible categories per DEC-002 rule
 * @returns Array of subcategories sorted by curated then popularity
 */
export async function getSubcategoriesForBrowse(
  parentId: string | null,
  filterForBrowse: boolean = true
): Promise<CategoryWithCount[]> {
  // Always fetch all counts (we filter in TS for flexibility)
  const subcats = await getSubcategoriesWithCounts(parentId, false)
  
  // DEC-002: Filter to show categories that are populated OR curated
  const visible = filterForBrowse
    ? subcats.filter(cat => {
        const isCurated = (cat.display_order ?? 0) > 0 && (cat.display_order ?? 9999) < 9000
        const isPopulated = cat.subtree_product_count > 0
        return isPopulated || isCurated
      })
    : subcats
  
  // Sort: curated (display_order > 0 && display_order < 9000) first, then by product count DESC
  return visible.sort((a, b) => {
    const aCurated = (a.display_order ?? 0) > 0 && (a.display_order ?? 9999) < 9000
    const bCurated = (b.display_order ?? 0) > 0 && (b.display_order ?? 9999) < 9000
    
    // Curated categories first
    if (aCurated && !bCurated) return -1
    if (!aCurated && bCurated) return 1
    
    // Within curated: sort by display_order
    if (aCurated && bCurated) {
      return (a.display_order ?? 999) - (b.display_order ?? 999)
    }
    
    // Within non-curated: sort by product count DESC
    return b.subtree_product_count - a.subtree_product_count
  })
}
