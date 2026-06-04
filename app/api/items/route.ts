import { createClient } from "@lib/supabase-server";
import { createServiceClient } from "@lib/supabase-service";
import { NextResponse } from "next/server";

// Get them item
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (!category || !slug) {
        return NextResponse.json({ error: "Category and slug are required." }, { status: 400 });
    }

    const serviceClient = createServiceClient();

    const {data: item, error} = await serviceClient
        .from("items")
        .select("*")
        .eq("category", category)
        .eq("slug", slug)
        .single();
    
    if (error) {
        console.error('Item fetch error', error)
        return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    return NextResponse.json({ item });
}

// Create them a new item
export async function POST(request: Request) {
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Log in to create an item." }, { status: 401 });
    }

    const { category, slug, name, description, image_url, content } = await request.json();

    if (!category || !slug || !name) {
        return NextResponse.json({ error: 'Category, slug, and name are required' }, { status: 400 })
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
        return NextResponse.json({ error: 'Slug must be lowercase and contain only letters, numbers, and dashes only' }, { status: 400 })
    }

    const serviceClient = createServiceClient();

    const  {data: existing} = await serviceClient
        .from("items")
        .select("id")
        .eq("category", category)
        .eq("slug", slug)
        .single();

    if (existing) {
        return NextResponse.json({ error: 'An item with this slug already exists in this category' }, { status: 409 })
    }

    const  {data: item, error} = await serviceClient
        .from("items")
        .insert({ category, slug, name, description: description || '', image_url: image_url || null, content: content || {} })
        .select()
        .single()
    
    if (error) {
        console.error('Item create error', error)
        return NextResponse.json({ error: "Failed to create item." }, { status: 500 });
    }

    return NextResponse.json({ success: true, item }, { status: 201 });
}