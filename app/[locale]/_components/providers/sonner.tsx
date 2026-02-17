'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { CircleCheck as CheckCircle, Info, CircleAlert as WarningCircle, CircleX as XCircle } from "lucide-react";


const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()
  const isMobile = useIsMobile()

  const resolvedTheme: NonNullable<ToasterProps['theme']> =
    theme === 'light' || theme === 'dark' ? theme : 'system'

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      // Position: top-center on mobile (avoid nav), bottom-right on desktop
      position={isMobile ? 'top-center' : 'bottom-right'}
      // Duration: 3s default, can be overridden per toast
      duration={3000}
      // Stack limit: max 3 visible
      visibleToasts={3}
      // Close button for all toasts
      closeButton
      // Gap between toasts
      gap={8}
      // Offset from edges
      offset={isMobile ? 16 : 24}
      // Custom icons
      icons={{
        success: (
          <CheckCircle className="size-5 text-success" />
        ),
        error: <XCircle className="size-5 text-destructive" />,
        warning: (
          <WarningCircle className="size-5 text-warning" />
        ),
        info: <Info className="size-5 text-info" />,
      }}
      // Toast options
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:!bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-dropdown group-[.toaster]:rounded-2xl',
          title: 'group-[.toast]:text-foreground group-[.toast]:font-medium',
          description:
            'group-[.toast]:text-muted-foreground group-[.toast]:text-sm',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-medium group-[.toast]:text-sm',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:font-medium group-[.toast]:text-sm',
          closeButton:
            'group-[.toast]:bg-transparent group-[.toast]:text-muted-foreground group-[.toast]:hover:text-foreground group-[.toast]:border-none',
          success:
            'group-[.toaster]:border-badge-success-subtle-bg group-[.toaster]:bg-badge-success-subtle-bg',
          error:
            'group-[.toaster]:border-badge-critical-subtle-bg group-[.toaster]:bg-badge-critical-subtle-bg',
          warning:
            'group-[.toaster]:border-badge-warning-subtle-bg group-[.toaster]:bg-badge-warning-subtle-bg',
          info:
            'group-[.toaster]:border-badge-info-subtle-bg group-[.toaster]:bg-badge-info-subtle-bg',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
