import { Loader2 } from "lucide-react"
import { Modal } from "../../../_components/modal"

export default function Loading() {
  return (
    <Modal ariaLabel="Loading">
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    </Modal>
  )
}
