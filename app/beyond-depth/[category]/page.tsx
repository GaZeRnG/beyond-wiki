"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@components/navbar";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@lib/supabase-browser";

interface Item {
    slug: string;
    name: string;
    description: string | null;
    image_url: string | null;
}

const validCategories = [
    // Items
    "weapons", "tools", "armor", "accessories", "ammo", "bars", "ores", "potions", "minions", "blocks", "crafting-stations",
    // Dimensions
    // Bosses
];

const globalItemCache: Record<string, Item[]> = {};

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const category = params.category as string;
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

    const [items, setItems] = useState<Item[]>(() => globalItemCache[category] ?? []);
    const [user, setUser] = useState<any>(null);

    const supabase = createClient();

    const fetchItems = useCallback(async () => {
        if (!validCategories.includes(category)) return;

        try {
            const res = await fetch(`/api/items/list?category=${category}&_=${Date.now()}`, {
                cache: "no-store",
            });
            const data = await res.json();
            const newItems = data.items || [];

            globalItemCache[category] = newItems;
            setItems(newItems);
        } catch (err) {
            console.error("Failed to fetch items:", err);
        }
    }, [category]);

    useEffect(() => {
        if (!validCategories.includes(category)) {
            router.push("/beyond-depth");
            return;
        }

        fetchItems();

        const handleFocus = () => {
            if (document.visibilityState === "visible") {
                fetchItems();
            }
        };

        document.addEventListener("visibilitychange", handleFocus);

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        return () => {
            document.removeEventListener("visibilitychange", handleFocus);
        };
    }, [category, router, supabase, fetchItems]);
    
    return (
        <main className="bd-category-page">
            <div className="bd-category-bg" />
            <Navbar />
            <div className="h-20" />

            {/* Logo */}
            <div className="page-logo">
                <Link href="/beyond-depth">
                    <Image src="/logo/Beyond_Depth_logo_crop.png" alt="Beyond Depth Logo" width={100} height={100} />
                </Link>
            </div>

            {/* BreadAdd */}
            <div className="bread-add">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs">
                    <ul>
                        <li><Link href="/beyond-depth">Beyond Depth</Link></li>
                        <li className="capitalize">{category}</li>
                    </ul>
                </nav>

                {/* Add Item */}
                {/* {user && ( */}
                    <Link href={`/beyond-depth/${category}/add-item`} className="add-item-button">
                        + Add Item
                    </Link>
                {/* )} */}
            </div>

            {/* Divider */}
            <div className="divider w-[50%] mx-auto m-0" />

            {/* Title */}
            <div className="category-title">{categoryTitle}</div>

            {/* Items */}
            <div className="items-grid">
                {items.map((item) => (
                    <Link key={item.slug} href={`/beyond-depth/${category}/${item.slug}`} className="item-card">
                        {/* Image */}
                        <div className="item-image">
                            {item.image_url ? (
                                <Image src={item.image_url} alt={item.name} width={64} height={64} unoptimized={item.image_url.startsWith("http")}/>
                            ) : (
                                <div className="placeholder-image">
                                    <NoImage />
                                </div>
                            )}
                        </div>
                        {/* Info */}
                        <div className="item-info">
                            <h3 className="item-name">{item.name}</h3>
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
    )
}

function NoImage() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image-off-icon lucide-image-off">
            <line x1="2" x2="22" y1="2" y2="22"/>
            <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/>
            <line x1="13.5" x2="6" y1="13.5" y2="21"/>
            <line x1="18" x2="21" y1="12" y2="15"/>
            <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"/>
            <path d="M21 15V5a2 2 0 0 0-2-2H9"/>
        </svg>
    )
}