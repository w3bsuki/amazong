import type { CategoryTreeNode } from "@/lib/category-tree"
import type { CategoryAttribute } from "@/lib/data/categories"
import {
  getCategoryAttributeKey,
  getCategoryAttributeLabel,
  getCategoryAttributeOptions,
} from "@/lib/filters/category-attribute"
import type { QuickAttributePill } from "../../../../_components/filters/mobile-filter-controls"
import { getFilterPillsForCategory } from "../../_lib/filter-priority"

const MAX_QUICK_ATTRIBUTE_PILLS = 5

export interface ScopeCategory {
  id: string
  slug: string
  parent_id: string | null
  name: string
  name_bg: string | null
  icon?: string | null
  image_url?: string | null
}

export interface FilterSubcategory {
  id: string
  name: string
  name_bg: string | null
  slug: string
}

export function toScopedCategoryList(categories: CategoryTreeNode[]): ScopeCategory[] {
  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    parent_id: category.parent_id ?? null,
    name: category.name,
    name_bg: category.name_bg ?? null,
    icon: category.icon ?? null,
    image_url: category.image_url ?? null,
  }))
}

export function buildQuickAttributePills(options: {
  locale: string
  categorySlug: string
  attributes: CategoryAttribute[]
  appliedSearchParams: URLSearchParams
}): QuickAttributePill[] {
  const { locale, categorySlug, attributes, appliedSearchParams } = options
  if (attributes.length === 0) return []

  const withOptions = attributes.filter((attribute) => {
    const attributeOptions = getCategoryAttributeOptions(attribute, locale)
    return (
      attribute.is_filterable &&
      (attribute.attribute_type === "select" || attribute.attribute_type === "multiselect") &&
      Array.isArray(attributeOptions) &&
      attributeOptions.length > 0
    )
  })
  if (withOptions.length === 0) return []

  const priorityKeys = getFilterPillsForCategory(categorySlug, withOptions).filter(
    (key) => key !== "price" && key !== "category"
  )

  const ordered: CategoryAttribute[] = []
  const used = new Set<string>()

  for (const priorityKey of priorityKeys) {
    const match = withOptions.find((attribute) => getCategoryAttributeKey(attribute) === priorityKey)
    if (!match) continue
    used.add(match.id)
    ordered.push(match)
  }

  for (const attribute of withOptions) {
    if (used.has(attribute.id)) continue
    ordered.push(attribute)
  }

  return ordered.slice(0, MAX_QUICK_ATTRIBUTE_PILLS).map((attribute) => {
    const attributeKey = getCategoryAttributeKey(attribute)
    const selectedCount = appliedSearchParams.getAll(`attr_${attributeKey}`).filter(Boolean).length
    return {
      sectionId: `attr_${attribute.id}`,
      label: getCategoryAttributeLabel(attribute, locale),
      active: selectedCount > 0,
      ...(selectedCount > 0 ? { selectedCount } : {}),
    }
  })
}

export function buildScopedDrawerCategory(options: {
  currentScopeParent: ScopeCategory | null
  railCategories: ScopeCategory[]
  categoryId: string | null
  categorySlug: string
  activeCategoryName: string | null
  contextualInitialTitle: string
}): CategoryTreeNode | null {
  const {
    currentScopeParent,
    railCategories,
    categoryId,
    categorySlug,
    activeCategoryName,
    contextualInitialTitle,
  } = options

  const childNodes: CategoryTreeNode[] = railCategories.map((child) => ({
    id: child.id,
    slug: child.slug,
    name: child.name,
    name_bg: child.name_bg,
    parent_id: child.parent_id,
    ...(child.icon ? { icon: child.icon } : {}),
    ...(child.image_url ? { image_url: child.image_url } : {}),
    children: [],
  }))

  if (currentScopeParent) {
    return {
      id: currentScopeParent.id,
      slug: currentScopeParent.slug,
      name: currentScopeParent.name,
      name_bg: currentScopeParent.name_bg,
      parent_id: currentScopeParent.parent_id,
      children: childNodes,
    }
  }

  if (!categoryId || categorySlug === "all") {
    return null
  }

  return {
    id: categoryId,
    slug: categorySlug,
    name: activeCategoryName || contextualInitialTitle || categorySlug,
    name_bg: null,
    parent_id: null,
    children: childNodes,
  }
}

export function toFilterSubcategories(railCategories: ScopeCategory[]): FilterSubcategory[] {
  return railCategories.map((category) => ({
    id: category.id,
    name: category.name,
    name_bg: category.name_bg,
    slug: category.slug,
  }))
}
