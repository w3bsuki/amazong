"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"
import { cn } from "@/lib/utils"

type StatusKey = "all" | "open" | "delivered" | "cancelled"

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
  counts: { all: number; open: number; delivered: number; cancelled: number }
  className?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(initialQuery)
  const [status, setStatus] = useState<StatusKey>(
    (initialStatus as StatusKey) || "all",
  )

  const didMount = useRef(false)

  const labels = useMemo(
    () => ({
      all: locale === "bg" ? "Всички" : "All",
      open: locale === "bg" ? "Активни" : "Open",
      delivered: locale === "bg" ? "Доставени" : "Delivered",
      cancelled: locale === "bg" ? "Отказани" : "Cancelled",
      search: locale === "bg" ? "Търсене" : "Search",
      searchPlaceholder: locale === "bg" ? "Търси по продукт или №" : "Search by item or #",
    }),
    [locale],
  )

  const buildUrl = (next: { q?: string | null; status?: StatusKey | null }) => {
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
    return qs ? `${pathname}?${qs}` : pathname
  }

  const applyUrl = (next: { q?: string | null; status?: StatusKey | null }) => {
    const url = buildUrl(next)
    startTransition(() => {
      router.replace(url, { scroll: false })
    })
  }

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    const handle = window.setTimeout(() => {
      applyUrl({ q: query, status })
    }, 250)

    return () => window.clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    setStatus((initialStatus as StatusKey) || "all")
  }, [initialStatus])

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Tabs
        value={status}
        onValueChange={(v) => {
          const nextStatus = (v as StatusKey) || "all"
          setStatus(nextStatus)
          applyUrl({ status: nextStatus, q: query })
        }}
        className="w-full"
      >
        <TabsList className="h-auto w-full sm:w-fit rounded-full border border-border bg-muted p-1 overflow-x-auto no-scrollbar whitespace-nowrap justify-start">
          <TabsTrigger value="all" className="rounded-full text-xs flex-none">
            {labels.all}
            <span className="ml-1 tabular-nums text-muted-foreground">{counts.all}</span>
          </TabsTrigger>
          <TabsTrigger value="open" className="rounded-full text-xs flex-none">
            {labels.open}
            <span className="ml-1 tabular-nums text-muted-foreground">{counts.open}</span>
          </TabsTrigger>
          <TabsTrigger value="delivered" className="rounded-full text-xs flex-none">
            {labels.delivered}
            <span className="ml-1 tabular-nums text-muted-foreground">{counts.delivered}</span>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="rounded-full text-xs flex-none">
            {labels.cancelled}
            <span className="ml-1 tabular-nums text-muted-foreground">{counts.cancelled}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="pl-9"
          aria-label={labels.search}
        />
        {isPending && (
          <div className="absolute right-3 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-transparent" />
        )}
      </div>
    </div>
  )
}
