export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) errors.push("errors.passwordMin")
  if (!/[a-zA-Z]/.test(password)) errors.push("errors.passwordLetter")
  if (!/[0-9]/.test(password)) errors.push("errors.passwordNumber")

  return { valid: errors.length === 0, errors }
}

export function validateEmail(email: string): { valid: boolean; error: string | null } {
  const trimmed = email.trim()
  if (trimmed.length === 0) {
    return { valid: false, error: "errors.emailRequired" }
  }

  // Keep behavior aligned with `emailSchema` in `auth.ts`:
  // - must be a valid email format
  // - must contain a dot in the domain part
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { valid: false, error: "errors.emailInvalid" }
  }

  const at = trimmed.lastIndexOf("@")
  if (at === -1) {
    return { valid: false, error: "errors.emailInvalid" }
  }

  const domain = trimmed.slice(at + 1)
  if (!domain.includes(".")) {
    return { valid: false, error: "errors.emailInvalid" }
  }

  return { valid: true, error: null }
}

