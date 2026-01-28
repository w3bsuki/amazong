/**
 * useViewToggleShortcuts — Keyboard shortcuts for grid/list view toggle
 *
 * Provides keyboard shortcuts for switching between view modes:
 * - 'g' or 'G': Switch to grid view
 * - 'l' or 'L': Switch to list view
 * - Number keys 1-5: Change column density (optional)
 *
 * Usage:
 * ```tsx
 * useViewToggleShortcuts({
 *   onViewChange: (mode) => setViewMode(mode),
 *   currentView: viewMode,
 *   enabled: !isInputFocused,
 * });
 * ```
 */

import { useEffect, useCallback } from "react";
import type { ViewMode } from "@/components/grid/product-grid";

export interface UseViewToggleShortcutsOptions {
  /** Callback when view mode changes */
  onViewChange: (mode: ViewMode) => void;
  /** Current view mode */
  currentView: ViewMode;
  /** Whether shortcuts are enabled (disable when typing in inputs) */
  enabled?: boolean;
  /** Optional callback for density change (1-5 columns) */
  onDensityChange?: (density: number) => void;
}

export function useViewToggleShortcuts({
  onViewChange,
  currentView,
  enabled = true,
  onDensityChange,
}: UseViewToggleShortcutsOptions): void {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (!enabled) return;

      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest("[role='dialog']") !== null ||
        target.closest("[role='combobox']") !== null;

      if (isInput) return;

      // Don't trigger if modifier keys are pressed (except shift for capital letters)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();

      switch (key) {
        case "g":
          if (currentView !== "grid") {
            e.preventDefault();
            onViewChange("grid");
          }
          break;

        case "l":
          if (currentView !== "list") {
            e.preventDefault();
            onViewChange("list");
          }
          break;

        // Optional density shortcuts (1-5)
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
          if (onDensityChange) {
            e.preventDefault();
            onDensityChange(parseInt(key, 10));
          }
          break;
      }
    },
    [enabled, currentView, onViewChange, onDensityChange]
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}

export default useViewToggleShortcuts;
