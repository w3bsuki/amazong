import { redirect } from "next/navigation"
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Old Seller Dashboard - Redirects to new Business Dashboard
 * 
 * The business dashboard at /dashboard has more features (Shopify-style):
 * - Setup guide for new sellers
 * - Quick actions
 * - Live activity tracking
 * - Performance scores
 * - Revenue charts
 * - Task management
 * 
 * This redirect ensures users always reach the canonical dashboard URL.
 */
export default async function OldSellerDashboard({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  redirect(`/${locale}/dashboard`)
}
