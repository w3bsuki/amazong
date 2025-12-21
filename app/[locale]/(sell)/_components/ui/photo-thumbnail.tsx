"use client";

import Image from "next/image";
import {
  Trash,
  DotsSixVertical,
  Star,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { ProductImage } from "@/lib/sell-form-schema-v4";

interface PhotoThumbnailProps {
  image: ProductImage;
  index: number;
  isCover: boolean;
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
  onRemove,
  onSetCover,
  onPreview,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
}: PhotoThumbnailProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={cn(
        "relative aspect-square overflow-hidden rounded-xl border-2 group bg-muted transition-colors",
        isDragging 
          ? "border-primary border-dashed opacity-50 scale-95" 
          : "border-border/60 hover:border-primary/40",
        "cursor-grab active:cursor-grabbing touch-action-manipulation"
      )}
    >
      <Image
        src={image.thumbnailUrl || image.url}
        alt={`Product image ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 33vw, 150px"
      />

      {/* Cover Badge - Top left, always visible for first image */}
      {isCover && (
        <div className="absolute top-1.5 left-1.5 z-10">
          <Badge variant="secondary" className="px-2 py-0.5 gap-1 font-semibold">
            <Star className="size-3" weight="fill" />
            Cover
          </Badge>
        </div>
      )}

      {/* Position Number - Top right */}
      <div className="absolute top-1.5 right-1.5 bg-foreground/70 text-background text-xs font-medium px-2 py-0.5 rounded-md">
        {index + 1}
      </div>

      {/* Hover Overlay with Actions */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Preview button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
            className="p-2.5 rounded-full bg-white/95 hover:bg-white text-foreground transition-colors min-h-11 min-w-11"
            title="Preview"
          >
            <MagnifyingGlassPlus className="size-5" />
          </button>
          {/* Delete button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-2.5 rounded-full bg-white/95 hover:bg-destructive hover:text-white text-foreground transition-colors min-h-11 min-w-11"
            title="Remove"
          >
            <Trash className="size-5" />
          </button>
        </div>

        {/* Bottom Bar - Set as cover & drag hint */}
        <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity bg-linear-to-t from-black/70 to-transparent pt-6">
          {!isCover && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSetCover(); }}
              className="text-xs font-medium text-white bg-black/50 hover:bg-black/70 px-2.5 py-1.5 rounded-md transition-colors"
            >
              Set as cover
            </button>
          )}
          <div className={cn("flex items-center gap-1 text-white/80 ml-auto", !isCover && "ml-2")}>
            <DotsSixVertical className="size-4" />
            <span className="text-xs">Drag</span>
          </div>
        </div>
      </div>
    </div>
  );
}
