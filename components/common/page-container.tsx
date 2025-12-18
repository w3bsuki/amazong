import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * PageContainer - Consistent max-width and padding wrapper for pages
 * 
 * Use this for full-page layouts that need consistent horizontal margins
 * and max-width constraints across desktop/mobile.
 */
function PageContainer({
  children,
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  /** 
   * Container size variant:
   * - "narrow": 768px max (forms, auth pages)
   * - "default": 1200px max (product pages, listings)
   * - "wide": 1400px max (dashboards)
   * - "full": no max-width
   */
  size?: "narrow" | "default" | "wide" | "full"
}) {
  return (
    <div
      data-slot="page-container"
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        {
          "max-w-3xl": size === "narrow",
          "max-w-6xl": size === "default",
          "max-w-7xl": size === "wide",
          "": size === "full",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * FormSection - Clean, minimal section wrapper for form pages
 * 
 * Provides consistent styling for form sections without excessive
 * shadows, gradients, or visual noise. Uses subtle border instead.
 */
function FormSection({
  children,
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="form-section"
      className={cn(
        "rounded-lg border border-border bg-card p-5 sm:p-6",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

/**
 * FormSectionHeader - Header for form sections with icon support
 */
function FormSectionHeader({
  children,
  className,
  icon: Icon,
  ...props
}: React.ComponentProps<"div"> & {
  icon?: React.ComponentType<{ className?: string; weight?: string }>
}) {
  return (
    <div
      data-slot="form-section-header"
      className={cn("flex items-start gap-3 mb-5", className)}
      {...props}
    >
      {Icon && (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" weight="duotone" />
        </div>
      )}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  )
}

/**
 * FormSectionTitle - Title text for form sections
 */
function FormSectionTitle({
  children,
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="form-section-title"
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    >
      {children}
    </h3>
  )
}

/**
 * FormSectionDescription - Description/helper text for form sections
 */
function FormSectionDescription({
  children,
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-section-description"
      className={cn("text-sm text-muted-foreground mt-0.5", className)}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * FormFieldGroup - Wrapper for grouping related form fields
 */
function FormFieldGroup({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="form-field-group"
      className={cn("space-y-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  PageContainer,
  FormSection,
  FormSectionHeader,
  FormSectionTitle,
  FormSectionDescription,
  FormFieldGroup,
}
