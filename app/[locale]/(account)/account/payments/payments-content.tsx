"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
    Plus, 
    CreditCard, 
    Trash, 
    Star,
    SpinnerGap,
    Shield,
    Lock
} from "@phosphor-icons/react"
import { toast } from "sonner"

interface PaymentMethod {
    id: string
    stripe_payment_method_id: string
    card_brand: string | null
    card_last4: string | null
    card_exp_month: number | null
    card_exp_year: number | null
    is_default: boolean
}

interface PaymentsContentProps {
    locale: string
    initialPaymentMethods: PaymentMethod[]
}

// Brand icons/colors - using semantic tokens
const cardBrandStyles: Record<string, { bg: string; text: string }> = {
    visa: { bg: 'bg-primary', text: 'text-primary-foreground' },
    mastercard: { bg: 'bg-primary', text: 'text-primary-foreground' },
    amex: { bg: 'bg-primary', text: 'text-primary-foreground' },
    discover: { bg: 'bg-primary', text: 'text-primary-foreground' },
    default: { bg: 'bg-muted-foreground', text: 'text-background' }
}

export function PaymentsContent({ locale, initialPaymentMethods }: PaymentsContentProps) {
    const router = useRouter()
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [deletingMethodId, setDeletingMethodId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isAddingCard, setIsAddingCard] = useState(false)

    const handleAddCard = async () => {
        setIsAddingCard(true)
        try {
            // Create a Stripe setup session to add a new payment method
            const response = await fetch('/api/payments/setup', {
                method: 'POST',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create setup session')
            }

            // Redirect to Stripe's hosted payment method collection page
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error) {
            console.error('Error adding card:', error)
            toast.error(locale === 'bg' ? 'Грешка при добавяне на карта' : 'Error adding card')
        } finally {
            setIsAddingCard(false)
        }
    }

    const handleDelete = async () => {
        if (!deletingMethodId) return

        const method = paymentMethods.find(m => m.id === deletingMethodId)
        if (!method) return

        setIsLoading(true)
        try {
            // Call API to detach from Stripe and delete from DB
            const response = await fetch('/api/payments/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    paymentMethodId: method.stripe_payment_method_id,
                    dbId: method.id
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete payment method')
            }

            toast.success(locale === 'bg' ? 'Картата е премахната' : 'Card removed')
            setIsDeleteDialogOpen(false)
            setDeletingMethodId(null)
            
            // Update local state
            setPaymentMethods(prev => prev.filter(m => m.id !== deletingMethodId))
            router.refresh()
        } catch (error) {
            console.error('Error deleting payment method:', error)
            toast.error(locale === 'bg' ? 'Грешка при премахване' : 'Error removing card')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSetDefault = async (methodId: string) => {
        setIsLoading(true)
        try {
            const method = paymentMethods.find(m => m.id === methodId)
            if (!method) return

            // Update default in Stripe
            const response = await fetch('/api/payments/set-default', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    paymentMethodId: method.stripe_payment_method_id,
                    dbId: method.id
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to set default')
            }

            toast.success(locale === 'bg' ? 'Картата по подразбиране е променена' : 'Default card updated')
            
            // Update local state
            setPaymentMethods(prev => prev.map(m => ({
                ...m,
                is_default: m.id === methodId
            })))
            router.refresh()
        } catch (error) {
            console.error('Error setting default:', error)
            toast.error(locale === 'bg' ? 'Грешка при промяна' : 'Error updating')
        } finally {
            setIsLoading(false)
        }
    }

    const getCardBrandDisplay = (brand: string | null) => {
        if (!brand) return 'Card'
        return brand.charAt(0).toUpperCase() + brand.slice(1)
    }

    const getCardStyle = (brand: string | null) => {
        return cardBrandStyles[brand?.toLowerCase() || 'default'] || cardBrandStyles.default
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {locale === 'bg' ? 'Начини на плащане' : 'Payment Methods'}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {locale === 'bg' 
                            ? 'Управлявайте вашите запазени карти за бързо плащане'
                            : 'Manage your saved cards for faster checkout'}
                    </p>
                </div>
                <Button onClick={handleAddCard} disabled={isAddingCard} className="gap-2">
                    {isAddingCard ? (
                        <SpinnerGap className="size-4 animate-spin" />
                    ) : (
                        <Plus className="size-4" weight="bold" />
                    )}
                    {locale === 'bg' ? 'Добави карта' : 'Add Card'}
                </Button>
            </div>

            {/* Security Notice */}
            <Card className="bg-muted/50 border-muted">
                <CardContent className="flex items-start gap-3 pt-4">
                    <Shield className="size-5 text-primary shrink-0 mt-0.5" weight="fill" />
                    <div className="text-sm">
                        <p className="font-medium">
                            {locale === 'bg' ? 'Вашите данни са защитени' : 'Your data is secure'}
                        </p>
                        <p className="text-muted-foreground">
                            {locale === 'bg' 
                                ? 'Картите се обработват от Stripe. Ние никога не съхраняваме пълни номера на карти.'
                                : 'Cards are processed by Stripe. We never store full card numbers.'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {paymentMethods.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <CreditCard className="size-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                            {locale === 'bg' ? 'Нямате запазени карти' : 'No saved cards'}
                        </h3>
                        <p className="text-muted-foreground text-center mb-4 max-w-sm">
                            {locale === 'bg' 
                                ? 'Добавете карта за по-бързо и удобно плащане при поръчка'
                                : 'Add a card for faster and easier checkout'}
                        </p>
                        <Button onClick={handleAddCard} disabled={isAddingCard} variant="outline" className="gap-2">
                            {isAddingCard ? (
                                <SpinnerGap className="size-4 animate-spin" />
                            ) : (
                                <Plus className="size-4" />
                            )}
                            {locale === 'bg' ? 'Добави първата карта' : 'Add your first card'}
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {paymentMethods.map((method) => {
                        const style = getCardStyle(method.card_brand)
                        return (
                            <Card key={method.id} className={method.is_default ? 'border-primary' : ''}>
                                <CardContent className="flex items-center justify-between py-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-8 rounded flex items-center justify-center ${style.bg}`}>
                                            <CreditCard className={`size-5 ${style.text}`} weight="fill" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {getCardBrandDisplay(method.card_brand)} •••• {method.card_last4}
                                                </span>
                                                {method.is_default && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        <Star className="size-3 mr-1" weight="fill" />
                                                        {locale === 'bg' ? 'По подразбиране' : 'Default'}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {locale === 'bg' ? 'Изтича' : 'Expires'} {method.card_exp_month?.toString().padStart(2, '0')}/{method.card_exp_year?.toString().slice(-2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!method.is_default && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm"
                                                onClick={() => handleSetDefault(method.id)}
                                                disabled={isLoading}
                                            >
                                                {locale === 'bg' ? 'По подразбиране' : 'Set default'}
                                            </Button>
                                        )}
                                        <Button 
                                            variant="ghost" 
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => {
                                                setDeletingMethodId(method.id)
                                                setIsDeleteDialogOpen(true)
                                            }}
                                        >
                                            <Trash className="size-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}

                    {/* Add New Card Button */}
                    <Card 
                        className="border-dashed cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={handleAddCard}
                    >
                        <CardContent className="flex items-center justify-center py-6">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Plus className="size-5" />
                                <span className="font-medium">
                                    {locale === 'bg' ? 'Добави нова карта' : 'Add new card'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Additional Info */}
            <div className="mt-8 flex items-start gap-3 text-sm text-muted-foreground">
                <Lock className="size-4 mt-0.5 shrink-0" />
                <p>
                    {locale === 'bg' 
                        ? 'Вашите плащания се обработват сигурно от Stripe. За да научите повече, посетете нашата страница за поверителност.'
                        : 'Your payments are securely processed by Stripe. To learn more, visit our privacy page.'}
                </p>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {locale === 'bg' ? 'Премахване на карта' : 'Remove Card'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {locale === 'bg' 
                                ? 'Сигурни ли сте, че искате да премахнете тази карта? Ще трябва да я добавите отново, ако искате да я използвате за плащане.'
                                : 'Are you sure you want to remove this card? You will need to add it again if you want to use it for payments.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {locale === 'bg' ? 'Отказ' : 'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isLoading && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                            {locale === 'bg' ? 'Премахни' : 'Remove'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
