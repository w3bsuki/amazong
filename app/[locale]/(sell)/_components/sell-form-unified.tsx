"use client"


import { useState, useCallback, useTransition } from "react";
import { toast } from "sonner";

import { createFreshClient } from "@/lib/supabase/client";
import { validateLocale } from "@/i18n/routing";
import { useTranslations } from "next-intl";

import { SellFormProvider, useSellForm, useSellFormContext, defaultSellFormValuesV4 } from "./sell-form-provider";
import { DesktopLayout } from "./layouts/desktop-layout";
import { MobileLayout } from "./layouts/mobile-layout";
import { PayoutRequiredModal } from "./ui/payout-required-modal";
import { SellPublishingState } from "./ui/sell-publishing-state";
import { SellSuccessState } from "./ui/sell-success-state";
import type { Category } from "../_lib/types";
import type { SellFormDataV4 } from "@/lib/sell/schema";
import type { Locale } from "@/i18n/routing";

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

export type CreateListingAction = (args: { sellerId: string; data: unknown }) => Promise<CreateListingResult>;

// ============================================================================
// UNIFIED SELL FORM - Phase 4: Responsive Unification
// Single component that handles both desktop and mobile layouts
// ============================================================================

interface UnifiedSellFormProps {
  locale?: Locale;
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
  const safeLocale = validateLocale(locale);

  return (
    <SellFormProvider
      locale={safeLocale}
      categories={categories}
      sellerId={sellerId}
      {...(existingProduct ? { existingProduct } : {})}
      totalSteps={5}
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
  const { clearDraft, setCurrentStep, locale } = useSellFormContext();
  const tSell = useTranslations("Sell");
  
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [createdProductHref, setCreatedProductHref] = useState<string | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  // Handle form submission - check payout status first
  const handleSubmit = useCallback(async (data: SellFormDataV4) => {
    setSubmitError(null);
    form.clearErrors();
    
    // Gate at publish: check payout status before submitting
    if (!isPayoutReady(payoutStatus)) {
      setShowPayoutModal(true);
      return;
    }
    
    startTransition(async () => {
      try {
        // Fresh client ensures we re-read auth cookies written by server actions.
        const supabase = createFreshClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setSubmitError(tSell("errors.signInRequired"));
          return;
        }

        const result: CreateListingResult = await createListingAction({ sellerId, data });

        if (!result.success) {
          const translateMessage = (raw: string | undefined): string | null => {
            if (!raw) return null
            try {
              return tSell(raw as never)
            } catch {
              return raw
            }
          }

          if (Array.isArray(result.issues)) {
            for (const issue of result.issues) {
              const field = issue.path[0]
              if (!field) continue
              form.setError(field as keyof SellFormDataV4, {
                type: "server",
                message: issue.message,
              })
            }
          }

          const issueMessages = result.issues
            ?.map((issue) => translateMessage(issue.message))
            .filter((message): message is string => Boolean(message))
            .join(", ")
            .trim()

          const baseError =
            translateMessage(result.message) ||
            translateMessage(result.error) ||
            tSell("errors.createFailed")
          const fullError = issueMessages ? `${baseError} (${issueMessages})` : baseError
          setSubmitError(fullError)
          toast.error(fullError)
          return
        }

        // Clear draft after successful submission
        clearDraft();

        toast.success(
          tSell("toasts.published.title"),
          { description: tSell("toasts.published.description") }
        );

        const productId = result.product.id;
        setCreatedProductId(productId);
        setCreatedProductHref(
          result.sellerUsername
            ? `/${result.sellerUsername}/${result.product.slug || productId}`
            : null,
        );
          setShowSuccess(true);
          window.scrollTo({ top: 0, behavior: "auto" });
      } catch (error) {
       const errorMessage = error instanceof Error 
         ? error.message 
          : tSell("errors.publishFailed");
        setSubmitError(errorMessage);
        toast.error(errorMessage);
      }
    });
  }, [sellerId, clearDraft, payoutStatus, createListingAction, form, tSell]);

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
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [form, clearDraft, setCurrentStep]);

  // Processing screen
  if (isPending) {
    return (
      <SellPublishingState
        title={tSell("actions.publishing")}
        description={tSell("publish.processingDescription")}
        waitLabel={tSell("publish.pleaseWait")}
      />
    );
  }

  // Success screen
  if (showSuccess) {
    const productTitle = form.getValues().title || tSell("success.productTitleFallback");
    const firstImageObj = form.getValues().images?.[0];
    const firstImageUrl = typeof firstImageObj === "string" ? firstImageObj : firstImageObj?.url;
    const productId = createdProductId;

    return (
      <SellSuccessState
        locale={locale}
        createdProductHref={createdProductHref}
        productId={productId}
        productTitle={productTitle}
        firstImageUrl={firstImageUrl ?? null}
        onNewListing={handleNewListing}
      />
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
