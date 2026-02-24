import { CircleCheck as CheckCircle, LoaderCircle as SpinnerGap, X } from "lucide-react"

import { Field, FieldContent, FieldError, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import type { AuthTranslator, FieldErrors } from "./sign-up-form-field-types"

function UsernameAvailabilityIndicator({
  t,
  username,
  isCheckingUsername,
  usernameAvailable,
}: {
  t: AuthTranslator
  username: string
  isCheckingUsername: boolean
  usernameAvailable: boolean | null
}) {
  if (!username || username.trim().length < 3) return null

  if (isCheckingUsername) {
    return (
      <span
        data-testid="username-availability"
        role="status"
        aria-live="polite"
        aria-label={t("usernameAvailabilityChecking")}
      >
        <span className="sr-only">{t("usernameAvailabilityChecking")}</span>
        <SpinnerGap
          className="size-4 animate-spin text-muted-foreground motion-reduce:animate-none"
          aria-hidden="true"
        />
      </span>
    )
  }

  if (usernameAvailable === true) {
    return (
      <span
        data-testid="username-availability"
        role="status"
        aria-live="polite"
        aria-label={t("usernameAvailabilityAvailable")}
      >
        <span className="sr-only">{t("usernameAvailabilityAvailable")}</span>
        <CheckCircle className="size-4 text-success" aria-hidden="true" />
      </span>
    )
  }

  if (usernameAvailable === false) {
    return (
      <span
        data-testid="username-availability"
        role="status"
        aria-live="polite"
        aria-label={t("usernameAvailabilityUnavailable")}
      >
        <span className="sr-only">{t("usernameAvailabilityUnavailable")}</span>
        <X className="size-4 text-destructive" aria-hidden="true" />
      </span>
    )
  }

  return null
}

export function SignUpUsernameField({
  t,
  fieldErrors,
  invalidInputClass,
  username,
  onChange,
  isCheckingUsername,
  usernameAvailable,
}: {
  t: AuthTranslator
  fieldErrors: FieldErrors
  invalidInputClass: string
  username: string
  onChange: (value: string) => void
  isCheckingUsername: boolean
  usernameAvailable: boolean | null
}) {
  return (
    <Field data-invalid={Boolean(fieldErrors?.username)}>
      <FieldContent>
        <FieldLabel htmlFor="username">{t("username")}</FieldLabel>
        <div className="relative">
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(event) =>
              onChange(event.target.value.toLowerCase().replaceAll(/[^a-z0-9_]/g, ""))
            }
            autoComplete="username"
            required
            placeholder={t("usernamePlaceholder")}
            aria-invalid={Boolean(fieldErrors?.username)}
            aria-describedby={fieldErrors?.username ? "username-error" : undefined}
            className={cn("pr-10", fieldErrors?.username && invalidInputClass)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <UsernameAvailabilityIndicator
              t={t}
              username={username}
              isCheckingUsername={isCheckingUsername}
              usernameAvailable={usernameAvailable}
            />
          </div>
        </div>
        <FieldError id="username-error">
          {fieldErrors?.username ? t(fieldErrors.username as never) : null}
        </FieldError>
      </FieldContent>
    </Field>
  )
}
