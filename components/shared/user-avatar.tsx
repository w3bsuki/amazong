import * as React from "react"
import BoringAvatar from "boring-avatars"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AVATAR_VARIANTS, COLOR_PALETTES, type AvatarVariant } from "@/lib/avatar-palettes"
import { cn, safeAvatarSrc } from "@/lib/utils"

export type UserAvatarSize = "sm" | "md" | "lg" | "xl"

const SIZE_CLASSES: Record<UserAvatarSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-14",
}

type ParsedBoringAvatar = {
  variant: AvatarVariant
  colors: string[]
  name: string
}

function parseBoringAvatar(
  value: string | null | undefined,
  fallbackName: string
): ParsedBoringAvatar | null {
  if (!value || !value.startsWith("boring-avatar:")) return null
  const [, variantRaw, paletteRaw, seedRaw] = value.split(":")

  const variant = AVATAR_VARIANTS.includes(variantRaw as AvatarVariant)
    ? (variantRaw as AvatarVariant)
    : AVATAR_VARIANTS[0]

  const paletteIndex = Number.parseInt(paletteRaw || "0", 10)
  const colors =
    COLOR_PALETTES[Number.isNaN(paletteIndex) ? 0 : paletteIndex] ?? COLOR_PALETTES[0] ?? []

  return { variant, colors, name: seedRaw || fallbackName || "user" }
}

function getPaletteIndexFromSeed(seed: string): number {
  if (COLOR_PALETTES.length === 0) return 0

  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }

  return hash % COLOR_PALETTES.length
}

export type UserAvatarProps = {
  name: string
  avatarUrl?: string | null
  size?: UserAvatarSize
  alt?: string
  className?: string
  imageClassName?: string
  fallbackClassName?: string
}

export function UserAvatar({
  name,
  avatarUrl,
  size = "lg",
  alt,
  className,
  imageClassName,
  fallbackClassName,
}: UserAvatarProps) {
  const boringAvatar = parseBoringAvatar(avatarUrl, name)
  const generatedFallback = parseBoringAvatar(
    `boring-avatar:marble:${getPaletteIndexFromSeed(name)}:${name}`,
    name
  )
  const src = boringAvatar ? undefined : safeAvatarSrc(avatarUrl)
  const label = alt ?? name

  return (
    <Avatar className={cn(SIZE_CLASSES[size], className)}>
      {src ? <AvatarImage src={src} alt={label} className={imageClassName} /> : null}

      {boringAvatar ? (
        <AvatarFallback className={cn("bg-transparent p-0", fallbackClassName)}>
          <BoringAvatar
            size={80}
            name={boringAvatar.name}
            variant={boringAvatar.variant}
            colors={boringAvatar.colors}
            className="size-full"
            aria-label={label}
          />
        </AvatarFallback>
      ) : (
        <AvatarFallback className={cn("bg-transparent p-0", fallbackClassName)}>
          {generatedFallback ? (
            <BoringAvatar
              size={80}
              name={generatedFallback.name}
              variant={generatedFallback.variant}
              colors={generatedFallback.colors}
              className="size-full"
              aria-label={label}
            />
          ) : (
            <span className="text-sm font-semibold">U</span>
          )}
        </AvatarFallback>
      )}
    </Avatar>
  )
}

