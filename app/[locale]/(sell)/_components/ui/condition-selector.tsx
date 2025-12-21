"use client";

import { useState } from "react";
import { Check, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import type { SellFormDataV4 } from "@/lib/sell-form-schema-v4";
import { conditionOptions } from "@/lib/sell-form-schema-v4";

interface ConditionSelectorProps {
  value: SellFormDataV4["condition"] | "";
  onChange: (value: SellFormDataV4["condition"]) => void;
  locale?: string;
}

/**
 * ConditionSelector - Drawer-based condition picker for mobile/touch interfaces
 * 
 * Displays a touchable row that opens a drawer with condition options.
 * Used in step-specifics.tsx for the mobile sell form.
 */
export function ConditionSelector({
  value,
  onChange,
  locale = "en",
}: ConditionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isBg = locale === "bg";

  const selectedOption = conditionOptions.find((opt) => opt.value === value);
  const selectedLabel = selectedOption
    ? isBg
      ? selectedOption.labelBg
      : selectedOption.label
    : null;

  const handleSelect = (optValue: SellFormDataV4["condition"]) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button - Consistent with FieldRow styling */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-muted-foreground/30 text-left min-h-11 touch-action-manipulation",
          "bg-background hover:bg-accent active:bg-accent/80",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{isBg ? "Състояние" : "Condition"}</span>
            <span className="text-destructive text-xs">*</span>
          </div>
          <span
            className={cn(
              "text-sm truncate block",
              selectedLabel ? "font-medium text-foreground" : "text-muted-foreground"
            )}
          >
            {selectedLabel ?? (isBg ? "Избери..." : "Select...")}
          </span>
        </div>
        {selectedLabel ? (
          <Check className="size-4 text-primary shrink-0" weight="bold" />
        ) : (
          <CaretRight className="size-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b border-border pb-3">
            <DrawerTitle className="text-lg">
              {isBg ? "Състояние" : "Condition"}
            </DrawerTitle>
            <DrawerDescription>
              {isBg
                ? "Изберете състоянието на вашия артикул"
                : "Select the condition of your item"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-2">
            {conditionOptions.map((option) => {
              const isSelected = option.value === value;
              const label = isBg ? option.labelBg : option.label;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value as SellFormDataV4["condition"])}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 p-4 rounded-xl text-left min-h-11 touch-action-manipulation",
                    isSelected
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-accent hover:bg-accent/80 border-2 border-transparent"
                  )}
                >
                  <span
                    className={cn(
                      "text-base font-medium",
                      isSelected && "text-primary"
                    )}
                  >
                    {label}
                  </span>
                  {isSelected && (
                    <Check className="size-5 text-primary" weight="bold" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pb-[env(safe-area-inset-bottom)]" />
        </DrawerContent>
      </Drawer>
    </>
  );
}
