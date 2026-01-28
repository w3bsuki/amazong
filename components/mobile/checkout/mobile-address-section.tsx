"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import {
  ArrowLeft,
  MapPin,
  SpinnerGap,
  Check,
  WarningCircle,
} from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { SavedAddress, NewAddressForm } from "@/components/desktop/checkout/checkout-types"

interface MobileAddressSectionProps {
  isLoadingAddresses: boolean
  savedAddresses: SavedAddress[]
  selectedAddressId: string | null
  setSelectedAddressId: (id: string) => void
  useNewAddress: boolean
  setUseNewAddress: (value: boolean) => void
  newAddress: NewAddressForm
  updateNewAddress: (field: keyof NewAddressForm) => (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (field: keyof NewAddressForm) => () => void
  errors: Partial<Record<keyof NewAddressForm, string>>
  touched: Partial<Record<keyof NewAddressForm, boolean>>
}

export function MobileAddressSection({
  isLoadingAddresses,
  savedAddresses,
  selectedAddressId,
  setSelectedAddressId,
  useNewAddress,
  setUseNewAddress,
  newAddress,
  updateNewAddress,
  handleBlur,
  errors,
  touched,
}: MobileAddressSectionProps) {
  const t = useTranslations("CheckoutPage")
  const [showAddressSelector, setShowAddressSelector] = useState(false)

  if (isLoadingAddresses) {
    return (
      <div className="py-6 text-center">
        <SpinnerGap className="size-4 animate-spin text-muted-foreground mx-auto" />
      </div>
    )
  }

  // Show saved addresses - compact card for mobile
  if (savedAddresses.length > 0 && !useNewAddress) {
    const selected = savedAddresses.find(a => a.id === selectedAddressId)
    
    return (
      <>
        {selected && (
          <div className="rounded-lg border-2 border-primary bg-primary/5 p-3">
            <div className="flex items-start gap-2.5">
              <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="size-4 text-primary" weight="fill" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-semibold text-sm">{selected.label}</span>
                  {selected.is_default && (
                    <Badge variant="secondary" className="text-2xs px-1.5 py-0">
                      {t("default") || "Default"}
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium">{selected.full_name}</p>
                <p className="text-xs text-muted-foreground">
                  {selected.address_line1}, {selected.city}
                </p>
              </div>
              <Check className="size-4 text-primary shrink-0" weight="bold" />
            </div>
            
            {savedAddresses.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddressSelector(true)}
                className="w-full mt-3 h-9"
              >
                {t("changeAddress") || "Change address"}
              </Button>
            )}
          </div>
        )}

        {/* Bottom sheet address selector */}
        <Sheet open={showAddressSelector} onOpenChange={setShowAddressSelector}>
          <SheetContent side="bottom" className="h-[85dvh] rounded-t-2xl">
            <SheetHeader className="pb-4">
              <SheetTitle>{t("selectShippingAddress") || "Select shipping address"}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-auto space-y-3 pb-6">
              <RadioGroup
                value={selectedAddressId || ""}
                onValueChange={(v) => {
                  setSelectedAddressId(v)
                  setShowAddressSelector(false)
                }}
                className="space-y-2"
              >
                {savedAddresses.map((addr) => {
                  const isSelected = addr.id === selectedAddressId
                  return (
                    <label
                      key={addr.id}
                      htmlFor={`m-addr-${addr.id}`}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <RadioGroupItem value={addr.id} id={`m-addr-${addr.id}`} className="shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-semibold text-sm">{addr.label}</span>
                          {addr.is_default && (
                            <Badge variant="secondary" className="text-2xs">
                              {t("default") || "Default"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm">{addr.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {addr.address_line1}, {addr.city}, {addr.postal_code}
                        </p>
                      </div>
                      {isSelected && <Check className="size-4 text-primary shrink-0" weight="bold" />}
                    </label>
                  )
                })}
              </RadioGroup>

              <Button
                variant="outline"
                onClick={() => {
                  setShowAddressSelector(false)
                  setUseNewAddress(true)
                }}
                className="w-full"
              >
                <MapPin className="size-4 mr-2" />
                {t("addNewAddress") || "+ Add new address"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <button
          type="button"
          onClick={() => setUseNewAddress(true)}
          className="text-xs text-primary mt-3 block font-medium"
        >
          + {t("useNewAddress")}
        </button>
      </>
    )
  }

  // New address form - 2-column grid for most fields
  return (
    <div className="space-y-3">
      {savedAddresses.length > 0 && (
        <button 
          type="button" 
          onClick={() => setUseNewAddress(false)} 
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="size-4" />
          {t("backToSaved")}
        </button>
      )}
      
      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="m-firstName" className="text-sm">
            {t("firstName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="m-firstName"
            placeholder={t("firstName")}
            value={newAddress.firstName}
            onChange={updateNewAddress("firstName")}
            onBlur={handleBlur("firstName")}
            className={cn(
              touched.firstName && errors.firstName && "border-destructive"
            )}
          />
          {touched.firstName && errors.firstName && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <WarningCircle className="size-3 shrink-0" weight="fill" />
              <span>{errors.firstName}</span>
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-lastName" className="text-sm">
            {t("lastName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="m-lastName"
            placeholder={t("lastName")}
            value={newAddress.lastName}
            onChange={updateNewAddress("lastName")}
            onBlur={handleBlur("lastName")}
            className={cn(
              touched.lastName && errors.lastName && "border-destructive"
            )}
          />
          {touched.lastName && errors.lastName && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <WarningCircle className="size-3 shrink-0" weight="fill" />
              <span>{errors.lastName}</span>
            </p>
          )}
        </div>
      </div>
      
      {/* Address */}
      <div className="space-y-1.5">
        <Label htmlFor="m-address" className="text-sm">
          {t("address")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="m-address"
          placeholder={t("address")}
          value={newAddress.address}
          onChange={updateNewAddress("address")}
          onBlur={handleBlur("address")}
          className={cn(
            touched.address && errors.address && "border-destructive"
          )}
        />
        {touched.address && errors.address && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <WarningCircle className="size-3 shrink-0" weight="fill" />
            <span>{errors.address}</span>
          </p>
        )}
      </div>
      
      {/* City / State / ZIP */}
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="m-city" className="text-sm">
            {t("city")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="m-city"
            placeholder={t("city")}
            value={newAddress.city}
            onChange={updateNewAddress("city")}
            onBlur={handleBlur("city")}
            className={cn(
              touched.city && errors.city && "border-destructive"
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-state" className="text-sm">
            {t("state")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="m-state"
            placeholder={t("state")}
            value={newAddress.state}
            onChange={updateNewAddress("state")}
            onBlur={handleBlur("state")}
            className={cn(
              touched.state && errors.state && "border-destructive"
            )}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-zip" className="text-sm">
            {t("zipCode")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="m-zip"
            placeholder="10001"
            value={newAddress.zip}
            onChange={updateNewAddress("zip")}
            onBlur={handleBlur("zip")}
            className={cn(
              touched.zip && errors.zip && "border-destructive"
            )}
          />
        </div>
      </div>
      
      {/* Show any remaining errors */}
      {(touched.city && errors.city) || (touched.state && errors.state) || (touched.zip && errors.zip) ? (
        <p className="text-xs text-destructive">
          {errors.city || errors.state || errors.zip}
        </p>
      ) : null}
    </div>
  )
}
