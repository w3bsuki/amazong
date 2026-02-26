"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { createClient } from "@/lib/supabase/client"
import { validateEmail, validatePassword } from "@/lib/validation/auth-client"

import { getPasswordStrength, getSecurityCopy } from "./security-content.copy"
import { SecurityContentOverview } from "./security-content-overview"

import { logger } from "@/lib/logger"
interface SecurityContentProps {
  locale: string
  userEmail: string
}

const SecurityChangePasswordDialog = dynamic(
  () => import("./security-change-password-dialog").then((mod) => mod.SecurityChangePasswordDialog),
  { ssr: false },
)

const SecurityChangeEmailDialog = dynamic(
  () => import("./security-change-email-dialog").then((mod) => mod.SecurityChangeEmailDialog),
  { ssr: false },
)

export function SecurityContent({ locale, userEmail }: SecurityContentProps) {
  const tAuth = useTranslations("Auth")
  const copy = getSecurityCopy(locale)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [emailData, setEmailData] = useState({
    newEmail: "",
  })

  const supabase = createClient()

  const handleChangePassword = async () => {
    const passwordValidation = validatePassword(passwordData.newPassword)
    if (!passwordValidation.valid) {
      toast.error(tAuth(passwordValidation.errors[0] as never))
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(tAuth("passwordsDoNotMatch"))
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) throw error

      toast.success(copy.passwordChanged)
      setIsChangePasswordOpen(false)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (error) {
      logger.error("[account-security] change_password_failed", error)
      const message = error instanceof Error ? error.message : copy.passwordChangeError
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeEmail = async () => {
    const emailValidation = validateEmail(emailData.newEmail)
    if (!emailValidation.valid) {
      toast.error(tAuth(emailValidation.error as never))
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        email: emailData.newEmail,
      })

      if (error) throw error

      toast.success(copy.emailConfirmationSent)
      setIsChangeEmailOpen(false)
      setEmailData({ newEmail: "" })
    } catch (error) {
      logger.error("[account-security] change_email_failed", error)
      const message = error instanceof Error ? error.message : copy.emailChangeError
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const passwordErrors = passwordData.newPassword.length > 0
    ? validatePassword(passwordData.newPassword).errors
    : []

  const passwordStrength = getPasswordStrength(passwordData.newPassword, copy)
  const isPasswordValid = validatePassword(passwordData.newPassword).valid
  const isEmailValid = validateEmail(emailData.newEmail).valid

  return (
    <div className="space-y-4">
      <SecurityContentOverview
        copy={copy}
        userEmail={userEmail}
        onOpenEmail={() => setIsChangeEmailOpen(true)}
        onOpenPassword={() => setIsChangePasswordOpen(true)}
      />

      {isChangePasswordOpen ? (
        <SecurityChangePasswordDialog
          copy={copy}
          tAuth={(key) => tAuth(key as never)}
          open={isChangePasswordOpen}
          onOpenChange={setIsChangePasswordOpen}
          isLoading={isLoading}
          showNewPassword={showNewPassword}
          setShowNewPassword={setShowNewPassword}
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          passwordStrength={passwordStrength}
          passwordErrors={passwordErrors}
          isPasswordValid={isPasswordValid}
          onSubmit={handleChangePassword}
        />
      ) : null}

      {isChangeEmailOpen ? (
        <SecurityChangeEmailDialog
          copy={copy}
          userEmail={userEmail}
          open={isChangeEmailOpen}
          onOpenChange={setIsChangeEmailOpen}
          isLoading={isLoading}
          emailData={emailData}
          setEmailData={setEmailData}
          isEmailValid={isEmailValid}
          onSubmit={handleChangeEmail}
        />
      ) : null}
    </div>
  )
}
