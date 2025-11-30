"use client"

import { useState, useEffect } from "react"
import { MagnifyingGlass, Clock, TrendUp, Package } from "@phosphor-icons/react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { useRouter } from "@/i18n/routing"
import { useLocale } from "next-intl"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
}

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

export function MobileSearchV2() {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const debouncedQuery = useDebounce(searchQuery, 300)
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

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    // Fetch categories from API
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategories(data.categories)
        }
      })
      .catch(err => console.error('Failed to fetch categories:', err))

    // Load recent searches from localStorage
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

  const getCategoryName = (cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

  const handleSearch = (value: string) => {
    if (!value.trim()) return
    
    // Save to recent searches
    const updated = [value, ...recentSearches.filter(s => s !== value)].slice(0, 5)
    setRecentSearches(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    }
    
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(value)}`)
  }

  const handleCategorySelect = (slug: string) => {
    setOpen(false)
    router.push(`/search?category=${slug}`)
  }

  const handleProductSelect = (slugOrId: string) => {
    if (!slugOrId) return // Guard against null/undefined
    setOpen(false)
    setSearchQuery("")
    router.push(`/product/${slugOrId}`)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-US', {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'USD',
    }).format(price)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentSearches')
    }
  }

  const trendingSearches = [
    locale === 'bg' ? 'Черен петък оферти' : 'Black Friday deals',
    'iPhone 15',
    locale === 'bg' ? 'Коледни подаръци' : 'Christmas gifts',
    'PlayStation 5',
  ]

  const categoryIcons: Record<string, string> = {
    electronics: '📱',
    computers: '💻',
    gaming: '🎮',
    'smart-home': '🏠',
    home: '🍳',
    fashion: '👗',
    beauty: '💄',
    toys: '🧸',
    sports: '⚽',
    books: '📚',
  }

  return (
    <>
      {/* Search trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center size-11 p-0 rounded-lg text-header-text hover:bg-header-hover active:bg-header-active transition-colors md:hidden touch-action-manipulation tap-transparent"
        aria-label="Search"
      >
        <MagnifyingGlass size={24} weight="regular" />
      </button>

      {/* Mobile-optimized search drawer (bottom sheet) */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85dvh] flex flex-col">
          {/* Accessible title and description (hidden but present for screen readers) */}
          <DrawerTitle className="sr-only">
            {locale === 'bg' ? 'Търсене' : 'Search'}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            {locale === 'bg' ? 'Търсене в продукти, категории и още...' : 'Search products, categories, and more...'}
          </DrawerDescription>
          
          <Command shouldFilter={false} className="flex flex-col h-full">
            {/* Larger search input for mobile touch */}
            <div className="border-b px-3 py-2">
              <CommandInput 
                placeholder={locale === 'bg' ? 'Търсене в продукти...' : 'Search products...'} 
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="h-12 text-base"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = e.currentTarget.value
                    if (value.trim()) {
                      handleSearch(value)
                    }
                  }
                }}
              />
            </div>
            
            <CommandList className="flex-1 overflow-y-auto px-1 pb-safe">
              <CommandEmpty>
                {isSearching 
                  ? (locale === 'bg' ? 'Търсене...' : 'Searching...')
                  : (locale === 'bg' ? 'Няма резултати.' : 'No results found.')
                }
              </CommandEmpty>
              
              {/* Live Product Search Results */}
              {products.length > 0 && (
                <CommandGroup heading={
                  <span className="flex items-center gap-2">
                    <Package size={14} weight="regular" />
                    {locale === 'bg' ? 'Продукти' : 'Products'}
                  </span>
                }>
                  {products.map((product) => (
                    <CommandItem 
                      key={product.id} 
                      onSelect={() => handleProductSelect(product.slug || product.id)}
                      className="flex items-center gap-3 min-h-[56px] py-3 touch-action-manipulation"
                    >
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded bg-muted"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <Package size={24} weight="regular" className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.title}</p>
                        <p className="text-sm text-price-sale font-semibold">{formatPrice(product.price)}</p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <CommandGroup heading={
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center gap-2">
                      <Clock size={14} weight="regular" />
                      {locale === 'bg' ? 'Скорошни търсения' : 'Recent'}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        clearRecentSearches()
                      }}
                      className="text-xs text-link hover:underline min-h-[44px] flex items-center px-2"
                    >
                      {locale === 'bg' ? 'Изчисти' : 'Clear'}
                    </button>
                  </div>
                }>
                  {recentSearches.map((search, i) => (
                    <CommandItem 
                      key={`recent-${i}`} 
                      onSelect={() => handleSearch(search)}
                      className="min-h-[48px] py-3 touch-action-manipulation"
                    >
                      <Clock size={18} weight="regular" className="mr-3 text-muted-foreground" />
                      <span className="text-base">{search}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Trending */}
              <CommandGroup heading={
                <span className="flex items-center gap-2">
                  <TrendUp size={14} weight="regular" />
                  {locale === 'bg' ? 'Популярни' : 'Trending'}
                </span>
              }>
                {trendingSearches.map((search, i) => (
                  <CommandItem 
                    key={`trending-${i}`} 
                    onSelect={() => handleSearch(search)}
                    className="min-h-[48px] py-3 touch-action-manipulation"
                  >
                    <TrendUp size={18} weight="regular" className="mr-3 text-deal" />
                    <span className="text-base">{search}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              {/* Categories */}
              <CommandGroup heading={locale === 'bg' ? 'Категории' : 'Categories'}>
                {categories.slice(0, 6).map((cat) => (
                  <CommandItem 
                    key={cat.id} 
                    onSelect={() => handleCategorySelect(cat.slug)}
                    className="min-h-[48px] py-3 touch-action-manipulation"
                  >
                    <span className="mr-3 text-lg">{categoryIcons[cat.slug] || '📦'}</span>
                    <span className="text-base">{getCategoryName(cat)}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DrawerContent>
      </Drawer>
    </>
  )
}
