import { z } from "zod"

export const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  phone: z.string().max(20).optional().nullable(),
  shipping_region: z.string().max(100).optional().nullable(),
  country_code: z.string().max(2).optional().nullable(),
})

export const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const ALLOWED_AVATAR_VARIANTS = ["marble", "pixel", "sunset", "ring", "bauhaus"] as const

function getPaletteIndexFromSeed(seed: string): number {
  const paletteCount = 6
  if (seed.length === 0) return 0

  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0
  }

  return hash % paletteCount
}

export function buildGeneratedAvatar(seed: string, paletteIndex?: number): string {
  const resolvedSeed = seed.trim().length > 0 ? seed.trim() : "user"
  const resolvedPalette = paletteIndex ?? getPaletteIndexFromSeed(resolvedSeed)
  return `boring-avatar:marble:${resolvedPalette}:${resolvedSeed}`
}

export function isGeneratedAvatar(value: string): boolean {
  if (!value.startsWith("boring-avatar:")) return false
  const [, variant, palette, seed] = value.split(":")
  if (!variant || !palette || !seed) return false
  if (!ALLOWED_AVATAR_VARIANTS.includes(variant as (typeof ALLOWED_AVATAR_VARIANTS)[number])) return false
  return Number.isInteger(Number.parseInt(palette, 10))
}

function isSafeAvatarUrl(value: string): boolean {
  if (isGeneratedAvatar(value)) return true
  try {
    const parsed = new URL(value)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

export const avatarUrlSchema = z.object({
  avatar_url: z
    .string()
    .max(500, "Avatar URL too long")
    .refine((value) => isSafeAvatarUrl(value), "Invalid avatar value"),
})

