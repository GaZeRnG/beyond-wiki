import { createClient } from "../../../lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error && user) {
            // DEBUG: Log what Discord actually sends
            console.log('=== DISCORD USER METADATA ===')
            console.log(JSON.stringify(user.user_metadata, null, 2))
            console.log('=== APP METADATA ===')
            console.log(JSON.stringify(user.app_metadata, null, 2))
            console.log('=== FULL USER ===')
            console.log(JSON.stringify({
                id: user.id,
                email: user.email,
                avatar_url: user.user_metadata?.avatar_url,
                picture: user.user_metadata?.picture,
                avatar: user.user_metadata?.avatar,
                custom_claims: user.user_metadata?.custom_claims,
            }, null, 2))

            const metadata = user.user_metadata || {}
            const provider = user.app_metadata?.provider || 'discord'

            // Discord specific avatar construction
            let avatarUrl = metadata.avatar_url 
                || metadata.picture 
                || metadata.custom_claims?.avatar_url

            // Discord avatar requires special URL construction
            if (!avatarUrl && metadata.avatar && metadata.provider_id) {
                // Discord avatar hash format: https://cdn.discordapp.com/avatars/{user_id}/{avatar_hash}.png
                const isGif = metadata.avatar.startsWith('a_')
                const ext = isGif ? 'gif' : 'png'
                avatarUrl = `https://cdn.discordapp.com/avatars/${metadata.provider_id}/${metadata.avatar}.${ext}`
            }

            console.log('=== CONSTRUCTED AVATAR URL ===')
            console.log(avatarUrl)

            const { error: upsertError } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    user_email: user.email,
                    user_name: metadata.full_name 
                        || metadata.name 
                        || metadata.user_name 
                        || metadata.custom_claims?.global_name
                        || metadata.custom_claims?.username
                        || user.email?.split('@')[0],
                    user_pfp: avatarUrl || '/Images/pfp/default.webp',
                    oauth_provider: provider,
                    oauth_id: metadata.provider_id || metadata.sub,
                }, { onConflict: 'id' })

            if (upsertError) {
                console.error('Upsert error:', upsertError)
            }

            return NextResponse.redirect(`${origin}/`)
        }
        
        if (error) {
            console.error('Auth error:', error)
        }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
