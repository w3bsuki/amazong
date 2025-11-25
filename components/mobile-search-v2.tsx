"use client"

import { useState, useEffect } from "react"
import { Search, Clock, TrendingUp } from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
}

export function MobileSearchV2() {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()
  const t = useTranslations('Navigation')
  const locale = useLocale()

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
      {/* Search icon trigger for mobile */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center p-2 text-white hover:bg-white/5 rounded-lg md:hidden transition-colors"
        aria-label={t('searchPlaceholder')}
      >
        <Search className="size-6" />
      </button>

      <CommandDialog 
        open={open} 
        onOpenChange={setOpen}
        title={locale === 'bg' ? 'Търсене' : 'Search'}
        description={locale === 'bg' ? 'Търсене в продукти, категории и още...' : 'Search products, categories, and more...'}
      >
        <CommandInput 
          placeholder={locale === 'bg' ? 'Търсене в продукти...' : 'Search products...'} 
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const value = e.currentTarget.value
              if (value.trim()) {
                handleSearch(value)
              }
            }
          }}
        />
        <CommandList className="max-h-[60vh]">
          <CommandEmpty>
            {locale === 'bg' ? 'Няма резултати.' : 'No results found.'}
          </CommandEmpty>
          
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <CommandGroup heading={
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  {locale === 'bg' ? 'Скорошни търсения' : 'Recent Searches'}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    clearRecentSearches()
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {locale === 'bg' ? 'Изчисти' : 'Clear'}
                </button>
              </div>
            }>
              {recentSearches.map((search, i) => (
                <CommandItem key={`recent-${i}`} onSelect={() => handleSearch(search)}>
                  <Clock className="mr-2 h-4 w-4 text-slate-400" />
                  {search}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Trending Searches */}
          <CommandGroup heading={
            <span className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5" />
              {locale === 'bg' ? 'Популярни търсения' : 'Trending'}
            </span>
          }>
            {trendingSearches.map((search, i) => (
              <CommandItem key={`trending-${i}`} onSelect={() => handleSearch(search)}>
                <TrendingUp className="mr-2 h-4 w-4 text-orange-500" />
                {search}
              </CommandItem>
            ))}
          </CommandGroup>

          {/* Categories */}
          <CommandGroup heading={locale === 'bg' ? 'Категории' : 'Categories'}>
            {categories.slice(0, 8).map((cat) => (
              <CommandItem key={cat.id} onSelect={() => handleCategorySelect(cat.slug)}>
                <span className="mr-2">{categoryIcons[cat.slug] || '📦'}</span>
                {getCategoryName(cat)}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
