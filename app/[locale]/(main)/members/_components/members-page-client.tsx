"use client"

import { useState, useTransition } from "react"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, ArrowRight, CircleCheck as CheckCircle, Search as MagnifyingGlass, MapPin, Package, ShoppingBag, LoaderCircle as SpinnerGap, Star, Store as Storefront, Users } from "lucide-react";


import { AppBreadcrumb } from "../../../_components/navigation/app-breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { UserAvatar } from "@/components/shared/user-avatar"
import { PageShell } from "../../../_components/page-shell"

interface Member {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  account_type: string | null
  is_seller: boolean | null
  is_verified_business: boolean | null
  verified: boolean | null
  location: string | null
  tier: string | null
  created_at: string
}

export interface MembersPageClientProps {
  members: Member[]
  totalCount: number
  totalMembers: number
  totalSellers: number
  currentPage: number
  totalPages: number
  filter: string
  sort: string
  searchQuery: string
  locale: string
}

const MEMBERS_PAGE_COPY = {
  bg: {
    home: "Начало",
    community: "Общност",
    discover: "Открий продавачи и купувачи",
    members: "членове",
    sellers: "продавачи",
    searchByName: "Търси по име",
    searchByNamePlaceholder: "Търси по име...",
    searchButton: "Търси",
    sortBy: "Сортирай по",
    sortRecentlyActive: "Наскоро активни",
    sortHighestRated: "Най-високо оценени",
    sortMostSales: "Най-много продажби",
    sortMostPurchases: "Най-много покупки",
    sortNewest: "Най-нови",
    filterAll: "Всички",
    filterSellers: "Продавачи",
    filterBuyers: "Купувачи",
    filterBusiness: "Бизнес",
    results: "резултата",
    forLabel: "за",
    noMembersFound: "Няма намерени членове",
    previous: "Предишна",
    next: "Следваща",
    page: "Страница",
    of: "от",
  },
  en: {
    home: "Home",
    community: "Community",
    discover: "Discover sellers and buyers",
    members: "members",
    sellers: "sellers",
    searchByName: "Search by name",
    searchByNamePlaceholder: "Search by name...",
    searchButton: "Search",
    sortBy: "Sort by",
    sortRecentlyActive: "Recently Active",
    sortHighestRated: "Highest Rated",
    sortMostSales: "Most Sales",
    sortMostPurchases: "Most Purchases",
    sortNewest: "Newest",
    filterAll: "All",
    filterSellers: "Sellers",
    filterBuyers: "Buyers",
    filterBusiness: "Business",
    results: "results",
    forLabel: "for",
    noMembersFound: "No members found",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
  },
} as const

function getMembersPageCopy(locale: string) {
  return locale === "bg" ? MEMBERS_PAGE_COPY.bg : MEMBERS_PAGE_COPY.en
}

function MemberCard({ member, locale }: { member: Member; locale: string }) {
  const displayName = member.display_name || member.username || "Unknown"
  const copy = getMembersPageCopy(locale)

  return (
    <Link href={`/${member.username || "unknown"}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="relative">
              <UserAvatar
                name={displayName}
                avatarUrl={member.avatar_url ?? null}
                className="size-14 border-2 border-background shadow bg-muted"
                fallbackClassName="text-lg bg-selected text-primary"
              />
              {(member.is_verified_business || member.verified) && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-info rounded-full p-0.5 border-2 border-background">
                  <CheckCircle className="size-3 text-info-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold tracking-tight truncate group-hover:text-primary transition-colors">{displayName}</h3>
              </div>
              <p className="text-xs text-muted-foreground">@{member.username}</p>

              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {member.is_seller && (
                  <Badge variant="secondary" className="text-2xs px-1.5 py-0 gap-0.5">
                    <Package className="size-3" />
                    Seller
                  </Badge>
                )}
                {member.tier && member.tier !== "free" && (
                  <Badge
                    variant="outline"
                    className="text-2xs px-1.5 py-0 gap-0.5 text-rating border-rating/30 bg-rating/10"
                  >
                    <Star className="size-3" />
                    {member.tier}
                  </Badge>
                )}
              </div>

              {member.location && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1.5">
                  <MapPin className="size-3" />
                  {member.location}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
            {member.account_type === "business" && (
              <Badge variant="secondary" className="text-2xs px-1.5 py-0">
                <Storefront className="size-3 mr-0.5" />
                {copy.filterBusiness}
              </Badge>
            )}
            <span className="text-2xs text-muted-foreground">
              {locale === "bg" ? "Присъединил се" : "Joined"}{" "}
              {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function MembersPageClient({
  members,
  totalCount,
  totalMembers,
  totalSellers,
  currentPage,
  totalPages,
  filter,
  sort,
  searchQuery,
  locale,
}: MembersPageClientProps) {
  const router = useRouter()
  const copy = getMembersPageCopy(locale)
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(searchQuery)

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams()
    if (filter !== "all" || updates.filter) params.set("filter", updates.filter || filter)
    if (sort !== "active" || updates.sort) params.set("sort", updates.sort || sort)
    if (search || updates.q) params.set("q", updates.q ?? search)
    if (updates.page) params.set("page", updates.page)

    startTransition(() => {
      router.push(`/members?${params.toString()}`)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ q: search, page: "1" })
  }

  return (
    <PageShell variant="muted">
      <div className="bg-primary text-primary-foreground py-6 sm:py-10">
        <div className="container">
          <div className="[&_nav]:border-border-subtle [&_nav]:mb-2 [&_a]:text-foreground [&_a:hover]:text-primary-foreground [&_span[aria-current]]:text-primary-foreground [&_svg]:text-muted-foreground">
            <AppBreadcrumb
              items={[
                { label: copy.home, href: "/" },
                { label: copy.community },
              ]}
              homeLabel={copy.home}
            />
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 sm:size-14 bg-hover rounded-full flex items-center justify-center">
              <Users className="size-6 sm:size-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">{copy.community}</h1>
              <p className="text-foreground text-sm sm:text-base mt-1">
                {copy.discover}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-4 text-sm">
            <div>
              <span className="text-2xl font-bold">{totalMembers.toLocaleString()}</span>
              <p className="text-foreground">{copy.members}</p>
            </div>
            <div>
              <span className="text-2xl font-bold">{totalSellers.toLocaleString()}</span>
              <p className="text-foreground">{copy.sellers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <FieldLabel htmlFor="members-search" className="sr-only">
                {copy.searchByName}
              </FieldLabel>
              <Input
                id="members-search"
                placeholder={copy.searchByNamePlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-20"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                disabled={isPending}
              >
                {isPending ? (
                  <SpinnerGap className="size-4 animate-spin" />
                ) : (
                  copy.searchButton
                )}
              </Button>
            </div>
          </form>

          <Select value={sort} onValueChange={(value) => updateParams({ sort: value, page: "1" })}>
            <SelectTrigger className="w-full sm:w-(--members-sort-w-sm)">
              <SelectValue placeholder={copy.sortBy} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{copy.sortRecentlyActive}</SelectItem>
              <SelectItem value="rating">{copy.sortHighestRated}</SelectItem>
              <SelectItem value="sales">{copy.sortMostSales}</SelectItem>
              <SelectItem value="purchases">{copy.sortMostPurchases}</SelectItem>
              <SelectItem value="newest">{copy.sortNewest}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(value) => value && updateParams({ filter: value, page: "1" })}
          className="justify-start mb-6"
        >
          <ToggleGroupItem value="all" className="gap-2">
            <Users className="size-4" />
            {copy.filterAll}
          </ToggleGroupItem>
          <ToggleGroupItem value="sellers" className="gap-2">
            <Package className="size-4" />
            {copy.filterSellers}
          </ToggleGroupItem>
          <ToggleGroupItem value="buyers" className="gap-2">
            <ShoppingBag className="size-4" />
            {copy.filterBuyers}
          </ToggleGroupItem>
          <ToggleGroupItem value="business" className="gap-2">
            <Storefront className="size-4" />
            {copy.filterBusiness}
          </ToggleGroupItem>
        </ToggleGroup>

        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span>{" "}
          {copy.results}
          {searchQuery && <span> {copy.forLabel} &quot;{searchQuery}&quot;</span>}
        </p>

        {members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <Users className="size-12 mx-auto mb-3 opacity-50" />
            <p>{copy.noMembersFound}</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1 || isPending}
              onClick={() => updateParams({ page: String(currentPage - 1) })}
            >
              <ArrowLeft className="size-4 mr-1" />
              {copy.previous}
            </Button>

            <span className="text-sm text-muted-foreground px-4">
              {copy.page} {currentPage} {copy.of} {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => updateParams({ page: String(currentPage + 1) })}
            >
              {copy.next}
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </PageShell>
  )
}

