'use server'

import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
    const supabase = await createClient()
    const cookieStore = await cookies();

    cookieStore.set("authjs.session-token", "", { 
        path: "/", 
        maxAge: 0 
    });

    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
}