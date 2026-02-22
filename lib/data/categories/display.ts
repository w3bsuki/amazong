import type { CategoryDisplay } from "./types"

export type { CategoryDisplay }

export function getCategoryName(category: CategoryDisplay, locale: string): string {
  if (locale === "bg" && category.name_bg) return category.name_bg
  return category.name
}

export function getCategorySlugKey(slug: string): string {
  return slug.replaceAll("-", "_")
}

