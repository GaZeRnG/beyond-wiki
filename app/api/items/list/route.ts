import { createServiceClient } from "@lib/supabase-service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category) {
        return NextResponse.json({ error: "Category is required." }, { status: 400 });
    }

    const serviceClient = createServiceClient();

    const { data: items, error } = await serviceClient
        .from("items")
        .select("slug, name, description, image_url")
        .eq("category", category)
        .order("name");

    if (error) {
        console.error('List error:', error)
        return NextResponse.json({ error: "Failed to fetch items." }, { status: 500 });
    }

    return NextResponse.json({ items: items || [] });
}