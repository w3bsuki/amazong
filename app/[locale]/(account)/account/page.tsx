import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { AccountStatsCards } from "@/components/account-stats-cards"
import { AccountChart } from "@/components/account-chart"
import { AccountRecentActivity } from "@/components/account-recent-activity"

interface AccountPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function AccountPage({ params }: AccountPageProps) {
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

  // Fetch all user stats in parallel
  const [ordersResult, wishlistResult, productsResult, messagesResult, salesResult] = await Promise.all([
    supabase.from('orders').select('id, total_amount, status, created_at', { count: 'exact' }).eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('wishlist_items').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('products').select('id, title, price, stock, created_at', { count: 'exact' }).eq('seller_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('messages').select('id, read', { count: 'exact' }).eq('receiver_id', user.id).eq('read', false),
    supabase.from('order_items').select('id, price_at_purchase, quantity, created_at, products(title)', { count: 'exact' }).eq('seller_id', user.id).order('created_at', { ascending: false }).limit(5),
  ])

  const totalOrders = ordersResult.count || 0
  const pendingOrders = ordersResult.data?.filter(o => o.status === 'pending' || o.status === 'processing').length || 0
  const productCount = productsResult.count || 0
  const unreadMessages = messagesResult.count || 0
  const wishlistCount = wishlistResult.count || 0
  const totalSales = salesResult.count || 0
  const salesRevenue = (salesResult.data || []).reduce((sum, item: any) => 
    sum + (Number(item.price_at_purchase) * item.quantity), 0
  )

  // Prepare data for components
  const totals = {
    orders: totalOrders,
    pendingOrders,
    sales: totalSales,
    revenue: salesRevenue,
    products: productCount,
    messages: unreadMessages,
    wishlist: wishlistCount,
  }

  const recentOrders = ordersResult.data || []
  const recentProducts = productsResult.data || []
  const recentSales = (salesResult.data || []).map((sale: any) => ({
    ...sale,
    product_title: sale.products?.title,
  }))

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <h1 className="sr-only">{locale === "bg" ? "Преглед на акаунта" : "Account Overview"}</h1>
      <AccountStatsCards totals={totals} locale={locale} />
      <div className="px-4 lg:px-6">
        <AccountChart locale={locale} />
      </div>
      <AccountRecentActivity 
        orders={recentOrders}
        products={recentProducts}
        sales={recentSales}
        locale={locale}
      />
    </div>
  )
}
