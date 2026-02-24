"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowLeft } from "lucide-react"
import { Link, useRouter } from "@/i18n/routing"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { AppBreadcrumb } from "../../../../_components/navigation/app-breadcrumb"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { calculateSaleDiscount, toSaleEndDateIso } from "./edit-product.utils"
import { validateEditProduct } from "./edit-product.validation"
import { EditProductBasicInfoSection } from "./edit-product-basic-info-section"
import { EditProductPricingSection } from "./edit-product-pricing-section"
import { EditProductShippingSection } from "./edit-product-shipping-section"
import { EditProductSidebarSection } from "./edit-product-sidebar-section"
import type { EditableProduct, EditProductClientProps } from "./edit-product.types"

export function EditProductClient({ productId, locale }: EditProductClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations("SellerManagement")
  const tSell = useTranslations("Sell")

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [product, setProduct] = useState<EditableProduct | null>(null)
  const [sellerUsername, setSellerUsername] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  const [isOnSale, setIsOnSale] = useState(false)
  const [originalPrice, setOriginalPrice] = useState("")
  const [saleEndDateLocal, setSaleEndDateLocal] = useState("")

  const [shipsBulgaria, setShipsBulgaria] = useState(true)
  const [shipsEurope, setShipsEurope] = useState(false)
  const [shipsUSA, setShipsUSA] = useState(false)
  const [shipsWorldwide, setShipsWorldwide] = useState(false)
  const [sellerCity, setSellerCity] = useState<string>("")

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(value)

  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle()
      setSellerUsername(profile?.username ?? null)

      const { data, error } = await supabase
        .from("products")
        .select(
          "id,title,slug,description,price,list_price,is_on_sale,sale_percent,sale_end_date,seller_city,stock,images,is_boosted,boost_expires_at,is_featured,ships_to_bulgaria,ships_to_europe,ships_to_usa,ships_to_worldwide",
        )
        .eq("id", productId)
        .eq("seller_id", user.id)
        .single()

      if (error || !data) {
        toast({
          title: t("selling.edit.toast.errorTitle"),
          description: t("selling.edit.toast.productNotFound"),
          variant: "destructive",
        })
        router.push("/account/selling")
        return
      }

      setProduct(data)
      setTitle(data.title)
      setDescription(data.description || "")
      setPrice(String(data.price))
      setStock(String(data.stock))
      setShipsBulgaria(data.ships_to_bulgaria ?? true)
      setShipsEurope(data.ships_to_europe ?? false)
      setShipsUSA(data.ships_to_usa ?? false)
      setShipsWorldwide(data.ships_to_worldwide ?? false)
      setSellerCity((data.seller_city as string | null) || "")

      const truthOnSale = Boolean(data.is_on_sale) && (Number(data.sale_percent) || 0) > 0
      const legacyOnSale = Boolean(data.list_price && data.list_price > data.price)

      if (truthOnSale || legacyOnSale) {
        setIsOnSale(true)
        if (data.list_price && data.list_price > data.price) {
          setOriginalPrice(String(data.list_price))
        } else {
          setOriginalPrice("")
        }
      }

      if (data.sale_end_date) {
        const dateValue = new Date(data.sale_end_date)
        if (!Number.isNaN(dateValue.getTime())) {
          const tzOffsetMs = dateValue.getTimezoneOffset() * 60 * 1000
          const local = new Date(dateValue.getTime() - tzOffsetMs)
          setSaleEndDateLocal(local.toISOString().slice(0, 16))
        }
      } else {
        setSaleEndDateLocal("")
      }

      setIsLoading(false)
    }

    fetchProduct()
  }, [productId, router, t, toast])

  const discountPercent = calculateSaleDiscount({ isOnSale, originalPrice, price })

  const handleSave = async () => {
    if (!product) return

    setIsSaving(true)
    const errorTitle = t("selling.edit.toast.errorTitle")

    const validationError = validateEditProduct({
      title,
      price,
      stock,
      isOnSale,
      originalPrice,
      shipsBulgaria,
      shipsEurope,
      shipsUSA,
      shipsWorldwide,
      sellerCity,
      t,
      tSell,
    })

    if (validationError) {
      toast({
        title: errorTitle,
        description: validationError,
        variant: "destructive",
      })
      setIsSaving(false)
      return
    }

    const parsedPrice = Number.parseFloat(price)
    const parsedStock = Number.parseInt(stock, 10)
    const parsedOriginalPrice = Number.parseFloat(originalPrice)
    const supabase = createClient()

    const updateData: Record<string, unknown> = {
      title: title.trim(),
      description: description || null,
      price: parsedPrice,
      stock: parsedStock,
      ships_to_bulgaria: shipsBulgaria,
      ships_to_europe: shipsEurope,
      ships_to_usa: shipsUSA,
      ships_to_worldwide: shipsWorldwide,
      seller_city: sellerCity || null,
    }

    if (isOnSale && originalPrice) {
      updateData.list_price = parsedOriginalPrice
      updateData.is_on_sale = true
      updateData.sale_percent = discountPercent
      updateData.sale_end_date = toSaleEndDateIso(saleEndDateLocal)
    } else {
      updateData.list_price = null
      updateData.is_on_sale = false
      updateData.sale_percent = 0
      updateData.sale_end_date = null
    }

    const { error } = await supabase.from("products").update(updateData).eq("id", productId)

    if (error) {
      toast({
        title: errorTitle,
        description: t("selling.edit.toast.failedToSave"),
        variant: "destructive",
      })
    } else {
      toast({
        title: t("selling.edit.toast.successTitle"),
        description: t("selling.edit.toast.changesSaved"),
      })
      router.push("/account/selling")
    }

    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="py-4 sm:py-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-(--spacing-scroll-xl) w-full" />
      </div>
    )
  }

  return (
    <div className="py-4 sm:py-6">
      <AppBreadcrumb
        items={[
          { label: t("selling.edit.breadcrumb.account"), href: "/account" },
          { label: t("selling.edit.breadcrumb.myStore"), href: "/account/selling" },
          { label: t("selling.edit.breadcrumb.edit") },
        ]}
      />

      <div className="flex items-center gap-4 mt-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/account/selling" aria-label={t("selling.edit.breadcrumb.myStore")}>
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t("selling.edit.header.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("selling.edit.header.description")}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-6">
          <EditProductBasicInfoSection
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            stock={stock}
            setStock={setStock}
          />
          <EditProductPricingSection
            isOnSale={isOnSale}
            setIsOnSale={setIsOnSale}
            price={price}
            setPrice={setPrice}
            originalPrice={originalPrice}
            setOriginalPrice={setOriginalPrice}
            saleEndDateLocal={saleEndDateLocal}
            setSaleEndDateLocal={setSaleEndDateLocal}
            discountPercent={discountPercent}
          />
          <EditProductShippingSection
            locale={locale}
            shipsBulgaria={shipsBulgaria}
            setShipsBulgaria={setShipsBulgaria}
            shipsEurope={shipsEurope}
            setShipsEurope={setShipsEurope}
            shipsUSA={shipsUSA}
            setShipsUSA={setShipsUSA}
            shipsWorldwide={shipsWorldwide}
            setShipsWorldwide={setShipsWorldwide}
            sellerCity={sellerCity}
            setSellerCity={setSellerCity}
          />
        </div>

        <EditProductSidebarSection
          product={product}
          title={title}
          isOnSale={isOnSale}
          discountPercent={discountPercent}
          price={price}
          originalPrice={originalPrice}
          locale={locale}
          productId={productId}
          sellerUsername={sellerUsername}
          isSaving={isSaving}
          onSave={handleSave}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  )
}
