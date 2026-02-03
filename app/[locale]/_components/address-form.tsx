"use client"

import type { ChangeEvent, ReactNode } from "react"
import { WarningCircle } from "@phosphor-icons/react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AddressFieldConfig {
  id: string
  label: ReactNode
  placeholder?: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  error?: string | undefined
  touched?: boolean | undefined
  required?: boolean
}

interface AddressFormFieldsProps {
  nameFields: [AddressFieldConfig, ...AddressFieldConfig[]]
  addressLine1: AddressFieldConfig
  addressLine2?: AddressFieldConfig
  city: AddressFieldConfig
  state?: AddressFieldConfig
  postalCode: AddressFieldConfig
}

function AddressField({ field }: { field: AddressFieldConfig }) {
  const isInvalid = Boolean(field.touched && field.error)

  return (
    <div className="space-y-1.5">
      <Label htmlFor={field.id} className="text-sm font-medium">
        {field.label}
      </Label>
      <Input
        id={field.id}
        placeholder={field.placeholder}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        className={cn(isInvalid && "border-destructive")}
        aria-invalid={isInvalid}
        aria-required={field.required}
        aria-describedby={isInvalid ? `${field.id}-error` : undefined}
      />
      {isInvalid && (
        <p id={`${field.id}-error`} className="text-xs text-destructive flex items-center gap-1">
          <WarningCircle className="size-3.5 shrink-0" weight="fill" />
          <span>{field.error}</span>
        </p>
      )}
    </div>
  )
}

export function AddressFormFields({
  nameFields,
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
}: AddressFormFieldsProps) {
  const cityRowClassName = state ? "grid grid-cols-2 sm:grid-cols-3 gap-3" : "grid grid-cols-2 gap-3"

  return (
    <div className="space-y-3">
      {nameFields.length > 1 ? (
        <div className="grid grid-cols-2 gap-3">
          {nameFields.map((field) => (
            <AddressField key={field.id} field={field} />
          ))}
        </div>
      ) : (
        <AddressField field={nameFields[0]} />
      )}

      <AddressField field={addressLine1} />
      {addressLine2 ? <AddressField field={addressLine2} /> : null}

      <div className={cityRowClassName}>
        <AddressField field={city} />
        {state ? <AddressField field={state} /> : null}
        <AddressField field={postalCode} />
      </div>
    </div>
  )
}
