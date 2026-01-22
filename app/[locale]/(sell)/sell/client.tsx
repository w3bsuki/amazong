"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WarningCircle } from "@phosphor-icons/react";
import {
  SignInPrompt,
  SellHeader,
  SellFormSkeleton,
  SellErrorBoundary,
  UnifiedSellForm,
  SellerOnboardingWizard,
  type Category,
  type Seller
} from "../_components";
import { useParams } from "next/navigation";

type PayoutSetupStatus = {
  isReady: boolean;
  needsSetup: boolean;
  incomplete: boolean;
};

function toPayoutSetupStatus(
  payoutStatus: { details_submitted: boolean; charges_enabled: boolean; payouts_enabled: boolean } | null
): PayoutSetupStatus {
  const isReady = Boolean(
    payoutStatus?.details_submitted && payoutStatus?.charges_enabled && payoutStatus?.payouts_enabled
  );

  return {
    isReady,
    needsSetup: !payoutStatus,
    incomplete: Boolean(payoutStatus && !isReady),
  };
}

interface SellPageClientProps {
  initialUser: { id: string; email?: string } | null;
  initialSeller: Seller | null;
  initialNeedsOnboarding?: boolean;
  initialUsername?: string | null;
  initialAccountType?: "personal" | "business";  // Always set in DB
  initialDisplayName?: string | null;
  initialBusinessName?: string | null;
  initialPayoutStatus?: PayoutSetupStatus;
  categories: Category[];
  createListingAction: (args: { sellerId: string; data: unknown }) => Promise<any>;
  completeSellerOnboardingAction: (args: {
    userId: string;
    accountType: "personal" | "business";
    username: string;
    displayName: string;
    bio: string;
    businessName?: string;
  }) => Promise<any>;
}

export function SellPageClient({
  initialUser,
  initialSeller,
  initialNeedsOnboarding = false,
  initialUsername = null,
  initialAccountType = "personal",  // Default personal, but always comes from DB
  initialDisplayName = null,
  initialBusinessName = null,
  initialPayoutStatus,
  categories, // Pre-fetched from server
  createListingAction,
  completeSellerOnboardingAction,
}: SellPageClientProps) {
  const t = useTranslations("Sell");
  const [user, setUser] = useState(initialUser);
  const [seller, setSeller] = useState(initialSeller);
  const [isAuthChecking, setIsAuthChecking] = useState(!initialUser);
  const [needsOnboarding, setNeedsOnboarding] = useState(initialNeedsOnboarding);
  const [username, setUsername] = useState<string | null>(initialUsername);
  const [accountType, setAccountType] = useState<"personal" | "business">(initialAccountType);
  const [displayName, setDisplayName] = useState<string | null>(initialDisplayName);
  const [businessName, setBusinessName] = useState<string | null>(initialBusinessName);
  const [payoutStatus, setPayoutStatus] = useState<PayoutSetupStatus>(
    initialPayoutStatus ?? toPayoutSetupStatus(null)
  );

  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "en";
  const isBg = locale === "bg";

  // Listen for auth state changes (for client-side navigation)
  useEffect(() => {
    // If we already have initial user from server, skip auth check
    if (initialUser) {
      setIsAuthChecking(false);
      return;
    }

    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: { user?: { id: string; email?: string } } | null) => {
      const currentUser = session?.user ?? null;
      setUser(
        currentUser
          ? {
            id: currentUser.id,
            ...(currentUser.email ? { email: currentUser.email } : {}),
          }
          : null
      );

      if (currentUser && !seller) {
        // Check if user has a profile with username and is_seller status
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, username, display_name, business_name, is_seller, account_type")
          .eq("id", currentUser.id)
          .single();

        if (profileData?.username) {
          setUsername(profileData.username);
          // account_type is always set in DB, defaults to 'personal'
          setAccountType(profileData.account_type === "business" ? "business" : "personal");
          setDisplayName(profileData.display_name || null);
          setBusinessName(profileData.business_name || null);

          // Check if user needs onboarding (has username but is_seller is false)
          if (!profileData.is_seller) {
            setNeedsOnboarding(true);
          } else {
            setSeller({
              id: profileData.id,
              store_name: profileData.display_name || profileData.business_name || profileData.username || "Store",
            });
          }
        }
      } else if (!currentUser) {
        setSeller(null);
        setNeedsOnboarding(false);
      }

      setIsAuthChecking(false);
    });

    // Fallback timeout
    const timeout = setTimeout(() => {
      setIsAuthChecking(false);
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [initialUser, seller]);

  // Loading state while checking auth - but show SignInPrompt immediately for guests
  if (isAuthChecking && initialUser) {
    return <SellFormSkeleton />;
  }

  // Not logged in - show sign in prompt (render immediately for guests)
  if (!user || (!initialUser && isAuthChecking)) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SellHeader />
        <div className="flex-1 flex flex-col justify-center overflow-y-auto">
          <SignInPrompt />
        </div>
      </div>
    );
  }

  // First-time seller onboarding
  // User has username but hasn't set up their seller profile yet (is_seller = false)
  if (needsOnboarding && user && username) {
    const handleOnboardingComplete = async () => {
      // Refresh seller data after onboarding
      const supabase = createClient();
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, display_name, business_name")
        .eq("id", user.id)
        .single();

      const { data: payoutData } = await supabase
        .from("seller_payout_status")
        .select("details_submitted, charges_enabled, payouts_enabled")
        .eq("seller_id", user.id)
        .maybeSingle();

      if (profileData) {
        setSeller({
          id: profileData.id,
          store_name: profileData.display_name || profileData.business_name || profileData.username || "Store",
        });
        setNeedsOnboarding(false);
      }

      setPayoutStatus(toPayoutSetupStatus(payoutData ?? null));
    };

    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <SellHeader {...(user.email ? { user: { email: user.email } } : {})} />
        <div className="flex-1 flex flex-col justify-center overflow-y-auto py-8">
          <SellerOnboardingWizard
            userId={user.id}
            username={username as string}
            initialAccountType={accountType}
            displayName={displayName}
            initialBusinessName={businessName}
            completeSellerOnboardingAction={completeSellerOnboardingAction}
            onComplete={handleOnboardingComplete}
          />
        </div>
      </div>
    );
  }

  // No username yet - need to set one up (legacy users only)
  // New users get username at signup, so this shouldn't happen
  if (!seller) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SellHeader {...(user.email ? { user: { email: user.email } } : {})} />
        <div className="flex-1 flex flex-col justify-center overflow-y-auto py-8">
          <div className="container-narrow text-center space-y-4">
            <h2 className="text-2xl font-bold">
              {isBg ? "Настройте потребителско име" : "Set Up Your Username"}
            </h2>
            <p className="text-muted-foreground">
              {isBg
                ? "Нужно ви е потребителско име, преди да започнете да продавате."
                : "You need a username before you can start selling. Visit your account settings to set one up."}
            </p>
            <Link
              href="/account/profile"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {isBg ? "Настройки" : "Go to Settings"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Stripe Connect gating (V2): sellers must complete payout setup before listing.
  if (!payoutStatus.isReady) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <SellHeader {...(user.email ? { user: { email: user.email } } : {})} />
        <div className="flex-1 flex flex-col justify-center overflow-y-auto py-8">
          <div className="container-narrow">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WarningCircle className="size-5 text-primary" weight="fill" />
                  {t("payoutSetupRequired")}
                </CardTitle>
                <CardDescription>{t("payoutSetupDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/seller/settings/payouts">{t("setupPayouts")}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN CONTENT: Traditional Form
  // =========================================================================

  return (
    <SellErrorBoundary sellerId={seller.id}>
      {/* UnifiedSellForm handles both desktop and mobile layouts */}
      <UnifiedSellForm
        sellerId={seller.id}
        locale={locale}
        categories={categories}
        createListingAction={createListingAction}
      />
    </SellErrorBoundary>
  );
}
