'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'ui-switch peer focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-(--switch-h) w-8 shrink-0 items-center rounded-full border border-transparent outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={
          'ui-switch-thumb bg-background pointer-events-none block size-4 rounded-full ring-0'
        }
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
