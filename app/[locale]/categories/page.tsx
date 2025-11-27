"use client"

import { Link } from "@/i18n/routing"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, Grid3X3, Sparkles, TrendingUp, Clock } from "lucide-react"

interface Category {
  name: string
  nameEn: string
  slug: string
  icon: string
  image?: string
  featured?: boolean
}

const categories: Category[] = [
  {
    name: "Електроника",
    nameEn: "Electronics",
    slug: "electronics",
    icon: "📱",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80",
    featured: true
  },
  {
    name: "Компютри",
    nameEn: "Computers",
    slug: "computers",
    icon: "💻",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    featured: true
  },
  {
    name: "Gaming",
    nameEn: "Gaming",
    slug: "gaming",
    icon: "🎮",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&q=80",
    featured: true
  },
  {
    name: "Умен дом",
    nameEn: "Smart Home",
    slug: "smart-home",
    icon: "🏠",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80",
    featured: true
  },
  {
    name: "Дом и кухня",
    nameEn: "Home & Kitchen",
    slug: "home",
    icon: "🍳",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"
  },
  {
    name: "Мода",
    nameEn: "Fashion",
    slug: "fashion",
    icon: "👗",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80"
  },
  {
    name: "Красота",
    nameEn: "Beauty",
    slug: "beauty",
    icon: "💄",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=400&q=80"
  },
  {
    name: "Играчки",
    nameEn: "Toys",
    slug: "toys",
    icon: "🧸",
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80"
  },
  {
    name: "Спорт",
    nameEn: "Sports",
    slug: "sports",
    icon: "⚽",
    image: "https://images.unsplash.com/photo-1461896836934-afa09e87b19e?w=400&q=80"
  },
  {
    name: "Книги",
    nameEn: "Books",
    slug: "books",
    icon: "📚",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80"
  },
  {
    name: "Автомобили",
    nameEn: "Automotive",
    slug: "automotive",
    icon: "🚗",
    image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&q=80"
  },
  {
    name: "Градина",
    nameEn: "Garden",
    slug: "garden",
    icon: "🌱",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"
  },
  {
    name: "Здраве",
    nameEn: "Health",
    slug: "health",
    icon: "💊",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&q=80"
  },
  {
    name: "Бебета",
    nameEn: "Baby",
    slug: "baby",
    icon: "👶",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80"
  },
  {
    name: "Домашни любимци",
    nameEn: "Pets",
    slug: "pets",
    icon: "🐕",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&q=80"
  },
  {
    name: "Офис",
    nameEn: "Office",
    slug: "office",
    icon: "🖨️",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80"
  }
]

export default function CategoriesPage() {
  const locale = useLocale()
  
  const featuredCategories = categories.filter(c => c.featured)
  const allCategories = categories

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-12">
      {/* Hero Banner */}
      <div className="bg-header-bg text-header-text py-6 sm:py-10">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-white/70 mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              {locale === "bg" ? "Начало" : "Home"}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-white">
              {locale === "bg" ? "Категории" : "Categories"}
            </span>
          </nav>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 sm:size-14 bg-white/10 rounded-full flex items-center justify-center">
              <Grid3X3 className="size-6 sm:size-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold">
                {locale === "bg" ? "Всички категории" : "Shop All Categories"}
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">
                {locale === "bg" 
                  ? "Открийте хиляди продукти в над 16 категории" 
                  : "Discover thousands of products across 16+ categories"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-3 sm:px-4 -mt-4 sm:-mt-6">
        {/* Quick Links */}
        <div className="bg-card rounded-lg border border-border p-4 mb-6 sm:mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory">
            <Link 
              href="/todays-deals"
              className="flex items-center gap-2 px-4 py-2 bg-brand-deal/10 text-brand-deal rounded-full text-sm font-medium shrink-0 snap-start hover:bg-brand-deal/20 transition-colors"
            >
              <Sparkles className="size-4" />
              {locale === "bg" ? "Днешни оферти" : "Today's Deals"}
            </Link>
            <Link 
              href="/search?sort=bestselling"
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-full text-sm font-medium shrink-0 snap-start hover:bg-muted/80 transition-colors"
            >
              <TrendingUp className="size-4" />
              {locale === "bg" ? "Бестселъри" : "Best Sellers"}
            </Link>
            <Link 
              href="/search?sort=newest"
              className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-full text-sm font-medium shrink-0 snap-start hover:bg-muted/80 transition-colors"
            >
              <Clock className="size-4" />
              {locale === "bg" ? "Нови продукти" : "New Arrivals"}
            </Link>
          </div>
        </div>

        {/* Featured Categories - Large Cards */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            {locale === "bg" ? "Популярни категории" : "Featured Categories"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {featuredCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/search?category=${category.slug}`}
                className="group"
              >
                <Card className="overflow-hidden border-border hover:border-primary transition-colors h-full">
                  <div className="aspect-4/3 relative overflow-hidden">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={locale === "bg" ? category.name : category.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-5xl">{category.icon}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg sm:text-xl drop-shadow-lg">
                        {locale === "bg" ? category.name : category.nameEn}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {locale === "bg" ? "Виж всички" : "Shop now"}
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* All Categories - Circle Grid (Target.com style) */}
        <section className="mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            {locale === "bg" ? "Всички категории" : "All Categories"}
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 sm:gap-6">
            {allCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/search?category=${category.slug}`}
                className={cn(
                  "flex flex-col items-center gap-2 group",
                  "touch-action-manipulation active:scale-95 transition-transform"
                )}
              >
                <div
                  className={cn(
                    "rounded-full flex items-center justify-center overflow-hidden",
                    "size-16 sm:size-20 md:size-24 bg-muted border-2 border-border",
                    "group-hover:border-primary transition-colors"
                  )}
                >
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={locale === "bg" ? category.name : category.nameEn}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl">{category.icon}</span>
                  )}
                </div>
                <span className={cn(
                  "text-xs sm:text-sm font-medium text-center text-muted-foreground",
                  "group-hover:text-primary transition-colors line-clamp-2"
                )}>
                  {locale === "bg" ? category.name : category.nameEn}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Category List - Detailed */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            {locale === "bg" ? "Преглед по категории" : "Browse by Department"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/search?category=${category.slug}`}
                className="group"
              >
                <Card className="border-border hover:border-primary transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="size-14 sm:size-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={locale === "bg" ? category.name : category.nameEn}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{category.icon}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {locale === "bg" ? category.name : category.nameEn}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {locale === "bg" ? "Разгледай продукти" : "Browse products"}
                      </p>
                    </div>
                    <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
