import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
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

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
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
      return NextResponse.json({ error: 'Failed to upload image: ' + uploadError.message }, { status: 500 })
    }

    // Upload thumbnail
    const { error: thumbError } = await supabase.storage
      .from('product-images')
      .upload(thumbnailName, thumbnailBuffer, {
        contentType: 'image/webp',
        upsert: false
      })

    if (thumbError) {
      console.error('Thumbnail upload error:', thumbError)
      // Continue even if thumbnail fails, we have the main image
    }

    // Get public URLs
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(uploadData.path)

    const { data: { publicUrl: thumbnailUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(thumbnailName)

    return NextResponse.json({
      url: publicUrl,
      thumbnailUrl: thumbnailUrl,
      size: webpBuffer.length,
      originalSize: file.size,
      compression: ((1 - webpBuffer.length / file.size) * 100).toFixed(1) + '%'
    })

  } catch (error) {
    console.error('Image upload error:', error)
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
