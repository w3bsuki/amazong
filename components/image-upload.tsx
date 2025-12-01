"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Upload, X, CircleNotch, Image as ImageIcon, ArrowLeft, ArrowRight } from "@phosphor-icons/react"

interface UploadedImage {
  url: string
  thumbnailUrl?: string
  position?: number
}

interface ImageUploadProps {
  value?: UploadedImage[]
  onChange?: (images: UploadedImage[]) => void
  onImagesChange?: (images: UploadedImage[]) => void
  maxImages?: number
  maxSizeMB?: number
}

export function ImageUpload({ 
  value = [],
  onChange,
  onImagesChange, 
  maxImages = 5,
  maxSizeMB = 5 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<UploadedImage[]>(value)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Sync with external value
  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(images)) {
      setImages(value)
    }
  }, [value])
  
  // Notify parent of changes - schedule for next tick to avoid render conflicts
  const notifyChange = (newImages: UploadedImage[]) => {
    // Add position to each image
    const imagesWithPosition = newImages.map((img, idx) => ({
      ...img,
      position: idx
    }))
    // Use setTimeout to schedule the update outside of React's render phase
    setTimeout(() => {
      onChange?.(imagesWithPosition)
      onImagesChange?.(imagesWithPosition)
    }, 0)
  }

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

        toast.success(`${file.name} uploaded`)
      }

      setImages(prev => {
        const newImages = [...prev, ...uploadedImages]
        notifyChange(newImages)
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
      notifyChange(newImages)
      return newImages
    })
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const newImages = [...prev]
      const [movedImage] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, movedImage)
      notifyChange(newImages)
      return newImages
    })
  }

  return (
    <div className="space-y-3">
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="relative aspect-square bg-muted border border-border rounded-sm overflow-hidden group"
            >
              <img
                src={image.thumbnailUrl || image.url}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 size-6 bg-background/90 hover:bg-destructive hover:text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} weight="bold" />
              </button>
              
              {/* Primary badge */}
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-foreground/80 text-background text-[10px] font-medium text-center py-0.5">
                  Main
                </div>
              )}
              
              {/* Reorder buttons */}
              <div className="absolute bottom-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="size-5 bg-background/90 hover:bg-background rounded flex items-center justify-center"
                  >
                    <ArrowLeft size={12} weight="bold" />
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="size-5 bg-background/90 hover:bg-background rounded flex items-center justify-center"
                  >
                    <ArrowRight size={12} weight="bold" />
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Add more button */}
          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="aspect-square border-2 border-dashed border-border hover:border-muted-foreground rounded-sm flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <CircleNotch size={20} className="animate-spin" />
              ) : (
                <>
                  <Upload size={20} />
                  <span className="text-[10px]">Add</span>
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-border hover:border-muted-foreground rounded-sm p-6 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <CircleNotch size={32} className="animate-spin" />
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon size={32} weight="duotone" />
              <span className="text-sm font-medium">Add photos</span>
              <span className="text-xs">JPEG, PNG, WebP • Max {maxSizeMB}MB</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
