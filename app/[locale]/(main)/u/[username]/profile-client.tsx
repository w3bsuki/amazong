"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  MapPin,
  Calendar,
  Package,
  ShoppingBag,
  CheckCircle,
  Storefront,
  Globe,
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
  TiktokLogo,
  YoutubeLogo,
  PencilSimple,
  ShareNetwork,
  Heart,
  ArrowRight,
} from "@phosphor-icons/react"
import { ProductCard } from "@/components/product-card"

interface PublicProfileClientProps {
  profile: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
    banner_url: string | null
    bio: string | null
    account_type: string | null
    is_seller: boolean | null
    is_verified_business: boolean | null
    verified?: boolean | null
    location: string | null
    business_name: string | null
    website_url: string | null
    social_links: Record<string, string> | null
    total_sales: number
    total_purchases: number
    average_rating?: number | null
    created_at: string
  }
  products: any[]
  productCount: number
  sellerReviews: any[]
  sellerReviewCount: number
  buyerReviews: any[]
  buyerReviewCount: number
  isOwnProfile: boolean
  locale: string
}

function StarRating({ rating, count, size = "sm" }: { rating: number; count: number; size?: "sm" | "md" }) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Star key={i} weight="fill" className={`text-yellow-500 ${size === "md" ? "size-5" : "size-4"}`} />)
    } else if (i === fullStars && hasHalf) {
      stars.push(<Star key={i} weight="duotone" className={`text-yellow-500 ${size === "md" ? "size-5" : "size-4"}`} />)
    } else {
      stars.push(<Star key={i} weight="regular" className={`text-gray-300 ${size === "md" ? "size-5" : "size-4"}`} />)
    }
  }
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className={`font-medium ${size === "md" ? "text-base" : "text-sm"}`}>{rating.toFixed(1)}</span>
      <span className={`text-muted-foreground ${size === "md" ? "text-sm" : "text-xs"}`}>({count})</span>
    </div>
  )
}

export function PublicProfileClient({
  profile,
  products,
  productCount,
  sellerReviews,
  sellerReviewCount,
  buyerReviews,
  buyerReviewCount,
  isOwnProfile,
  locale,
}: PublicProfileClientProps) {
  const [activeTab, setActiveTab] = useState(profile.is_seller ? "listings" : "reviews")
  
  const displayName = profile.display_name || profile.username || 'User'
  const initials = displayName.substring(0, 2).toUpperCase()
  const memberSince = new Date(profile.created_at)
  
  const socialIcons: Record<string, React.ReactNode> = {
    facebook: <FacebookLogo className="size-5" weight="fill" />,
    instagram: <InstagramLogo className="size-5" weight="fill" />,
    twitter: <TwitterLogo className="size-5" weight="fill" />,
    tiktok: <TiktokLogo className="size-5" weight="fill" />,
    youtube: <YoutubeLogo className="size-5" weight="fill" />,
  }
  
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-8">
      {/* Banner */}
      <div className="relative h-32 sm:h-48 md:h-56 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20">
        {profile.banner_url && (
          <Image
            src={profile.banner_url}
            alt=""
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </div>
      
      {/* Profile Header */}
      <div className="container relative -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="size-28 sm:size-36 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatar_url || undefined} alt={displayName} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            {profile.is_verified_business && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 border-2 border-background">
                <CheckCircle className="size-5 text-white" weight="fill" />
              </div>
            )}
          </div>
          
          {/* Name and Actions */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold">{displayName}</h1>
                {profile.account_type === "business" && (
                  <Badge variant="secondary" className="gap-1">
                    <Storefront className="size-3.5" />
                    {locale === "bg" ? "Бизнес" : "Business"}
                  </Badge>
                )}
                {profile.is_seller && (
                  <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-200 bg-emerald-50">
                    <Package className="size-3.5" />
                    {locale === "bg" ? "Продавач" : "Seller"}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.business_name && (
                <p className="text-sm text-muted-foreground mt-0.5">{profile.business_name}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              {isOwnProfile ? (
                <Link href={`/${locale}/account/profile`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <PencilSimple className="size-4" />
                    {locale === "bg" ? "Редактирай" : "Edit Profile"}
                  </Button>
                </Link>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Heart className="size-4" />
                    {locale === "bg" ? "Следвай" : "Follow"}
                  </Button>
                  <Button variant="ghost" size="icon" className="size-9">
                    <ShareNetwork className="size-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Bio and Info */}
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {/* Left Column - Bio and Details */}
          <div className="md:col-span-2 space-y-4">
            {profile.bio && (
              <p className="text-muted-foreground">{profile.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {profile.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {locale === "bg" ? "Член от" : "Member since"} {memberSince.toLocaleDateString(locale === "bg" ? "bg-BG" : "en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
            
            {/* Social Links */}
            {profile.social_links && Object.keys(profile.social_links).length > 0 && (
              <div className="flex gap-2">
                {profile.website_url && (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <Globe className="size-5" />
                  </a>
                )}
                {Object.entries(profile.social_links).map(([platform, url]) => {
                  if (!url) return null
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {socialIcons[platform] || <Globe className="size-5" />}
                    </a>
                  )
                })}
              </div>
            )}
          </div>
          
          {/* Right Column - Stats */}
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4 space-y-3">
                {/* Seller Stats */}
                {profile.is_seller && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Package className="size-4" />
                        {locale === "bg" ? "Продажби" : "Sales"}
                      </span>
                      <span className="font-semibold">{profile.total_sales}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {locale === "bg" ? "Рейтинг продавач" : "Seller Rating"}
                      </span>
                      {sellerReviewCount > 0 && profile.average_rating ? (
                        <StarRating rating={profile.average_rating} count={sellerReviewCount} />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {locale === "bg" ? "Няма отзиви" : "No reviews yet"}
                        </span>
                      )}
                    </div>
                    <Separator />
                  </div>
                )}
                
                {/* Buyer Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <ShoppingBag className="size-4" />
                      {locale === "bg" ? "Покупки" : "Purchases"}
                    </span>
                    <span className="font-semibold">{profile.total_purchases}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {locale === "bg" ? "Рейтинг купувач" : "Buyer Rating"}
                    </span>
                    {buyerReviewCount > 0 ? (
                      <span className="text-sm font-medium">{buyerReviewCount} {locale === "bg" ? "отзива" : "reviews"}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {locale === "bg" ? "Няма отзиви" : "No reviews yet"}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Tabs Content */}
      <div className="container mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            {profile.is_seller && (
              <TabsTrigger 
                value="listings" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                <Package className="size-4 mr-2" />
                {locale === "bg" ? "Обяви" : "Listings"} ({productCount})
              </TabsTrigger>
            )}
            {profile.is_seller && (
              <TabsTrigger 
                value="seller-reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                <Star className="size-4 mr-2" />
                {locale === "bg" ? "Отзиви за продавач" : "Seller Reviews"} ({sellerReviewCount})
              </TabsTrigger>
            )}
            {profile.total_purchases > 0 && (
              <TabsTrigger 
                value="buyer-reviews" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
              >
                <Star className="size-4 mr-2" />
                {locale === "bg" ? "Отзиви за купувач" : "Buyer Reviews"} ({buyerReviewCount})
              </TabsTrigger>
            )}
          </TabsList>
          
          {/* Listings Tab */}
          {profile.is_seller && (
            <TabsContent value="listings" className="mt-6">
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {products.map((product) => (
                      <ProductCard 
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        price={product.price}
                        image={product.images?.[0] || ''}
                        originalPrice={product.list_price}
                        sellerId={product.seller_id}
                        slug={product.slug}
                        condition={product.condition}
                      />
                    ))}
                  </div>
                  {productCount > 12 && (
                    <div className="mt-6 flex justify-center">
                      <Link href={`/${locale}/search?seller=${profile.id}`}>
                        <Button variant="outline" className="gap-2">
                          {locale === "bg" ? "Виж всички" : "View All"} ({productCount})
                          <ArrowRight className="size-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Package className="size-12 mx-auto mb-3 opacity-50" />
                  <p>{locale === "bg" ? "Няма активни обяви" : "No active listings"}</p>
                </div>
              )}
            </TabsContent>
          )}
          
          {/* Seller Reviews Tab */}
          {profile.is_seller && (
            <TabsContent value="seller-reviews" className="mt-6">
              {sellerReviews.length > 0 ? (
                <div className="space-y-4 max-w-3xl">
                  {sellerReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="size-10">
                            <AvatarImage src={review.buyer?.avatar_url} />
                            <AvatarFallback>
                              {(review.buyer?.display_name || review.buyer?.username || "?").substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <Link 
                                href={`/${locale}/u/${review.buyer?.username}`}
                                className="font-medium hover:underline"
                              >
                                {review.buyer?.display_name || review.buyer?.username}
                              </Link>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <StarRating rating={review.rating} count={0} />
                              <div className="flex gap-1 text-xs">
                                {review.item_as_described && (
                                  <Badge variant="secondary" className="text-[10px] py-0">
                                    {locale === "bg" ? "Точно описание" : "Accurate"}
                                  </Badge>
                                )}
                                {review.shipping_speed && (
                                  <Badge variant="secondary" className="text-[10px] py-0">
                                    {locale === "bg" ? "Бърза доставка" : "Fast shipping"}
                                  </Badge>
                                )}
                                {review.communication && (
                                  <Badge variant="secondary" className="text-[10px] py-0">
                                    {locale === "bg" ? "Добра комуникация" : "Good comms"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Star className="size-12 mx-auto mb-3 opacity-50" />
                  <p>{locale === "bg" ? "Няма отзиви все още" : "No reviews yet"}</p>
                </div>
              )}
            </TabsContent>
          )}
          
          {/* Buyer Reviews Tab */}
          {profile.total_purchases > 0 && (
            <TabsContent value="buyer-reviews" className="mt-6">
              {buyerReviews.length > 0 ? (
                <div className="space-y-4 max-w-3xl">
                  {buyerReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="size-10">
                            <AvatarImage src={review.seller?.avatar_url} />
                            <AvatarFallback>
                              {(review.seller?.display_name || review.seller?.username || "?").substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <Link 
                                href={`/${locale}/u/${review.seller?.username}`}
                                className="font-medium hover:underline"
                              >
                                {review.seller?.display_name || review.seller?.username}
                              </Link>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <StarRating rating={review.rating} count={0} />
                              <div className="flex gap-1 text-xs">
                                {review.prompt_payment && (
                                  <Badge variant="secondary" className="text-[10px] py-0">
                                    {locale === "bg" ? "Бързо плащане" : "Prompt payment"}
                                  </Badge>
                                )}
                                {review.good_communication && (
                                  <Badge variant="secondary" className="text-[10px] py-0">
                                    {locale === "bg" ? "Добра комуникация" : "Good comms"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Star className="size-12 mx-auto mb-3 opacity-50" />
                  <p>{locale === "bg" ? "Няма отзиви все още" : "No reviews yet"}</p>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
