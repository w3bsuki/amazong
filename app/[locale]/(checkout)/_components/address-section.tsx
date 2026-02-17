import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Check, MapPin, LoaderCircle as SpinnerGap, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { AddressFormFields } from "../../_components/address-form";
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
                <MapPin className="size-5 text-primary" />
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
              <Check className="size-5 text-primary shrink-0" />
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

        <Drawer open={showAddressSelector} onOpenChange={setShowAddressSelector}>
          <DrawerContent className="max-h-dialog rounded-t-2xl">
            <DrawerHeader className="border-b border-border-subtle">
              <div className="flex items-center justify-between gap-3">
                <DrawerTitle>{t("selectShippingAddress")}</DrawerTitle>
                <DrawerClose asChild>
                  <IconButton aria-label="Close" variant="ghost" size="icon-compact">
                    <X className="size-4" />
                  </IconButton>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <DrawerBody className="px-4 py-4">
              <RadioGroup
                value={selectedAddressId || ""}
                onValueChange={(v) => {
                  setSelectedAddressId(v);
                  setShowAddressSelector(false);
                }}
                className="space-y-3"
              >
                {savedAddresses.map((addr) => {
                  const isSelected = addr.id === selectedAddressId;
                  return (
                    <label
                      key={addr.id}
                      htmlFor={`addr-${addr.id}`}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-md border-2 cursor-pointer transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 focus-within:ring-offset-background",
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
                      {isSelected && <Check className="size-5 text-primary shrink-0" />}
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
                <MapPin className="size-4 mr-2" />
                {t("addNewAddress")}
              </Button>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <button
          type="button"
          onClick={() => setUseNewAddress(true)}
          className="text-xs text-primary mt-3 block font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background rounded-sm"
        >
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
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background rounded-sm"
        >
          <ArrowLeft className="size-4" />
          {t("backToSaved")}
        </button>
      )}

      <AddressFormFields
        nameFields={[
          {
            id: "firstName",
            label: (
              <>
                {t("firstName")} <span className="text-destructive">*</span>
              </>
            ),
            placeholder: t("firstNamePlaceholder"),
            value: newAddress.firstName,
            onChange: updateNewAddress("firstName"),
            onBlur: handleBlur("firstName"),
            error: errors.firstName,
            touched: touched.firstName,
            required: true,
          },
          {
            id: "lastName",
            label: (
              <>
                {t("lastName")} <span className="text-destructive">*</span>
              </>
            ),
            placeholder: t("lastNamePlaceholder"),
            value: newAddress.lastName,
            onChange: updateNewAddress("lastName"),
            onBlur: handleBlur("lastName"),
            error: errors.lastName,
            touched: touched.lastName,
            required: true,
          },
        ]}
        addressLine1={{
          id: "address",
          label: (
            <>
              {t("address")} <span className="text-destructive">*</span>
            </>
          ),
          placeholder: t("addressPlaceholder"),
          value: newAddress.address,
          onChange: updateNewAddress("address"),
          onBlur: handleBlur("address"),
          error: errors.address,
          touched: touched.address,
          required: true,
        }}
        city={{
          id: "city",
          label: (
            <>
              {t("city")} <span className="text-destructive">*</span>
            </>
          ),
          placeholder: t("cityPlaceholder"),
          value: newAddress.city,
          onChange: updateNewAddress("city"),
          onBlur: handleBlur("city"),
          error: errors.city,
          touched: touched.city,
          required: true,
        }}
        state={{
          id: "state",
          label: (
            <>
              {t("state")} <span className="text-destructive">*</span>
            </>
          ),
          placeholder: t("statePlaceholder"),
          value: newAddress.state,
          onChange: updateNewAddress("state"),
          onBlur: handleBlur("state"),
          error: errors.state,
          touched: touched.state,
          required: true,
        }}
        postalCode={{
          id: "zip",
          label: (
            <>
              {t("zipCode")} <span className="text-destructive">*</span>
            </>
          ),
          placeholder: t("zipPlaceholder"),
          value: newAddress.zip,
          onChange: updateNewAddress("zip"),
          onBlur: handleBlur("zip"),
          error: errors.zip,
          touched: touched.zip,
          required: true,
        }}
      />
    </div>
  );
}

export type { AddressSectionProps };


