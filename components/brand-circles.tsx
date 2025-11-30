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
  fallbackLogo?: string // Optional fallback SVG data URI
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
    color: "#107C10",
    // Fallback if SimpleIcons doesn't have it
    fallbackLogo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23107C10'%3E%3Cpath d='M4.102 21.033A11.947 11.947 0 0 0 12 24a11.947 11.947 0 0 0 7.898-2.967c1.012-1.482.612-4.887-.918-8.161-2.253-4.783-4.457-7.46-6.98-7.46s-4.727 2.677-6.98 7.46c-1.53 3.274-1.93 6.679-.918 8.161zM12 2.25c1.547 0 2.953.578 4.031 1.531-1.875 1.641-3.047 3.516-4.031 5.344-.984-1.828-2.156-3.703-4.031-5.344A6.706 6.706 0 0 1 12 2.25zm-9.75 9.75c0-2.062.656-3.969 1.781-5.531 2.344 2.156 3.844 4.312 4.969 6.562-1.875 3.75-2.531 7.031-1.875 8.438A9.708 9.708 0 0 1 2.25 12zm19.5 0a9.708 9.708 0 0 1-4.875 8.469c.656-1.407 0-4.688-1.875-8.438 1.125-2.25 2.625-4.406 4.969-6.562A9.681 9.681 0 0 1 21.75 12z'/%3E%3C/svg%3E"
  },
  {
    name: "Nintendo",
    slug: "nintendo",
    logo: "https://cdn.simpleicons.org/nintendo/E60012",
    color: "#E60012",
    // Fallback SVG
    fallbackLogo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E60012'%3E%3Cpath d='M5.7 0C2.556 0 0 2.556 0 5.7v12.6C0 21.444 2.556 24 5.7 24h12.6c3.144 0 5.7-2.556 5.7-5.7V5.7C24 2.556 21.444 0 18.3 0H5.7zm1.003 4.497h2.694c.3 0 .537.237.537.537v9.436c0 .3-.237.534-.537.534H6.703c-.297 0-.534-.234-.534-.534V5.034c0-.3.237-.537.534-.537zm7.8 0h2.694c.3 0 .537.237.537.537v9.436c0 .3-.237.534-.537.534H14.503c-.297 0-.534-.234-.534-.534V5.034c0-.3.237-.537.534-.537z'/%3E%3C/svg%3E"
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
    color: "#BC0024",
    // Fallback SVG
    fallbackLogo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23BC0024'%3E%3Cpath d='M12 5.531c-3.578 0-6.469 2.891-6.469 6.469S8.422 18.469 12 18.469 18.469 15.578 18.469 12 15.578 5.531 12 5.531zm0 10.688c-2.328 0-4.219-1.891-4.219-4.219S9.672 7.781 12 7.781 16.219 9.672 16.219 12 14.328 16.219 12 16.219zM12 0C5.381 0 0 5.381 0 12s5.381 12 12 12 12-5.381 12-12S18.619 0 12 0zm0 21.656c-5.328 0-9.656-4.328-9.656-9.656S6.672 2.344 12 2.344 21.656 6.672 21.656 12 17.328 21.656 12 21.656z'/%3E%3C/svg%3E"
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
                  // Try fallback logo first, then show text
                  const target = e.target as HTMLImageElement;
                  if (brand.fallbackLogo && target.src !== brand.fallbackLogo) {
                    target.src = brand.fallbackLogo;
                  } else {
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<span class="text-xs font-bold text-muted-foreground">${brand.name}</span>`;
                  }
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
