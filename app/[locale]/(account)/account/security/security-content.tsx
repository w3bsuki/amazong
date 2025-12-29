"use client"

import { useState } from "react"
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
import { 
    Envelope, 
    Key, 
    Shield,
    SpinnerGap,
    Eye,
    EyeSlash,
    CheckCircle,
    DeviceMobile
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { validatePassword, validateEmail } from "@/lib/validations/auth"

interface SecurityContentProps {
    locale: string
    userEmail: string
}

export function SecurityContent({ locale, userEmail }: SecurityContentProps) {
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
        password: ""
    })

    const supabase = createClient()

    const handleChangePassword = async () => {
        // Validate password with Zod
        const passwordValidation = validatePassword(passwordData.newPassword, locale)
        if (!passwordValidation.valid) {
            toast.error(passwordValidation.errors[0])
            return
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error(locale === 'bg' ? 'Паролите не съвпадат' : 'Passwords do not match')
            return
        }

        setIsLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            })

            if (error) throw error

            toast.success(locale === 'bg' ? 'Паролата е променена успешно' : 'Password changed successfully')
            setIsChangePasswordOpen(false)
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        } catch (error) {
            console.error('Error changing password:', error)
            const message = error instanceof Error ? error.message : (locale === 'bg' ? 'Грешка при промяна на паролата' : 'Error changing password')
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleChangeEmail = async () => {
        // Validate email with Zod
        const emailValidation = validateEmail(emailData.newEmail, locale)
        if (!emailValidation.valid) {
            toast.error(emailValidation.error!)
            return
        }

        setIsLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                email: emailData.newEmail
            })

            if (error) throw error

            toast.success(
                locale === 'bg' 
                    ? 'Изпратен е имейл за потвърждение на новия адрес' 
                    : 'A confirmation email has been sent to your new address'
            )
            setIsChangeEmailOpen(false)
            setEmailData({ newEmail: "", password: "" })
        } catch (error) {
            console.error('Error changing email:', error)
            const message = error instanceof Error ? error.message : (locale === 'bg' ? 'Грешка при промяна на имейла' : 'Error changing email')
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    // Reset password via email - can be exposed in UI later
    const _handleResetPassword = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
                redirectTo: `${window.location.origin}/auth/reset-password`
            })

            if (error) throw error

            toast.success(
                locale === 'bg' 
                    ? 'Изпратен е имейл с инструкции за нулиране на паролата' 
                    : 'Password reset email sent'
            )
        } catch (error) {
            console.error('Error sending reset email:', error)
            const message = error instanceof Error ? error.message : (locale === 'bg' ? 'Грешка при изпращане на имейл' : 'Error sending email')
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    // Password strength indicator - uses validation rules
    const getPasswordStrength = (password: string) => {
        if (password.length === 0) return null
        
        const hasLetter = /[a-zA-Z]/.test(password)
        const hasNumber = /[0-9]/.test(password)
        const hasSpecial = /[^a-zA-Z0-9]/.test(password)
        
        // Calculate strength based on criteria met
        let score = 0
        if (password.length >= 8) score++
        if (password.length >= 12) score++
        if (hasLetter) score++
        if (hasNumber) score++
        if (hasSpecial) score++
        
        if (score <= 2) return { label: locale === 'bg' ? 'Слаба' : 'Weak', color: 'text-destructive', width: 'w-1/4' }
        if (score === 3) return { label: locale === 'bg' ? 'Средна' : 'Fair', color: 'text-warning', width: 'w-2/4' }
        if (score === 4) return { label: locale === 'bg' ? 'Добра' : 'Good', color: 'text-info', width: 'w-3/4' }
        return { label: locale === 'bg' ? 'Силна' : 'Strong', color: 'text-success', width: 'w-full' }
    }

    // Get password validation errors for display
    const passwordErrors = passwordData.newPassword.length > 0 
        ? validatePassword(passwordData.newPassword, locale).errors 
        : []

    const passwordStrength = getPasswordStrength(passwordData.newPassword)
    
    // Check if password meets minimum requirements for submit button
    const isPasswordValid = validatePassword(passwordData.newPassword, locale).valid

    return (
        <div className="space-y-4">
            {/* Mobile: Clean list-based UI */}
            <div className="rounded-lg border bg-card divide-y">
                {/* Email Row */}
                <button
                    onClick={() => setIsChangeEmailOpen(true)}
                    className="w-full flex items-center gap-3 p-3 text-left active:bg-muted/50 transition-colors"
                >
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <Envelope className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{locale === 'bg' ? 'Имейл' : 'Email'}</p>
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="size-3.5" weight="fill" />
                        <span className="hidden sm:inline">{locale === 'bg' ? 'Потвърден' : 'Verified'}</span>
                    </div>
                </button>

                {/* Password Row */}
                <div
                    onClick={() => setIsChangePasswordOpen(true)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            setIsChangePasswordOpen(true)
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    className="w-full flex items-center gap-3 p-3 text-left active:bg-muted/50 transition-colors"
                >
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <Key className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{locale === 'bg' ? 'Парола' : 'Password'}</p>
                        <p className="text-xs text-muted-foreground">••••••••</p>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsChangePasswordOpen(true)
                        }}
                    >
                        {locale === 'bg' ? 'Промени' : 'Change'}
                    </Button>
                </div>

                {/* 2FA Row */}
                <div className="flex items-center gap-3 p-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                        <DeviceMobile className="size-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{locale === 'bg' ? '2FA' : '2FA'}</p>
                        <p className="text-xs text-muted-foreground">
                            {locale === 'bg' ? 'Не е активирана' : 'Not enabled'}
                        </p>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs" disabled>
                        {locale === 'bg' ? 'Скоро' : 'Soon'}
                    </Button>
                </div>
            </div>

            {/* Security Tips - Simplified */}
            <div className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="size-4 text-primary" weight="fill" />
                    <span className="text-sm font-medium">{locale === 'bg' ? 'Съвети' : 'Tips'}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <CheckCircle className="size-3 text-emerald-500 mt-0.5 shrink-0" />
                        {locale === 'bg' 
                            ? 'Използвайте уникална парола'
                            : 'Use a unique password'}
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="size-3 text-emerald-500 mt-0.5 shrink-0" />
                        {locale === 'bg' 
                            ? 'Никога не споделяйте паролата си'
                            : 'Never share your password'}
                    </li>
                </ul>
            </div>

            {/* Change Password Dialog */}
            <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {locale === 'bg' ? 'Промяна на паролата' : 'Change Password'}
                        </DialogTitle>
                        <DialogDescription>
                            {locale === 'bg' 
                                ? 'Въведете новата си парола'
                                : 'Enter your new password'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{locale === 'bg' ? 'Нова парола' : 'New Password'}</Label>
                            <div className="relative">
                                <Input 
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
                                        <li key={i}>• {error}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>{locale === 'bg' ? 'Потвърди паролата' : 'Confirm Password'}</Label>
                            <Input 
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="••••••••"
                            />
                            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                                <p className="text-xs text-destructive">
                                    {locale === 'bg' ? 'Паролите не съвпадат' : 'Passwords do not match'}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
                            {locale === 'bg' ? 'Отказ' : 'Cancel'}
                        </Button>
                        <Button 
                            onClick={handleChangePassword} 
                            disabled={isLoading || passwordData.newPassword !== passwordData.confirmPassword || !isPasswordValid}
                        >
                            {isLoading && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                            {locale === 'bg' ? 'Промени паролата' : 'Change Password'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Change Email Dialog */}
            <Dialog open={isChangeEmailOpen} onOpenChange={setIsChangeEmailOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {locale === 'bg' ? 'Промяна на имейл' : 'Change Email'}
                        </DialogTitle>
                        <DialogDescription>
                            {locale === 'bg' 
                                ? 'Въведете новия си имейл адрес. Ще получите имейл за потвърждение.'
                                : 'Enter your new email address. You will receive a confirmation email.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{locale === 'bg' ? 'Текущ имейл' : 'Current Email'}</Label>
                            <Input value={userEmail} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label>{locale === 'bg' ? 'Нов имейл' : 'New Email'}</Label>
                            <Input 
                                type="email"
                                value={emailData.newEmail}
                                onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                                placeholder="new@example.com"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsChangeEmailOpen(false)}>
                            {locale === 'bg' ? 'Отказ' : 'Cancel'}
                        </Button>
                        <Button 
                            onClick={handleChangeEmail} 
                            disabled={isLoading || !validateEmail(emailData.newEmail, locale).valid}
                        >
                            {isLoading && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                            {locale === 'bg' ? 'Промени имейла' : 'Change Email'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
