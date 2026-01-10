import type { CategoryAttribute } from '@/lib/data/categories'

export function getCategoryAttributeLabel(attr: CategoryAttribute, locale: string): string {
  return locale === 'bg' && attr.name_bg ? attr.name_bg : attr.name
}

export function getCategoryAttributeOptions(attr: CategoryAttribute, locale: string): string[] | null {
  return locale === 'bg' && attr.options_bg ? attr.options_bg : attr.options
}

export function normalizeCategoryAttributeName(value: string): string {
  return value.trim().toLowerCase()
}

export const FORCE_MULTISELECT_ATTRIBUTE_NAMES = ['brand', 'make', 'model'] as const

export function shouldForceMultiSelectCategoryAttribute(attr: CategoryAttribute): boolean {
  return FORCE_MULTISELECT_ATTRIBUTE_NAMES.includes(
    normalizeCategoryAttributeName(attr.name) as (typeof FORCE_MULTISELECT_ATTRIBUTE_NAMES)[number]
  )
}
