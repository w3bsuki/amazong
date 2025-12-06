import { cacheTag, cacheLife } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'

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

export interface CategoryAttribute {
  id: string
  category_id: string
  name: string
  name_bg: string | null
  attribute_type: 'select' | 'multiselect' | 'boolean' | 'number' | 'text'
  options: string[] | null
  options_bg: string[] | null
  min_value: number | null
  max_value: number | null
  is_filterable: boolean
  is_required: boolean
  sort_order: number | null
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

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Transform flat RPC results into nested tree structure
 */
function buildCategoryTree(rows: CategoryHierarchyRow[]): CategoryWithChildren[] {
  const categoryMap = new Map<string, CategoryWithChildren>()
  const rootCategories: CategoryWithChildren[] = []
  
  // First pass: create all category objects
  for (const row of rows) {
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
  for (const row of rows) {
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
 * Fetch full category hierarchy starting from a slug or all root categories.
 * Uses recursive CTE via RPC for O(1) query instead of N+1.
 * 
 * @param slug - Category slug to start from (null = all root categories)
 * @param depth - How many levels deep to fetch (default: 3)
 * @returns Nested category tree structure
 */
export async function getCategoryHierarchy(
  slug?: string | null, 
  depth: number = 3
): Promise<CategoryWithChildren[]> {
  'use cache'
  cacheTag('categories', slug ? `category-hierarchy-${slug}` : 'category-hierarchy-all')
  cacheLife('categories')
  
  const supabase = createStaticClient()
  if (!supabase) {
    console.error('getCategoryHierarchy: Database connection failed')
    return []
  }
  
  const { data, error } = await supabase.rpc('get_category_hierarchy', {
    p_slug: slug || null,
    p_depth: depth
  })
  
  if (error) {
    console.error('getCategoryHierarchy error:', error)
    return []
  }
  
  const rows = (data || []) as CategoryHierarchyRow[]
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
 * Fetch filterable attributes for a category.
 * Used to build dynamic filter UIs on category pages.
 * 
 * @param categoryId - Category UUID
 * @returns Array of filterable attributes
 */
export async function getCategoryAttributes(categoryId: string): Promise<CategoryAttribute[]> {
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
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_filterable', true)
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('getCategoryAttributes error:', error)
    return []
  }
  
  return (data || []) as CategoryAttribute[]
}

/**
 * Fetch sibling categories (same parent).
 * Used for sidebar navigation.
 * 
 * @param parentId - Parent category UUID (null for root categories)
 * @returns Array of sibling categories
 */
export async function getSiblingCategories(parentId: string | null): Promise<Category[]> {
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
export async function getChildCategories(categoryId: string): Promise<Category[]> {
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
    // Siblings (same parent)
    current.parent_id
      ? supabase
          .from('categories')
          .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
          .eq('parent_id', current.parent_id)
          .order('display_order')
          .order('name')
      : supabase
          .from('categories')
          .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
          .is('parent_id', null)
          .order('display_order')
          .order('name'),
    
    // Children
    supabase
      .from('categories')
      .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
      .eq('parent_id', current.id)
      .order('display_order')
      .order('name'),
    
    // Filterable attributes for current category
    supabase
      .from('category_attributes')
      .select('*')
      .eq('category_id', current.id)
      .eq('is_filterable', true)
      .order('sort_order')
  ])
  
  // If current category has no attributes but has a parent, inherit parent's attributes
  let attributes = attributesResult.data || []
  if (attributes.length === 0 && current.parent_id) {
    const { data: parentAttributes } = await supabase
      .from('category_attributes')
      .select('*')
      .eq('category_id', current.parent_id)
      .eq('is_filterable', true)
      .order('sort_order')
    
    attributes = parentAttributes || []
  }
  
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
    attributes: attributes as CategoryAttribute[]
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
  
  // Get root categories
  const { data: rootCategories, error: rootError } = await supabase
    .from('categories')
    .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
    .is('parent_id', null)
    .order('display_order')
    .order('name')
  
  if (rootError || !rootCategories) {
    console.error('getRootCategoriesWithChildren error:', rootError)
    return []
  }
  
  // Get L1 categories for all roots in one query
  const rootIds = rootCategories.map(c => c.id)
  const { data: level1Cats, error: l1Error } = await supabase
    .from('categories')
    .select('id, name, name_bg, slug, parent_id, image_url, icon, display_order')
    .in('parent_id', rootIds)
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
