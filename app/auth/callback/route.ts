import { createClient } from "../../../lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error && user) {
            const metadata = user.user_metadata || {}
            const provider = user.app_metadata?.provider || 'discord'
            const customClaims = metadata.custom_claims || {}

            // DEBUG: Log the actual structure so you can see what Discord sends
            console.log('=== DISCORD METADATA ===')
            console.log(JSON.stringify(metadata, null, 2))

            // --- FIX 1: Username extraction ---
            // Discord sends: custom_claims.global_name (display name), custom_claims.username (handle)
            // Also check: preferred_username, full_name, name, user_name
            const userName = 
                customClaims.global_name ||      // Discord display name (what you want)
                customClaims.username ||         // Discord handle (@username)
                metadata.preferred_username ||   // Alternative location
                metadata.full_name ||            // Generic fallback
                metadata.name ||
                metadata.user_name ||
                user.email?.split('@')[0]        // Last resort

            // --- FIX 2: Avatar extraction ---
            let avatarUrl = metadata.avatar_url  // Supabase sometimes provides this directly
            
            // If not, construct from Discord avatar hash
            if (!avatarUrl) {
                const avatarHash = customClaims.avatar || metadata.avatar
                const discordId = customClaims.id || metadata.provider_id || metadata.sub
                
                if (avatarHash && discordId) {
                    const isGif = String(avatarHash).startsWith('a_')
                    const ext = isGif ? 'gif' : 'png'
                    avatarUrl = `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.${ext}`
                }
            }

            console.log('=== EXTRACTED ===')
            console.log('Username:', userName)
            console.log('Avatar URL:', avatarUrl)

            const { error: upsertError } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    user_email: user.email,
                    user_name: userName,
                    user_pfp: avatarUrl || '/Images/pfp/default.webp',
                    oauth_provider: provider,
                    oauth_id: customClaims.id || metadata.provider_id || metadata.sub,
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