import { Check, CircleCheck as CheckCircle, Eye, EyeOff as EyeSlash, LoaderCircle as SpinnerGap, X } from "lucide-react"
import type { useTranslations } from "next-intl"

import { Field, FieldContent, FieldError, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type AuthTranslator = ReturnType<typeof useTranslations>

type FieldErrors = Record<string, string> | undefined

type PasswordRequirement = {
  label: string
  met: boolean
}

type StrengthUi = {
  color: string
  width: string
}

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

export function SignUpNameField({
  t,
  fieldErrors,
  invalidInputClass,
  onChange,
}: {
  t: AuthTranslator
  fieldErrors: FieldErrors
  invalidInputClass: string
  onChange: (value: string) => void
}) {
  return (
    <Field data-invalid={Boolean(fieldErrors?.name)}>
      <FieldContent>
        <FieldLabel htmlFor="name">{t("yourName")}</FieldLabel>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder={t("namePlaceholder")}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(fieldErrors?.name)}
          aria-describedby={fieldErrors?.name ? "name-error" : undefined}
          className={cn(fieldErrors?.name && invalidInputClass)}
        />
        <FieldError id="name-error">
          {fieldErrors?.name ? t(fieldErrors.name as never) : null}
        </FieldError>
      </FieldContent>
    </Field>
  )
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

export function SignUpEmailField({
  t,
  fieldErrors,
  invalidInputClass,
  onChange,
}: {
  t: AuthTranslator
  fieldErrors: FieldErrors
  invalidInputClass: string
  onChange: (value: string) => void
}) {
  return (
    <Field data-invalid={Boolean(fieldErrors?.email)}>
      <FieldContent>
        <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t("emailPlaceholder")}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(fieldErrors?.email)}
          aria-describedby={fieldErrors?.email ? "email-error" : undefined}
          className={cn(fieldErrors?.email && invalidInputClass)}
        />
        <FieldError id="email-error">
          {fieldErrors?.email ? t(fieldErrors.email as never) : null}
        </FieldError>
      </FieldContent>
    </Field>
  )
}

export function SignUpPasswordField({
  t,
  fieldErrors,
  invalidInputClass,
  password,
  showPassword,
  onTogglePassword,
  onChangePassword,
  strengthUi,
  strengthLabel,
  requirements,
}: {
  t: AuthTranslator
  fieldErrors: FieldErrors
  invalidInputClass: string
  password: string
  showPassword: boolean
  onTogglePassword: () => void
  onChangePassword: (value: string) => void
  strengthUi: StrengthUi
  strengthLabel: string
  requirements: PasswordRequirement[]
}) {
  return (
    <Field data-invalid={Boolean(fieldErrors?.password)}>
      <FieldContent>
        <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder={t("createPasswordPlaceholder")}
            value={password}
            onChange={(event) => onChangePassword(event.target.value)}
            aria-invalid={Boolean(fieldErrors?.password)}
            aria-describedby={fieldErrors?.password ? "password-error" : undefined}
            className={cn("pr-12", fieldErrors?.password && invalidInputClass)}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-0 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus-ring motion-reduce:transition-none"
            aria-label={showPassword ? t("hidePassword") : t("showPassword")}
            aria-controls="password"
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeSlash className="size-5" aria-hidden="true" />
            ) : (
              <Eye className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {password && (
          <div className="mt-1.5 space-y-1">
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-300 motion-reduce:transition-none ${strengthUi.color} ${strengthUi.width}`}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t("passwordStrength")}: {strengthLabel}
            </p>
          </div>
        )}

        {password && (
          <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
            {requirements.map((requirement) => (
              <div
                key={requirement.label}
                className={`flex items-center gap-1.5 text-xs transition-colors ${
                  requirement.met ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {requirement.met ? (
                  <Check className="size-3" aria-hidden="true" />
                ) : (
                  <X className="size-3" aria-hidden="true" />
                )}
                <span>{requirement.label}</span>
              </div>
            ))}
          </div>
        )}

        <FieldError id="password-error" className="mt-1">
          {fieldErrors?.password ? t(fieldErrors.password as never) : null}
        </FieldError>
      </FieldContent>
    </Field>
  )
}

export function SignUpConfirmPasswordField({
  t,
  fieldErrors,
  invalidInputClass,
  showConfirmPassword,
  onToggleConfirmPassword,
  onChangeConfirmPassword,
}: {
  t: AuthTranslator
  fieldErrors: FieldErrors
  invalidInputClass: string
  showConfirmPassword: boolean
  onToggleConfirmPassword: () => void
  onChangeConfirmPassword: (value: string) => void
}) {
  return (
    <Field data-invalid={Boolean(fieldErrors?.confirmPassword)}>
      <FieldContent>
        <FieldLabel htmlFor="confirmPassword">{t("confirmPassword")}</FieldLabel>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder={t("confirmPasswordPlaceholder")}
            onChange={(event) => onChangeConfirmPassword(event.target.value)}
            aria-invalid={Boolean(fieldErrors?.confirmPassword)}
            aria-describedby={fieldErrors?.confirmPassword ? "confirmPassword-error" : undefined}
            className={cn("pr-12", fieldErrors?.confirmPassword && invalidInputClass)}
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="absolute right-0 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus-ring motion-reduce:transition-none"
            aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
            aria-controls="confirmPassword"
            aria-pressed={showConfirmPassword}
          >
            {showConfirmPassword ? (
              <EyeSlash className="size-5" aria-hidden="true" />
            ) : (
              <Eye className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
        <FieldError id="confirmPassword-error">
          {fieldErrors?.confirmPassword ? t(fieldErrors.confirmPassword as never) : null}
        </FieldError>
      </FieldContent>
    </Field>
  )
}

