import { Link } from "@/i18n/routing"
import { getLocale } from "next-intl/server"
import { Card, CardContent } from "@/components/ui/card"
import { CaretRight, GridFour } from "@phosphor-icons/react/dist/ssr"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from 'next'

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  image_url: string | null
}

// SEO Metadata
export const metadata: Metadata = {
  title: 'All Categories - Shop',
  description: 'Browse all product categories. Find electronics, fashion, home goods and more.',
}

// Fallback images for categories
const categoryImages: Record<string, string> = {
  "electronics": "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop",
  "clothing": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
  "home-garden": "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=200&h=200&fit=crop",
  "sports": "https://images.unsplash.com/photo-1461896836934- voices?w=200&h=200&fit=crop",
  "beauty": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
  "toys": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200&h=200&fit=crop",
  "books": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop",
  "automotive": "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=200&h=200&fit=crop",
  "grocery": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop",
  "pet-supplies": "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&h=200&fit=crop",
  "office": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop",
  "health": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=200&h=200&fit=crop",
  "baby": "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&h=200&fit=crop",
  "jewelry": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop",
  "tools": "https://images.unsplash.com/photo-1581147036324-c1c1a55c31e4?w=200&h=200&fit=crop",
  "music": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200&h=200&fit=crop",
}

export default async function CategoriesPage() {
  const locale = await getLocale()
  const supabase = await createClient()
  
  // Fetch categories directly in server component
  let categories: Category[] = []
  
  if (supabase) {
    const { data } = await supabase
      .from("categories")
      .select("id, name, name_bg, slug, image_url")
      .is("parent_id", null)
      .order("name")
    
    categories = data || []
  }

  const getCategoryName = (cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Banner */}
      <div className="bg-primary text-primary-foreground py-6 sm:py-10">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-primary-foreground/70 mb-4">
            <Link href="/" className="hover:text-primary-foreground transition-colors">
              {locale === "bg" ? "Начало" : "Home"}
            </Link>
            <CaretRight className="size-3.5" />
            <span className="text-primary-foreground">
              {locale === "bg" ? "Категории" : "Categories"}
            </span>
          </nav>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 sm:size-14 bg-primary-foreground/10 rounded-full flex items-center justify-center">
              <GridFour className="size-6 sm:size-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold">
                {locale === "bg" ? "Всички категории" : "Shop All Categories"}
              </h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base mt-1">
                {locale === "bg" 
                  ? "Открийте хиляди продукти в над 16 категории" 
                  : "Discover thousands of products across 16+ categories"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container -mt-4 sm:-mt-6">
        {/* Category List */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            {locale === "bg" ? "Преглед по категории" : "Browse by Department"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const categoryName = getCategoryName(category)
              const imageUrl = category.image_url || categoryImages[category.slug] || "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200&h=200&fit=crop"
              
              return (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group"
                >
                  <Card className="border-border hover:border-primary transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="size-14 sm:size-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        <img 
                          src={imageUrl} 
                          alt={categoryName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {categoryName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {locale === "bg" ? "Разгледай продукти" : "Browse products"}
                        </p>
                      </div>
                      <CaretRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
