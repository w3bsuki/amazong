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
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-form w-full items-start">
        {/* Thumbnails (Left side on desktop, bottom on mobile) */}
        <div className="flex flex-row lg:flex-col gap-3 order-2 lg:order-1 overflow-x-auto lg:overflow-y-auto no-scrollbar py-2">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onMouseEnter={() => setSelectedImage(index)}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "size-16 lg:size-20 overflow-hidden rounded-lg shrink-0 border-2 transition-all bg-background aspect-square",
                selectedImage === index 
                  ? "opacity-100 border-primary shadow-sm" 
                  : "opacity-60 hover:opacity-100 border-transparent hover:border-border"
              )}
            >
              <Image 
                src={img} 
                alt={`View ${index + 1}`} 
                width={80}
                height={80}
                className="object-contain w-full h-full p-1" 
              />
            </button>
          ))}
        </div>

        {/* Main Image Area */}
        <div className="order-1 lg:order-2 relative aspect-square w-full max-h-[80vh] overflow-hidden bg-white dark:bg-muted/20">
          
          {/* Top Right Actions - Desktop only (mobile uses bottom bar) */}
          <div className="absolute top-3 right-3 z-10 hidden lg:flex flex-col items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setIsZoomOpen(true)}
                  aria-label={t.enlarge}
                  className="size-10 flex items-center justify-center bg-background border rounded-full transition-colors hover:bg-accent touch-manipulation"
                >
                  <MagnifyingGlassPlus className="size-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{t.enlarge}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={onWatchlistToggle}
                  disabled={isWatchlistPending}
                  aria-label={isWatching ? t.removeFromWatchlist : t.addToWatchlist}
                  aria-pressed={isWatching}
                  className={cn(
                    "size-10 flex items-center justify-center bg-background border rounded-full transition-colors hover:bg-accent touch-manipulation",
                    isWatchlistPending && "opacity-50"
                  )}
                >
                  <Heart 
                    className={cn("size-5", isWatching ? "fill-destructive text-destructive" : "")} 
                    weight={isWatching ? "fill" : "regular"}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <div className="flex items-center gap-1.5">
                  <span>{isWatching ? t.removeFromWatchlist : t.addToWatchlist}</span>
                  {watchCount > 0 && <span className="text-muted-foreground">({watchCount})</span>}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Navigation Arrows - Clean rounded circles */}
          {displayImages.length > 1 && (
            <>
              <button
                aria-label={t.previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 size-12 flex items-center justify-center bg-background border rounded-full transition-colors hover:bg-accent touch-manipulation"
                onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : displayImages.length - 1)}
              >
                <CaretLeft className="size-5" />
              </button>
              <button
                aria-label={t.nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 size-12 flex items-center justify-center bg-background border rounded-full transition-colors hover:bg-accent touch-manipulation"
                onClick={() => setSelectedImage(prev => prev < displayImages.length - 1 ? prev + 1 : 0)}
              >
                <CaretRight className="size-5" />
              </button>
            </>
          )}

          {/* Main Image */}
          <div 
            className="size-full relative cursor-zoom-in"
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
              className="object-contain p-form sm:p-form-lg lg:p-form-lg"
              sizes="(max-width: 1024px) 100vw, 700px"
              priority
            />
            {/* Image Counter */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold uppercase tracking-tight px-2.5 py-1 rounded-md">
                {t.picture} {selectedImage + 1} {t.of} {displayImages.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-white dark:bg-background rounded-lg">
          <DialogTitle className="sr-only">
            {t.imagePreview}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {title} - {t.picture} {selectedImage + 1} {t.of} {displayImages.length}
          </DialogDescription>
          <DialogClose className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-black hover:bg-black/90 rounded-md">
            <X className="w-5 h-5 text-white" weight="bold" />
          </DialogClose>
          <div className="relative w-full h-[85vh] flex items-center justify-center">
            {displayImages.length > 1 && (
              <>
                <button
                  aria-label={t.previousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-md"
                  onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : displayImages.length - 1)}
                >
                  <CaretLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  aria-label={t.nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-md"
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
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold uppercase tracking-tight px-4 py-2 rounded-md">
                {selectedImage + 1} / {displayImages.length}
              </div>
            )}
          </div>
          {displayImages.length > 1 && (
            <div className="flex gap-3 justify-center py-6 px-4 border-t bg-muted/30">
              {displayImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "size-20 border-2 overflow-hidden bg-white rounded-lg transition-all",
                    selectedImage === index 
                      ? "border-primary shadow-sm" 
                      : "border-transparent hover:border-muted-foreground/50"
                  )}
                >
                  <Image src={img} alt={`View ${index + 1}`} width={80} height={80} className="object-contain w-full h-full p-1" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
