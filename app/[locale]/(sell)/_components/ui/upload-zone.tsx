import { Camera, Plus, LoaderCircle as SpinnerGap } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface UploadZoneProps {
  isUploading: boolean;
  isDragActive: boolean;
  getRootProps: () => Record<string, unknown>;
  getInputProps: () => Record<string, unknown>;
  currentCount: number;
  maxCount: number;
}

/**
 * UploadZone - Premium drop zone for uploading product photos
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
  const t = useTranslations("Sell")
  
  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors cursor-pointer",
        "min-h-44 sm:min-h-48 touch-manipulation",
        "hover:bg-hover active:bg-active",
        isDragActive
          ? "border-selected-border bg-selected"
          : "border-border-subtle bg-surface-subtle",
        isUploading && "pointer-events-none opacity-70"
      )}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="size-20 rounded-2xl bg-surface-subtle flex items-center justify-center">
            <SpinnerGap className="size-10 text-primary animate-spin" />
          </div>
          <div className="text-center">
            <span className="text-base font-semibold text-foreground block">
              {t("uploadZone.uploading")}
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="size-20 rounded-2xl bg-surface-subtle flex items-center justify-center mb-4">
            {isDragActive ? (
              <Plus className="size-10 text-primary" />
            ) : (
              <Camera className="size-10 text-primary" />
            )}
          </div>
          <div className="text-center space-y-1">
            <span className="text-lg font-bold text-foreground block">
              {isDragActive
                ? t("uploadZone.dropHere")
                : t("uploadZone.tapToAddPhotos")}
            </span>
            <span className="text-sm text-muted-foreground">
              {t("uploadZone.fileHint")}
            </span>
          </div>
          <span className="mt-4 text-xs font-medium text-muted-foreground">
            {remaining > 0 
              ? t("uploadZone.remaining", { count: remaining })
              : t("uploadZone.maxReached")}
          </span>
        </>
      )}
    </div>
  );
}

