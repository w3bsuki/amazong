"use client";

import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Check, MapPin, SpinnerGap, WarningCircle } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { NewAddressForm, SavedAddress } from "./checkout-types";

interface AddressSectionProps {
  isLoadingAddresses: boolean;
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string) => void;
  useNewAddress: boolean;
  setUseNewAddress: (value: boolean) => void;
  newAddress: NewAddressForm;
  updateNewAddress: (field: keyof NewAddressForm) => (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof NewAddressForm) => () => void;
  errors: Partial<Record<keyof NewAddressForm, string>>;
  touched: Partial<Record<keyof NewAddressForm, boolean>>;
  showAddressSelector: boolean;
  setShowAddressSelector: (value: boolean) => void;
}

export function AddressSection({
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
  showAddressSelector,
  setShowAddressSelector,
}: AddressSectionProps) {
  const t = useTranslations("CheckoutPage");

  if (isLoadingAddresses) {
    return (
      <div className="py-3 text-center">
        <SpinnerGap className="size-4 animate-spin text-muted-foreground mx-auto" />
      </div>
    );
  }

  if (savedAddresses.length > 0 && !useNewAddress) {
    const selected = savedAddresses.find((a) => a.id === selectedAddressId);
    return (
      <>
        {selected && (
          <div className="rounded-lg border-2 border-selected-border bg-selected p-4">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-full bg-selected flex items-center justify-center shrink-0">
                <MapPin className="size-5 text-primary" weight="fill" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{selected.label}</span>
                  {selected.is_default && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {t("default")}
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium">{selected.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {selected.address_line1}
                  {selected.address_line2 && `, ${selected.address_line2}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selected.city}, {selected.state} {selected.postal_code}
                </p>
              </div>
              <Check className="size-5 text-primary shrink-0" weight="bold" />
            </div>
            {savedAddresses.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddressSelector(true)}
                className="w-full mt-3"
              >
                {t("changeAddress")}
              </Button>
            )}
          </div>
        )}

        <Sheet open={showAddressSelector} onOpenChange={setShowAddressSelector}>
          <SheetContent side="bottom" className="h-5/6">
            <SheetHeader>
              <SheetTitle>{t("selectShippingAddress")}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex h-full flex-col gap-3 overflow-hidden pb-4">
              <RadioGroup
                value={selectedAddressId || ""}
                onValueChange={(v) => {
                  setSelectedAddressId(v);
                  setShowAddressSelector(false);
                }}
                className="flex-1 space-y-3 overflow-auto"
              >
                {savedAddresses.map((addr) => {
                  const isSelected = addr.id === selectedAddressId;
                  return (
                    <label
                      key={addr.id}
                      htmlFor={`addr-${addr.id}`}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-md border-2 cursor-pointer transition-all",
                        isSelected ? "border-selected-border bg-selected shadow-sm" : "border-border hover:border-hover-border"
                      )}
                    >
                      <RadioGroupItem value={addr.id} id={`addr-${addr.id}`} className="shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{addr.label}</span>
                          {addr.is_default && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {t("default")}
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
                  );
                })}
              </RadioGroup>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddressSelector(false);
                  setUseNewAddress(true);
                }}
                className="w-full"
              >
                <MapPin className="size-4 mr-2" weight="regular" />
                {t("addNewAddress")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <button type="button" onClick={() => setUseNewAddress(true)} className="text-xs text-primary mt-3 block font-medium">
          {t("useNewAddress")}
        </button>
      </>
    );
  }

  return (
    <div className="space-y-3">
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName" className="text-sm font-medium">
            {t("firstName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder={t("firstNamePlaceholder")}
            value={newAddress.firstName}
            onChange={updateNewAddress("firstName")}
            onBlur={handleBlur("firstName")}
            className={cn(touched.firstName && errors.firstName && "border-destructive")}
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

        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-sm font-medium">
            {t("lastName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder={t("lastNamePlaceholder")}
            value={newAddress.lastName}
            onChange={updateNewAddress("lastName")}
            onBlur={handleBlur("lastName")}
            className={cn(touched.lastName && errors.lastName && "border-destructive")}
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

      <div className="space-y-1.5">
        <Label htmlFor="address" className="text-sm font-medium">
          {t("address")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="address"
          placeholder={t("addressPlaceholder")}
          value={newAddress.address}
          onChange={updateNewAddress("address")}
          onBlur={handleBlur("address")}
          className={cn(touched.address && errors.address && "border-destructive")}
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

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="city" className="text-sm font-medium">
            {t("city")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            placeholder={t("cityPlaceholder")}
            value={newAddress.city}
            onChange={updateNewAddress("city")}
            onBlur={handleBlur("city")}
            className={cn(touched.city && errors.city && "border-destructive")}
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

        <div className="space-y-1.5">
          <Label htmlFor="state" className="text-sm font-medium">
            {t("state")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="state"
            placeholder={t("statePlaceholder")}
            value={newAddress.state}
            onChange={updateNewAddress("state")}
            onBlur={handleBlur("state")}
            className={cn(touched.state && errors.state && "border-destructive")}
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

        <div className="space-y-1.5">
          <Label htmlFor="zip" className="text-sm font-medium">
            {t("zipCode")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="zip"
            placeholder={t("zipPlaceholder")}
            value={newAddress.zip}
            onChange={updateNewAddress("zip")}
            onBlur={handleBlur("zip")}
            className={cn(touched.zip && errors.zip && "border-destructive")}
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
  );
}

export type { AddressSectionProps };

