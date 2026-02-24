import type { useTranslations } from "next-intl"

export type AuthTranslator = ReturnType<typeof useTranslations>
export type FieldErrors = Record<string, string> | undefined

export type PasswordRequirement = {
  label: string
  met: boolean
}

export type StrengthUi = {
  color: string
  width: string
}
