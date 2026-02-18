export interface CategoryAttribute {
  id: string
  name: string
  name_bg?: string | null
  attribute_type: "text" | "number" | "select" | "multiselect" | "boolean" | "date"
  is_required: boolean
  is_filterable: boolean
  options?: string[]
  options_bg?: string[]
  placeholder?: string
  placeholder_bg?: string
  sort_order: number
}

export const EXCLUDED_ATTRIBUTE_NAMES = ["condition", "състояние", "състояние на продукта"]
