import { NextRequest, NextResponse } from "next/server"

import { fetchProductByUsernameAndSlug } from "@/lib/data/product-page"
import { isNextPrerenderInterrupted } from "@/lib/next/is-next-prerender-interrupted"
import { PLACEHOLDER_IMAGE_PATH } from "@/lib/normalize-image-url"

// Align CDN cache headers with next.config.ts cacheLife.products
const CACHE_TTL_SECONDS = 300
const CACHE_STALE_WHILE_REVALIDATE = 60

/**
 * GET /api/products/quick-view?username={username}&productSlug={slugOrId}
 *
 * Returns a small JSON payload suitable for client-side "quick view" overlays.
 * This keeps the browsing URL stable while enabling richer modal content.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const productSlug = searchParams.get("productSlug")

    if (!username || !productSlug) {
      return NextResponse.json(
        { error: "username and productSlug are required" },
        { status: 400 },
      )
    }

    const product = await fetchProductByUsernameAndSlug(username, productSlug)
    if (!product) {
      return NextResponse.json({ error: "not_found" }, { status: 404 })
    }

    const imagesFromProductImages = [...(product.product_images ?? [])]
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((img) => img.image_url)
      .filter((url): url is string => typeof url === "string" && url.length > 0)

    const imagesFromArray = (product.images ?? []).filter(
      (url): url is string => typeof url === "string" && url.length > 0,
    )

    const images = imagesFromProductImages.length ? imagesFromProductImages : imagesFromArray
    const primaryImage = images[0] ?? PLACEHOLDER_IMAGE_PATH

    const sellerUsername = product.seller?.username ?? null
    const sellerName = product.seller?.display_name || product.seller?.username || null
    const sellerVerified = Boolean(product.seller?.verified)

    return NextResponse.json(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: primaryImage,
        ...(images.length ? { images } : {}),
        ...(product.list_price != null ? { originalPrice: product.list_price } : {}),
        ...(product.description != null ? { description: product.description } : {}),
        ...(product.condition != null ? { condition: product.condition } : {}),
        ...(typeof product.rating === "number" ? { rating: product.rating } : {}),
        ...(typeof product.review_count === "number" ? { reviews: product.review_count } : {}),
        ...(typeof product.stock === "number" ? { inStock: product.stock > 0 } : {}),
        ...(product.slug != null ? { slug: product.slug } : {}),
        ...(sellerUsername != null ? { username: sellerUsername } : {}),
        ...(typeof product.seller?.id === "string" ? { sellerId: product.seller.id } : {}),
        ...(sellerName != null ? { sellerName } : {}),
        ...(product.seller?.avatar_url != null ? { sellerAvatarUrl: product.seller.avatar_url } : {}),
        sellerVerified,
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
          "CDN-Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
          "Vercel-CDN-Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
        },
      },
    )
  } catch (error) {
    if (isNextPrerenderInterrupted(error)) throw error
    console.error("Quick view API error:", error)
    return NextResponse.json({ error: "internal_error" }, { status: 500 })
  }
}

