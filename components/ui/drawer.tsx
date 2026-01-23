"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false

  const ua = navigator.userAgent
  const isiOS = /iPad|iPhone|iPod/.test(ua)
  const isIPadOS = navigator.platform === "MacIntel" && (navigator.maxTouchPoints ?? 0) > 1
  return isiOS || isIPadOS
}

/**
 * Drawer Root - wraps vaul's Drawer.Root with sensible defaults
 * @see https://vaul.emilkowal.ski/api
 * 
 * Key props:
 * - shouldScaleBackground: scales background when drawer opens (iOS-style)
 * - direction: "bottom" | "top" | "left" | "right"
 * - dismissible: whether drawer can be dismissed by dragging down
 * - handleOnly: if true, only the handle can be used to drag
 * - modal: if false, allows interaction with background content
 * - snapPoints: array of height values to snap to (e.g., ["148px", "355px", 1])
 */
function Drawer({
  shouldScaleBackground = false,
  noBodyStyles,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  // Vaul uses `body { position: fixed }` on iOS to work around Safari bugs.
  // That breaks `position: sticky` headers and can cause visible layout jank.
  // Default to no body style injection on iOS (callers can override).
  const resolvedNoBodyStyles = noBodyStyles ?? isIOSDevice()

  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      shouldScaleBackground={shouldScaleBackground}
      noBodyStyles={resolvedNoBodyStyles}
      {...props}
    />
  )
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-overlay-dark",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function containsDrawerA11yNode(
  children: React.ReactNode,
  targetTypes: Array<React.ElementType>
): boolean {
  if (children == null) return false

  const childArray = React.Children.toArray(children)
  for (const child of childArray) {
    if (!React.isValidElement(child)) continue

    if (targetTypes.includes(child.type as React.ElementType)) return true

    const element = child as React.ReactElement<{ children?: React.ReactNode }>
    if (element.props.children && containsDrawerA11yNode(element.props.children, targetTypes)) {
      return true
    }
  }

  return false
}

interface DrawerContentProps extends React.ComponentProps<typeof DrawerPrimitive.Content> {
  /** Show the drag handle for bottom/top drawers - default true for bottom */
  showHandle?: boolean
}

function DrawerContent({
  className,
  children,
  showHandle,
  ...props
}: DrawerContentProps) {
  const ariaLabel = (props as { "aria-label"?: string | undefined })["aria-label"]
  const ariaDescribedBy = (props as { "aria-describedby"?: string | undefined })["aria-describedby"]

  const hasTitle = containsDrawerA11yNode(children, [DrawerTitle, DrawerPrimitive.Title])
  const hasDescription = containsDrawerA11yNode(children, [DrawerDescription, DrawerPrimitive.Description])

  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        aria-describedby={hasDescription ? ariaDescribedBy : undefined}
        className={cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col outline-none",
          // Bottom drawer - standard mobile drawer (most common)
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0",
          "data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-dialog",
          "data-[vaul-drawer-direction=bottom]:rounded-t-2xl",
          "data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=bottom]:border-border",
          // Top drawer
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0",
          "data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-dialog",
          "data-[vaul-drawer-direction=top]:rounded-b-2xl",
          "data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=top]:border-border",
          // Right drawer (side panel)
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0",
          "data-[vaul-drawer-direction=right]:h-full data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:max-w-sm",
          "data-[vaul-drawer-direction=right]:rounded-l-2xl",
          "data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:border-border",
          // Left drawer (side panel) - full width on mobile for hamburger menus, constrained on tablet+
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0",
          "data-[vaul-drawer-direction=left]:h-full data-[vaul-drawer-direction=left]:w-full data-[vaul-drawer-direction=left]:max-w-xs",
          "data-[vaul-drawer-direction=left]:sm:w-80 data-[vaul-drawer-direction=left]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:rounded-none data-[vaul-drawer-direction=left]:sm:rounded-r-2xl",
          "data-[vaul-drawer-direction=left]:border-r-0 data-[vaul-drawer-direction=left]:sm:border-r data-[vaul-drawer-direction=left]:sm:border-border",
          className
        )}
        {...props}
      >
        {!hasTitle && (
          <DrawerTitle className="sr-only">{ariaLabel ?? "Dialog"}</DrawerTitle>
        )}
        {/* Show handle by default for bottom drawers, can be overridden */}
        {showHandle !== false && (
          <div
            data-slot="drawer-handle-container"
            className={cn(
              "hidden",
              "group-data-[vaul-drawer-direction=bottom]/drawer-content:flex",
              "group-data-[vaul-drawer-direction=top]/drawer-content:flex",
              "justify-center pt-4 pb-2"
            )}
          >
            <div
              aria-hidden="true"
              className="h-1.5 w-12 shrink-0 cursor-grab rounded-full bg-muted-foreground/30 transition-colors active:cursor-grabbing hover:bg-muted-foreground/50"
            />
          </div>
        )}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-1.5 px-4 py-3",
        "group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center",
        "group-data-[vaul-drawer-direction=top]/drawer-content:text-center",
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "mt-auto flex flex-col gap-2 px-4 py-4",
        // Safe area padding for bottom drawers on iOS
        "group-data-[vaul-drawer-direction=bottom]/drawer-content:pb-safe-max",
        className
      )}
      {...props}
    />
  )
}

/**
 * Scrollable body container for drawer content.
 * Use this for content that may overflow - it includes proper scroll handling
 * and the data-vaul-no-drag attribute to prevent scroll interference with drag.
 */
function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      data-vaul-no-drag
      className={cn(
        "flex-1 overflow-y-auto overscroll-contain px-4",
        className
      )}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
