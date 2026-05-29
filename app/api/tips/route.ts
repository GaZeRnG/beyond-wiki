import { createServiceClient } from "@lib/supabase-service";
import { createClient } from "@lib/supabase-server";
import { NextResponse } from "next/server";

// Get tips
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pack = searchParams.get("pack");

    if (!pack) {
        return NextResponse.json({ error: "Pack is required." }, { status: 400 });
    }

    const serviceClient = createServiceClient();
    
    const { data: tips, error } = await serviceClient
        .from("tips")
        .select("tip_id, tip_title, author, created_at")
        .eq("pack", pack)
        .order("created_at", { ascending: false });
    
    if (error) {
        console.error('Tips fetch error:', error);
        return NextResponse.json({ error: "Failed to fetch tips." }, { status: 500 });
    }

    return NextResponse.json({ tips: tips || [] });
}

// Add new tips
export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Log in to add a tip' }, { status: 401 })
        }

        const { tip_title, tip_content, anonymous, pack } = await request.json()

        if (!tip_title?.trim() || !tip_content?.trim() || !pack?.trim()) {
            return NextResponse.json({ error: 'Title, content, and pack are required' }, { status: 400 })
        }

        const serviceClient = createServiceClient()

        // Anonymous or nah
        let author = 'Anonymous'
        if (!anonymous) {
            const { data: userData } = await serviceClient
                .from('users')
                .select('user_name')
                .eq('id', user.id)
                .single()
            author = userData?.user_name || user.email?.split('@')[0] || 'Anonymous'
        }

        const { data: tip, error } = await serviceClient
            .from('tips')
            .insert({
                tip_title: tip_title.trim(),
                tip_content: tip_content.trim(),
                author,
                pack: pack.trim(),
            })
            .select()
            .single()

        if (error) {
            console.error('Tip insert error:', error)
            return NextResponse.json({ error: 'Failed to add tip' }, { status: 500 })
        }

        return NextResponse.json({ success: true, tip }, { status: 201 })

    } catch (err) {
        console.error('POST tip error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}