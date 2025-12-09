"use client"

import { UseFormReturn } from "react-hook-form"
import { SellFormData } from "../schema"
import { UploadSimple, X } from "@phosphor-icons/react"

export function PhotosStep({ form }: { form: UseFormReturn<SellFormData> }) {
  const { watch, setValue, formState: { errors } } = form
  const images = watch("images") || []

  const addPlaceholderImage = () => {
    // Simulate adding an image
    const newImage = `https://placehold.co/400x400?text=Image+${images.length + 1}`
    setValue("images", [...images, newImage], { shouldValidate: true })
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setValue("images", newImages, { shouldValidate: true })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Add photos</h2>
        <p className="text-sm text-gray-500">Buyers love photos. Add up to 12 photos for free.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Upload Button */}
        <button
          type="button"
          onClick={addPlaceholderImage}
          className="aspect-square flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
        >
          <UploadSimple className="size-8 text-gray-400 mb-2" />
          <span className="text-sm font-medium text-gray-600">Add Photo</span>
        </button>

        {/* Image List */}
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

      <div className="bg-blue-50 p-4 rounded-sm border border-blue-100">
        <h4 className="text-sm font-medium text-blue-900">Photo tips</h4>
        <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
          <li>Use good lighting and a plain background.</li>
          <li>Take photos of all sides, including any defects.</li>
          <li>Don't use stock photos.</li>
        </ul>
      </div>
    </div>
  )
}
