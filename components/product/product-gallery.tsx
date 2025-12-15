"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Heart,
  CaretLeft,
  CaretRight,
  MagnifyingGlassPlus,
  X,
} from "@phosphor-icons/react"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  title: string
  watchCount?: number
  isWatching?: boolean
  onWatchlistToggle?: () => void
  isWatchlistPending?: boolean
  t: {
    enlarge: string
    addToWatchlist: string
    removeFromWatchlist: string
    previousImage: string
    nextImage: string
    imagePreview: string
    picture: string
    of: string
    clickToEnlarge: string
  }
}

export function ProductGallery({
  images,
  title,
  watchCount = 0,
  isWatching = false,
  onWatchlistToggle,
  isWatchlistPending = false,
  t
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  // Keyboard navigation for zoom modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomOpen) return
      if (e.key === 'ArrowLeft') {
        setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)
      }
      if (e.key === 'ArrowRight') {
        setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)
      }
      if (e.key === 'Escape') {
        setIsZoomOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isZoomOpen, images.length])

  const displayImages = images?.length > 0 ? images : ["/placeholder.svg"]

  return (
    <div className="relative overflow-hidden -mx-4 lg:mx-0 lg:border-r lg:border-border/50">
      {/* Container for thumbnails + main image */}
      <div className="flex">
        {/* Vertical Thumbnails (Desktop) - Inside the container */}
        <div className="hidden lg:flex flex-col gap-2 p-3">
          {displayImages.slice(0, 7).map((img, index) => (
            <button
              key={index}
              onMouseEnter={() => setSelectedImage(index)}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "w-16 h-16 overflow-hidden rounded-lg shrink-0 transition-opacity",
                selectedImage === index 
                  ? "opacity-100" 
                  : "opacity-40 hover:opacity-70"
              )}
            >
              <Image 
                src={img} 
                alt={`View ${index + 1}`} 
                width={64}
                height={64}
                className="object-contain w-full h-full" 
              />
            </button>
          ))}
        </div>
        
        {/* Main Image Area */}
        <div className="flex-1 relative min-h-[320px] sm:min-h-[400px] lg:min-h-[600px]">
          
          {/* Top Right Actions - Vertical stack on mobile, horizontal on desktop */}
          <div className="absolute top-2 sm:top-3 right-4 lg:right-3 z-10 flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsZoomOpen(true)}
                  aria-label={t.enlarge}
                  className="w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full touch-manipulation"
                >
                  <MagnifyingGlassPlus className="w-5 h-5 text-foreground/70" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{t.enlarge}</p>
              </TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-1 bg-white/80 hover:bg-white rounded-full px-2 py-1">
              <span className="text-xs font-medium text-muted-foreground">{watchCount}</span>
              <button 
                onClick={onWatchlistToggle}
                disabled={isWatchlistPending}
                aria-label={isWatching ? t.removeFromWatchlist : t.addToWatchlist}
                aria-pressed={isWatching}
                className={cn("w-7 h-7 flex items-center justify-center touch-manipulation", isWatchlistPending && "opacity-50")}
              >
                <Heart 
                  className={cn("w-5 h-5", isWatching ? "fill-deal text-deal" : "text-foreground/70")} 
                  weight={isWatching ? "fill" : "regular"}
                />
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                aria-label={t.previousImage}
                className="absolute left-4 lg:left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-white/80 lg:bg-white/90 hover:bg-white lg:border lg:border-border rounded-full lg:shadow-sm touch-manipulation"
                onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : displayImages.length - 1)}
              >
                <CaretLeft className="w-6 h-6" />
              </button>
              <button
                aria-label={t.nextImage}
                className="absolute right-4 lg:right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center bg-white/80 lg:bg-white/90 hover:bg-white lg:border lg:border-border rounded-full lg:shadow-sm touch-manipulation"
                onClick={() => setSelectedImage(prev => prev < displayImages.length - 1 ? prev + 1 : 0)}
              >
                <CaretRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div className="w-full bg-white dark:bg-muted/20 overflow-hidden">
            <div 
              className="w-full min-h-[280px] sm:min-h-[360px] lg:min-h-[550px] relative cursor-zoom-in"
              onClick={() => setIsZoomOpen(true)}
              onKeyDown={(e) => e.key === 'Enter' && setIsZoomOpen(true)}
              role="button"
              tabIndex={0}
              aria-label={t.clickToEnlarge}
            >
              <Image
                src={displayImages[selectedImage]}
                alt={title}
                fill
                className="object-contain p-3 sm:p-4 lg:p-8"
                sizes="(max-width: 1024px) 100vw, 700px"
                priority
              />
              {/* Image Counter */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded">
                  {t.picture} {selectedImage + 1} {t.of} {displayImages.length}
                </div>
              )}
            </div>

            {/* Mobile Thumbnails */}
            <div className="lg:hidden flex gap-2 overflow-x-auto py-2 px-4 snap-x snap-mandatory no-scrollbar bg-background">
              {displayImages.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setSelectedImage(index); }}
                  className={cn(
                    "shrink-0 w-16 h-16 overflow-hidden bg-white rounded-lg snap-start touch-manipulation border",
                    selectedImage === index 
                      ? "opacity-100 border-primary" 
                      : "opacity-60 border-transparent hover:opacity-90"
                  )}
                >
                  <Image src={img} alt={`View ${index + 1}`} width={64} height={64} className="object-contain w-full h-full p-0.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-white dark:bg-background">
          <DialogTitle className="sr-only">
            {t.imagePreview}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {title} - {t.picture} {selectedImage + 1} {t.of} {displayImages.length}
          </DialogDescription>
          <DialogClose className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-black rounded-full">
            <X className="w-5 h-5 text-white" weight="bold" />
          </DialogClose>
          <div className="relative w-full h-[85vh] flex items-center justify-center">
            {displayImages.length > 1 && (
              <>
                <button
                  aria-label={t.previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-black rounded-full"
                  onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : displayImages.length - 1)}
                >
                  <CaretLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  aria-label={t.nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-black rounded-full"
                  onClick={() => setSelectedImage(prev => prev < displayImages.length - 1 ? prev + 1 : 0)}
                >
                  <CaretRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
            <Image
              src={displayImages[selectedImage]}
              alt={title}
              fill
              className="object-contain p-4"
              sizes="95vw"
              priority
            />
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm font-medium px-4 py-2 rounded-full">
                {selectedImage + 1} / {displayImages.length}
              </div>
            )}
          </div>
          {displayImages.length > 1 && (
            <div className="flex gap-2 justify-center py-4 px-4 border-t bg-muted/30">
              {displayImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "w-16 h-16 border-2 overflow-hidden bg-white transition-colors rounded",
                    selectedImage === index 
                      ? "border-primary" 
                      : "border-transparent hover:border-muted-foreground/50"
                  )}
                >
                  <Image src={img} alt={`View ${index + 1}`} width={64} height={64} className="object-contain w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
