import { createStaticClient } from "@/lib/supabase/server"

export interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  image_url: string | null
}

// Fallback images for categories
export const categoryImages: Record<string, string> = {
  // Original categories
  electronics:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop",
  clothing:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
  fashion:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
  "home-garden":
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=200&h=200&fit=crop",
  home:
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=200&h=200&fit=crop",
  sports:
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200&h=200&fit=crop",
  beauty:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
  toys:
    "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&h=200&fit=crop",
  books:
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop",
  automotive:
    "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=200&h=200&fit=crop",
  grocery:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop",
  "pet-supplies":
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&h=200&fit=crop",
  pets:
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&h=200&fit=crop",
  office:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop",
  "office-school":
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop",
  health:
    "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=200&h=200&fit=crop",
  "health-wellness":
    "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=200&h=200&fit=crop",
  baby:
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&h=200&fit=crop",
  "baby-kids":
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&h=200&fit=crop",
  jewelry:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop",
  "jewelry-watches":
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop",
  tools:
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=200&h=200&fit=crop",
  "tools-home":
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=200&h=200&fit=crop",
  music:
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop",
  "musical-instruments":
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop",
  // New categories
  "real-estate":
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop",
  "tickets-experiences":
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=200&fit=crop",
  "gift-cards":
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&h=200&fit=crop",
  "cell-phones":
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop",
  "cameras-photo":
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop",
  "everything-else":
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
  // Additional categories
  computers:
    "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=200&h=200&fit=crop",
  gaming:
    "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=200&h=200&fit=crop",
  "smart-home":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  "garden-outdoor":
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop",
  handmade:
    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200&h=200&fit=crop",
  collectibles:
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop",
  "movies-music":
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop",
  "industrial-scientific":
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop",
  "software-services":
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop",
}

export const DEFAULT_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop"

export function getCategoryName(locale: string, category: Category) {
  if (locale === "bg" && category.name_bg) return category.name_bg
  return category.name
}

export function getCategoryImageUrl(category: Category) {
  return category.image_url || categoryImages[category.slug] || DEFAULT_CATEGORY_IMAGE
}

export async function getRootCategories() {
  const supabase = createStaticClient()
  if (!supabase) return []

  const { data } = await supabase
    .from("categories")
    .select("id, name, name_bg, slug, image_url")
    .is("parent_id", null)
    .order("name")

  return (data || []) as Category[]
}
