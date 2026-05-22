import { createClient } from "../../../lib/supabase-server";
import { NextResponse } from "next/server";

async function fetchDiscordAvatar(accessToken: string, userId: string) {
    try {
        const res = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        const data = await res.json()
        
        if (data.avatar) {
            const isGif = data.avatar.startsWith('a_')
            const ext = isGif ? 'gif' : 'png'
            return `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${ext}`
        }
        return null
    } catch (e) {
        console.error('Discord API error:', e)
        return null
    }
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient()
        const { data: { user, session }, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error && user && session) {
            const metadata = user.user_metadata || {}
            const provider = user.app_metadata?.provider || 'discord'
            
            // Try to get avatar from metadata first
            let avatarUrl = metadata.avatar_url 
                || metadata.picture 
                || metadata.custom_claims?.avatar_url

            // If not in metadata, fetch from Discord API
            if (!avatarUrl && provider === 'discord') {
                avatarUrl = await fetchDiscordAvatar(session.provider_token || '', user.id)
            }

            // Fallback for Discord specific format
            if (!avatarUrl && metadata.avatar && metadata.provider_id) {
                const isGif = metadata.avatar.startsWith('a_')
                const ext = isGif ? 'gif' : 'png'
                avatarUrl = `https://cdn.discordapp.com/avatars/${metadata.provider_id}/${metadata.avatar}.${ext}`
            }

            const { error: upsertError } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    user_email: user.email,
                    user_name: metadata.full_name 
                        || metadata.name 
                        || metadata.custom_claims?.global_name
                        || metadata.custom_claims?.username
                        || user.email?.split('@')[0],
                    user_pfp: avatarUrl || '/Images/pfp/default.webp',
                    oauth_provider: provider,
                    oauth_id: metadata.provider_id || metadata.sub,
                }, { onConflict: 'id' })

            return NextResponse.redirect(`${origin}/`)
        }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
