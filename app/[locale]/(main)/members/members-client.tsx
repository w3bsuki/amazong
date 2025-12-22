"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Users,
  Storefront,
  ShoppingBag,
  Star,
  Package,
  MagnifyingGlass,
  CheckCircle,
  MapPin,
  ArrowLeft,
  ArrowRight,
  SpinnerGap,
} from "@phosphor-icons/react"
import { AppBreadcrumb } from "@/components/navigation/app-breadcrumb"
import { formatDistanceToNow } from "date-fns"

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

interface MembersClientProps {
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

function MemberCard({ member, locale }: { member: Member; locale: string }) {
  const displayName = member.display_name || member.username || "Unknown"
  const initials = displayName.substring(0, 2).toUpperCase()
  
  return (
    <Link href={`/${locale}/${member.username || "unknown"}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar className="size-14 border-2 border-background shadow">
                <AvatarImage src={member.avatar_url ?? undefined} alt={displayName} />
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {(member.is_verified_business || member.verified) && (
                <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5 border-2 border-background">
                  <CheckCircle className="size-3 text-white" weight="fill" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {displayName}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">@{member.username}</p>
              
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {member.is_seller && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
                    <Package className="size-3" />
                    Seller
                  </Badge>
                )}
                {member.tier && member.tier !== 'free' && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5 text-yellow-600 border-yellow-200 bg-yellow-50">
                    <Star className="size-3" weight="fill" />
                    {member.tier}
                  </Badge>
                )}
              </div>
              
              {member.location && (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1.5">
                  <MapPin className="size-3" />
                  {member.location}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t text-[11px] text-muted-foreground">
            {member.account_type === "business" && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                <Storefront className="size-3 mr-0.5" />
                {locale === "bg" ? "Бизнес" : "Business"}
              </Badge>
            )}
            <span className="text-[10px] text-muted-foreground">
              {locale === "bg" ? "Присъединил се" : "Joined"} {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function MembersClient({
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
}: MembersClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(searchQuery)
  
  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams()
    if (filter !== "all" || updates.filter) params.set("filter", updates.filter || filter)
    if (sort !== "active" || updates.sort) params.set("sort", updates.sort || sort)
    if (search || updates.q) params.set("q", updates.q ?? search)
    if (updates.page) params.set("page", updates.page)
    
    startTransition(() => {
      router.push(`/${locale}/members?${params.toString()}`)
    })
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ q: search, page: "1" })
  }
  
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary/80 text-white py-6 sm:py-10">
        <div className="container">
          <div className="[&_nav]:border-white/20 [&_nav]:mb-2 [&_a]:text-white/80 [&_a:hover]:text-white [&_span[aria-current]]:text-white [&_svg]:text-white/50">
            <AppBreadcrumb 
              items={[
                { label: locale === "bg" ? "Начало" : "Home", href: "/" },
                { label: locale === "bg" ? "Общност" : "Community" },
              ]}
              homeLabel={locale === "bg" ? "Начало" : "Amazong"}
            />
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 sm:size-14 bg-white/10 rounded-full flex items-center justify-center">
              <Users className="size-6 sm:size-7 text-white" weight="fill" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold">
                {locale === "bg" ? "Общност" : "Community"}
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">
                {locale === "bg" 
                  ? "Открий продавачи и купувачи" 
                  : "Discover sellers and buyers"}
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex gap-6 mt-4 text-sm">
            <div>
              <span className="text-2xl font-bold">{totalMembers.toLocaleString()}</span>
              <p className="text-white/70">{locale === "bg" ? "членове" : "members"}</p>
            </div>
            <div>
              <span className="text-2xl font-bold">{totalSellers.toLocaleString()}</span>
              <p className="text-white/70">{locale === "bg" ? "продавачи" : "sellers"}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-6">
        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder={locale === "bg" ? "Търси по име..." : "Search by name..."}
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
                {isPending ? <SpinnerGap className="size-4 animate-spin" /> : locale === "bg" ? "Търси" : "Search"}
              </Button>
            </div>
          </form>
          
          {/* Sort */}
          <Select value={sort} onValueChange={(value) => updateParams({ sort: value, page: "1" })}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={locale === "bg" ? "Сортирай по" : "Sort by"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{locale === "bg" ? "Наскоро активни" : "Recently Active"}</SelectItem>
              <SelectItem value="rating">{locale === "bg" ? "Най-високо оценени" : "Highest Rated"}</SelectItem>
              <SelectItem value="sales">{locale === "bg" ? "Най-много продажби" : "Most Sales"}</SelectItem>
              <SelectItem value="purchases">{locale === "bg" ? "Най-много покупки" : "Most Purchases"}</SelectItem>
              <SelectItem value="newest">{locale === "bg" ? "Най-нови" : "Newest"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Filter Tabs */}
        <ToggleGroup 
          type="single" 
          value={filter} 
          onValueChange={(value) => value && updateParams({ filter: value, page: "1" })}
          className="justify-start mb-6"
        >
          <ToggleGroupItem value="all" className="gap-2">
            <Users className="size-4" />
            {locale === "bg" ? "Всички" : "All"}
          </ToggleGroupItem>
          <ToggleGroupItem value="sellers" className="gap-2">
            <Package className="size-4" />
            {locale === "bg" ? "Продавачи" : "Sellers"}
          </ToggleGroupItem>
          <ToggleGroupItem value="buyers" className="gap-2">
            <ShoppingBag className="size-4" />
            {locale === "bg" ? "Купувачи" : "Buyers"}
          </ToggleGroupItem>
          <ToggleGroupItem value="business" className="gap-2">
            <Storefront className="size-4" />
            {locale === "bg" ? "Бизнес" : "Business"}
          </ToggleGroupItem>
        </ToggleGroup>
        
        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span>{" "}
          {locale === "bg" ? "резултата" : "results"}
          {searchQuery && (
            <span> {locale === "bg" ? "за" : "for"} &quot;{searchQuery}&quot;</span>
          )}
        </p>
        
        {/* Members Grid */}
        {members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {members.map((member) => (
              <MemberCard key={member.id} member={member} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <Users className="size-12 mx-auto mb-3 opacity-50" />
            <p>{locale === "bg" ? "Няма намерени членове" : "No members found"}</p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1 || isPending}
              onClick={() => updateParams({ page: String(currentPage - 1) })}
            >
              <ArrowLeft className="size-4 mr-1" />
              {locale === "bg" ? "Предишна" : "Previous"}
            </Button>
            
            <span className="text-sm text-muted-foreground px-4">
              {locale === "bg" ? "Страница" : "Page"} {currentPage} {locale === "bg" ? "от" : "of"} {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || isPending}
              onClick={() => updateParams({ page: String(currentPage + 1) })}
            >
              {locale === "bg" ? "Следваща" : "Next"}
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
