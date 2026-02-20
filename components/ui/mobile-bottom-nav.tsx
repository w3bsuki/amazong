import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const mobileBottomNavRootVariants = cva(
  "pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden"
)

const mobileBottomNavDockVariants = cva(
  // Flat surface for persistent mobile chrome; shadow-nav is an upward-facing shadow defined in globals.css.
  "pointer-events-auto w-full rounded-t-2xl border-t border-border-subtle bg-background px-2 pt-2 pb-safe shadow-nav"
)

const mobileBottomNavListVariants = cva(
  "grid h-(--spacing-bottom-nav) grid-cols-5 items-center"
)

const mobileBottomNavItemVariants = cva(
  // before: pill indicator — sits flush at the top of the nav dock, animates in on active.
  [
    "group relative flex h-full w-full flex-col items-center justify-center gap-0.5",
    "tap-transparent select-none text-nav-inactive",
    "transition-all duration-150",
    "before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2",
    "before:h-0.5 before:w-5 before:rounded-full before:content-['']",
    "before:bg-transparent before:transition-all before:duration-200",
    "data-[state=active]:text-nav-active data-[state=active]:before:bg-nav-active data-[state=active]:before:w-6",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ],
  {
    variants: {
      emphasis: {
        // Tactile scale feedback + pill indicator for standard tabs.
        default: "active:scale-95",
        // Pull the core action up so it floats above the dock edge;
        // no pill indicator or scale (the FAB button handles its own feedback).
        core: "-mt-3 before:hidden",
      },
    },
    defaultVariants: {
      emphasis: "default",
    },
  }
)

const mobileBottomNavCoreActionVariants = cva(
  // Floating sell button: elevated with shadow-cta, slightly larger touch presence.
  // ring-background creates a visual gap between button and dock surface.
  [
    "inline-flex size-13 items-center justify-center rounded-full",
    "bg-foreground text-background",
    "shadow-cta ring-4 ring-background",
    "transition-all duration-150",
    "hover:bg-foreground/90",
    "active:scale-90",
    "group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground",
    "group-data-[state=active]:ring-focus-ring",
  ]
)

const mobileBottomNavLabelVariants = cva(
  // text-2xs (0.625rem) matches native app label conventions — dense without feeling cramped.
  "text-2xs font-medium leading-none tracking-wider transition-colors group-data-[state=active]:font-semibold group-data-[state=active]:tracking-wide"
)

function MobileBottomNavRoot({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="mobile-bottom-nav-root"
      className={cn(mobileBottomNavRootVariants(), className)}
      {...props}
    />
  )
}

function MobileBottomNavDock({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="mobile-bottom-nav-dock"
      className={cn(mobileBottomNavDockVariants(), className)}
      {...props}
    />
  )
}

function MobileBottomNavList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="mobile-bottom-nav-list"
      className={cn(mobileBottomNavListVariants(), className)}
      {...props}
    />
  )
}

type MobileBottomNavItemProps = React.ComponentProps<"button"> &
  VariantProps<typeof mobileBottomNavItemVariants> & {
    asChild?: boolean
    state?: "active" | "inactive"
  }

function MobileBottomNavItem({
  className,
  state,
  emphasis,
  asChild = false,
  ...props
}: MobileBottomNavItemProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="mobile-bottom-nav-item"
      data-state={state}
      className={cn(mobileBottomNavItemVariants({ emphasis }), className)}
      {...props}
    />
  )
}

type MobileBottomNavCoreActionProps = React.ComponentProps<"span"> &
  VariantProps<typeof mobileBottomNavCoreActionVariants> & {
    asChild?: boolean
  }

function MobileBottomNavCoreAction({
  className,
  asChild = false,
  ...props
}: MobileBottomNavCoreActionProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="mobile-bottom-nav-core-action"
      className={cn(mobileBottomNavCoreActionVariants(), className)}
      {...props}
    />
  )
}

type MobileBottomNavLabelProps = React.ComponentProps<"span"> & {
  state?: "active" | "inactive"
}

function MobileBottomNavLabel({
  className,
  state,
  ...props
}: MobileBottomNavLabelProps) {
  return (
    <span
      data-slot="mobile-bottom-nav-label"
      aria-hidden="true"
      data-state={state}
      className={cn(mobileBottomNavLabelVariants(), className)}
      {...props}
    />
  )
}

export {
  MobileBottomNavRoot,
  MobileBottomNavDock,
  MobileBottomNavList,
  MobileBottomNavItem,
  MobileBottomNavCoreAction,
  MobileBottomNavLabel,
}

