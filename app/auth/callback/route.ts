import { createClient } from "../../../lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error && user) {
            // Sync OAuth user to your table
            const provider = user.app_metadata?.provider
            const metadata = user.user_metadata || {}

            await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    user_email: user.email,
                    user_name: metadata.full_name || metadata.name || metadata.user_name || user.email?.split('@')[0],
                    user_pfp: metadata.avatar_url || metadata.picture || '/Images/pfp/default.webp',
                    oauth_provider: provider,
                    oauth_id: metadata.sub || metadata.provider_id,
                }, { onConflict: 'id' })

            return NextResponse.redirect(`${origin}/`)
        }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}