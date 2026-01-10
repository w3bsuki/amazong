"use client";

import { Camera, Plus, SpinnerGap } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  isUploading: boolean;
  isDragActive: boolean;
  getRootProps: () => Record<string, unknown>;
  getInputProps: () => Record<string, unknown>;
  currentCount: number;
  maxCount: number;
  locale?: "en" | "bg";
}

/**
 * UploadZone - Drop zone for uploading product photos
 * 
 * Displays a drag & drop area with:
 * - Visual feedback for drag state
 * - Loading spinner when uploading
 * - Count of remaining photos allowed
 */
export function UploadZone({
  isUploading,
  isDragActive,
  getRootProps,
  getInputProps,
  currentCount,
  maxCount,
  locale = "en",
}: UploadZoneProps) {
  const remaining = maxCount - currentCount;
  const isBg = locale === "bg";
  
  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-md border-2 border-dashed transition-colors cursor-pointer",
        "min-h-36 sm:min-h-40 touch-action-manipulation",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-border/40 bg-muted/10 hover:bg-muted/20 hover:border-primary/30",
        isUploading && "pointer-events-none opacity-70"
      )}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <div className="flex flex-col items-center gap-3">
          <SpinnerGap className="size-7 animate-spin text-primary" />
          <span className="text-sm font-medium text-foreground">
            {isBg ? "Качване..." : "Uploading..."}
          </span>
        </div>
      ) : (
        <>
          <div className={cn(
            "flex size-12 items-center justify-center rounded-full bg-background border border-border shadow-sm mb-2",
          )}>
            {isDragActive ? (
              <Plus className="size-5 text-primary" weight="bold" />
            ) : (
              <Camera className="size-5 text-muted-foreground" weight="bold" />
            )}
          </div>
          <span className="text-sm font-bold text-foreground">
            {isDragActive
              ? (isBg ? "Пуснете тук" : "Drop here")
              : (isBg ? "Добавете снимки" : "Add photos")}
          </span>
          <span className="mt-0.5 text-xs text-muted-foreground">
            {isBg ? (
              <>
                Докоснете за <span className="text-primary font-semibold">избор</span>
              </>
            ) : (
              <>
                Tap to <span className="text-primary font-semibold">browse</span>
              </>
            )}
          </span>
          <span className="mt-2 text-2xs font-medium text-muted-foreground/60">
            {remaining > 0 
              ? (isBg
                  ? `Още до ${remaining} снимки`
                  : `Up to ${remaining} more`)
              : (isBg ? "Максимум" : "Maximum reached")}
          </span>
        </>
      )}
    </div>
  );
}
