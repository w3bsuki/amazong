import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import { cacheLife, cacheTag } from 'next/cache'
import { createStaticClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'
import { CATEGORY_ATTRIBUTES_SELECT } from '@/lib/supabase/selects/categories'
import { normalizeAttributeKey } from '@/lib/attributes/normalize-attribute-key'
import { isUuid } from '@/lib/utils/is-uuid'
import type { AttributeType, CategoryAttribute, CategoryAttributeInheritScope } from '@/lib/types/categories'

const VALID_ATTRIBUTE_TYPES: AttributeType[] = ['select', 'multiselect', 'boolean', 'number', 'text', 'date']
const MAX_ANCESTOR_DEPTH = 6

export type CategoryAttributeRow = Database['public']['Tables']['category_attributes']['Row']

type CategoryAttributeSourceRow = Pick<
  CategoryAttributeRow,
  | 'id'
  | 'category_id'
  | 'name'
  | 'name_bg'
  | 'attribute_type'
  | 'attribute_key'
  | 'inherit_scope'
  | 'options'
  | 'options_bg'
  | 'placeholder'
  | 'placeholder_bg'
  | 'is_filterable'
  | 'is_required'
  | 'is_hero_spec'
  | 'hero_priority'
  | 'is_badge_spec'
  | 'badge_priority'
  | 'unit_suffix'
  | 'sort_order'
  | 'validation_rules'
>

function isMissingColumnError(error: unknown, columnName: string): boolean {
  if (typeof error !== 'object' || error === null) return false

  const record = error as Record<string, unknown>
  const code = typeof record.code === 'string' ? record.code : ''
  const message = typeof record.message === 'string' ? record.message : ''
  return code === '42703' && message.includes(columnName)
}

function normalizeInheritScope(
  scope: CategoryAttributeInheritScope | null,
  categoryId: string | null,
): CategoryAttributeInheritScope {
  if (scope) return scope
  return categoryId ? 'self_only' : 'global'
}

export function toCategoryAttribute(row: CategoryAttributeSourceRow): CategoryAttribute {
  const attrType = VALID_ATTRIBUTE_TYPES.includes(row.attribute_type as AttributeType)
    ? (row.attribute_type as AttributeType)
    : 'text'

  const attributeKey = row.attribute_key ?? (normalizeAttributeKey(row.name) || null)

  return {
    id: row.id,
    category_id: row.category_id,
    name: row.name,
    name_bg: row.name_bg,
    attribute_type: attrType,
    attribute_key: attributeKey,
    inherit_scope: normalizeInheritScope(row.inherit_scope as CategoryAttributeInheritScope | null, row.category_id),
    options: Array.isArray(row.options) ? (row.options as string[]) : null,
    options_bg: Array.isArray(row.options_bg) ? (row.options_bg as string[]) : null,
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

function getCategoryAttributeKey(attr: Pick<CategoryAttribute, 'attribute_key' | 'name'>): string {
  return (attr.attribute_key ?? normalizeAttributeKey(attr.name)).trim().toLowerCase()
}

function getCategoryAttributeMapKey(
  attr: Pick<CategoryAttribute, 'attribute_key' | 'name' | 'attribute_type'>,
): string {
  return `${getCategoryAttributeKey(attr)}::${attr.attribute_type}`.trim().toLowerCase()
}

function hasAnyOptions(attr: CategoryAttribute): boolean {
  const hasEn = Array.isArray(attr.options) && attr.options.length > 0
  const hasBg = Array.isArray(attr.options_bg) && attr.options_bg.length > 0
  return hasEn || hasBg
}

function withFallbackOptions(current: CategoryAttribute, fallback: CategoryAttribute): CategoryAttribute {
  const currentHasOptions = hasAnyOptions(current)
  const fallbackHasOptions = hasAnyOptions(fallback)
  if (currentHasOptions || !fallbackHasOptions) return current

  return {
    ...current,
    options: Array.isArray(current.options) && current.options.length > 0 ? current.options : fallback.options,
    options_bg: Array.isArray(current.options_bg) && current.options_bg.length > 0 ? current.options_bg : fallback.options_bg,
    attribute_type:
      current.attribute_type === 'text' && fallback.attribute_type !== 'text'
        ? fallback.attribute_type
        : current.attribute_type,
  }
}

export async function resolveCategoryId(
  supabase: SupabaseClient<Database>,
  slugOrId: string,
): Promise<string | null> {
  if (!slugOrId) return null
  if (isUuid(slugOrId)) return slugOrId

  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slugOrId)
    .maybeSingle()

  if (error || !data?.id) return null
  return data.id
}

export async function getCategoryAncestorIds(
  supabase: SupabaseClient<Database>,
  categoryId: string,
  maxDepth: number = MAX_ANCESTOR_DEPTH,
): Promise<string[]> {
  const ancestorIds: string[] = [categoryId]
  let currentId: string | null = categoryId

  for (let i = 0; i < maxDepth && currentId; i++) {
    const response = await supabase
      .from('categories')
      .select('parent_id')
      .eq('id', currentId)
      .maybeSingle()

    if (response.error) break
    const data = response.data as { parent_id: string | null } | null
    const parentId = data?.parent_id ?? null
    if (!parentId) break

    ancestorIds.push(parentId)
    currentId = parentId
  }

  return ancestorIds
}

function shouldIncludeAttribute(params: {
  attr: CategoryAttribute
  categoryId: string
  includeParents: boolean
  includeGlobal: boolean
}): boolean {
  const { attr, categoryId, includeParents, includeGlobal } = params
  const scope = normalizeInheritScope(attr.inherit_scope, attr.category_id)

  if (attr.category_id === categoryId) return true

  if (!includeParents && attr.category_id !== categoryId) return false

  if (attr.category_id === null) {
    return includeGlobal && scope === 'global'
  }

  return scope === 'inherit' || scope === 'global'
}

export async function resolveCategoryAttributesWithClient(
  supabase: SupabaseClient<Database>,
  categoryId: string,
  {
    includeParents = true,
    includeGlobal = true,
    filterableOnly = false,
  }: { includeParents?: boolean; includeGlobal?: boolean; filterableOnly?: boolean } = {},
): Promise<{ attributes: CategoryAttribute[]; ancestorIds: string[] }> {
  const ancestorIds = includeParents
    ? await getCategoryAncestorIds(supabase, categoryId)
    : [categoryId]

  const legacySelect = CATEGORY_ATTRIBUTES_SELECT.replace(',is_active', '')

  const buildScopedQueryWithActive = () =>
    supabase
      .from('category_attributes')
      .select(CATEGORY_ATTRIBUTES_SELECT)
      .in('category_id', ancestorIds)
      .eq('is_active', true)

  const buildScopedQueryLegacy = () =>
    supabase.from('category_attributes').select(legacySelect).in('category_id', ancestorIds)

  let scopedRows: unknown = null
  let scopedError: unknown = null

  {
    const scopedQuery = filterableOnly
      ? buildScopedQueryWithActive().eq('is_filterable', true)
      : buildScopedQueryWithActive()

    const result = await scopedQuery.order('sort_order')
    scopedRows = result.data
    scopedError = result.error
  }

  if (scopedError && isMissingColumnError(scopedError, 'is_active')) {
    const scopedQuery = filterableOnly ? buildScopedQueryLegacy().eq('is_filterable', true) : buildScopedQueryLegacy()

    const result = await scopedQuery.order('sort_order')
    scopedRows = result.data
    scopedError = result.error
  }

  if (scopedError) {
    return { attributes: [], ancestorIds }
  }

  let globalRows: CategoryAttributeSourceRow[] = []
  if (includeGlobal) {
    const buildGlobalQueryWithActive = () =>
      supabase
        .from('category_attributes')
        .select(CATEGORY_ATTRIBUTES_SELECT)
        .is('category_id', null)
        .eq('is_active', true)

    const buildGlobalQueryLegacy = () =>
      supabase.from('category_attributes').select(legacySelect).is('category_id', null)

    let globalData: unknown = null
    let globalError: unknown = null

    {
      const globalQuery = filterableOnly
        ? buildGlobalQueryWithActive().eq('is_filterable', true)
        : buildGlobalQueryWithActive()

      const result = await globalQuery.order('sort_order')
      globalData = result.data
      globalError = result.error
    }

    if (globalError && isMissingColumnError(globalError, 'is_active')) {
      const globalQuery = filterableOnly
        ? buildGlobalQueryLegacy().eq('is_filterable', true)
        : buildGlobalQueryLegacy()

      const result = await globalQuery.order('sort_order')
      globalData = result.data
      globalError = result.error
    }

    globalRows = (globalData || []) as CategoryAttributeSourceRow[]
  }

  const scopedSourceRows = (scopedRows || []) as CategoryAttributeSourceRow[]
  const rawAttributes = [...scopedSourceRows, ...globalRows].map(toCategoryAttribute)
  const filtered = rawAttributes.filter((attr) =>
    shouldIncludeAttribute({ attr, categoryId, includeParents, includeGlobal })
  )

  const depthByCategoryId = new Map<string, number>()
  ancestorIds.forEach((id, index) => depthByCategoryId.set(id, index))

  const inheritedSorted = [...filtered]
    .filter((attr) => attr.category_id !== categoryId)
    .sort((a, b) => {
      const da = depthByCategoryId.get(a.category_id ?? '') ?? 9999
      const db = depthByCategoryId.get(b.category_id ?? '') ?? 9999
      if (da !== db) return db - da
      return (a.sort_order ?? 999) - (b.sort_order ?? 999)
    })

  const attrMap = new Map<string, CategoryAttribute & { isOwn: boolean }>()

  for (const attr of inheritedSorted) {
    const key = getCategoryAttributeMapKey(attr)
    const existing = attrMap.get(key)
    attrMap.set(key, {
      ...(existing ? withFallbackOptions(attr, existing) : attr),
      isOwn: false,
    })
  }

  for (const attr of filtered.filter((item) => item.category_id === categoryId)) {
    const key = getCategoryAttributeMapKey(attr)
    const existing = attrMap.get(key)
    attrMap.set(key, {
      ...(existing ? withFallbackOptions(attr, existing) : attr),
      isOwn: true,
    })
  }

  const attributes = [...attrMap.values()]
    .sort((a, b) => {
      if (a.isOwn && !b.isOwn) return -1
      if (!a.isOwn && b.isOwn) return 1
      return (a.sort_order ?? 999) - (b.sort_order ?? 999)
    })
    .map(({ isOwn: _isOwn, ...attr }) => {
      void _isOwn
      return attr as CategoryAttribute
    })

  return { attributes, ancestorIds }
}

export async function resolveCategoryAttributes(params: {
  slugOrId: string
  includeParents?: boolean
  includeGlobal?: boolean
  filterableOnly?: boolean
}): Promise<{ categoryId: string | null; attributes: CategoryAttribute[]; ancestorIds: string[] }> {
  'use cache'
  cacheLife('categories')

  const {
    slugOrId,
    includeParents = true,
    includeGlobal = true,
    filterableOnly = false,
  } = params

  const supabase = createStaticClient()
  const categoryId = await resolveCategoryId(supabase, slugOrId)

  if (!categoryId) {
    return { categoryId: null, attributes: [], ancestorIds: [] }
  }

  cacheTag(`category:${slugOrId}`)
  cacheTag(`category:${categoryId}`)

  const { attributes, ancestorIds } = await resolveCategoryAttributesWithClient(supabase, categoryId, {
    includeParents,
    includeGlobal,
    filterableOnly,
  })

  for (const id of ancestorIds) {
    cacheTag(`attrs:category:${id}`)
  }
  if (includeGlobal) {
    cacheTag('attrs:global')
  }

  return { categoryId, attributes, ancestorIds }
}
