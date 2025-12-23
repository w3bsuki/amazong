"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
import { Package, Globe, MapPin, Storefront, Truck, Clock, Plus, X, Tag, Info } from "@phosphor-icons/react"
import { getDeliveryLabel, type ShippingRegion } from "@/lib/shipping"
import { cn } from "@/lib/utils"

// Types
interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
  parent_id: string | null
  children?: Category[]
}

interface CategoryAttribute {
  id: string
  category_id: string
  name: string
  name_bg: string | null
  attribute_type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'date'
  is_required: boolean
  is_filterable: boolean
  options: string[]
  options_bg: string[]
  placeholder: string | null
  placeholder_bg: string | null
  validation_rules: Record<string, any>
  sort_order: number
}

interface CustomAttribute {
  name: string
  value: string
}

// Shipping destinations
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

export function ProductFormEnhanced({ userId, sellerCountryCode = 'BG' }: { userId: string; sellerCountryCode?: string }) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('ProductForm')
  
  // Form state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Categories
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("")
  const [subcategories, setSubcategories] = useState<Category[]>([])
  
  // Category-specific attributes
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttribute[]>([])
  const [attributeValues, setAttributeValues] = useState<Record<string, string>>({})
  const [multiselectValues, setMultiselectValues] = useState<Record<string, string[]>>({})
  
  // Custom seller attributes (eBay-style)
  const [customAttributes, setCustomAttributes] = useState<CustomAttribute[]>([])
  const [showAddCustom, setShowAddCustom] = useState(false)
  const [newCustomName, setNewCustomName] = useState("")
  const [newCustomValue, setNewCustomValue] = useState("")
  
  // Shipping
  const [shippingOptions, setShippingOptions] = useState({
    ships_to_bulgaria: true,
    ships_to_europe: false,
    ships_to_usa: false,
    ships_to_worldwide: false,
    pickup_only: false,
  })

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories?children=true")
        const data = await res.json()
        setCategories(data.categories || [])
      } catch (err) {
        console.error("Failed to fetch categories:", err)
      }
    }
    fetchCategories()
  }, [])

  // Update subcategories when parent category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find(c => c.id === selectedCategory)
      setSubcategories(category?.children || [])
      setSelectedSubcategory("")
      // Clear attributes when category changes
      setCategoryAttributes([])
      setAttributeValues({})
      setMultiselectValues({})
    }
  }, [selectedCategory, categories])

  // Fetch category attributes when subcategory changes
  useEffect(() => {
    const fetchAttributes = async () => {
      const categoryId = selectedSubcategory || selectedCategory
      if (!categoryId) return
      
      try {
        const res = await fetch(`/api/categories/attributes?categoryId=${categoryId}`)
        const data = await res.json()
        setCategoryAttributes(data.attributes || [])
        // Reset values
        setAttributeValues({})
        setMultiselectValues({})
      } catch (err) {
        console.error("Failed to fetch attributes:", err)
      }
    }
    fetchAttributes()
  }, [selectedSubcategory, selectedCategory])

  const getCategoryName = useCallback((cat: Category) => {
    if (locale === 'bg' && cat.name_bg) return cat.name_bg
    return cat.name
  }, [locale])

  const getAttributeName = useCallback((attr: CategoryAttribute) => {
    if (locale === 'bg' && attr.name_bg) return attr.name_bg
    return attr.name
  }, [locale])

  const getAttributeOptions = useCallback((attr: CategoryAttribute) => {
    if (locale === 'bg' && attr.options_bg?.length > 0) return attr.options_bg
    return attr.options || []
  }, [locale])

  const toggleShipping = (key: keyof typeof shippingOptions) => {
    setShippingOptions(prev => {
      const newState = { ...prev, [key]: !prev[key] }
      if (key === 'pickup_only' && !prev.pickup_only) {
        return {
          ships_to_bulgaria: false,
          ships_to_europe: false,
          ships_to_usa: false,
          ships_to_worldwide: false,
          pickup_only: true,
        }
      }
      if (key !== 'pickup_only' && !prev[key]) {
        return { ...newState, pickup_only: false }
      }
      return newState
    })
  }

  const addCustomAttribute = () => {
    if (newCustomName.trim() && newCustomValue.trim()) {
      setCustomAttributes(prev => [...prev, { name: newCustomName.trim(), value: newCustomValue.trim() }])
      setNewCustomName("")
      setNewCustomValue("")
      setShowAddCustom(false)
    }
  }

  const removeCustomAttribute = (index: number) => {
    setCustomAttributes(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate shipping
    if (!shippingOptions.ships_to_bulgaria && 
        !shippingOptions.ships_to_europe && 
        !shippingOptions.ships_to_usa && 
        !shippingOptions.ships_to_worldwide && 
        !shippingOptions.pickup_only) {
      setError(locale === 'bg' ? 'Моля изберете поне една опция за доставка' : 'Please select at least one shipping option')
      setIsLoading(false)
      return
    }

    // Validate required attributes
    for (const attr of categoryAttributes) {
      if (attr.is_required && !attributeValues[attr.name] && !multiselectValues[attr.name]?.length) {
        setError(locale === 'bg' 
          ? `Моля попълнете полето "${getAttributeName(attr)}"` 
          : `Please fill in "${attr.name}"`)
        setIsLoading(false)
        return
      }
    }

    const formData = new FormData(e.currentTarget)
    const imageUrl = formData.get("image_url") as string

    const supabase = createClient()
    
    // 1. Create product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: Number.parseFloat(formData.get("price") as string),
        category_id: selectedSubcategory || selectedCategory,
        stock: Number.parseInt(formData.get("stock") as string),
        images: imageUrl ? [imageUrl] : [],
        seller_id: userId,
        ships_to_bulgaria: shippingOptions.ships_to_bulgaria,
        ships_to_europe: shippingOptions.ships_to_europe,
        ships_to_usa: shippingOptions.ships_to_usa,
        ships_to_worldwide: shippingOptions.ships_to_worldwide,
        pickup_only: shippingOptions.pickup_only,
      })
      .select("id")
      .single()

    if (productError) {
      setError(productError.message)
      setIsLoading(false)
      return
    }

    // 2. Save category attributes
    const attributesToSave = [
      // Predefined attributes
      ...categoryAttributes.map(attr => ({
        product_id: product.id,
        attribute_id: attr.id,
        name: attr.name,
        value: attr.attribute_type === 'multiselect' 
          ? (multiselectValues[attr.name] || []).join(', ')
          : attributeValues[attr.name] || '',
        is_custom: false,
      })).filter(a => a.value),
      // Custom attributes
      ...customAttributes.map(custom => ({
        product_id: product.id,
        attribute_id: null,
        name: custom.name,
        value: custom.value,
        is_custom: true,
      }))
    ]

    if (attributesToSave.length > 0) {
      const { error: attrError } = await supabase
        .from("product_attributes")
        .insert(attributesToSave)
      
      if (attrError) {
        console.error("Failed to save attributes:", attrError)
        // Product was created, just log the error
      }
    }

    router.push("/")
    router.refresh()
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
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

      {/* Category Selection */}
      <div className="space-y-4">
        <Label className="font-bold text-sm">
          {t('category')}
        </Label>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Parent Category */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="rounded-md focus:ring-ring">
              <SelectValue placeholder={locale === 'bg' ? 'Изберете категория' : 'Select category'} />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {getCategoryName(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Subcategory (if available) */}
          {subcategories.length > 0 && (
            <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
              <SelectTrigger className="rounded-md focus:ring-ring">
                <SelectValue placeholder={locale === 'bg' ? 'Изберете подкатегория' : 'Select subcategory'} />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map(sub => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {getCategoryName(sub)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Category-Specific Attributes */}
      {categoryAttributes.length > 0 && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-brand" />
            <Label className="font-bold text-sm">
              {locale === 'bg' ? 'Характеристики на продукта' : 'Product Specifications'}
            </Label>
          </div>
          
          <div className="grid gap-4">
            {categoryAttributes.map(attr => (
              <div key={attr.id} className="space-y-1.5">
                <Label className={cn("text-sm", attr.is_required && "after:content-['*'] after:text-red-500 after:ml-0.5")}>
                  {getAttributeName(attr)}
                </Label>
                
                {attr.attribute_type === 'select' && (
                  <Select 
                    value={attributeValues[attr.name] || ""} 
                    onValueChange={(val) => setAttributeValues(prev => ({ ...prev, [attr.name]: val }))}
                  >
                    <SelectTrigger className="rounded-md">
                      <SelectValue placeholder={locale === 'bg' ? 'Изберете...' : 'Select...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {getAttributeOptions(attr).map((opt, i) => (
                        <SelectItem key={i} value={attr.options[i]}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {attr.attribute_type === 'multiselect' && (
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background min-h-[40px]">
                    {getAttributeOptions(attr).map((opt, i) => {
                      const value = attr.options[i]
                      const isSelected = multiselectValues[attr.name]?.includes(value)
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setMultiselectValues(prev => {
                              const current = prev[attr.name] || []
                              return {
                                ...prev,
                                [attr.name]: isSelected 
                                  ? current.filter(v => v !== value)
                                  : [...current, value]
                              }
                            })
                          }}
                          className={cn(
                            "px-2 py-1 text-xs rounded-full border transition-colors",
                            isSelected 
                              ? "bg-brand text-white border-brand" 
                              : "bg-background hover:bg-muted border-border"
                          )}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                )}
                
                {attr.attribute_type === 'text' && (
                  <Input
                    value={attributeValues[attr.name] || ""}
                    onChange={(e) => setAttributeValues(prev => ({ ...prev, [attr.name]: e.target.value }))}
                    placeholder={locale === 'bg' ? attr.placeholder_bg || '' : attr.placeholder || ''}
                    className="rounded-md"
                  />
                )}
                
                {attr.attribute_type === 'number' && (
                  <Input
                    type="number"
                    value={attributeValues[attr.name] || ""}
                    onChange={(e) => setAttributeValues(prev => ({ ...prev, [attr.name]: e.target.value }))}
                    placeholder={locale === 'bg' ? attr.placeholder_bg || '' : attr.placeholder || ''}
                    className="rounded-md"
                  />
                )}
                
                {attr.attribute_type === 'boolean' && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={attributeValues[attr.name] === 'true'}
                      onCheckedChange={(checked) => setAttributeValues(prev => ({ 
                        ...prev, 
                        [attr.name]: checked ? 'true' : 'false' 
                      }))}
                    />
                    <span className="text-sm text-muted-foreground">
                      {locale === 'bg' ? 'Да' : 'Yes'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Attributes (eBay-style "Add your own") */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-bold text-sm flex items-center gap-2">
            <Info size={16} className="text-muted-foreground" />
            {locale === 'bg' ? 'Допълнителни характеристики' : 'Additional Specifications'}
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAddCustom(true)}
            className="text-brand hover:text-brand/80"
          >
            <Plus size={16} className="mr-1" />
            {locale === 'bg' ? 'Добави' : 'Add'}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          {locale === 'bg' 
            ? 'Добавете допълнителна информация за продукта (напр. "Гаранция - 2 години", "Цвят интериор - черен")' 
            : 'Add additional product details (e.g., "Warranty - 2 years", "Interior Color - Black")'}
        </p>

        {/* Existing custom attributes */}
        {customAttributes.length > 0 && (
          <div className="space-y-2">
            {customAttributes.map((attr, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <span className="font-medium text-sm flex-1">{attr.name}:</span>
                <span className="text-sm text-muted-foreground flex-1">{attr.value}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomAttribute(index)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add new custom attribute form */}
        {showAddCustom && (
          <div className="flex gap-2 items-end p-3 bg-muted/50 rounded-md border">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">{locale === 'bg' ? 'Име' : 'Name'}</Label>
              <Input
                value={newCustomName}
                onChange={(e) => setNewCustomName(e.target.value)}
                placeholder={locale === 'bg' ? 'напр. Гаранция' : 'e.g., Warranty'}
                className="h-8 text-sm"
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs">{locale === 'bg' ? 'Стойност' : 'Value'}</Label>
              <Input
                value={newCustomValue}
                onChange={(e) => setNewCustomValue(e.target.value)}
                placeholder={locale === 'bg' ? 'напр. 2 години' : 'e.g., 2 years'}
                className="h-8 text-sm"
              />
            </div>
            <Button
              type="button"
              size="sm"
              onClick={addCustomAttribute}
              className="h-8"
            >
              {locale === 'bg' ? 'Добави' : 'Add'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddCustom(false)
                setNewCustomName("")
                setNewCustomValue("")
              }}
              className="h-8"
            >
              <X size={14} />
            </Button>
          </div>
        )}
      </div>

      {/* Shipping Destinations */}
      <div className="space-y-3">
        <Label className="font-bold text-sm">
          {locale === 'bg' ? 'Доставка до' : 'Ships To'}
        </Label>
        <p className="text-xs text-muted-foreground">
          {locale === 'bg' 
            ? 'Изберете регионите, до които можете да доставите.'
            : 'Select regions you can ship to.'}
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
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer",
                  isChecked 
                    ? 'border-brand bg-brand/5' 
                    : 'border-border hover:border-brand/50'
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-5 h-5 rounded border-2 transition-colors",
                  isChecked ? 'bg-brand border-brand' : 'border-muted-foreground'
                )}>
                  {isChecked && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                
                <Icon size={20} weight={isChecked ? 'fill' : 'regular'} className={isChecked ? 'text-brand' : 'text-muted-foreground'} />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-medium text-sm", isChecked && 'text-brand')}>
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
          
          {/* Pickup Only */}
          <div
            onClick={() => toggleShipping('pickup_only')}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer",
              shippingOptions.pickup_only 
                ? 'border-brand bg-brand/5' 
                : 'border-border hover:border-brand/50'
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-5 h-5 rounded border-2 transition-colors",
              shippingOptions.pickup_only ? 'bg-brand border-brand' : 'border-muted-foreground'
            )}>
              {shippingOptions.pickup_only && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            
            <Storefront size={20} weight={shippingOptions.pickup_only ? 'fill' : 'regular'} className={shippingOptions.pickup_only ? 'text-brand' : 'text-muted-foreground'} />
            
            <div className="flex-1">
              <span className={cn("font-medium text-sm", shippingOptions.pickup_only && 'text-brand')}>
                {locale === 'bg' ? 'Само лично предаване' : 'Pickup Only'}
              </span>
              <p className="text-xs text-muted-foreground">
                {locale === 'bg' ? 'Без доставка - само лично предаване' : 'No shipping - pickup only'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image URL */}
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
        disabled={isLoading || !selectedCategory}
        className="w-full bg-interactive hover:bg-interactive-hover text-white border-none rounded font-normal"
      >
        {isLoading ? t('adding') : t('addProduct')}
      </Button>
    </form>
  )
}
