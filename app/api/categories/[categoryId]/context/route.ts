import { z } from "zod"
import { getCategoryContextById } from '@/lib/data/categories'
import { cachedJsonResponse, noStoreJson } from "@/lib/api/response-helpers"

import { logger } from "@/lib/logger"
const CategoryContextParamsSchema = z
  .object({
    categoryId: z.string().uuid(),
  })
  .strict()

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const parsedParams = CategoryContextParamsSchema.safeParse(await params)
  if (!parsedParams.success) {
    return noStoreJson({ error: "Category ID is required" }, { status: 400 })
  }
  const { categoryId } = parsedParams.data

  try {
    const context = await getCategoryContextById(categoryId)

    if (!context) {
      return noStoreJson({ error: "Category not found" }, { status: 404 })
    }

    return cachedJsonResponse(context, "categories")
  } catch (error) {
    logger.error('Error fetching category context:', error)
    return noStoreJson({ error: "Internal server error" }, { status: 500 })
  }
}
