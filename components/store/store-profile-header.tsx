"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ShieldCheck, 
  Star,
  CalendarBlank,
  ShareNetwork,
  DotsThree,
  Storefront,
  ArrowLeft,
  UserPlus,
  UserMinus
} from "@phosphor-icons/react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import type { StoreInfo } from "@/lib/data/store"
import { ContactStoreButton } from "./contact-store-button"
import { SellerBadgeGroup, VerificationBadge, TrustScore } from "@/components/badges"
import type { DisplayBadge, TrustScoreBreakdown } from "@/lib/types/badges"

interface StoreProfileHeaderProps {
  store: StoreInfo
  locale: string
  badges?: DisplayBadge[]
  trustScore?: number
  trustBreakdown?: TrustScoreBreakdown
  verificationLevel?: "basic" | "verified" | "pro" | "enterprise"
  accountType?: "personal" | "business"
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatMemberSince(dateString: string, locale: string): string {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" }
  return date.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", options)
}

function formatNumber(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`
  }
  return count.toString()
}

function getTierBadge(tier: string, locale: string) {
  const labels: Record<string, { en: string; bg: string; color: string }> = {
    premium: { en: "Premium", bg: "Премиум", color: "bg-amber-500 text-white" },
    business: { en: "Business", bg: "Бизнес", color: "bg-blue-600 text-white" },
  }
  
  if (tier === 'basic') return null
  const label = labels[tier]
  if (!label) return null
  
  return (
    <Badge className={`${label.color} text-xs font-medium`}>
      {locale === "bg" ? label.bg : label.en}
    </Badge>
  )
}

export function StoreProfileHeader({ 
  store, 
  locale,
  badges = [],
  trustScore,
  trustBreakdown,
  verificationLevel,
  accountType = "personal",
}: StoreProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [followerCount, setFollowerCount] = useState(store.follower_count || 0)
  const supabase = createClient()
  const { toast } = useToast()

  // Check if user is following this store on mount
  useEffect(() => {
    const checkFollowStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("store_followers")
        .select("id")
        .eq("follower_id", user.id)
        .eq("seller_id", store.id)
        .maybeSingle()
      
      setIsFollowing(!!data)
    }
    checkFollowStatus()
  }, [store.id, supabase])

  const handleFollow = async () => {
    setIsFollowLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Redirect to login
        window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`
        return
      }

      if (user.id === store.id) {
        toast({
          title: locale === "bg" ? "Не можете да следвате себе си" : "Cannot follow yourself",
          variant: "destructive"
        })
        return
      }

      if (isFollowing) {
        // Unfollow
        await supabase
          .from("store_followers")
          .delete()
          .eq("follower_id", user.id)
          .eq("seller_id", store.id)
        
        setIsFollowing(false)
        setFollowerCount(prev => Math.max(0, prev - 1))
        toast({
          title: locale === "bg" ? "Отписахте се" : "Unfollowed",
          description: locale === "bg" 
            ? `Вече не следвате ${store.store_name}` 
            : `You unfollowed ${store.store_name}`
        })
      } else {
        // Follow - use upsert to handle if already following
        const { error } = await supabase
          .from("store_followers")
          .upsert(
            { follower_id: user.id, seller_id: store.id },
            { onConflict: "follower_id,seller_id", ignoreDuplicates: true }
          )
        
        if (error) throw error
        setIsFollowing(true)
        setFollowerCount(prev => prev + 1)
        toast({
          title: locale === "bg" ? "Последвахте" : "Following",
          description: locale === "bg" 
            ? `Вече следвате ${store.store_name}` 
            : `You are now following ${store.store_name}`
        })
      }
    } catch (error) {
      console.error("Follow error:", error)
      toast({
        title: locale === "bg" ? "Грешка" : "Error",
        description: locale === "bg" ? "Нещо се обърка" : "Something went wrong",
        variant: "destructive"
      })
    } finally {
      setIsFollowLoading(false)
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: store.store_name,
      text: store.description || `Check out ${store.store_name}`,
      url: window.location.href,
    }
    
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="bg-background">
      {/* Mobile Instagram-style header */}
      <div className="md:hidden">
        {/* Top bar with back arrow + store name */}
        <div className="sticky top-0 z-50 flex items-center justify-between px-2 py-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="flex items-center gap-1">
            <Link 
              href="/"
              className="inline-flex items-center justify-center size-10 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <ArrowLeft weight="bold" className="size-5" />
            </Link>
            <Storefront weight="bold" className="size-5 text-foreground" />
            <h1 className="text-lg font-semibold truncate max-w-[200px]">
              {store.store_name}
            </h1>
            {store.verified && (
              <ShieldCheck weight="fill" className="size-5 text-primary shrink-0" />
            )}
          </div>
          <Button variant="ghost" size="icon-sm">
            <DotsThree weight="bold" className="size-5" />
          </Button>
        </div>
        
        {/* Profile section - Instagram style */}
        <div className="px-4 py-4">
          <div className="flex items-start gap-4">
            {/* Avatar - larger ring on tap */}
            <Avatar className="size-20 ring-2 ring-primary/30 ring-offset-2 ring-offset-background shrink-0">
              <AvatarImage src={store.avatar_url || undefined} alt={store.store_name} />
              <AvatarFallback className="text-xl bg-muted font-medium">
                {getInitials(store.store_name)}
              </AvatarFallback>
            </Avatar>
            
            {/* Stats row - Instagram style with improved spacing */}
            <div className="flex-1 flex justify-around pt-1.5">
              <button className="text-center active:opacity-70 transition-opacity">
                <div className="text-xl font-bold tabular-nums">{formatNumber(store.total_products)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {locale === "bg" ? "Обяви" : "Listings"}
                </div>
              </button>
              <button className="text-center active:opacity-70 transition-opacity">
                <div className="text-xl font-bold tabular-nums">{formatNumber(store.total_sales)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {locale === "bg" ? "Продажби" : "Sales"}
                </div>
              </button>
              <button className="text-center active:opacity-70 transition-opacity">
                <div className="text-xl font-bold tabular-nums">{formatNumber(store.review_count)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {locale === "bg" ? "Отзиви" : "Reviews"}
                </div>
              </button>
              <button className="text-center active:opacity-70 transition-opacity">
                <div className="text-xl font-bold tabular-nums">{formatNumber(followerCount)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {locale === "bg" ? "Последователи" : "Followers"}
                </div>
              </button>
            </div>
          </div>
          
          {/* Store info */}
          <div className="mt-3.5 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-base">{store.store_name}</span>
              {verificationLevel && (
                <VerificationBadge
                  level={verificationLevel}
                  accountType={accountType}
                  size="sm"
                  locale={locale as "en" | "bg"}
                />
              )}
              {getTierBadge(store.tier, locale)}
            </div>
            
            {/* Badges row */}
            {badges.length > 0 && (
              <SellerBadgeGroup
                badges={badges}
                size="xs"
                maxDisplay={3}
                showLabel={false}
                locale={locale as "en" | "bg"}
              />
            )}
            
            {/* Description */}
            {store.description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {store.description}
              </p>
            )}
            
            {/* Rating, Trust Score & member since - improved layout */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              {store.average_rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star weight="fill" className="size-4 text-amber-500" />
                  <span className="font-medium text-foreground">{store.average_rating}</span>
                  <span className="text-stock-available font-medium">
                    ({store.positive_feedback_percentage}%)
                  </span>
                </div>
              )}
              {trustScore !== undefined && (
                <TrustScore
                  score={trustScore}
                  breakdown={trustBreakdown}
                  size="sm"
                  locale={locale as "en" | "bg"}
                />
              )}
              <div className="flex items-center gap-1">
                <CalendarBlank className="size-4" />
                <span>{formatMemberSince(store.created_at, locale)}</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons - Follow + Message + Share with touch-friendly sizing */}
          <div className="flex gap-2 mt-4">
            <Button 
              variant={isFollowing ? "outline" : "default"}
              size="default"
              className="flex-1 min-h-10"
              onClick={handleFollow}
              disabled={isFollowLoading}
            >
              {isFollowing ? (
                <>
                  <UserMinus className="size-4 mr-1.5" />
                  {locale === "bg" ? "Отписване" : "Unfollow"}
                </>
              ) : (
                <>
                  <UserPlus className="size-4 mr-1.5" />
                  {locale === "bg" ? "Последвай" : "Follow"}
                </>
              )}
            </Button>
            <ContactStoreButton
              sellerId={store.id}
              storeName={store.store_name}
              variant="outline"
              size="default"
              className="flex-1 min-h-10"
              showIcon={true}
              showLabel={true}
              labelOverride={locale === "bg" ? "Съобщение" : "Message"}
            />
            <Button variant="outline" size="icon" onClick={handleShare} className="size-10 shrink-0">
              <ShareNetwork className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Desktop header - more traditional layout */}
      <div className="hidden md:block border-b">
        {/* Sticky nav bar with back button */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 flex items-center gap-3 h-14">
            <Link 
              href="/"
              className="inline-flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <ArrowLeft weight="bold" className="size-5" />
            </Link>
            <span className="font-bold text-lg">Shop4e</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground text-sm">{locale === "bg" ? "Магазин" : "Store"}</span>
          </div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
          <div className="flex items-start gap-8">
            {/* Avatar */}
            <Avatar className="size-32 ring-2 ring-border ring-offset-4 ring-offset-background shrink-0">
              <AvatarImage src={store.avatar_url || undefined} alt={store.store_name} />
              <AvatarFallback className="text-3xl bg-muted">
                {getInitials(store.store_name)}
              </AvatarFallback>
            </Avatar>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{store.store_name}</h1>
                {verificationLevel && (
                  <VerificationBadge
                    level={verificationLevel}
                    accountType={accountType}
                    size="md"
                    locale={locale as "en" | "bg"}
                  />
                )}
                {getTierBadge(store.tier, locale)}
              </div>
              
              {/* Seller Badges */}
              {badges.length > 0 && (
                <div className="mt-2">
                  <SellerBadgeGroup
                    badges={badges}
                    size="sm"
                    maxDisplay={5}
                    showLabel={true}
                    locale={locale as "en" | "bg"}
                  />
                </div>
              )}
              
              {store.description && (
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  {store.description}
                </p>
              )}
              
              {/* Stats - improved layout */}
              <div className="flex items-center gap-8 mt-5 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tabular-nums">{formatNumber(store.total_products)}</span>
                  <span className="text-muted-foreground">{locale === "bg" ? "обяви" : "listings"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tabular-nums">{formatNumber(store.total_sales)}</span>
                  <span className="text-muted-foreground">{locale === "bg" ? "продажби" : "sales"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tabular-nums">{formatNumber(store.review_count)}</span>
                  <span className="text-muted-foreground">{locale === "bg" ? "отзиви" : "reviews"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tabular-nums">{formatNumber(followerCount)}</span>
                  <span className="text-muted-foreground">{locale === "bg" ? "последователи" : "followers"}</span>
                </div>
                {store.average_rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star weight="fill" className="size-5 text-amber-500" />
                    <span className="font-bold text-xl tabular-nums">{store.average_rating}</span>
                    <span className="text-stock-available">
                      ({store.positive_feedback_percentage}% {locale === "bg" ? "положителни" : "positive"})
                    </span>
                  </div>
                )}
                {trustScore !== undefined && (
                  <TrustScore
                    score={trustScore}
                    breakdown={trustBreakdown}
                    size="md"
                    showLabel={true}
                    locale={locale as "en" | "bg"}
                  />
                )}
              </div>
              
              {/* Member since */}
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
                <CalendarBlank className="size-4" />
                <span>
                  {locale === "bg" ? "Член от" : "Member since"} {formatMemberSince(store.created_at, locale)}
                </span>
              </div>
              
              {/* Actions - improved button styling */}
              <div className="flex gap-3 mt-5">
                <Button 
                  variant={isFollowing ? "outline" : "default"}
                  size="lg"
                  onClick={handleFollow}
                  disabled={isFollowLoading}
                  className="min-w-[120px]"
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="size-4 mr-2" />
                      {locale === "bg" ? "Отписване" : "Unfollow"}
                    </>
                  ) : (
                    <>
                      <UserPlus className="size-4 mr-2" />
                      {locale === "bg" ? "Последвай" : "Follow"}
                    </>
                  )}
                </Button>
                <ContactStoreButton
                  sellerId={store.id}
                  storeName={store.store_name}
                  variant="outline"
                  size="lg"
                  showIcon={true}
                  showLabel={true}
                  labelOverride={locale === "bg" ? "Съобщение" : "Message"}
                />
                <Button variant="outline" size="icon" onClick={handleShare} className="size-11">
                  <ShareNetwork className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
