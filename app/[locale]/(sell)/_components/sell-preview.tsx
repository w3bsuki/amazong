"use client";

import Image from "next/image";
import {
  Heart,
  Star,
  Truck,
  MapPin,
  Image as ImageIcon,
} from "@phosphor-icons/react";

interface SellPreviewProps {
  title: string;
  price: string;
  images: string[];
  location?: string;
}

export function SellPreview({
  title,
  price,
  images,
  location = "Your Location",
}: SellPreviewProps) {
  const displayPrice = price && !isNaN(parseFloat(price)) ? `$${parseFloat(price).toFixed(2)}` : "$0.00";
  const displayTitle = title || "Your listing title";
  const coverImage = images[0];

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="border-b border-border/50 bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Live Preview</h3>
          <span className="inline-flex items-center gap-1.5 text-xs text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Updating
          </span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-4">
        <div className="group">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-3">
            {coverImage ? (
              <Image
                src={coverImage}
                alt="Product preview"
                fill
                className="object-cover"
                sizes="300px"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="h-10 w-10 text-muted-foreground/30" weight="duotone" />
              </div>
            )}

            {/* Wishlist Button */}
            <button
              type="button"
              className="absolute right-2.5 top-2.5 rounded-full bg-background/90 p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* New Seller Badge */}
            <div className="absolute bottom-2.5 left-2.5">
              <span className="inline-flex items-center rounded-full bg-background/90 backdrop-blur-sm px-2 py-0.5 text-xs font-medium shadow-sm">
                <Star className="h-3 w-3 text-amber-500 mr-1" weight="fill" />
                New Seller
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-medium text-foreground leading-snug line-clamp-2">
              {displayTitle}
            </h4>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-foreground">{displayPrice}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Truck className="h-3 w-3" />
              Free shipping
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {location}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
