'use client'

import { useCallback, useState } from "react"

export function usePlansModal() {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    isOpen,
    setIsOpen,
    openModal,
    closeModal,
    toggleModal,
  }
}
