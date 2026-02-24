import { z } from "zod"
import { getCategoryContext } from '@/lib/data/categories'
import { cachedJsonResponse, noStoreJson } from "@/lib/api/response-helpers"

const CategoryContextParamsSchema = z
  .object({
    slug: z.string().trim().min(1).max(64),
  })
  .strict()

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const parsedParams = CategoryContextParamsSchema.safeParse(await params)
  if (!parsedParams.success) {
    return noStoreJson({ error: "Slug is required" }, { status: 400 })
  }
  const { slug } = parsedParams.data

  try {
    const context = await getCategoryContext(slug)

    if (!context) {
      return noStoreJson({ error: "Category not found" }, { status: 404 })
    }

    return cachedJsonResponse(context, "categories")
  } catch (error) {
    console.error('Error fetching category context:', error)
    return noStoreJson({ error: "Internal server error" }, { status: 500 })
  }
}
