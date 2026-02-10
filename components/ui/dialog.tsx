'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { IconButton } from '@/components/ui/icon-button'

/**
 * Dialog Root - wraps Radix Dialog with optional scroll lock bypass
 *
 * Default to modal dialogs (focus trap + aria-hidden). For cases where
 * react-remove-scroll causes layout shifts, pass modal={false} explicitly.
 */
function Dialog({
  modal = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" modal={modal} {...props} />
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

interface DialogOverlayProps extends React.ComponentProps<typeof DialogPrimitive.Overlay> {
  /**
   * Blur intensity for the background overlay.
   * @default "sm" (matches original Dialog behavior)
   */
  blur?: DialogOverlayBlur
}

function DialogOverlay({
  className,
  blur = "none",
  ...props
}: DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-overlay-dark",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in data-[state=closed]:fade-out",
        "duration-200 ease-out",
        blurClasses[blur],
        className,
      )}
      {...props}
    />
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
  overlayBlur = 'none',
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
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in data-[state=closed]:fade-out",
          "data-[state=open]:zoom-in data-[state=closed]:zoom-out",
          "duration-200 ease-out",
          // Size & shape variants
          variant === 'fullWidth'
            ? 'max-h-dialog w-dialog rounded-2xl p-0 md:max-w-6xl lg:max-w-screen-xl'
            : 'max-w-dialog rounded-2xl p-3 sm:max-w-lg md:p-4',
          className,
        )}
        onCloseAutoFocus={onCloseAutoFocus}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close asChild>
            <IconButton
              aria-label={closeLabel ?? 'Close'}
              className={cn(
                'absolute top-4 right-4 z-10 transition-all duration-150',
                'bg-surface-subtle',
                'text-foreground hover:bg-hover active:bg-active',
              )}
            >
              <X className="size-5" />
            </IconButton>
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
