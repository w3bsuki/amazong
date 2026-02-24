export type SecurityCopy = {
  passwordChanged: string
  passwordChangeError: string
  emailConfirmationSent: string
  emailChangeError: string
  emailLabel: string
  passwordLabel: string
  verified: string
  change: string
  twoFactorLabel: string
  twoFactorStatus: string
  soon: string
  tips: string
  uniquePasswordTip: string
  neverSharePasswordTip: string
  changePasswordTitle: string
  changePasswordDescription: string
  newPasswordLabel: string
  hidePassword: string
  showPassword: string
  confirmPasswordLabel: string
  cancel: string
  changePasswordButton: string
  changeEmailTitle: string
  changeEmailDescription: string
  currentEmailLabel: string
  newEmailLabel: string
  changeEmailButton: string
  weak: string
  fair: string
  good: string
  strong: string
}

const SECURITY_COPY_EN: SecurityCopy = {
  passwordChanged: "Password changed successfully",
  passwordChangeError: "Error changing password",
  emailConfirmationSent: "A confirmation email has been sent to your new address",
  emailChangeError: "Error changing email",
  emailLabel: "Email",
  passwordLabel: "Password",
  verified: "Verified",
  change: "Change",
  twoFactorLabel: "2FA",
  twoFactorStatus: "Not enabled",
  soon: "Soon",
  tips: "Tips",
  uniquePasswordTip: "Use a unique password",
  neverSharePasswordTip: "Never share your password",
  changePasswordTitle: "Change Password",
  changePasswordDescription: "Enter your new password",
  newPasswordLabel: "New Password",
  hidePassword: "Hide password",
  showPassword: "Show password",
  confirmPasswordLabel: "Confirm Password",
  cancel: "Cancel",
  changePasswordButton: "Change Password",
  changeEmailTitle: "Change Email",
  changeEmailDescription: "Enter your new email address. You will receive a confirmation email.",
  currentEmailLabel: "Current Email",
  newEmailLabel: "New Email",
  changeEmailButton: "Change Email",
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
}

const SECURITY_COPY_BG: SecurityCopy = {
  passwordChanged: "Паролата е променена успешно",
  passwordChangeError: "Грешка при промяна на паролата",
  emailConfirmationSent: "Изпратен е имейл за потвърждение на новия адрес",
  emailChangeError: "Грешка при промяна на имейла",
  emailLabel: "Имейл",
  passwordLabel: "Парола",
  verified: "Потвърден",
  change: "Промени",
  twoFactorLabel: "2FA",
  twoFactorStatus: "Не е активирана",
  soon: "Скоро",
  tips: "Съвети",
  uniquePasswordTip: "Използвайте уникална парола",
  neverSharePasswordTip: "Никога не споделяйте паролата си",
  changePasswordTitle: "Промяна на паролата",
  changePasswordDescription: "Въведете новата си парола",
  newPasswordLabel: "Нова парола",
  hidePassword: "Скрий паролата",
  showPassword: "Покажи паролата",
  confirmPasswordLabel: "Потвърди паролата",
  cancel: "Отказ",
  changePasswordButton: "Промени паролата",
  changeEmailTitle: "Промяна на имейл",
  changeEmailDescription: "Въведете новия си имейл адрес. Ще получите имейл за потвърждение.",
  currentEmailLabel: "Текущ имейл",
  newEmailLabel: "Нов имейл",
  changeEmailButton: "Промени имейла",
  weak: "Слаба",
  fair: "Средна",
  good: "Добра",
  strong: "Силна",
}

export type PasswordStrength = {
  label: string
  color: "text-destructive" | "text-warning" | "text-info" | "text-success"
  width: "w-1/4" | "w-2/4" | "w-3/4" | "w-full"
}

export function getSecurityCopy(locale: string): SecurityCopy {
  return locale === "bg" ? SECURITY_COPY_BG : SECURITY_COPY_EN
}

export function getPasswordStrength(password: string, copy: SecurityCopy): PasswordStrength | null {
  if (password.length === 0) return null

  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[^a-zA-Z0-9]/.test(password)

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (hasLetter) score++
  if (hasNumber) score++
  if (hasSpecial) score++

  if (score <= 2) return { label: copy.weak, color: "text-destructive", width: "w-1/4" }
  if (score === 3) return { label: copy.fair, color: "text-warning", width: "w-2/4" }
  if (score === 4) return { label: copy.good, color: "text-info", width: "w-3/4" }
  return { label: copy.strong, color: "text-success", width: "w-full" }
}
