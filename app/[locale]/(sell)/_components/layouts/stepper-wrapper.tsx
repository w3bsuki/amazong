"use client";

import { type ReactNode, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft as CaretLeft, Rocket, LoaderCircle as SpinnerGap, X } from "lucide-react";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSellFormContext } from "../sell-form-provider";
import { useTranslations } from "next-intl";

// ============================================================================
// FRAMER MOTION VARIANTS - Direction-aware page transitions
// Premium app-like animations with spring physics
// ============================================================================

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
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
  const { currentStep, setCurrentStep } = useSellFormContext();
  const tCommon = useTranslations("Common");
  const tSell = useTranslations("Sell");
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Track direction for animations (1 = forward, -1 = backward)
  const [direction, setDirection] = useState(0);
  const prevStepRef = useRef(currentStep);

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const progressPercent = (currentStep / totalSteps) * 100;

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

  return (
    <div className="flex flex-1 flex-col">
      {/* Header - Premium minimal with dot progress */}
      <header className="sticky top-0 z-40 bg-background border-b border-border-subtle pt-safe">
        <div className="flex h-(--control-primary) items-center px-4 md:h-14">
          {/* Back button or spacer */}
          <div className="w-12">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handleBack}
                className="size-(--control-default) -ml-2 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                aria-label={tCommon("back")}
              >
                <CaretLeft className="size-5" />
              </button>
            )}
          </div>
          
          {/* Center - Step dots with scale animation */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  width: i + 1 === currentStep ? 32 : 8,
                  scale: i + 1 === currentStep ? 1 : 0.9,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={cn(
                  "h-2 rounded-full",
                  i + 1 === currentStep 
                    ? "bg-primary" 
                    : i + 1 < currentStep
                      ? "bg-primary"
                      : "bg-border"
                )}
              />
            ))}
          </div>
          
          {/* Close button */}
          <div className="w-12 flex justify-end">
            <Link 
              href="/"
              aria-label={tCommon("close")}
              className="size-(--control-default) flex items-center justify-center rounded-md hover:bg-muted transition-colors"
            >
              <X className="size-5" />
            </Link>
          </div>
        </div>

        {/* Progress bar - Animated and elegant */}
        <div className="h-0.5 bg-border/50">
          <motion.div 
            className="h-full bg-primary" 
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>
      </header>

      {/* Content - Animated with Framer Motion */}
      <main ref={contentRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto max-w-lg px-4 py-6">
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
        </div>
      </main>

      {/* Footer CTA - bold primary-height buttons */}
      <footer className="sticky bottom-0 bg-background border-t border-border-subtle px-4 pt-4 pb-safe">
        <div className="mx-auto max-w-lg pb-4">
          {isLastStep ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting || isSubmitDisabled}
              size="lg"
              className="w-full h-(--control-primary) rounded-md text-base font-bold gap-2.5"
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
              className="w-full h-(--control-primary) rounded-md text-base font-bold gap-2.5"
              disabled={isNextDisabled}
            >
              {tCommon("continue")}
              <ArrowRight className="size-5" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
