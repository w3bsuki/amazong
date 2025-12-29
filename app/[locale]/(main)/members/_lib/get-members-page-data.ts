import { createClient } from "@/lib/supabase/server"

import type { MembersFilter, MembersSearchParams, MembersSort } from "./members-types"

const PAGE_SIZE = 24

export async function getMembersPageData(searchParams: MembersSearchParams) {
  const { filter = "all", sort = "active", page = "1", q } = searchParams

  const supabase = await createClient()

  const currentPage = Number.parseInt(page) || 1
  const offset = (currentPage - 1) * PAGE_SIZE

  let query = supabase
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

  query = applyMembersFilter(query, filter)

  if (q) {
    query = query.or(`username.ilike.%${q}%,display_name.ilike.%${q}%`)
  }

  query = applyMembersSort(query, sort)

  query = query.range(offset, offset + PAGE_SIZE - 1)

  const { data: members, count, error } = await query
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

function applyMembersFilter(query: any, filter: MembersFilter) {
  switch (filter) {
    case "sellers":
      return query.eq("is_seller", true)
    case "buyers":
      return query.eq("is_seller", false)
    case "business":
      return query.eq("account_type", "business")
    case "all":
    default:
      return query
  }
}

function applyMembersSort(query: any, sort: MembersSort) {
  switch (sort) {
    case "rating":
      return query.order("seller_rating", { ascending: false, nullsFirst: false })
    case "sales":
      return query.order("total_sales", { ascending: false })
    case "purchases":
      return query.order("total_purchases", { ascending: false })
    case "newest":
      return query.order("created_at", { ascending: false })
    case "active":
    default:
      return query.order("last_active_at", { ascending: false, nullsFirst: false })
  }
}
