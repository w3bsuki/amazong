"use client";

import { useCallback, useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  Trash,
  Plus,
  DotsSixVertical,
  SpinnerGap,
  Camera,
  Star,
  MagnifyingGlassPlus,
  X,
  ArrowsClockwise,
  WarningCircle,
  CheckCircle,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { SellFormDataV4, ProductImage } from "@/lib/sell-form-schema-v4";
import { compressImage } from "@/lib/image-compression";
import type { Category } from "../types";
import { AiListingAssistant } from "../ai/ai-listing-assistant";

interface PhotosSectionProps {
  form: UseFormReturn<SellFormDataV4>;
  categories?: Category[];
  locale?: string;
  maxPhotos?: number;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "processing" | "done" | "error";
  error?: string;
}

// ============================================================================
// Image Preview Modal - Full screen with better UX
// ============================================================================
function ImagePreviewModal({
  image,
  onClose,
}: {
  image: ProductImage;
  onClose: () => void;
}) {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in-0 duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors touch-target"
        aria-label="Close preview"
      >
        <X className="size-6" weight="bold" />
      </button>
      <img
        src={image.url}
        alt="Product preview"
        className="max-w-full max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ============================================================================
// Photo Thumbnail with Drag & Drop - Touch optimized
// ============================================================================
function PhotoThumbnail({
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
}: {
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
}) {
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
          <Badge className="bg-cover-badge hover:bg-cover-badge text-cover-badge-foreground text-2xs px-1.5 py-0.5 gap-1 font-semibold">
            <Star className="size-3" weight="fill" />
            COVER
          </Badge>
        </div>
      )}

      {/* Position Number - Top right */}
      <div className="absolute top-1.5 right-1.5 bg-foreground/70 text-background text-2xs font-medium px-1.5 py-0.5 rounded-md">
        {index + 1}
      </div>

      {/* Hover Overlay with Actions */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Preview button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onPreview(); }}
            className="p-2.5 rounded-full bg-white/95 hover:bg-white text-foreground transition-colors touch-target"
            title="Preview"
          >
            <MagnifyingGlassPlus className="size-5" />
          </button>
          {/* Delete button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-2.5 rounded-full bg-white/95 hover:bg-destructive hover:text-white text-foreground transition-colors touch-target"
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
            <span className="text-2xs">Drag</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Upload Zone - Touch friendly, professional design
// ============================================================================
function UploadZone({
  isUploading,
  isDragActive,
  getRootProps,
  getInputProps,
  currentCount,
  maxCount,
}: {
  isUploading: boolean;
  isDragActive: boolean;
  getRootProps: () => Record<string, unknown>;
  getInputProps: () => Record<string, unknown>;
  currentCount: number;
  maxCount: number;
}) {
  const remaining = maxCount - currentCount;
  
  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors cursor-pointer",
        "min-h-[200px] sm:min-h-[220px] touch-action-manipulation",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/40",
        isUploading && "pointer-events-none opacity-70"
      )}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <div className="flex flex-col items-center gap-4">
          <SpinnerGap className="size-10 animate-spin text-primary" />
          <span className="text-sm font-semibold text-foreground">Uploading photos...</span>
        </div>
      ) : (
        <>
          <div className={cn(
            "flex size-16 items-center justify-center rounded-xl bg-background border border-border shadow-xs mb-4 transition-transform",
            isDragActive && "scale-110"
          )}>
            {isDragActive ? (
              <Plus className="size-8 text-primary" weight="bold" />
            ) : (
              <Camera className="size-8 text-muted-foreground" weight="bold" />
            )}
          </div>
          <span className="text-base font-semibold text-foreground">
            {isDragActive ? "Drop photos here" : "Add photos"}
          </span>
          <span className="mt-1 text-sm text-muted-foreground">
            Drag & drop or <span className="text-primary font-medium">browse</span>
          </span>
          <span className="mt-4 text-xs text-muted-foreground/70">
            {remaining > 0 
              ? `Up to ${remaining} more photo${remaining > 1 ? "s" : ""} • JPG, PNG, WEBP`
              : "Maximum photos reached"}
          </span>
        </>
      )}
    </div>
  );
}

// ============================================================================
// Upload Progress Item
// ============================================================================
function UploadProgressItem({ upload }: { upload: UploadProgress }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
        {upload.status === "done" ? (
          <CheckCircle className="h-5 w-5 text-success" weight="fill" />
        ) : upload.status === "error" ? (
          <WarningCircle className="h-5 w-5 text-destructive" weight="fill" />
        ) : (
          <SpinnerGap className="h-5 w-5 animate-spin text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate">{upload.file.name}</div>
        <div className="mt-1">
          {upload.status === "error" ? (
            <span className="text-xs text-destructive">{upload.error}</span>
          ) : upload.status === "done" ? (
            <span className="text-xs text-success">Uploaded</span>
          ) : (
            <Progress value={upload.progress} className="h-1" />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Photos Section Component
// ============================================================================
export function PhotosSection({
  form,
  categories = [],
  locale = "en",
  maxPhotos = 12,
  onUploadStart,
  onUploadEnd,
}: PhotosSectionProps) {
  const images = form.watch("images") || [];
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<ProductImage | null>(null);
  const dragOverIndex = useRef<number | null>(null);
  const isBg = locale === "bg";

  // Handle file upload with client-side compression
  const uploadFile = useCallback(async (file: File): Promise<ProductImage | null> => {
    // Compress image on client-side BEFORE upload
    let compressedFile: File;
    try {
      compressedFile = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.85,
        type: "image/webp",
      });
    } catch {
      // If compression fails, use original file
      compressedFile = file;
    }

    const formData = new FormData();
    formData.append("file", compressedFile);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    const data = await response.json();
    return {
      url: data.url,
      thumbnailUrl: data.thumbnailUrl || data.url,
      isPrimary: false,
    };
  }, []);

  // Handle files drop/selection
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const remainingSlots = maxPhotos - images.length;
    const filesToUpload = acceptedFiles.slice(0, remainingSlots);

    if (filesToUpload.length === 0) return;

    onUploadStart?.();

    // Initialize progress tracking
    const initialUploads: UploadProgress[] = filesToUpload.map(file => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }));
    setUploads(initialUploads);

    // Upload all files
    const uploadPromises = filesToUpload.map(async (file, idx) => {
      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploads(prev => prev.map((u, i) => 
            i === idx && u.progress < 90 
              ? { ...u, progress: u.progress + 10 }
              : u
          ));
        }, 100);

        const result = await uploadFile(file);

        clearInterval(progressInterval);
        setUploads(prev => prev.map((u, i) => 
          i === idx ? { ...u, progress: 100, status: "done" as const } : u
        ));

        return result;
      } catch (error) {
        setUploads(prev => prev.map((u, i) => 
          i === idx ? { 
            ...u, 
            status: "error" as const, 
            error: error instanceof Error ? error.message : "Upload failed" 
          } : u
        ));
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((r): r is ProductImage => r !== null);

    // Add to form
    const newImages = [...images, ...successfulUploads];
    // Mark first image as primary
    if (newImages.length > 0 && !newImages.some(i => i.isPrimary)) {
      newImages[0] = { ...newImages[0], isPrimary: true };
    }
    form.setValue("images", newImages, { shouldValidate: true });

    // Clear upload progress after delay
    setTimeout(() => setUploads([]), 1500);
    onUploadEnd?.();
  }, [images, maxPhotos, form, uploadFile, onUploadStart, onUploadEnd]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: images.length >= maxPhotos,
    multiple: true,
  });

  // Remove image
  const handleRemove = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the primary, make first one primary
    if (images[index]?.isPrimary && newImages.length > 0) {
      newImages[0] = { ...newImages[0], isPrimary: true };
    }
    form.setValue("images", newImages, { shouldValidate: true });
  }, [images, form]);

  // Set as cover
  const handleSetCover = useCallback((index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    // Move cover to first position
    const cover = newImages.splice(index, 1)[0];
    newImages.unshift(cover);
    form.setValue("images", newImages, { shouldValidate: true });
  }, [images, form]);

  // Drag & drop reorder
  const handleDragStart = useCallback((index: number) => {
    setDraggingIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverIndex.current = index;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (draggingIndex !== null && dragOverIndex.current !== null && draggingIndex !== dragOverIndex.current) {
      const newImages = [...images];
      const [removed] = newImages.splice(draggingIndex, 1);
      newImages.splice(dragOverIndex.current, 0, removed);
      
      // Update primary if position changed
      newImages.forEach((img, i) => {
        img.isPrimary = i === 0;
      });
      
      form.setValue("images", newImages, { shouldValidate: true });
    }
    setDraggingIndex(null);
    dragOverIndex.current = null;
  }, [draggingIndex, images, form]);

  const hasImages = images.length > 0;
  const isUploading = uploads.some(u => u.status === "uploading" || u.status === "processing");

  return (
    <>
      <div className="space-y-4">
        <AiListingAssistant form={form} categories={categories} locale={locale} />

        <section className="rounded-xl border border-border bg-background overflow-hidden shadow-xs">
          <div className="p-5 pb-4 border-b border-border/50 bg-muted/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex size-10 items-center justify-center rounded-md bg-background border border-border shadow-xs">
                <Camera className="size-5 text-muted-foreground" weight="bold" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight text-foreground">
                  {isBg ? "Снимки" : "Photos"}
                </h3>
                <p className="text-xs font-medium text-muted-foreground">
                  {isBg 
                    ? `Добавете до ${maxPhotos} снимки. Първата е корица.`
                    : `Add up to ${maxPhotos} photos. First image is the cover.`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge 
                variant={images.length === 0 ? "destructive" : "secondary"}
                className="h-6 rounded-sm px-2 text-[11px] font-bold tabular-nums"
              >
                {images.length}/{maxPhotos}
              </Badge>
              {images.length === 0 && (
                <Badge variant="outline" className="h-6 rounded-sm px-2 text-[10px] font-bold uppercase tracking-wider text-destructive border-destructive/30 bg-destructive/5">
                  {isBg ? "Задължително" : "Required"}
                </Badge>
              )}
            </div>
          </div>
          </div>

          <div className="px-5 pb-5">
          {/* Tips - Simple info box */}
          {!hasImages && (
            <div className="mb-5 p-4 rounded-lg bg-muted border border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="font-semibold text-foreground">Pro tip:</strong> Use natural lighting, show multiple angles, and include any flaws for better trust and faster sales.
              </p>
            </div>
          )}

          {/* Photo Grid - Responsive with proper gaps */}
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Upload Zone - Full width if no images */}
            {!hasImages && (
              <div className="col-span-full">
                <UploadZone
                  isUploading={isUploading}
                  isDragActive={isDragActive}
                  getRootProps={getRootProps}
                  getInputProps={getInputProps}
                  currentCount={images.length}
                  maxCount={maxPhotos}
                />
              </div>
            )}

            {/* Existing Images */}
            {images.map((image, index) => (
              <PhotoThumbnail
                key={image.url}
                image={image}
                index={index}
                isCover={index === 0 || image.isPrimary}
                isDragging={draggingIndex === index}
                onRemove={() => handleRemove(index)}
                onSetCover={() => handleSetCover(index)}
                onPreview={() => setPreviewImage(image)}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              />
            ))}

            {/* Add More Button */}
            {hasImages && images.length < maxPhotos && (
              <div
                {...getRootProps()}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <input {...getInputProps()} />
                <Plus className="h-6 w-6 text-muted-foreground" />
                <span className="mt-1 text-2xs text-muted-foreground">Add</span>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploads.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploads.map((upload, idx) => (
                <UploadProgressItem key={idx} upload={upload} />
              ))}
            </div>
          )}

          {/* Drag Hint */}
          {hasImages && images.length > 1 && (
            <p className="mt-3 text-xs text-muted-foreground text-center">
              <ArrowsClockwise className="inline h-3 w-3 mr-1" />
              Drag photos to reorder. First photo is your listing cover.
            </p>
          )}
          </div>
        </section>
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  );
}
