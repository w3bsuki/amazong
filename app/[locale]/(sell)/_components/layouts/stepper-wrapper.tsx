"use client";

import { type ReactNode, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft as CaretLeft, Rocket, LoaderCircle as SpinnerGap, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "@/i18n/routing";
import { defaultSellFormValuesV4, useSellForm, useSellFormContext } from "../sell-form-provider";
import { useTranslations } from "next-intl";
import { MobileStepProgress } from "@/components/mobile/chrome/mobile-step-progress";

// ============================================================================
// FRAMER MOTION VARIANTS - Direction-aware page transitions
// Premium app-like animations with spring physics
// ============================================================================

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
  }),
};

const pageTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

// ============================================================================
// STEPPER WRAPPER - Premium mobile wizard with dot progress & proper CTAs
// Best practices: tokenized 48px CTAs, dot progress, clear visual hierarchy
// ============================================================================

interface StepConfig {
  id: number;
  fields: string[];
}

interface StepperWrapperProps {
  children: ReactNode;
  steps: StepConfig[];
  onSubmit: () => void;
  onNext?: () => void | Promise<void>;
  isSubmitting?: boolean;
  isNextDisabled?: boolean;
  isSubmitDisabled?: boolean;
}

export function StepperWrapper({
  children,
  steps,
  onSubmit,
  onNext,
  isSubmitting = false,
  isNextDisabled = false,
  isSubmitDisabled = false,
}: StepperWrapperProps) {
  const form = useSellForm();
  const { currentStep, setCurrentStep, clearDraft } = useSellFormContext();
  const router = useRouter();
  const tCommon = useTranslations("Common");
  const tSell = useTranslations("Sell");
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Track direction for animations (1 = forward, -1 = backward)
  const [direction, setDirection] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const prevStepRef = useRef(currentStep);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mql.matches);
    update();

    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Update direction when step changes
  useEffect(() => {
    if (currentStep !== prevStepRef.current) {
      setDirection(currentStep > prevStepRef.current ? 1 : -1);
      prevStepRef.current = currentStep;
    }
  }, [currentStep]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [currentStep]);

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    if (onNext) {
      setDirection(1);
      await onNext();
      return;
    }
    if (currentStep < totalSteps) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleRequestClose = () => {
    const values = form.getValues();
    const hasDraftContent = Boolean(
      (values.images?.length ?? 0) > 0 ||
        values.title?.trim() ||
        values.description?.trim() ||
        values.categoryId ||
        values.price
    );

    if (!hasDraftContent) {
      router.push("/");
      return;
    }

    setDiscardDialogOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Header - Minimal chrome with progress */}
      <header className="sticky top-0 z-40 bg-background border-b border-border-subtle pt-safe">
        <div className="flex h-(--control-primary) items-center px-inset md:h-14">
          {/* Close */}
          <button
            type="button"
            onClick={handleRequestClose}
            aria-label={tCommon("close")}
            className="size-(--control-default) -ml-2 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
          >
            <X className="size-5" />
          </button>

          {/* Title */}
          <div className="flex-1 text-center">
            <div className="text-sm font-semibold leading-tight text-foreground">
              {tSell("createListing")}
            </div>
          </div>

          {/* Step count */}
          <div className="min-w-20 text-right text-2xs font-semibold tabular-nums text-muted-foreground">
            {tSell("stepCounter", { current: currentStep, total: totalSteps })}
          </div>
        </div>

        <div className="px-inset pb-3">
          <MobileStepProgress
            current={currentStep}
            total={totalSteps}
            aria-label={tSell("stepProgress.ariaLabel")}
            aria-valuetext={tSell("stepProgress.valueText", { current: currentStep, total: totalSteps })}
          />
        </div>
      </header>

      {/* Content */}
      <main ref={contentRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto max-w-lg px-inset py-6">
          {prefersReducedMotion ? (
            children
          ) : (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="sticky bottom-0 bg-background border-t border-border-subtle px-inset pt-4 pb-safe">
        <div className="mx-auto max-w-lg pb-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              size="lg"
              disabled={isFirstStep || isSubmitting}
              className="h-(--control-primary) rounded-md text-base font-semibold gap-2.5"
            >
              <CaretLeft className="size-5" />
              {tCommon("back")}
            </Button>

            {isLastStep ? (
              <Button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting || isSubmitDisabled}
                size="lg"
                className="h-(--control-primary) rounded-md text-base font-bold gap-2.5"
              >
                {isSubmitting ? (
                  <>
                    <SpinnerGap className="size-5 animate-spin" />
                    {tSell("actions.publishing")}
                  </>
                ) : (
                  <>
                    <Rocket className="size-5" />
                    {tSell("actions.publishListing")}
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                size="lg"
                className="h-(--control-primary) rounded-md text-base font-bold gap-2.5"
                disabled={isNextDisabled}
              >
                {tCommon("next")}
                <ArrowRight className="size-5" />
              </Button>
            )}
          </div>
        </div>
      </footer>

      <AlertDialog open={discardDialogOpen} onOpenChange={setDiscardDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tSell("discardDraft.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {tSell("discardDraft.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tSell("discardDraft.actions.keepEditing")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive"
              onClick={() => {
                clearDraft();
                form.reset(defaultSellFormValuesV4);
                setCurrentStep(1);
                setDiscardDialogOpen(false);
                router.push("/");
              }}
            >
              {tSell("discardDraft.actions.discard")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
