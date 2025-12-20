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
    placeholder: row.placeholder,
    placeholder_bg: row.placeholder_bg,
    is_filterable: row.is_filterable,
    is_required: row.is_required,
    sort_order: row.sort_order,
    validation_rules: row.validation_rules,
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
    p_slug: slug ?? undefined,
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
  
  return (data || []).map(toCategoryAttribute)
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
      .select('*')
      .eq('category_id', current.id)
      .eq('is_filterable', true)
      .order('sort_order')
  ])

  const currentAttributes = (attributesResult.data || []).map(toCategoryAttribute)

  // Default behavior: show ONLY the current category's filterable attributes.
  // If the category has none, inherit parent's (legacy behavior).
  let attributes = currentAttributes

  let parentAttributes: CategoryAttribute[] = []
  if (current.parent_id) {
    const { data: parentAttributesRaw } = await supabase
      .from('category_attributes')
      .select('*')
      .eq('category_id', current.parent_id)
      .eq('is_filterable', true)
      .order('sort_order')
    parentAttributes = (parentAttributesRaw || []).map(toCategoryAttribute)
  }

  if (attributes.length === 0 && parentAttributes.length > 0) {
    attributes = parentAttributes
  } else if (attributes.length > 0 && parentAttributes.length > 0) {
    // Targeted fallback: if a current-category attribute is missing options,
    // borrow options/type from the parent attribute with the same name.
    const parentByName = new Map(parentAttributes.map(a => [normalizeAttributeName(a.name), a]))
    attributes = attributes.map(attr => {
      const fallback = parentByName.get(normalizeAttributeName(attr.name))
      return fallback ? withFallbackOptions(attr, fallback) : attr
    })
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
