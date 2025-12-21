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
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";

import { SellFormProvider, useSellForm, useSellFormContext, defaultSellFormValuesV4 } from "./sell-form-provider";
import { DesktopLayout, MobileLayout } from "./layouts";
import type { Category } from "./types";
import type { SellFormDataV4 } from "@/lib/sell-form-schema-v4";

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
      existingProduct={existingProduct}
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
  const router = useRouter();
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

        const response = await fetch("/api/products/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, sellerId }),
        });

        const text = await response.text();
        let result;
        try {
          result = text ? JSON.parse(text) : {};
        } catch {
          console.error("Failed to parse response:", text);
          throw new Error("Server error: " + text.slice(0, 200));
        }

        if (!response.ok) {
          console.error("API error:", response.status, result);
          if (result.details || result.issues) {
            const issueMessages = result.issues
              ?.map((i: { path: string[]; message: string }) => `${i.path.join(".")}: ${i.message}`)
              .join(", ") || "";
            throw new Error(result.error + (issueMessages ? ` (${issueMessages})` : ""));
          }
          throw new Error(result.error || "Failed to create listing");
        }

        // Clear draft after successful submission
        clearDraft();

        toast.success(
          isBg ? "Обявата е публикувана!" : "Listing published!",
          { description: isBg ? "Вашият продукт е на живо" : "Your product is now live" }
        );

        const productId = result?.product?.id || result?.id;
        const sellerUsername = result?.sellerUsername as string | undefined;
        const productSlug = result?.product?.slug as string | undefined;

        if (productId) {
          setCreatedProductId(productId);
          setCreatedProductHref(
            sellerUsername && productSlug
              ? `/${sellerUsername}/${productSlug}`
              : `/product/${productId}`
          );
          setShowSuccess(true);
          window.scrollTo({ top: 0, behavior: "instant" });
        }
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
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-sm text-center space-y-6">
            {/* Success animation */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
              <div className="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="size-10 text-white" weight="fill" />
              </div>
            </div>

            {/* Success message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {isBg ? "Поздравления! 🎉" : "Congratulations! 🎉"}
              </h1>
              <p className="text-muted-foreground">
                {isBg 
                  ? "Вашата обява е публикувана успешно и е на живо!"
                  : "Your listing has been published successfully and is now live!"}
              </p>
            </div>

            {/* Product preview card */}
            {firstImageUrl && (
              <div className="bg-muted/50 rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3">
                  <img 
                    src={firstImageUrl} 
                    alt={productTitle}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-sm truncate">{productTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {isBg ? "Вашата обява е на живо" : "Your listing is live"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-3 pt-2">
              <Button asChild className="w-full h-12 gap-2 bg-primary hover:bg-primary/90">
                <Link href={createdProductHref || (createdProductId ? `/product/${createdProductId}` : "/")}>
                  <Eye className="size-5" />
                  {isBg ? "Виж обявата" : "View Listing"}
                </Link>
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 gap-2"
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
                  <Share className="size-4" />
                  {isBg ? "Сподели" : "Share"}
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 h-11 gap-2"
                  onClick={handleNewListing}
                >
                  <Plus className="size-4" />
                  {isBg ? "Нова обява" : "New Listing"}
                </Button>
              </div>

              <Button
                variant="ghost"
                asChild
                className="w-full h-11 gap-2 text-muted-foreground"
              >
                <Link href="/">
                  <House className="size-4" />
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
        />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout onSubmit={handleSubmit} />
      </div>
    </>
  );
}

// ============================================================================
// LEGACY EXPORTS - For backward compatibility during transition
// ============================================================================

/**
 * SellForm - Legacy export name
 * @deprecated Use UnifiedSellForm instead
 */
export const SellForm = UnifiedSellForm;

/**
 * SellFormStepper - Legacy export for mobile stepper
 * @deprecated Use UnifiedSellForm instead - it handles both layouts
 */
export function SellFormStepper(props: UnifiedSellFormProps) {
  return <UnifiedSellForm {...props} />;
}
