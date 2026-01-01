import 'server-only'

import { createClient, createAdminClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"

export type UserRole = 'buyer' | 'seller' | 'admin'

export interface AdminUser {
  id: string
  email: string
  role: UserRole
  full_name: string | null
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
  const supabase = await createClient()
  
  // First check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect("/auth/login")
  }
  
  // Then check their role in the profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, role, full_name')
    .eq('id', user.id)
    .single()
  
  if (profileError || !profile) {
    console.error("Admin check failed - no profile:", profileError)
    redirect(redirectTo)
  }
  
  if (profile.role !== 'admin') {
    // Not an admin - silently redirect (don't reveal admin exists)
    redirect(redirectTo)
  }
  
  return {
    id: profile.id,
    email: profile.email || user.email || '',
    role: profile.role as UserRole,
    full_name: profile.full_name,
  }
}

/**
 * Checks if a user is admin without redirecting.
 * Useful for conditional UI rendering.
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    return profile?.role === 'admin'
  } catch {
    return false
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
      .select('id, email, full_name, role, created_at')
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
  
  // Calculate revenue
  const { data: revenueData } = await adminClient
    .from('orders')
    .select('total_amount')
    .eq('status', 'paid')
  
  const totalRevenue = revenueData?.reduce((sum, order) => 
    sum + Number(order.total_amount || 0), 0
  ) || 0
  
  return {
    totals: {
      users: usersResult.count || 0,
      products: productsResult.count || 0,
      orders: ordersResult.count || 0,
      sellers: sellersResult.count || 0,
      revenue: totalRevenue,
    },
    recent: {
      users: recentUsersResult.data || [],
      products: recentProductsResult.data || [],
      orders: recentOrdersResult.data || [],
    }
  }
}
