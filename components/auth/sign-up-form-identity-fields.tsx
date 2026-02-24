import { Field, FieldContent, FieldError, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import type { AuthTranslator, FieldErrors } from "./sign-up-form-field-types"

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
