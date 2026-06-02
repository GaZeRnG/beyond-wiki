"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase-browser";

interface Item {
    slug: string;
    name: string;
    description: string | null;
    image_url: string | null;
    mod_source: string | null;
}

const validCategories = [
    "weapons", "tools", "armor", "accessories", "ammo",
    "bars", "ores", "potions", "minions", "blocks", "crafting-stations"
];

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const category = params.category as string;

    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [newSlug, setNewSlug] = useState("");
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newModSource, setNewModSource] = useState("");
    const [adding, setAdding] = useState(false);
    const [addError, setAddError] = useState("");

    const supabase = createClient();

    useEffect(() => {
        if (!validCategories.includes(category)) {
            router.push("/beyond-depth");
            return;
        }

        fetch(`/api/items/list?category=${category}`)
            .then((res) => res.json())
            .then((data) => {
                setItems(data.items || []);
                setLoading(false);
            });

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, [category, router]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddError("");
        setAdding(true);

        const res = await fetch("/api/items", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                category,
                slug: newSlug.toLowerCase().replace(/\s+/g, "-"),
                name: newName,
                description: newDescription,
                image_url: newImageUrl || null,
                mod_source: newModSource || null,
                content: {},
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setAddError(data.error || "Failed to add item.");
            setAdding(false);
            return;
        }

        setItems([...items, data.item]);
        setShowAddModal(false);
        setNewSlug("");
        setNewName("");
        setNewDescription("");
        setNewImageUrl("");
        setNewModSource("");
        setAdding(false);

        router.push(`/beyond-depth/${category}/${data.item.slug}`);
    };

    if (loading) return <main className="category-page"><p>Loading...</p></main>;

    return (
        <main className="category-page">
            <nav className="breadcrumb">
                <Link href="/beyond-depth">Beyond Depth</Link> / 
                <span className="capitalize">{category}</span>
            </nav>

            <div className="flex justify-between items-center mb-4">
                <h1 className="category-title capitalize">{category}</h1>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        + Add Item
                    </button>

            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-lg w-full mx-4 p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Add New {category.slice(0, -1)}</h2>
                        
                        {addError && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-2 rounded mb-4 text-sm">
                                {addError}
                            </div>
                        )}

                        <form onSubmit={handleAdd} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Slug (URL name): e.g. diamond-sword"
                                value={newSlug}
                                onChange={(e) => setNewSlug(e.target.value)}
                                required
                                pattern="[a-z0-9-]+"
                                className="w-full bg-neutral-800 text-white px-3 py-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Item Name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                required
                                className="w-full bg-neutral-800 text-white px-3 py-2 rounded"
                            />
                            <textarea
                                placeholder="Description"
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                rows={3}
                                className="w-full bg-neutral-800 text-white px-3 py-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Image URL (optional)"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                className="w-full bg-neutral-800 text-white px-3 py-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Mod Source (optional)"
                                value={newModSource}
                                onChange={(e) => setNewModSource(e.target.value)}
                                className="w-full bg-neutral-800 text-white px-3 py-2 rounded"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={adding}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                                >
                                    {adding ? "Adding..." : "Add Item"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="item-grid">
                {items.map((item) => (
                    <Link
                        key={item.slug}
                        href={`/beyond-depth/${category}/${item.slug}`}
                        className="item-card"
                    >
                        <div className="item-image">
                            {item.image_url ? (
                                <Image
                                    src={item.image_url}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    unoptimized={item.image_url.startsWith("http")}
                                />
                            ) : (
                                <div className="placeholder-image">?</div>
                            )}
                        </div>
                        <div className="item-info">
                            <h3>{item.name}</h3>
                            {item.mod_source && (
                                <span className="mod-tag">{item.mod_source}</span>
                            )}
                            {item.description && (
                                <p className="item-desc">{item.description}</p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {items.length === 0 && (
                <p className="empty-state">No {category} added yet.</p>
            )}
        </main>
    );
}