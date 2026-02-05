import * as React from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { SectionHeader } from "@/components/home/section-header"
import { ProductCard, type Product } from "@/components/product/product-card"

export function PromotedCarousel({ items }: { items: Product[] }) {
  return (
    <section className="mt-3">
      <SectionHeader title="Promoted" href="/promoted" />
      <div className="mt-3">
        <Carousel opts={{ align: "start" }}>
          <CarouselContent className="-ml-4">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-4 basis-[82%] sm:basis-[60%] lg:basis-[40%]"
              >
                <ProductCard product={{ ...item, isPromoted: true }} variant="promoted" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
