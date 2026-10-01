import { createClient } from "@/lib/supabase-server";
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

    return redirect("/");
}