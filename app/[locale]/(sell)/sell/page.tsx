import { createClient } from "@/lib/supabase/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { SellPageClient } from "./client";
import { redirect } from "next/navigation";
import { getSellCategories } from "./_lib/categories";

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Check if user is a seller (has username and is_seller flag)
async function getSellerData(userId: string) {
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name, business_name, is_seller, account_type")
      .eq("id", userId)
      .single();
    
    if (!data?.username) return null;
    
    // Return seller data with onboarding status
    return {
      id: data.id,
      store_name: data.display_name || data.business_name || data.username,
      store_slug: data.username,
      is_seller: data.is_seller ?? false,
      username: data.username,
      account_type: data.account_type === "business" ? "business" : "personal",  // Always set in DB
      display_name: data.display_name ?? null,
      business_name: data.business_name ?? null,
    };
  } catch {
    return null;
  }
}

export default async function SellPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Auth-gated: redirect logged-out users to login.
  // Do this BEFORE any expensive DB work to keep redirects fast.
  const supabase = await createClient();
  const authResult = await (supabase
    ? supabase.auth.getUser()
    : Promise.resolve({ data: { user: null } }));
  const user = authResult.data.user;

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const categories = await getSellCategories();
  
  // Fetch seller data only if user is authenticated
  let seller = null;
  if (user) {
    seller = await getSellerData(user.id);
  }
  
  // Determine if user needs onboarding (has username but is_seller is false)
  const needsOnboarding = seller && !seller.is_seller;
  
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
      initialAccountType={seller?.account_type === "business" ? "business" : "personal"}
      initialDisplayName={seller?.display_name ?? null}
      initialBusinessName={seller?.business_name ?? null}
      categories={categories}
    />
  );
}
