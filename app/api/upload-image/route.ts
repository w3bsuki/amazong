import { NextRequest } from 'next/server'
import { handleImageUpload } from '@/lib/upload/image-upload'

export async function POST(request: NextRequest) {
  return handleImageUpload(request, {
    maxDimension: 1920,
    quality: 85,
    createThumbnail: true,
    thumbnailSize: 400,
  })
}