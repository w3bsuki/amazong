"use client"

import { useState, useEffect } from "react"
import { Link } from "@/i18n/routing"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll"
import Image from "next/image"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  image_url?: string | null
}

// High-quality Unsplash images for each category
// Curated to show PRODUCTS, not people - better for e-commerce
const categoryImages: Record<string, string> = {
  // Home & Living
  home: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&h=200&fit=crop", // Modern white furniture
  "garden-outdoor": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop", // Garden plants
  "tools-home": "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=200&h=200&fit=crop", // Tools on wall
  
  // Fashion & Style
  fashion: "https://images.unsplash.com/photo-1560243563-062bfc001d68?w=200&h=200&fit=crop", // Clothing rack colorful
  beauty: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=200&fit=crop", // Lipsticks collection (image 2)
  "jewelry-watches": "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=200&h=200&fit=crop", // Luxury watch
  
  // Tech & Electronics
  electronics: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=200&h=200&fit=crop", // Tech gadgets flat lay
  computers: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=200&h=200&fit=crop", // Keyboard mouse
  gaming: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=200&h=200&fit=crop", // Xbox controller green
  "smart-home": "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=200&h=200&fit=crop", // Smart speaker
  software: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop", // Code on screen
  
  // Lifestyle
  sports: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&h=200&fit=crop", // Soccer ball
  "health-wellness": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=200&h=200&fit=crop", // Herbal tea
  toys: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=200&h=200&fit=crop", // Colorful toys (kids)
  hobbies: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", // RC car / hobby (NEW)
  "baby-kids": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop", // Baby toys colorful
  pets: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=200&h=200&fit=crop", // Cute dog
  
  // Media & Entertainment
  books: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop", // Open book pages
  "movies-music": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop", // Music headphones
  "musical-instruments": "https://images.unsplash.com/photo-1558098329-a11cff621064?w=200&h=200&fit=crop", // Drum kit
  collectibles: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=200&h=200&fit=crop", // Pokemon/trading cards
  
  // Business & Services
  automotive: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop", // Sports car
  industrial: "https://images.unsplash.com/photo-1504917595217-d4dc5ebb6122?w=200&h=200&fit=crop", // Industrial equipment
  "office-school": "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=200&h=200&fit=crop", // School supplies
  services: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop", // Business meeting
  "real-estate": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop", // House keys
  
  // Food & Goods
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop", // Fruits and veggies
  handmade: "https://images.unsplash.com/photo-1528396518501-b53b655eb9b3?w=200&h=200&fit=crop", // Handmade crafts
  
  // Special categories
  "gift-cards": "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=200&h=200&fit=crop", // Wrapped gifts
  tickets: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=200&h=200&fit=crop", // Concert tickets
  wholesale: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=200&h=200&fit=crop", // Warehouse boxes
  "e-mobility": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop", // Electric scooter
  agriculture: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&h=200&fit=crop", // Farm crops
  "bulgarian-traditional": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop", // Traditional bread/food
}

// Get image URL for category
function getCategoryImage(slug: string): string | null {
  if (categoryImages[slug]) return categoryImages[slug]
  
  // Try partial match
  for (const [key, url] of Object.entries(categoryImages)) {
    if (slug.includes(key) || key.includes(slug)) return url
  }
  
  return null
}

interface CategoryCirclesProps {
  locale?: string
}

export function CategoryCircles({ locale = "en" }: CategoryCirclesProps) {
  const { scrollRef, canScrollLeft, canScrollRight, scrollTo } = useHorizontalScroll()
  const [categories, setCategories] = useState<Category[]>([])

  // Fetch categories from Supabase
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategories(data.categories)
        }
      })
      .catch(err => console.error('Failed to fetch categories:', err))
  }, [])

  const getCategoryName = (cat: Category) => {
    return locale === 'bg' && cat.name_bg ? cat.name_bg : cat.name
  }

  return (
    <div className={cn(
      "relative w-full overflow-hidden",
      // Mobile: White card styling
      "bg-white pt-4 pb-3 border-0 rounded-none",
      // Desktop: Card styling with rounded corners
      "sm:py-5 sm:border sm:border-border sm:rounded-md"
    )}>
      {/* Header with title, scroll buttons, and See more link */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-foreground text-base sm:text-lg">
            {locale === "bg" ? "Пазарувай по категория" : "Shop by Category"}
          </h2>
          {/* See all - Desktop: next to title */}
          <Link 
            href="/categories" 
            className="hidden sm:flex text-brand-blue hover:underline text-sm font-normal items-center gap-0.5"
          >
            {locale === "bg" ? "Виж всички" : "See all"}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {/* Scroll buttons - Desktop only */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scrollTo("left")}
              className={cn(
                "size-8 flex items-center justify-center rounded-full border border-border bg-white hover:bg-muted",
                !canScrollLeft && "opacity-40 pointer-events-none"
              )}
              aria-label="Scroll left"
            >
              <CaretLeft size={16} weight="regular" className="text-foreground" />
            </button>
            <button
              onClick={() => scrollTo("right")}
              className={cn(
                "size-8 flex items-center justify-center rounded-full border border-border bg-white hover:bg-muted",
                !canScrollRight && "opacity-40 pointer-events-none"
              )}
              aria-label="Scroll right"
            >
              <CaretRight size={16} weight="regular" className="text-foreground" />
            </button>
          </div>
          {/* See all - Mobile only */}
          <Link 
            href="/categories" 
            className="sm:hidden text-brand-blue hover:underline text-xs font-normal flex items-center gap-0.5"
          >
            {locale === "bg" ? "Виж всички" : "See all"}
            <CaretRight size={14} weight="regular" />
          </Link>
        </div>
      </div>
      
      {/* Scrollable Container - Images in circles like eBay */}
      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto scrollbar-hide snap-x-mandatory scroll-smooth",
          // Mobile: Safe area padding
          "gap-4 pl-4 py-2 scroll-pl-4",
          // Desktop: Better spacing
          "sm:gap-5 sm:pl-5 sm:py-3 sm:scroll-pl-5"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category, index) => {
          const imageUrl = getCategoryImage(category.slug)
          
          return (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className={cn(
                "flex flex-col items-center gap-1.5 sm:gap-2 min-w-[72px] sm:min-w-[88px] md:min-w-[96px] group snap-start shrink-0",
                // Add right padding to last item
                index === categories.length - 1 && "mr-4 sm:mr-5"
              )}
            >
              {/* Circle with image */}
              <div
                className={cn(
                  "rounded-full overflow-hidden flex items-center justify-center bg-muted",
                  // Mobile: Compact circle
                  "size-16",
                  // Desktop: Larger
                  "sm:size-20 md:size-[88px]",
                  // Subtle border - slightly darker on hover (eBay style)
                  "ring-1 ring-border/30 group-hover:ring-border/60"
                )}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={getCategoryName(category)}
                    width={88}
                    height={88}
                    className="size-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="size-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <span className="text-slate-400 font-medium text-xs">
                      {category.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Category Name */}
              <span className={cn(
                "font-normal text-center line-clamp-2",
                // Mobile: Compact text
                "text-xs text-muted-foreground max-w-[72px]",
                // Desktop: Standard sizing with hover underline (eBay style - just underline)
                "sm:text-xs md:text-sm sm:text-foreground sm:max-w-[88px] md:max-w-[96px]",
                "group-hover:underline"
              )}>
                {getCategoryName(category)}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Mobile scroll indicator - subtle fade */}
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent pointer-events-none sm:hidden transition-opacity",
          !canScrollRight && "opacity-0"
        )} 
      />
    </div>
  )
}
