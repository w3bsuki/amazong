import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeAvatarSrc(src: string | null | undefined): string | undefined {
  if (!src) return undefined
  // Generated avatars are stored as a pseudo-URL format and must not be fetched by the browser.
  if (src.startsWith("boring-avatar:")) return undefined
  return src
}
