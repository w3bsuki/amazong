"use client";

import { useState, useCallback, useTransition } from "react";
import { toast } from "sonner";
import {
  CheckCircle,
  House,
  Plus,
  Share,
  Eye,
  SpinnerGap,
  CloudArrowUp,
  Lightning,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import { BoostDialog } from "../../_components/seller/boost-dialog";
import { useTranslations } from "next-intl";

import { SellFormProvider, useSellForm, useSellFormContext, defaultSellFormValuesV4 } from "./sell-form-provider";
import { DesktopLayout, MobileLayout } from "./layouts";
import { PayoutRequiredModal } from "./ui/payout-required-modal";
import type { Category } from "../_lib/types";
import type { SellFormDataV4 } from "@/lib/sell/schema-v4";

type SellerPayoutStatus = {
  stripe_connect_account_id: string | null;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
} | null;

function isPayoutReady(payoutStatus: SellerPayoutStatus | undefined): boolean {
  return Boolean(
    payoutStatus?.details_submitted && payoutStatus?.charges_enabled && payoutStatus?.payouts_enabled
  );
}

type CreateListingResult =
  | {
      success: true;
      id: string;
      sellerUsername: string;
      product: {
        id: string;
        slug: string | null;
      };
    }
  | {
      success: false;
      error: string;
      message?: string;
      issues?: Array<{ path: string[]; message: string }>;
      upgradeRequired?: boolean;
    };

type CreateListingAction = (args: { sellerId: string; data: unknown }) => Promise<CreateListingResult>;

// ============================================================================
// UNIFIED SELL FORM - Phase 4: Responsive Unification
// Single component that handles both desktop and mobile layouts
// ============================================================================

interface UnifiedSellFormProps {
  locale?: string;
  existingProduct?: SellFormDataV4 & { id: string };
  sellerId: string;
  categories?: Category[];
  createListingAction: CreateListingAction;
  payoutStatus?: SellerPayoutStatus;
}

/**
 * UnifiedSellForm - Main sell form component
 * 
 * Uses SellFormProvider for state management and renders either:
 * - DesktopLayout (lg+): Single page with all sections visible
 * - MobileLayout (<lg): Multi-step wizard
 * 
 * Both layouts use the same unified field components from fields/
 */
export function UnifiedSellForm({
  locale = "en",
  existingProduct,
  sellerId,
  categories = [],
  createListingAction,
  payoutStatus,
}: UnifiedSellFormProps) {
  return (
    <SellFormProvider
      locale={locale}
      categories={categories}
      sellerId={sellerId}
      {...(existingProduct ? { existingProduct } : {})}
      totalSteps={4}
    >
      <SellFormContent 
        sellerId={sellerId} 
        createListingAction={createListingAction} 
        payoutStatus={payoutStatus}
      />
    </SellFormProvider>
  );
}

/**
 * SellFormContent - Inner component that has access to form context
 */
function SellFormContent({
  sellerId,
  createListingAction,
  payoutStatus,
}: {
  sellerId: string;
  createListingAction: CreateListingAction;
  payoutStatus: SellerPayoutStatus | undefined;
}) {
  const form = useSellForm();
  const { isBg, clearDraft, setCurrentStep, locale } = useSellFormContext();
  const tSell = useTranslations("Sell");
  const tBoost = useTranslations("Boost");
  
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [createdProductHref, setCreatedProductHref] = useState<string | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<SellFormDataV4 | null>(null);

  // Handle form submission - check payout status first
  const handleSubmit = useCallback(async (data: SellFormDataV4) => {
    setSubmitError(null);
    
    // Gate at publish: check payout status before submitting
    if (!isPayoutReady(payoutStatus)) {
      setPendingSubmitData(data);
      setShowPayoutModal(true);
      return;
    }
    
    startTransition(async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setSubmitError(isBg ? "Моля, влезте в профила си" : "Please sign in to continue");
          return;
        }

        const result: CreateListingResult = await createListingAction({ sellerId, data });

        if (!result.success) {
          const issueMessages = result.issues
            ?.map((i) => {
              const key = i.message
              if (!key) return null
              try {
                return tSell(key as never)
              } catch {
                return key
              }
            })
            .filter(Boolean)
            .join(", ")
            .trim()

          const baseError = result.message || result.error || "Failed to create listing";
          throw new Error(baseError + (issueMessages ? ` (${issueMessages})` : ""));
        }

        // Clear draft after successful submission
        clearDraft();

        toast.success(
          isBg ? "Обявата е публикувана!" : "Listing published!",
          { description: isBg ? "Вашият продукт е на живо" : "Your product is now live" }
        );

        const productId = result.product.id;
        setCreatedProductId(productId);
        setCreatedProductHref(
          result.sellerUsername
            ? `/${result.sellerUsername}/${result.product.slug || productId}`
            : null,
        );
          setShowSuccess(true);
          window.scrollTo({ top: 0, behavior: "instant" });
      } catch (error) {
        console.error("Submit error:", error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : isBg ? "Грешка при публикуване" : "Error publishing listing";
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      }
    });
  }, [isBg, sellerId, clearDraft, payoutStatus, createListingAction]);

  // Handle reset for new listing
  const handleNewListing = useCallback(() => {
    // Clear localStorage draft to prevent state persistence
    clearDraft();
    // Reset form to default values
    form.reset(defaultSellFormValuesV4);
    // Reset to step 1
    setCurrentStep(1);
    // Clear UI state
    setSubmitError(null);
    setCreatedProductId(null);
    setCreatedProductHref(null);
    setShowSuccess(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [form, clearDraft, setCurrentStep]);

  // Processing screen
  if (isPending) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-8">
          <div className="relative mx-auto w-24 h-24">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-border border-t-primary animate-spin" />
            {/* Inner icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <CloudArrowUp className="size-10 text-primary animate-bounce" weight="bold" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {isBg ? "Публикуване..." : "Publishing..."}
            </h2>
            <p className="text-muted-foreground font-medium">
              {isBg 
                ? "Подготвяме вашата обява за купувачите."
                : "Preparing your listing for buyers."}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
            <SpinnerGap className="size-4 animate-spin" weight="bold" />
            <span>{isBg ? "Моля, изчакайте" : "Please wait"}</span>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (showSuccess) {
    const productTitle = form.getValues().title || (isBg ? "Вашият продукт" : "Your product");
    const firstImageObj = form.getValues().images?.[0];
    const firstImageUrl = typeof firstImageObj === "string" ? firstImageObj : firstImageObj?.url;
    const productId = createdProductId;

    return (
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center justify-center h-14">
            <span className="text-sm font-medium text-muted-foreground">
              {isBg ? "Обявата е публикувана" : "Listing Published"}
            </span>
          </div>
        </header>

        {/* Success content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm text-center space-y-8">
            {/* Success icon - clean, no animation */}
            <div className="mx-auto w-20 h-20 bg-success rounded-full flex items-center justify-center">
              <CheckCircle className="size-10 text-success-foreground" weight="fill" />
            </div>

            {/* Success message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {isBg ? "Публикувано!" : "Published!"}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {isBg 
                  ? "Вашата обява е на живо и готова за купувачи."
                  : "Your listing is live and ready for buyers."}
              </p>
            </div>

            {/* Product preview card - cleaner */}
            {firstImageUrl && (
              <div className="bg-surface-subtle rounded-md p-4 border border-border-subtle">
                <div className="flex items-center gap-4">
                  <img 
                    src={firstImageUrl} 
                    alt={productTitle}
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-bold text-base truncate">{productTitle}</p>
                    <p className="text-sm text-muted-foreground">
                      {isBg ? "Обявата е активна" : "Listing is active"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons - cleaner, more professional */}
            <div className="space-y-4 pt-4">
              <Button asChild className="w-full h-12 gap-2 bg-primary hover:bg-interactive-hover text-base font-semibold rounded-md">
                <Link href={createdProductHref || "/"}>
                  <Eye className="size-5" />
                  {isBg ? "Виж обявата" : "View Listing"}
                </Link>
              </Button>

              {/* Boost CTA */}
              {productId && (
                <div className="space-y-2">
                  <BoostDialog
                    product={{ id: productId, title: productTitle, is_boosted: false, boost_expires_at: null }}
                    locale={locale}
                    trigger={
                      <Button variant="outline" className="w-full h-12 gap-2 rounded-md font-semibold">
                        <Lightning className="size-5 text-primary" weight="fill" />
                        {tBoost("title")}
                      </Button>
                    }
                  />
                  <p className="text-xs text-muted-foreground">{tBoost("description")}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-12 gap-2 rounded-md font-medium"
                  onClick={() => {
                    const shareLocale = isBg ? "bg" : "en";
                    if (navigator.share) {
                      navigator.share({
                        title: productTitle,
                        url: createdProductHref
                          ? `${window.location.origin}/${shareLocale}${createdProductHref}`
                          : `${window.location.origin}/${shareLocale}/sell`,
                      });
                    } else {
                      navigator.clipboard.writeText(
                        createdProductHref
                          ? `${window.location.origin}/${shareLocale}${createdProductHref}`
                          : `${window.location.origin}/${shareLocale}/sell`
                      );
                      toast.success(isBg ? "Линкът е копиран" : "Link copied");
                    }
                  }}
                >
                  <Share className="size-5" />
                  {isBg ? "Сподели" : "Share"}
                </Button>

                <Button
                  variant="outline"
                  className="h-12 gap-2 rounded-md font-medium"
                  onClick={handleNewListing}
                >
                  <Plus className="size-5" />
                  {isBg ? "Нова" : "New"}
                </Button>
              </div>

              <Button
                variant="ghost"
                asChild
                className="w-full h-12 gap-2 text-muted-foreground hover:text-foreground rounded-md"
              >
                <Link href="/">
                  <House className="size-5" />
                  {isBg ? "Към началото" : "Go Home"}
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Responsive layout: Desktop (lg+) shows all sections, Mobile (<lg) uses stepper
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DesktopLayout
          onSubmit={handleSubmit}
          submitError={submitError}
          setSubmitError={setSubmitError}
          isSubmitting={isPending}
        />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout 
          onSubmit={handleSubmit} 
          isSubmitting={isPending}
        />
      </div>

      {/* Payout Required Modal - shown when user tries to publish without Stripe setup */}
      <PayoutRequiredModal
        open={showPayoutModal}
        onOpenChange={setShowPayoutModal}
      />
    </>
  );
}
