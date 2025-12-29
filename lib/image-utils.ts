/**
 * Image Optimization Utilities for Phase 3 Performance
 * 
 * Provides utilities for:
 * - Blur placeholder generation
 * - Image URL optimization
 * - Responsive image sizing
 */

/**
 * A simple shimmer effect as a base64 SVG for blur placeholder
 * This is a lightweight approach that doesn't require server-side processing
 */
export const shimmerBlurDataURL = (w: number = 10, h: number = 10): string => {
  const shimmer = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="0%"/>
          <stop stop-color="#edeef1" offset="50%"/>
          <stop stop-color="#f6f7f8" offset="100%"/>
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f6f7f8"/>
      <rect id="r" width="${w}" height="${h}" fill="url(#g)"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(shimmer).toString('base64')}`
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
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Default blur placeholder for hero/banner images
 * Uses a darker gradient suitable for hero sections
 */
export const heroBlurDataURL = (): string => {
  const svg = `
    <svg width="100" height="40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#374151;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1f2937;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100" height="40" fill="url(#hero-grad)"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Category/subcategory image blur placeholder
 * Uses a light neutral color
 */
export const categoryBlurDataURL = (): string => {
  const svg = `
    <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
      <rect width="10" height="10" fill="#f3f4f6"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
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

/**
 * Image sizing configuration for responsive images
 * Returns optimized sizes prop based on component usage
 */
export const imageSizes = {
  productCard: {
    default: "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw",
    grid: "(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw",
    compact: "(max-width: 640px) 40vw, (max-width: 768px) 30vw, 20vw",
    carousel: "(max-width: 640px) 40vw, (max-width: 768px) 25vw, 16vw"
  },
  hero: "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1500px",
  category: "(max-width: 640px) 25vw, (max-width: 1024px) 15vw, 140px",
  productDetail: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px",
  thumbnail: "80px"
} as const

/**
 * Placeholder SVG for missing images
 * Returns a branded placeholder with the Treido logo style
 */
export const placeholderSvg = (): string => {
  const svg = `
    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#f3f4f6"/>
      <text x="200" y="200" font-family="system-ui, sans-serif" font-size="48" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">
        📦
      </text>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}
