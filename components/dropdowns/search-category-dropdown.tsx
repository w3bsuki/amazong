"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useTranslations, useLocale } from "next-intl"
import { CaretRight } from "@phosphor-icons/react"

interface Category {
  id: string
  name: string
  name_bg: string | null
  slug: string
}

interface SearchCategoryDropdownProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (value: string) => void
}

export function SearchCategoryDropdown({ categories, selectedCategory, onCategoryChange }: SearchCategoryDropdownProps) {
  const tCat = useTranslations("SearchCategories")
  const locale = useLocale()

  const getCategoryName = (cat: Category) => {
    if (locale === "bg" && cat.name_bg) {
      return cat.name_bg
    }
    return cat.name
  }

  const getSelectedLabel = () => {
    if (selectedCategory === "all") return tCat("all")
    const cat = categories.find((c) => c.slug === selectedCategory)
    return cat ? getCategoryName(cat) : tCat("all")
  }

  return (
    <HoverCard openDelay={50} closeDelay={150}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="h-full px-4 bg-interactive hover:bg-interactive-hover flex items-center gap-1.5 text-sm font-medium text-white cursor-pointer border-r border-interactive-hover whitespace-nowrap rounded-l-sm"
        >
          <span>{getSelectedLabel()}</span>
          <CaretRight size={14} weight="regular" className="opacity-80 rotate-90 shrink-0" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-[220px] p-0 bg-popover text-popover-foreground border border-border z-50 rounded-md overflow-hidden"
        align="start"
        sideOffset={4}
      >
        <div className="max-h-[350px] overflow-y-auto">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted ${selectedCategory === "all" ? "bg-brand/10 text-brand font-medium" : "text-foreground"}`}
          >
            {tCat("all")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.slug)}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted ${selectedCategory === cat.slug ? "bg-brand/10 text-brand font-medium" : "text-foreground"}`}
            >
              {getCategoryName(cat)}
            </button>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
