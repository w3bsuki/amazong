import type { ReactNode } from "react"

interface ModalSlotProps {
  children: ReactNode
  modal: ReactNode
}

export function ModalSlot({ children, modal }: ModalSlotProps) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}

