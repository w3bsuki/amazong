"use client";

import { Minus, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface MobileQuantityStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * MobileQuantityStepper - Dense marketplace quantity stepper
 * 
 * Design system specs:
 * - Buttons: 32px (h-8) secondary touch target
 * - Input: 40px wide, centered text
 * - No hover scale animations
 * - Border radius: 4px (rounded-sm for eBay-style sharp)
 */
export function MobileQuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className,
}: MobileQuantityStepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const canDecrement = value > min && !disabled;
  const canIncrement = value < max && !disabled;

  return (
    <div className={cn("flex items-center", className)}>
      {/* Decrement - 32px (h-8) touch target */}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={!canDecrement}
        aria-label="Decrease quantity"
        className={cn(
          "h-8 w-8 rounded-l border border-r-0 border-border flex items-center justify-center",
          "bg-muted/50 active:bg-muted transition-colors duration-100",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        <Minus className="size-4 text-foreground" weight="bold" />
      </button>

      {/* Quantity display */}
      <div
        className={cn(
          "h-8 w-10 border-y border-border flex items-center justify-center",
          "bg-background text-sm font-semibold text-foreground tabular-nums"
        )}
      >
        {value}
      </div>

      {/* Increment - 32px (h-8) touch target */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={!canIncrement}
        aria-label="Increase quantity"
        className={cn(
          "h-8 w-8 rounded-r border border-l-0 border-border flex items-center justify-center",
          "bg-muted/50 active:bg-muted transition-colors duration-100",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        <Plus className="size-4 text-foreground" weight="bold" />
      </button>
    </div>
  );
}
