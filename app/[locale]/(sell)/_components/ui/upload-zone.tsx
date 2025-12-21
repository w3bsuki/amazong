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
}: UploadZoneProps) {
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
