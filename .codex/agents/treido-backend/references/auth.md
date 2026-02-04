# auth.md — Supabase Auth Flows

> Authentication patterns for Treido marketplace.

## Auth Methods

Treido supports:
- Email/Password
- OAuth (Google, Facebook)
- Magic Link (passwordless)

## Email/Password

### Sign Up

```tsx
'use server';
import { createClient } from '@/lib/supabase/server';

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('name'),
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { data };
}
```

### Sign In

```tsx
'use server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  redirect('/');
}
```

### Sign Out

```tsx
'use server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
```

## OAuth

### Initiate OAuth

```tsx
'use server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signInWithGoogle() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  
  if (error) {
    return { error: error.message };
  }
  
  redirect(data.url);
}
```

### OAuth Callback

```tsx
// app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';
  
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  
  // Error: redirect to error page
  return NextResponse.redirect(`${origin}/auth/error`);
}
```

## Magic Link

```tsx
'use server';
import { createClient } from '@/lib/supabase/server';

export async function signInWithMagicLink(formData: FormData) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signInWithOtp({
    email: formData.get('email') as string,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true, message: 'Check your email for the magic link' };
}
```

## Password Reset

### Request Reset

```tsx
'use server';
export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get('email') as string,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    }
  );
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}
```

### Update Password

```tsx
'use server';
export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.updateUser({
    password: formData.get('password') as string,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  redirect('/');
}
```

## Protected Routes

### Server Component

```tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  return <div>Welcome, {user.email}</div>;
}
```

### Middleware (proxy.ts)

```tsx
// proxy.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // Protected routes
  const protectedPaths = ['/dashboard', '/seller', '/orders'];
  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );
  
  if (isProtected && !user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  return supabaseResponse;
}
```

## User Profile

### Create profile on sign up

```sql
-- Trigger to create profile on sign up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
```

### Update profile

```tsx
'use server';
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Unauthorized' };
  }
  
  // Update auth metadata
  await supabase.auth.updateUser({
    data: {
      full_name: formData.get('name'),
    },
  });
  
  // Update profile table
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: formData.get('name'),
      avatar_url: formData.get('avatar'),
    })
    .eq('id', user.id);
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath('/profile');
  return { success: true };
}
```

## Session Management

### Get session

```tsx
// Server
const { data: { session } } = await supabase.auth.getSession();

// Client
const { data: { session } } = await supabase.auth.getSession();
```

### Refresh session

```tsx
// Handled automatically by @supabase/ssr
// But can manually refresh:
const { data: { session } } = await supabase.auth.refreshSession();
```

### Session events (client)

```tsx
'use client';

useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in');
      }
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
      }
    }
  );
  
  return () => subscription.unsubscribe();
}, []);
```

## Error Handling

```tsx
const errorMessages: Record<string, string> = {
  'Invalid login credentials': 'Invalid email or password',
  'Email not confirmed': 'Please verify your email first',
  'User already registered': 'An account with this email already exists',
  'Password should be at least 6 characters': 'Password too short',
};

function getErrorMessage(error: string): string {
  return errorMessages[error] || error;
}
```
