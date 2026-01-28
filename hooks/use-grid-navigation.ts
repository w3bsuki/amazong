/**
 * useGridNavigation — Keyboard navigation for product grids
 *
 * Enables arrow key navigation between items in a grid layout.
 * Works with container queries to adapt to actual column count.
 *
 * Features:
 * - Arrow keys navigate between items
 * - Home/End keys jump to first/last item
 * - Page Up/Down skip rows
 * - Wrap-around navigation (optional)
 * - Focus management for screen readers
 *
 * Usage:
 * ```tsx
 * const { gridRef, handleKeyDown, currentIndex, setCurrentIndex } = useGridNavigation({
 *   itemCount: products.length,
 *   columnsPerRow: 4,
 *   onSelect: (index) => openProduct(products[index]),
 * });
 *
 * <div ref={gridRef} onKeyDown={handleKeyDown} tabIndex={0}>
 *   {products.map((p, i) => (
 *     <ProductCard key={p.id} tabIndex={i === currentIndex ? 0 : -1} />
 *   ))}
 * </div>
 * ```
 */

import * as React from "react";
import { useCallback, useState, useRef, useEffect } from "react";

export interface UseGridNavigationOptions {
  /** Total number of items in the grid */
  itemCount: number;
  /** Number of columns per row (can be dynamic based on container queries) */
  columnsPerRow?: number;
  /** Whether to wrap around when reaching edges */
  wrapAround?: boolean;
  /** Callback when item is selected (Enter key) */
  onSelect?: (index: number) => void;
  /** Initially focused index */
  initialIndex?: number;
  /** Element selector for focusable items within the grid */
  itemSelector?: string;
}

export interface UseGridNavigationReturn {
  /** Ref to attach to the grid container */
  gridRef: React.RefObject<HTMLDivElement | null>;
  /** Keyboard event handler */
  handleKeyDown: (e: React.KeyboardEvent) => void;
  /** Current focused index */
  currentIndex: number;
  /** Set focused index programmatically */
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  /** Focus the item at the current index */
  focusCurrentItem: () => void;
}

export function useGridNavigation({
  itemCount,
  columnsPerRow = 4,
  wrapAround = false,
  onSelect,
  initialIndex = 0,
  itemSelector = "[role='listitem']",
}: UseGridNavigationOptions): UseGridNavigationReturn {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Calculate max index
  const maxIndex = Math.max(0, itemCount - 1);

  // Focus the item at the current index
  const focusCurrentItem = useCallback(() => {
    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll(itemSelector);
    const item = items[currentIndex] as HTMLElement | undefined;

    if (item) {
      // Find first focusable element within the item
      const focusable = item.querySelector<HTMLElement>(
        "a, button, [tabindex]:not([tabindex='-1'])"
      );
      if (focusable) {
        focusable.focus();
      } else {
        // Make the item itself focusable
        item.setAttribute("tabindex", "0");
        item.focus();
      }
    }
  }, [currentIndex, itemSelector]);

  // Focus item when currentIndex changes
  useEffect(() => {
    focusCurrentItem();
  }, [currentIndex, focusCurrentItem]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (itemCount === 0) return;

      let nextIndex = currentIndex;
      let handled = true;

      switch (e.key) {
        case "ArrowRight":
          if (currentIndex < maxIndex) {
            nextIndex = currentIndex + 1;
          } else if (wrapAround) {
            nextIndex = 0;
          }
          break;

        case "ArrowLeft":
          if (currentIndex > 0) {
            nextIndex = currentIndex - 1;
          } else if (wrapAround) {
            nextIndex = maxIndex;
          }
          break;

        case "ArrowDown":
          nextIndex = Math.min(currentIndex + columnsPerRow, maxIndex);
          break;

        case "ArrowUp":
          nextIndex = Math.max(currentIndex - columnsPerRow, 0);
          break;

        case "Home":
          nextIndex = 0;
          break;

        case "End":
          nextIndex = maxIndex;
          break;

        case "PageDown":
          // Skip multiple rows
          nextIndex = Math.min(currentIndex + columnsPerRow * 3, maxIndex);
          break;

        case "PageUp":
          // Skip multiple rows
          nextIndex = Math.max(currentIndex - columnsPerRow * 3, 0);
          break;

        case "Enter":
        case " ":
          if (onSelect) {
            onSelect(currentIndex);
          }
          break;

        default:
          handled = false;
      }

      if (handled) {
        e.preventDefault();
        if (nextIndex !== currentIndex) {
          setCurrentIndex(nextIndex);
        }
      }
    },
    [currentIndex, maxIndex, columnsPerRow, wrapAround, onSelect, itemCount]
  );

  return {
    gridRef,
    handleKeyDown,
    currentIndex,
    setCurrentIndex,
    focusCurrentItem,
  };
}

export default useGridNavigation;
