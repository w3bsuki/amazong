import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeAvatarSrc(src: string | null | undefined): string | undefined {
  if (!src) return undefined
  // Generated avatars are stored as a pseudo-URL format and must not be fetched by the browser.
  if (src.startsWith("boring-avatar:")) return undefined

  // Allow only known-safe URL schemes for <img src="...">.
  // This prevents "ERR_UNKNOWN_URL_SCHEME" and blocks unsafe schemes like `javascript:`.
  if (src.startsWith("http://")) return src
  if (src.startsWith("https://")) return src
  if (src.startsWith("/")) return src
  if (src.startsWith("data:")) return src
  if (src.startsWith("blob:")) return src

  return undefined
}
