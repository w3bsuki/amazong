import { Field, FieldContent, FieldError, FieldLabel } from "@/components/shared/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import type { AuthTranslator, FieldErrors } from "./sign-up-form-field-types"

interface SignUpIdentityFieldProps {
  t: AuthTranslator
  fieldErrors: FieldErrors
  invalidInputClass: string
  onChange: (value: string) => void
}

function SignUpIdentityInputField({
  t,
  fieldErrors,
  invalidInputClass,
  onChange,
  id,
  name,
  type,
  autoComplete,
  label,
  placeholder,
}: SignUpIdentityFieldProps & {
  id: string
  name: string
  type: string
  autoComplete: string
  label: string
  placeholder: string
}) {
  const error = fieldErrors?.[name]

  return (
    <Field data-invalid={Boolean(error)}>
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(error && invalidInputClass)}
        />
        <FieldError id={`${id}-error`}>{error ? t(error as never) : null}</FieldError>
      </FieldContent>
    </Field>
  )
}

export function SignUpNameField({
  t,
  fieldErrors,
  invalidInputClass,
  onChange,
}: SignUpIdentityFieldProps) {
  return (
    <SignUpIdentityInputField
      t={t}
      fieldErrors={fieldErrors}
      invalidInputClass={invalidInputClass}
      onChange={onChange}
      id="name"
      name="name"
      type="text"
      autoComplete="name"
      label={t("yourName")}
      placeholder={t("namePlaceholder")}
    />
  )
}

export function SignUpEmailField({
  t,
  fieldErrors,
  invalidInputClass,
  onChange,
}: SignUpIdentityFieldProps) {
  return (
    <SignUpIdentityInputField
      t={t}
      fieldErrors={fieldErrors}
      invalidInputClass={invalidInputClass}
      onChange={onChange}
      id="email"
      name="email"
      type="email"
      autoComplete="email"
      label={t("email")}
      placeholder={t("emailPlaceholder")}
    />
  )
}
