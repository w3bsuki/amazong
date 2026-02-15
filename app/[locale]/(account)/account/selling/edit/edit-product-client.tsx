"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/routing"
import { Link } from "@/i18n/routing"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { AppBreadcrumb } from "../../../../_components/navigation/app-breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BULGARIAN_CITIES } from "@/lib/bulgarian-cities"
import { useToast } from "@/hooks/use-toast"
import { BoostDialog } from "../../../../_components/seller/boost-dialog"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  Package,
  Tag,
  CurrencyCircleDollar,
  Percent,
  FloppyDisk,
  Lightning,
} from "@/lib/icons/phosphor"

interface Product {
  id: string
  title: string
  slug?: string | null
  description: string | null
  price: number
  list_price: number | null
  is_on_sale?: boolean | null
  sale_percent?: number | null
  sale_end_date?: string | null
  seller_city?: string | null
  stock: number
  images: string[] | null
  is_boosted: boolean | null
  boost_expires_at: string | null
  is_featured: boolean | null
  ships_to_bulgaria: boolean | null
  ships_to_europe: boolean | null
  ships_to_usa: boolean | null
  ships_to_worldwide: boolean | null
  [key: string]: unknown // Allow other DB fields
}

interface EditProductClientProps {
  productId: string
  locale: string
}

export function EditProductClient({ productId, locale }: EditProductClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations("SellerManagement")

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [sellerUsername, setSellerUsername] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  // Discount state
  const [isOnSale, setIsOnSale] = useState(false)
  const [originalPrice, setOriginalPrice] = useState("")
  const [saleEndDateLocal, setSaleEndDateLocal] = useState("")

  // Boost state
  // Shipping state
  const [shipsBulgaria, setShipsBulgaria] = useState(true)
  const [shipsEurope, setShipsEurope] = useState(false)
  const [shipsUSA, setShipsUSA] = useState(false)
  const [shipsWorldwide, setShipsWorldwide] = useState(false)
  const [sellerCity, setSellerCity] = useState<string>("")

  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient()

      // Check auth
      const { data: { user } } = await supabase.auth.getUser()
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

      // Fetch product
      const { data, error } = await supabase
        .from("products")
        .select(
          "id,title,slug,description,price,list_price,is_on_sale,sale_percent,sale_end_date,seller_city,stock,images,is_boosted,boost_expires_at,is_featured,ships_to_bulgaria,ships_to_europe,ships_to_usa,ships_to_worldwide"
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

      // Truth semantics: prefer explicit sale fields; fall back to legacy list_price > price.
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
        const d = new Date(data.sale_end_date)
        if (!Number.isNaN(d.getTime())) {
          // Convert to datetime-local value in local time.
          const tzOffsetMs = d.getTimezoneOffset() * 60 * 1000
          const local = new Date(d.getTime() - tzOffsetMs)
          setSaleEndDateLocal(local.toISOString().slice(0, 16))
        }
      } else {
        setSaleEndDateLocal("")
      }

      setIsLoading(false)
    }

    fetchProduct()
  }, [productId, router, locale, toast])

  const calculateDiscount = () => {
    if (!isOnSale || !originalPrice || !price) return 0
    const orig = Number.parseFloat(originalPrice)
    const current = Number.parseFloat(price)
    if (orig <= 0 || current >= orig) return 0
    return Math.round(((orig - current) / orig) * 100)
  }

  const getSaleEndDateIso = (): string | null => {
    if (!saleEndDateLocal) return null
    const d = new Date(saleEndDateLocal)
    if (Number.isNaN(d.getTime())) return null
    return d.toISOString()
  }

  const handleSave = async () => {
    if (!product) return

    setIsSaving(true)
    const supabase = createClient()

    const updateData: Record<string, unknown> = {
      title,
      description: description || null,
      price: Number.parseFloat(price),
      stock: Number.parseInt(stock),
      ships_to_bulgaria: shipsBulgaria,
      ships_to_europe: shipsEurope,
      ships_to_usa: shipsUSA,
      ships_to_worldwide: shipsWorldwide,
      seller_city: sellerCity || null,
    }

    // Handle discount pricing
    if (isOnSale && originalPrice) {
      updateData.list_price = Number.parseFloat(originalPrice)
      updateData.is_on_sale = true
      updateData.sale_percent = calculateDiscount()
      updateData.sale_end_date = getSaleEndDateIso()
    } else {
      updateData.list_price = null
      updateData.is_on_sale = false
      updateData.sale_percent = 0
      updateData.sale_end_date = null
    }

    const { error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", productId)

    if (error) {
      toast({
        title: t("selling.edit.toast.errorTitle"),
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
      {/* Breadcrumb */}
      <AppBreadcrumb items={[
        { label: t("selling.edit.breadcrumb.account"), href: "/account" },
        { label: t("selling.edit.breadcrumb.myStore"), href: "/account/selling" },
        { label: t("selling.edit.breadcrumb.edit") }
      ]} />

      {/* Header */}
      <div className="flex items-center gap-4 mt-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/account/selling">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {t("selling.edit.header.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("selling.edit.header.description")}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="size-5" />
                {t("selling.edit.sections.basicInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("selling.edit.fields.title.label")}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("selling.edit.fields.title.placeholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("selling.edit.fields.description.label")}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("selling.edit.fields.description.placeholder")}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">{t("selling.edit.fields.stock.label")}</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Discount */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CurrencyCircleDollar className="size-5" />
                {t("selling.edit.sections.pricingDiscount")}
              </CardTitle>
              <CardDescription>
                {t("selling.edit.sections.pricingDiscountDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Regular Price */}
              <div className="space-y-2">
                <Label htmlFor="price">
                  {isOnSale
                    ? t("selling.edit.fields.price.saleLabel")
                    : t("selling.edit.fields.price.label")} (лв)
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={isOnSale ? "border-success focus:ring-success" : ""}
                />
              </div>

              <Separator />

              {/* Sale Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-destructive-subtle flex items-center justify-center">
                    <Percent className="size-5 text-deal" />
                  </div>
                  <div>
                    <Label htmlFor="sale-toggle" className="text-base font-medium cursor-pointer">
                      {t("selling.edit.sale.toggleLabel")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("selling.edit.sale.toggleDescription")}
                    </p>
                  </div>
                </div>
                <Switch
                  id="sale-toggle"
                  checked={isOnSale}
                  onCheckedChange={setIsOnSale}
                />
              </div>

              {/* Original Price (visible when sale is on) */}
              {isOnSale && (
                <div className="space-y-4 p-4 bg-destructive-subtle border border-destructive rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice" className="text-deal font-medium">
                      {t("selling.edit.fields.originalPrice.label")} (лв)
                    </Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder={t("selling.edit.fields.originalPrice.placeholder")}
                    />
                  </div>

                  {calculateDiscount() > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-destructive-subtle rounded-md">
                      <Tag className="size-4 text-deal" weight="fill" />
                      <span className="text-sm font-medium text-deal">
                        {t("selling.edit.sale.discountPreview", { percent: calculateDiscount() })}
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="saleEndDate" className="text-deal font-medium">
                      {t("selling.edit.fields.saleEndDate.label")}
                    </Label>
                    <Input
                      id="saleEndDate"
                      type="datetime-local"
                      value={saleEndDateLocal}
                      onChange={(e) => setSaleEndDateLocal(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Destinations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t("selling.edit.sections.shipping.title")}
              </CardTitle>
              <CardDescription>
                {t("selling.edit.sections.shipping.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shipsBulgaria && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("selling.edit.fields.city.label")}
                  </Label>
                  <Select value={sellerCity} onValueChange={setSellerCity}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder={t("selling.edit.fields.city.placeholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {BULGARIAN_CITIES.map((city) => (
                        <SelectItem key={city.value} value={city.value} className="font-medium">
                          {locale === 'bg' ? city.labelBg : city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {t("selling.edit.fields.city.help")}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇧🇬</span>
                    <span className="text-sm font-medium">{t("selling.edit.shippingDestinations.bulgaria")}</span>
                  </div>
                  <Switch checked={shipsBulgaria} onCheckedChange={setShipsBulgaria} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇪🇺</span>
                    <span className="text-sm font-medium">{t("selling.edit.shippingDestinations.europe")}</span>
                  </div>
                  <Switch checked={shipsEurope} onCheckedChange={setShipsEurope} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇺🇸</span>
                    <span className="text-sm font-medium">{t("selling.edit.shippingDestinations.usa")}</span>
                  </div>
                  <Switch checked={shipsUSA} onCheckedChange={setShipsUSA} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌍</span>
                    <span className="text-sm font-medium">{t("selling.edit.shippingDestinations.worldwide")}</span>
                  </div>
                  <Switch checked={shipsWorldwide} onCheckedChange={setShipsWorldwide} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("selling.edit.sidebar.previewTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                {product?.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="size-12 text-muted-foreground" />
                  </div>
                )}
                {isOnSale && calculateDiscount() > 0 && (
                  <div className="absolute top-2 left-2 bg-deal text-deal-foreground text-xs font-bold px-2 py-1 rounded">
                    -{calculateDiscount()}%
                  </div>
                )}
              </div>
              <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
              <div className="mt-2">
                {isOnSale && originalPrice ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-deal">{Number.parseFloat(price || "0").toFixed(2)} лв</span>
                    <span className="text-sm text-muted-foreground line-through">{Number.parseFloat(originalPrice).toFixed(2)} лв</span>
                  </div>
                ) : (
                  <span className="text-lg font-bold">{Number.parseFloat(price || "0").toFixed(2)} лв</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Boost Option */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightning className="size-5 text-primary" weight="fill" />
                {t("selling.edit.sidebar.boostTitle")}
              </CardTitle>
              <CardDescription>
                {t("selling.edit.sidebar.boostDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {product ? (
                <BoostDialog
                  product={{
                    id: product.id,
                    title: product.title,
                    ...(product.is_boosted != null ? { is_boosted: product.is_boosted } : {}),
                    boost_expires_at: product.boost_expires_at,
                  }}
                  locale={locale}
                />
              ) : null}
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full gap-2"
            size="lg"
          >
            <FloppyDisk className="size-5" />
            {isSaving ? t("selling.edit.actions.saving") : t("selling.edit.actions.save")}
          </Button>

          <Button variant="outline" className="w-full" asChild>
            <Link href={sellerUsername ? `/${sellerUsername}/${product?.slug || productId}` : "#"}>
              {t("selling.edit.actions.viewProduct")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

