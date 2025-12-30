"use client";

import { useEffect, useRef, useState } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import { ZoomIn } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Magnifier } from "./magnifier";

interface ProductGalleryHybridProps {
  images: Array<{
    alt: string;
    width: number;
    height: number;
    srcset?: string;
    src: string;
    sizes?: string;
  }>;
  galleryID?: string;
}

export function ProductGalleryHybrid({ images, galleryID = "product-gallery" }: ProductGalleryHybridProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: "#" + galleryID,
      children: "a",
      bgOpacity: 1,
      wheelToZoom: true,
      arrowPrev: false,
      arrowNext: false,
      close: false,
      zoom: false,
      counter: false,
      mainClass: "[&>div:first-child]:!bg-background",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.init();
    lightboxRef.current = lightbox;
    return () => lightbox.destroy();
  }, [galleryID]);

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

  return (
    <div className="flex flex-col gap-3 w-full lg:max-w-[600px]">
      {/* Main Image Container */}
      <div 
        className="w-full overflow-hidden lg:rounded-xl lg:border lg:border-border bg-white dark:bg-muted/10 relative group aspect-square lg:max-h-[400px]" 
        id={galleryID}
      >
        {/* Carousel Area */}
        <div className="relative size-full">
          <Carousel setApi={setApi} className="size-full">
            <CarouselContent className="size-full">
              {images.map((img, index) => (
                <CarouselItem key={index} className="size-full">
                  <div className="size-full flex items-center justify-center lg:p-8">
                    <a
                      href={img.src}
                      data-pswp-width={img.width}
                      data-pswp-height={img.height}
                      target="_blank"
                      rel="noreferrer"
                      className="size-full flex items-center justify-center"
                    >
                      <Magnifier
                        src={img.src}
                        alt={img.alt}
                        width={img.width}
                        height={img.height}
                        className="size-full object-contain"
                      />
                    </a>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Zoom Button - Desktop only, no hover animation per design system */}
          <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hidden lg:flex">
             <Button
               type="button"
               aria-label="Open image zoom"
               size="icon"
               variant="secondary"
               className="h-10 w-10 rounded-full bg-background/90 hover:bg-background border border-border"
               onClick={() => lightboxRef.current?.loadAndOpen(current)}
             >
                <ZoomIn className="h-5 w-5 text-foreground" />
             </Button>
          </div>

          {/* Mobile Navigation Arrows (WCAG 2.5.7 - alternative to swipe) */}
          {images.length > 1 && (
            <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 z-10 flex justify-between pointer-events-none lg:hidden">
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
                disabled={current === images.length - 1}
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}

          {/* Mobile Dots Indicator - WCAG 2.2 AA compliant with 24px touch area */}
          <div className="absolute bottom-3 left-0 right-0 z-10 lg:hidden flex justify-center gap-2">
            {images.map((_, index) => (
              <button 
                key={index}
                type="button"
                aria-label={`Go to image ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "min-w-[24px] min-h-[24px] flex items-center justify-center",
                  "before:h-2 before:rounded-full before:transition-all before:duration-300",
                  current === index ? "before:w-4 before:bg-primary" : "before:w-2 before:bg-primary/30 hover:before:bg-primary/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnails Grid (Below main image - like reference design) */}
      <div className="hidden lg:grid grid-cols-4 gap-2 h-20 sm:h-24 lg:h-28">
        {images.slice(0, 4).map((img, index) => (
          <button
            key={index}
            className={cn(
              "cursor-pointer overflow-hidden rounded-lg border transition-all bg-card relative",
              current === index 
                ? "ring-2 ring-foreground border-transparent" 
                : "border-border/50 hover:ring-2 hover:ring-foreground/50"
            )}
            onClick={() => api?.scrollTo(index)}
            onMouseEnter={() => api?.scrollTo(index)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 20vw, 112px"
            />
          </button>
        ))}
        {images.length > 4 && (
          <button
            className="rounded-lg border border-border/50 bg-muted/30 hover:ring-2 hover:ring-foreground/50 flex items-center justify-center transition-all group"
            onClick={() => lightboxRef.current?.loadAndOpen(4)}
          >
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
              +{images.length - 4} more
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
