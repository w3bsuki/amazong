"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    Warning,
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
        } catch (error: any) {
            console.error('Error changing password:', error)
            toast.error(error.message || (locale === 'bg' ? 'Грешка при промяна на паролата' : 'Error changing password'))
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
        } catch (error: any) {
            console.error('Error changing email:', error)
            toast.error(error.message || (locale === 'bg' ? 'Грешка при промяна на имейла' : 'Error changing email'))
        } finally {
            setIsLoading(false)
        }
    }

    const handleResetPassword = async () => {
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
        } catch (error: any) {
            console.error('Error sending reset email:', error)
            toast.error(error.message || (locale === 'bg' ? 'Грешка при изпращане на имейл' : 'Error sending email'))
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
        
        if (score <= 2) return { label: locale === 'bg' ? 'Слаба' : 'Weak', color: 'text-red-500', width: 'w-1/4' }
        if (score === 3) return { label: locale === 'bg' ? 'Средна' : 'Fair', color: 'text-yellow-500', width: 'w-2/4' }
        if (score === 4) return { label: locale === 'bg' ? 'Добра' : 'Good', color: 'text-blue-500', width: 'w-3/4' }
        return { label: locale === 'bg' ? 'Силна' : 'Strong', color: 'text-green-500', width: 'w-full' }
    }

    // Get password validation errors for display
    const passwordErrors = passwordData.newPassword.length > 0 
        ? validatePassword(passwordData.newPassword, locale).errors 
        : []

    const passwordStrength = getPasswordStrength(passwordData.newPassword)
    
    // Check if password meets minimum requirements for submit button
    const isPasswordValid = validatePassword(passwordData.newPassword, locale).valid

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">
                    {locale === 'bg' ? 'Вход и сигурност' : 'Login & Security'}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {locale === 'bg' 
                        ? 'Управлявайте настройките за сигурност на акаунта си'
                        : 'Manage your account security settings'}
                </p>
            </div>

            <div className="space-y-4">
                {/* Email Section */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Envelope className="size-5 text-muted-foreground" />
                            {locale === 'bg' ? 'Имейл адрес' : 'Email Address'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{userEmail}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <CheckCircle className="size-4 text-green-500" weight="fill" />
                                    {locale === 'bg' ? 'Потвърден' : 'Verified'}
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => setIsChangeEmailOpen(true)}>
                                {locale === 'bg' ? 'Промени' : 'Change'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Password Section */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Key className="size-5 text-muted-foreground" />
                            {locale === 'bg' ? 'Парола' : 'Password'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">••••••••••</p>
                                <p className="text-sm text-muted-foreground">
                                    {locale === 'bg' ? 'Последно променена: неизвестно' : 'Last changed: unknown'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleResetPassword} disabled={isLoading}>
                                    {locale === 'bg' ? 'Нулирай' : 'Reset'}
                                </Button>
                                <Button onClick={() => setIsChangePasswordOpen(true)}>
                                    {locale === 'bg' ? 'Промени' : 'Change'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Two-Factor Authentication */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <DeviceMobile className="size-5 text-muted-foreground" />
                            {locale === 'bg' ? 'Двуфакторна автентикация' : 'Two-Factor Authentication'}
                        </CardTitle>
                        <CardDescription>
                            {locale === 'bg' 
                                ? 'Добавете допълнителен слой сигурност към акаунта си'
                                : 'Add an extra layer of security to your account'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Warning className="size-4" />
                                <span className="text-sm">
                                    {locale === 'bg' ? 'Не е активирана' : 'Not enabled'}
                                </span>
                            </div>
                            <Button variant="outline" disabled>
                                {locale === 'bg' ? 'Скоро' : 'Coming Soon'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Tips */}
                <Card className="bg-muted/50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="size-5 text-primary" weight="fill" />
                            {locale === 'bg' ? 'Съвети за сигурност' : 'Security Tips'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                                {locale === 'bg' 
                                    ? 'Използвайте уникална парола за този акаунт'
                                    : 'Use a unique password for this account'}
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                                {locale === 'bg' 
                                    ? 'Никога не споделяйте паролата си с никого'
                                    : 'Never share your password with anyone'}
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                                {locale === 'bg' 
                                    ? 'Проверявайте редовно историята на входовете си'
                                    : 'Regularly review your login history'}
                            </li>
                        </ul>
                    </CardContent>
                </Card>
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
                                <ul className="text-xs text-red-500 space-y-0.5 mt-1">
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
                                <p className="text-xs text-red-500">
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
