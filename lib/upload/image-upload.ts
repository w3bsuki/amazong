import 'server-only'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'

export interface ImageUploadOptions {
  /** Maximum image dimension (default: 1920) */
  maxDimension?: number
  /** WebP quality (default: 85) */
  quality?: number
  /** Whether to create a thumbnail (default: false) */
  createThumbnail?: boolean
  /** Thumbnail size (default: 400) */
  thumbnailSize?: number
  /** Storage path prefix (default: user.id) */
  pathPrefix?: string
  /** Max file size in bytes (default: 5MB) */
  maxFileSize?: number
}

export interface ImageUploadResult {
  url: string
  thumbnailUrl?: string
  success: true
}

/**
 * Shared image upload handler for API routes.
 * Handles authentication, validation, image processing, and storage upload.
 * 
 * @example
 * // In your route.ts:
 * export async function POST(request: NextRequest) {
 *   return handleImageUpload(request, {
 *     maxDimension: 1200,
 *     createThumbnail: false,
 *     pathPrefix: 'chat'
 *   })
 * }
 */
export async function handleImageUpload(
  request: Request,
  options: ImageUploadOptions = {}
): Promise<NextResponse> {
  const {
    maxDimension = 1920,
    quality = 85,
    createThumbnail = false,
    thumbnailSize = 400,
    pathPrefix,
    maxFileSize = 5 * 1024 * 1024,
  } = options

  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

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

    // Validate file size
    if (file.size > maxFileSize) {
      const maxMB = Math.round(maxFileSize / 1024 / 1024)
      return NextResponse.json({ error: `File too large (max ${maxMB}MB)` }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Process with sharp (resize + convert to WebP)
    const webpBuffer = await sharp(buffer)
      .resize(maxDimension, maxDimension, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer()

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).slice(2)
    const prefix = pathPrefix ? `${pathPrefix}/${user.id}` : user.id
    const fileName = `${prefix}/${timestamp}-${random}.webp`

    // Upload full image
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, webpBuffer, {
        contentType: 'image/webp',
        upsert: false,
      })

    if (uploadError) {
      console.error('Image upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload image: ' + uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadData.path)

    const result: ImageUploadResult = {
      url: publicUrl,
      success: true,
    }

    // Optionally create thumbnail
    if (createThumbnail) {
      const thumbnailBuffer = await sharp(buffer)
        .resize(thumbnailSize, thumbnailSize, {
          fit: 'cover',
        })
        .webp({ quality: 80 })
        .toBuffer()

      const thumbnailName = `${prefix}/thumb-${timestamp}-${random}.webp`

      const { error: thumbError } = await supabase.storage
        .from('product-images')
        .upload(thumbnailName, thumbnailBuffer, {
          contentType: 'image/webp',
          upsert: false,
        })

      if (!thumbError) {
        const { data: { publicUrl: thumbnailUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(thumbnailName)
        result.thumbnailUrl = thumbnailUrl
      } else {
        console.error('Thumbnail upload error:', thumbError)
        // Continue even if thumbnail fails, we have the main image
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
