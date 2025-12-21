"use client";

import { useState, useEffect, useMemo } from "react";
import { MagnifyingGlass, Plus, Check } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MultiSelectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  optionsBg?: string[];
  value: string[];
  onChange: (value: string[]) => void;
  locale?: string;
}

/**
 * MultiSelectDrawer - Drawer component for multi-select options on mobile
 * 
 * Displays a searchable list of options with checkboxes in a drawer.
 * Supports custom values and bilingual options.
 */
export function MultiSelectDrawer({
  isOpen,
  onClose,
  title,
  options,
  optionsBg,
  value,
  onChange,
  locale = "en",
}: MultiSelectDrawerProps) {
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
  const canAddCustomValue = useMemo(() => {
    if (!customValue) return false;
    const normalized = customValue.toLowerCase();
    const existsInOptions = options.some((opt) => opt.trim().toLowerCase() === normalized);
    const existsInSelected = value.some((v) => v.trim().toLowerCase() === normalized);
    return !existsInOptions && !existsInSelected;
  }, [customValue, options, value]);

  const toggleOption = (index: number) => {
    const optionValue = options[index];
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-border pb-3">
          <DrawerTitle className="text-lg">{title}</DrawerTitle>
          <DrawerDescription>
            {isBg ? "Можете да изберете няколко" : "You can select multiple"}
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

        {canAddCustomValue && (
          <div className="px-4 pb-2">
            <button
              type="button"
              onClick={() => {
                onChange([...value, customValue]);
                setQuery("");
              }}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left min-h-11 touch-action-manipulation",
                "border border-border bg-muted/20 hover:bg-muted/30 active:bg-muted/40"
              )}
            >
              <span className="text-sm font-medium">
                {isBg ? "Добави" : "Add"} &quot;{customValue}&quot;
              </span>
              <Plus className="size-4 text-muted-foreground shrink-0" />
            </button>
          </div>
        )}

        <ScrollArea className="flex-1 px-2 py-2">
          <div className="space-y-1">
            {filtered.map(({ opt, idx }) => {
              const isSelected = value.includes(options[idx]);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleOption(idx)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left min-h-11 touch-action-manipulation",
                    isSelected
                      ? "bg-primary/10"
                      : "hover:bg-accent active:bg-accent/80"
                  )}
                >
                  <div className={cn(
                    "size-5 rounded border-2 flex items-center justify-center shrink-0",
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                  )}>
                    {isSelected && <Check className="size-3 text-primary-foreground" weight="bold" />}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    isSelected && "text-primary"
                  )}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <Button className="w-full h-12 rounded-xl" onClick={onClose}>
            {isBg ? "Готово" : "Done"} {value.length > 0 && `(${value.length})`}
          </Button>
        </div>

        <div className="pb-[env(safe-area-inset-bottom)]" />
      </DrawerContent>
    </Drawer>
  );
}
