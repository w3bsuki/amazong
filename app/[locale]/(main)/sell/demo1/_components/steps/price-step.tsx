"use client"

import { UseFormReturn } from "react-hook-form"
import { SellFormData } from "../schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PriceStep({ form }: { form: UseFormReturn<SellFormData> }) {
  const { register, watch, formState: { errors } } = form
  const shippingOption = watch("shippingOption")

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div>
          <Label htmlFor="price" className="text-base font-medium text-gray-900">Price</Label>
          <div className="relative mt-2 max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price")}
              className="pl-7"
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium text-gray-900">Shipping</Label>
          <p className="text-sm text-gray-500 mb-3">Who pays for shipping?</p>
          
          <div className="space-y-3">
            {[
              { value: "calculated", label: "Calculated Shipping", desc: "Buyer pays based on location." },
              { value: "flat", label: "Flat Rate", desc: "Buyer pays a fixed amount." },
              { value: "free", label: "Free Shipping", desc: "You pay for shipping." },
            ].map((option) => (
              <div key={option.value} className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id={`shipping-${option.value}`}
                    type="radio"
                    value={option.value}
                    {...register("shippingOption")}
                    className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`shipping-${option.value}`} className="font-medium text-gray-900">
                    {option.label}
                  </label>
                  <p className="text-gray-500">{option.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {shippingOption === "flat" && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <Label htmlFor="shippingCost" className="text-sm font-medium text-gray-900">Shipping Cost</Label>
            <div className="relative mt-2 max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                id="shippingCost"
                type="number"
                step="0.01"
                {...register("shippingCost")}
                className="pl-7"
                placeholder="0.00"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
