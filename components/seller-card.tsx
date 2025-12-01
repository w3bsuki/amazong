"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Storefront, 
  ShieldCheck, 
  Clock, 
  CalendarBlank,
  Heart,
  Package,
  Truck,
  ChatsCircle
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { ContactSellerButton } from "./contact-seller-button"

interface SellerInfo {
  id: string
  store_name: string
  avatar_url?: string | null
  description?: string | null
  verified?: boolean
  created_at: string
  response_time_hours?: number
  total_items_sold?: number
  positive_feedback_percentage?: number
  // Detailed ratings (average for last 12 months)
  accuracy_rating?: number
  shipping_cost_rating?: number
  shipping_speed_rating?: number
  communication_rating?: number
}

interface SellerCardProps {
  seller: SellerInfo
  productId?: string
  productTitle?: string
  variant?: "full" | "compact" | "mini"
  showRatings?: boolean
  showContact?: boolean
  showDescription?: boolean
  className?: string
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

function formatItemsSold(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`
  }
  return count.toString()
}

interface RatingBarProps {
  label: string
  value: number
  icon: React.ReactNode
}

function RatingBar({ label, value, icon }: RatingBarProps) {
  const percentage = (value / 5) * 100
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 w-40 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex-1">
        <Progress value={percentage} className="h-2" />
      </div>
      <span className="text-sm font-medium w-8 text-right">{value.toFixed(1)}</span>
    </div>
  )
}

export function SellerCard({
  seller,
  productId,
  productTitle,
  variant = "full",
  showRatings = true,
  showContact = true,
  showDescription = true,
  className
}: SellerCardProps) {
  const t = useTranslations("Seller")

  // Mini variant - compact header strip
  if (variant === "mini") {
    return (
      <div className={`flex items-center gap-3 py-2 ${className}`}>
        <Link href={`/store/${seller.id}`} className="shrink-0">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src={seller.avatar_url || undefined} alt={seller.store_name} />
            <AvatarFallback className="text-xs bg-muted">
              {getInitials(seller.store_name)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <Link 
            href={`/store/${seller.id}`} 
            className="font-medium text-link hover:text-link-hover hover:underline"
          >
            {seller.store_name}
          </Link>
          {seller.positive_feedback_percentage !== undefined && (
            <span className="text-green-600 font-medium">
              {seller.positive_feedback_percentage.toFixed(0)}% {t("positive")}
            </span>
          )}
          <span className="text-muted-foreground">|</span>
          <Link 
            href={`/store/${seller.id}`}
            className="text-link hover:text-link-hover hover:underline"
          >
            {t("sellersOtherItems")}
          </Link>
          {showContact && productId && productTitle && (
            <>
              <span className="text-muted-foreground">|</span>
              <ContactSellerButton
                sellerId={seller.id}
                productId={productId}
                productTitle={productTitle}
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-link hover:text-link-hover hover:underline hover:bg-transparent"
                showIcon={false}
                showLabel={true}
              />
            </>
          )}
        </div>
        {seller.verified && (
          <Badge variant="secondary" className="shrink-0 gap-1 text-xs">
            <ShieldCheck weight="fill" className="h-3 w-3 text-blue-500" />
            {t("verified")}
          </Badge>
        )}
      </div>
    )
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Link href={`/store/${seller.id}`}>
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={seller.avatar_url || undefined} alt={seller.store_name} />
                <AvatarFallback className="bg-muted">
                  {getInitials(seller.store_name)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link 
                  href={`/store/${seller.id}`}
                  className="font-semibold text-foreground hover:text-link hover:underline truncate"
                >
                  {seller.store_name}
                </Link>
                {seller.verified && (
                  <ShieldCheck weight="fill" className="h-4 w-4 text-blue-500 shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                {seller.positive_feedback_percentage !== undefined && (
                  <span className="text-green-600 font-medium">
                    {seller.positive_feedback_percentage.toFixed(0)}% {t("positive")}
                  </span>
                )}
                {seller.total_items_sold !== undefined && seller.total_items_sold > 0 && (
                  <>
                    <span>•</span>
                    <span>{formatItemsSold(seller.total_items_sold)} {t("itemsSold")}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {showContact && productId && productTitle && (
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href={`/store/${seller.id}`}>
                  <Storefront className="h-4 w-4 mr-2" />
                  {t("visitStore")}
                </Link>
              </Button>
              <ContactSellerButton
                sellerId={seller.id}
                productId={productId}
                productTitle={productTitle}
                variant="outline"
                size="sm"
                className="flex-1"
                showIcon={true}
                showLabel={true}
              />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Full variant (default)
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">{t("aboutThisSeller")}</h2>
        </div>

        {/* Seller Info */}
        <div className="flex items-start gap-4">
          <Link href={`/store/${seller.id}`}>
            <Avatar className="h-16 w-16 border-2">
              <AvatarImage src={seller.avatar_url || undefined} alt={seller.store_name} />
              <AvatarFallback className="text-lg bg-muted">
                {getInitials(seller.store_name)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link 
                href={`/store/${seller.id}`}
                className="text-xl font-semibold text-foreground hover:text-link hover:underline"
              >
                {seller.store_name}
              </Link>
              {seller.verified && (
                <Badge variant="secondary" className="gap-1">
                  <ShieldCheck weight="fill" className="h-3 w-3 text-blue-500" />
                  {t("verified")}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm mt-1 flex-wrap">
              {seller.positive_feedback_percentage !== undefined && (
                <span className="text-green-600 font-semibold">
                  {seller.positive_feedback_percentage.toFixed(0)}% {t("positiveFeedback")}
                </span>
              )}
              {seller.total_items_sold !== undefined && seller.total_items_sold > 0 && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {formatItemsSold(seller.total_items_sold)} {t("itemsSold")}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarBlank className="h-4 w-4" />
            <span>{t("memberSince", { date: formatMemberSince(seller.created_at, "en") })}</span>
          </div>
          {seller.response_time_hours !== undefined && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{t("respondsWithin", { hours: seller.response_time_hours })}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {showDescription && seller.description && (
          <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
            {seller.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-6">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/store/${seller.id}`}>
              <Storefront className="h-4 w-4 mr-2" />
              {t("visitStore")}
            </Link>
          </Button>
          {showContact && productId && productTitle && (
            <ContactSellerButton
              sellerId={seller.id}
              productId={productId}
              productTitle={productTitle}
              variant="outline"
              size="sm"
              showIcon={true}
              showLabel={true}
            />
          )}
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            {t("saveSeller")}
          </Button>
        </div>

        {/* Detailed Ratings */}
        {showRatings && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">{t("detailedRatings")}</h3>
              <p className="text-xs text-muted-foreground mb-4">{t("averageLast12Months")}</p>
              <div className="space-y-3">
                <RatingBar 
                  label={t("accurateDescription")} 
                  value={seller.accuracy_rating ?? 5} 
                  icon={<Package className="h-4 w-4" />}
                />
                <RatingBar 
                  label={t("reasonableShipping")} 
                  value={seller.shipping_cost_rating ?? 5} 
                  icon={<Truck className="h-4 w-4" />}
                />
                <RatingBar 
                  label={t("shippingSpeed")} 
                  value={seller.shipping_speed_rating ?? 5} 
                  icon={<Clock className="h-4 w-4" />}
                />
                <RatingBar 
                  label={t("communication")} 
                  value={seller.communication_rating ?? 5} 
                  icon={<ChatsCircle className="h-4 w-4" />}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
