import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const mobileBottomNavRootVariants = cva(
  "pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden"
)

const mobileBottomNavDockVariants = cva(
  "pointer-events-auto w-full border-t border-border-subtle/50 bg-background/85 backdrop-blur-xl px-2 pb-safe shadow-none"
)

const mobileBottomNavListVariants = cva(
  "grid h-(--spacing-bottom-nav) grid-cols-5 items-center"
)

const mobileBottomNavItemVariants = cva(
  [
    "group relative flex h-full w-full flex-col items-center justify-center gap-0.5",
    "tap-transparent select-none text-nav-inactive",
    "transition-colors duration-150",
    "data-[state=active]:text-nav-active",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ],
  {
    variants: {
      emphasis: {
        default: "",
        core: "",
      },
    },
    defaultVariants: {
      emphasis: "default",
    },
  }
)

const mobileBottomNavCoreActionVariants = cva(
  [
    "inline-flex size-(--control-default) items-center justify-center rounded-full",
    "bg-foreground text-background shadow-sm ring-1 ring-inset ring-foreground/10",
    "transition-colors duration-150",
    "group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground",
  ]
)

const mobileBottomNavIndicatorVariants = cva(
  [
    "absolute left-1/2 top-1.5 -translate-x-1/2 rounded-full px-4 py-3.5",
    "transition-colors duration-150",
    "group-data-[state=active]:bg-nav-indicator",
  ]
)

const mobileBottomNavLabelVariants = cva(
  "text-2xs leading-none transition-colors font-medium group-data-[state=active]:font-semibold"
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

function MobileBottomNavIndicator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="mobile-bottom-nav-indicator"
      aria-hidden="true"
      className={cn(mobileBottomNavIndicatorVariants(), className)}
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
  MobileBottomNavIndicator,
  MobileBottomNavLabel,
}

