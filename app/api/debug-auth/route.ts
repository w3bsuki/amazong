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
    
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select('id, store_name, account_type')
      .eq('id', user.id)
      .single()
    
    return NextResponse.json({
      authenticated: true,
      user: { id: user.id, email: user.email },
      seller: seller || null,
      sellerError: sellerError?.message || null
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
