"use client"

import { useState } from "react"
import { MapPin, House, Briefcase, Star, Plus, Pencil, Trash, Phone } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

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
  locale: string
  onEdit: (address: UserAddress) => void
  onDelete: (addressId: string) => void
  onAdd: () => void
  onSetDefault: (addressId: string) => void
  isLoading?: boolean
}

export function AccountAddressesGrid({ 
  addresses, 
  locale, 
  onEdit, 
  onDelete, 
  onAdd,
  onSetDefault,
  isLoading 
}: AccountAddressesGridProps) {
  const [openSheetId, setOpenSheetId] = useState<string | null>(null)

  const t = {
    noAddresses: locale === 'bg' ? 'Нямате запазени адреси' : 'No saved addresses',
    noAddressesDesc: locale === 'bg' ? 'Добавете адрес за по-бързо плащане при следващата поръчка' : 'Add an address for faster checkout on your next order',
    addFirst: locale === 'bg' ? 'Добави първия адрес' : 'Add your first address',
    addNew: locale === 'bg' ? 'Добави нов адрес' : 'Add new address',
    default: locale === 'bg' ? 'По подразбиране' : 'Default',
    setDefault: locale === 'bg' ? 'Направи по подразбиране' : 'Set as default',
    edit: locale === 'bg' ? 'Редактирай' : 'Edit',
    delete: locale === 'bg' ? 'Изтрий' : 'Delete',
    addressDetails: locale === 'bg' ? 'Детайли на адреса' : 'Address Details',
    deliveryAddress: locale === 'bg' ? 'Адрес за доставка' : 'Delivery address',
    phone: locale === 'bg' ? 'Телефон' : 'Phone',
    actions: locale === 'bg' ? 'Действия' : 'Actions',
  }

  const getLabelIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'home':
      case 'дом':
        return House
      case 'work':
      case 'работа':
        return Briefcase
      default:
        return MapPin
    }
  }

  const getLabelColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'home':
      case 'дом':
        return 'text-success'
      case 'work':
      case 'работа':
        return 'text-account-info'
      default:
        return 'text-muted-foreground'
    }
  }

  const formatAddress = (address: UserAddress) => {
    const parts = [address.address_line1]
    if (address.address_line2) parts.push(address.address_line2)
    parts.push(`${address.city}${address.state ? `, ${address.state}` : ''} ${address.postal_code}`)
    parts.push(address.country)
    return parts
  }

  // Empty state
  if (addresses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
            <MapPin className="size-8 text-muted-foreground" weight="duotone" />
          </div>
          <h3 className="font-semibold text-lg">{t.noAddresses}</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            {t.noAddressesDesc}
          </p>
          <Button onClick={onAdd} className="mt-6 gap-2">
            <Plus className="size-4" weight="bold" />
            {t.addFirst}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Mobile card with Sheet
  const MobileAddressCard = ({ address }: { address: UserAddress }) => {
    const LabelIcon = getLabelIcon(address.label)
    const isOpen = openSheetId === address.id

    return (
      <Sheet open={isOpen} onOpenChange={(open) => setOpenSheetId(open ? address.id : null)}>
        <SheetTrigger asChild>
          <Card className={`cursor-pointer transition-colors hover:bg-muted/50 ${address.is_default ? 'border-brand ring-1 ring-brand/20' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <LabelIcon className={`size-5 shrink-0 ${getLabelColor(address.label)}`} weight="duotone" />
                  <CardTitle className="text-base truncate">{address.label}</CardTitle>
                </div>
                {address.is_default && (
                  <Badge variant="secondary" className="shrink-0 text-xs bg-brand/10 text-brand border-0">
                    <Star className="size-3 mr-1" weight="fill" />
                    {t.default}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-medium text-sm">{address.full_name}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{address.address_line1}, {address.city}</p>
            </CardContent>
          </Card>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-auto max-h-[85vh]">
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center gap-2">
              <LabelIcon className={`size-5 ${getLabelColor(address.label)}`} weight="duotone" />
              {address.label}
              {address.is_default && (
                <Badge variant="secondary" className="ml-2 text-xs bg-brand/10 text-brand border-0">
                  <Star className="size-3 mr-1" weight="fill" />
                  {t.default}
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription>{t.addressDetails}</SheetDescription>
          </SheetHeader>
          <ScrollArea className="mt-4 max-h-[50vh]">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{t.deliveryAddress}</p>
                <div className="space-y-1">
                  <p className="font-medium">{address.full_name}</p>
                  {formatAddress(address).map((line, i) => (
                    <p key={i} className="text-muted-foreground">{line}</p>
                  ))}
                </div>
              </div>
              {address.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{t.phone}</p>
                  <p className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    {address.phone}
                  </p>
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{t.actions}</p>
                <div className="flex flex-col gap-2">
                  {!address.is_default && (
                    <Button 
                      variant="outline" 
                      className="justify-start gap-2"
                      onClick={() => {
                        onSetDefault(address.id)
                        setOpenSheetId(null)
                      }}
                      disabled={isLoading}
                    >
                      <Star className="size-4" />
                      {t.setDefault}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="justify-start gap-2"
                    onClick={() => {
                      onEdit(address)
                      setOpenSheetId(null)
                    }}
                  >
                    <Pencil className="size-4" />
                    {t.edit}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={() => {
                      onDelete(address.id)
                      setOpenSheetId(null)
                    }}
                  >
                    <Trash className="size-4" />
                    {t.delete}
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop card
  const DesktopAddressCard = ({ address }: { address: UserAddress }) => {
    const LabelIcon = getLabelIcon(address.label)

    return (
      <Card className={`${address.is_default ? 'border-brand ring-1 ring-brand/20' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <LabelIcon className={`size-5 ${getLabelColor(address.label)}`} weight="duotone" />
              <CardTitle className="text-base">{address.label}</CardTitle>
              {address.is_default && (
                <Badge variant="secondary" className="text-xs bg-brand/10 text-brand border-0">
                  <Star className="size-3 mr-1" weight="fill" />
                  {t.default}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-8"
                onClick={() => onEdit(address)}
              >
                <Pencil className="size-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="size-8 text-destructive hover:text-destructive"
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
            {formatAddress(address).map((line, i) => (
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
              className="mt-3 h-auto p-0 text-sm text-brand"
              onClick={() => onSetDefault(address.id)}
              disabled={isLoading}
            >
              {t.setDefault}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Inline add new card JSX
  const addNewCardJSX = (
    <Card 
      className="border-dashed cursor-pointer hover:border-brand/50 hover:bg-muted/30 transition-colors"
      onClick={onAdd}
    >
      <CardContent className="flex flex-col items-center justify-center h-full min-h-44 py-8">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Plus className="size-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium text-sm">
          {t.addNew}
        </p>
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
