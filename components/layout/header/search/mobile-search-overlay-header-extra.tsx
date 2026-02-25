import type { FormEvent, RefObject } from "react"
import { Bot as Robot, Search as MagnifyingGlass, X } from "lucide-react"

import { FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type MobileSearchOverlayHeaderExtraProps = {
  isAiModeAvailable: boolean
  aiMode: boolean
  onAiModeChange: (open: boolean) => void
  searchInputId: string
  inputRef: RefObject<HTMLInputElement | null>
  onSubmit: (event: FormEvent) => void
  query: string
  onQueryChange: (value: string) => void
  onClearInput: () => void
  aiModeLabel: string
  searchLabel: string
  searchFieldLabel: string
  placeholder: string
  clearLabel: string
}

export function MobileSearchOverlayHeaderExtra({
  isAiModeAvailable,
  aiMode,
  onAiModeChange,
  searchInputId,
  inputRef,
  onSubmit,
  query,
  onQueryChange,
  onClearInput,
  aiModeLabel,
  searchLabel,
  searchFieldLabel,
  placeholder,
  clearLabel,
}: MobileSearchOverlayHeaderExtraProps) {
  return (
    <div className="space-y-2">
      {isAiModeAvailable ? (
        <div className="flex items-center gap-2" data-vaul-no-drag>
          <Robot size={16} className={aiMode ? "text-primary" : "text-muted-foreground"} aria-hidden="true" />
          <span
            className={cn(
              "text-sm font-medium",
              aiMode ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {aiModeLabel}
          </span>
          <Switch checked={aiMode} onCheckedChange={onAiModeChange} aria-label={aiModeLabel} />
        </div>
      ) : null}

      {(!isAiModeAvailable || !aiMode) && (
        <form onSubmit={onSubmit} className="relative" role="search" aria-label={searchLabel}>
          <MagnifyingGlass
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground"
            aria-hidden="true"
          />
          <FieldLabel htmlFor={searchInputId} className="sr-only">
            {searchFieldLabel}
          </FieldLabel>
          <Input
            ref={inputRef}
            id={searchInputId}
            type="search"
            inputMode="search"
            enterKeyHint="search"
            placeholder={placeholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-(--control-default) w-full rounded-full border border-border bg-background pl-9 pr-10 text-base focus-visible:ring-0"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label={searchFieldLabel}
            data-vaul-no-drag
          />
          {query ? (
            <button
              type="button"
              onClick={onClearInput}
              className="absolute right-2 top-1/2 flex size-(--control-compact) -translate-y-1/2 items-center justify-center rounded-full bg-muted text-foreground transition-colors duration-fast ease-smooth hover:bg-hover active:bg-active"
              aria-label={clearLabel}
              data-vaul-no-drag
            >
              <X size={12} aria-hidden="true" />
            </button>
          ) : null}
        </form>
      )}
    </div>
  )
}
