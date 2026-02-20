import { z } from "zod"
import { createUsernameSchema, RESERVED_USERNAMES } from "./username"
export { getPasswordStrength, type PasswordStrengthLabelKey } from "./password-strength"
export { RESERVED_USERNAMES } from "./username"

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, { message: "errors.emailRequired" })
  .email({ message: "errors.emailInvalid" })
  // zod's email() can accept short domains like "a@b"; for our UX/tests we
  // require a dot in the domain part.
  .refine(
    (value) => {
      const at = value.lastIndexOf("@")
      if (at === -1) return false
      const domain = value.slice(at + 1)
      return domain.includes(".")
    },
    { message: "errors.emailInvalid" }
  )

export const passwordSchema = z
  .string()
  .min(1, { message: "errors.passwordRequired" })
  .min(8, { message: "errors.passwordMin" })
  .max(72, { message: "errors.passwordMax" })
  .regex(/[a-zA-Z]/, { message: "errors.passwordLetter" })
  .regex(/[0-9]/, { message: "errors.passwordNumber" })

// Username validation schema
const usernameSchema = createUsernameSchema({
  min: "errors.usernameMin",
  max: "errors.usernameMax",
  start: "errors.usernameStart",
  charset: "errors.usernameCharset",
  noConsecutiveUnderscores: "errors.usernameNoConsecutiveUnderscores",
  noTrailingUnderscore: "errors.usernameNoTrailingUnderscore",
})

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, { message: "errors.passwordRequired" })
    .min(8, { message: "errors.passwordMin" })
    .max(72, { message: "errors.passwordMax" }),
})

// Sign up schema with password strength requirements
// Note: accountType is now selected during onboarding, not signup
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "errors.nameRequired" })
      .min(2, { message: "errors.nameMin" })
      .max(50, { message: "errors.nameMax" }),
    username: usernameSchema.refine((val) => !RESERVED_USERNAMES.includes(val), {
      message: "errors.usernameReserved",
    }),
    email: emailSchema,
    password: z
      .string()
      .min(1, { message: "errors.passwordRequired" })
      .min(8, { message: "errors.passwordMin" })
      .max(72, { message: "errors.passwordMax" })
      .regex(/[A-Z]/, { message: "errors.passwordUppercase" })
      .regex(/[a-z]/, { message: "errors.passwordLowercase" })
      .regex(/[0-9]/, { message: "errors.passwordNumber" }),
    confirmPassword: z.string().min(1, { message: "errors.confirmPasswordRequired" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordsDoNotMatch",
    path: ["confirmPassword"],
  })

// Validate password and return message keys
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) errors.push("errors.passwordMin")
  if (!/[a-zA-Z]/.test(password)) errors.push("errors.passwordLetter")
  if (!/[0-9]/.test(password)) errors.push("errors.passwordNumber")

  return { valid: errors.length === 0, errors }
}

// Validate email and return message key
export function validateEmail(email: string): { valid: boolean; error: string | null } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: "errors.emailRequired" }
  }

  const result = emailSchema.safeParse(email)
  if (!result.success) {
    // Normalize any issue to the same UX message.
    return { valid: false, error: "errors.emailInvalid" }
  }

  return { valid: true, error: null }
}

