"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircle,
  House,
  Plus,
  Share,
  Eye,
  SpinnerGap,
  CloudArrowUp,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";

import { SellFormProvider, useSellForm, useSellFormContext, defaultSellFormValuesV4 } from "./sell-form-provider";
import { DesktopLayout, MobileLayout } from "./layouts";
import type { Category } from "../_lib/types";
import type { SellFormDataV4 } from "@/lib/sell/schema-v4";
import { createListing, type CreateListingResult } from "../_actions/sell";

// ============================================================================
// UNIFIED SELL FORM - Phase 4: Responsive Unification
// Single component that handles both desktop and mobile layouts
// ============================================================================

interface UnifiedSellFormProps {
  locale?: string;
  existingProduct?: SellFormDataV4 & { id: string };
  sellerId: string;
  categories?: Category[];
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
}: UnifiedSellFormProps) {
  return (
    <SellFormProvider
      locale={locale}
      categories={categories}
      sellerId={sellerId}
      {...(existingProduct ? { existingProduct } : {})}
      totalSteps={4}
    >
      <SellFormContent sellerId={sellerId} />
    </SellFormProvider>
  );
}

/**
 * SellFormContent - Inner component that has access to form context
 */
function SellFormContent({ sellerId }: { sellerId: string }) {
  const _router = useRouter();
  const form = useSellForm();
  const { isBg, clearDraft } = useSellFormContext();
  
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);
  const [createdProductHref, setCreatedProductHref] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = useCallback(async (data: SellFormDataV4) => {
    setSubmitError(null);
    
    startTransition(async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setSubmitError(isBg ? "Моля, влезте в профила си" : "Please sign in to continue");
          return;
        }

        const result: CreateListingResult = await createListing({ sellerId, data });

        if (!result.success) {
          const issueMessages = result.issues
            ?.map((i) => `${i.path.join(".")}: ${i.message}`)
            .join(", ")
            .trim();

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
  }, [isBg, sellerId, clearDraft]);

  // Handle reset for new listing
  const handleNewListing = useCallback(() => {
    form.reset(defaultSellFormValuesV4);
    setSubmitError(null);
    setCreatedProductId(null);
    setCreatedProductHref(null);
    setShowSuccess(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [form]);

  // Processing screen
  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-8">
          <div className="relative mx-auto w-24 h-24">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
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

    return (
      <div className="min-h-screen bg-background flex flex-col">
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
            <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="size-10 text-white" weight="fill" />
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
              <div className="bg-muted/30 rounded-md p-4 border border-border/50">
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
              <Button asChild className="w-full h-12 gap-2 bg-primary hover:bg-primary/90 text-base font-semibold rounded-md">
                <Link href={createdProductHref || "/"}>
                  <Eye className="size-5" />
                  {isBg ? "Виж обявата" : "View Listing"}
                </Link>
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-12 gap-2 rounded-md font-medium"
                  onClick={() => {
                    const locale = isBg ? "bg" : "en";
                    if (navigator.share) {
                      navigator.share({
                        title: productTitle,
                        url: createdProductHref
                          ? `${window.location.origin}/${locale}${createdProductHref}`
                          : `${window.location.origin}/${locale}/sell`,
                      });
                    } else {
                      navigator.clipboard.writeText(
                        createdProductHref
                          ? `${window.location.origin}/${locale}${createdProductHref}`
                          : `${window.location.origin}/${locale}/sell`
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
    </>
  );
}
