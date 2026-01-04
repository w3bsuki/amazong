/**
 * Avatar color palettes for boring-avatars library.
 * Note: boring-avatars requires hex colors, not CSS variables.
 */

export const AVATAR_VARIANTS = ["marble", "beam", "pixel", "sunset", "ring", "bauhaus"] as const
export type AvatarVariant = (typeof AVATAR_VARIANTS)[number]

export const COLOR_PALETTES: string[][] = [
  ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
  ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
  ["#6C5CE7", "#A29BFE", "#FD79A8", "#FDCB6E", "#00B894"],
  ["#2D3436", "#636E72", "#B2BEC3", "#DFE6E9", "#74B9FF"],
  ["#E17055", "#FDCB6E", "#00B894", "#0984E3", "#6C5CE7"],
  ["#FF7675", "#74B9FF", "#55EFC4", "#FFEAA7", "#DFE6E9"],
]

export const DEFAULT_PALETTE = COLOR_PALETTES[0]

export function getColorPalette(index: number): string[] {
  const palette = COLOR_PALETTES[index % COLOR_PALETTES.length]
  return palette ? [...palette] : [...DEFAULT_PALETTE!]
}
