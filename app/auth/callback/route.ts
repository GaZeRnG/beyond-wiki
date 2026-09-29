import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return redirect("/login?error=auth_failed");
    }

    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("hii");

    if (error || !user) {
        console.error("Auth error:", error);
        return redirect("/login?error=auth_failed");
    }

    const metadata = user.user_metadata || {};
    const customClaims = metadata.custom_claims || {};
    const provider = user.app_metadata?.provider || "oauth";

    // Extract avatar
    let avatarUrl: string | null = null;

    // Google
    if (provider === "google") {
        avatarUrl = metadata.avatar_url || metadata.picture || null;
    }

    // Discord
    if (provider === "discord") {
        avatarUrl = metadata.avatar_url || metadata.picture || null;

        if (!avatarUrl && customClaims.avatar && metadata.provider_id) {
            const hash = String(customClaims.avatar);
            const discordId = String(metadata.provider_id);
            const ext = hash.startsWith("a_") ? "gif" : "png";
            avatarUrl = `https://cdn.discordapp.com/avatars/${discordId}/${hash}.${ext}`;
        }
    }

    return redirect("/");
}