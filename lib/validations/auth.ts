import { z } from "zod"

// Password validation schema with strength requirements
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, { message: "Email is required" })
  .email({ message: "Please enter a valid email address" })

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Sign up schema with password strength requirements
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name must be less than 50 characters" }),
    email: emailSchema,
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" })
      .max(72, { message: "Password must be less than 72 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type SignUpFormData = z.infer<typeof signUpSchema>

// Password strength utility
export function getPasswordStrength(password: string): {
  score: number
  label: "Weak" | "Fair" | "Good" | "Strong"
  color: string
  width: string
} {
  let score = 0

  if (password.length >= 6) score++
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) {
    return { score, label: "Weak", color: "bg-destructive", width: "w-1/4" }
  }
  if (score <= 4) {
    return { score, label: "Fair", color: "bg-amber-500", width: "w-2/4" }
  }
  if (score <= 5) {
    return { score, label: "Good", color: "bg-emerald-500", width: "w-3/4" }
  }
  return { score, label: "Strong", color: "bg-emerald-600", width: "w-full" }
}

// Change password form schema
export const changePasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Change email form schema
export const changeEmailSchema = z.object({
  newEmail: emailSchema,
})

// Localized error messages
export function getLocalizedPasswordErrors(locale: string): Record<string, string> {
  if (locale === "bg") {
    return {
      min: "Паролата трябва да е поне 8 символа",
      letter: "Паролата трябва да съдържа поне една буква",
      number: "Паролата трябва да съдържа поне една цифра",
      match: "Паролите не съвпадат",
    }
  }
  return {
    min: "Password must be at least 8 characters",
    letter: "Password must contain at least one letter",
    number: "Password must contain at least one number",
    match: "Passwords do not match",
  }
}

export function getLocalizedEmailErrors(locale: string): Record<string, string> {
  if (locale === "bg") {
    return {
      required: "Имейлът е задължителен",
      invalid: "Моля, въведете валиден имейл адрес",
    }
  }
  return {
    required: "Email is required",
    invalid: "Please enter a valid email address",
  }
}

// Validate password and return localized errors
export function validatePassword(
  password: string,
  locale: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const messages = getLocalizedPasswordErrors(locale)

  if (password.length < 8) {
    errors.push(messages.min)
  }
  if (!/[a-zA-Z]/.test(password)) {
    errors.push(messages.letter)
  }
  if (!/[0-9]/.test(password)) {
    errors.push(messages.number)
  }

  return { valid: errors.length === 0, errors }
}

// Validate email and return localized error
export function validateEmail(
  email: string,
  locale: string
): { valid: boolean; error: string | null } {
  const messages = getLocalizedEmailErrors(locale)

  if (!email || email.trim().length === 0) {
    return { valid: false, error: messages.required }
  }

  const result = emailSchema.safeParse(email)
  if (!result.success) {
    return { valid: false, error: messages.invalid }
  }

  return { valid: true, error: null }
}
