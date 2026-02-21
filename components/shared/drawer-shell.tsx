import type { ComponentProps, ReactNode } from "react"
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
  headerLayout?: "standard" | "centered" | undefined
  showCloseButton?: boolean | undefined
  closeLabel: string
  contentAriaLabel?: string | undefined
  description?: ReactNode | undefined
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
  drawerProps?: Omit<ComponentProps<typeof Drawer>, "children" | "open" | "onOpenChange" | "fadeFromIndex"> | undefined
  drawerContentProps?: Omit<
    ComponentProps<typeof DrawerContent>,
    "children" | "className" | "data-testid" | "aria-label"
  > | undefined
}

/**
 * Shared drawer wrapper with a consistent header, close button, and description handling.
 */
export function DrawerShell({
  open,
  onOpenChange,
  title,
  headerLayout = "standard",
  showCloseButton = true,
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
  closeButtonClassName = "bg-background border border-border-subtle shadow-sm text-foreground hover:bg-hover active:bg-active",
  closeButtonSize = "icon-default",
  closeIconSize = 16,
  dataTestId,
  drawerProps,
  drawerContentProps,
}: DrawerShellProps) {
  const isCentered = headerLayout === "centered"
  const closeButton = showCloseButton ? (
    <DrawerClose asChild>
      <IconButton
        aria-label={closeLabel}
        data-vaul-no-drag
        variant="ghost"
        size={closeButtonSize}
        className={closeButtonClassName}
      >
        <X size={closeIconSize} />
      </IconButton>
    </DrawerClose>
  ) : null

  return (
    <Drawer open={open} onOpenChange={onOpenChange} {...drawerProps}>
      <DrawerContent
        className={contentClassName}
        data-testid={dataTestId}
        {...(contentAriaLabel ? { "aria-label": contentAriaLabel } : {})}
        {...drawerContentProps}
      >
        <DrawerHeader className={headerClassName}>
          {headerLayout === "centered" ? (
            <div className="grid grid-cols-balanced-center items-center gap-3">
              <div className="flex min-w-0 items-center gap-1.5 justify-start">
                {headerLeading}
              </div>
              <div className="flex min-w-0 items-center justify-center gap-1.5">
                {icon}
                <DrawerTitle className={cn("text-sm font-semibold text-center", titleClassName)}>
                  {title}
                </DrawerTitle>
                {titleSuffix}
              </div>
              <div className="flex min-w-0 items-center gap-1.5 justify-end">
                {headerTrailing}
                {closeButton}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-1.5">
                {headerLeading}
                {icon}
                <DrawerTitle className={cn("text-sm font-semibold", titleClassName)}>{title}</DrawerTitle>
                {titleSuffix}
              </div>
              <div className="flex items-center gap-1.5">
                {headerTrailing}
                {closeButton}
              </div>
            </div>
          )}
          {description ? (
            <DrawerDescription
              className={cn("pt-0.5", isCentered && "mx-auto text-center", descriptionClassName)}
            >
              {description}
            </DrawerDescription>
          ) : null}
          {headerExtra}
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  )
}
