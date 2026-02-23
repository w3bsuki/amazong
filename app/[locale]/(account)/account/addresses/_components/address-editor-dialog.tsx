import type { ChangeEvent } from "react"
import { Briefcase, Building2 as Buildings, House, LoaderCircle as SpinnerGap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { AddressFormFields } from "../../../../_components/address-form"

import type {
  Address,
  AddressFormData,
  AddressLabelOption,
} from "../_lib/addresses-content.types"

export function AddressEditorDialog({
  open,
  onOpenChange,
  editingAddress,
  formData,
  addressLabels,
  isLoading,
  handleInputChange,
  handleTextChange,
  handleSave,
  t,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingAddress: Address | null
  formData: AddressFormData
  addressLabels: AddressLabelOption[]
  isLoading: boolean
  handleInputChange: (field: keyof AddressFormData, value: string | boolean) => void
  handleTextChange: (field: keyof AddressFormData) => (event: ChangeEvent<HTMLInputElement>) => void
  handleSave: () => void
  t: (key: string) => string
}) {
  const iconMap: Record<string, AddressLabelOption["icon"]> = {
    Home: House,
    Work: Briefcase,
    Other: Buildings,
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-dialog overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingAddress ? t("dialog.editTitle") : t("dialog.addTitle")}
          </DialogTitle>
          <DialogDescription>{t("dialog.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("fields.label")}</Label>
              <Select value={formData.label} onValueChange={(v) => handleInputChange("label", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {addressLabels.map((label) => {
                    const Icon = iconMap[label.value] ?? label.icon
                    return (
                      <SelectItem key={label.value} value={label.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="size-4" />
                          {label.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("fields.country")}</Label>
              <Select value={formData.country} onValueChange={(v) => handleInputChange("country", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bulgaria">{t("countries.bulgaria")}</SelectItem>
                  <SelectItem value="Romania">{t("countries.romania")}</SelectItem>
                  <SelectItem value="Greece">{t("countries.greece")}</SelectItem>
                  <SelectItem value="Serbia">{t("countries.serbia")}</SelectItem>
                  <SelectItem value="North Macedonia">{t("countries.northMacedonia")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("fields.phone")}</Label>
            <Input
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+359 88 888 8888"
            />
          </div>

          <AddressFormFields
            nameFields={[
              {
                id: "full_name",
                label: (
                  <>
                    {t("fields.fullName")} <span className="text-destructive">*</span>
                  </>
                ),
                placeholder: t("placeholders.fullName"),
                value: formData.full_name,
                onChange: handleTextChange("full_name"),
                required: true,
              },
            ]}
            addressLine1={{
              id: "address_line1",
              label: (
                <>
                  {t("fields.addressLine1")} <span className="text-destructive">*</span>
                </>
              ),
              placeholder: t("placeholders.addressLine1"),
              value: formData.address_line1,
              onChange: handleTextChange("address_line1"),
              required: true,
            }}
            addressLine2={{
              id: "address_line2",
              label: t("fields.addressLine2"),
              placeholder: t("placeholders.addressLine2"),
              value: formData.address_line2,
              onChange: handleTextChange("address_line2"),
            }}
            city={{
              id: "city",
              label: (
                <>
                  {t("fields.city")} <span className="text-destructive">*</span>
                </>
              ),
              placeholder: t("placeholders.city"),
              value: formData.city,
              onChange: handleTextChange("city"),
              required: true,
            }}
            state={{
              id: "state",
              label: t("fields.state"),
              placeholder: t("placeholders.state"),
              value: formData.state,
              onChange: handleTextChange("state"),
            }}
            postalCode={{
              id: "postal_code",
              label: (
                <>
                  {t("fields.postalCode")} <span className="text-destructive">*</span>
                </>
              ),
              placeholder: "1000",
              value: formData.postal_code,
              onChange: handleTextChange("postal_code"),
              required: true,
            }}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) => handleInputChange("is_default", e.target.checked)}
              className="rounded border-border"
            />
            <Label htmlFor="is_default" className="font-normal cursor-pointer">
              {t("fields.setDefault")}
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("actions.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <SpinnerGap className="size-4 mr-2 animate-spin" />}
            {editingAddress ? t("actions.save") : t("actions.add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
