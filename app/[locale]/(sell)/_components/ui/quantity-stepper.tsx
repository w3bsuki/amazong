"use client";

import { Minus, Plus } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";

interface QuantityStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

/**
 * QuantityStepper - Numeric stepper with +/- buttons
 * 
 * Displays a quantity input with increment/decrement buttons.
 * Used in pricing section for inventory quantity.
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 9999,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="h-4 w-4" />
      </button>
      <Input
        type="number"
        value={value}
        onChange={(e) => {
          const num = Number.parseInt(e.target.value, 10);
          if (!isNaN(num)) {
            onChange(Math.max(min, Math.min(max, num)));
          }
        }}
        className="w-20 h-10 text-center rounded-lg"
        min={min}
        max={max}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-10 w-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
