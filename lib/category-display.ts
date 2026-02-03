export type CategoryDisplay = {
  id: string
  name: string
  name_bg: string | null
  slug: string
  image_url?: string | null
  icon?: string | null
}

export function getCategoryName(category: CategoryDisplay, locale: string): string {
  if (locale === "bg" && category.name_bg) return category.name_bg
  return category.name
}

export function getCategorySlugKey(slug: string): string {
  return slug.replace(/-/g, "_")
}
