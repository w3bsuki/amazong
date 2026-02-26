import { useCallback, useMemo } from "react"
import { Check } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { usePathname, useRouter } from "@/i18n/routing"
import { DrawerBody } from "@/components/ui/drawer"
import { DrawerShell } from "@/components/shared/drawer-shell"

interface SearchSortSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchSortSheet({ open, onOpenChange }: SearchSortSheetProps) {
  const t = useTranslations("SearchFilters")
  const tCommon = useTranslations("Common")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const normalizedPathname = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean)
    const maybeLocale = segments[0]
    if (maybeLocale && /^[a-z]{2}(-[A-Z]{2})?$/i.test(maybeLocale)) {
      segments.shift()
    }
    return `/${segments.join("/")}` || "/"
  }, [pathname])

  const rawSort = searchParams.get("sort")
  const currentSort = useMemo(() => {
    const normalized = !rawSort || rawSort === "featured" ? "relevance" : rawSort
    return ["relevance", "price-asc", "price-desc", "rating", "newest"].includes(normalized)
      ? normalized
      : "relevance"
  }, [rawSort])

  const sortOptions = useMemo(
    () => [
      { value: "relevance", label: t("relevance") },
      { value: "price-asc", label: t("priceLowHigh") },
      { value: "price-desc", label: t("priceHighLow") },
      { value: "rating", label: t("avgReview") },
      { value: "newest", label: t("newestArrivals") },
    ],
    [t],
  )

  const applySort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value === "relevance") {
        params.delete("sort")
      } else {
        params.set("sort", value)
      }

      const queryString = params.toString()
      router.replace(queryString ? `${normalizedPathname}?${queryString}` : normalizedPathname)
    },
    [normalizedPathname, router, searchParams],
  )

  return (
    <DrawerShell
      open={open}
      onOpenChange={onOpenChange}
      title={t("sortBy")}
      closeLabel={tCommon("close")}
      contentAriaLabel={t("sortBy")}
      headerLayout="centered"
      headerClassName="border-border-subtle px-inset pt-4 pb-3"
      titleClassName="text-base font-semibold tracking-tight"
      closeButtonClassName="text-muted-foreground hover:text-foreground hover:bg-hover active:bg-active"
      closeIconSize={18}
      contentClassName="max-h-dialog"
    >
      <DrawerBody className="px-inset py-3" noDrag>
        <div className="grid gap-2">
          {sortOptions.map((option) => {
            const isActive = option.value === currentSort
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  applySort(option.value)
                  onOpenChange(false)
                }}
                className="inline-flex w-full min-h-(--control-default) items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground tap-transparent transition-colors hover:bg-hover active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1"
                aria-pressed={isActive}
              >
                <span className="truncate">{option.label}</span>
                {isActive ? <Check className="size-4 text-primary" aria-hidden="true" /> : null}
              </button>
            )
          })}
        </div>
      </DrawerBody>
    </DrawerShell>
  )
}

