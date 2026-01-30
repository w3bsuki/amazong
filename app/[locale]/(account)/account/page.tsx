import { createClient } from "@/lib/supabase/server"
import { redirect } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { AccountHeroCard } from "./_components/account-hero-card"
import { AccountStatsCards } from "./_components/account-stats-cards"
import { AccountChart } from "./_components/account-chart"
import { AccountRecentActivity } from "./_components/account-recent-activity"
import { AccountBadges } from "./_components/account-badges"
import { SubscriptionBenefitsCard } from "./_components/subscription-benefits-card"

interface AccountPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale: localeParam } = await params
  const locale = localeParam === "bg" ? "bg" : "en"
  const t = await getTranslations({ locale, namespace: "Account" })
  const supabase = await createClient()

  if (!supabase) {
    return redirect({ href: "/auth/login", locale })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect({ href: "/auth/login", locale })
  }

  // Fetch all user stats in parallel (no joins)
  const [ordersResult, wishlistResult, productsResult, , salesResult, profileResult, subscriptionResult] = await Promise.all([
    supabase.from('orders').select('id, total_amount, status, created_at', { count: 'exact' }).eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('wishlists').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabase.from('products').select('id, title, price, stock, images, created_at', { count: 'exact' }).eq('seller_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('messages').select('id, is_read', { count: 'exact' }).eq('sender_id', user.id).neq('sender_id', user.id),
    supabase.from('order_items').select('id, order_id, price_at_purchase, quantity, product_id', { count: 'exact' }).eq('seller_id', user.id).limit(5),
    // Profile with subscription benefits
    supabase.from('profiles').select('account_type, tier, boosts_allocated, boosts_remaining, boosts_reset_at').eq('id', user.id).single(),
    // Active subscription
    supabase.from('subscriptions').select('status, expires_at, auto_renew, plan_type').eq('seller_id', user.id).eq('status', 'active').order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  const totalOrders = ordersResult.count || 0
  const pendingOrders = ordersResult.data?.filter(o => o.status === 'pending' || o.status === 'processing').length || 0
  const productCount = productsResult.count || 0
  const unreadMessages = 0 // Messages table needs proper conversation join
  const wishlistCount = wishlistResult.count || 0
  const totalSales = salesResult.count || 0
  const salesData = salesResult.data || []
  
  // Profile and subscription data
  const profile = profileResult.data ?? null
  const subscription = subscriptionResult.data
  
  // Fetch subscription plan details if user has an active subscription
  const planResult = subscription?.plan_type
    ? await supabase
        .from('subscription_plans')
        .select('max_listings, boosts_included, priority_support, analytics_access, badge_type')
        .eq('tier', subscription.plan_type)
        .eq('account_type', profile?.account_type || 'personal')
        .single()
    : { data: null }
  const plan = planResult.data

  // Fetch products for recent sales - with proper typing
  interface SaleItem { id: string; order_id: string; price_at_purchase: number; quantity: number; product_id: string }
  const productIds = [...new Set(salesData.map((item: SaleItem) => item.product_id))]
  const salesProductsResult = productIds.length > 0
    ? await supabase.from('products').select('id, title, images').in('id', productIds)
    : { data: [] }
  const salesProducts = salesProductsResult.data ?? []
  const salesProductsMap = new Map(salesProducts.map((p) => [p.id, p]))
  const salesRevenue = salesData.reduce((sum: number, item: SaleItem) => 
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

  // Type-safe recent data
  const recentOrders = (ordersResult.data || []).map(order => ({
    id: order.id,
    total_amount: order.total_amount,
    status: order.status,
    created_at: order.created_at,
    order_items: [] as { id: string; products: { images?: string[] } | null }[]
  }))
  const recentProducts = (productsResult.data || []).map(p => ({
    id: p.id,
    title: p.title,
    price: p.price,
    stock: p.stock,
    ...(p.images ? { images: p.images } : {}),
    created_at: p.created_at
  }))
  const recentSales = salesData.map((sale: SaleItem) => {
    const product = salesProductsMap.get(sale.product_id) || null
    return {
      id: sale.id,
      order_id: sale.order_id,
      price_at_purchase: sale.price_at_purchase,
      quantity: sale.quantity,
      product_title: product?.title ?? null,
      product_image: product?.images?.[0] ?? null,
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sr-only">{t("header.overview")}</h1>
      
      {/* Hero card with revenue & key stats */}
      <AccountHeroCard totals={totals} locale={locale} />
      
      {/* Quick action buttons */}
      <AccountStatsCards totals={totals} locale={locale} />
      
      {/* Subscription benefits - show if user is a seller */}
      {profile?.tier && (
        <SubscriptionBenefitsCard
          locale={locale}
          tier={profile.tier}
          accountType={(profile.account_type === 'business' ? 'business' : 'personal') as 'personal' | 'business'}
          maxListings={plan?.max_listings ?? 30}
          boostsIncluded={plan?.boosts_included ?? profile.boosts_allocated ?? 0}
          prioritySupport={plan?.priority_support ?? false}
          analyticsAccess={plan?.analytics_access ?? 'none'}
          badgeType={plan?.badge_type ?? null}
          activeListings={productCount}
          boostsRemaining={profile.boosts_remaining ?? 0}
          boostsResetAt={profile.boosts_reset_at ?? null}
          expiresAt={subscription?.expires_at ?? null}
          isActive={subscription?.status === 'active'}
          isCancelled={subscription?.status === 'active' && subscription?.auto_renew === false}
        />
      )}
      
      {/* User badges */}
      <AccountBadges locale={locale} />
      
      {/* Chart - desktop only */}
      <div className="hidden sm:block">
        <AccountChart locale={locale} />
      </div>
      
      {/* Recent activity sections */}
      <AccountRecentActivity 
        orders={recentOrders}
        products={recentProducts}
        sales={recentSales}
        locale={locale}
      />
    </div>
  )
}
