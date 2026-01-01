"use client";

import { useState, useMemo, useCallback } from "react";
import { CaretRight, Check, MagnifyingGlass, X } from "@phosphor-icons/react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DrawerSelectOption {
  value: string;
  label: string;
  labelBg?: string;
  description?: string;
  descriptionBg?: string;
  icon?: React.ReactNode;
}

interface DrawerSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: DrawerSelectOption[];
  placeholder?: string;
  placeholderBg?: string;
  title?: string;
  titleBg?: string;
  description?: string;
  descriptionBg?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchPlaceholderBg?: string;
  emptyText?: string;
  emptyTextBg?: string;
  locale?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  allowClear?: boolean;
}

export function DrawerSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  placeholderBg = "Избери...",
  title = "Select Option",
  titleBg = "Избери",
  description,
  descriptionBg,
  searchable = false,
  searchPlaceholder = "Search...",
  searchPlaceholderBg = "Търсене...",
  emptyText = "No results found",
  emptyTextBg = "Няма резултати",
  locale = "en",
  className,
  triggerClassName,
  disabled = false,
  allowClear = false,
}: DrawerSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isBg = locale === "bg";

  // Get selected option
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  // Filter options by search
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => {
      const label = isBg && opt.labelBg ? opt.labelBg : opt.label;
      return label.toLowerCase().includes(query);
    });
  }, [options, searchQuery, isBg]);

  // Handle selection
  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery("");
    },
    [onChange]
  );

  // Handle clear
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange("");
    },
    [onChange]
  );

  // Get localized label
  const getLabel = (opt: DrawerSelectOption) =>
    isBg && opt.labelBg ? opt.labelBg : opt.label;

  const getDescription = (opt: DrawerSelectOption) =>
    isBg && opt.descriptionBg ? opt.descriptionBg : opt.description;

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between gap-2 h-12 px-4 text-left",
          "bg-background border border-input rounded-md",
          "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "transition-colors active:bg-accent/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          triggerClassName,
          className
        )}
      >
        {selectedOption ? (
          <>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {selectedOption.icon}
              <span className="text-sm font-medium truncate">
                {getLabel(selectedOption)}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {allowClear && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleClear(e as unknown as React.MouseEvent);
                    }
                  }}
                  className="p-1.5 rounded-full hover:bg-muted"
                  aria-label={isBg ? "Изчисти" : "Clear"}
                >
                  <X className="size-3.5 text-muted-foreground" />
                </span>
              )}
              <Check className="size-4 text-primary" weight="bold" />
            </div>
          </>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">
              {isBg ? placeholderBg : placeholder}
            </span>
            <CaretRight className="size-4 text-muted-foreground shrink-0" />
          </>
        )}
      </button>

      {/* Drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[85vh]">
          {/* Header */}
          <DrawerHeader className="border-b border-border pb-3">
            <DrawerTitle className="text-lg">
              {isBg ? titleBg : title}
            </DrawerTitle>
            {(description || descriptionBg) && (
              <DrawerDescription>
                {isBg && descriptionBg ? descriptionBg : description}
              </DrawerDescription>
            )}
          </DrawerHeader>

          {/* Search (if enabled) */}
          {searchable && (
            <div className="px-4 py-3 border-b border-border">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isBg ? searchPlaceholderBg : searchPlaceholder}
                  className="pl-9 h-11 rounded-md"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <ScrollArea className="flex-1 px-2 py-2">
            {filteredOptions.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {isBg ? emptyTextBg : emptyText}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  const optDescription = getDescription(option);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors",
                        "active:scale-[0.99]",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent active:bg-accent/80"
                      )}
                    >
                      {option.icon && (
                        <span className="shrink-0">{option.icon}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <span
                          className={cn(
                            "text-sm font-medium block truncate",
                            isSelected && "text-primary"
                          )}
                        >
                          {getLabel(option)}
                        </span>
                        {optDescription && (
                          <span className="text-xs text-muted-foreground block truncate">
                            {optDescription}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check
                          className="size-4 text-primary shrink-0"
                          weight="bold"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Safe area padding */}
          <div className="pb-[env(safe-area-inset-bottom)]" />
        </DrawerContent>
      </Drawer>
    </>
  );
}

// Multi-select variant
interface DrawerMultiSelectProps extends Omit<DrawerSelectProps, "value" | "onChange" | "allowClear"> {
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
}

export function DrawerMultiSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  placeholderBg = "Избери...",
  title = "Select Options",
  titleBg = "Избери опции",
  description,
  descriptionBg,
  searchable = false,
  searchPlaceholder = "Search...",
  searchPlaceholderBg = "Търсене...",
  emptyText = "No results found",
  emptyTextBg = "Няма резултати",
  locale = "en",
  className,
  triggerClassName,
  disabled = false,
  maxSelections,
}: DrawerMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isBg = locale === "bg";

  // Get selected options
  const selectedOptions = useMemo(() => {
    return options.filter((opt) => value.includes(opt.value));
  }, [options, value]);

  // Filter options by search
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => {
      const label = isBg && opt.labelBg ? opt.labelBg : opt.label;
      return label.toLowerCase().includes(query);
    });
  }, [options, searchQuery, isBg]);

  // Toggle selection
  const toggleSelection = useCallback(
    (optionValue: string) => {
      if (value.includes(optionValue)) {
        onChange(value.filter((v) => v !== optionValue));
      } else {
        if (maxSelections && value.length >= maxSelections) return;
        onChange([...value, optionValue]);
      }
    },
    [value, onChange, maxSelections]
  );

  // Get localized label
  const getLabel = (opt: DrawerSelectOption) =>
    isBg && opt.labelBg ? opt.labelBg : opt.label;

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between gap-2 h-12 px-4 text-left",
          "bg-background border border-input rounded-md",
          "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "transition-colors active:bg-accent/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          triggerClassName,
          className
        )}
      >
        {selectedOptions.length > 0 ? (
          <>
            <span className="text-sm font-medium truncate flex-1">
              {selectedOptions.map((opt) => getLabel(opt)).join(", ")}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
              {selectedOptions.length}
            </span>
          </>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">
              {isBg ? placeholderBg : placeholder}
            </span>
            <CaretRight className="size-4 text-muted-foreground shrink-0" />
          </>
        )}
      </button>

      {/* Drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="max-h-[85vh]">
          {/* Header */}
          <DrawerHeader className="border-b border-border pb-3">
            <DrawerTitle className="text-lg">
              {isBg ? titleBg : title}
            </DrawerTitle>
            {(description || descriptionBg) && (
              <DrawerDescription>
                {isBg && descriptionBg ? descriptionBg : description}
              </DrawerDescription>
            )}
          </DrawerHeader>

          {/* Search (if enabled) */}
          {searchable && (
            <div className="px-4 py-3 border-b border-border">
              <div className="relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isBg ? searchPlaceholderBg : searchPlaceholder}
                  className="pl-9 h-11 rounded-md"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <ScrollArea className="flex-1 px-2 py-2">
            {filteredOptions.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {isBg ? emptyTextBg : emptyText}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  const atLimit = !!(maxSelections && value.length >= maxSelections && !isSelected);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleSelection(option.value)}
                      disabled={atLimit}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-md text-left transition-colors",
                        "active:scale-[0.99]",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent active:bg-accent/80",
                        atLimit && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {option.icon && (
                        <span className="shrink-0">{option.icon}</span>
                      )}
                      <span className="text-sm font-medium flex-1 truncate">
                        {getLabel(option)}
                      </span>
                      <div
                        className={cn(
                          "size-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && (
                          <Check className="size-3 text-primary-foreground" weight="bold" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Safe area padding */}
          <div className="pb-[env(safe-area-inset-bottom)]" />
        </DrawerContent>
      </Drawer>
    </>
  );
}
