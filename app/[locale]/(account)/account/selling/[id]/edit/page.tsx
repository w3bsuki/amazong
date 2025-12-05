"use client"

import { Suspense } from "react"
import { useParams } from "next/navigation"
import { useLocale } from "next-intl"
import { EditProductClient } from "../../edit/edit-product-client"
import { Skeleton } from "@/components/ui/skeleton"

function EditProductContent() {
  const params = useParams()
  const locale = useLocale()
  const id = params.id as string
  
  return <EditProductClient productId={id} locale={locale} />
}

export default function EditProductPage() {
  return (
    <Suspense fallback={
      <div className="container py-4 sm:py-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    }>
      <EditProductContent />
    </Suspense>
  )
}
