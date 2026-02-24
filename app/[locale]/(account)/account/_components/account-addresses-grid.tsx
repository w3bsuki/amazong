import { useState } from "react"
import { useTranslations } from "next-intl"
import { Briefcase, House, MapPin, Pencil, Phone, Plus, Star, Trash } from "lucide-react";


import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DrawerBody } from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import { DrawerShell } from "@/components/shared/drawer-shell"

type UserAddress = {
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

interface AccountAddressesGridProps {
  addresses: UserAddress[]
  onEdit: (address: UserAddress) => void
  onDelete: (addressId: string) => void
  onAdd: () => void
  onSetDefault: (addressId: string) => void
  isLoading?: boolean
}

function getAddressLabelIcon(label: string) {
  switch (label.toLowerCase()) {
    case "home":
    case "дом":
      return House
    case "work":
    case "работа":
      return Briefcase
    default:
      return MapPin
  }
}

function getAddressLabelColor(label: string) {
  switch (label.toLowerCase()) {
    case "home":
    case "дом":
      return "text-success"
    case "work":
    case "работа":
      return "text-info"
    default:
      return "text-muted-foreground"
  }
}

function formatAddressLines(address: UserAddress) {
  const parts = [address.address_line1]
  if (address.address_line2) parts.push(address.address_line2)
  const cityState = address.state ? `${address.city}, ${address.state}` : address.city
  parts.push(`${cityState} ${address.postal_code}`.trim())
  parts.push(address.country)
  return parts
}

export function AccountAddressesGrid({ 
  addresses, 
  onEdit, 
  onDelete, 
  onAdd,
  onSetDefault,
  isLoading 
}: AccountAddressesGridProps) {
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null)
  const t = useTranslations("Account.addressesPage.grid")

  // Empty state
  if (addresses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
            <MapPin className="size-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">{t("noAddresses")}</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            {t("noAddressesDescription")}
          </p>
          <Button onClick={onAdd} className="mt-6 gap-2">
            <Plus className="size-4" />
            {t("addFirst")}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Mobile card with Drawer
  const MobileAddressCard = ({ address }: { address: UserAddress }) => {
    const LabelIcon = getAddressLabelIcon(address.label)
    const isOpen = openDrawerId === address.id

    return (
      <>
        <button
          type="button"
          className="w-full rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => setOpenDrawerId(address.id)}
          aria-label={t("addressDetails")}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        >
          <Card className={`cursor-pointer transition-colors hover:bg-hover ${address.is_default ? 'border-selected-border ring-1 ring-border-subtle' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <LabelIcon className={`size-5 shrink-0 ${getAddressLabelColor(address.label)}`} />
                  <CardTitle className="text-base truncate">{address.label}</CardTitle>
                </div>
                {address.is_default && (
                  <Badge variant="secondary" className="shrink-0 text-xs bg-selected text-primary border-0">
                    <Star className="size-3 mr-1" />
                    {t("default")}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-medium text-sm">{address.full_name}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{address.address_line1}, {address.city}</p>
            </CardContent>
          </Card>
        </button>

        <DrawerShell
          open={isOpen}
          onOpenChange={(open) => setOpenDrawerId(open ? address.id : null)}
          title={address.label}
          closeLabel={t("close")}
          contentAriaLabel={t("addressDetails")}
          icon={<LabelIcon className={`size-5 ${getAddressLabelColor(address.label)}`} />}
          titleSuffix={
            address.is_default ? (
              <Badge variant="secondary" className="ml-2 text-xs bg-selected text-primary border-0">
                <Star className="size-3 mr-1" />
                {t("default")}
              </Badge>
            ) : null
          }
          description={t("addressDetails")}
          descriptionClassName="text-sm text-muted-foreground"
          headerClassName="border-border-subtle text-left"
          contentClassName="max-h-(--dialog-h-85vh)"
        >
          <DrawerBody className="px-4 py-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{t("deliveryAddress")}</p>
                <div className="space-y-1">
                  <p className="font-medium">{address.full_name}</p>
                  {formatAddressLines(address).map((line, i) => (
                    <p key={i} className="text-muted-foreground">{line}</p>
                  ))}
                </div>
              </div>
              {address.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{t("phone")}</p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    {address.phone}
                  </p>
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t("actions")}</p>
                <div className="flex flex-col gap-2">
                  {!address.is_default && (
                    <Button
                      variant="outline"
                      className="justify-start gap-2"
                      onClick={() => {
                        onSetDefault(address.id)
                        setOpenDrawerId(null)
                      }}
                      disabled={isLoading}
                    >
                      <Star className="size-4" />
                      {t("setDefault")}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => {
                      onEdit(address)
                      setOpenDrawerId(null)
                    }}
                  >
                    <Pencil className="size-4" />
                    {t("edit")}
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={() => {
                      onDelete(address.id)
                      setOpenDrawerId(null)
                    }}
                  >
                    <Trash className="size-4" />
                    {t("delete")}
                  </Button>
                </div>
              </div>
            </div>
          </DrawerBody>
        </DrawerShell>
      </>
    )
  }

  // Desktop card
  const DesktopAddressCard = ({ address }: { address: UserAddress }) => {
    const LabelIcon = getAddressLabelIcon(address.label)

    return (
      <Card className={`${address.is_default ? 'border-selected-border ring-1 ring-border-subtle' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <LabelIcon className={`size-5 ${getAddressLabelColor(address.label)}`} />
              <CardTitle className="text-base">{address.label}</CardTitle>
              {address.is_default && (
                <Badge variant="secondary" className="text-xs bg-selected text-primary border-0">
                  <Star className="size-3 mr-1" />
                  {t("default")}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-10"
                aria-label={t("edit")}
                onClick={() => onEdit(address)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-10 text-destructive hover:text-destructive"
                aria-label={t("delete")}
                onClick={() => onDelete(address.id)}
              >
                <Trash className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <p className="font-medium">{address.full_name}</p>
            {formatAddressLines(address).map((line, i) => (
              <p key={i} className="text-muted-foreground">{line}</p>
            ))}
            {address.phone && (
              <p className="text-muted-foreground pt-1 flex items-center gap-2">
                <Phone className="size-3.5" />
                {address.phone}
              </p>
            )}
          </div>
          {!address.is_default && (
            <Button 
              variant="link" 
              className="mt-3 h-auto p-0 text-sm text-primary"
              onClick={() => onSetDefault(address.id)}
              disabled={isLoading}
            >
              {t("setDefault")}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Inline add new card JSX
  const addNewCardJSX = (
    <Card className="border-dashed hover:border-hover-border transition-colors">
      <CardContent className="p-0">
        <button
          type="button"
          onClick={onAdd}
          className="flex h-full min-h-44 w-full flex-col items-center justify-center rounded-md py-8 transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={t("addNew")}
        >
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
            <Plus className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {t("addNew")}
          </p>
        </button>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      {/* Mobile view */}
      <div className="grid gap-3 sm:hidden">
        {addresses.map((address) => (
          <MobileAddressCard key={address.id} address={address} />
        ))}
        {addNewCardJSX}
      </div>

      {/* Desktop view */}
      <div className="hidden sm:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {addresses.map((address) => (
          <DesktopAddressCard key={address.id} address={address} />
        ))}
        {addNewCardJSX}
      </div>
    </div>
  )
}

