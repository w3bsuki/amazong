import React from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-card relative w-full rounded-xl dark:bg-transparent",
        "p-1.5 shadow-sm",
        "border",
        className
      )}
      {...props}
    />
  )
}

function Header({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-muted/50 relative mb-4 rounded-xl border p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function Plan({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mb-6 flex items-center justify-between", className)}
      {...props}
    />
  )
}

function Description({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-muted-foreground text-xs", className)} {...props} />
  )
}

function PlanName({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex items-center gap-2 text-sm font-medium [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function Badge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "border-foreground/20 text-foreground/80 rounded-full border px-2 py-0.5 text-xs",
        className
      )}
      {...props}
    />
  )
}

function Price({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("mb-3 flex items-end gap-1", className)} {...props} />
  )
}

function MainPrice({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-2xl font-bold tracking-tight", className)}
      {...props}
    />
  )
}

function Period({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-foreground/80 pb-0.5 text-sm", className)}
      {...props}
    />
  )
}

function OriginalPrice({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-muted-foreground mr-1 ml-auto text-base line-through",
        className
      )}
      {...props}
    />
  )
}

function Body({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-4 p-3", className)} {...props} />
}

function List({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("space-y-2", className)} {...props} />
}

function ListItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "text-muted-foreground flex items-start gap-2 text-xs",
        className
      )}
      {...props}
    />
  )
}

function Fee({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  )
}

export {
  Card,
  Header,
  Description,
  Plan,
  PlanName,
  Badge,
  Price,
  MainPrice,
  Period,
  OriginalPrice,
  Body,
  List,
  ListItem,
  Fee,
}
