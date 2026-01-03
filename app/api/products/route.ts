
import { type NextRequest } from "next/server"
import { POST as createProduct } from "./create/route"

/**
 * @deprecated Use /api/products/create instead.
 * This route forwards to /api/products/create for backwards compatibility.
 * Will be removed in a future release.
 */
export async function POST(request: NextRequest) {
  // Forward to the canonical create endpoint
  return createProduct(request)
}