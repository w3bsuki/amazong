"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Camera, X, Star, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { compressImage } from "@/lib/image-compression";
import type { ProductImage } from "../_lib/schema";

interface PhotosSectionProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxPhotos?: number;
  error?: string;
}

export function PhotosSection({ images, onChange, maxPhotos = 12, error }: PhotosSectionProps) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<ProductImage | null> => {
    try {
      const compressed = await compressImage(file, { maxWidth: 1920, quality: 0.85 });
      const formData = new FormData();
      formData.append("file", compressed);
      
      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      
      const { url, thumbnailUrl } = await res.json();
      return { url, thumbnailUrl, isPrimary: images.length === 0 };
    } catch {
      return null;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsUploading(true);
    
    const newImages = await Promise.all(
      acceptedFiles.slice(0, maxPhotos - images.length).map(uploadImage)
    );
    
    onChange([...images, ...newImages.filter(Boolean) as ProductImage[]]);
    setIsUploading(false);
  }, [images, maxPhotos, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: maxPhotos - images.length,
    disabled: isUploading || images.length >= maxPhotos,
  });

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    // Ensure first image is primary
    if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange(updated);
  };

  const setCover = (index: number) => {
    const updated = images.map((img, i) => ({ ...img, isPrimary: i === index }));
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Photos <span className="text-destructive">*</span></h3>
        <span className="text-xs text-muted-foreground">{images.length}/{maxPhotos}</span>
      </div>

      {/* Upload Zone */}
      {images.length < maxPhotos && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            isUploading && "opacity-50 pointer-events-none"
          )}
        >
          <input {...getInputProps()} />
          <Camera className="mx-auto size-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">
            {isDragActive ? "Drop photos here" : "Drag photos or tap to upload"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP up to 10MB</p>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {images.map((image, index) => (
            <div
              key={image.url}
              className="relative aspect-square rounded-lg overflow-hidden border group"
            >
              <Image
                src={image.thumbnailUrl || image.url}
                alt={`Photo ${index + 1}`}
                fill
                className="object-cover"
              />
              
              {/* Cover Badge */}
              {image.isPrimary && (
                <div className="absolute top-1 left-1">
                  <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    <Star weight="fill" className="size-2.5" /> COVER
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.isPrimary && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 text-xs"
                    onClick={() => setCover(index)}
                  >
                    Set cover
                  </Button>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="size-7"
                  onClick={() => removeImage(index)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          {images.length < maxPhotos && (
            <button
              type="button"
              onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
              className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center hover:border-primary/50 transition-colors"
            >
              <Plus className="size-6 text-muted-foreground" />
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
