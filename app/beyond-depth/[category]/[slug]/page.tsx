"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../../lib/supabase-browser";

interface ItemContent {
    stats?: Record<string, number | string>;
    how_to_get?: string;
    how_to_use?: string;
    rarity?: string;
    stack_size?: number;
}

interface Item {
    id: number;
    name: string;
    description: string;
    image_url: string | null;
    mod_source: string | null;
    content: ItemContent;
    category: string;
}

export default function ItemPage() {
    const params = useParams();
    const router = useRouter();
    const category = params.category as string;
    const slug = params.slug as string;

    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editHowToGet, setEditHowToGet] = useState("");
    const [editHowToUse, setEditHowToUse] = useState("");
    const [editStats, setEditStats] = useState<Record<string, string>>({});
    const [editSummary, setEditSummary] = useState("");

    const supabase = createClient();

    useEffect(() => {
        fetch(`/api/items?category=${category}&slug=${slug}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.item) {
                    setItem(data.item);
                    setEditName(data.item.name);
                    setEditDescription(data.item.description || "");
                    setEditHowToGet(data.item.content?.how_to_get || "");
                    setEditHowToUse(data.item.content?.how_to_use || "");
                    setEditStats(
                        Object.entries(data.item.content?.stats || {}).reduce(
                            (acc, [k, v]) => ({ ...acc, [k]: String(v) }),
                            {}
                        )
                    );
                }
                setLoading(false);
            });

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, [category, slug]);

    const handleSave = async () => {
        if (!item) return;
        setSaving(true);
        setError("");

        const newContent = {
            ...item.content,
            how_to_get: editHowToGet,
            how_to_use: editHowToUse,
            stats: Object.entries(editStats).reduce(
                (acc, [k, v]) => ({ ...acc, [k]: isNaN(Number(v)) ? v : Number(v) }),
                {}
            ),
        };

        const res = await fetch(`/api/items/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: editName,
                description: editDescription,
                content: newContent,
                edit_summary: editSummary,
            }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Failed to save changes.");
            setSaving(false);
            return;
        }

        setItem({
            ...item,
            name: editName,
            description: editDescription,
            content: newContent,
        });
        setEditMode(false);
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!item) return;
        if (!confirm("Are you sure you want to delete this item? This cannot be undone.")) return;

        setDeleting(true);
        const res = await fetch(`/api/items/${item.id}`, { method: "DELETE" });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Failed to delete.");
            setDeleting(false);
            return;
        }

        router.push(`/beyond-depth/${category}`);
    };

    if (loading) return <main className="item-detail-page"><p>Loading...</p></main>;
    if (!item) return <main className="item-detail-page"><p>Item not found.</p></main>;

    const content = item.content;

    return (
        <main className="item-detail-page">
            <nav className="breadcrumb">
                <Link href="/beyond-depth">Beyond Depth</Link> / 
                <Link href={`/beyond-depth/${category}`} className="capitalize">{category}</Link> / 
                <span>{item.name}</span>
            </nav>

            <div className="edit-bar flex justify-between items-center mb-4">
                {user ? (
                    editMode ? (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                onClick={() => setEditMode(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Edit Page
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    )
                ) : (
                    <Link href="/login" className="text-blue-400 hover:text-blue-300 text-sm">
                        Sign in to edit
                    </Link>
                )}
            </div>

            {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {editMode && (
                <div className="edit-summary mb-4">
                    <input
                        type="text"
                        placeholder="Edit summary (what did you change?)"
                        value={editSummary}
                        onChange={(e) => setEditSummary(e.target.value)}
                        className="w-full bg-neutral-800 text-white px-3 py-2 rounded"
                    />
                </div>
            )}

            <header className="item-header">
                <div className="item-image-large">
                    {item.image_url ? (
                        <Image
                            src={item.image_url}
                            alt={item.name}
                            width={128}
                            height={128}
                            unoptimized={item.image_url.startsWith("http")}
                        />
                    ) : (
                        <div className="placeholder-image large">?</div>
                    )}
                </div>
                <div className="item-title">
                    {editMode ? (
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-neutral-800 text-white text-2xl font-bold px-2 py-1 rounded w-full"
                        />
                    ) : (
                        <h1>{item.name}</h1>
                    )}
                    {item.mod_source && (
                        <span className="mod-badge">{item.mod_source}</span>
                    )}
                    {content.rarity && !editMode && (
                        <span className={`rarity ${content.rarity.toLowerCase()}`}>
                            {content.rarity}
                        </span>
                    )}
                </div>
            </header>

            <section className="item-description">
                <h2>Description</h2>
                {editMode ? (
                    <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="w-full bg-neutral-800 text-white px-3 py-2 rounded"
                    />
                ) : (
                    <p>{item.description || "No description available."}</p>
                )}
            </section>

            {((content.stats && Object.keys(content.stats).length > 0) || editMode) && (
                <section className="item-stats">
                    <h2>Stats</h2>
                    <div className="stats-grid">
                        {editMode ? (
                            Object.entries(editStats).map(([key, value]) => (
                                <div key={key} className="stat-box">
                                    <span className="stat-name capitalize">
                                        {key.replace(/_/g, " ")}
                                    </span>
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) =>
                                            setEditStats({ ...editStats, [key]: e.target.value })
                                        }
                                        className="bg-neutral-800 text-white px-2 py-1 rounded w-full"
                                    />
                                </div>
                            ))
                        ) : (
                            content.stats &&
                            Object.entries(content.stats).map(([key, value]) => (
                                <div key={key} className="stat-box">
                                    <span className="stat-name capitalize">
                                        {key.replace(/_/g, " ")}
                                    </span>
                                    <span className="stat-value">{value}</span>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            )}

            <section className="item-how-to-get">
                <h2>How to Get</h2>
                {editMode ? (
                    <textarea
                        value={editHowToGet}
                        onChange={(e) => setEditHowToGet(e.target.value)}
                        rows={4}
                        className="w-full bg-neutral-800 text-white px-3 py-2 rounded"
                    />
                ) : (
                    <p>{content.how_to_get || "No information available."}</p>
                )}
            </section>

            <section className="item-how-to-use">
                <h2>How to Use</h2>
                {editMode ? (
                    <textarea
                        value={editHowToUse}
                        onChange={(e) => setEditHowToUse(e.target.value)}
                        rows={4}
                        className="w-full bg-neutral-800 text-white px-3 py-2 rounded"
                    />
                ) : (
                    <p>{content.how_to_use || "No information available."}</p>
                )}
            </section>

            {content.stack_size !== undefined && !editMode && (
                <section className="item-meta">
                    <span>Stack Size: {content.stack_size}</span>
                </section>
            )}
        </main>
    );
}