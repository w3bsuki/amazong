"use client";

import { useState, useEffect, useMemo } from "react";
import { MagnifyingGlass, Plus, Check } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SelectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  optionsBg?: string[];
  value: string;
  onChange: (value: string) => void;
  locale?: string;
}

/**
 * SelectDrawer - Drawer component for single-select options on mobile
 * 
 * Displays a searchable list of options in a drawer.
 * Supports custom values and bilingual options.
 */
export function SelectDrawer({
  isOpen,
  onClose,
  title,
  options,
  optionsBg,
  value,
  onChange,
  locale = "en",
}: SelectDrawerProps) {
  const isBg = locale === "bg";
  const displayOptions = isBg && optionsBg ? optionsBg : options;

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const indexed = displayOptions.map((opt, idx) => ({ opt, idx }));
    if (!q) return indexed;
    return indexed.filter(({ opt }) => opt.toLowerCase().includes(q));
  }, [displayOptions, query]);

  const customValue = query.trim();
  const canUseCustomValue = useMemo(() => {
    if (!customValue) return false;
    const normalized = customValue.toLowerCase();
    return !options.some((opt) => opt.trim().toLowerCase() === normalized);
  }, [customValue, options]);

  const handleSelect = (index: number) => {
    onChange(options[index]); // Always store original value
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-border pb-3">
          <DrawerTitle className="text-lg">{title}</DrawerTitle>
          <DrawerDescription>
            {isBg ? "Търсете или въведете стойност" : "Search or type a value"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-3">
          <div className="relative">
            <MagnifyingGlass className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isBg ? "Търсене..." : "Search..."}
              className="h-12 rounded-xl pl-10 text-base"
              autoFocus
              inputMode="search"
            />
          </div>
        </div>

        {canUseCustomValue && (
          <div className="px-4 pb-2">
            <button
              type="button"
              onClick={() => {
                onChange(customValue);
                onClose();
              }}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left min-h-11 touch-action-manipulation",
                "border border-border bg-muted/20 hover:bg-muted/30 active:bg-muted/40"
              )}
            >
              <span className="text-sm font-medium">
                {isBg ? "Използвай" : "Use"} &quot;{customValue}&quot;
              </span>
              <Plus className="size-4 text-muted-foreground shrink-0" />
            </button>
          </div>
        )}

        <ScrollArea className="flex-1 px-2 py-2">
          <div className="space-y-1">
            {filtered.map(({ opt, idx }) => {
              const isSelected = options[idx] === value;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left min-h-11 touch-action-manipulation",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent active:bg-accent/80"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium",
                    isSelected && "text-primary"
                  )}>
                    {opt}
                  </span>
                  {isSelected && <Check className="size-4 text-primary" weight="bold" />}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <div className="pb-[env(safe-area-inset-bottom)]" />
      </DrawerContent>
    </Drawer>
  );
}
