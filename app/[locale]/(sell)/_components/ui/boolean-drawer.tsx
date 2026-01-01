"use client";

import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface BooleanDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  onChange: (value: string) => void;
  locale?: string;
}

/**
 * BooleanDrawer - Drawer component for yes/no selection on mobile
 * 
 * Displays two large buttons for Yes/No selection.
 * Used for boolean attribute types.
 */
export function BooleanDrawer({
  isOpen,
  onClose,
  title,
  value,
  onChange,
  locale = "en",
}: BooleanDrawerProps) {
  const isBg = locale === "bg";
  const options = [
    { value: "true", label: isBg ? "Да" : "Yes" },
    { value: "false", label: isBg ? "Не" : "No" },
  ];

  const handleSelect = (val: string) => {
    onChange(val);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent>
        <DrawerHeader className="border-b border-border pb-3">
          <DrawerTitle className="text-lg">{title}</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 space-y-2">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 p-4 rounded-md text-left",
                  isSelected
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-accent hover:bg-accent/80 border-2 border-transparent"
                )}
              >
                <span className={cn(
                  "text-base font-medium",
                  isSelected && "text-primary"
                )}>
                  {opt.label}
                </span>
                {isSelected && <Check className="size-5 text-primary" weight="bold" />}
              </button>
            );
          })}
        </div>

        <div className="pb-[env(safe-area-inset-bottom)]" />
      </DrawerContent>
    </Drawer>
  );
}
