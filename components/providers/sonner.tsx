'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { CheckCircle, WarningCircle, Info, XCircle } from '@phosphor-icons/react'

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
          <CheckCircle className="size-5 text-success" weight="fill" />
        ),
        error: <XCircle className="size-5 text-destructive" weight="fill" />,
        warning: (
          <WarningCircle className="size-5 text-warning" weight="fill" />
        ),
        info: <Info className="size-5 text-info" weight="fill" />,
      }}
      // Toast options
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:!bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-lg',
          title: 'group-[.toast]:text-foreground group-[.toast]:font-medium',
          description:
            'group-[.toast]:text-muted-foreground group-[.toast]:text-sm',
          actionButton:
            'group-[.toast]:bg-brand group-[.toast]:text-primary-foreground group-[.toast]:font-medium group-[.toast]:text-sm',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:font-medium group-[.toast]:text-sm',
          closeButton:
            'group-[.toast]:bg-transparent group-[.toast]:text-muted-foreground group-[.toast]:hover:text-foreground group-[.toast]:border-none',
          success:
            'group-[.toaster]:border-success/30 group-[.toaster]:bg-success/10',
          error:
            'group-[.toaster]:border-destructive/30 group-[.toaster]:bg-destructive/10',
          warning:
            'group-[.toaster]:border-warning/30 group-[.toaster]:bg-warning/10',
          info: 'group-[.toaster]:border-info/30 group-[.toaster]:bg-info/10',
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
