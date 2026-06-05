export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { createClient } from "../../../lib/supabase-server";
import { createServiceClient } from "../../../lib/supabase-service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    console.log("=== CALLBACK HIT ===");
    console.log("URL:", request.url);
    
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    
    console.log("Code:", code ? "PRESENT" : "MISSING");
    console.log("Origin:", origin);

    if (!code) {
        console.log("No code, redirecting to login");
        return NextResponse.redirect(`${origin}/login?error=no_code`);
    }

    const supabase = await createClient();
    console.log("Supabase client created");

    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log("Exchange result:", error ? `ERROR: ${error.message}` : `User: ${user?.id}`);

    if (error || !user) {
        return NextResponse.redirect(`${origin}/login?error=exchange_failed`);
    }

    // ... rest of upsert logic
    
    console.log("Redirecting to origin");
    return NextResponse.redirect(`${origin}/`);
}