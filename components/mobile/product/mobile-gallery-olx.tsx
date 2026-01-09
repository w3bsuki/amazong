"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface GalleryImage {
  alt: string;
  width: number;
  height: number;
  srcset?: string;
  src: string;
  sizes?: string;
}

interface MobileGalleryOlxProps {
  images: GalleryImage[];
  className?: string;
}

/**
 * Mobile Gallery Component - OLX/Treido Style
 * 
 * Features:
 * - Full-bleed edge-to-edge images (no padding, no borders on mobile)
 * - Simple solid dot indicators (not pill-shaped)
 * - Swipe-only navigation (no arrow buttons)
 * - 4:3 aspect ratio for better product visibility
 * - Clean background
 */
export function MobileGalleryOlx({ 
  images, 
  className 
}: MobileGalleryOlxProps) {
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

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  if (!images || images.length === 0) {
    return (
      <div className={cn(
        "w-full aspect-[4/3] bg-muted flex items-center justify-center",
        className
      )}>
        <span className="text-sm text-muted-foreground">No image</span>
      </div>
    );
  }

  return (
    <div className={cn("w-full relative bg-card", className)}>
      {/* Main Carousel - Edge-to-edge, 4:3 aspect ratio */}
      <Carousel 
        setApi={setApi} 
        className="w-full"
        opts={{
          align: "start",
          loop: images.length > 1,
        }}
      >
        <CarouselContent className="-ml-0">
          {images.map((img, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative aspect-[4/3] bg-card">
                <Image
                  src={img.src}
                  alt={img.alt || `Product image ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority={index === 0}
                  quality={85}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dot Indicators - OLX Style (solid circles only) */}
      {images.length > 1 && (
        <div 
          className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5"
          role="tablist"
          aria-label="Gallery navigation"
        >
          {images.map((_, index) => (
            <button 
              key={index}
              type="button"
              role="tab"
              aria-selected={current === index}
              aria-label={`Go to image ${index + 1}`}
              onClick={() => scrollTo(index)}
              className={cn(
                // Base: 8px solid circle with touch-friendly hit area
                "size-2 rounded-full transition-colors duration-200",
                // Active: solid foreground, Inactive: semi-transparent
                current === index 
                  ? "bg-foreground" 
                  : "bg-foreground/30"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
