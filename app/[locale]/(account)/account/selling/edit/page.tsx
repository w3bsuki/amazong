"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useLocale } from "next-intl"
import { EditProductClient } from "./edit-product-client"
import { Skeleton } from "@/components/ui/skeleton"

function EditProductContent() {
  const searchParams = useSearchParams()
  const locale = useLocale()
  const productId = searchParams.get("id")
  
  if (!productId) {
    return (
      <div className="py-8">
        <p className="text-muted-foreground">
          {locale === 'bg' ? 'Липсва ID на продукт' : 'Missing product ID'}
        </p>
      </div>
    )
  }
  
  return <EditProductClient productId={productId} locale={locale} />
}

export default function EditProductPage() {
  return (
    <Suspense fallback={
      <div className="py-4 sm:py-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    }>
      <EditProductContent />
    </Suspense>
  )
}
