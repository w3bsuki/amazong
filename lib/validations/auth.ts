import { z } from "zod"
export { getPasswordStrength } from "./password-strength"
 
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
  // zod's email() can accept short domains like "a@b"; for our UX/tests we
  // require a dot in the domain part.
  .refine(
    (value) => {
      const at = value.lastIndexOf("@")
      if (at === -1) return false
      const domain = value.slice(at + 1)
      return domain.includes(".")
    },
    { message: "Please enter a valid email address" }
  )

// Username validation schema
const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters" })
  .max(30, { message: "Username must be less than 30 characters" })
  .regex(/^[a-z0-9]/, { message: "Username must start with a letter or number" })
  .regex(/^[a-z0-9_]+$/, { message: "Username can only contain lowercase letters, numbers, and underscores" })
  .refine((val) => !val.includes("__"), { message: "Username cannot have consecutive underscores" })
  .refine((val) => !val.endsWith("_"), { message: "Username cannot end with an underscore" })

// Reserved usernames
export const RESERVED_USERNAMES = [
  "admin", "administrator", "support", "help", "info", "contact",
  "treido", "store", "shop", "seller", "buyer", "user", "users",
  "account", "settings", "profile", "members", "member", "api",
  "auth", "login", "signup", "register", "logout", "signout",
  "home", "index", "about", "terms", "privacy", "legal",
  "search", "explore", "discover", "trending", "popular",
  "checkout", "cart", "order", "orders", "payment", "payments",
  "sell", "selling", "buy", "buying", "deals", "offers",
  "messages", "notifications", "inbox", "outbox",
  "test", "demo", "example", "null", "undefined", "root",
]

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(72, { message: "Password must be less than 72 characters" }),
})

type LoginFormData = z.infer<typeof loginSchema>

// Sign up schema with password strength requirements
// Note: accountType is now selected during onboarding, not signup
export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name must be less than 50 characters" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(30, { message: "Username must be less than 30 characters" })
      .regex(/^[a-z0-9]/, { message: "Username must start with a letter or number" })
      .regex(/^[a-z0-9_]+$/, { message: "Only lowercase letters, numbers, and underscores" })
      .refine((val) => !val.includes("__"), { message: "No consecutive underscores" })
      .refine((val) => !val.endsWith("_"), { message: "Cannot end with underscore" })
      .refine((val) => !RESERVED_USERNAMES.includes(val), { message: "This username is reserved" }),
    email: emailSchema,
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" })
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

type SignUpFormData = z.infer<typeof signUpSchema>
 
// Change password form schema
const changePasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Change email form schema
const changeEmailSchema = z.object({
  newEmail: emailSchema,
})

// Localized error messages
export function getLocalizedPasswordErrors(locale: string): {
  min: string
  letter: string
  number: string
  match: string
} {
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

export function getLocalizedEmailErrors(locale: string): {
  required: string
  invalid: string
} {
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
