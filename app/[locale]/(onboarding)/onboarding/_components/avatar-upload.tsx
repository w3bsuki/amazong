"use client"

import { type ChangeEvent } from "react"
import { Camera } from "lucide-react"
import Image from "next/image"
import Avatar from "boring-avatars"

import { type AvatarVariant, getColorPalette } from "@/lib/avatar-palettes"

export function AvatarUpload({
  previewSrc,
  previewAlt,
  ariaLabel,
  onFileChange,
  fallbackName,
  fallbackVariant,
  fallbackPalette,
}: {
  previewSrc: string | null
  previewAlt: string
  ariaLabel: string
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  fallbackName: string
  fallbackVariant: AvatarVariant
  fallbackPalette: number
}) {
  return (
    <div className="relative">
      <div className="size-16 rounded-xl overflow-hidden border-2 border-selected-border shadow-sm">
        {previewSrc ? (
          <Image
            src={previewSrc}
            alt={previewAlt}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        ) : (
          <Avatar
            size={64}
            name={fallbackName}
            variant={fallbackVariant}
            colors={getColorPalette(fallbackPalette)}
            square
          />
        )}
      </div>
      <label
        className="group absolute -bottom-3 -right-3 touch-target cursor-pointer flex items-center justify-center tap-highlight"
        aria-label={ariaLabel}
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors group-hover:bg-interactive-hover">
          <Camera className="size-3.5" />
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      </label>
    </div>
  )
}
