"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import { ChevronRight } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"

interface HeroCarouselProps {
  locale?: string
}

export function HeroCarousel({ locale = "en" }: HeroCarouselProps) {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }) as any)
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const slides = [
    {
      id: 1,
      title: locale === "bg" ? "Черен петък" : "Black Friday",
      cta: locale === "bg" ? "Пазарувай сега" : "Shop now",
      link: "/todays-deals",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-black/70 via-black/40 to-black/20",
      accent: "bg-rose-600",
    },
    {
      id: 2,
      title: locale === "bg" ? "Технологични оферти" : "Tech Deals",
      cta: locale === "bg" ? "Виж офертите" : "See deals",
      link: "/search?category=electronics",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-slate-900/80 via-slate-900/50 to-slate-900/20",
      accent: "bg-blue-600",
    },
    {
      id: 3,
      title: locale === "bg" ? "Дом и градина" : "Home & Garden",
      cta: locale === "bg" ? "Открий повече" : "Discover more",
      link: "/search?category=home",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop",
      gradient: "from-emerald-900/70 via-emerald-900/40 to-emerald-900/20",
      accent: "bg-emerald-600",
    },
    {
      id: 4,
      title: locale === "bg" ? "Безплатна доставка" : "Free Delivery",
      cta: locale === "bg" ? "Научи повече" : "Learn more",
      link: "/customer-service",
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-indigo-900/75 via-indigo-900/45 to-indigo-900/20",
      accent: "bg-indigo-600",
    },
  ]

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <div className="relative w-full container-bleed group overflow-hidden hero-carousel">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
          dragFree: false,
          watchDrag: true,
          axis: "x",
        }}
        setApi={setApi}
      >
        <CarouselContent className="ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative h-[150px] sm:h-[200px] md:h-[300px] lg:h-[380px] w-full overflow-hidden select-none">
                {/* Background Image */}
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={slide.id === 1}
                  className="object-cover object-center sm:object-top pointer-events-none"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1500px"
                  draggable={false}
                />

                {/* Left gradient overlay for text readability */}
                <div className={`absolute inset-0 bg-linear-to-r ${slide.gradient}`} />
                
                {/* Bottom fade for content overlap - Amazon style */}
                {/* Mobile: fade to white to match category card, Desktop: fade to slate-100 */}
                <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-32 md:h-40 bg-linear-to-t from-white via-white/70 to-transparent sm:from-slate-100 sm:via-slate-100/70" />

                {/* Text Content - centered on mobile, left-positioned on desktop */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 sm:px-0 sm:translate-y-0 sm:top-8 md:top-12 lg:top-16 sm:left-16 md:left-20 lg:left-24 z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3 drop-shadow-lg leading-tight">
                    {slide.title}
                  </h2>
                  
                  {/* CTA Button */}
                  <Link 
                    href={slide.link}
                    className={`inline-flex items-center gap-1 sm:gap-2 ${slide.accent} hover:brightness-110 text-white font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded transition-all text-xs sm:text-sm tap-transparent active-scale`}
                  >
                    {slide.cta}
                    <ChevronRight className="size-3.5 sm:size-4" />
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Buttons - Tall transparent buttons on sides */}
        <CarouselPrevious 
          className="left-1 md:left-2 w-10 md:w-14 lg:w-16 h-20 md:h-32 lg:h-40 rounded-md border-0 bg-transparent hover:bg-black/20 text-white/60 hover:text-white top-4 md:top-6 translate-y-0 [&>svg]:size-6 md:[&>svg]:size-8 hidden sm:flex"
        />
        <CarouselNext 
          className="right-1 md:right-2 w-10 md:w-14 lg:w-16 h-20 md:h-32 lg:h-40 rounded-md border-0 bg-transparent hover:bg-black/20 text-white/60 hover:text-white top-4 md:top-6 translate-y-0 [&>svg]:size-6 md:[&>svg]:size-8 hidden sm:flex"
        />
      </Carousel>

      {/* Mobile Dot Indicators */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-20 md:hidden">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "size-2 rounded-full tap-transparent",
              current === index 
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
