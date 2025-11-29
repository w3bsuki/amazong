"use client"

import * as React from "react"
import { Link } from "@/i18n/routing"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface Brand {
  name: string
  slug: string
  logo: string
  color: string // Brand color for fallback/styling
}

// Popular brands with Simple Icons (CC0 license - completely free to use)
// CDN: https://cdn.simpleicons.org/{icon-slug}
// Alternative CDN: https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/{slug}.svg
const brands: Brand[] = [
  {
    name: "Apple",
    slug: "apple",
    logo: "https://cdn.simpleicons.org/apple/000000",
    color: "#A2AAAD"
  },
  {
    name: "Samsung",
    slug: "samsung",
    logo: "https://cdn.simpleicons.org/samsung/1428A0",
    color: "#1428A0"
  },
  {
    name: "Sony",
    slug: "sony",
    logo: "https://cdn.simpleicons.org/sony/000000",
    color: "#000000"
  },
  {
    name: "LG",
    slug: "lg",
    logo: "https://cdn.simpleicons.org/lg/A50034",
    color: "#A50034"
  },
  {
    name: "Nike",
    slug: "nike",
    logo: "https://cdn.simpleicons.org/nike/111111",
    color: "#111111"
  },
  {
    name: "Adidas",
    slug: "adidas",
    logo: "https://cdn.simpleicons.org/adidas/000000",
    color: "#000000"
  },
  {
    name: "Puma",
    slug: "puma",
    logo: "https://cdn.simpleicons.org/puma/000000",
    color: "#000000"
  },
  {
    name: "NVIDIA",
    slug: "nvidia",
    logo: "https://cdn.simpleicons.org/nvidia/76B900",
    color: "#76B900"
  },
  {
    name: "Intel",
    slug: "intel",
    logo: "https://cdn.simpleicons.org/intel/0071C5",
    color: "#0071C5"
  },
  {
    name: "AMD",
    slug: "amd",
    logo: "https://cdn.simpleicons.org/amd/ED1C24",
    color: "#ED1C24"
  },
  {
    name: "ASUS",
    slug: "asus",
    logo: "https://cdn.simpleicons.org/asus/000000",
    color: "#000000"
  },
  {
    name: "MSI",
    slug: "msi",
    logo: "https://cdn.simpleicons.org/msi/FF0000",
    color: "#FF0000"
  },
  {
    name: "Razer",
    slug: "razer",
    logo: "https://cdn.simpleicons.org/razer/00FF00",
    color: "#00FF00"
  },
  {
    name: "Logitech",
    slug: "logitech",
    logo: "https://cdn.simpleicons.org/logitech/00B8FC",
    color: "#00B8FC"
  },
  {
    name: "PlayStation",
    slug: "playstation",
    logo: "https://cdn.simpleicons.org/playstation/003791",
    color: "#003791"
  },
  {
    name: "Xbox",
    slug: "xbox",
    logo: "https://cdn.simpleicons.org/xbox/107C10",
    color: "#107C10"
  },
  {
    name: "Nintendo",
    slug: "nintendo",
    logo: "https://cdn.simpleicons.org/nintendo/E60012",
    color: "#E60012"
  },
  {
    name: "Steam",
    slug: "steam",
    logo: "https://cdn.simpleicons.org/steam/000000",
    color: "#000000"
  },
  {
    name: "Canon",
    slug: "canon",
    logo: "https://cdn.simpleicons.org/canon/BC0024",
    color: "#BC0024"
  },
  {
    name: "Nikon",
    slug: "nikon",
    logo: "https://cdn.simpleicons.org/nikon/FFE100",
    color: "#FFE100"
  },
  {
    name: "IKEA",
    slug: "ikea",
    logo: "https://cdn.simpleicons.org/ikea/0058A3",
    color: "#0058A3"
  },
  {
    name: "Philips",
    slug: "philips",
    logo: "https://cdn.simpleicons.org/philipshue/0065D3",
    color: "#0065D3"
  },
  {
    name: "Dyson",
    slug: "dyson",
    logo: "https://cdn.simpleicons.org/dyson/FF0098",
    color: "#FF0098"
  },
  {
    name: "Beats",
    slug: "beats",
    logo: "https://cdn.simpleicons.org/beats/E01F3D",
    color: "#E01F3D"
  }
]

interface BrandCirclesProps {
  locale?: string
}

export function BrandCircles({ locale = "en" }: BrandCirclesProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const checkScroll = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }, [])

  React.useEffect(() => {
    checkScroll()
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScroll)
      window.addEventListener("resize", checkScroll)
      return () => {
        scrollElement.removeEventListener("scroll", checkScroll)
        window.removeEventListener("resize", checkScroll)
      }
    }
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      })
    }
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
          <h2 className="font-bold text-foreground text-base sm:text-lg">
            {locale === "bg" ? "Популярни марки" : "Popular Brands"}
          </h2>
          {/* See all - Desktop: next to title */}
          <Link 
            href="/brands" 
            className="hidden sm:flex text-brand-blue hover:underline text-sm font-medium items-center gap-0.5"
          >
            {locale === "bg" ? "Виж всички" : "See all"}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {/* Scroll buttons - Desktop only */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              className={cn(
                "size-8 flex items-center justify-center rounded-full border border-border bg-white hover:bg-muted",
                !canScrollLeft && "opacity-40 pointer-events-none"
              )}
              aria-label="Scroll left"
            >
              <CaretLeft size={16} weight="regular" className="text-foreground" />
            </button>
            <button
              onClick={() => scroll("right")}
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
            href="/brands" 
            className="sm:hidden text-brand-blue hover:underline text-xs font-medium flex items-center gap-0.5"
          >
            {locale === "bg" ? "Виж всички" : "See all"}
            <CaretRight size={14} weight="regular" />
          </Link>
        </div>
      </div>
      
      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className={cn(
          "flex overflow-x-auto scrollbar-hide snap-x-mandatory scroll-smooth",
          // Mobile: Safe area padding
          "gap-4 pl-4 pb-2 scroll-pl-4",
          // Desktop: Better spacing
          "sm:gap-5 sm:pl-5 sm:pb-3 sm:scroll-pl-5"
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {brands.map((brand, index) => (
          <Link
            key={brand.slug}
            href={`/search?brand=${brand.slug}`}
            className={cn(
              "flex flex-col items-center gap-1.5 sm:gap-2 min-w-[72px] sm:min-w-[88px] md:min-w-[96px] group snap-start shrink-0",
              // Add right padding to last item
              index === brands.length - 1 && "mr-4 sm:mr-5"
            )}
          >
            {/* Circle with brand logo */}
            <div
              className={cn(
                "rounded-full flex items-center justify-center p-3 sm:p-4",
                // Mobile: Clean circle
                "size-16 bg-white border border-border",
                // Desktop: Larger
                "sm:size-20 md:size-[88px]"
              )}
            >
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  // Fallback to text if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `<span class="text-xs font-bold text-muted-foreground">${brand.name}</span>`;
                }}
              />
            </div>
            
            {/* Brand Name */}
            <span className={cn(
              "font-medium text-center line-clamp-1",
              // Mobile: Compact text
              "text-[11px] text-muted-foreground max-w-[72px]",
              // Desktop: Standard sizing with hover underline
              "sm:text-xs md:text-sm sm:text-foreground sm:max-w-[88px] md:max-w-[96px]",
              "group-hover:text-link group-hover:underline"
            )}>
              {brand.name}
            </span>
          </Link>
        ))}
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
