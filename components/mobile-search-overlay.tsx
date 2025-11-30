"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MagnifyingGlass, X, Clock, TrendUp, Package, ArrowLeft, ArrowRight } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/routing"
import { useLocale } from "next-intl"
import Image from "next/image"
import { cn } from "@/lib/utils"


interface Product {
  id: string
  title: string
  price: number
  images: string[]
  slug: string
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

interface MobileSearchOverlayProps {
  className?: string
}

export function MobileSearchOverlay({ className }: MobileSearchOverlayProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const debouncedQuery = useDebounce(searchQuery, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const locale = useLocale()

  // Fetch products when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setProducts([])
      return
    }

    setIsSearching(true)
    fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}&limit=8`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || [])
      })
      .catch(err => {
        console.error('Failed to search products:', err)
        setProducts([])
      })
      .finally(() => {
        setIsSearching(false)
      })
  }, [debouncedQuery])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the input is rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved).slice(0, 5))
        } catch (e) {
          console.error('Failed to parse recent searches:', e)
        }
      }
    }
  }, [])


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-US', {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'USD',
    }).format(price)
  }

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setSearchQuery("")
    setProducts([])
  }, [])

  const handleSearch = useCallback((value: string) => {
    if (!value.trim()) return
    
    // Save to recent searches
    const updated = [value, ...recentSearches.filter(s => s !== value)].slice(0, 5)
    setRecentSearches(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    }
    
    handleClose()
    router.push(`/search?q=${encodeURIComponent(value)}`)
  }, [recentSearches, handleClose, router])


  const handleProductSelect = useCallback((slugOrId: string) => {
    if (!slugOrId) return
    handleClose()
    router.push(`/product/${slugOrId}`)
  }, [handleClose, router])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches')
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  const trendingSearches = [
    locale === 'bg' ? 'Черен петък оферти' : 'Black Friday deals',
    'iPhone 15',
    locale === 'bg' ? 'Коледни подаръци' : 'Christmas gifts',
    'PlayStation 5',
    locale === 'bg' ? 'AirPods' : 'AirPods',
  ]


  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={handleOpen}
        className={cn(
          "flex items-center justify-center size-11 p-0 rounded-lg text-header-text hover:bg-header-hover active:bg-header-active transition-colors md:hidden touch-action-manipulation",
          className
        )}
        aria-label={locale === 'bg' ? 'Търсене' : 'Search'}
      >
        <MagnifyingGlass size={24} weight="regular" />
      </button>

      {/* Full-Screen Search Overlay - eBay/Amazon Style */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-100 bg-background flex flex-col md:hidden animate-in fade-in slide-in-from-top-2 duration-200"
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'bg' ? 'Търсене' : 'Search'}
        >
          {/* Search Header - Fixed at top */}
          <div className="shrink-0 bg-white border-b border-border">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
              {/* Back/Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="flex items-center justify-center size-11 rounded-lg text-foreground hover:bg-muted active:bg-muted/80 transition-colors touch-action-manipulation shrink-0"
                aria-label={locale === 'bg' ? 'Затвори' : 'Close'}
              >
                <ArrowLeft size={24} weight="regular" />
              </button>

              {/* Search Input */}
              <div className="flex-1 relative">
                <MagnifyingGlass 
                  size={18} 
                  weight="regular" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" 
                />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={locale === 'bg' ? 'Търсене в продукти...' : 'Search products...'}
                  className="h-11 pl-10 pr-10 text-base bg-muted border-0 rounded-full focus-visible:ring-2 focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("")
                      setProducts([])
                      inputRef.current?.focus()
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                    aria-label={locale === 'bg' ? 'Изчисти' : 'Clear'}
                  >
                    <X size={18} weight="regular" />
                  </button>
                )}
              </div>

              {/* Search Button */}
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shrink-0"
                disabled={!searchQuery.trim()}
              >
                <MagnifyingGlass size={20} weight="regular" />
              </Button>
            </form>
          </div>

          {/* Search Content - Scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Loading State */}
            {isSearching && (
              <div className="px-4 py-8 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  {locale === 'bg' ? 'Търсене...' : 'Searching...'}
                </div>
              </div>
            )}

            {/* Live Product Search Results */}
            {!isSearching && products.length > 0 && (
              <div className="border-b border-border">
                <div className="flex items-center justify-between px-4 py-3 bg-muted/50">
                  <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Package size={14} weight="regular" />
                    {locale === 'bg' ? 'Продукти' : 'Products'}
                  </span>
                  <button
                    onClick={() => handleSearch(searchQuery)}
                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                  >
                    {locale === 'bg' ? 'Виж всички' : 'View all'}
                    <ArrowRight size={12} weight="regular" />
                  </button>
                </div>
                <div className="divide-y divide-border">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product.slug || product.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted active:bg-muted/80 text-left touch-action-manipulation"
                    >
                      <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden shrink-0 ring-1 ring-border">
                        {product.images?.[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.title}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={24} weight="regular" className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-2">{product.title}</p>
                        <p className="text-sm font-bold text-price-sale mt-0.5">{formatPrice(product.price)}</p>
                      </div>
                      <ArrowRight size={16} weight="regular" className="text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!isSearching && searchQuery.length >= 2 && products.length === 0 && (
              <div className="px-4 py-12 text-center">
                <Package size={48} weight="regular" className="text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-base font-medium text-foreground">
                  {locale === 'bg' ? `Няма резултати за "${searchQuery}"` : `No results for "${searchQuery}"`}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {locale === 'bg' ? 'Опитай с други ключови думи' : 'Try different keywords'}
                </p>
              </div>
            )}

            {/* Default State - Recent & Trending */}
            {!searchQuery && (
              <>
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="border-b border-border">
                    <div className="flex items-center justify-between px-4 py-3 bg-muted/50">
                      <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <Clock size={14} weight="regular" />
                        {locale === 'bg' ? 'Скорошни търсения' : 'Recent Searches'}
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-muted-foreground hover:text-foreground font-medium"
                      >
                        {locale === 'bg' ? 'Изчисти' : 'Clear'}
                      </button>
                    </div>
                    <div className="divide-y divide-border">
                      {recentSearches.map((search, i) => (
                        <button
                          key={`recent-${i}`}
                          onClick={() => handleSearch(search)}
                          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted active:bg-muted/80 text-left touch-action-manipulation"
                        >
                          <Clock size={18} weight="regular" className="text-muted-foreground shrink-0" />
                          <span className="flex-1 text-base text-foreground">{search}</span>
                          <ArrowRight size={16} weight="regular" className="text-muted-foreground shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div className="border-b border-border">
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/50">
                    <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      <TrendUp size={14} weight="regular" />
                      {locale === 'bg' ? 'Популярни търсения' : 'Trending'}
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {trendingSearches.map((search, i) => (
                      <button
                        key={`trending-${i}`}
                        onClick={() => handleSearch(search)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted active:bg-muted/80 text-left touch-action-manipulation"
                      >
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg, var(--deal) 0%, var(--brand) 100%)' }}
                        >
                          {i + 1}
                        </div>
                        <span className="flex-1 text-base text-foreground">{search}</span>
                        <ArrowRight size={16} weight="regular" className="text-muted-foreground shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

              </>
            )}
          </div>

          {/* Bottom Safe Area */}
          <div className="shrink-0 h-safe-bottom bg-background" />
        </div>
      )}
    </>
  )
}
