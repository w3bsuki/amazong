export type PasswordStrengthLabelKey =
  | "strengthWeak"
  | "strengthFair"
  | "strengthGood"
  | "strengthStrong"

export function getPasswordStrength(password: string): {
  score: number
  labelKey: PasswordStrengthLabelKey
  color: string
  width: string
} {
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 10) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) {
    return { score, labelKey: "strengthWeak", color: "bg-destructive", width: "w-1/4" }
  }
  if (score <= 4) {
    return { score, labelKey: "strengthFair", color: "bg-status-warning", width: "w-2/4" }
  }
  if (score <= 5) {
    return { score, labelKey: "strengthGood", color: "bg-status-success/80", width: "w-3/4" }
  }
  return { score, labelKey: "strengthStrong", color: "bg-status-success", width: "w-full" }
}

