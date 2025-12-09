"use client"

import { UseFormReturn } from "react-hook-form"
import { SellFormData } from "../schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function DetailsStep({ form }: { form: UseFormReturn<SellFormData> }) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div>
          <Label htmlFor="brand" className="text-base font-medium text-gray-900">Brand</Label>
          <Input
            id="brand"
            {...register("brand")}
            className="max-w-md mt-2"
            placeholder="e.g. Apple, Nike, Sony"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="description" className="text-base font-medium text-gray-900">Description</Label>
          <p className="text-sm text-gray-500 mb-2">Describe your item in detail. Mention any flaws.</p>
          <Textarea
            id="description"
            {...register("description")}
            className="min-h-[150px]"
            placeholder="Describe the item you are selling..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
