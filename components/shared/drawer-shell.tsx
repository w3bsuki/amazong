import type { ReactNode } from "react"
import { X } from "lucide-react"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { IconButton, type IconButtonProps } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"

interface DrawerShellProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  closeLabel: string
  contentAriaLabel?: string | undefined
  description?: string | undefined
  icon?: ReactNode | undefined
  titleSuffix?: ReactNode | undefined
  headerLeading?: ReactNode | undefined
  headerTrailing?: ReactNode | undefined
  headerExtra?: ReactNode | undefined
  children: ReactNode
  contentClassName?: string | undefined
  headerClassName?: string | undefined
  titleClassName?: string | undefined
  descriptionClassName?: string | undefined
  closeButtonClassName?: string | undefined
  closeButtonSize?: IconButtonProps["size"] | undefined
  closeIconSize?: number | undefined
  dataTestId?: string | undefined
}

/**
 * Shared drawer wrapper with a consistent header, close button, and description handling.
 */
export function DrawerShell({
  open,
  onOpenChange,
  title,
  closeLabel,
  contentAriaLabel,
  description,
  icon,
  titleSuffix,
  headerLeading,
  headerTrailing,
  headerExtra,
  children,
  contentClassName,
  headerClassName,
  titleClassName,
  descriptionClassName = "sr-only",
  closeButtonClassName,
  closeButtonSize = "icon-default",
  closeIconSize = 16,
  dataTestId,
}: DrawerShellProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className={contentClassName}
        data-testid={dataTestId}
        {...(contentAriaLabel ? { "aria-label": contentAriaLabel } : {})}
      >
        <DrawerHeader className={headerClassName}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-1.5">
              {headerLeading}
              {icon}
              <DrawerTitle className={cn("text-sm font-semibold", titleClassName)}>{title}</DrawerTitle>
              {titleSuffix}
            </div>
            <div className="flex items-center gap-1.5">
              {headerTrailing}
              <DrawerClose asChild>
                <IconButton
                  aria-label={closeLabel}
                  variant="ghost"
                  size={closeButtonSize}
                  className={closeButtonClassName}
                >
                  <X size={closeIconSize} />
                </IconButton>
              </DrawerClose>
            </div>
          </div>
          {description ? (
            <DrawerDescription className={descriptionClassName}>{description}</DrawerDescription>
          ) : null}
          {headerExtra}
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  )
}
