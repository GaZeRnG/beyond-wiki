import { createClient } from "@lib/supabase-server";
import { createServiceClient } from "@lib/supabase-service";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient();
        const {data: {user}, error} = await supabase.auth.exchangeCodeForSession(code)

        if (!error && user) {
            const metadata = user.user_metadata || {};
            const customClaims = metadata.custom_claims || {};

            const userName = 
                customClaims.global_name ||
                metadata.full_name ||
                metadata.name ||
                user.email?.split('@')[0]
            
            const avatarUrl = metadata.avatar_url || metadata.picture;

            const serviceClient = createServiceClient();

            const { error: upsertError } = await serviceClient
                .from('users')
                .upsert({
                    id: user.id,
                    user_email: user.email,
                    user_name: userName,
                    user_pfp: avatarUrl || '/Images/pfp/default.png',
                    oauth_provider: user.app_metadata?.provider || null,
                    oauth_id: metadata.provider_id || metadata.sub,
                }, { onConflict: 'id' });
            
            if (upsertError) {
                console.error('Error upserting user:', upsertError);
            }

            return redirect('/');
        }

        if (error) {
            console.error('Error exchanging code for session:', error);
        }

        return redirect('/');
    }
}