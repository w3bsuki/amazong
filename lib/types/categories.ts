export type AttributeType = 'select' | 'multiselect' | 'boolean' | 'number' | 'text' | 'date'
export type CategoryAttributeInheritScope = 'self_only' | 'inherit' | 'global'

export interface CategoryAttribute {
  id: string
  category_id: string | null
  name: string
  name_bg: string | null
  attribute_type: AttributeType
  /** Canonical, normalized key (preferred over name for JSONB + URL params). */
  attribute_key: string | null
  /** Inheritance scope for attribute propagation. */
  inherit_scope: CategoryAttributeInheritScope | null
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
