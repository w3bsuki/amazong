import { Suspense } from "react"
import { EditProductClient } from "../../edit/edit-product-client"
import { Skeleton } from "@/components/ui/skeleton"

export default async function EditProductPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id, locale } = await params

  return (
    <Suspense
      fallback={
        <div className="py-4 sm:py-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-(--spacing-scroll-xl) w-full" />
        </div>
      }
    >
      <EditProductClient productId={id} locale={locale} />
    </Suspense>
  )
}
