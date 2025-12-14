import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        authenticated: false, 
        error: authError?.message || 'No user',
        cookies: 'check browser'
      })
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name, business_name, username, account_type')
      .eq('id', user.id)
      .single()
    
    return NextResponse.json({
      authenticated: true,
      user: { id: user.id, email: user.email },
      profile: profile || null,
      profileError: profileError?.message || null
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
