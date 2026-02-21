"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react"
import { usePathname, useRouter } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search as MagnifyingGlass } from "lucide-react"
import { SmartRail } from "@/components/mobile/chrome/smart-rail"

import { cn } from "@/lib/utils"

type StatusKey = "all" | "pending" | "shipped" | "completed"

function normalizeStatusKey(value: string): StatusKey {
  switch (value) {
    case "pending":
    case "shipped":
    case "completed":
      return value
    case "all":
    default:
      return "all"
  }
}

export function AccountOrdersToolbar({
  locale,
  initialQuery,
  initialStatus,
  counts,
  className,
}: {
  locale: string
  initialQuery: string
  initialStatus: string
  counts: { all: number; pending: number; shipped: number; completed: number }
  className?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("Account")
  const tCommon = useTranslations("Common")
  const [isPending, startTransition] = useTransition()

  const localePrefix = `/${locale}`
  const basePathname = pathname.startsWith(localePrefix)
    ? (pathname.slice(localePrefix.length) || "/")
    : pathname

  const [query, setQuery] = useState(initialQuery)
  const [status, setStatus] = useState<StatusKey>(
    normalizeStatusKey(initialStatus),
  )

  const didMount = useRef(false)

  const getFilterLabel = useCallback(
    (key: StatusKey) => {
      if (key === "all") return tCommon("all")

      const base =
        key === "pending"
          ? t("ordersPage.filters.pending")
          : key === "shipped"
            ? t("ordersPage.filters.shipped")
            : t("ordersPage.filters.completed")

      const count = counts[key] ?? 0
      return count > 0 ? `${base} ${count}` : base
    },
    [counts, t, tCommon],
  )

  const buildUrl = useCallback(
    (next: { q?: string | null; status?: StatusKey | null }) => {
      const params = new URLSearchParams(searchParams?.toString() || "")

      if (next.q === null) params.delete("q")
      else if (typeof next.q === "string") {
        const trimmed = next.q.trim()
        if (!trimmed) params.delete("q")
        else params.set("q", trimmed)
      }

      if (next.status === null) params.delete("status")
      else if (next.status) {
        if (next.status === "all") params.delete("status")
        else params.set("status", next.status)
      }

      const qs = params.toString()
      return qs ? `${basePathname}?${qs}` : basePathname
    },
    [basePathname, searchParams],
  )

  const applyUrl = useCallback(
    (next: { q?: string | null; status?: StatusKey | null }) => {
      const url = buildUrl(next)
      startTransition(() => {
        router.replace(url, { scroll: false })
      })
    },
    [buildUrl, router, startTransition],
  )

  const debouncedSearchStateRef = useRef({ applyUrl, status })

  useEffect(() => {
    debouncedSearchStateRef.current = { applyUrl, status }
  }, [applyUrl, status])

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    const handle = window.setTimeout(() => {
      const state = debouncedSearchStateRef.current
      state.applyUrl({ q: query, status: state.status })
    }, 250)

    return () => window.clearTimeout(handle)
  }, [query])

  useEffect(() => {
    setStatus(normalizeStatusKey(initialStatus))
  }, [initialStatus])

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Mobile: SmartRail status filter */}
      <div className="md:hidden -mx-(--spacing-home-inset)">
        <SmartRail
          ariaLabel={t("ordersPage.filtersAriaLabel")}
          pills={(
            [
              { id: "all", key: "all" as const },
              { id: "pending", key: "pending" as const },
              { id: "shipped", key: "shipped" as const },
              { id: "completed", key: "completed" as const },
            ] as const
          ).map(({ id, key }) => ({
            id,
            label: getFilterLabel(key),
            active: status === key,
            href: buildUrl({ status: key, q: query }),
            onSelect: () => {
              setStatus(key)
              applyUrl({ status: key, q: query })
            },
          }))}
          sticky={true}
          stickyTop="0px"
          testId="account-orders-smart-rail"
        />
      </div>

      {/* Desktop: Tabs + search */}
      <div className="hidden md:block">
        <Tabs
          value={status}
          onValueChange={(v) => {
            const nextStatus = (v as StatusKey) || "all"
            setStatus(nextStatus)
            applyUrl({ status: nextStatus, q: query })
          }}
          className="w-full"
        >
          <TabsList className="w-full sm:w-fit overflow-x-auto no-scrollbar whitespace-nowrap justify-start">
            <TabsTrigger value="all" className="text-xs flex-none">
              {tCommon("all")}
              <span className="ml-1 tabular-nums text-muted-foreground">{counts.all}</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs flex-none">
              {t("ordersPage.filters.pending")}
              <span className="ml-1 tabular-nums text-muted-foreground">{counts.pending}</span>
            </TabsTrigger>
            <TabsTrigger value="shipped" className="text-xs flex-none">
              {t("ordersPage.filters.shipped")}
              <span className="ml-1 tabular-nums text-muted-foreground">{counts.shipped}</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs flex-none">
              {t("ordersPage.filters.completed")}
              <span className="ml-1 tabular-nums text-muted-foreground">{counts.completed}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative mt-3">
          <MagnifyingGlass className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("ordersPage.searchPlaceholder")}
            className="pl-9"
            aria-label={tCommon("search")}
          />
          {isPending && (
            <div className="absolute right-3 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-border border-t-transparent" />
          )}
        </div>
      </div>

    </div>
  )
}
