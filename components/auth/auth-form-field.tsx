import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AuthFormFieldProps {
  id: string
  name: string
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
  error?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  children?: React.ReactNode // For password toggle, icons, etc.
  className?: string
}

export function AuthFormField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  required,
  error,
  value,
  onChange,
  children,
  className,
}: AuthFormFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive/20",
            children && "pr-10", // Space for icons/buttons
            className
          )}
        />
        {children}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
