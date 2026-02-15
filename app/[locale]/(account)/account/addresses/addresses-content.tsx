"use client"

import { useState, useMemo, type ChangeEvent } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
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
} from "@/lib/icons/phosphor"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { AccountAddressesStats } from "../_components/account-addresses-stats"
import { AccountAddressesGrid } from "../_components/account-addresses-grid"
import { USER_ADDRESSES_SELECT } from "./_lib/selects"
import { AddressFormFields } from "../../../_components/address-form"

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
    is_default: boolean | null
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

interface AddressesContentProps {
    initialAddresses: Address[]
}

export function AddressesContent({ initialAddresses }: AddressesContentProps) {
    const router = useRouter()
    const t = useTranslations("Account.addressesPage")
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

    const handleTextChange = (field: keyof AddressFormData) => (event: ChangeEvent<HTMLInputElement>) => {
        handleInputChange(field, event.target.value)
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
            is_default: address.is_default ?? false
        })
        setIsDialogOpen(true)
    }

    const handleSave = async () => {
        // Validation
        if (!formData.full_name.trim() || !formData.address_line1.trim() || 
            !formData.city.trim() || !formData.postal_code.trim()) {
            toast.error(t("toasts.requiredFields"))
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

                toast.success(t("toasts.updated"))
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

                toast.success(t("toasts.added"))
            }

            setIsDialogOpen(false)
            router.refresh()
            
            // Refetch addresses
            const { data } = await supabase
                .from('user_addresses')
                .select(USER_ADDRESSES_SELECT)
                .order('is_default', { ascending: false })
                .order('created_at', { ascending: false })
            
            if (data) setAddresses(data)
        } catch (error) {
            console.error('Error saving address:', error)
            toast.error(t("toasts.saveError"))
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

            toast.success(t("toasts.deleted"))
            setIsDeleteDialogOpen(false)
            setDeletingAddressId(null)
            router.refresh()
            
            // Refetch addresses
            const { data } = await supabase
                .from('user_addresses')
                .select(USER_ADDRESSES_SELECT)
                .order('is_default', { ascending: false })
                .order('created_at', { ascending: false })
            
            if (data) setAddresses(data)
        } catch (error) {
            console.error('Error deleting address:', error)
            toast.error(t("toasts.deleteError"))
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

            toast.success(t("toasts.defaultUpdated"))
            router.refresh()
            
            // Refetch addresses
            const { data } = await supabase
                .from('user_addresses')
                .select(USER_ADDRESSES_SELECT)
                .order('is_default', { ascending: false })
                .order('created_at', { ascending: false })
            
            if (data) setAddresses(data)
        } catch (error) {
            console.error('Error setting default:', error)
            toast.error(t("toasts.updateError"))
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

    const addressLabels = [
        { value: "Home", icon: House, label: t("labels.home") },
        { value: "Work", icon: Briefcase, label: t("labels.work") },
        { value: "Other", icon: Buildings, label: t("labels.other") },
    ]

    return (
        <div className="flex flex-col gap-4">
            {/* Mobile header with add button */}
            <div className="flex items-center justify-between sm:hidden">
                <AccountAddressesStats stats={stats} />
                <Button onClick={openAddDialog} size="sm" className="h-8 gap-1.5">
                    <Plus className="size-4" weight="bold" />
                    {t("actions.addAddress")}
                </Button>
            </div>

            {/* Desktop stats */}
            <div className="hidden sm:block">
                <AccountAddressesStats stats={stats} />
            </div>

            {/* Grid */}
            <AccountAddressesGrid
                addresses={addresses.map(addr => ({ ...addr, is_default: addr.is_default ?? false }))}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onAdd={openAddDialog}
                onSetDefault={handleSetDefault}
                isLoading={isLoading}
            />

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg max-h-dialog overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress 
                                ? t("dialog.editTitle")
                                : t("dialog.addTitle")}
                        </DialogTitle>
                        <DialogDescription>
                            {t("dialog.description")}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t("fields.label")}</Label>
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
                                <Label>{t("fields.country")}</Label>
                                <Select 
                                    value={formData.country} 
                                    onValueChange={(v) => handleInputChange('country', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bulgaria">{t("countries.bulgaria")}</SelectItem>
                                        <SelectItem value="Romania">{t("countries.romania")}</SelectItem>
                                        <SelectItem value="Greece">{t("countries.greece")}</SelectItem>
                                        <SelectItem value="Serbia">{t("countries.serbia")}</SelectItem>
                                        <SelectItem value="North Macedonia">{t("countries.northMacedonia")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t("fields.phone")}</Label>
                            <Input 
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="+359 88 888 8888"
                            />
                        </div>

                        <AddressFormFields
                            nameFields={[
                                {
                                    id: "full_name",
                                    label: (
                                        <>
                                            {t("fields.fullName")}{" "}
                                            <span className="text-destructive">*</span>
                                        </>
                                    ),
                                    placeholder: t("placeholders.fullName"),
                                    value: formData.full_name,
                                    onChange: handleTextChange('full_name'),
                                    required: true,
                                },
                            ]}
                            addressLine1={{
                                id: "address_line1",
                                label: (
                                    <>
                                        {t("fields.addressLine1")}{" "}
                                        <span className="text-destructive">*</span>
                                    </>
                                ),
                                placeholder: t("placeholders.addressLine1"),
                                value: formData.address_line1,
                                onChange: handleTextChange('address_line1'),
                                required: true,
                            }}
                            addressLine2={{
                                id: "address_line2",
                                label: t("fields.addressLine2"),
                                placeholder: t("placeholders.addressLine2"),
                                value: formData.address_line2,
                                onChange: handleTextChange('address_line2'),
                            }}
                            city={{
                                id: "city",
                                label: (
                                    <>
                                        {t("fields.city")}{" "}
                                        <span className="text-destructive">*</span>
                                    </>
                                ),
                                placeholder: t("placeholders.city"),
                                value: formData.city,
                                onChange: handleTextChange('city'),
                                required: true,
                            }}
                            state={{
                                id: "state",
                                label: t("fields.state"),
                                placeholder: t("placeholders.state"),
                                value: formData.state,
                                onChange: handleTextChange('state'),
                            }}
                            postalCode={{
                                id: "postal_code",
                                label: (
                                    <>
                                        {t("fields.postalCode")}{" "}
                                        <span className="text-destructive">*</span>
                                    </>
                                ),
                                placeholder: "1000",
                                value: formData.postal_code,
                                onChange: handleTextChange('postal_code'),
                                required: true,
                            }}
                        />

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_default"
                                checked={formData.is_default}
                                onChange={(e) => handleInputChange('is_default', e.target.checked)}
                                className="rounded border-border"
                            />
                            <Label htmlFor="is_default" className="font-normal cursor-pointer">
                                {t("fields.setDefault")}
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            {t("actions.cancel")}
                        </Button>
                        <Button onClick={handleSave} disabled={isLoading}>
                            {isLoading && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                            {editingAddress 
                                ? t("actions.save")
                                : t("actions.add")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t("deleteDialog.title")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("deleteDialog.description")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t("actions.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive"
                        >
                            {isLoading && <SpinnerGap className="size-4 mr-2 animate-spin" />}
                            {t("actions.delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
