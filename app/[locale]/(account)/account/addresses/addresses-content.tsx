"use client"

import { useState, useMemo, type ChangeEvent } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/routing"
import { Briefcase, Building2 as Buildings, House, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { AccountAddressesStats } from "../_components/account-addresses-stats"
import { AccountAddressesGrid } from "../_components/account-addresses-grid"
import { USER_ADDRESSES_SELECT } from "./_lib/selects"

import { AddressEditorDialog } from "./_components/address-editor-dialog"
import { DeleteAddressDialog } from "./_components/delete-address-dialog"
import type { Address, AddressFormData, AddressLabelOption } from "./_lib/addresses-content.types"

import { logger } from "@/lib/logger"
interface AddressesContentProps {
  initialAddresses: Address[]
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
  is_default: false,
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

  const getAddressMutationPayload = (data: AddressFormData) => ({
    label: data.label,
    full_name: data.full_name,
    phone: data.phone || null,
    address_line1: data.address_line1,
    address_line2: data.address_line2 || null,
    city: data.city,
    state: data.state || null,
    postal_code: data.postal_code,
    country: data.country,
    is_default: data.is_default,
  })

  const refetchAddresses = async () => {
    const { data } = await supabase
      .from("user_addresses")
      .select(USER_ADDRESSES_SELECT)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })

    if (data) setAddresses(data)
  }

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTextChange =
    (field: keyof AddressFormData) => (event: ChangeEvent<HTMLInputElement>) => {
      handleInputChange(field, event.target.value)
    }

  const openAddDialog = () => {
    setEditingAddress(null)
    setFormData({
      ...emptyFormData,
      is_default: addresses.length === 0, // First address is default
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
      is_default: address.is_default ?? false,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    // Validation
    if (
      !formData.full_name.trim() ||
      !formData.address_line1.trim() ||
      !formData.city.trim() ||
      !formData.postal_code.trim()
    ) {
      toast.error(t("toasts.requiredFields"))
      return
    }

    setIsLoading(true)
    try {
      if (editingAddress) {
        // Update existing
        const { error } = await supabase
          .from("user_addresses")
          .update(getAddressMutationPayload(formData))
          .eq("id", editingAddress.id)

        if (error) throw error

        toast.success(t("toasts.updated"))
      } else {
        // Create new
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        const { error } = await supabase.from("user_addresses").insert({
          user_id: user.id,
          ...getAddressMutationPayload(formData),
        })

        if (error) throw error

        toast.success(t("toasts.added"))
      }

      setIsDialogOpen(false)
      router.refresh()

      // Refetch addresses
      await refetchAddresses()
    } catch (error) {
      logger.error("[account-addresses] save_address_failed", error)
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
        .from("user_addresses")
        .delete()
        .eq("id", deletingAddressId)

      if (error) throw error

      toast.success(t("toasts.deleted"))
      setIsDeleteDialogOpen(false)
      setDeletingAddressId(null)
      router.refresh()

      // Refetch addresses
      await refetchAddresses()
    } catch (error) {
      logger.error("[account-addresses] delete_address_failed", error)
      toast.error(t("toasts.deleteError"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetDefault = async (addressId: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", addressId)

      if (error) throw error

      toast.success(t("toasts.defaultUpdated"))
      router.refresh()

      // Refetch addresses
      await refetchAddresses()
    } catch (error) {
      logger.error("[account-addresses] set_default_failed", error)
      toast.error(t("toasts.updateError"))
    } finally {
      setIsLoading(false)
    }
  }

  // Compute stats
  const stats = useMemo(() => {
    const total = addresses.length
    const defaultCount = addresses.filter((a) => a.is_default).length
    const homeCount = addresses.filter((a) => a.label.toLowerCase() === "home" || a.label.toLowerCase() === "дом").length
    const workCount = addresses.filter((a) => a.label.toLowerCase() === "work" || a.label.toLowerCase() === "работа").length
    return { total, defaultCount, homeCount, workCount }
  }, [addresses])

  const handleDeleteClick = (addressId: string) => {
    setDeletingAddressId(addressId)
    setIsDeleteDialogOpen(true)
  }

  const addressLabels: AddressLabelOption[] = [
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
          <Plus className="size-4" />
          {t("actions.addAddress")}
        </Button>
      </div>

      {/* Desktop stats */}
      <div className="hidden sm:block">
        <AccountAddressesStats stats={stats} />
      </div>

      {/* Grid */}
      <AccountAddressesGrid
        addresses={addresses.map((addr) => ({ ...addr, is_default: addr.is_default ?? false }))}
        onEdit={openEditDialog}
        onDelete={handleDeleteClick}
        onAdd={openAddDialog}
        onSetDefault={handleSetDefault}
        isLoading={isLoading}
      />

      <AddressEditorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingAddress={editingAddress}
        formData={formData}
        addressLabels={addressLabels}
        isLoading={isLoading}
        handleInputChange={handleInputChange}
        handleTextChange={handleTextChange}
        handleSave={handleSave}
        t={t}
      />

      <DeleteAddressDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        isLoading={isLoading}
        t={t}
      />
    </div>
  )
}
