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

const SHORT_NAMES_BG: Record<string, string> = {
  "Електроника": "Техника",
  "Автомобили": "Авто",
  "Дом и кухня": "Дом",
  "Бижута и часовници": "Бижута",
  "Филми и музика": "Медия",
  "Услуги и събития": "Услуги",
  "Колекционерски": "Колекции",
  "Електромобилност": "Е-мобилност",
  "Здраве": "Здраве",
  "Инструменти": "Инструменти",
}

const SHORT_NAMES_EN: Record<string, string> = {
  Electronics: "Tech",
  Automotive: "Auto",
  "Home & Kitchen": "Home",
  "Jewelry & Watches": "Jewelry",
  "Movies & Music": "Media",
  "Services & Events": "Services",
  Collectibles: "Collect",
  "E-Mobility": "E-Mobility",
  "Health & Wellness": "Health",
  "Tools & Home": "Tools",
  "Baby & Kids": "Kids",
}

export function getCategoryShortName(category: CategoryDisplay, locale: string): string {
  const fullName = getCategoryName(category, locale)
  if (locale === "bg") return SHORT_NAMES_BG[fullName] ?? fullName
  return SHORT_NAMES_EN[fullName] ?? fullName
}
