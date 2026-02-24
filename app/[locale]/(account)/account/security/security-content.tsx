"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CircleCheck as CheckCircle, Smartphone as DeviceMobile, Mail as Envelope, Eye, EyeOff as EyeSlash, Key, Shield, LoaderCircle as SpinnerGap } from "lucide-react";

import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { validatePassword, validateEmail } from "@/lib/validation/auth"
import { logger } from "@/lib/logger"

interface SecurityContentProps {
    locale: string
    userEmail: string
}

type SecurityCopy = {
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

type PasswordStrength = {
    label: string
    color: "text-destructive" | "text-warning" | "text-info" | "text-success"
    width: "w-1/4" | "w-2/4" | "w-3/4" | "w-full"
}

function getPasswordStrength(password: string, copy: SecurityCopy): PasswordStrength | null {
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

export function SecurityContent({ locale, userEmail }: SecurityContentProps) {
    const tAuth = useTranslations("Auth")
    const copy = locale === "bg" ? SECURITY_COPY_BG : SECURITY_COPY_EN
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
    const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    
    const [emailData, setEmailData] = useState({
        newEmail: "",
    })

    const supabase = createClient()

    const handleChangePassword = async () => {
        // Validate password with Zod
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
                password: passwordData.newPassword
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
        // Validate email with Zod
        const emailValidation = validateEmail(emailData.newEmail)
        if (!emailValidation.valid) {
            toast.error(tAuth(emailValidation.error as never))
            return
        }

        setIsLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                email: emailData.newEmail
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

    // Get password validation errors for display
    const passwordErrors = passwordData.newPassword.length > 0 
        ? validatePassword(passwordData.newPassword).errors 
        : []

    const passwordStrength = getPasswordStrength(passwordData.newPassword, copy)
    
    // Check if password meets minimum requirements for submit button
    const isPasswordValid = validatePassword(passwordData.newPassword).valid

    return (
        <div className="space-y-4">
            {/* Mobile: Clean list-based UI */}
            <div className="rounded-lg border bg-card divide-y">
                {/* Email Row */}
                <button
                    type="button"
                    onClick={() => setIsChangeEmailOpen(true)}
                    className="w-full rounded-lg flex items-center gap-3 p-3 text-left active:bg-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <Envelope className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{copy.emailLabel}</p>
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-success">
                        <CheckCircle className="size-3.5" />
                        <span className="hidden sm:inline">{copy.verified}</span>
                    </div>
                </button>

                {/* Password Row */}
                <button
                    type="button"
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="w-full rounded-lg flex items-center gap-3 p-3 text-left active:bg-active transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <Key className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{copy.passwordLabel}</p>
                        <p className="text-xs text-muted-foreground">••••••••</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {copy.change}
                    </span>
                </button>

                {/* 2FA Row */}
                <div className="flex items-center gap-3 p-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <DeviceMobile className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{copy.twoFactorLabel}</p>
                        <p className="text-xs text-muted-foreground">
                            {copy.twoFactorStatus}
                        </p>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs" disabled>
                        {copy.soon}
                    </Button>
                </div>
            </div>

            {/* Security Tips - Simplified */}
            <div className="rounded-lg border bg-surface-subtle p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="size-4 text-primary" />
                    <span className="text-sm font-medium">{copy.tips}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <CheckCircle className="size-3 text-success mt-0.5 shrink-0" />
                        {copy.uniquePasswordTip}
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="size-3 text-success mt-0.5 shrink-0" />
                        {copy.neverSharePasswordTip}
                    </li>
                </ul>
            </div>

            {/* Change Password Dialog */}
            <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{copy.changePasswordTitle}</DialogTitle>
                        <DialogDescription>{copy.changePasswordDescription}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="security-new-password">{copy.newPasswordLabel}</Label>
                            <div className="relative">
                                <Input 
                                    id="security-new-password"
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="••••••••"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    aria-label={showNewPassword
                                        ? copy.hidePassword
                                        : copy.showPassword}
                                >
                                    {showNewPassword ? <EyeSlash className="size-4" /> : <Eye className="size-4" />}
                                </Button>
                            </div>
                            {passwordStrength && (
                                <div className="space-y-1">
                                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                                        <div className={`h-full bg-current ${passwordStrength.color} ${passwordStrength.width} transition-all`} />
                                    </div>
                                    <p className={`text-xs ${passwordStrength.color}`}>
                                        {passwordStrength.label}
                                    </p>
                                </div>
                            )}
                            {passwordErrors.length > 0 && (
                                <ul className="text-xs text-destructive space-y-0.5 mt-1">
                                    {passwordErrors.map((error, i) => (
                                        <li key={i}>• {tAuth(error as never)}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="security-confirm-password">{copy.confirmPasswordLabel}</Label>
                            <Input 
                                id="security-confirm-password"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="••••••••"
                            />
                            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                                <p className="text-xs text-destructive">
                                    {tAuth("passwordsDoNotMatch")}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
                            {copy.cancel}
                        </Button>
                        <Button 
                            onClick={handleChangePassword} 
                            disabled={isLoading || passwordData.newPassword !== passwordData.confirmPassword || !isPasswordValid}
                        >
                            {isLoading && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                            {copy.changePasswordButton}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Change Email Dialog */}
            <Dialog open={isChangeEmailOpen} onOpenChange={setIsChangeEmailOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{copy.changeEmailTitle}</DialogTitle>
                        <DialogDescription>{copy.changeEmailDescription}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="security-current-email">{copy.currentEmailLabel}</Label>
                            <Input id="security-current-email" value={userEmail} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="security-new-email">{copy.newEmailLabel}</Label>
                            <Input 
                                id="security-new-email"
                                type="email"
                                value={emailData.newEmail}
                                onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                                placeholder="new@example.com"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsChangeEmailOpen(false)}>
                            {copy.cancel}
                        </Button>
                        <Button 
                            onClick={handleChangeEmail} 
                            disabled={isLoading || !validateEmail(emailData.newEmail).valid}
                        >
                            {isLoading && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                            {copy.changeEmailButton}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
