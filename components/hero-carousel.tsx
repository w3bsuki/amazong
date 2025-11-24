"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Link } from "@/i18n/routing"

interface HeroCarouselProps {
  locale?: string
}

export function HeroCarousel({ locale = "en" }: HeroCarouselProps) {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }) as any)

  const slides = [
    {
      id: 1,
      title: locale === "bg" ? "Черен петък" : "Black Friday",
      subtitle: locale === "bg" ? "До -70% на хиляди продукти" : "Up to 70% off on thousands of products",
      cta: locale === "bg" ? "Пазарувай сега" : "Shop now",
      link: "/todays-deals",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-black/70 via-black/50 to-transparent",
      accent: "bg-red-600",
    },
    {
      id: 2,
      title: locale === "bg" ? "Технологични оферти" : "Tech Deals",
      subtitle: locale === "bg" ? "Най-новата електроника на невероятни цени" : "Latest electronics at amazing prices",
      cta: locale === "bg" ? "Виж офертите" : "See deals",
      link: "/search?category=electronics",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop",
      gradient: "from-blue-900/80 via-blue-900/50 to-transparent",
      accent: "bg-blue-500",
    },
    {
      id: 3,
      title: locale === "bg" ? "Дом и градина" : "Home & Garden",
      subtitle: locale === "bg" ? "Всичко за уютния дом" : "Everything for a cozy home",
      cta: locale === "bg" ? "Открий повече" : "Discover more",
      link: "/search?category=home",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-emerald-900/80 via-emerald-900/50 to-transparent",
      accent: "bg-emerald-500",
    },
    {
      id: 4,
      title: locale === "bg" ? "Безплатна доставка" : "Free Delivery",
      subtitle: locale === "bg" ? "За поръчки над 50 лв. в цяла България" : "On orders over €25 nationwide",
      cta: locale === "bg" ? "Научи повече" : "Learn more",
      link: "/customer-service",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
      gradient: "from-amber-900/80 via-amber-900/50 to-transparent",
      accent: "bg-amber-500",
    },
  ]

  return (
    <div className="relative w-full max-w-[1500px] mx-auto">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />

                {/* Gradient Overlay for text readability */}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
                
                {/* Bottom Gradient Overlay for category cards */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-50 via-transparent to-transparent" />

                {/* Text Content */}
                <div className="absolute top-1/4 left-6 md:left-16 max-w-xl z-10">
                  {/* Accent Badge */}
                  <div className={`inline-block ${slide.accent} px-3 py-1 rounded-full mb-4`}>
                    <span className="text-white text-sm font-semibold">
                      {slide.id === 1 ? "🔥 " : slide.id === 2 ? "💻 " : slide.id === 3 ? "🏡 " : "🚚 "}
                      {locale === "bg" ? "Промоция" : "Promo"}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg">
                    {slide.title}
                  </h2>
                  
                  {/* Subtitle */}
                  <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow-md max-w-md">
                    {slide.subtitle}
                  </p>
                  
                  {/* CTA Button */}
                  <Link 
                    href={slide.link}
                    className={`inline-flex items-center gap-2 ${slide.accent} hover:opacity-80 text-white font-bold px-6 py-3 rounded-lg shadow border-2 border-transparent hover:border-white`}
                  >
                    {slide.cta}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 md:left-4 h-[100px] md:h-[250px] w-12 md:w-20 rounded-lg border-2 border-transparent hover:border-white focus:ring-2 focus:ring-[#008296] bg-transparent hover:bg-transparent text-white/70 hover:text-white top-0 bottom-0 my-auto translate-y-0" />
        <CarouselNext className="right-2 md:right-4 h-[100px] md:h-[250px] w-12 md:w-20 rounded-lg border-2 border-transparent hover:border-white focus:ring-2 focus:ring-[#008296] bg-transparent hover:bg-transparent text-white/70 hover:text-white top-0 bottom-0 my-auto translate-y-0" />
      </Carousel>
    </div>
  )
}
