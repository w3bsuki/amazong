"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

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
    const tSell = useTranslations("Sell")
    const tCommon = useTranslations("Common")

    return (
      <div 
      className="fixed inset-0 z-50 bg-surface-gallery text-overlay-text flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={tSell("photos.label")}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-full bg-overlay-light/10 hover:bg-overlay-light/20 text-overlay-text transition-colors min-h-11 min-w-11"
        aria-label={tCommon("close")}
      >
        <X className="size-6" />
      </button>
      <div
        className="relative w-full h-full max-w-full max-h-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.url}
          alt={tSell("photos.label")}
          fill
          sizes="100vw"
          className="object-contain rounded-lg"
        />
      </div>
    </div>
  );
}


