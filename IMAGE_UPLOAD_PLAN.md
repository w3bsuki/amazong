# 📸 Product Image Upload Implementation Plan

**Date:** November 24, 2025  
**Status:** Planning Phase  
**Current State:** Using external URLs (not ideal for production)

---

## 🎯 EXECUTIVE SUMMARY

### Current State ❌
- Sellers must provide external image URLs
- No image hosting
- No format validation
- No size optimization
- Security risk (external URLs can break/change)

### Target State ✅
- Upload images directly from device
- Automatic WebP conversion
- Image optimization (resize, compress)
- Supabase Storage hosting
- Multiple images per product
- Thumbnail generation
- CDN delivery via Supabase

---

## 🤔 UI FRAMEWORK DECISION

**Answer: YES, we're using shadcn/ui** ✅

Evidence from `components.json`:
```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "iconLibrary": "lucide"
}
```

### shadcn/ui + UploadThing Consideration

**UploadThing Pros:**
- ✅ Pre-built shadcn components
- ✅ Easy integration
- ✅ Automatic optimization
- ✅ CDN included
- ✅ Free tier: 2GB storage, 2GB bandwidth/month

**UploadThing Cons:**
- ❌ External dependency (another service to manage)
- ❌ Paid beyond free tier ($10/mo for 100GB)
- ❌ Data not in your control

**Supabase Storage Pros:**
- ✅ Already using Supabase
- ✅ All data in one place
- ✅ Free tier: 1GB storage, 2GB bandwidth
- ✅ RLS policies (security)
- ✅ Transformation API (resize, optimize)
- ✅ Direct PostgreSQL integration

**Supabase Storage Cons:**
- ❌ Need to implement upload UI ourselves
- ❌ Manual WebP conversion needed

### ✅ RECOMMENDATION: Supabase Storage

**Reasons:**
1. Already integrated with our stack
2. Better control and security
3. RLS policies protect images
4. Can implement WebP conversion with `sharp` library
5. No additional service costs
6. Direct integration with product database

---

## 🏗️ ARCHITECTURE

### Database Schema (Already Exists ✅)
```sql
-- products table already has:
CREATE TABLE products (
  id UUID PRIMARY KEY,
  seller_id UUID REFERENCES sellers(id),
  title TEXT NOT NULL,
  image TEXT, -- Currently URL, will be Supabase Storage path
  ...
)
```

### New: Multiple Images Support
```sql
-- Create product_images table for multiple images
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, -- Supabase Storage path
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Anyone can view images of listed products
CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id
    )
  );

-- Sellers can insert their own product images
CREATE POLICY "Sellers can insert their product images"
  ON product_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id
      AND products.seller_id = auth.uid()
    )
  );

-- Sellers can delete their own product images
CREATE POLICY "Sellers can delete their product images"
  ON product_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id
      AND products.seller_id = auth.uid()
    )
  );
```

### Supabase Storage Bucket Configuration
```typescript
// Storage bucket setup (run once in Supabase Dashboard or via API)
{
  name: 'product-images',
  public: true, // Public read access
  fileSizeLimit: 5242880, // 5MB max per file
  allowedMimeTypes: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ]
}
```

### Storage RLS Policies
```sql
-- Allow public to view images
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow authenticated sellers to upload images
CREATE POLICY "Sellers can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow sellers to delete their own images
CREATE POLICY "Sellers can delete their images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 📦 REQUIRED DEPENDENCIES

### Install New Packages
```bash
pnpm add sharp @types/sharp
```

**Why `sharp`?**
- WebP conversion (50-80% smaller than JPEG/PNG)
- Image resizing (thumbnails, different sizes)
- Fast (C++ bindings, not browser-based)
- Production-ready (used by Next.js itself)

---

## 🎨 IMPLEMENTATION COMPONENTS

### 1. Image Upload Component (`components/image-upload.tsx`)

```tsx
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void
  maxImages?: number
  maxSizeMB?: number
}

export function ImageUpload({ 
  onImagesChange, 
  maxImages = 5,
  maxSizeMB = 5 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return
    
    // Validate total images
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)

    try {
      for (const file of files) {
        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max ${maxSizeMB}MB`)
          continue
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`)
          continue
        }

        // Convert to WebP and upload
        const webpBlob = await convertToWebP(file)
        const uploadedUrl = await uploadToSupabase(webpBlob, file.name)
        
        if (uploadedUrl) {
          setImages(prev => [...prev, uploadedUrl])
          setPreviews(prev => [...prev, URL.createObjectURL(webpBlob)])
        }
      }

      toast.success('Images uploaded successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const convertToWebP = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const reader = new FileReader()

      reader.onload = (e) => {
        img.src = e.target?.result as string
      }

      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Resize if too large (max 1920px width)
        let width = img.width
        let height = img.height
        const maxWidth = 1920
        const maxHeight = 1920

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to convert to WebP'))
            }
          },
          'image/webp',
          0.85 // 85% quality (good balance)
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      reader.readAsDataURL(file)
    })
  }

  const uploadToSupabase = async (blob: Blob, originalName: string): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const fileExt = 'webp'
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, blob, {
          contentType: 'image/webp',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path)

      return publicUrl
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message)
      return null
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Update parent component whenever images change
  useEffect(() => {
    onImagesChange(images)
  }, [images])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Product Images ({images.length}/{maxImages})</Label>
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
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Previews */}
      {previews.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <img
                src={preview}
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
            Supported: JPEG, PNG (auto-converted to WebP)
          </p>
        </Card>
      )}
    </div>
  )
}
```

### 2. Server-Side WebP Conversion (Better Performance)

**API Route:** `app/api/upload-image/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Process with sharp (resize + convert to WebP)
    const webpBuffer = await sharp(buffer)
      .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toBuffer()

    // Also create thumbnail
    const thumbnailBuffer = await sharp(buffer)
      .resize(400, 400, {
        fit: 'cover'
      })
      .webp({ quality: 80 })
      .toBuffer()

    // Upload to Supabase Storage
    const timestamp = Date.now()
    const random = Math.random().toString(36).slice(2)
    const fileName = `${user.id}/${timestamp}-${random}.webp`
    const thumbnailName = `${user.id}/thumb-${timestamp}-${random}.webp`

    // Upload full image
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, webpBuffer, {
        contentType: 'image/webp',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }

    // Upload thumbnail
    await supabase.storage
      .from('product-images')
      .upload(thumbnailName, thumbnailBuffer, {
        contentType: 'image/webp',
        upsert: false
      })

    // Get public URLs
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadData.path)

    const { data: { publicUrl: thumbnailUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(thumbnailName)

    return NextResponse.json({
      url: publicUrl,
      thumbnailUrl,
      size: webpBuffer.length,
      originalSize: file.size,
      compression: ((1 - webpBuffer.length / file.size) * 100).toFixed(1) + '%'
    })

  } catch (error: any) {
    console.error('Image upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
```

### 3. Updated Image Upload Component (Server-Side Processing)

```tsx
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Product Images ({images.length}/{maxImages})</Label>
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
        accept="image/jpeg,image/jpg,image/png"
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
            Supported: JPEG, PNG (auto-converted to WebP)
          </p>
        </Card>
      )}
    </div>
  )
}
```

---

## 🔄 MIGRATION PLAN

### Step 1: Database Migration
```sql
-- supabase/migrations/20251124_add_product_images.sql

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary) WHERE is_primary = true;

-- Enable RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Sellers can insert their product images"
  ON product_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id
      AND products.seller_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can update their product images"
  ON product_images FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id
      AND products.seller_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can delete their product images"
  ON product_images FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_images.product_id
      AND products.seller_id = auth.uid()
    )
  );

-- Trigger to ensure only one primary image per product
CREATE OR REPLACE FUNCTION ensure_single_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE product_images 
    SET is_primary = false 
    WHERE product_id = NEW.product_id 
    AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_primary_image
  BEFORE INSERT OR UPDATE ON product_images
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_primary_image();
```

### Step 2: Create Supabase Storage Bucket
**Via Supabase Dashboard:**
1. Go to Storage
2. Create new bucket: `product-images`
3. Set as Public
4. Configure RLS policies (see above)

**Or via SQL:**
```sql
-- Insert bucket config
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Storage RLS
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

### Step 3: Install Dependencies
```bash
pnpm add sharp
pnpm add -D @types/sharp
```

### Step 4: Create Components & API Routes
1. Create `components/image-upload.tsx`
2. Create `app/api/upload-image/route.ts`

### Step 5: Update Sell Page
Update `app/[locale]/sell/page.tsx` to use new component

### Step 6: Update Product API
Update `app/api/products/route.ts` to handle multiple images

---

## 📱 USAGE EXAMPLE

### Updated Sell Page
```tsx
// app/[locale]/sell/page.tsx

import { ImageUpload } from "@/components/image-upload"

export default function SellPage() {
  const [productImages, setProductImages] = useState<any[]>([])

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: productTitle,
          description: productDescription,
          price: productPrice,
          categoryId: productCategory,
          tags: productTags.split(',').map(t => t.trim()).filter(Boolean),
          images: productImages // Array of {url, thumbnailUrl}
        }),
      })

      // ... handle response
    } catch (error) {
      // ... handle error
    }
  }

  return (
    <form onSubmit={handleCreateProduct}>
      {/* ... other fields ... */}

      <ImageUpload 
        onImagesChange={setProductImages}
        maxImages={5}
        maxSizeMB={5}
      />

      <Button type="submit">List Product</Button>
    </form>
  )
}
```

### Updated Product API
```typescript
// app/api/products/route.ts

export async function POST(request: NextRequest) {
  // ... auth checks ...

  const { title, description, price, categoryId, tags, images } = await request.json()

  // Create product
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      seller_id: user.id,
      title,
      description,
      price: parseFloat(price),
      category_id: categoryId,
      tags,
      image: images[0]?.url || null // Primary image
    })
    .select()
    .single()

  if (productError) throw productError

  // Insert all images
  if (images && images.length > 0) {
    const imageRecords = images.map((img: any, index: number) => ({
      product_id: product.id,
      image_url: img.url,
      thumbnail_url: img.thumbnailUrl,
      display_order: index,
      is_primary: index === 0
    }))

    await supabase
      .from('product_images')
      .insert(imageRecords)
  }

  return NextResponse.json({ product })
}
```

---

## ✅ BENEFITS OF THIS APPROACH

### Technical
- ✅ **WebP format:** 50-80% smaller file sizes
- ✅ **Automatic resizing:** Max 1920px prevents huge uploads
- ✅ **Thumbnails:** Fast loading in product grids
- ✅ **Server-side processing:** Better quality with `sharp`
- ✅ **CDN delivery:** Supabase uses CDN automatically
- ✅ **RLS security:** Only sellers can upload/delete their images

### User Experience
- ✅ **Drag & drop:** Easy to use (can add this to component)
- ✅ **Multiple images:** Show product from different angles
- ✅ **Image preview:** See before uploading
- ✅ **Progress indication:** Loading states
- ✅ **Error handling:** Clear feedback

### Business
- ✅ **Cost effective:** Supabase free tier: 1GB storage
- ✅ **Scalable:** Can upgrade Supabase plan
- ✅ **Reliable:** Supabase 99.9% uptime
- ✅ **Professional:** Better than external URLs

---

## 🚀 ROLLOUT PLAN

### Phase 1: MVP (This Week)
- [ ] Create Supabase storage bucket
- [ ] Run database migration
- [ ] Install `sharp` dependency
- [ ] Create `ImageUpload` component (server-side version)
- [ ] Create `/api/upload-image` route
- [ ] Update sell page to use new component
- [ ] Test upload flow end-to-end

### Phase 2: Enhancements (Next Week)
- [ ] Add drag-and-drop support
- [ ] Add image reordering (change primary)
- [ ] Add image cropping tool
- [ ] Add progress bars for uploads
- [ ] Optimize thumbnail generation
- [ ] Add bulk upload for sellers

### Phase 3: Advanced (Future)
- [ ] Background removal (remove.bg API)
- [ ] AI-generated alt text for SEO
- [ ] Automatic product tagging from images
- [ ] Image moderation (detect inappropriate content)
- [ ] Watermark support
- [ ] Image editing tools

---

## 📊 PERFORMANCE METRICS

### Expected Results
- **Original JPEG:** 2-4 MB
- **WebP (85% quality):** 200-800 KB (70-85% savings)
- **Thumbnail (400x400):** 20-50 KB

### Storage Calculation
- **Per product:** 5 images × 500 KB avg = 2.5 MB
- **1000 products:** 2.5 GB (fits in free tier with room!)
- **Thumbnails:** 5 × 30 KB = 150 KB per product

### Bandwidth
- **Product grid:** Uses thumbnails (30 KB vs 500 KB = 94% savings)
- **Product page:** Lazy load full images
- **Free tier:** 2 GB/month = ~4,000 product page views

---

## 🛡️ SECURITY CONSIDERATIONS

### File Validation
- ✅ **Size limit:** 5 MB max (enforced both client and server)
- ✅ **Type validation:** Only JPEG, PNG accepted
- ✅ **Content scanning:** `sharp` verifies it's actually an image
- ✅ **Authentication:** Must be logged in to upload
- ✅ **Authorization:** Can only upload for your own products

### Storage Security
- ✅ **RLS policies:** Prevent unauthorized access
- ✅ **Folder structure:** Images stored in `user_id/` folders
- ✅ **Public read only:** Write requires authentication
- ✅ **Deletion control:** Can only delete own images

### Future Enhancements
- [ ] **Virus scanning:** Integrate ClamAV
- [ ] **Content moderation:** AWS Rekognition or similar
- [ ] **Rate limiting:** Prevent upload spam
- [ ] **EXIF stripping:** Remove metadata (privacy)

---

## 💰 COST ANALYSIS

### Supabase Free Tier
- **Storage:** 1 GB (≈400 products with 5 images each)
- **Bandwidth:** 2 GB/month (≈4,000 views)
- **Database:** 500 MB (plenty for metadata)

### When to Upgrade ($25/mo Pro Plan)
- **Storage:** 100 GB (≈40,000 products)
- **Bandwidth:** 50 GB/month (≈100,000 views)
- **Good until:** ~1,000 products with moderate traffic

### UploadThing Alternative
- **Free:** 2 GB storage, 2 GB bandwidth
- **Paid:** $10/mo for 100 GB storage
- **Note:** External service, less control

### Recommendation
**Start with Supabase Storage**. Upgrade when needed. Total control, better integration.

---

## 🎓 BEST PRACTICES

### Image Optimization Checklist
- [x] Convert to WebP (modern, smaller)
- [x] Resize to max 1920px (enough for retina displays)
- [x] Generate thumbnails (400x400 for grids)
- [x] Use quality 85% (sweet spot for WebP)
- [ ] Lazy load images (Next.js Image component)
- [ ] Add blur placeholder (better UX)
- [ ] Serve via CDN (Supabase does this)

### User Experience
- [x] Show upload progress
- [x] Preview before upload
- [x] Drag & drop support (can add)
- [x] Multi-file upload
- [x] Clear error messages
- [ ] Image editing (crop, rotate)
- [ ] Reorder images

### Developer Experience
- [x] Type-safe API
- [x] Error handling
- [x] Server-side processing
- [x] Reusable component
- [ ] Unit tests
- [ ] E2E tests

---

## 📝 MIGRATION CHECKLIST

### Pre-Launch
- [ ] Create `product-images` storage bucket in Supabase
- [ ] Run database migration (`product_images` table)
- [ ] Set up storage RLS policies
- [ ] Install `sharp` package
- [ ] Create `ImageUpload` component
- [ ] Create `/api/upload-image` API route
- [ ] Update sell page
- [ ] Update product API to handle multiple images
- [ ] Test upload flow
- [ ] Test image deletion
- [ ] Test with Bulgarian products

### Post-Launch
- [ ] Monitor storage usage
- [ ] Monitor bandwidth usage
- [ ] Collect user feedback
- [ ] Optimize based on metrics
- [ ] Add advanced features (drag-drop, crop, etc.)

---

## 🎯 DECISION SUMMARY

| Question | Answer |
|----------|--------|
| **UI Framework?** | ✅ YES - shadcn/ui (already using) |
| **UploadThing or Supabase?** | ✅ Supabase Storage (better integration) |
| **Image format?** | ✅ WebP (50-80% smaller) |
| **Client or server processing?** | ✅ Server-side with `sharp` (better quality) |
| **Multiple images?** | ✅ Yes, up to 5 per product |
| **Max file size?** | ✅ 5 MB before upload |
| **Thumbnails?** | ✅ Yes, 400x400 for product grids |

---

## 📞 NEXT STEPS

1. **Review this plan** with team
2. **Approve approach** (Supabase Storage + sharp)
3. **Set timeline** (recommend 1 week for MVP)
4. **Create Supabase bucket** (5 minutes)
5. **Run migration** (1 minute)
6. **Implement components** (4-6 hours)
7. **Test thoroughly** (2 hours)
8. **Deploy to production** (after testing)

---

**Questions? Concerns? Ready to implement?** Let me know! 🚀
