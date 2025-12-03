"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Check } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"

interface Variant {
  id: string
  name: string
  size?: string | null
  color?: string | null
  color_hex?: string | null
  price_adjustment: number
  stock: number
  image_url?: string | null
  is_default: boolean
}

interface ProductVariantSelectorProps {
  variants: Variant[]
  basePrice: number
  onVariantChange: (variant: Variant | null, adjustedPrice: number) => void
  onImageChange?: (imageUrl: string) => void
}

export function ProductVariantSelector({ 
  variants, 
  basePrice, 
  onVariantChange,
  onImageChange 
}: ProductVariantSelectorProps) {
  const t = useTranslations('Product')
  
  // Extract unique sizes and colors
  const sizes = [...new Set(variants.filter(v => v.size).map(v => v.size!))]
  const colors = [...new Set(variants.filter(v => v.color).map(v => ({ 
    color: v.color!, 
    hex: v.color_hex 
  })))]
  
  // Remove duplicates from colors array
  const uniqueColors = colors.filter((c, i, arr) => 
    arr.findIndex(x => x.color === c.color) === i
  )

  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  // Initialize with default variant
  useEffect(() => {
    const defaultVariant = variants.find(v => v.is_default)
    if (defaultVariant) {
      if (defaultVariant.size) setSelectedSize(defaultVariant.size)
      if (defaultVariant.color) setSelectedColor(defaultVariant.color)
    } else if (variants.length > 0) {
      // Select first available variant
      const firstAvailable = variants.find(v => v.stock > 0) || variants[0]
      if (firstAvailable.size) setSelectedSize(firstAvailable.size)
      if (firstAvailable.color) setSelectedColor(firstAvailable.color)
    }
  }, [variants])

  // Find matching variant when selection changes
  useEffect(() => {
    let matchingVariant: Variant | null = null

    if (sizes.length > 0 && uniqueColors.length > 0) {
      // Both size and color needed
      matchingVariant = variants.find(v => 
        v.size === selectedSize && v.color === selectedColor
      ) || null
    } else if (sizes.length > 0) {
      // Only size
      matchingVariant = variants.find(v => v.size === selectedSize) || null
    } else if (uniqueColors.length > 0) {
      // Only color
      matchingVariant = variants.find(v => v.color === selectedColor) || null
    }

    if (matchingVariant) {
      const adjustedPrice = basePrice + (matchingVariant.price_adjustment || 0)
      onVariantChange(matchingVariant, adjustedPrice)
      
      if (matchingVariant.image_url && onImageChange) {
        onImageChange(matchingVariant.image_url)
      }
    } else {
      onVariantChange(null, basePrice)
    }
  }, [selectedSize, selectedColor, variants, basePrice])

  // Check if a variant combination is available
  const isVariantAvailable = (size?: string, color?: string) => {
    const variant = variants.find(v => {
      if (size && color) return v.size === size && v.color === color
      if (size) return v.size === size
      if (color) return v.color === color
      return false
    })
    return variant && variant.stock > 0
  }

  // Get variant stock for a specific combination
  const getVariantStock = (size?: string, color?: string) => {
    const variant = variants.find(v => {
      if (size && color) return v.size === size && v.color === color
      if (size) return v.size === size
      if (color) return v.color === color
      return false
    })
    return variant?.stock || 0
  }

  if (variants.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Size Selector */}
      {sizes.length > 0 && (
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {t('size')}: <span className="font-normal">{selectedSize || t('selectSize')}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const available = selectedColor 
                ? isVariantAvailable(size, selectedColor)
                : variants.some(v => v.size === size && v.stock > 0)
              
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!available}
                  className={cn(
                    "min-h-11 min-w-11 px-4 py-2 border rounded-md text-sm font-medium",
                    "focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-1",
                    selectedSize === size
                      ? "border-brand-blue bg-brand-blue/5 text-brand-blue ring-1 ring-brand-blue"
                      : available
                        ? "border-border hover:border-brand-blue/50 text-foreground"
                        : "border-border/50 text-muted-foreground line-through cursor-not-allowed opacity-50"
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {uniqueColors.length > 0 && (
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            {t('color')}: <span className="font-normal">{selectedColor || t('selectColor')}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {uniqueColors.map(({ color, hex }) => {
              const available = selectedSize
                ? isVariantAvailable(selectedSize, color)
                : variants.some(v => v.color === color && v.stock > 0)
              
              return (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={!available}
                  title={color}
                  className={cn(
                    "relative min-h-11 min-w-11 rounded-full border-2",
                    "focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2",
                    selectedColor === color
                      ? "border-brand-blue ring-2 ring-brand-blue ring-offset-1"
                      : available
                        ? "border-border hover:border-brand-blue/50"
                        : "opacity-30 cursor-not-allowed"
                  )}
                  style={{ 
                    backgroundColor: hex || '#ccc',
                    ...(hex === '#FFFFFF' ? { boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)' } : {})
                  }}
                >
                  {selectedColor === color && (
                    <Check 
                      size={20}
                      weight="bold"
                      className={cn(
                        "absolute inset-0 m-auto",
                        hex === '#FFFFFF' || hex === '#FFCC00' || hex === '#F5DEB3'
                          ? "text-gray-800"
                          : "text-white"
                      )} 
                    />
                  )}
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-full h-0.5 bg-red-500 rotate-45 absolute" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Stock indicator for selected variant */}
      {(selectedSize || selectedColor) && (
        <div className="text-sm">
          {(() => {
            const stock = getVariantStock(
              selectedSize || undefined, 
              selectedColor || undefined
            )
            if (stock === 0) {
              return <span className="text-stock-out font-medium">{t('outOfStock')}</span>
            } else if (stock <= 5) {
              return <span className="text-stock-low font-medium">{t('onlyXLeft', { count: stock })}</span>
            } else {
              return <span className="text-stock-available font-medium">{t('inStock')}</span>
            }
          })()}
        </div>
      )}
    </div>
  )
}
