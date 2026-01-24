"use client";

import { type ReactNode, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CaretLeft, Rocket, X, SpinnerGap } from "@phosphor-icons/react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSellFormContext } from "../sell-form-provider";

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
// Best practices: h-12 (48px) CTAs, dot progress, clear visual hierarchy
// ============================================================================

interface StepConfig {
  id: number;
  title: { en: string; bg: string };
  fields: string[];
}

interface StepperWrapperProps {
  children: ReactNode;
  steps: StepConfig[];
  onSubmit: () => void;
  onNext?: () => void | Promise<void>;
  isSubmitting?: boolean;
}

export function StepperWrapper({
  children,
  steps,
  onSubmit,
  onNext,
  isSubmitting = false,
}: StepperWrapperProps) {
  const { currentStep, setCurrentStep, isBg } = useSellFormContext();
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
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 pt-safe">
        <div className="flex items-center h-14 px-4">
          {/* Back button or spacer */}
          <div className="w-12">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handleBack}
                className="size-10 -ml-2 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
                aria-label={isBg ? "Назад" : "Back"}
              >
                <CaretLeft className="size-5" weight="bold" />
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
                      ? "bg-primary/50"
                      : "bg-border"
                )}
              />
            ))}
          </div>
          
          {/* Close button */}
          <div className="w-12 flex justify-end">
            <Link 
              href="/"
              className="size-10 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
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

      {/* Footer CTA - Bold h-12 buttons */}
      <footer className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-border/40 px-4 pt-4 pb-safe">
        <div className="mx-auto max-w-lg pb-4">
          {isLastStep ? (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              size="lg"
              className="w-full h-12 rounded-md text-base font-bold gap-2.5"
            >
              {isSubmitting ? (
                <>
                  <SpinnerGap className="size-5 animate-spin" />
                  {isBg ? "Публикуване..." : "Publishing..."}
                </>
              ) : (
                <>
                  <Rocket className="size-5" weight="fill" />
                  {isBg ? "Публикувай" : "Publish Listing"}
                </>
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              size="lg"
              className="w-full h-12 rounded-md text-base font-bold gap-2.5"
            >
              {isBg ? "Продължи" : "Continue"}
              <ArrowRight className="size-5" weight="bold" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
