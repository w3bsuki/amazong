"use client"

import { useState } from "react"
import { Search as MagnifyingGlass } from "lucide-react"
import { useTranslations } from "next-intl"
import { MobileSearchOverlay } from "@/components/layout/header/search/mobile-search-overlay"

interface SearchBarPillProps {
  query: string
}

export function SearchBarPill({ query }: SearchBarPillProps) {
  const [open, setOpen] = useState(false)
  const t = useTranslations("SearchOverlay")

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-(--control-default) w-full items-center gap-2 rounded-full border border-border-subtle bg-surface-subtle px-3 text-left tap-transparent active:bg-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        aria-label={t("search")}
      >
        <MagnifyingGlass className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="truncate text-sm text-foreground">
          {query || t("search")}
        </span>
      </button>
      <MobileSearchOverlay
        hideDefaultTrigger
        externalOpen={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
