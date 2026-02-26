"use client"


import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, LoaderCircle as SpinnerGap, CircleAlert as WarningCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Field, FieldLabel, FieldDescription, FieldError, FieldContent } from "@/components/shared/field";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

import type { ProductImage } from "@/lib/sell/schema";
import { compressImage } from "@/lib/image-compression";
import { useSellForm } from "../sell-form-provider";
import { PhotoThumbnail } from "../ui/photo-thumbnail";
import { ImagePreviewModal } from "../ui/image-preview-modal";
import { UploadZone } from "../ui/upload-zone";
// Note: AiListingAssistant will be updated in Phase 3 to use context pattern

const EMPTY_IMAGES: ProductImage[] = [];

// ============================================================================
// Upload Progress Types
// ============================================================================
interface UploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "processing" | "done" | "error";
  error?: string;
}

// ============================================================================
// Upload Progress Item Component
// ============================================================================
function UploadProgressItem({ upload }: { upload: UploadProgress }) {
  const tSell = useTranslations("Sell")

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-subtle">
      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
        {upload.status === "done" ? (
          <Camera className="h-5 w-5 text-primary" />
        ) : upload.status === "error" ? (
          <WarningCircle className="h-5 w-5 text-destructive" />
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
            <span className="text-xs text-primary">{tSell("photos.uploaded")}</span>
          ) : (
            <Progress value={upload.progress} className="h-1" />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PHOTOS FIELD - Unified photo upload using context pattern
// ============================================================================

interface PhotosFieldProps {
  maxPhotos?: number;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  /** Use compact layout (no card wrapper/header). Useful when parent section already provides a card. */
  compact?: boolean;
  /** Thumbnail layout: grid (default) or horizontal row */
  thumbnailLayout?: "grid" | "row";
}

export function PhotosField({
  maxPhotos = 12,
  onUploadStart,
  onUploadEnd,
  compact = false,
  thumbnailLayout = "grid",
}: PhotosFieldProps) {
  // Use context instead of prop drilling
  const { watch, setValue, formState: { errors } } = useSellForm();
  const tSell = useTranslations("Sell")

  // Local state
  const watchedImages = watch("images");
  const images = watchedImages ?? EMPTY_IMAGES;
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<ProductImage | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  // ============================================================================
  // Upload Logic
  // ============================================================================

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
      compressedFile = file;
    }

    const formData = new FormData();
    formData.append("file", compressedFile);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = tSell("photos.errors.uploadFailed")
      try {
        const errorPayload: unknown = await response.json()
        if (
          typeof errorPayload === "object" &&
          errorPayload !== null &&
          "error" in errorPayload &&
          typeof (errorPayload as { error?: unknown }).error === "string"
        ) {
          errorMessage = (errorPayload as { error: string }).error
        }
      } catch {
        // Keep the default localized message when response is not JSON.
      }
      throw new Error(errorMessage);
    }

    const data: unknown = await response.json();
    if (
      typeof data !== "object" ||
      data === null ||
      !("url" in data) ||
      typeof (data as { url?: unknown }).url !== "string"
    ) {
      throw new Error(tSell("photos.errors.uploadFailed"))
    }

    const dataRecord = data as Record<string, unknown>
    const url = dataRecord.url as string
    const thumbnailUrl = typeof dataRecord.thumbnailUrl === "string" ? dataRecord.thumbnailUrl : url

    return {
      url,
      thumbnailUrl,
      isPrimary: false,
    };
  }, [tSell]);

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
            error: error instanceof Error ? error.message : tSell("photos.errors.uploadFailed")
          } : u
        ));
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((r): r is ProductImage => r !== null);

    // Add to form
    const newImages = [...images, ...successfulUploads];
    if (newImages.length > 0 && !newImages.some(i => i.isPrimary) && newImages[0]) {
        newImages[0] = { ...newImages[0], isPrimary: true };
      }
    setValue("images", newImages, { shouldValidate: true });

    // Clear upload progress after delay
    setTimeout(() => setUploads([]), 1500);
    onUploadEnd?.();
  }, [images, maxPhotos, setValue, uploadFile, onUploadStart, onUploadEnd, tSell]);

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

  // ============================================================================
  // Image Management Handlers
  // ============================================================================

  const handleRemove = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    if (images[index]?.isPrimary && newImages.length > 0 && newImages[0]) {
        newImages[0] = { ...newImages[0], isPrimary: true };
      }
    setValue("images", newImages, { shouldValidate: true });
  }, [images, setValue]);

  const handleSetCover = useCallback((index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    const cover = newImages.splice(index, 1)[0];
    if (cover) newImages.unshift(cover);
    setValue("images", newImages, { shouldValidate: true });
  }, [images, setValue]);

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
      if (removed) {
        newImages.splice(dragOverIndex.current, 0, removed);
      }

      newImages.forEach((img, i) => {
        img.isPrimary = i === 0;
      });

      setValue("images", newImages, { shouldValidate: true });
    }
    setDraggingIndex(null);
    dragOverIndex.current = null;
  }, [draggingIndex, images, setValue]);

  // ============================================================================
  // Render
  // ============================================================================

  const hasImages = images.length > 0;
  const isUploading = uploads.some(u => u.status === "uploading" || u.status === "processing");
  const hasError = !!errors.images;

  const sharedContent = (
    <>
      {thumbnailLayout === "row" ? (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {images.length < maxPhotos && (
            <div
              {...getRootProps()}
              className={cn(
                "w-20 h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 shrink-0 transition-colors cursor-pointer",
                "hover:bg-hover active:bg-active",
                isDragActive && "border-selected-border bg-selected",
                isUploading && "pointer-events-none opacity-70"
              )}
              aria-label={tSell("photos.add")}
            >
              <input {...getInputProps()} />
              <Camera className="size-5 text-muted-foreground" />
              <span className="text-2xs text-muted-foreground">{tSell("photos.add")}</span>
            </div>
          )}

          {images.map((image, index) => (
            <PhotoThumbnail
              key={`${image.url}-${index}`}
              image={image}
              index={index}
              isCover={index === 0 || !!image.isPrimary}
              variant="row"
              onRemove={() => handleRemove(index)}
              onSetCover={() => handleSetCover(index)}
              onPreview={() => setPreviewImage(image)}
              isDragging={draggingIndex === index}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Photo Grid */}
          {hasImages && (
            <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
              {images.map((image, index) => (
                <PhotoThumbnail
                  key={`${image.url}-${index}`}
                  image={image}
                  index={index}
                  isCover={index === 0 || !!image.isPrimary}
                  onRemove={() => handleRemove(index)}
                  onSetCover={() => handleSetCover(index)}
                  onPreview={() => setPreviewImage(image)}
                  isDragging={draggingIndex === index}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                />
              ))}
            </div>
          )}

          {/* Upload Zone */}
          {images.length < maxPhotos && (
            <UploadZone
              isUploading={isUploading}
              isDragActive={isDragActive}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              currentCount={images.length}
              maxCount={maxPhotos}
            />
          )}
        </>
      )}

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploads.map((upload, i) => (
            <UploadProgressItem key={i} upload={upload} />
          ))}
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <FieldError className="mt-3">
          {errors.images?.message ? tSell(errors.images.message as never) : null}
        </FieldError>
      )}
    </>
  );

  return (
    <>
      {/* Main Photos Field */}
      <Field data-invalid={hasError}>
        {!compact ? (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-surface-subtle">
                  <Camera className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <FieldLabel className="text-sm font-semibold text-foreground">
                    {tSell("photos.label")}
                  </FieldLabel>
                  <FieldDescription className="text-xs text-muted-foreground mt-0.5">
                    {tSell("photos.helpText", { max: maxPhotos })}
                  </FieldDescription>
                </div>
              </div>
              <Badge
                variant={images.length === 0 ? "destructive" : "secondary"}
                className="h-6 rounded-full px-2 text-xs font-semibold tabular-nums"
              >
                {images.length}/{maxPhotos}
              </Badge>
            </div>

            {/* Content */}
            <FieldContent>
              {sharedContent}
            </FieldContent>
          </div>
        ) : (
          <FieldContent>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="space-y-0.5">
                <p className="text-sm text-muted-foreground">
                  {tSell("photos.helpText", { max: maxPhotos })}
                </p>
              </div>
              <Badge
                variant={images.length === 0 ? "destructive" : "secondary"}
                className="h-6 rounded-full px-2 text-xs font-semibold tabular-nums"
              >
                {images.length}/{maxPhotos}
              </Badge>
            </div>

            {sharedContent}
          </FieldContent>
        )}
      </Field>

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  );
}

