import { createClient } from "@lib/supabase-server";
import { createServiceClient } from "@lib/supabase-service";
import { NextResponse } from "next/server";

// Update le item
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string}> }
) {
    const {id} = await params
    const itemId = parseInt(id)

    if (isNaN(itemId)) {
        return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Log in to update an item." }, { status: 401 });
    }

    const { name, description, image_url, content } = await request.json();
    const serviceClient = createServiceClient();

    const {data: currentItem} = await serviceClient
        .from("items")
        .select("name, description, image_url, content")
        .eq("id", itemId)
        .single();

    if (!currentItem) {
        return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    const {data: userData} = await serviceClient
        .from("users")
        .select("user_name")
        .eq("id", user.id)
        .single();

    const editorName = userData?.user_name || user.email?.split("@")[0] || "Anonymous";

    const {error: updateError} = await serviceClient
        .from("items")
        .update({ 
            name, 
            description, 
            image_url: image_url || null,
            content, 
            updated_at: new Date().toISOString() 
        })
        .eq("id", itemId);

    if (updateError) {
        console.error('Update error:', updateError);
        return NextResponse.json({ error: "Failed to update item." }, { status: 500 });
    }

    await serviceClient
        .from("item_edits")
        .insert({
            item_id: itemId,
            editor_id: user.id,
            editor_name: editorName,
            old_content: { name: currentItem.name, description: currentItem.description, image_url: currentItem.image_url, content: currentItem.content },
            new_content: { name, description, image_url, content },
            edit_summary: `Updated ${currentItem.name}.`,
        });
    
    return NextResponse.json({ success: true, message: "Item updated successfully." });
}

// Delete le item
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const {id} = await params
    const itemId = parseInt(id)

    if (isNaN(itemId)) {
        return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Log in to delete an item." }, { status: 401 });
    }

    const serviceClient = createServiceClient();

    const {error} = await serviceClient
        .from("items")
        .delete()
        .eq("id", itemId);
    
    if (error) {
        console.error('Delete error:', error)
        return NextResponse.json({ error: "Failed to delete item." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully." });
}