"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"

interface UploadedImage {
  url: string
  thumbnailUrl: string
}

interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
  maxSizeMB?: number
}

export function ImageUpload({ 
  onImagesChange, 
  maxImages = 5,
  maxSizeMB = 5 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return
    
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)

    try {
      const uploadedImages: UploadedImage[] = []

      for (const file of files) {
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(`${file.name} is too large (max ${maxSizeMB}MB)`)
          continue
        }

        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`)
          continue
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }

        const data = await response.json()
        uploadedImages.push({
          url: data.url,
          thumbnailUrl: data.thumbnailUrl
        })

        toast.success(`${file.name} uploaded (${data.compression} smaller)`)
      }

      setImages(prev => {
        const newImages = [...prev, ...uploadedImages]
        onImagesChange(newImages)
        return newImages
      })

    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index)
      onImagesChange(newImages)
      return newImages
    })
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const newImages = [...prev]
      const [movedImage] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, movedImage)
      onImagesChange(newImages)
      return newImages
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Product Images ({images.length}/{maxImages})</Label>
          <p className="text-xs text-muted-foreground mt-1">
            First image will be the primary image. Max {maxSizeMB}MB each.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Add Images
            </>
          )}
        </Button>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <img
                src={image.thumbnailUrl}
                alt={`Product ${index + 1}`}
                className="w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="bg-gray-800 text-white rounded px-2 py-1 text-xs"
                  >
                    ←
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="bg-gray-800 text-white rounded px-2 py-1 text-xs"
                  >
                    →
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2 p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No images yet. Click "Add Images" to upload.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supported: JPEG, PNG, WebP (auto-optimized)
          </p>
        </Card>
      )}
    </div>
  )
}
