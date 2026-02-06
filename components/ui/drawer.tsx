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
  disablePreventScroll,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  // Vaul uses `body { position: fixed }` on iOS to work around Safari bugs.
  // That breaks `position: sticky` headers and can cause visible layout jank.
  // Default to no body style injection on iOS (callers can override).
  const isIOS = isIOSDevice()
  const resolvedNoBodyStyles = noBodyStyles ?? isIOS

  // Vaul's prop name is misleading: `disablePreventScroll` actually ENABLES the
  // scroll lock when true. On iOS Safari that strategy offsets <body> by scrollY,
  // which breaks `position: sticky` headers (header "disappears" after scrolling).
  // Default to disabling that strategy on iOS and rely on overlay/overscroll instead.
  const resolvedDisablePreventScroll = disablePreventScroll ?? !isIOS

  return (
    <DrawerPrimitive.Root
      data-slot="drawer"
      shouldScaleBackground={shouldScaleBackground}
      noBodyStyles={resolvedNoBodyStyles}
      disablePreventScroll={resolvedDisablePreventScroll}
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

/**
 * Blur intensity for drawer overlay
 * Uses design system backdrop-blur tokens:
 * - none: 0 (no blur)
 * - sm: 4px (subtle)
 * - md: 12px (standard modal blur) - DEFAULT
 * - lg: 16px (heavier)
 * - xl: 24px (maximum focus)
 */
type DrawerOverlayBlur = "none" | "sm" | "md" | "lg" | "xl"

interface DrawerOverlayProps extends React.ComponentProps<typeof DrawerPrimitive.Overlay> {
  /**
   * Blur intensity for the background overlay.
   * Creates a frosted glass effect that focuses attention on the drawer.
   * @default "md"
   */
  blur?: DrawerOverlayBlur
}

const blurClasses: Record<DrawerOverlayBlur, string> = {
  none: "",
  sm: "backdrop-blur-sm",    // 4px
  md: "backdrop-blur-md",    // 12px - standard modal blur
  lg: "backdrop-blur-lg",    // 16px
  xl: "backdrop-blur-xl",    // 24px
}

/**
 * Drawer Overlay - uses vaul's native Overlay which handles dismiss properly
 * @see https://vaul.emilkowal.ski/api - Overlay covers inert portion when drawer is open
 *
 * The native Overlay allows:
 * - Click/tap to dismiss (if dismissible)
 * - Proper drag-to-dismiss gestures
 * - Background scrolling prevention
 */
function DrawerOverlay({
  className,
  blur = "md",
  ...props
}: DrawerOverlayProps) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-overlay-dark",
        blurClasses[blur],
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
  /**
   * Blur intensity for the background overlay.
   * Creates a frosted glass effect that focuses attention on the drawer.
   * @default "md"
   */
  overlayBlur?: DrawerOverlayBlur
}

function DrawerContent({
  className,
  children,
  showHandle,
  overlayBlur = "sm",
  onCloseAutoFocus,
  ...props
}: DrawerContentProps) {
  const ariaLabel = (props as { "aria-label"?: string | undefined })["aria-label"]
  const ariaDescribedBy = (props as { "aria-describedby"?: string | undefined })["aria-describedby"]

  const hasTitle = containsDrawerA11yNode(children, [DrawerTitle, DrawerPrimitive.Title])
  const hasDescription = containsDrawerA11yNode(children, [DrawerDescription, DrawerPrimitive.Description])
  const isIOS = isIOSDevice()

  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay blur={overlayBlur} />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        aria-describedby={hasDescription ? ariaDescribedBy : undefined}
        className={cn(
          "group/drawer-content fixed z-50 flex h-auto min-h-0 flex-col overflow-hidden bg-surface-elevated shadow-modal outline-none",
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
        onCloseAutoFocus={(e) => {
          onCloseAutoFocus?.(e)
          if (!e.defaultPrevented && isIOS) {
            e.preventDefault()
          }
        }}
        {...props}
      >
        {!hasTitle && ariaLabel && <DrawerTitle className="sr-only">{ariaLabel}</DrawerTitle>}
        {/* Show handle by default for bottom drawers, can be overridden */}
        {showHandle !== false && (
          <div
            data-slot="drawer-handle-container"
            className={cn(
              "hidden",
              "group-data-[vaul-drawer-direction=bottom]/drawer-content:flex",
              "group-data-[vaul-drawer-direction=top]/drawer-content:flex",
              "justify-center pt-3 pb-1"
            )}
          >
            <div
              aria-hidden="true"
              className="h-1 w-10 shrink-0 rounded-full bg-border transition-colors hover:bg-muted-foreground"
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
        "flex flex-col gap-1.5 px-4 py-3 text-left",
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

interface DrawerBodyProps extends React.ComponentProps<"div"> {
  /**
   * Disable drag-to-dismiss on this scroll area.
   * Set to true for content with complex interactive elements (sliders, carousels).
   * @default false - allows drag-to-dismiss from anywhere for iOS-native feel
   */
  noDrag?: boolean
}

/**
 * Scrollable body container for drawer content.
 * Use this for content that may overflow - it includes proper scroll handling.
 *
 * Touch handling:
 * - touch-pan-y: allows vertical scroll, prevents pinch-zoom
 * - overscroll-contain: prevents scroll chaining to parent
 * - Drag-to-dismiss enabled by default for native iOS feel
 *   (add data-vaul-no-drag to specific interactive elements that conflict)
 */
function DrawerBody({ className, noDrag = false, ...props }: DrawerBodyProps) {
  return (
    <div
      data-slot="drawer-body"
      {...(noDrag && { "data-vaul-no-drag": true })}
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y px-4",
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
