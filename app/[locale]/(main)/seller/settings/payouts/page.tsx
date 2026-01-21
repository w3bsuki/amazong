import { getTranslations } from "next-intl/server"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SellerPayoutSetup } from "./_components/seller-payout-setup"

export async function generateMetadata() {
  const t = await getTranslations("seller.payouts")
  return {
    title: t("title"),
  }
}

export default async function PayoutsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get seller's payout status
  const { data: payoutStatus } = await supabase
    .from("seller_payout_status")
    .select("seller_id, stripe_connect_account_id, details_submitted, charges_enabled, payouts_enabled, created_at, updated_at")
    .eq("seller_id", user.id)
    .single()

  // Get seller profile for email
  const { data: profile } = await supabase
    .from("profiles")
    .select("email, role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "seller" && profile?.role !== "admin") {
    redirect("/")
  }

  const t = await getTranslations("seller.payouts")

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>
      <SellerPayoutSetup
        payoutStatus={payoutStatus}
        sellerEmail={profile?.email || user.email || ""}
      />
    </div>
  )
}
