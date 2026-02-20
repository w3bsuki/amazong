import { createClient } from "@/lib/supabase/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SellPageClient } from "./sell-page-client";
import { getSellCategories } from "./_lib/categories";
import { createListing } from "../_actions/sell";
import type { Metadata } from "next";

// Generate static params for all supported locales
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Sell" });

  return {
    title: t("metaTitle"),
  };
}

// Check if user is a seller (has username and is_seller flag)
type SupabaseServerClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

async function getSellerData(supabase: SupabaseServerClient, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, business_name, is_seller, account_type")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data?.username) return null;

  // Return seller data with onboarding status
  return {
    id: data.id,
    store_name: data.display_name || data.business_name || data.username,
    store_slug: data.username,
    is_seller: data.is_seller ?? false,
    username: data.username,
    account_type: data.account_type === "business" ? "business" : "personal", // Always set in DB
    display_name: data.display_name ?? null,
    business_name: data.business_name ?? null,
  };
}

export default async function SellPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  if (!supabase) {
    return (
      <SellPageClient
        initialUser={null}
        initialSeller={null}
        initialNeedsOnboarding={false}
        initialUsername={null}
        initialPayoutStatus={null}
        categories={[]}
        createListingAction={createListing}
      />
    )
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <SellPageClient
        initialUser={null}
        initialSeller={null}
        initialNeedsOnboarding={false}
        initialUsername={null}
        initialPayoutStatus={null}
        categories={[]}
        createListingAction={createListing}
      />
    )
  }

  const seller = await getSellerData(supabase, user.id);
  
  // Determine if user needs onboarding (has username but is_seller is false)
  const needsOnboarding = seller && !seller.is_seller;
  const isSeller = seller?.is_seller ?? false;

  const [categories, payoutStatusResult] = isSeller
    ? await Promise.all([
        getSellCategories(),
        supabase
          .from("seller_payout_status")
          .select(
            "stripe_connect_account_id, details_submitted, charges_enabled, payouts_enabled",
          )
          .eq("seller_id", user.id)
          .maybeSingle(),
      ])
    : [[], null];

  const payoutStatus = payoutStatusResult?.data ?? null;
  
  return (
    <SellPageClient 
      initialUser={
        user
          ? {
              id: user.id,
              ...(user.email ? { email: user.email } : {}),
            }
          : null
      }
      initialSeller={seller && seller.is_seller ? { id: seller.id, store_name: seller.store_name } : null}
      initialNeedsOnboarding={needsOnboarding ?? false}
      initialUsername={seller?.username ?? null}
      initialPayoutStatus={payoutStatus ?? null}
      categories={categories}
      createListingAction={createListing}
    />
  );
}

