"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Rocket,
  Sparkle,
  Spinner,
  Check,
  Warning,
  X,
} from "@/lib/icons/phosphor";
import { Button } from "@/components/ui/button";
import { PageContainer } from "../layout/page-container";
import { cn } from "@/lib/utils";

import { useSellForm, useSellFormContext } from "../sell-form-provider";
import {
  PhotosField,
  CategoryField,
  ConditionField,
  TitleField,
  DescriptionField,
  BrandField,
  PricingField,
  ShippingField,
  AttributesField,
} from "../fields";
import { ProgressHeader, ChecklistSidebar } from "../ui";
import { AiListingAssistant } from "../ai/ai-listing-assistant";

// ============================================================================
// DESKTOP LAYOUT - Two-column layout with all fields visible
// Phase 4: Responsive Unification
// ============================================================================

import type { SellFormDataV4 } from "@/lib/sell/schema-v4";

interface DesktopLayoutProps {
  onSubmit: (data: SellFormDataV4) => void;
  submitError: string | null;
  setSubmitError: (error: string | null) => void;
  isSubmitting?: boolean;
}

export function DesktopLayout({
  onSubmit,
  submitError,
  setSubmitError,
  isSubmitting = false,
}: DesktopLayoutProps) {
  const form = useSellForm();
  const {
    progress,
    progressItems,
    currentStep,
    totalSteps,
    isSaving,
    autoSaved,
    hasUnsavedChanges,
    saveDraft,
  } = useSellFormContext();
  const tSell = useTranslations("Sell");

  const formValues = form.watch();

  const handlePrimaryAction = useCallback(async () => {
    setSubmitError(null);

    if (progress === 100) {
      await form.handleSubmit(
        (data) => onSubmit(data),
        () => {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      )();
      return;
    }

    const ok = await form.trigger();
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!ok) return;
  }, [form, onSubmit, progress, setSubmitError]);

  // Manual save
  const handleSaveDraft = useCallback(() => {
    saveDraft();
  }, [saveDraft]);

  return (
    <div className="flex flex-1 flex-col pb-8">
      {/* Sticky Header with Progress */}
      <ProgressHeader
        progressPercent={progress}
        autoSaved={autoSaved}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveDraft={handleSaveDraft}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      {/* Main Content */}
      <PageContainer size="wide" className="py-4">
        <div className="grid gap-4 lg:grid-cols-sell-main xl:grid-cols-sell-main-xl">
          {/* Main Form */}
          <div className="min-w-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handlePrimaryAction();
              }}
              className="space-y-6"
            >
              {/* Section 1: Photos & AI */}
              <section className="space-y-6 rounded-md border border-border bg-background p-6">
                <h2 className="text-base font-semibold text-foreground">
                  {tSell("photos.label")}
                </h2>
                <PhotosField maxPhotos={12} compact />

                {/* AI Assistant - Show after first photo */}
                {(formValues.images?.length ?? 0) > 0 && (
                  <div className="pt-4 border-t border-border">
                    <AiListingAssistant />
                  </div>
                )}
              </section>

              {/* Section 2: Item Details */}
              <section className="space-y-6 rounded-md border border-border bg-background p-6">
                <h2 className="text-base font-semibold text-foreground">
                  {tSell("desktop.sections.details")}
                </h2>

                <TitleField compact idPrefix="sell-form-desktop" />
                <CategoryField compact />
                <ConditionField compact />
                <BrandField compact />
                <DescriptionField compact idPrefix="sell-form-desktop" />
                <AttributesField compact />
              </section>

              {/* Section 3: Pricing & Shipping */}
              <section className="space-y-6 rounded-md border border-border bg-background p-6">
                <h2 className="text-base font-semibold text-foreground">
                  {tSell("desktop.sections.pricingAndShipping")}
                </h2>

                <PricingField compact idPrefix="sell-form-desktop" />
                <ShippingField compact />
              </section>

              {/* Error Display */}
              {submitError && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive-subtle text-destructive border border-destructive/20">
                  <Warning className="size-5 shrink-0" />
                  <p className="text-sm flex-1">{submitError}</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 shrink-0"
                    onClick={() => setSubmitError(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className={cn(
                  "w-full h-12 rounded-md gap-2 text-sm font-semibold",
                  progress !== 100 && "bg-muted text-muted-foreground hover:bg-hover active:bg-active"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="size-5 animate-spin" />
                    {tSell("actions.publishing")}
                  </>
                ) : progress === 100 ? (
                  <>
                    <Rocket className="size-5" weight="bold" />
                    {tSell("actions.publishListing")}
                  </>
                ) : (
                  <>
                    <Sparkle className="size-5" weight="bold" />
                    {tSell("desktop.reviewProgress", { percent: progress })}
                  </>
                )}
              </Button>

              {progress < 100 && (
                <p className="text-center text-sm text-muted-foreground">
                  {tSell("desktop.completeRequiredFieldsToPublish")}
                </p>
              )}
            </form>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <ChecklistSidebar items={progressItems} />

              {/* Tips Card */}
              <div className="p-4 rounded-md border border-border bg-background shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex size-8 items-center justify-center rounded-md bg-selected border border-selected-border">
                    <Sparkle className="size-4 text-primary" weight="bold" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {tSell("desktop.sellingTips.title")}
                  </h4>
                </div>
                <ul className="space-y-3">
                  {[
                    tSell("desktop.sellingTips.items.photos"),
                    tSell("desktop.sellingTips.items.description"),
                    tSell("desktop.sellingTips.items.pricing"),
                  ].map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="size-4 rounded-full bg-selected flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="size-2.5 text-primary" weight="bold" />
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </PageContainer>
    </div>
  );
}
