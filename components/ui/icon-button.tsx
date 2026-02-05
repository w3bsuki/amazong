import * as React from "react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

export type IconButtonProps = Omit<ButtonProps, "size"> & {
  /**
   * Icon-only buttons must be labeled for screen readers.
   */
  "aria-label": string
  /**
   * Defaults to 44px (`size="icon"`). Avoid smaller icon buttons on mobile.
   */
  size?: Extract<ButtonProps["size"], "icon" | "icon-sm" | "icon-lg">
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = "ghost", size = "icon", className, ...props }: IconButtonProps,
  ref
) {
  return (
    <Button
      ref={ref}
      data-slot="icon-button"
      variant={variant}
      size={size}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
})

IconButton.displayName = "IconButton"

export { IconButton }
