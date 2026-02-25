import 'server-only'

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { connection } from "next/server"
import { getLocale } from "next-intl/server"

import { logger } from "@/lib/logger"
export type UserRole = 'buyer' | 'seller' | 'admin'

export interface AdminUser {
  id: string
  email: string
  role: UserRole
  full_name: string | null
}

const toRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object") return null
  return value as Record<string, unknown>
}

const asNumber = (value: unknown): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

/**
 * Verifies the current user is authenticated and has admin role.
 * MUST be called in server components only.
 * 
 * @param redirectTo - Where to redirect non-admins (default: /)
 * @returns The admin user if verified
 * @throws Redirects to login or home if not authorized
 */
export async function requireAdmin(redirectTo: string = "/"): Promise<AdminUser> {
  // Mark as dynamic - auth check reads cookies
  await connection()
  const locale = await getLocale()
  
  const supabase = await createClient()
  
  // First check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return redirect({ href: "/auth/login", locale })
  }
  
  // Then check their role in the profiles table (public surface)
  const [
    { data: profile, error: profileError },
    { data: privateProfile },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, role, full_name')
      .eq('id', user.id)
      .single(),
    supabase
      .from('private_profiles')
      .select('email')
      .eq('id', user.id)
      .maybeSingle(),
  ])
  
  if (profileError || !profile) {
    logger.error("[Admin] Admin check failed - no profile", profileError)
    return redirect({ href: redirectTo, locale })
  }
  
  if (profile.role !== 'admin') {
    // Not an admin - silently redirect (don't reveal admin exists)
    return redirect({ href: redirectTo, locale })
  }
  
  return {
    id: profile.id,
    email: privateProfile?.email || user.email || '',
    role: profile.role as UserRole,
    full_name: profile.full_name,
  }
}

/**
 * Gets admin statistics using service role (bypasses RLS)
 * ONLY call this after verifying admin with requireAdmin()
 */
export async function getAdminStats() {
  // Mark as dynamic and satisfy Next.js current-time access rules.
  await connection()

  const adminClient = createAdminClient()

  /**
   * Deferred DB migration (not applied automatically from app code):
   *
   * create or replace function public.admin_paid_revenue_total()
   * returns table(total_revenue numeric)
   * language sql
   * security definer
   * set search_path = public
   * as $$
   *   select coalesce(sum(total_amount), 0)::numeric as total_revenue
   *   from public.orders
   *   where status = 'paid';
   * $$;
   *
   * revoke all on function public.admin_paid_revenue_total() from public;
   * grant execute on function public.admin_paid_revenue_total() to service_role;
   */

  const sevenDaysAgoIso = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000
  ).toISOString()
  
  const [
    usersResult,
    productsResult,
    ordersResult,
    sellersResult,
    recentUsersResult,
    recentProductsResult,
    recentOrdersResult,
  ] = await Promise.all([
    // Total counts
    adminClient.from('profiles').select('id', { count: 'exact', head: true }),
    adminClient.from('products').select('id', { count: 'exact', head: true }),
    adminClient.from('orders').select('id', { count: 'exact', head: true }),
    adminClient.from('profiles').select('id', { count: 'exact', head: true }).eq('is_seller', true),
    
    // Recent activity (last 7 days)
    adminClient
      .from('profiles')
      .select('id, full_name, role, created_at')
      .gte('created_at', sevenDaysAgoIso)
      .order('created_at', { ascending: false })
      .limit(10),
    
    adminClient
      .from('products')
      .select('id, title, price, created_at, seller_id')
      .gte('created_at', sevenDaysAgoIso)
      .order('created_at', { ascending: false })
      .limit(10),
    
    adminClient
      .from('orders')
      .select('id, total_amount, status, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  // Preferred path: RPC/view-backed aggregation (DB-side), with safe fallback.
  let totalRevenue = 0
  const revenueRpc = await adminClient
    .rpc("admin_paid_revenue_total" as never)
    .maybeSingle()
  const rpcRecord = toRecord(revenueRpc.data)
  totalRevenue = asNumber(rpcRecord?.total_revenue) ?? asNumber(rpcRecord?.sum) ?? 0

  if (revenueRpc.error) {
    const message = revenueRpc.error.message.toLowerCase()
    const isMissingRpc =
      revenueRpc.error.code === "42883" ||
      message.includes("function") && message.includes("does not exist")

    if (isMissingRpc) {
      logger.warn(
        "[Admin] Missing admin_paid_revenue_total RPC; falling back to inline aggregate"
      )
    } else {
      logger.error("[Admin] Revenue RPC failed; falling back to inline aggregate", revenueRpc.error)
    }

    const fallbackRevenue = await adminClient
      .from("orders")
      .select("total_amount.sum()")
      .eq("status", "paid")
      .maybeSingle()

    const fallbackRecord = toRecord(fallbackRevenue.data)
    totalRevenue =
      asNumber(fallbackRecord?.total_amount) ?? asNumber(fallbackRecord?.sum) ?? 0
  }

  const recentUsersBase = recentUsersResult.data || []
  const recentUserIds = recentUsersBase.map((u) => u.id).filter(Boolean)

  const { data: privateProfiles } = recentUserIds.length
    ? await adminClient
        .from('private_profiles')
        .select('id, email')
        .in('id', recentUserIds)
    : { data: [] }

  const emailById = new Map((privateProfiles || []).map((p) => [p.id, p.email]))
  const recentUsers = recentUsersBase.map((u) => ({
    ...u,
    email: emailById.get(u.id) ?? '',
  }))
  
  return {
    totals: {
      users: usersResult.count || 0,
      products: productsResult.count || 0,
      orders: ordersResult.count || 0,
      sellers: sellersResult.count || 0,
      revenue: totalRevenue,
    },
    recent: {
      users: recentUsers,
      products: recentProductsResult.data || [],
      orders: recentOrdersResult.data || [],
    }
  }
}
