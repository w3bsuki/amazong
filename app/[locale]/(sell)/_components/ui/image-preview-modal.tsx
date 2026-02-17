"use client";

import { X } from "lucide-react";

import type { ProductImage } from "@/lib/sell/schema";

interface ImagePreviewModalProps {
  image: ProductImage;
  onClose: () => void;
}

/**
 * ImagePreviewModal - Full screen image preview overlay
 * 
 * Shows a large preview of a product image with close button.
 * Used in the photos section for previewing uploaded images.
 */
export function ImagePreviewModal({
  image,
  onClose,
}: ImagePreviewModalProps) {
    return (
      <div 
      className="fixed inset-0 z-50 bg-surface-gallery text-overlay-text flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-full bg-overlay-light/10 hover:bg-overlay-light/20 text-overlay-text transition-colors min-h-11 min-w-11"
        aria-label="Close preview"
      >
        <X className="size-6" />
      </button>
      <img
        src={image.url}
        alt="Product preview"
        className="max-w-full max-h-dialog object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

