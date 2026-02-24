import { Check, Eye, EyeOff as EyeSlash, X } from "lucide-react"

import { Field, FieldContent, FieldError, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import type {
  AuthTranslator,
  FieldErrors,
  PasswordRequirement,
  StrengthUi,
} from "./sign-up-form-field-types"

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
