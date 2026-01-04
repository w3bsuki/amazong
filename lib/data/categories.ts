import 'server-only'

import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'
import { normalizeOptionalImageUrl } from '@/lib/normalize-image-url'

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

export type AttributeType = 'select' | 'multiselect' | 'boolean' | 'number' | 'text'

export interface CategoryAttribute {
  id: string
  category_id: string | null
  name: string
  name_bg: string | null
  attribute_type: AttributeType
  options: string[] | null
  options_bg: string[] | null
  placeholder?: string | null
  placeholder_bg?: string | null
  min_value?: number | null
  max_value?: number | null
  is_filterable: boolean | null
  is_required: boolean | null
  sort_order: number | null
  validation_rules?: unknown | null
}

// Valid attribute types
const VALID_ATTRIBUTE_TYPES: AttributeType[] = ['select', 'multiselect', 'boolean', 'number', 'text']

const CATEGORY_ATTRIBUTES_SELECT =
  'id,category_id,name,name_bg,attribute_type,options,options_bg,placeholder,placeholder_bg,is_filterable,is_required,sort_order,validation_rules,created_at' as const

// Helper to transform DB row to CategoryAttribute
function toCategoryAttribute(row: {
  id: string
  category_id: string | null
  name: string
  name_bg: string | null
  attribute_type: string
  options: unknown | null
  options_bg: unknown | null
  placeholder?: string | null
  placeholder_bg?: string | null
  is_filterable: boolean | null
  is_required: boolean | null
  sort_order: number | null
  validation_rules?: unknown | null
  created_at?: string | null
}): CategoryAttribute {
  // Validate and cast attribute_type - default to 'text' if invalid
  const attrType = VALID_ATTRIBUTE_TYPES.includes(row.attribute_type as AttributeType)
    ? row.attribute_type as AttributeType
    : 'text'
    
  return {
    id: row.id,
    category_id: row.category_id,
    name: row.name,
    name_bg: row.name_bg,
    attribute_type: attrType,
    options: Array.isArray(row.options) ? row.options as string[] : null,
    options_bg: Array.isArray(row.options_bg) ? row.options_bg as string[] : null,
    placeholder: row.placeholder ?? null,
    placeholder_bg: row.placeholder_bg ?? null,
    is_filterable: row.is_filterable,
    is_required: row.is_required,
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

export interface CategoryContext {
  current: Category
  parent: Category | null
  siblings: Category[]
  children: Category[]
  attributes: CategoryAttribute[]
}

function normalizeAttributeName(name: string): string {
  return name.trim().toLowerCase()
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
    const category = categoryMap.get(row.id)!
    
    if (row.parent_id && categoryMap.has(row.parent_id)) {
      const parent = categoryMap.get(row.parent_id)!
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
  cacheTag('categories', 'category-hierarchy-all')
  cacheLife('categories')
  
  const supabase = createStaticClient()
  if (!supabase) {
    console.error('getCategoryHierarchy: Database connection failed')
    return []
  }
  
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
    console.error("getCategoryHierarchy root error:", rootError)
    return []
  }

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
    console.error("getCategoryHierarchy L1 error:", l1Error)
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
  const l1Ids = new Set((l1Cats || []).map(c => c.id))
  
  const rows: CategoryHierarchyRow[] = allCats.map(cat => {
    // Calculate depth based on parent membership
    let catDepth = 0
    if (cat.parent_id === null) {
      catDepth = 0  // Root/L0
    } else if (rootIds.includes(cat.parent_id)) {
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
  cacheTag('categories', `category-${slug}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  if (!supabase) {
    console.error('getCategoryBySlug: Database connection failed')
    return null
  }
  
  const { data, error } = await supabase
    .from('categories')
    .select(`
      id, name, name_bg, slug, parent_id, image_url, icon, display_order,
      parent:parent_id (id, name, name_bg, slug, parent_id, image_url, icon, display_order)
    `)
    .eq('slug', slug)
    .single()
  
  if (error || !data) {
    console.error('getCategoryBySlug error:', error)
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
  cacheTag('categories', `ancestry-${slug}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  if (!supabase) {
    console.error('getCategoryAncestry: Database connection failed')
    return null
  }
  
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
 * Fetch filterable attributes for a category.
 * Used to build dynamic filter UIs on category pages.
 * 
 * @param categoryId - Category UUID
 * @returns Array of filterable attributes
 */
async function getCategoryAttributes(categoryId: string): Promise<CategoryAttribute[]> {
  'use cache'
  cacheTag('attributes', `attrs-${categoryId}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  if (!supabase) {
    console.error('getCategoryAttributes: Database connection failed')
    return []
  }
  
  const { data, error } = await supabase
    .from('category_attributes')
    .select(CATEGORY_ATTRIBUTES_SELECT)
    .eq('category_id', categoryId)
    .eq('is_filterable', true)
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('getCategoryAttributes error:', error)
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
  cacheTag('categories', `siblings-${parentId || 'root'}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  if (!supabase) {
    console.error('getSiblingCategories: Database connection failed')
    return []
  }
  
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
    console.error('getSiblingCategories error:', error)
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
  cacheTag('categories', `children-${categoryId}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  if (!supabase) {
    console.error('getChildCategories: Database connection failed')
    return []
  }
  
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
    .eq('parent_id', categoryId)
    .lt('display_order', 9999)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })
  
  if (error) {
    console.error('getChildCategories error:', error)
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
  cacheTag('categories', `context-${slug}`)
  cacheLife('categories')
  
  const supabase = createStaticClient()
  if (!supabase) {
    console.error('getCategoryContext: Database connection failed')
    return null
  }
  
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
    console.error('getCategoryContext: Category not found', currentError)
    return null
  }
  
  // Fetch siblings, children, and attributes in parallel
  const [siblingsResult, childrenResult, attributesResult] = await Promise.all([
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
    
    // Children (exclude hidden categories with display_order >= 9999)
    supabase
      .from('categories')
      .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
      .eq('parent_id', current.id)
      .lt('display_order', 9999)
      .order('display_order')
      .order('name'),
    
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
  // Attribute Inheritance: Always merge parent/ancestor attrs with current.
  // This ensures universal filters (Condition, Brand, Size, Color) are inherited.
  // Priority: current category attrs > parent attrs > grandparent (L0) attrs
  // ---------------------------------------------------------------------------
  
  // Fetch parent attributes
  let parentAttributes: CategoryAttribute[] = []
  if (current.parent_id) {
    const { data: parentAttributesRaw } = await supabase
      .from('category_attributes')
      .select(CATEGORY_ATTRIBUTES_SELECT)
      .eq('category_id', current.parent_id)
      .eq('is_filterable', true)
      .order('sort_order')
    parentAttributes = (parentAttributesRaw || []).map(toCategoryAttribute)
  }

  // If parent has no attrs (e.g., fashion-womens L1), fetch grandparent (L0) attrs
  const parentData = Array.isArray(current.parent) ? current.parent[0] : current.parent
  let ancestorAttributes = parentAttributes
  
  if (parentAttributes.length === 0 && parentData?.parent_id) {
    const { data: grandparentAttrsRaw } = await supabase
      .from('category_attributes')
      .select(CATEGORY_ATTRIBUTES_SELECT)
      .eq('category_id', parentData.parent_id)
      .eq('is_filterable', true)
      .order('sort_order')
    ancestorAttributes = (grandparentAttrsRaw || []).map(toCategoryAttribute)
  }

  // Merge: ancestor attrs first, current attrs win on duplicates
  const attrMap = new Map<string, CategoryAttribute>()
  
  for (const attr of ancestorAttributes) {
    attrMap.set(normalizeAttributeName(attr.name), attr)
  }
  for (const attr of currentAttributes) {
    // Current category attrs override ancestors, but borrow options if missing
    const existing = attrMap.get(normalizeAttributeName(attr.name))
    attrMap.set(
      normalizeAttributeName(attr.name),
      existing ? withFallbackOptions(attr, existing) : attr
    )
  }

  // Sort: universal filters first, then by sort_order
  const PRIORITY_ATTRS = ['condition', 'brand', 'size', 'color', 'material', 'make', 'model', 'year']
  
  const attributes = Array.from(attrMap.values()).sort((a, b) => {
    const aName = normalizeAttributeName(a.name)
    const bName = normalizeAttributeName(b.name)
    const aIdx = PRIORITY_ATTRS.indexOf(aName)
    const bIdx = PRIORITY_ATTRS.indexOf(bName)
    
    // Priority attrs come first in defined order
    if (aIdx !== -1 && bIdx === -1) return -1
    if (bIdx !== -1 && aIdx === -1) return 1
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
    
    // Then by sort_order
    return (a.sort_order ?? 999) - (b.sort_order ?? 999)
  })
  
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
    children: (childrenResult.data || []) as Category[],
    attributes
  }
}

/**
 * Fetch all root (L0) categories with their L1 children.
 * Optimized for mega menu and category index pages.
 * 
 * @returns Array of root categories with subcategories
 */
export async function getRootCategoriesWithChildren(): Promise<{ category: Category; subs: Category[] }[]> {
  'use cache'
  cacheTag('categories', 'root-with-children')
  cacheLife('categories')
  
  const supabase = createStaticClient()
  if (!supabase) {
    console.error('getRootCategoriesWithChildren: Database connection failed')
    return []
  }
  
  // Get root categories (exclude hidden ones with display_order >= 9999)
  const { data: rootCategories, error: rootError } = await supabase
    .from('categories')
    .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
    .is('parent_id', null)
    .lt('display_order', 9999)
    .order('display_order')
    .order('name')
  
  if (rootError || !rootCategories) {
    console.error('getRootCategoriesWithChildren error:', rootError)
    return []
  }
  
  // Get L1 categories for all roots in one query (exclude hidden)
  const rootIds = rootCategories.map(c => c.id)
  const { data: level1Cats, error: l1Error } = await supabase
    .from('categories')
    .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
    .in('parent_id', rootIds)
    .lt('display_order', 9999)
    .order('display_order')
    .order('name')
  
  if (l1Error) {
    console.error('getRootCategoriesWithChildren L1 error:', l1Error)
  }
  
  return rootCategories.map(cat => ({
    category: cat as Category,
    subs: (level1Cats || []).filter(c => c.parent_id === cat.id) as Category[]
  }))
}


