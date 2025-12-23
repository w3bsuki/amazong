"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Package, Globe, MapPin, Storefront, Truck, Clock } from "@phosphor-icons/react"
import { getDeliveryLabel, type ShippingRegion } from "@/lib/shipping"

// Shipping destination options with calculated delivery times
// These are WHERE the seller ships TO (not their location)
const SHIPPING_DESTINATIONS = [
  { 
    id: 'ships_to_bulgaria', 
    region: 'BG' as ShippingRegion,
    name: 'Bulgaria', 
    name_bg: 'България', 
    icon: MapPin,
    description: 'Доставка в рамките на България',
    description_en: 'Delivery within Bulgaria'
  },
  { 
    id: 'ships_to_europe', 
    region: 'EU' as ShippingRegion,
    name: 'Europe', 
    name_bg: 'Европа', 
    icon: Globe,
    description: 'Доставка до европейски държави',
    description_en: 'Delivery to European countries'
  },
  { 
    id: 'ships_to_usa', 
    region: 'US' as ShippingRegion,
    name: 'USA', 
    name_bg: 'САЩ', 
    icon: Truck,
    description: 'Доставка до Съединените щати',
    description_en: 'Delivery to United States'
  },
  { 
    id: 'ships_to_worldwide', 
    region: 'WW' as ShippingRegion,
    name: 'Worldwide', 
    name_bg: 'Целият свят', 
    icon: Package,
    description: 'Доставка по целия свят',
    description_en: 'Delivery worldwide'
  },
]

export function ProductForm({ userId, sellerCountryCode = 'BG' }: { userId: string; sellerCountryCode?: string }) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('ProductForm')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Shipping destination checkboxes - default to Bulgaria only
  const [shippingOptions, setShippingOptions] = useState({
    ships_to_bulgaria: true,
    ships_to_europe: false,
    ships_to_usa: false,
    ships_to_worldwide: false,
    pickup_only: false,
  })

  const toggleShipping = (key: keyof typeof shippingOptions) => {
    setShippingOptions(prev => {
      const newState = { ...prev, [key]: !prev[key] }
      // If pickup_only is enabled, disable all shipping options
      if (key === 'pickup_only' && !prev.pickup_only) {
        return {
          ships_to_bulgaria: false,
          ships_to_europe: false,
          ships_to_usa: false,
          ships_to_worldwide: false,
          pickup_only: true,
        }
      }
      // If any shipping option is enabled, disable pickup_only
      if (key !== 'pickup_only' && !prev[key]) {
        return { ...newState, pickup_only: false }
      }
      return newState
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate at least one shipping option
    if (!shippingOptions.ships_to_bulgaria && 
        !shippingOptions.ships_to_europe && 
        !shippingOptions.ships_to_usa && 
        !shippingOptions.ships_to_worldwide && 
        !shippingOptions.pickup_only) {
      setError(locale === 'bg' ? 'Моля изберете поне една опция за доставка' : 'Please select at least one shipping option')
      setIsLoading(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const imageUrl = formData.get("image_url") as string
    const product = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number.parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      stock: Number.parseInt(formData.get("stock") as string),
      images: imageUrl ? [imageUrl] : [],
      seller_id: userId,
      // New shipping destination flags
      ships_to_bulgaria: shippingOptions.ships_to_bulgaria,
      ships_to_europe: shippingOptions.ships_to_europe,
      ships_to_usa: shippingOptions.ships_to_usa,
      ships_to_worldwide: shippingOptions.ships_to_worldwide,
      pickup_only: shippingOptions.pickup_only,
    }

    const supabase = createClient()
    const { error: uploadError } = await supabase.from("products").insert(product)

    if (uploadError) {
      setError(uploadError.message)
    } else {
      router.push("/")
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="font-bold text-sm">
          {t('title')}
        </Label>
        <Input id="title" name="title" required className="rounded-md focus-visible:ring-ring" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-bold text-sm">
          {t('description')}
        </Label>
        <Textarea
          id="description"
          name="description"
          required
          className="rounded-md min-h-[100px] focus-visible:ring-ring"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="font-bold text-sm">
            {t('price')}
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            className="rounded-md focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock" className="font-bold text-sm">
            {t('stock')}
          </Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="1"
            required
            defaultValue="1"
            className="rounded-md focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="font-bold text-sm">
          {t('category')}
        </Label>
        <Select name="category" required>
          <SelectTrigger className="rounded-md focus:ring-ring">
            <SelectValue placeholder={t('selectCategory')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">{t('electronics')}</SelectItem>
            <SelectItem value="books">{t('books')}</SelectItem>
            <SelectItem value="fashion">{t('fashion')}</SelectItem>
            <SelectItem value="home">{t('home')}</SelectItem>
            <SelectItem value="toys">{t('toys')}</SelectItem>
            <SelectItem value="beauty">{t('beauty')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Shipping Destinations - Where you ship TO */}
      <div className="space-y-3">
        <Label className="font-bold text-sm">
          {locale === 'bg' ? 'Доставка до' : 'Ships To'}
        </Label>
        <p className="text-xs text-muted-foreground">
          {locale === 'bg' 
            ? 'Изберете регионите, до които можете да доставите. Времето за доставка ще се изчисли автоматично.'
            : 'Select regions you can ship to. Delivery times are calculated automatically based on your location.'}
        </p>
        
        <div className="space-y-2">
          {SHIPPING_DESTINATIONS.map((dest) => {
            const Icon = dest.icon
            const isChecked = shippingOptions[dest.id as keyof typeof shippingOptions]
            const deliveryTime = getDeliveryLabel(sellerCountryCode, dest.region, locale)
            
            return (
              <div
                key={dest.id}
                onClick={() => toggleShipping(dest.id as keyof typeof shippingOptions)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer ${
                  isChecked 
                    ? 'border-brand bg-brand/5' 
                    : 'border-border hover:border-brand/50'
                }`}
              >
                <div className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
                  isChecked ? 'bg-brand border-brand' : 'border-muted-foreground'
                }`}>
                  {isChecked && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                
                <Icon size={20} weight={isChecked ? 'fill' : 'regular'} className={isChecked ? 'text-brand' : 'text-muted-foreground'} />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm ${isChecked ? 'text-brand' : ''}`}>
                      {locale === 'bg' ? dest.name_bg : dest.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} />
                      {deliveryTime}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {locale === 'bg' ? dest.description : dest.description_en}
                  </p>
                </div>
              </div>
            )
          })}
          
          {/* Pickup Only Option */}
          <div
            onClick={() => toggleShipping('pickup_only')}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer ${
              shippingOptions.pickup_only 
                ? 'border-brand bg-brand/5' 
                : 'border-border hover:border-brand/50'
            }`}
          >
            <div className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
              shippingOptions.pickup_only ? 'bg-brand border-brand' : 'border-muted-foreground'
            }`}>
              {shippingOptions.pickup_only && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            
            <Storefront size={20} weight={shippingOptions.pickup_only ? 'fill' : 'regular'} className={shippingOptions.pickup_only ? 'text-brand' : 'text-muted-foreground'} />
            
            <div className="flex-1">
              <span className={`font-medium text-sm ${shippingOptions.pickup_only ? 'text-brand' : ''}`}>
                {locale === 'bg' ? 'Само лично предаване' : 'Pickup Only'}
              </span>
              <p className="text-xs text-muted-foreground">
                {locale === 'bg' ? 'Без доставка - само лично предаване' : 'No shipping - pickup only'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url" className="font-bold text-sm">
          {t('imageUrl')}
        </Label>
        <Input
          id="image_url"
          name="image_url"
          type="url"
          placeholder="https://example.com/image.jpg"
          className="rounded-md focus-visible:ring-ring"
        />
        <p className="text-xs text-muted-foreground">{t('imageUrlHint')}</p>
      </div>

      {error && <div className="text-destructive text-sm font-bold">{error}</div>}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-interactive hover:bg-interactive-hover text-white border-none rounded font-normal"
      >
        {isLoading ? t('adding') : t('addProduct')}
      </Button>
    </form>
  )
}
