"use client";

import { useCallback, useState, useTransition } from "react";
import {
  Rocket,
  Sparkle,
  Spinner,
  ArrowRight,
  Check,
  Warning,
  X,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
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
    isBg,
    progress,
    progressItems,
    currentStep,
    setCurrentStep,
    totalSteps,
    isSaving,
    autoSaved,
    hasUnsavedChanges,
    saveDraft,
    categories,
  } = useSellFormContext();

  const [showReview, setShowReview] = useState(false);

  const formValues = form.watch();

  // Open review screen
  const handleOpenReview = useCallback(async () => {
    setSubmitError(null);
    const ok = await form.trigger();
    setShowReview(true);
    window.scrollTo({ top: 0, behavior: "instant" });

    if (!ok) {
      // toast handled in form validation
    }
  }, [form, setSubmitError]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    form.handleSubmit(
      (data) => {
        onSubmit(data);
      },
      () => {
        // Validation errors handled by react-hook-form
      }
    )();
  }, [onSubmit, form]);

  // Manual save
  const handleSaveDraft = useCallback(() => {
    saveDraft();
  }, [saveDraft]);

  // Tips card data
  const tips = [
    { en: "Quality photos increase sales", bg: "Качествени снимки увеличават продажбите" },
    { en: "Detailed descriptions build trust", bg: "Подробно описание изгражда доверие" },
    { en: "Competitive pricing attracts buyers", bg: "Конкурентна цена привлича купувачи" },
  ];

  return (
    <div className="flex flex-1 flex-col pb-8">
      {/* Sticky Header with Progress */}
      <ProgressHeader
        progressPercent={progress}
        autoSaved={autoSaved}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveDraft={handleSaveDraft}
        locale={isBg ? "bg" : "en"}
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      {/* Main Content */}
      <PageContainer size="wide" className="py-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
          {/* Main Form */}
          <div className="min-w-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleOpenReview();
              }}
              className="space-y-6"
            >
              {/* Section 1: Photos & AI */}
              <section className="space-y-6 rounded-md border border-border bg-background p-6">
                <h2 className="text-base font-semibold text-foreground">
                  {isBg ? "Снимки" : "Photos"}
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
                  {isBg ? "Детайли" : "Details"}
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
                  {isBg ? "Цена и доставка" : "Pricing & Shipping"}
                </h2>

                <PricingField compact idPrefix="sell-form-desktop" />
                <ShippingField compact />
              </section>

              {/* Error Display */}
              {submitError && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
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
                    {isBg ? "Публикуване..." : "Publishing..."}
                  </>
                ) : progress === 100 ? (
                  <>
                    <Rocket className="size-5" weight="bold" />
                    {isBg ? "Преглед и публикуване" : "Review & publish"}
                    <ArrowRight className="size-5" weight="bold" />
                  </>
                ) : (
                  <>
                    <Sparkle className="size-5" weight="bold" />
                    {isBg ? `Преглед (${progress}%)` : `Review (${progress}%)`}
                  </>
                )}
              </Button>

              {progress < 100 && (
                <p className="text-center text-sm text-muted-foreground">
                  {isBg
                    ? "Попълнете всички задължителни полета, за да публикувате"
                    : "Complete all required fields to publish your listing"}
                </p>
              )}
            </form>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <ChecklistSidebar items={progressItems} locale={isBg ? "bg" : "en"} />

              {/* Tips Card */}
              <div className="p-4 rounded-md border border-border bg-background shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex size-8 items-center justify-center rounded-md bg-selected border border-selected-border">
                    <Sparkle className="size-4 text-primary" weight="bold" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {isBg ? "Съвети за продажби" : "Selling Tips"}
                  </h4>
                </div>
                <ul className="space-y-3">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="size-4 rounded-full bg-selected flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="size-2.5 text-primary" weight="bold" />
                      </div>
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {isBg ? tip.bg : tip.en}
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
