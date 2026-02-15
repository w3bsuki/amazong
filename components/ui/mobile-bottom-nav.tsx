"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const mobileBottomNavRootVariants = cva(
  "pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden"
)

const mobileBottomNavDockVariants = cva(
  "pointer-events-auto w-full border-t border-border bg-surface-elevated px-2 pt-1.5 pb-safe"
)

const mobileBottomNavListVariants = cva(
  "grid h-(--spacing-bottom-nav) grid-cols-5 items-center"
)

const mobileBottomNavItemVariants = cva(
  "group relative flex h-full min-h-(--control-default) w-full flex-col items-center justify-center gap-0.5 rounded-lg px-1 tap-transparent motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth) active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated",
  {
    variants: {
      state: {
        active: "text-primary",
        inactive: "text-nav-inactive hover:text-foreground",
      },
      emphasis: {
        default: "",
        core: "",
      },
    },
    defaultVariants: {
      state: "inactive",
      emphasis: "default",
    },
  }
)

const mobileBottomNavCoreActionVariants = cva(
  "inline-flex size-(--control-default) items-center justify-center rounded-full shadow-sm motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)",
  {
    variants: {
      state: {
        active: "bg-primary text-primary-foreground",
        inactive: "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  }
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
      className={cn(mobileBottomNavItemVariants({ state, emphasis }), className)}
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
  state,
  asChild = false,
  ...props
}: MobileBottomNavCoreActionProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="mobile-bottom-nav-core-action"
      className={cn(mobileBottomNavCoreActionVariants({ state }), className)}
      {...props}
    />
  )
}

const mobileBottomNavLabelVariants = cva(
  "w-full truncate text-center text-2xs font-medium leading-none tracking-(--letter-spacing-wide) text-current select-none"
)

function MobileBottomNavLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="mobile-bottom-nav-label"
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
