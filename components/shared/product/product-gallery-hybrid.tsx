"use client";

import { useEffect, useRef, useState } from "react";
import PhotoSwipeLightbox, { PhotoSwipe } from "photoswipe/lightbox";
import "photoswipe/style.css";
import { ZoomIn } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-form w-full items-start">
      {/* Thumbnails (Left side on desktop, bottom on mobile) */}
      <div className="flex flex-row lg:flex-col gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-y-auto no-scrollbar py-2">
        {images.map((img, index) => (
          <button
            key={index}
            className={cn(
              "cursor-pointer overflow-hidden rounded-lg border-2 transition-all bg-background shrink-0 size-16 lg:size-20 aspect-square",
              current === index ? "border-primary shadow-sm" : "border-transparent hover:border-border"
            )}
            onClick={() => api?.scrollTo(index)}
            onMouseEnter={() => api?.scrollTo(index)}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="size-full object-contain p-1"
            />
          </button>
        ))}
      </div>

      {/* Main Image Container */}
      <div 
        className="order-1 lg:order-2 min-w-0 w-full overflow-hidden rounded-2xl bg-muted relative group aspect-square max-h-[80vh]" 
        id={galleryID}
      >
        {/* Carousel Area */}
        <div className="relative size-full">
          <Carousel setApi={setApi} className="size-full">
            <CarouselContent className="size-full">
              {images.map((img, index) => (
                <CarouselItem key={index} className="size-full">
                  <div className="size-full p-form flex items-center justify-center">
                    <a
                      href={img.src}
                      data-pswp-width={img.width}
                      data-pswp-height={img.height}
                      target="_blank"
                      rel="noreferrer"
                      className="size-full flex items-center justify-center"
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                      />
                    </a>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Zoom Button */}
          <div className="absolute bottom-4 right-4 z-10">
             <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full bg-background shadow-md hover:bg-muted/50">
                <ZoomIn className="h-5 w-5 text-foreground" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
