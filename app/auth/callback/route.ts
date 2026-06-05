export const runtime = "nodejs";
import { createClient } from "@lib/supabase-server";
import { createServiceClient } from "@lib/supabase-service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=auth_failed`)
    }

    if (code) {
        // This exchanges the code and sets the session cookie
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error && user) {
            const metadata = user.user_metadata || {}
            const customClaims = metadata.custom_claims || {}

            const userName = 
                customClaims.global_name ||
                metadata.full_name ||
                metadata.name ||
                user.email?.split('@')[0]

            const avatarUrl = metadata.avatar_url || metadata.picture

            // Use service role client to bypass RLS for upsert
            const serviceClient = createServiceClient()

            const { error: upsertError } = await serviceClient
                .from('users')
                .upsert({
                    id: user.id,
                    user_email: user.email,
                    user_name: userName,
                    user_pfp: avatarUrl || '/Images/pfp/default.webp',
                    oauth_provider: user.app_metadata?.provider || 'discord',
                    oauth_id: metadata.provider_id || metadata.sub,
                }, { onConflict: 'id' })

            if (upsertError) {
                console.error('Upsert error:', upsertError)
            }

            return NextResponse.redirect(`${origin}/`)
        }
        
        if (error) console.error('Auth error:', error)
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}