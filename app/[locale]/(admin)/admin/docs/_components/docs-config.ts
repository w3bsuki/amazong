export const CATEGORIES = [
  "product",
  "policies",
  "payments",
  "plans",
  "roadmap",
  "ops",
  "guides",
  "legal",
  "general",
] as const

export const STATUSES = ["draft", "published", "archived"] as const

export const STATUS_COLORS: Record<string, string> = {
  draft: "bg-admin-draft-bg text-admin-draft",
  published: "bg-admin-published-bg text-admin-published",
  archived: "bg-muted text-muted-foreground",
}

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sht",
  ъ: "a",
  ь: "y",
  ю: "yu",
  я: "ya",
  ѝ: "i",
}

export function slugifyTitle(title: string) {
  const lowered = title.trim().toLowerCase()
  const transliterated = lowered.replaceAll(/[\u0400-\u04FF]/g, (char) => CYRILLIC_TO_LATIN[char] ?? char)
  const withoutDiacritics = transliterated.normalize("NFKD").replaceAll(/[\u0300-\u036f]/g, "")

  return withoutDiacritics
    .replaceAll(/[^a-z0-9\s-]/g, " ")
    .replaceAll(/[\s_-]+/g, "-")
    .replaceAll(/^-+|-+$/g, "")
}

export function makeUniqueSlug(baseSlug: string, existingSlugs: Set<string>) {
  const fallback = baseSlug || `doc-${Date.now()}`
  let slug = fallback
  let i = 2
  while (existingSlugs.has(slug)) {
    slug = `${fallback}-${i}`
    i += 1
  }
  return slug
}
