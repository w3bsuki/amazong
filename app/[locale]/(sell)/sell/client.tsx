"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SellerPayoutSetup } from "@/components/shared/seller/seller-payout-setup";
import { ProgressHeader } from "../_components/ui";
import {
  SignInPrompt,
  SellFormSkeleton,
  SellErrorBoundary,
  UnifiedSellForm,
  SellerOnboardingWizard,
  type Category,
  type Seller
} from "../_components";

type SellerPayoutStatus = {
  stripe_connect_account_id: string | null;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
} | null;

type CreateListingAction = Parameters<typeof UnifiedSellForm>[0]["createListingAction"]
type CompleteSellerOnboardingAction =
  Parameters<typeof SellerOnboardingWizard>[0]["completeSellerOnboardingAction"]

function isPayoutReady(payoutStatus: SellerPayoutStatus): boolean {
  return Boolean(
    payoutStatus?.details_submitted && payoutStatus?.charges_enabled && payoutStatus?.payouts_enabled
  );
}

interface SellPageClientProps {
  initialUser: { id: string; email?: string } | null;
  initialSeller: Seller | null;
  initialNeedsOnboarding?: boolean;
  initialUsername?: string | null;
  initialAccountType?: "personal" | "business";  // Always set in DB
  initialDisplayName?: string | null;
  initialBusinessName?: string | null;
  initialPayoutStatus?: SellerPayoutStatus;
  categories: Category[];
  createListingAction: CreateListingAction;
  completeSellerOnboardingAction: CompleteSellerOnboardingAction;
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
  const locale = useLocale();
  const safeLocale = locale === "bg" ? "bg" : "en";
  const [user, setUser] = useState(initialUser);
  const [seller, setSeller] = useState(initialSeller);
  const [isAuthChecking, setIsAuthChecking] = useState(!initialUser);
  const [needsOnboarding, setNeedsOnboarding] = useState(initialNeedsOnboarding);
  const [username, setUsername] = useState<string | null>(initialUsername);
  const [accountType, setAccountType] = useState<"personal" | "business">(initialAccountType);
  const [displayName, setDisplayName] = useState<string | null>(initialDisplayName);
  const [businessName, setBusinessName] = useState<string | null>(initialBusinessName);
  const [payoutStatus, setPayoutStatus] = useState<SellerPayoutStatus>(initialPayoutStatus ?? null);
  const isBg = safeLocale === "bg";

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

        const { data: payoutData } = await supabase
          .from("seller_payout_status")
          .select("stripe_connect_account_id, details_submitted, charges_enabled, payouts_enabled")
          .eq("seller_id", currentUser.id)
          .maybeSingle();

        setPayoutStatus(payoutData ?? null);

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
        setPayoutStatus(null);
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
      <div className="flex flex-1 flex-col">
        <ProgressHeader
          progressPercent={0}
          autoSaved={false}
          isSaving={false}
          hasUnsavedChanges={false}
          onSaveDraft={() => {}}
          locale={safeLocale}
          currentStep={1}
          totalSteps={4}
        />
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
        .select("stripe_connect_account_id, details_submitted, charges_enabled, payouts_enabled")
        .eq("seller_id", user.id)
        .maybeSingle();

      if (profileData) {
        setSeller({
          id: profileData.id,
          store_name: profileData.display_name || profileData.business_name || profileData.username || "Store",
        });
        setNeedsOnboarding(false);
      }

      setPayoutStatus(payoutData ?? null);
    };

    return (
      <div className="flex flex-1 flex-col">
        <ProgressHeader
          progressPercent={0}
          autoSaved={false}
          isSaving={false}
          hasUnsavedChanges={false}
          onSaveDraft={() => {}}
          locale={safeLocale}
          currentStep={1}
          totalSteps={4}
        />
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
      <div className="flex flex-1 flex-col">
        <ProgressHeader
          progressPercent={0}
          autoSaved={false}
          isSaving={false}
          hasUnsavedChanges={false}
          onSaveDraft={() => {}}
          locale={safeLocale}
          currentStep={1}
          totalSteps={4}
        />
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
            <Button asChild>
              <Link href="/account/profile">{isBg ? "Настройки" : "Go to Settings"}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Stripe Connect gating (V2): sellers must complete payout setup before listing.
  if (!isPayoutReady(payoutStatus)) {
    return (
      <div className="flex flex-1 flex-col">
        <ProgressHeader
          progressPercent={0}
          autoSaved={false}
          isSaving={false}
          hasUnsavedChanges={false}
          onSaveDraft={() => {}}
          locale={safeLocale}
          currentStep={1}
          totalSteps={4}
        />
        <div className="flex-1 flex flex-col justify-center overflow-y-auto py-8">
          <div className="container-narrow space-y-6">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-foreground">{t("payoutSetupRequired")}</h1>
              <p className="text-sm text-muted-foreground">{t("payoutSetupDescription")}</p>
            </div>

            <SellerPayoutSetup payoutStatus={payoutStatus} sellerEmail={user.email || ""} />

            <div className="flex justify-center">
              <Button asChild variant="outline" size="sm">
                <Link href="/seller/settings/payouts">{t("setupPayouts")}</Link>
              </Button>
            </div>
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
        locale={safeLocale}
        categories={categories}
        createListingAction={createListingAction}
      />
    </SellErrorBoundary>
  );
}
