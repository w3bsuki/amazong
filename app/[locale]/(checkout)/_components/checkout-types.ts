export interface SavedAddress {
  id: string;
  label: string;
  full_name: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  is_default: boolean | null;
}

export interface NewAddressForm {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export const SHIPPING_COSTS = {
  standard: 0,
  express: 0,
  overnight: 0,
} as const;

export type ShippingMethod = keyof typeof SHIPPING_COSTS;

export function isShippingMethod(value: string): value is ShippingMethod {
  return value === "standard" || value === "express" || value === "overnight"
}

