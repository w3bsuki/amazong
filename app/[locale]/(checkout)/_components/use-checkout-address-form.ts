import { useCallback, useState, type ChangeEvent } from "react"
import type { useTranslations } from "next-intl"

import type { NewAddressForm } from "./checkout-types"

type Translator = ReturnType<typeof useTranslations>

export function useCheckoutAddressForm({
  t,
  useNewAddress,
  selectedAddressId,
}: {
  t: Translator
  useNewAddress: boolean
  selectedAddressId: string | null
}) {
  const [newAddress, setNewAddress] = useState<NewAddressForm>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof NewAddressForm, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof NewAddressForm, boolean>>>({})

  const validateField = useCallback(
    (field: keyof NewAddressForm) => {
      const value = newAddress[field]
      let error = ""

      if (!value || !value.trim()) {
        error = t(`validation.${field}Required`)
      } else if (field === "zip" && !/^\d{4,5}$/.test(value)) {
        error = t("validation.zipInvalid")
      } else if ((field === "firstName" || field === "lastName") && value.length < 2) {
        error = t("validation.tooShort", { min: 2 })
      } else if (field === "address" && value.length < 5) {
        error = t("validation.tooShort", { min: 5 })
      }

      setErrors((prev) => ({ ...prev, [field]: error }))
      return error
    },
    [newAddress, t]
  )

  const updateNewAddress = useCallback(
    (field: keyof NewAddressForm) => (event: ChangeEvent<HTMLInputElement>) => {
      setNewAddress((prev) => ({ ...prev, [field]: event.target.value }))
      if (touched[field] && errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    },
    [errors, touched]
  )

  const handleBlur = useCallback(
    (field: keyof NewAddressForm) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }))
      validateField(field)
    },
    [validateField]
  )

  const isAddressValid = useCallback(() => {
    if (!useNewAddress && selectedAddressId) return true
    if (!useNewAddress) return false

    const fields: Array<keyof NewAddressForm> = [
      "firstName",
      "lastName",
      "address",
      "city",
      "state",
      "zip",
    ]

    return fields.every((field) => {
      const value = newAddress[field]
      if (!value || !value.trim()) return false
      if (field === "zip" && !/^\d{4,5}$/.test(value)) return false
      if ((field === "firstName" || field === "lastName") && value.length < 2) return false
      if (field === "address" && value.length < 5) return false
      return true
    })
  }, [newAddress, selectedAddressId, useNewAddress])

  return {
    newAddress,
    errors,
    touched,
    updateNewAddress,
    handleBlur,
    isAddressValid,
  }
}

