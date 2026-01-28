"use client"

import { useState } from "react"
import { Link } from "@/i18n/routing"
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
import type { SavedAddress, NewAddressForm } from "./checkout-types"

interface DesktopAddressSectionProps {
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

export function DesktopAddressSection({
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
}: DesktopAddressSectionProps) {
  const t = useTranslations("CheckoutPage")
  const [showAddressSelector, setShowAddressSelector] = useState(false)

  if (isLoadingAddresses) {
    return (
      <div className="py-8 text-center">
        <SpinnerGap className="size-5 animate-spin text-muted-foreground mx-auto" />
      </div>
    )
  }

  // Show saved addresses UI
  if (savedAddresses.length > 0 && !useNewAddress) {
    const selected = savedAddresses.find(a => a.id === selectedAddressId)
    
    return (
      <>
        {/* Selected address display */}
        {selected && (
          <div className="rounded-lg border-2 border-primary bg-primary/5 p-5">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="size-6 text-primary" weight="fill" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-semibold">{selected.label}</span>
                  {selected.is_default && (
                    <Badge variant="secondary" className="text-xs">
                      {t("default") || "Default"}
                    </Badge>
                  )}
                </div>
                <p className="font-medium">{selected.full_name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {selected.address_line1}
                  {selected.address_line2 && `, ${selected.address_line2}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selected.city}, {selected.state} {selected.postal_code}
                </p>
                {selected.phone && (
                  <p className="text-sm text-muted-foreground mt-1">{selected.phone}</p>
                )}
              </div>
              <Check className="size-5 text-primary shrink-0 mt-1" weight="bold" />
            </div>
            
            {savedAddresses.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddressSelector(true)}
                className="w-full mt-4"
              >
                {t("changeAddress") || "Change address"}
              </Button>
            )}
          </div>
        )}

        {/* Address selector modal */}
        <Sheet open={showAddressSelector} onOpenChange={setShowAddressSelector}>
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>{t("selectShippingAddress") || "Select shipping address"}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-3 overflow-auto pb-4 max-h-[calc(100vh-12rem)]">
              <RadioGroup
                value={selectedAddressId || ""}
                onValueChange={(v) => {
                  setSelectedAddressId(v)
                  setShowAddressSelector(false)
                }}
                className="space-y-3"
              >
                {savedAddresses.map((addr) => {
                  const isSelected = addr.id === selectedAddressId
                  return (
                    <label
                      key={addr.id}
                      htmlFor={`addr-${addr.id}`}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <RadioGroupItem value={addr.id} id={`addr-${addr.id}`} className="shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{addr.label}</span>
                          {addr.is_default && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {t("default") || "Default"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium">{addr.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {addr.address_line1}
                          {addr.address_line2 && `, ${addr.address_line2}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {addr.city}, {addr.state} {addr.postal_code}
                        </p>
                      </div>
                      {isSelected && <Check className="size-5 text-primary shrink-0" weight="bold" />}
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
                className="w-full mt-2"
              >
                <MapPin className="size-4 mr-2" />
                {t("addNewAddress") || "+ Add new address"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Add new address link */}
        <button
          type="button"
          onClick={() => setUseNewAddress(true)}
          className="text-sm text-primary mt-4 block font-medium hover:underline"
        >
          + {t("useNewAddress")}
        </button>
      </>
    )
  }

  // New address form (4-column grid for desktop)
  return (
    <div className="space-y-4">
      {savedAddresses.length > 0 && (
        <button 
          type="button" 
          onClick={() => setUseNewAddress(false)} 
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5"
        >
          <ArrowLeft className="size-4" />
          {t("backToSaved")}
        </button>
      )}
      
      {/* Name row - 2 columns */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            {t("firstName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder={t("firstName")}
            value={newAddress.firstName}
            onChange={updateNewAddress("firstName")}
            onBlur={handleBlur("firstName")}
            className={cn(
              "h-11",
              touched.firstName && errors.firstName && "border-destructive focus-visible:ring-destructive"
            )}
            aria-invalid={!!(touched.firstName && errors.firstName)}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
          />
          {touched.firstName && errors.firstName && (
            <p id="firstName-error" className="text-xs text-destructive flex items-center gap-1">
              <WarningCircle className="size-3.5 shrink-0" weight="fill" />
              <span>{errors.firstName}</span>
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            {t("lastName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder={t("lastName")}
            value={newAddress.lastName}
            onChange={updateNewAddress("lastName")}
            onBlur={handleBlur("lastName")}
            className={cn(
              "h-11",
              touched.lastName && errors.lastName && "border-destructive focus-visible:ring-destructive"
            )}
            aria-invalid={!!(touched.lastName && errors.lastName)}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
          />
          {touched.lastName && errors.lastName && (
            <p id="lastName-error" className="text-xs text-destructive flex items-center gap-1">
              <WarningCircle className="size-3.5 shrink-0" weight="fill" />
              <span>{errors.lastName}</span>
            </p>
          )}
        </div>
      </div>
      
      {/* Address row - full width */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          {t("address")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address"
          placeholder={t("addressPlaceholder") || "Street address, apartment, suite, etc."}
          value={newAddress.address}
          onChange={updateNewAddress("address")}
          onBlur={handleBlur("address")}
          className={cn(
            "h-11",
            touched.address && errors.address && "border-destructive focus-visible:ring-destructive"
          )}
          aria-invalid={!!(touched.address && errors.address)}
          aria-describedby={errors.address ? "address-error" : undefined}
        />
        {touched.address && errors.address && (
          <p id="address-error" className="text-xs text-destructive flex items-center gap-1">
            <WarningCircle className="size-3.5 shrink-0" weight="fill" />
            <span>{errors.address}</span>
          </p>
        )}
      </div>
      
      {/* City / State / ZIP row - 3 columns */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            {t("city")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            placeholder={t("city")}
            value={newAddress.city}
            onChange={updateNewAddress("city")}
            onBlur={handleBlur("city")}
            className={cn(
              "h-11",
              touched.city && errors.city && "border-destructive focus-visible:ring-destructive"
            )}
            aria-invalid={!!(touched.city && errors.city)}
            aria-describedby={errors.city ? "city-error" : undefined}
          />
          {touched.city && errors.city && (
            <p id="city-error" className="text-xs text-destructive flex items-center gap-1">
              <WarningCircle className="size-3.5 shrink-0" weight="fill" />
              <span>{errors.city}</span>
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state" className="text-sm font-medium">
            {t("state")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="state"
            placeholder={t("state")}
            value={newAddress.state}
            onChange={updateNewAddress("state")}
            onBlur={handleBlur("state")}
            className={cn(
              "h-11",
              touched.state && errors.state && "border-destructive focus-visible:ring-destructive"
            )}
            aria-invalid={!!(touched.state && errors.state)}
            aria-describedby={errors.state ? "state-error" : undefined}
          />
          {touched.state && errors.state && (
            <p id="state-error" className="text-xs text-destructive flex items-center gap-1">
              <WarningCircle className="size-3.5 shrink-0" weight="fill" />
              <span>{errors.state}</span>
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip" className="text-sm font-medium">
            {t("zipCode")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="zip"
            placeholder="10001"
            value={newAddress.zip}
            onChange={updateNewAddress("zip")}
            onBlur={handleBlur("zip")}
            className={cn(
              "h-11",
              touched.zip && errors.zip && "border-destructive focus-visible:ring-destructive"
            )}
            aria-invalid={!!(touched.zip && errors.zip)}
            aria-describedby={errors.zip ? "zip-error" : undefined}
          />
          {touched.zip && errors.zip && (
            <p id="zip-error" className="text-xs text-destructive flex items-center gap-1">
              <WarningCircle className="size-3.5 shrink-0" weight="fill" />
              <span>{errors.zip}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
