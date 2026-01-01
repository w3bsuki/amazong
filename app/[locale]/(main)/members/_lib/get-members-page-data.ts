import { createClient } from "@/lib/supabase/server"

import type { MembersFilter, MembersSearchParams, MembersSort } from "./members-types"

const PAGE_SIZE = 24

export async function getMembersPageData(searchParams: MembersSearchParams) {
  const { filter = "all", sort = "active", page = "1", q } = searchParams

  const supabase = await createClient()

  const currentPage = Number.parseInt(page) || 1
  const offset = (currentPage - 1) * PAGE_SIZE

  // Build the query with all conditions applied inline
  // This avoids complex generic types for the query builder
  let baseQuery = supabase
    .from("profiles")
    .select(
      `
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
    `,
      { count: "exact" }
    )
    .not("username", "is", null)

  // Apply filter
  if (filter === "sellers") {
    baseQuery = baseQuery.eq("is_seller", true)
  } else if (filter === "buyers") {
    baseQuery = baseQuery.eq("is_seller", false)
  } else if (filter === "business") {
    baseQuery = baseQuery.eq("account_type", "business")
  }

  // Apply search
  if (q) {
    baseQuery = baseQuery.or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
  }

  // Apply sort
  if (sort === "rating") {
    baseQuery = baseQuery.order("seller_rating", { ascending: false, nullsFirst: false })
  } else if (sort === "sales") {
    baseQuery = baseQuery.order("total_sales", { ascending: false })
  } else if (sort === "purchases") {
    baseQuery = baseQuery.order("total_purchases", { ascending: false })
  } else if (sort === "newest") {
    baseQuery = baseQuery.order("created_at", { ascending: false })
  } else {
    // "active" is the default
    baseQuery = baseQuery.order("last_active_at", { ascending: false, nullsFirst: false })
  }

  // Apply pagination
  baseQuery = baseQuery.range(offset, offset + PAGE_SIZE - 1)

  const { data: members, count, error } = await baseQuery
  if (error) {
    throw error
  }

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  const { count: totalMembers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .not("username", "is", null)

  const { count: totalSellers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_seller", true)
    .not("username", "is", null)

  return {
    members: members || [],
    totalCount: count || 0,
    totalMembers: totalMembers || 0,
    totalSellers: totalSellers || 0,
    currentPage,
    totalPages,
    filter,
    sort,
    searchQuery: q || "",
  }
}
