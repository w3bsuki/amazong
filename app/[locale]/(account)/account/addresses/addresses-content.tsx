"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    SpinnerGap,
    House,
    Briefcase,
    Buildings
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { AccountAddressesStats } from "@/components/account-addresses-stats"
import { AccountAddressesGrid } from "@/components/account-addresses-grid"

interface Address {
    id: string
    label: string
    full_name: string
    phone: string | null
    address_line1: string
    address_line2: string | null
    city: string
    state: string | null
    postal_code: string
    country: string
    is_default: boolean
    created_at: string
}

interface AddressFormData {
    label: string
    full_name: string
    phone: string
    address_line1: string
    address_line2: string
    city: string
    state: string
    postal_code: string
    country: string
    is_default: boolean
}

const emptyFormData: AddressFormData = {
    label: "Home",
    full_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Bulgaria",
    is_default: false
}

const addressLabels = [
    { value: "Home", icon: House, label: "Home" },
    { value: "Work", icon: Briefcase, label: "Work" },
    { value: "Other", icon: Buildings, label: "Other" },
]

interface AddressesContentProps {
    locale: string
    initialAddresses: Address[]
}

export function AddressesContent({ locale, initialAddresses }: AddressesContentProps) {
    const router = useRouter()
    const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)
    const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<AddressFormData>(emptyFormData)

    const supabase = createClient()

    const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const openAddDialog = () => {
        setEditingAddress(null)
        setFormData({
            ...emptyFormData,
            is_default: addresses.length === 0 // First address is default
        })
        setIsDialogOpen(true)
    }

    const openEditDialog = (address: Address) => {
        setEditingAddress(address)
        setFormData({
            label: address.label,
            full_name: address.full_name,
            phone: address.phone || "",
            address_line1: address.address_line1,
            address_line2: address.address_line2 || "",
            city: address.city,
            state: address.state || "",
            postal_code: address.postal_code,
            country: address.country,
            is_default: address.is_default
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        // Validation
        if (!formData.full_name.trim() || !formData.address_line1.trim() || 
            !formData.city.trim() || !formData.postal_code.trim()) {
            toast.error(locale === 'bg' ? 'Моля, попълнете всички задължителни полета' : 'Please fill in all required fields')
            return
        }

        setIsLoading(true)
        try {
            if (editingAddress) {
                // Update existing
                const { error } = await supabase
                    .from('user_addresses')
                    .update({
                        label: formData.label,
                        full_name: formData.full_name,
                        phone: formData.phone || null,
                        address_line1: formData.address_line1,
                        address_line2: formData.address_line2 || null,
                        city: formData.city,
                        state: formData.state || null,
                        postal_code: formData.postal_code,
                        country: formData.country,
                        is_default: formData.is_default
                    })
                    .eq('id', editingAddress.id)

                if (error) throw error

                toast.success(locale === 'bg' ? 'Адресът е обновен' : 'Address updated')
            } else {
                // Create new
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) throw new Error('Not authenticated')

                const { error } = await supabase
                    .from('user_addresses')
                    .insert({
                        user_id: user.id,
                        label: formData.label,
                        full_name: formData.full_name,
                        phone: formData.phone || null,
                        address_line1: formData.address_line1,
                        address_line2: formData.address_line2 || null,
                        city: formData.city,
                        state: formData.state || null,
                        postal_code: formData.postal_code,
                        country: formData.country,
                        is_default: formData.is_default
                    })

                if (error) throw error

                toast.success(locale === 'bg' ? 'Адресът е добавен' : 'Address added')
            }

            setIsDialogOpen(false)
            router.refresh()
            
            // Refetch addresses
            const { data } = await supabase
                .from('user_addresses')
                .select('*')
                .order('is_default', { ascending: false })
                .order('created_at', { ascending: false })
            
            if (data) setAddresses(data)
        } catch (error) {
            console.error('Error saving address:', error)
            toast.error(locale === 'bg' ? 'Грешка при запазване' : 'Error saving address')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!deletingAddressId) return

        setIsLoading(true)
        try {
            const { error } = await supabase
                .from('user_addresses')
                .delete()
                .eq('id', deletingAddressId)

            if (error) throw error

            toast.success(locale === 'bg' ? 'Адресът е изтрит' : 'Address deleted')
            setIsDeleteDialogOpen(false)
            setDeletingAddressId(null)
            router.refresh()
            
            // Refetch addresses
            const { data } = await supabase
                .from('user_addresses')
                .select('*')
                .order('is_default', { ascending: false })
                .order('created_at', { ascending: false })
            
            if (data) setAddresses(data)
        } catch (error) {
            console.error('Error deleting address:', error)
            toast.error(locale === 'bg' ? 'Грешка при изтриване' : 'Error deleting address')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSetDefault = async (addressId: string) => {
        setIsLoading(true)
        try {
            const { error } = await supabase
                .from('user_addresses')
                .update({ is_default: true })
                .eq('id', addressId)

            if (error) throw error

            toast.success(locale === 'bg' ? 'Адресът по подразбиране е променен' : 'Default address updated')
            router.refresh()
            
            // Refetch addresses
            const { data } = await supabase
                .from('user_addresses')
                .select('*')
                .order('is_default', { ascending: false })
                .order('created_at', { ascending: false })
            
            if (data) setAddresses(data)
        } catch (error) {
            console.error('Error setting default:', error)
            toast.error(locale === 'bg' ? 'Грешка при промяна' : 'Error updating')
        } finally {
            setIsLoading(false)
        }
    }

    // Compute stats
    const stats = useMemo(() => {
        const total = addresses.length
        const defaultCount = addresses.filter(a => a.is_default).length
        const homeCount = addresses.filter(a => a.label.toLowerCase() === 'home' || a.label.toLowerCase() === 'дом').length
        const workCount = addresses.filter(a => a.label.toLowerCase() === 'work' || a.label.toLowerCase() === 'работа').length
        return { total, defaultCount, homeCount, workCount }
    }, [addresses])

    const handleEdit = (address: Address) => {
        openEditDialog(address)
    }

    const handleDeleteClick = (addressId: string) => {
        setDeletingAddressId(addressId)
        setIsDeleteDialogOpen(true)
    }

    const t = {
        addAddress: locale === 'bg' ? 'Добави' : 'Add',
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Mobile header with add button */}
            <div className="flex items-center justify-between sm:hidden">
                <AccountAddressesStats stats={stats} locale={locale} />
                <Button onClick={openAddDialog} size="sm" className="h-8 gap-1.5">
                    <Plus className="size-4" weight="bold" />
                    {t.addAddress}
                </Button>
            </div>

            {/* Desktop stats */}
            <div className="hidden sm:block">
                <AccountAddressesStats stats={stats} locale={locale} />
            </div>

            {/* Grid */}
            <AccountAddressesGrid
                addresses={addresses}
                locale={locale}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onAdd={openAddDialog}
                onSetDefault={handleSetDefault}
                isLoading={isLoading}
            />

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress 
                                ? (locale === 'bg' ? 'Редактирай адрес' : 'Edit Address')
                                : (locale === 'bg' ? 'Добави нов адрес' : 'Add New Address')}
                        </DialogTitle>
                        <DialogDescription>
                            {locale === 'bg' 
                                ? 'Въведете детайлите на адреса за доставка'
                                : 'Enter the details for your delivery address'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{locale === 'bg' ? 'Етикет' : 'Label'}</Label>
                                <Select 
                                    value={formData.label} 
                                    onValueChange={(v) => handleInputChange('label', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {addressLabels.map((label) => (
                                            <SelectItem key={label.value} value={label.value}>
                                                <div className="flex items-center gap-2">
                                                    <label.icon className="size-4" />
                                                    {label.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === 'bg' ? 'Държава' : 'Country'}</Label>
                                <Select 
                                    value={formData.country} 
                                    onValueChange={(v) => handleInputChange('country', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                                        <SelectItem value="Romania">Romania</SelectItem>
                                        <SelectItem value="Greece">Greece</SelectItem>
                                        <SelectItem value="Serbia">Serbia</SelectItem>
                                        <SelectItem value="North Macedonia">North Macedonia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{locale === 'bg' ? 'Пълно име' : 'Full Name'} *</Label>
                            <Input 
                                value={formData.full_name}
                                onChange={(e) => handleInputChange('full_name', e.target.value)}
                                placeholder={locale === 'bg' ? 'Иван Иванов' : 'John Doe'}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{locale === 'bg' ? 'Телефон' : 'Phone'}</Label>
                            <Input 
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="+359 88 888 8888"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{locale === 'bg' ? 'Адрес' : 'Address Line 1'} *</Label>
                            <Input 
                                value={formData.address_line1}
                                onChange={(e) => handleInputChange('address_line1', e.target.value)}
                                placeholder={locale === 'bg' ? 'ул. Витоша 1' : 'Street address'}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{locale === 'bg' ? 'Адрес 2' : 'Address Line 2'}</Label>
                            <Input 
                                value={formData.address_line2}
                                onChange={(e) => handleInputChange('address_line2', e.target.value)}
                                placeholder={locale === 'bg' ? 'Апартамент, етаж и др.' : 'Apartment, floor, etc.'}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>{locale === 'bg' ? 'Град' : 'City'} *</Label>
                                <Input 
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    placeholder={locale === 'bg' ? 'София' : 'City'}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === 'bg' ? 'Област' : 'State'}</Label>
                                <Input 
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    placeholder={locale === 'bg' ? 'София-град' : 'State'}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{locale === 'bg' ? 'Пощ. код' : 'Postal Code'} *</Label>
                                <Input 
                                    value={formData.postal_code}
                                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                                    placeholder="1000"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_default"
                                checked={formData.is_default}
                                onChange={(e) => handleInputChange('is_default', e.target.checked)}
                                className="rounded border-border"
                            />
                            <Label htmlFor="is_default" className="font-normal cursor-pointer">
                                {locale === 'bg' ? 'Направи адрес по подразбиране' : 'Set as default address'}
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            {locale === 'bg' ? 'Отказ' : 'Cancel'}
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                            {editingAddress 
                                ? (locale === 'bg' ? 'Запази' : 'Save')
                                : (locale === 'bg' ? 'Добави' : 'Add')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {locale === 'bg' ? 'Изтриване на адрес' : 'Delete Address'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {locale === 'bg' 
                                ? 'Сигурни ли сте, че искате да изтриете този адрес? Това действие не може да бъде отменено.'
                                : 'Are you sure you want to delete this address? This action cannot be undone.'}
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
                            {locale === 'bg' ? 'Изтрий' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
