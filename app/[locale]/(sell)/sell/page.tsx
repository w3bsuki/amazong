import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
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
      .select("id, username, display_name, business_name, is_seller")
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
  // Mark as dynamic - user auth check required
  await connection();
  
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Fetch user and categories in parallel for better performance
  const supabase = await createClient();
  
  // Run auth check and category fetch in parallel
  const [categoriesResult, authResult] = await Promise.all([
    getSellCategories(),
    supabase ? supabase.auth.getUser() : Promise.resolve({ data: { user: null } })
  ]);
  
  const categories = categoriesResult;
  const user = authResult.data.user;

  // Auth-gated: redirect logged-out users to login.
  if (!user) {
    redirect(`/${locale}/auth/login`);
  }
  
  // Fetch seller data only if user is authenticated
  let seller = null;
  if (user) {
    seller = await getSellerData(user.id);
  }
  
  // Determine if user needs onboarding (has username but is_seller is false)
  const needsOnboarding = seller && !seller.is_seller;
  
  return (
    <SellPageClient 
      initialUser={user ? { id: user.id, email: user.email || undefined } : null}
      initialSeller={seller && seller.is_seller ? { id: seller.id, store_name: seller.store_name } : null}
      initialNeedsOnboarding={needsOnboarding ?? false}
      initialUsername={seller?.username ?? null}
      categories={categories}
    />
  );
}
