import { createClient } from "@/lib/supabase-server";
import { createServiceClient } from "@/lib/supabase-service";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return redirect("/login?error=auth_failed");
    }

    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !user) {
        console.error("Auth error:", error);
        return redirect("/login?error=auth_failed");
    }

    const metadata = user.user_metadata ?? {};
    const provider = user.app_metadata?.provider ?? "oauth";

    // Username
    const userName = 
        metadata.full_name ||
        metadata.name ||
        user.email?.split("@")[0]

    // Avatar
    let avatarUrl = metadata.avatar_url || metadata.picture || null;

    const serviceClient = createServiceClient();
    const { error: upsertError } = await serviceClient
        .from("users")
        .upsert({
            id: user.id,
            user_name: userName,
            user_avatar: avatarUrl,
        }, { onConflict: "id" });

    if (upsertError) {
        console.error("Upsert error:", upsertError);
    }

    return redirect("/");
}