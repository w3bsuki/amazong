"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";

interface CategorySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Search input for filtering categories
 */
export function CategorySearch({
  value,
  onChange,
  placeholder = "Search all categories...",
}: CategorySearchProps) {
  return (
    <div className="relative mb-4">
      <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-touch rounded-xl"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
