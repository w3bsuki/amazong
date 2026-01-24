import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

type SpinnerProps = Omit<React.ComponentProps<typeof Loader2>, "aria-label"> & {
  label: string
}

function Spinner({ className, label, ...props }: SpinnerProps) {
  return (
    <Loader2
      data-slot="spinner"
      role="status"
      aria-label={label}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
