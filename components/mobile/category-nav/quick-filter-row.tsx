"use client"

import { useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import {
    Sliders,
    CurrencyDollar,
    Tag,
    Palette,
    Sparkle,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { getFilterPillsForCategory, isBaseFilter } from "@/lib/filter-priority"
import { FilterHub } from "@/components/shared/filters/filter-hub"
import { FilterModal, type FilterModalSection } from "@/components/shared/filters/filter-modal"
import { SortModal } from "@/components/shared/filters/sort-modal"
import type { CategoryAttribute } from "@/lib/data/categories"

// =============================================================================
// QUICK FILTER ROW — eBay-style quick filter pills under category navigation
//
// Per TODO1.md decision gates:
// - Pills: Price, Category, Brand, Color/Size, Condition, All filters
// - Pills open single-section modal (not full list view)
// - "All filters" opens the full FilterHub drawer
// =============================================================================

interface QuickFilterRowProps {
    /** Locale for i18n */
    locale: string
    /** Category slug for filter context */
    categorySlug?: string | undefined
    /** Category ID for count queries */
    categoryId?: string | undefined
    /** Search query text (for /search page) */
    searchQuery?: string | undefined
    /** Filterable attributes for the current category */
    attributes?: CategoryAttribute[]
    /** Subcategories for category quick modal */
    subcategories?: Array<{ id: string; name: string; name_bg: string | null; slug: string }>
    /** Current category name for category section */
    categoryName?: string
    /** Base path for filter URL updates */
    basePath?: string | undefined
    /** When set, category selection writes to this query param key (e.g. "category" for /search) */
    categoryParamKey?: string
    /** Additional CSS classes */
    className?: string
}

/** Icon mapping for common filter types */
const FILTER_ICONS: Record<string, React.ElementType> = {
    price: CurrencyDollar,
    category: Tag,
    brand: Sparkle,
    color: Palette,
    condition: Tag,
    size: Tag,
}

export function QuickFilterRow({
    locale,
    categorySlug,
    categoryId,
    searchQuery,
    attributes = [],
    subcategories = [],
    categoryName,
    basePath,
    categoryParamKey,
    className,
}: QuickFilterRowProps) {
    const tHub = useTranslations("FilterHub")
    const tFilters = useTranslations("SearchFilters")
    const searchParams = useSearchParams()

    // Modal state
    const [sortOpen, setSortOpen] = useState(false)
    const [hubOpen, setHubOpen] = useState(false)
    const [singleOpen, setSingleOpen] = useState(false)
    const [singleSection, setSingleSection] = useState<FilterModalSection | null>(null)
    const [singleLabel, setSingleLabel] = useState<string>("")
    const [singleAttribute, setSingleAttribute] = useState<CategoryAttribute | undefined>(undefined)

    // Get priority filters for this category
    const priorityFilters = useMemo(
        () => getFilterPillsForCategory(categorySlug),
        [categorySlug]
    )

    // Build pill data - limit to 4 quick pills + "All filters"
    const pills = useMemo(() => {
        const result: Array<{
            id: string
            label: string
            icon: React.ElementType
            isActive: boolean
            section: FilterModalSection | null // null means open full hub
        }> = []

        // Keep the row compact: 3 quick pills max (plus All filters + Sort).
        for (const filterKey of priorityFilters.slice(0, 3)) {
            // Check if it's a base filter or an attribute filter
            if (isBaseFilter(filterKey)) {
                // Base filters: price, category
                const isActive =
                    filterKey === "price"
                        ? Boolean(searchParams.get("minPrice") || searchParams.get("maxPrice"))
                        : false

                result.push({
                    id: filterKey,
                    label:
                        filterKey === "price"
                            ? tFilters("price")
                            : filterKey === "category"
                                ? tHub("category")
                                : filterKey,
                    icon: FILTER_ICONS[filterKey] || Tag,
                    isActive,
                    section: filterKey as FilterModalSection,
                })
            } else {
                // Attribute filters - find matching attribute
                const attr = attributes.find(
                    (a) => a.name.toLowerCase() === filterKey.toLowerCase()
                )
                if (attr) {
                    const paramKey = `attr_${attr.name}`
                    const isActive = searchParams.getAll(paramKey).length > 0

                    result.push({
                        id: `attr_${attr.id}`,
                        label: locale === "bg" && attr.name_bg ? attr.name_bg : attr.name,
                        icon: FILTER_ICONS[filterKey] || Tag,
                        isActive,
                        section: `attr_${attr.id}` as FilterModalSection,
                    })
                }
            }
        }

        return result
    }, [priorityFilters, attributes, searchParams, locale, tFilters, tHub])

    const handlePillClick = useCallback(
        (pill: { section: FilterModalSection | null; label: string }) => {
            if (!pill.section) {
                setHubOpen(true)
                return
            }

            setSingleSection(pill.section)
            setSingleLabel(pill.label)

            if (pill.section.startsWith("attr_")) {
                const id = pill.section.replace("attr_", "")
                const attr = attributes.find((a) => a.id === id)
                setSingleAttribute(attr)
            } else {
                setSingleAttribute(undefined)
            }

            setSingleOpen(true)
        },
        [attributes]
    )

    const handleAllFiltersClick = useCallback(() => {
        setHubOpen(true)
    }, [])

    // Count active filters
    const activeFilterCount = useMemo(() => {
        let count = 0
        if (searchParams.get("minPrice") || searchParams.get("maxPrice")) count++
        if (searchParams.get("minRating")) count++
        if (searchParams.get("availability")) count++
        for (const attr of attributes) {
            if (searchParams.getAll(`attr_${attr.name}`).length > 0) count++
        }
        return count
    }, [searchParams, attributes])

    return (
        <>
            <div
                className={cn(
                    "bg-background border-b border-border/30",
                    "px-(--page-inset) py-1.5",
                    className
                )}
            >
                <div
                    className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
                    role="group"
                    aria-label={tFilters("filters")}
                >
                    {/* All Filters Pill (first) */}
                    <button
                        type="button"
                        onClick={handleAllFiltersClick}
                        className={cn(
                            "shrink-0 h-touch-sm px-3 rounded-full",
                            "flex items-center gap-1.5",
                            "text-xs font-medium",
                            "border transition-colors",
                            activeFilterCount > 0
                                ? "bg-muted text-foreground border-border/60"
                                : "bg-background hover:bg-muted/40 active:bg-muted/60 border-border/60 text-foreground"
                        )}
                        aria-haspopup="dialog"
                    >
                        <Sliders size={14} weight="regular" className="shrink-0" />
                        <span className="whitespace-nowrap">{tHub("allFilters")}</span>
                        {activeFilterCount > 0 && (
                            <span className="bg-foreground text-background text-2xs font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Divider (matches reference spacing) */}
                    <div className="h-4 w-px bg-border/60 mx-0.5 shrink-0" aria-hidden="true" />

                    {/* Sort Pill (second) */}
                    <button
                        type="button"
                        onClick={() => setSortOpen(true)}
                        className={cn(
                            "shrink-0 h-touch-sm px-3 rounded-full",
                            "flex items-center gap-1.5",
                            "text-xs font-medium whitespace-nowrap",
                            "border transition-colors",
                            "bg-transparent text-muted-foreground border-transparent",
                            "hover:bg-muted/40 hover:text-foreground",
                            "active:bg-muted/60"
                        )}
                        aria-haspopup="dialog"
                    >
                        <span>{tFilters("sortBy")}</span>
                    </button>

                    {/* Quick Filter Pills */}
                    {pills.map((pill) => {
                        const Icon = pill.icon
                        return (
                            <button
                                key={pill.id}
                                type="button"
                                onClick={() => handlePillClick({ section: pill.section, label: pill.label })}
                                className={cn(
                                    "shrink-0 h-touch-sm px-3 rounded-full",
                                    "flex items-center gap-1.5",
                                    "text-xs font-medium whitespace-nowrap",
                                    "border transition-colors",
                                    pill.isActive
                                        ? "bg-muted text-foreground border-border/60"
                                        : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/40 hover:text-foreground active:bg-muted/60"
                                )}
                                aria-pressed={pill.isActive}
                                aria-haspopup="dialog"
                            >
                                <Icon size={14} weight="regular" className="shrink-0" />
                                <span className="whitespace-nowrap">{pill.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Sort Modal */}
            <SortModal
                open={sortOpen}
                onOpenChange={setSortOpen}
                locale={locale}
                basePath={basePath}
            />

            {/* Single-section Filter Modal (Dialog) */}
            {singleSection && (singleSection.startsWith("attr_") && singleAttribute ? (
                <FilterModal
                    open={singleOpen}
                    onOpenChange={setSingleOpen}
                    section={singleSection}
                    sectionLabel={singleLabel}
                    locale={locale}
                    {...(categorySlug ? { categorySlug } : {})}
                    {...(categoryId ? { categoryId } : {})}
                    {...(searchQuery ? { searchQuery } : {})}
                    attribute={singleAttribute}
                    subcategories={subcategories}
                    {...(categoryName ? { categoryName } : {})}
                    {...(basePath ? { basePath } : {})}
                    {...(categoryParamKey ? { categoryParamKey } : {})}
                    showAllCategoriesOption={categoryParamKey === "category"}
                />
            ) : (
                <FilterModal
                    open={singleOpen}
                    onOpenChange={setSingleOpen}
                    section={singleSection}
                    sectionLabel={singleLabel}
                    locale={locale}
                    {...(categorySlug ? { categorySlug } : {})}
                    {...(categoryId ? { categoryId } : {})}
                    {...(searchQuery ? { searchQuery } : {})}
                    subcategories={subcategories}
                    {...(categoryName ? { categoryName } : {})}
                    {...(basePath ? { basePath } : {})}
                    {...(categoryParamKey ? { categoryParamKey } : {})}
                    showAllCategoriesOption={categoryParamKey === "category"}
                />
            ))}

            {/* Full Filter Hub (Drawer) */}
            <FilterHub
                open={hubOpen}
                onOpenChange={setHubOpen}
                locale={locale}
                {...(categorySlug ? { categorySlug } : {})}
                {...(categoryId ? { categoryId } : {})}
                {...(searchQuery ? { searchQuery } : {})}
                attributes={attributes}
                {...(basePath ? { basePath } : {})}
                // On /search, category selection is handled via the single-section Category modal
                // to avoid navigating away to /categories.
                subcategories={categoryParamKey ? [] : subcategories}
                {...(!categoryParamKey && categoryName ? { categoryName } : {})}
                mode="full"
                initialSection={null}
            />
        </>
    )
}
