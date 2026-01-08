import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { EditProductClient } from "./edit-product-client"

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ id?: string }>
}) {
  const { locale } = await params
  const { id: productId } = await searchParams

  if (!productId) {
    return (
      <div className="py-8">
        <p className="text-muted-foreground">{locale === "bg" ? "\u041b\u0438\u043f\u0441\u0432\u0430 ID \u043d\u0430 \u043f\u0440\u043e\u0434\u0443\u043a\u0442" : "Missing product ID"}</p>
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="py-4 sm:py-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-(--spacing-scroll-xl) w-full" />
        </div>
      }
    >
      <EditProductClient productId={productId} locale={locale} />
    </Suspense>
  )
}
