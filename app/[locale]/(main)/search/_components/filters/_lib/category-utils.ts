import type { Category } from "../types"

export function isValidCategory(category: Category): boolean {
  const name = category.name.toLowerCase()
  return !name.includes("[deprecated]") && !name.includes("[moved]") && !name.includes("[duplicate]")
}

export function getCategoryName(category: Category, locale: string): string {
  if (locale === "bg" && category.name_bg) {
    return category.name_bg
  }

  return category.name
}
