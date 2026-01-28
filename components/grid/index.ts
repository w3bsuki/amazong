/**
 * Grid Components — Container query-responsive grid utilities
 *
 * This module exports:
 * - GridContainer: Wrapper that enables @container queries
 * - ProductGrid: Responsive product card grid with view modes
 */

export { GridContainer } from "./grid-container";
export type { GridContainerProps } from "./grid-container";

export { ProductGrid, ProductGridSkeleton } from "./product-grid";
export type { ProductGridProps, ProductGridProduct, ViewMode } from "./product-grid";
