"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const mobileBottomNavRootVariants = cva(
  "pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden"
)

const mobileBottomNavDockVariants = cva(
  "pointer-events-auto w-full rounded-none border-x-0 border-b-0 border-t border-border-subtle bg-surface-elevated px-1 pt-0 pb-safe shadow-none"
)

const mobileBottomNavListVariants = cva(
  "grid h-(--spacing-bottom-nav) grid-cols-5 items-center gap-0.5"
)

const mobileBottomNavItemVariants = cva(
  "group flex h-full min-h-(--control-default) w-full items-center justify-center rounded-xl px-1 tap-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated",
  {
    variants: {
      state: {
        active: "text-nav-active",
        inactive: "text-nav-inactive",
      },
      emphasis: {
        default: "",
        core: "text-primary",
      },
    },
    compoundVariants: [
      { emphasis: "core", state: "active", className: "text-primary" },
      { emphasis: "core", state: "inactive", className: "text-primary" },
    ],
    defaultVariants: {
      state: "inactive",
      emphasis: "default",
    },
  }
)

const mobileBottomNavCoreActionVariants = cva(
  "inline-flex size-(--control-compact) items-center justify-center rounded-full motion-safe:transition-colors motion-safe:duration-fast motion-safe:ease-(--ease-smooth)",
  {
    variants: {
      state: {
        active: "bg-primary text-primary-foreground",
        inactive:
          "bg-primary text-primary-foreground group-hover:bg-interactive-hover group-active:bg-interactive-hover",
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

export {
  MobileBottomNavRoot,
  MobileBottomNavDock,
  MobileBottomNavList,
  MobileBottomNavItem,
  MobileBottomNavCoreAction,
}
