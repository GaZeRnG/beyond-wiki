import { createClient } from "../../../lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const remember = searchParams.get('remember') === '1'

    if (code) {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error && user) {
            if (remember) {
                const {data: sessionData} = await supabase.auth.getSession()
            }

            const metadata = user.user_metadata || {}
            const provider = user.app_metadata?.provider || 'discord'

            let avatarUrl = metadata.avatar_url || metadata.picture || metadata.custom_claims?.avatar_url

            if (!avatarUrl && metadata.avatar && metadata.provider_id) {
                const avatarHash = String(metadata.avatar)
                const providerId = String(metadata.provider_id)
                const isGif = avatarHash.startsWith('a_')
                const ext = isGif ? 'gif' : 'png'
                avatarUrl = `https://cdn.discordapp.com/avatars/${providerId}/${avatarHash}.${ext}`
            }

            const {error:upSertError} = await supabase
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
                    user_pfp: avatarUrl || '/Images/pfp/default.png',
                    oauth_provider: provider,
                    oauth_id: metadata.provider_id || metadata.sub,
                }, {onConflict: 'id'});
            
            if (upSertError) {
                console.error('Upsert error:', upSertError);
            }

            return NextResponse.redirect(`${origin}/`)
        }

        if (error) {
            console.error('Auth error:', error);
        }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
