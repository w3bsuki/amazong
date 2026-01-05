"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

interface DemoGalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface DemoGalleryWithCounterProps {
  images: DemoGalleryImage[];
}

/**
 * Demo Gallery with Image Counter
 * 
 * IMPROVEMENT: Shows "1/5" counter badge so users know how many images exist
 * Also includes swipe + tap navigation per WCAG 2.5.7
 */
export function DemoGalleryWithCounter({ images }: DemoGalleryWithCounterProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const updateCurrent = () => setCurrent(api.selectedScrollSnap());
    updateCurrent();
    api.on("select", updateCurrent);
    return () => {
      api.off("select", updateCurrent);
    };
  }, [api]);

  if (!images || images.length === 0) return null;

  const total = images.length;

  return (
    <div className="w-full overflow-hidden bg-card relative aspect-[4/3]">
      {/* Carousel */}
      <Carousel setApi={setApi} className="h-full">
        <CarouselContent className="h-full -ml-0">
          {images.map((img, index) => (
            <CarouselItem key={index} className="h-full pl-0">
              <div className="h-full flex items-center justify-center">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  className="max-h-full max-w-full w-auto h-auto object-contain"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Image counter badge (NEW) */}
      {total > 1 && (
        <div className="absolute top-3 right-3 z-10 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
          {current + 1} / {total}
        </div>
      )}

      {/* Navigation arrows */}
      {total > 1 && (
        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 z-10 flex justify-between pointer-events-none">
          <Button
            type="button"
            aria-label="Previous image"
            size="icon"
            variant="secondary"
            className="size-8 rounded-full bg-background/80 hover:bg-background border border-border/50 pointer-events-auto disabled:opacity-30"
            onClick={() => api?.scrollPrev()}
            disabled={current === 0}
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <Button
            type="button"
            aria-label="Next image"
            size="icon"
            variant="secondary"
            className="size-8 rounded-full bg-background/80 hover:bg-background border border-border/50 pointer-events-auto disabled:opacity-30"
            onClick={() => api?.scrollNext()}
            disabled={current === total - 1}
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}

      {/* Dots indicator with 24px touch targets */}
      {total > 1 && (
        <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to image ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                "min-w-[24px] min-h-[24px] flex items-center justify-center",
                "before:h-2 before:rounded-full before:transition-all before:duration-150",
                current === index
                  ? "before:w-4 before:bg-primary"
                  : "before:w-2 before:bg-primary/30"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
