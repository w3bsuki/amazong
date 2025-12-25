import { setRequestLocale } from "next-intl/server"

import { ProductDetail6 } from "@/components/product-detail6"

interface PreviewProductDetail6PageProps {
  params: Promise<{ locale: string }>
}

export default async function PreviewProductDetail6Page({ params }: PreviewProductDetail6PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-amber-50 text-amber-900">
        <div className="container py-2 text-sm">
          Preview: shadcnblocks product-detail6 component
        </div>
      </div>

      <ProductDetail6 />
    </div>
  )
}
