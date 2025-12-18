"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Package,
  Tag,
  CurrencyCircleDollar,
  Percent,
  FloppyDisk,
  Lightning,
} from "@phosphor-icons/react"

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  list_price: number | null
  stock: number
  images: string[] | null
  is_boosted: boolean | null
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

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  
  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  
  // Discount state
  const [isOnSale, setIsOnSale] = useState(false)
  const [originalPrice, setOriginalPrice] = useState("")
  
  // Boost state
  const [isBoosted, setIsBoosted] = useState(false)
  
  // Shipping state
  const [shipsBulgaria, setShipsBulgaria] = useState(true)
  const [shipsEurope, setShipsEurope] = useState(false)
  const [shipsUSA, setShipsUSA] = useState(false)
  const [shipsWorldwide, setShipsWorldwide] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      const supabase = createClient()
      
      // Check auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push(`/${locale}/auth/login`)
        return
      }

      // Fetch product
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("seller_id", user.id)
        .single()

      if (error || !data) {
        toast({
          title: locale === 'bg' ? 'Грешка' : 'Error',
          description: locale === 'bg' ? 'Продуктът не е намерен' : 'Product not found',
          variant: 'destructive'
        })
        router.push(`/${locale}/account/selling`)
        return
      }

      setProduct(data)
      setTitle(data.title)
      setDescription(data.description || "")
      setPrice(String(data.price))
      setStock(String(data.stock))
      setIsBoosted(data.is_boosted || false)
      setShipsBulgaria(data.ships_to_bulgaria ?? true)
      setShipsEurope(data.ships_to_europe ?? false)
      setShipsUSA(data.ships_to_usa ?? false)
      setShipsWorldwide(data.ships_to_worldwide ?? false)
      
      // Check if product is on sale (has list_price > price)
      if (data.list_price && data.list_price > data.price) {
        setIsOnSale(true)
        setOriginalPrice(String(data.list_price))
      }
      
      setIsLoading(false)
    }

    fetchProduct()
  }, [productId, router, locale, toast])

  const calculateDiscount = () => {
    if (!isOnSale || !originalPrice || !price) return 0
    const orig = parseFloat(originalPrice)
    const current = parseFloat(price)
    if (orig <= 0 || current >= orig) return 0
    return Math.round(((orig - current) / orig) * 100)
  }

  const handleSave = async () => {
    if (!product) return
    
    setIsSaving(true)
    const supabase = createClient()

    const updateData: Record<string, unknown> = {
      title,
      description: description || null,
      price: parseFloat(price),
      stock: parseInt(stock),
      is_boosted: isBoosted,
      ships_to_bulgaria: shipsBulgaria,
      ships_to_europe: shipsEurope,
      ships_to_usa: shipsUSA,
      ships_to_worldwide: shipsWorldwide,
    }

    // Handle discount pricing
    if (isOnSale && originalPrice) {
      updateData.list_price = parseFloat(originalPrice)
    } else {
      updateData.list_price = null
    }

    const { error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", productId)

    if (error) {
      toast({
        title: locale === 'bg' ? 'Грешка' : 'Error',
        description: locale === 'bg' ? 'Неуспешно запазване' : 'Failed to save changes',
        variant: 'destructive'
      })
    } else {
      toast({
        title: locale === 'bg' ? 'Успех!' : 'Success!',
        description: locale === 'bg' ? 'Промените са запазени' : 'Changes saved successfully',
      })
      router.push(`/${locale}/account/selling`)
    }

    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="py-4 sm:py-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  return (
    <div className="py-4 sm:py-6">
      {/* Breadcrumb */}
      <AppBreadcrumb items={[
        { label: locale === 'bg' ? 'Акаунт' : 'Account', href: '/account' },
        { label: locale === 'bg' ? 'Моят магазин' : 'My Store', href: '/account/selling' },
        { label: locale === 'bg' ? 'Редактиране' : 'Edit Product' }
      ]} />

        {/* Header */}
        <div className="flex items-center gap-4 mt-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${locale}/account/selling`}>
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {locale === 'bg' ? 'Редактиране на продукт' : 'Edit Product'}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {locale === 'bg' ? 'Променете детайли, цена и настройки' : 'Update details, pricing, and settings'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="size-5" />
                  {locale === 'bg' ? 'Основна информация' : 'Basic Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{locale === 'bg' ? 'Заглавие' : 'Title'}</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={locale === 'bg' ? 'Име на продукта' : 'Product name'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{locale === 'bg' ? 'Описание' : 'Description'}</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={locale === 'bg' ? 'Описание на продукта' : 'Product description'}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">{locale === 'bg' ? 'Количество в склад' : 'Stock Quantity'}</Label>
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
                  {locale === 'bg' ? 'Цена и намаление' : 'Pricing & Discount'}
                </CardTitle>
                <CardDescription>
                  {locale === 'bg' 
                    ? 'Задайте редовна цена или активирайте намаление' 
                    : 'Set regular price or enable a sale discount'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Regular Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">
                    {isOnSale 
                      ? (locale === 'bg' ? 'Цена с намаление' : 'Sale Price')
                      : (locale === 'bg' ? 'Цена' : 'Price')
                    } (лв)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={isOnSale ? "border-green-500 focus:ring-green-500" : ""}
                  />
                </div>

                <Separator />

                {/* Sale Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-deal/10 flex items-center justify-center">
                      <Percent className="size-5 text-deal" />
                    </div>
                    <div>
                      <Label htmlFor="sale-toggle" className="text-base font-medium cursor-pointer">
                        {locale === 'bg' ? 'Включи намаление' : 'Enable Sale'}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {locale === 'bg' 
                          ? 'Показва зачеркната оригинална цена' 
                          : 'Shows strikethrough original price'}
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
                  <div className="space-y-4 p-4 bg-deal/5 border border-deal/20 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice" className="text-deal font-medium">
                        {locale === 'bg' ? 'Оригинална цена' : 'Original Price'} (лв)
                      </Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder={locale === 'bg' ? 'Цена преди намаление' : 'Price before discount'}
                      />
                    </div>
                    
                    {calculateDiscount() > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-deal/10 rounded-md">
                        <Tag className="size-4 text-deal" weight="fill" />
                        <span className="text-sm font-medium text-deal">
                          {locale === 'bg' 
                            ? `Купувачите ще видят ${calculateDiscount()}% намаление`
                            : `Buyers will see ${calculateDiscount()}% off`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Destinations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === 'bg' ? 'Доставка до' : 'Ships To'}
                </CardTitle>
                <CardDescription>
                  {locale === 'bg' 
                    ? 'Изберете региони за доставка' 
                    : 'Select shipping destinations'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇧🇬</span>
                      <span className="text-sm font-medium">{locale === 'bg' ? 'България' : 'Bulgaria'}</span>
                    </div>
                    <Switch checked={shipsBulgaria} onCheckedChange={setShipsBulgaria} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇪🇺</span>
                      <span className="text-sm font-medium">{locale === 'bg' ? 'Европа' : 'Europe'}</span>
                    </div>
                    <Switch checked={shipsEurope} onCheckedChange={setShipsEurope} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇺🇸</span>
                      <span className="text-sm font-medium">{locale === 'bg' ? 'САЩ' : 'USA'}</span>
                    </div>
                    <Switch checked={shipsUSA} onCheckedChange={setShipsUSA} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌍</span>
                      <span className="text-sm font-medium">{locale === 'bg' ? 'По целия свят' : 'Worldwide'}</span>
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
                <CardTitle className="text-base">{locale === 'bg' ? 'Преглед' : 'Preview'}</CardTitle>
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
                    <div className="absolute top-2 left-2 bg-deal text-white text-xs font-bold px-2 py-1 rounded">
                      -{calculateDiscount()}%
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
                <div className="mt-2">
                  {isOnSale && originalPrice ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-deal">{parseFloat(price || "0").toFixed(2)} лв</span>
                      <span className="text-sm text-muted-foreground line-through">{parseFloat(originalPrice).toFixed(2)} лв</span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold">{parseFloat(price || "0").toFixed(2)} лв</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Boost Option */}
            <Card className={isBoosted ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightning className="size-5 text-primary" weight="fill" />
                  {locale === 'bg' ? 'Промотирай' : 'Boost Listing'}
                </CardTitle>
                <CardDescription>
                  {locale === 'bg' 
                    ? 'Показва се на начална страница' 
                    : 'Featured on homepage'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {locale === 'bg' ? 'Активирай промоция' : 'Enable boost'}
                  </span>
                  <Switch checked={isBoosted} onCheckedChange={setIsBoosted} />
                </div>
                {isBoosted && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {locale === 'bg' 
                      ? '✨ Продуктът ще се показва в "Препоръчани продукти"' 
                      : '✨ Product will appear in "Recommended Products"'}
                  </p>
                )}
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
              {isSaving 
                ? (locale === 'bg' ? 'Запазване...' : 'Saving...') 
                : (locale === 'bg' ? 'Запази промените' : 'Save Changes')
              }
            </Button>

            <Button variant="outline" className="w-full" asChild>
              <Link href={`/${locale}/product/${productId}`}>
                {locale === 'bg' ? 'Виж продукта' : 'View Product'}
              </Link>
            </Button>
          </div>
        </div>
    </div>
  )
}
