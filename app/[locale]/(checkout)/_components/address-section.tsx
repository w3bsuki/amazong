import type { ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Check, MapPin, LoaderCircle as SpinnerGap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    return (
      <div className="space-y-3">
        <RadioGroup
          value={selectedAddressId || ""}
          onValueChange={(v) => setSelectedAddressId(v)}
          className="space-y-3"
        >
          {savedAddresses.map((addr) => {
            const isSelected = addr.id === selectedAddressId
            return (
              <label
                key={addr.id}
                htmlFor={`addr-${addr.id}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-md border-2 p-4 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 focus-within:ring-offset-background",
                  isSelected
                    ? "border-selected-border bg-selected shadow-sm"
                    : "border-border hover:border-hover-border"
                )}
              >
                <RadioGroupItem
                  value={addr.id}
                  id={`addr-${addr.id}`}
                  className="mt-0.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm font-semibold">{addr.label}</span>
                    {addr.is_default && (
                      <Badge variant="secondary" className="px-1.5 py-0 text-xs">
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
                {isSelected && <Check className="size-5 shrink-0 text-primary" />}
              </label>
            )
          })}
        </RadioGroup>

        <Button
          type="button"
          variant="outline"
          onClick={() => setUseNewAddress(true)}
          className="w-full"
        >
          <MapPin className="mr-2 size-4" />
          {t("addNewAddress")}
        </Button>
      </div>
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


