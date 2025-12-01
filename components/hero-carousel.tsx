"use client"

import * as React from "react"
import Image from "next/image"
import { CaretRight, CaretLeft } from "@phosphor-icons/react"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { heroBlurDataURL } from "@/lib/image-utils"

interface HeroCarouselProps {
  locale?: string
}

/**
 * Hero Carousel using native CSS scroll-snap
 * No external carousel library (embla) - follows audit plan
 */
export function HeroCarousel({ locale = "en" }: HeroCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const autoplayRef = React.useRef<NodeJS.Timeout | null>(null)

  const slides = [
    {
      id: 1,
      title: locale === "bg" ? "Черен петък" : "Black Friday",
      cta: locale === "bg" ? "Пазарувай сега" : "Shop now",
      link: "/todays-deals",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-black/70 via-black/40 to-black/20",
      accent: "bg-badge-deal",
    },
    {
      id: 2,
      title: locale === "bg" ? "Технологични оферти" : "Tech Deals",
      cta: locale === "bg" ? "Виж офертите" : "See deals",
      link: "/search?category=electronics",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-slate-900/80 via-slate-900/50 to-slate-900/20",
      accent: "bg-interactive",
    },
    {
      id: 3,
      title: locale === "bg" ? "Дом и градина" : "Home & Garden",
      cta: locale === "bg" ? "Открий повече" : "Discover more",
      link: "/search?category=home",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop",
      gradient: "from-emerald-900/70 via-emerald-900/40 to-emerald-900/20",
      accent: "bg-interactive",
    },
    {
      id: 4,
      title: locale === "bg" ? "Безплатна доставка" : "Free Delivery",
      cta: locale === "bg" ? "Научи повече" : "Learn more",
      link: "/customer-service",
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-indigo-900/75 via-indigo-900/45 to-indigo-900/20",
      accent: "bg-interactive",
    },
  ]

  // Handle scroll to detect current slide
  const handleScroll = React.useCallback(() => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const slideWidth = container.clientWidth
    const scrollPosition = container.scrollLeft
    const newSlide = Math.round(scrollPosition / slideWidth)
    setCurrentSlide(newSlide)
  }, [])

  // Scroll to specific slide
  const scrollToSlide = React.useCallback((index: number) => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const slideWidth = container.clientWidth
    container.scrollTo({
      left: slideWidth * index,
      behavior: "smooth"
    })
  }, [])

  // Navigate to next/previous slide with loop
  const nextSlide = React.useCallback(() => {
    const next = (currentSlide + 1) % slides.length
    scrollToSlide(next)
  }, [currentSlide, slides.length, scrollToSlide])

  const prevSlide = React.useCallback(() => {
    const prev = (currentSlide - 1 + slides.length) % slides.length
    scrollToSlide(prev)
  }, [currentSlide, slides.length, scrollToSlide])

  // Autoplay functionality
  const startAutoplay = React.useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    autoplayRef.current = setInterval(() => {
      nextSlide()
    }, 5000)
  }, [nextSlide])

  const stopAutoplay = React.useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }, [])

  // Setup autoplay on mount
  React.useEffect(() => {
    startAutoplay()
    return () => stopAutoplay()
  }, [startAutoplay, stopAutoplay])

  return (
    <div 
      className="relative w-full container group overflow-hidden hero-carousel"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      {/* CSS Scroll-Snap Container - No external library */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id} 
            className="w-full shrink-0 snap-start snap-always"
          >
            <div className="relative h-[150px] sm:h-[200px] md:h-[300px] lg:h-[380px] w-full overflow-hidden select-none">
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={slide.id <= 2}
                fetchPriority={slide.id === 1 ? "high" : undefined}
                loading={slide.id <= 2 ? "eager" : "lazy"}
                className="object-cover object-center sm:object-top pointer-events-none"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1500px"
                draggable={false}
                placeholder="blur"
                blurDataURL={heroBlurDataURL()}
              />

              {/* Left gradient overlay for text readability */}
              <div className={`absolute inset-0 bg-linear-to-r ${slide.gradient}`} />
              
              {/* Bottom fade for content overlap */}
              <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 md:h-40 bg-linear-to-t from-white via-white/70 to-transparent sm:from-slate-100 sm:via-slate-100/70" />

              {/* Text Content */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 sm:px-0 sm:translate-y-0 sm:top-8 md:top-12 lg:top-16 sm:left-16 md:left-20 lg:left-24 z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-semibold text-white mb-2 md:mb-3 leading-tight">
                  {slide.title}
                </h2>
                
                <Link 
                  href={slide.link}
                  className={`inline-flex items-center gap-1 sm:gap-2 ${slide.accent} hover:brightness-110 text-white font-medium px-4 sm:px-5 py-2 sm:py-2.5 rounded-sm text-xs sm:text-sm tap-transparent`}
                >
                  {slide.cta}
                  <CaretRight size={14} weight="regular" className="sm:size-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Buttons - Desktop only */}
      <button
        onClick={prevSlide}
        className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 w-10 md:w-14 lg:w-16 h-20 md:h-32 lg:h-40 rounded-md border-0 bg-transparent hover:bg-black/20 text-white/60 hover:text-white hidden sm:flex items-center justify-center"
        aria-label="Previous slide"
      >
        <CaretLeft size={24} weight="regular" className="md:size-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 w-10 md:w-14 lg:w-16 h-20 md:h-32 lg:h-40 rounded-md border-0 bg-transparent hover:bg-black/20 text-white/60 hover:text-white hidden sm:flex items-center justify-center"
        aria-label="Next slide"
      >
        <CaretRight size={24} weight="regular" className="md:size-8" />
      </button>

      {/* Mobile Dot Indicators */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20 md:hidden">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={cn(
              "size-2 rounded-full tap-transparent transition-transform",
              currentSlide === index 
                ? "bg-white scale-125" 
                : "bg-white/50 hover:bg-white/75"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
