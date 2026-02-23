import type { LucideIcon } from "lucide-react"

export interface Address {
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

export interface AddressFormData {
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

export type AddressLabelOption = {
  value: string
  icon: LucideIcon
  label: string
}
