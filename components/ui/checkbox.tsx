import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // WCAG 2.2 AA: 20px (size-5) with label gap creates 24px+ touch target
        "peer size-5 shrink-0 rounded-xl border border-input bg-background text-primary-foreground outline-none transition-colors",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "focus-visible:ring-2 focus-visible:ring-focus-ring",
        "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive-subtle",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

