"use client"

import { UseFormReturn } from "react-hook-form"
import { SellFormData } from "../schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UploadSimple, X } from "@phosphor-icons/react"

export function BasicsStep({ form }: { form: UseFormReturn<SellFormData> }) {
  const { register, watch, setValue, formState: { errors } } = form
  const images = watch("images") || []

  const addPlaceholderImage = () => {
    const newImage = `https://placehold.co/400x400?text=Image+${images.length + 1}`
    setValue("images", [...images, newImage], { shouldValidate: true })
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setValue("images", newImages, { shouldValidate: true })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Photos Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Photos</h2>
          <p className="text-sm text-gray-500">Add up to 12 photos. The first photo will be your main image.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={addPlaceholderImage}
            className="aspect-square flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <UploadSimple className="size-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">Add Photo</span>
          </button>

          {images.map((img, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={img}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover rounded-sm border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-4 text-gray-600" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-gray-900/70 text-white text-xs py-1 text-center">
                  Main Photo
                </span>
              )}
            </div>
          ))}
        </div>
        {errors.images && (
          <p className="text-sm text-red-600">{errors.images.message}</p>
        )}
      </div>

      <div className="h-px bg-gray-200" />

      {/* Title & Description */}
      <div className="space-y-6">
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

      <div className="h-px bg-gray-200" />

      {/* Condition & Brand */}
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium text-gray-900">Condition</Label>
          <div className="mt-3 space-y-3">
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

        <div>
          <Label htmlFor="brand" className="text-base font-medium text-gray-900">Brand (Optional)</Label>
          <Input
            id="brand"
            {...register("brand")}
            className="max-w-md mt-2"
            placeholder="e.g. Apple, Nike, Sony"
          />
        </div>
      </div>
    </div>
  )
}
