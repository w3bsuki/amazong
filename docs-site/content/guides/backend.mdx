# Backend Guide

Working with Supabase, API routes, and server-side logic.

## Supabase Setup

### Client Usage

```tsx
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Server Usage

```tsx
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

## Database Queries

### Fetching Data

```tsx
// Server component
async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*, seller:profiles(*)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(20)
  
  if (error) throw error
  return data
}
```

### Inserting Data

```tsx
async function createListing(listing: NewListing) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings')
    .insert(listing)
    .select()
    .single()
  
  if (error) throw error
  return data
}
```

## API Routes

### Route Handler

```tsx
// app/api/listings/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('listings')
    .insert(body)
    .select()
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json(data, { status: 201 })
}
```

## Server Actions

```tsx
// app/actions/listings.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createListing(formData: FormData) {
  const supabase = await createClient()
  
  const listing = {
    title: formData.get('title') as string,
    price: Number(formData.get('price')),
    description: formData.get('description') as string,
  }
  
  const { error } = await supabase
    .from('listings')
    .insert(listing)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/listings')
  return { success: true }
}
```

## Authentication

```tsx
// Check auth in server component
async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return <Dashboard user={user} />
}
```
