"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export function HeroCarousel() {
  const plugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }) as any)

  const slides = [
    {
      id: 1,
      title: "New Arrivals",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
      color: "bg-emerald-900",
    },
    {
      id: 2,
      title: "Tech Deals",
      image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop",
      color: "bg-blue-900",
    },
    {
      id: 3,
      title: "Home & Garden",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2070&auto=format&fit=crop",
      color: "bg-orange-900",
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

                {/* Bottom Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />

                {/* Optional: Text Overlay for modernization */}
                {/* <div className="absolute top-1/4 left-10 md:left-20 max-w-xl text-white drop-shadow-md">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h2>
                </div> */}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 md:left-4 h-[100px] md:h-[250px] w-12 md:w-20 rounded-[4px] border-2 border-transparent hover:border-white focus:ring-2 focus:ring-[#008296] bg-transparent hover:bg-transparent text-white/70 hover:text-white top-0 bottom-0 my-auto translate-y-0 transition-all" />
        <CarouselNext className="right-2 md:right-4 h-[100px] md:h-[250px] w-12 md:w-20 rounded-[4px] border-2 border-transparent hover:border-white focus:ring-2 focus:ring-[#008296] bg-transparent hover:bg-transparent text-white/70 hover:text-white top-0 bottom-0 my-auto translate-y-0 transition-all" />
      </Carousel>
    </div>
  )
}
