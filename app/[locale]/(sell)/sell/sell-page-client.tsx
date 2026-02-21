"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/routing";
import { createFreshClient } from "@/lib/supabase/client";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AuthGateCard } from "../../_components/auth/auth-gate-card";
import { SellErrorBoundary } from "../_components/ui/sell-error-boundary";
import { ProgressHeader } from "../_components/ui/progress-header";
import { SellFormSkeleton } from "../_components/ui/sell-section-skeleton";
import type { CreateListingAction } from "../_components/sell-form-unified";
import type { Category, Seller } from "../_lib/types";

export type SellerPayoutStatus = {
  stripe_connect_account_id: string | null;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
} | null;

const UnifiedSellForm = dynamic(
  () => import("../_components/sell-form-unified").then((mod) => mod.UnifiedSellForm),
  {
    ssr: false,
    loading: () => <SellFormSkeleton />,
  },
);

interface SellPageClientProps {
  initialUser: { id: string; email?: string } | null;
  initialSeller: Seller | null;
  initialNeedsOnboarding?: boolean;
  initialUsername?: string | null;
  initialPayoutStatus?: SellerPayoutStatus;
  categories: Category[];
  createListingAction: CreateListingAction;
}

function SellSignInPrompt() {
  const tSelling = useTranslations("SellingDropdown")
  const tSell = useTranslations("Sell")

  return (
    <div className="container-content py-6 sm:py-8 lg:py-16 flex justify-center">
      <AuthGateCard
        title={tSelling("signInToSell")}
        description={tSell("startSellingBanner.compact.subtitle")}
        nextPath="/sell"
      />
    </div>
  )
}

function SellGateLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <ProgressHeader
        progressPercent={0}
        autoSaved={false}
        isSaving={false}
        hasUnsavedChanges={false}
        onSaveDraft={() => {}}
        currentStep={1}
        totalSteps={5}
      />
      {children}
    </div>
  )
}

export function SellPageClient({
  initialUser,
  initialSeller,
  initialNeedsOnboarding = false,
  initialUsername = null,
  initialPayoutStatus,
  categories, // Pre-fetched from server
  createListingAction,
}: SellPageClientProps) {
  const t = useTranslations("Sell");
  const locale = useLocale();
  const safeLocale = locale === "bg" ? "bg" : "en";
  const [user, setUser] = useState(initialUser);
  const [seller, setSeller] = useState(initialSeller);
  const [isAuthChecking, setIsAuthChecking] = useState(!initialUser);
  const [needsOnboarding, setNeedsOnboarding] = useState(initialNeedsOnboarding);
  const [username, setUsername] = useState<string | null>(initialUsername);
  const [payoutStatus, setPayoutStatus] = useState<SellerPayoutStatus>(initialPayoutStatus ?? null);

  // Listen for auth state changes (for client-side navigation)
  useEffect(() => {
    // If we already have initial user from server, skip auth check
    if (initialUser) {
      setIsAuthChecking(false);
      return;
    }

    // Fresh client ensures we re-read auth cookies written by server actions.
    const supabase = createFreshClient();

    const hydrateFromUser = async (currentUser: { id: string; email?: string } | null) => {
      setUser(
        currentUser
          ? {
              id: currentUser.id,
              ...(currentUser.email ? { email: currentUser.email } : {}),
            }
          : null,
      );

      if (currentUser && !seller) {
        // Check if user has a profile with username and is_seller status
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, username, display_name, business_name, is_seller, account_type")
          .eq("id", currentUser.id)
          .single();

        const { data: payoutData } = await supabase
          .from("seller_payout_status")
          .select("stripe_connect_account_id, details_submitted, charges_enabled, payouts_enabled")
          .eq("seller_id", currentUser.id)
          .maybeSingle();

        setPayoutStatus(payoutData ?? null);

        if (profileData?.username) {
          setUsername(profileData.username);

          // Check if user needs onboarding (has username but is_seller is false)
          if (!profileData.is_seller) {
            setNeedsOnboarding(true);
          } else {
            setSeller({
              id: profileData.id,
              store_name:
                profileData.display_name ||
                profileData.business_name ||
                profileData.username ||
                t("common.storeFallback"),
            });
          }
        }
      } else if (!currentUser) {
        setSeller(null);
        setNeedsOnboarding(false);
        setPayoutStatus(null);
      }
    };

    // Explicitly hydrate once on mount. Relying only on onAuthStateChange can miss initial sessions.
    const hydrateInitialUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const currentUser = data.user ? { id: data.user.id, ...(data.user.email ? { email: data.user.email } : {}) } : null;
        await hydrateFromUser(currentUser);
      } finally {
        setIsAuthChecking(false);
      }
    };

    void hydrateInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: { user?: { id: string; email?: string } } | null) => {
      const currentUser = session?.user ?? null;
      await hydrateFromUser(currentUser);

      setIsAuthChecking(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialUser, seller, t]);

  // Loading state while checking auth
  if (isAuthChecking) {
    return <SellFormSkeleton />;
  }

  // Not logged in - show sign in prompt
  if (!user) {
    return (
      <SellGateLayout>
        <div className="flex-1 flex flex-col justify-center overflow-y-auto">
          <SellSignInPrompt />
        </div>
      </SellGateLayout>
    );
  }

  // First-time seller onboarding
  // User has username but hasn't set up their seller profile yet (is_seller = false)
  // Redirect to home page where post-signup modal will handle onboarding
  if (needsOnboarding && user && username) {
    return (
      <SellGateLayout>
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto py-8 px-4 text-center">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              {t("gates.completeAccountSetup.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("gates.completeAccountSetup.description")}
            </p>
            <Button asChild size="lg" className="w-full">
              <Link href="/?onboarding=true">
                {t("gates.completeAccountSetup.cta")}
              </Link>
            </Button>
          </div>
        </div>
      </SellGateLayout>
    );
  }

  // No username yet - need to set one up (legacy users only)
  // New users get username at signup, so this shouldn't happen
  if (!seller) {
    return (
      <SellGateLayout>
        <div className="flex-1 flex flex-col justify-center overflow-y-auto py-8">
          <div className="container-narrow text-center space-y-4">
            <h2 className="text-2xl font-bold">
              {t("gates.setUpUsername.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("gates.setUpUsername.description")}
            </p>
            <Button asChild>
              <Link href="/account/profile">{t("gates.setUpUsername.cta")}</Link>
            </Button>
          </div>
        </div>
      </SellGateLayout>
    );
  }

  // =========================================================================
  // MAIN CONTENT: Sell Form
  // Payout status is checked at publish time, not at form entry
  // =========================================================================

  return (
    <SellErrorBoundary sellerId={seller.id}>
      {/* UnifiedSellForm handles both desktop and mobile layouts */}
      <UnifiedSellForm
        sellerId={seller.id}
        locale={safeLocale}
        categories={categories}
        createListingAction={createListingAction}
        payoutStatus={payoutStatus}
      />
    </SellErrorBoundary>
  );
}
