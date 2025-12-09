"use client"

import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { SellFormData } from "../schema"
import { getCategoryAttributes } from "../../_actions"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SpinnerGap } from "@phosphor-icons/react"

type Attribute = {
  id: string
  name: string
  attribute_type: "text" | "number" | "select" | "multiselect" | "boolean" | "date"
  options: string[] | null
  is_required: boolean
  placeholder: string | null
}

export function AttributesStep({ form }: { form: UseFormReturn<SellFormData> }) {
  const { register, watch, setValue } = form
  const categoryId = watch("categoryId")
  
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (categoryId) {
      loadAttributes(categoryId)
    }
  }, [categoryId])

  const loadAttributes = async (catId: string) => {
    setLoading(true)
    const data = await getCategoryAttributes(catId)
    // Parse options if they are strings
    const parsedData = data.map((attr: any) => ({
      ...attr,
      options: typeof attr.options === 'string' ? JSON.parse(attr.options) : attr.options
    }))
    setAttributes(parsedData)
    setLoading(false)
  }

  if (!categoryId) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a category first.
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <SpinnerGap className="size-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (attributes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No specific attributes required for this category. You can proceed.
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Item Specifics</h2>
        <p className="text-sm text-gray-500">Add details to help buyers find your item.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {attributes.map((attr) => (
          <div key={attr.id} className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">
              {attr.name} {attr.is_required && <span className="text-red-500">*</span>}
            </Label>
            
            {attr.attribute_type === "select" && attr.options ? (
              <Select 
                onValueChange={(val) => setValue(`attributes.${attr.name}`, val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={attr.placeholder || `Select ${attr.name}`} />
                </SelectTrigger>
                <SelectContent>
                  {attr.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder={attr.placeholder || ""}
                {...register(`attributes.${attr.name}`, {
                  required: attr.is_required ? `${attr.name} is required` : false
                })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
