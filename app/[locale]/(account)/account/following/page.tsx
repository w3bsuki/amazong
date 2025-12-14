import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { FollowingContent } from "./following-content"

interface FollowingPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function FollowingPage({ params }: FollowingPageProps) {
  await connection()
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

  // Fetch followed sellers
  const { data: followedSellers, count } = await supabase
    .from("store_followers")
    .select(`
      seller_id,
      created_at,
      seller:sellers!store_followers_seller_id_fkey (
        id,
        store_name,
        store_slug,
        description,
        verified,
        profile:profiles!sellers_id_fkey (
          full_name,
          avatar_url
        )
      ),
      seller_stats (
        follower_count,
        total_reviews,
        average_rating,
        total_listings
      )
    `, { count: "exact" })
    .eq("follower_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <h1 className="sr-only">
        {locale === "bg" ? "Следвани магазини" : "Following"}
      </h1>
      <FollowingContent 
        locale={locale} 
        sellers={followedSellers || []}
        total={count || 0}
      />
    </div>
  )
}
