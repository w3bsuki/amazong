/**
 * GridContainer — Container query wrapper for responsive components
 *
 * Wraps content with `@container` to enable container query breakpoints.
 * Children can then use classes like `@sm:`, `@md:`, `@lg:` to respond
 * to the container's width rather than the viewport.
 *
 * Usage:
 * ```tsx
 * <GridContainer>
 *   <div className="grid grid-cols-2 @sm:grid-cols-3 @md:grid-cols-4">
 *     {items.map(item => <Card {...item} />)}
 *   </div>
 * </GridContainer>
 * ```
 *
 * Container query breakpoints (Tailwind CSS v4):
 * - @3xs: 256px
 * - @2xs: 288px
 * - @xs: 320px
 * - @sm: 384px
 * - @md: 448px
 * - @lg: 512px
 * - @xl: 576px
 * - @2xl: 672px
 * - @3xl: 768px
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export interface GridContainerProps extends React.ComponentProps<"div"> {
  /** Container name for targeted queries */
  name?: string;
  /** Whether to add padding */
  padded?: boolean;
  /** Additional className */
  className?: string;
  children: React.ReactNode;
}

export function GridContainer({
  name,
  padded = false,
  className,
  children,
  ...props
}: GridContainerProps) {
  return (
    <div
      data-slot="grid-container"
      className={cn(
        "@container",
        padded && "p-4",
        className
      )}
      style={name ? { containerName: name } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

export default GridContainer;
