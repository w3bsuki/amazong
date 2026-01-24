"use client"

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

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"

  const first = parts[0]?.[0] ?? ""
  const second = parts.length > 1 ? parts[1]?.[0] ?? "" : parts[0]?.[1] ?? ""
  const initials = (first + second).toUpperCase()

  return initials || "?"
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
          />
        </AvatarFallback>
      ) : (
        <AvatarFallback className={cn("text-sm font-semibold", fallbackClassName)}>
          {initialsFromName(name)}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
