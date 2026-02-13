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
import { validatePassword, validateEmail } from "@/lib/validation/auth"

interface SecurityContentProps {
    locale: string
    userEmail: string
}

export function SecurityContent({ locale, userEmail }: SecurityContentProps) {
    const tAuth = useTranslations("Auth")
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

            toast.success(
                locale === 'bg' 
                    ? 'Изпратен е имейл за потвърждение на новия адрес' 
                    : 'A confirmation email has been sent to your new address'
            )
            setIsChangeEmailOpen(false)
            setEmailData({ newEmail: "" })
        } catch (error) {
            console.error('Error changing email:', error)
            const message = error instanceof Error ? error.message : (locale === 'bg' ? 'Грешка при промяна на имейла' : 'Error changing email')
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
        ? validatePassword(passwordData.newPassword).errors 
        : []

    const passwordStrength = getPasswordStrength(passwordData.newPassword)
    
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
                        <p className="text-sm font-medium">{locale === 'bg' ? 'Имейл' : 'Email'}</p>
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-success">
                        <CheckCircle className="size-3.5" weight="fill" />
                        <span className="hidden sm:inline">{locale === 'bg' ? 'Потвърден' : 'Verified'}</span>
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
                        <p className="text-sm font-medium">{locale === 'bg' ? 'Парола' : 'Password'}</p>
                        <p className="text-xs text-muted-foreground">••••••••</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {locale === 'bg' ? 'Промени' : 'Change'}
                    </span>
                </button>

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
            <div className="rounded-lg border bg-surface-subtle p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="size-4 text-primary" weight="fill" />
                    <span className="text-sm font-medium">{locale === 'bg' ? 'Съвети' : 'Tips'}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <CheckCircle className="size-3 text-success mt-0.5 shrink-0" />
                        {locale === 'bg' 
                            ? 'Използвайте уникална парола'
                            : 'Use a unique password'}
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="size-3 text-success mt-0.5 shrink-0" />
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
                            <Label htmlFor="security-new-password">{locale === 'bg' ? 'Нова парола' : 'New Password'}</Label>
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
                                        ? (locale === "bg" ? "Скрий паролата" : "Hide password")
                                        : (locale === "bg" ? "Покажи паролата" : "Show password")}
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
                            <Label htmlFor="security-confirm-password">{locale === 'bg' ? 'Потвърди паролата' : 'Confirm Password'}</Label>
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
                            <Label htmlFor="security-current-email">{locale === 'bg' ? 'Текущ имейл' : 'Current Email'}</Label>
                            <Input id="security-current-email" value={userEmail} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="security-new-email">{locale === 'bg' ? 'Нов имейл' : 'New Email'}</Label>
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
                            {locale === 'bg' ? 'Отказ' : 'Cancel'}
                        </Button>
                        <Button 
                            onClick={handleChangeEmail} 
                            disabled={isLoading || !validateEmail(emailData.newEmail).valid}
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
