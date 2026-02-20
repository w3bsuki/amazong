import { useFormStatus } from "react-dom"
import { LoaderCircle as SpinnerGap } from "lucide-react";


import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  label: string
  pendingLabel: string
  disabled?: boolean
  className?: string
}

export function SubmitButton({
  label,
  pendingLabel,
  disabled,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      size="lg"
      className={className ?? "w-full"}
      disabled={pending || disabled}
      aria-busy={pending}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <SpinnerGap
            aria-hidden="true"
            className="size-5 animate-spin motion-reduce:animate-none"
          />
          {pendingLabel}
        </span>
      ) : (
        label
      )}
    </Button>
  )
}
