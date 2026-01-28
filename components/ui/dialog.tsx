'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Dialog Root - wraps Radix Dialog with optional scroll lock bypass
 * 
 * By default, Radix Dialog's modal mode invokes react-remove-scroll, which
 * modifies body styles (position, padding) and can cause sticky header flash.
 * 
 * To prevent this, we use modal={false} and provide our own custom overlay
 * that prevents background scroll via `onWheel` + CSS (same pattern as Drawer).
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  // Use modal={false} to bypass react-remove-scroll
  // Our custom DialogOverlay handles scroll prevention manually
  return <DialogPrimitive.Root data-slot="dialog" modal={false} {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

/**
 * Blur intensity for dialog overlay
 * Uses design system backdrop-blur tokens:
 * - none: 0 (no blur)
 * - sm: 4px (subtle)
 * - md: 12px (standard modal blur) - DEFAULT
 * - lg: 16px (heavier)
 * - xl: 24px (maximum focus)
 */
type DialogOverlayBlur = "none" | "sm" | "md" | "lg" | "xl"

const blurClasses: Record<DialogOverlayBlur, string> = {
  none: "",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
}

interface DialogOverlayProps extends React.ComponentProps<"button"> {
  /**
   * Blur intensity for the background overlay.
   * @default "sm" (matches original Dialog behavior)
   */
  blur?: DialogOverlayBlur
}

/**
 * Custom Dialog Overlay - prevents scroll without react-remove-scroll
 * 
 * We intentionally do NOT use Radix's Overlay here (same pattern as Drawer).
 * Radix Dialog's overlay wraps in react-remove-scroll, which modifies body
 * styles and causes sticky header flash. Using our own overlay with manual
 * scroll prevention preserves sticky headers while keeping the dialog modal.
 */
function DialogOverlay({
  className,
  blur = "sm",
  ...props
}: DialogOverlayProps) {
  return (
    <DialogClose asChild>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        data-slot="dialog-overlay"
        className={cn(
          "fixed inset-0 z-50 bg-overlay-dark touch-none outline-none",
          blurClasses[blur],
          className,
        )}
        onWheel={(e) => {
          e.preventDefault()
        }}
        {...props}
      />
    </DialogClose>
  )
}

interface DialogContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean
  closeLabel?: string
  /** 'default' for standard dialogs, 'fullWidth' for large modals like quick view */
  variant?: 'default' | 'fullWidth'
  /**
   * Blur intensity for the background overlay.
   * @default "sm"
   */
  overlayBlur?: DialogOverlayBlur
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  closeLabel,
  variant = 'default',
  overlayBlur = 'sm',
  onCloseAutoFocus,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay blur={overlayBlur} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'bg-background fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-2 border shadow-modal outline-none',
          // Size & shape variants
          variant === 'fullWidth'
            ? 'max-h-dialog w-dialog rounded-xl p-0 md:max-w-6xl lg:max-w-screen-xl'
            : 'max-w-dialog rounded-lg p-3 sm:max-w-lg md:p-4',
          className,
        )}
        onCloseAutoFocus={onCloseAutoFocus}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className={cn(
              'absolute z-10 transition-all duration-150',
              // Position & size
              variant === 'fullWidth' ? 'top-3 right-3 size-10' : 'top-3 right-3 size-8',
              // Styling - visible background for accessibility
              'flex items-center justify-center rounded-full',
              'bg-surface-subtle backdrop-blur-sm',
              'text-foreground hover:bg-hover active:bg-active',
              // Focus ring
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              // Disabled state
              'disabled:pointer-events-none',
            )}
            aria-label={closeLabel ?? 'Close'}
          >
            <X className={variant === 'fullWidth' ? 'size-5' : 'size-4'} />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-medium', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
