const HIDDEN_FILTER_ATTRIBUTE_NAMES = [
  "cruelty free",
  "vegan",
  "cruelty_free",
]

const COLOR_FILTER_ATTRIBUTE_NAMES = ["color", "colour", "цвят"]
const SIZE_FILTER_ATTRIBUTE_NAMES = ["size", "sizes", "размер"]
const SEARCHABLE_FILTER_ATTRIBUTE_NAMES = ["brand", "brands", "марка", "condition", "състояние"]

export function isHiddenFilterAttribute(name: string): boolean {
  return HIDDEN_FILTER_ATTRIBUTE_NAMES.includes(name.trim().toLowerCase())
}

export function isColorFilterAttribute(name: string): boolean {
  return COLOR_FILTER_ATTRIBUTE_NAMES.includes(name.trim().toLowerCase())
}

export function isSizeFilterAttribute(name: string): boolean {
  return SIZE_FILTER_ATTRIBUTE_NAMES.includes(name.trim().toLowerCase())
}

export function isSearchableFilterAttribute(name: string): boolean {
  return SEARCHABLE_FILTER_ATTRIBUTE_NAMES.includes(name.trim().toLowerCase())
}
