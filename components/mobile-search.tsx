"use client"

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations, useLocale } from "next-intl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
}

export function MobileSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [categories, setCategories] = useState<Category[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const router = useRouter()
  const t = useTranslations('Navigation')
  const tCat = useTranslations('SearchCategories')
  const locale = useLocale()

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
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5))
      } catch (e) {
        console.error('Failed to parse recent searches:', e)
      }
    }
  }, [])

  const getCategoryName = (cat: Category) => {
    if (locale === 'bg' && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    // Build search URL
    const params = new URLSearchParams()
    params.set('q', searchQuery)
    if (category !== 'all') {
      params.set('category', category)
    }

    setOpen(false)
    router.push(`/search?${params.toString()}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const trendingSearches = [
    locale === 'bg' ? 'Черен петък оферти' : 'Black Friday deals',
    locale === 'bg' ? 'iPhone 15' : 'iPhone 15',
    locale === 'bg' ? 'Коледни подаръци' : 'Christmas gifts',
    locale === 'bg' ? 'PlayStation 5' : 'PlayStation 5',
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden h-11 w-11 touch-target tap-transparent"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">{t('searchPlaceholder')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="top" 
        className="h-auto max-h-[85vh] w-full p-0 border-b border-slate-200 bg-white rounded-b-2xl overflow-hidden"
      >
        <SheetTitle className="sr-only">{t('searchPlaceholder')}</SheetTitle>
        
        {/* Search Header */}
        <div className="bg-zinc-900 text-white p-4 pt-safe">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            {/* Category Select */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11 w-auto min-w-[60px] bg-slate-100 border-none text-xs text-slate-700 rounded-l-lg rounded-r-none focus:ring-0 gap-1 px-2">
                <SelectValue placeholder={tCat('all')} />
              </SelectTrigger>
              <SelectContent className="bg-white text-black border-slate-200 max-h-[300px] rounded">
                <SelectItem value="all">{tCat('all')}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>
                    {getCategoryName(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search Input */}
            <div className="flex-1 flex items-center h-11 bg-white rounded-r-lg overflow-hidden">
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                className="h-full border-0 rounded-none focus-visible:ring-0 text-slate-900 px-3 text-base placeholder:text-slate-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <Button 
                type="submit" 
                className="h-full w-12 bg-blue-600 hover:bg-blue-700 text-white rounded-none border-none flex items-center justify-center"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Close Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 text-white hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </form>
        </div>

        {/* Search Suggestions */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  {locale === 'bg' ? 'Скорошни търсения' : 'Recent Searches'}
                </h3>
                <button 
                  onClick={clearRecentSearches}
                  className="text-xs text-blue-600 hover:text-blue-700 tap-transparent"
                >
                  {locale === 'bg' ? 'Изчисти' : 'Clear'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(search)}
                    className="filter-chip text-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-slate-500" />
              {locale === 'bg' ? 'Популярни търсения' : 'Trending Searches'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((search, i) => (
                <button
                  key={i}
                  onClick={() => handleSearch(search)}
                  className="filter-chip text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Categories */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              {locale === 'bg' ? 'Категории' : 'Categories'}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setOpen(false)
                    router.push(`/search?category=${cat.slug}`)
                  }}
                  className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-700 hover:bg-slate-100 tap-transparent active-scale text-left"
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
