"use client"


import Image from "next/image";
import { Search as MagnifyingGlassPlus, Star, Trash, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ProductImage } from "@/lib/sell/schema";
import { useTranslations } from "next-intl";

interface PhotoThumbnailProps {
  image: ProductImage;
  index: number;
  isCover: boolean;
  variant?: "grid" | "row";
  onRemove: () => void;
  onSetCover: () => void;
  onPreview: () => void;
  isDragging: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

/**
 * PhotoThumbnail - Draggable photo thumbnail with actions
 * 
 * Displays a product image with:
 * - Cover badge for primary image
 * - Position number
 * - Hover overlay with preview/delete buttons
 * - Drag handle for reordering
 */
export function PhotoThumbnail({
  image,
  index,
  isCover,
  variant = "grid",
  onRemove,
  onSetCover,
  onPreview,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
}: PhotoThumbnailProps) {
  const tSell = useTranslations("Sell");
  const tCommon = useTranslations("Common");
  const isRow = variant === "row"

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onClick={onPreview}
      className={cn(
        "group relative overflow-hidden border bg-muted transition-colors",
        isRow ? "h-20 w-20 shrink-0 rounded-xl" : "aspect-square rounded-md",
        isDragging 
          ? "border-selected-border border-dashed opacity-50 scale-95" 
          : "border-border-subtle hover:border-hover-border",
        "cursor-grab active:cursor-grabbing touch-manipulation"
      )}
    >
      <Image
        src={image.thumbnailUrl || image.url}
        alt={tSell("photos.photoAlt", { index: index + 1 })}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 25vw, 150px"
      />

      {/* Cover Badge - Top left */}
      {isCover && (
        <div className={cn("absolute z-10", isRow ? "bottom-1 left-1" : "top-1.5 left-1.5")}>
          {isRow ? (
            <span className="rounded bg-surface-overlay px-1 py-0.5 text-2xs font-semibold text-overlay-text">
              {tSell("photos.cover")}
            </span>
          ) : (
            <Badge
              variant="secondary"
              className="px-1.5 py-0 gap-1 font-bold text-2xs uppercase tracking-wider bg-background text-primary border-none shadow-sm h-5"
            >
              <Star className="size-2" />
              {tSell("photos.cover")}
            </Badge>
          )}
        </div>
      )}

      {/* Delete Button - Top right, always visible on mobile for better UX */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className={cn(
          "absolute z-10 p-1 rounded-full bg-background text-destructive shadow-sm hover:bg-destructive hover:text-destructive-foreground transition-colors",
          isRow ? "top-1 right-1" : "top-1.5 right-1.5"
        )}
        aria-label={tCommon("delete")}
        title={tCommon("delete")}
      >
        {isRow ? <X className="size-3.5" /> : <Trash className="size-3" />}
      </button>

      {/* Position Number - Bottom left */}
      {!isRow && (
        <div className="absolute bottom-1.5 left-1.5 bg-surface-overlay text-overlay-text text-2xs font-bold px-1 py-0.5 rounded-md">
          {index + 1}
        </div>
      )}

      {/* Hover Overlay - Desktop only */}
      <div className="absolute inset-0 bg-transparent group-hover:bg-surface-overlay transition-colors hidden sm:block">
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
            className="p-2 rounded-full bg-background text-foreground shadow-sm"
            aria-label={tCommon("viewAll")}
            title={tCommon("viewAll")}
          >
            <MagnifyingGlassPlus className="size-4" />
          </button>
        </div>
      </div>

      {/* Set as Cover Button - Bottom right (if not cover) */}
      {!isCover && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onSetCover(); }}
          className="absolute bottom-1.5 right-1.5 z-10 p-1 rounded-full bg-background text-primary shadow-sm hover:bg-primary hover:text-primary-foreground transition-colors sm:opacity-0 sm:group-hover:opacity-100"
          aria-label={tSell("photos.cover")}
          title={tSell("photos.cover")}
        >
          <Star className="size-3" />
        </button>
      )}
    </div>
  );
}

