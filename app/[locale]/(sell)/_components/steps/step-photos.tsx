"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  Camera,
  X,
  Plus,
  Star,
  Trash,
  SpinnerGap,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { SellFormDataV4, ProductImage } from "@/lib/sell-form-schema-v4";
import { compressImage } from "@/lib/image-compression";
import type { Category } from "../types";
import { AiListingAssistant } from "../ai/ai-listing-assistant";

interface StepPhotosProps {
  form: UseFormReturn<SellFormDataV4>;
  categories: Category[];
  locale?: string;
  onValidityChange?: (isValid: boolean) => void;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "processing" | "done" | "error";
  error?: string;
}

// Photo thumbnail component
function PhotoThumbnail({
  image,
  index,
  isCover,
  onRemove,
  onSetCover,
}: {
  image: ProductImage;
  index: number;
  isCover: boolean;
  onRemove: () => void;
  onSetCover: () => void;
}) {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-border group">
      <Image
        src={image.thumbnailUrl || image.url}
        alt={`Photo ${index + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 25vw, 100px"
      />

      {/* Cover badge */}
      {isCover && (
        <div className="absolute top-1 left-1 z-10 px-1 py-0.5 rounded bg-amber-500 text-white text-2xs font-bold flex items-center gap-0.5">
          <Star className="size-2.5" weight="fill" />
        </div>
      )}

      {/* Actions overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
        {!isCover && (
          <button
            type="button"
            onClick={onSetCover}
            className="p-1.5 rounded-full bg-white/90 text-foreground hover:bg-white transition-colors"
            title="Set as cover"
          >
            <Star className="size-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-full bg-white/90 text-destructive hover:bg-white transition-colors"
          title="Remove"
        >
          <Trash className="size-3.5" />
        </button>
      </div>

      {/* Position number */}
      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-2xs font-medium px-1 py-0.5 rounded">
        {index + 1}
      </div>
    </div>
  );
}

// Upload preview (during upload)
function UploadPreview({
  upload,
  onCancel,
}: {
  upload: UploadProgress;
  onCancel: () => void;
}) {
  const objectUrl = URL.createObjectURL(upload.file);

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border border-primary/30">
      <Image
        src={objectUrl}
        alt="Uploading"
        fill
        className="object-cover opacity-60"
        sizes="100px"
      />
      
      {/* Progress overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-1.5">
        {upload.status === "error" ? (
          <>
            <WarningCircle className="size-5 text-destructive" />
            <span className="text-2xs text-white text-center mt-0.5">{upload.error || "Failed"}</span>
          </>
        ) : upload.status === "done" ? (
          <CheckCircle className="size-5 text-green-500" weight="fill" />
        ) : (
          <>
            <SpinnerGap className="size-5 text-white animate-spin" />
            <Progress value={upload.progress} className="w-full h-0.5 mt-1" />
          </>
        )}
      </div>

      {/* Cancel button */}
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

export function StepPhotos({ form, categories, locale = "en", onValidityChange }: StepPhotosProps) {
  const isBg = locale === "bg";
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const images = form.watch("images") || [];
  const title = form.watch("title") || "";
  const description = form.watch("description") || "";

  // Check validity
  const isValid = images.length >= 1 && title.length >= 3;
  
  // Notify parent of validity changes
  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  // Upload handler
  const uploadImage = async (file: File, uploadId: string) => {
    const controller = new AbortController();
    abortControllersRef.current.set(uploadId, controller);

    try {
      // Update progress - compressing
      setUploads(prev => prev.map(u => 
        u.file === file ? { ...u, progress: 5, status: "uploading" as const } : u
      ));

      // Compress image on client-side BEFORE upload
      // This converts to WebP and reduces size significantly
      let compressedFile: File;
      try {
        compressedFile = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.85,
          type: "image/webp",
        });
      } catch {
        // If compression fails, use original file (server will handle it)
        compressedFile = file;
      }

      setUploads(prev => prev.map(u => 
        u.file === file ? { ...u, progress: 20, status: "uploading" as const } : u
      ));

      // Create form data with compressed file
      const formData = new FormData();
      formData.append("file", compressedFile);

      // Upload to API
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      setUploads(prev => prev.map(u => 
        u.file === file ? { ...u, progress: 70, status: "processing" as const } : u
      ));

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setUploads(prev => prev.map(u => 
        u.file === file ? { ...u, progress: 100, status: "done" as const } : u
      ));

      // Add to form - only use properties in the schema
      const newImage: ProductImage = {
        url: data.url,
        thumbnailUrl: data.thumbnailUrl || data.url,
        isPrimary: images.length === 0,
      };

      form.setValue("images", [...images, newImage], { shouldValidate: true });

      // Remove from uploads after brief delay
      setTimeout(() => {
        setUploads(prev => prev.filter(u => u.file !== file));
      }, 500);

    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        setUploads(prev => prev.filter(u => u.file !== file));
        return;
      }
      setUploads(prev => prev.map(u => 
        u.file === file ? { ...u, status: "error" as const, error: "Upload failed" } : u
      ));
    } finally {
      abortControllersRef.current.delete(uploadId);
    }
  };

  // Dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const maxPhotos = 10;
    const remaining = maxPhotos - images.length - uploads.length;
    const filesToUpload = acceptedFiles.slice(0, remaining);

    filesToUpload.forEach((file) => {
      const uploadId = `${Date.now()}-${Math.random()}`;
      setUploads(prev => [...prev, {
        file,
        progress: 0,
        status: "uploading" as const,
      }]);
      uploadImage(file, uploadId);
    });
  }, [images.length, uploads.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024,
    disabled: images.length + uploads.length >= 10,
  });

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    // Reassign primary to first image
    newImages.forEach((img, i) => {
      img.isPrimary = i === 0;
    });
    form.setValue("images", newImages, { shouldValidate: true });
  };

  // Set cover
  const setCover = (index: number) => {
    const newImages = [...images];
    newImages.forEach((img, i) => {
      img.isPrimary = i === index;
    });
    form.setValue("images", newImages, { shouldValidate: true });
  };

  // Cancel upload
  const cancelUpload = (file: File) => {
    const controller = Array.from(abortControllersRef.current.values())[0];
    controller?.abort();
    setUploads(prev => prev.filter(u => u.file !== file));
  };

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Photos section */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold flex items-center gap-1.5">
            <Camera className="size-4 text-primary" weight="fill" />
            {isBg ? "Снимки" : "Photos"}
            <span className="text-destructive">*</span>
          </Label>
          <span className="text-xs text-muted-foreground tabular-nums">
            {images.length}/10
          </span>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-4 gap-1.5">
          {/* Existing images */}
          {images.map((image, index) => (
            <PhotoThumbnail
              key={image.url}
              image={image}
              index={index}
              isCover={image.isPrimary || index === 0}
              onRemove={() => removeImage(index)}
              onSetCover={() => setCover(index)}
            />
          ))}

          {/* Uploading */}
          {uploads.map((upload, index) => (
            <UploadPreview
              key={`upload-${index}`}
              upload={upload}
              onCancel={() => cancelUpload(upload.file)}
            />
          ))}

          {/* Add button */}
          {images.length + uploads.length < 10 && (
            <div
              {...getRootProps()}
              className={cn(
                "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <input {...getInputProps()} />
              <Plus className={cn(
                "size-6",
                isDragActive ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
          )}
        </div>

        {images.length === 0 && (
          <p className="text-xs text-muted-foreground">
            {isBg
              ? "Добавете поне 1 снимка. Първата ще бъде корицата."
              : "Add at least 1 photo. First one will be the cover."}
          </p>
        )}
      </section>

      <AiListingAssistant form={form} categories={categories} locale={locale} compact />

      {/* Title */}
      <section className="space-y-1.5">
        <Label htmlFor="title" className="text-sm font-semibold">
          {isBg ? "Заглавие" : "Title"}
          <span className="text-destructive ml-0.5">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => form.setValue("title", e.target.value, { shouldValidate: true })}
          placeholder={isBg ? "напр. iPhone 14 Pro Max 256GB" : "e.g. iPhone 14 Pro Max 256GB"}
          className="h-10 rounded-lg"
          maxLength={120}
        />
        <div className="flex justify-between">
          <span className="text-xs text-muted-foreground">
            {isBg ? "Кратко и описателно" : "Short and descriptive"}
          </span>
          <span className={cn(
            "text-xs tabular-nums",
            title.length >= 100 ? "text-amber-600" : "text-muted-foreground"
          )}>
            {title.length}/120
          </span>
        </div>
      </section>

      {/* Description */}
      <section className="space-y-1.5">
        <Label htmlFor="description" className="text-sm font-semibold">
          {isBg ? "Описание" : "Description"}
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => form.setValue("description", e.target.value, { shouldValidate: true })}
          placeholder={isBg
            ? "Опишете състоянието, особеностите..."
            : "Describe the condition, features..."}
          className="w-full min-h-24 resize-none"
          maxLength={2000}
        />
        <div className="flex justify-end">
          <span className={cn(
            "text-xs tabular-nums",
            description.length >= 1800 ? "text-amber-600" : "text-muted-foreground"
          )}>
            {description.length}/2000
          </span>
        </div>
      </section>
    </div>
  );
}
