import { createClient } from "@/lib/supabase/server"
import { setRequestLocale } from "next-intl/server"
import { connection } from "next/server"
import type { Metadata } from "next"
import { MembersClient } from "./members-client"

export const metadata: Metadata = {
  title: "Members | Amazong Community",
  description: "Discover members of the Amazong community. Browse sellers and buyers, filter by ratings and activity.",
}

interface MembersPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    filter?: "all" | "sellers" | "buyers" | "business"
    sort?: "rating" | "sales" | "purchases" | "newest" | "active"
    page?: string
    q?: string
  }>
}

const PAGE_SIZE = 24

export default async function MembersPage({ params, searchParams }: MembersPageProps) {
  await connection()
  const { locale } = await params
  const { filter = "all", sort = "active", page = "1", q } = await searchParams
  setRequestLocale(locale)
  
  const supabase = await createClient()
  if (!supabase) {
    return <div>Error loading members</div>
  }
  
  const currentPage = parseInt(page) || 1
  const offset = (currentPage - 1) * PAGE_SIZE
  
  // Build query
  let query = supabase
    .from("profiles")
    .select(`
      id,
      username,
      display_name,
      avatar_url,
      account_type,
      is_seller,
      is_verified_business,
      verified,
      location,
      tier,
      created_at
    `, { count: "exact" })
    .not("username", "is", null)
  
  // Apply filters
  switch (filter) {
    case "sellers":
      query = query.eq("is_seller", true)
      break
    case "buyers":
      query = query.eq("is_seller", false)
      break
    case "business":
      query = query.eq("account_type", "business")
      break
  }
  
  // Search by username or display_name
  if (q) {
    query = query.or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
  }
  
  // Apply sorting
  switch (sort) {
    case "rating":
      query = query.order("seller_rating", { ascending: false, nullsFirst: false })
      break
    case "sales":
      query = query.order("total_sales", { ascending: false })
      break
    case "purchases":
      query = query.order("total_purchases", { ascending: false })
      break
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    case "active":
    default:
      query = query.order("last_active_at", { ascending: false, nullsFirst: false })
      break
  }
  
  // Pagination
  query = query.range(offset, offset + PAGE_SIZE - 1)
  
  const { data: members, count, error } = await query
  
  if (error) {
    console.error("Error fetching members:", error)
    return <div>Error loading members</div>
  }
  
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)
  
  // Get some stats for the hero
  const { count: totalMembers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .not("username", "is", null)
  
  const { count: totalSellers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_seller", true)
    .not("username", "is", null)
  
  return (
    <MembersClient
      members={members || []}
      totalCount={count || 0}
      totalMembers={totalMembers || 0}
      totalSellers={totalSellers || 0}
      currentPage={currentPage}
      totalPages={totalPages}
      filter={filter}
      sort={sort}
      searchQuery={q || ""}
      locale={locale}
    />
  )
}
