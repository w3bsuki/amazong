import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FollowingContent } from "./following-content"

interface FollowingPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function FollowingPage({ params }: FollowingPageProps) {
  const { locale } = await params
  const supabase = await createClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch followed sellers (without join - relations not working in types)
  const { data: followedSellers, count } = await supabase
    .from("store_followers")
    .select("seller_id, created_at", { count: "exact" })
    .eq("follower_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch seller IDs
  const sellerIds = (followedSellers || []).map(f => f.seller_id)

  // Fetch profiles for followed sellers separately
  const { data: profilesData } = sellerIds.length > 0
    ? await supabase
        .from("profiles")
        .select("id, username, display_name, full_name, bio, avatar_url, verified")
        .in("id", sellerIds)
    : { data: [] }

  // Fetch seller_stats for followed sellers
  const { data: statsData } = sellerIds.length > 0 
    ? await supabase
        .from("seller_stats")
        .select("seller_id, follower_count, total_reviews, average_rating, total_listings")
        .in("seller_id", sellerIds)
    : { data: [] }

  // Create maps for quick lookup
  const profilesMap = new Map((profilesData || []).map(p => [p.id, p]))
  const statsMap = new Map((statsData || []).map(s => [s.seller_id, s]))

  // Transform data for component - map profiles to seller shape expected by FollowingContent
  const transformedSellers = (followedSellers || []).map(f => {
    const profile = profilesMap.get(f.seller_id)
    const stats = statsMap.get(f.seller_id)
    
    return {
      seller_id: f.seller_id,
      created_at: f.created_at,
      seller: profile ? {
        id: profile.id,
        store_name: profile.display_name || profile.username || 'Unknown',
        store_slug: profile.username,
        description: profile.bio,
        verified: profile.verified ?? false,
        profile: {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        }
      } : null,
      seller_stats: stats ? {
        follower_count: stats.follower_count,
        total_reviews: stats.total_reviews,
        average_rating: stats.average_rating,
        total_listings: stats.total_listings,
      } : null
    }
  })

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="sr-only">
        {locale === "bg" ? "Следвани магазини" : "Following"}
      </h1>
      <FollowingContent 
        locale={locale} 
        sellers={transformedSellers}
        total={count || 0}
      />
    </div>
  )
}
