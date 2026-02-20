import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

export type IconButtonProps = Omit<ButtonProps, "size"> & {
  /**
   * Icon-only buttons must be labeled for screen readers.
   */
  "aria-label": string
  /**
   * Defaults to 44px (`size="icon-default"`). Use compact size only for dense overlays.
   */
  size?: Extract<
    ButtonProps["size"],
    "icon" | "icon-sm" | "icon-lg" | "icon-compact" | "icon-default" | "icon-primary"
  >
}

function IconButton({ variant = "ghost", size = "icon-default", className, ref, ...props }: IconButtonProps) {
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
}

IconButton.displayName = "IconButton"

export { IconButton }
