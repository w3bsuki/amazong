import { NextResponse } from 'next/server'
import { getCategoryContext } from '@/lib/data/categories'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  if (!slug) {
    return NextResponse.json(
      { error: 'Slug is required' },
      { status: 400 }
    )
  }

  try {
    const context = await getCategoryContext(slug)

    if (!context) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(context)
  } catch (error) {
    console.error('Error fetching category context:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
