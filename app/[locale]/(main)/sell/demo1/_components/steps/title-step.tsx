"use client"

import { UseFormReturn } from "react-hook-form"
import { SellFormData } from "../schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function TitleStep({ form }: { form: UseFormReturn<SellFormData> }) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-base font-medium text-gray-900">Title</Label>
          <p className="text-sm text-gray-500 mb-2">Use words people would search for.</p>
          <Input
            id="title"
            {...register("title")}
            className="max-w-xl"
            placeholder="e.g. iPhone 13 Pro Max - 256GB - Graphite (Unlocked)"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium text-gray-900">Condition</Label>
          <p className="text-sm text-gray-500 mb-3">What is the condition of your item?</p>
          
          <div className="space-y-3">
            {[
              { value: "new", label: "New", desc: "Brand-new, unused, unopened, undamaged item in its original packaging." },
              { value: "like-new", label: "Like New", desc: "Item looks and works like new. Has no visible wear." },
              { value: "good", label: "Good", desc: "Item shows some wear but works perfectly." },
              { value: "fair", label: "Fair", desc: "Item has significant wear but still works." },
              { value: "poor", label: "For Parts / Not Working", desc: "Item does not work or is damaged." },
            ].map((option) => (
              <div key={option.value} className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id={`condition-${option.value}`}
                    type="radio"
                    value={option.value}
                    {...register("condition")}
                    className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`condition-${option.value}`} className="font-medium text-gray-900">
                    {option.label}
                  </label>
                  <p className="text-gray-500">{option.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {errors.condition && (
            <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
