/**
 * Image Optimization Utilities (Client-Safe)
 *
 * Keep this module browser-safe: it is imported by client components.
 */

type BufferLike = {
  from: (input: string, encoding?: string) => { toString: (encoding: string) => string }
}

function toBase64(value: string): string {
  if (typeof globalThis.btoa === "function") {
    // SVG strings we generate here are ASCII-only; btoa is safe.
    return globalThis.btoa(value)
  }

  const globalScope = globalThis as typeof globalThis & { Buffer?: BufferLike }
  const buffer = globalScope.Buffer
  if (buffer?.from) return buffer.from(value, "utf8").toString("base64")

  throw new Error("Base64 encoding is not available in this environment")
}

/**
 * Generates a simple grayscale blur placeholder for product images
 * Uses a neutral gray color that works well with mix-blend-multiply
 */
export const productBlurDataURL = (): string => {
  const svg = `
    <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
      <rect width="10" height="10" fill="#e5e7eb"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${toBase64(svg)}`
}

/**
 * Determines if an image should be loaded eagerly based on its position
 * First N images above the fold should load eagerly
 * 
 * @param index - The index of the image in a list
 * @param threshold - Number of images to load eagerly (default: 4)
 */
export const getImageLoadingStrategy = (index: number, threshold: number = 4): {
  loading: "eager" | "lazy"
  priority: boolean
  fetchPriority?: "high" | "low" | "auto"
} => {
  if (index < threshold) {
    return {
      loading: "eager",
      priority: index === 0, // Only first image gets priority
      fetchPriority: index < 2 ? "high" : "auto"
    }
  }
  
  return {
    loading: "lazy",
    priority: false,
    fetchPriority: "auto"
  }
}
