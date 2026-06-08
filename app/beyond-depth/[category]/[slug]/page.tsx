"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@components/navbar";
import Loading from "@app/loading";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@lib/supabase-browser";

interface ItemContent {
    stats?: Record<string, string | number>;
    how_to_get?: string;
    how_to_use?: string;
}

interface Item {
    id: number;
    name: string;
    description: string;
    image_url: string | null;
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
    const [editImageUrl, setEditImageUrl] = useState("");
    const [editHowToGet, setEditHowToGet] = useState("");
    const [editHowToUse, setEditHowToUse] = useState("");
    const [editStats, setEditStats] = useState<Record<string, string>>({});

    const supabase = createClient();

    // Get them items
    useEffect(() => {
        fetch(`/api/items?category=${category}&${slug}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.item) {
                    setItem(data.item);
                    setEditName(data.item.name);
                    setEditDescription(data.item.description || "");
                    setEditImageUrl(data.item.image_url || "");
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
        
        supabase.auth.getUser().then(({ data: { user }}) => {
            setUser(user);
        });
    }, [category, slug]);

    // Save them items
    const handleSave = async () => {
        if (!item) return;
        setSaving(true);
        setError("");

        const parsedStats = Object.entries(editStats).reduce((acc, [k, v]) => {
            if (!k.trim()) return acc;
            const num = Number(v);
            acc[k.trim()] = isNaN(num) ? v : num;
            return acc;
        }, {} as Record<string, string | number>);

        const res = await fetch(`/api/items/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: editName,
                description: editDescription,
                image_url: editImageUrl || null,
                content: {
                    how_to_get: editHowToGet,
                    how_to_use: editHowToUse,
                    stats: parsedStats,
                },
            }),
        });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Failed to save item. Please try again.");
            setSaving(false);
            return;
        }

        setItem({
            ...item,
            name: editName,
            description: editDescription,
            image_url: editImageUrl || null,
            content: {
                ...item.content,
                how_to_get: editHowToGet,
                how_to_use: editHowToUse,
                stats: parsedStats,
            },
        });
        setEditMode(false);
        setSaving(false);
    };

    // Delete them items
    const handleDelete = async () => {
        if (!item) return;
        if (!confirm("Are you sure you want to delete this item?")) return;
        
        setDeleting(true);
        const res = await fetch(`/api/items/${item.id}`, { method: "DELETE" });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Failed to delete item. Please try again.");
            setDeleting(false);
            return;
        }

        router.push(`/beyond-depth/${category}`);
    };

    const addStat = () => {
        setEditStats({ ...editStats, "": "" });
    }

    const updateStatKey = (oldKey: string, newKey: string) => {
        const { [oldKey]: value, ...rest } = editStats;
        setEditStats({ ...rest, [newKey]: value });
    };

    const updateStatValue = (key: string, value: string) => {
        setEditStats({ ...editStats, [key]: value });
    };

    const removeStat = (key: string) => {
        const { [key]: _, ...rest } = editStats;
        setEditStats(rest);
    };

    // if (loading) return <Loading />;
    if (!item) return <p>Item not found</p>;

    const content = item.content;

    // Le page
    return (
        <main className="bd-item-page">
            <div className="bd-item-bg" />
            <Navbar />
            <div className="h-20" />

            {/* Logo */}
            <div className="page-logo">
                <Link href="/beyond-depth">
                    <Image src="/logo/Beyond_Depth_logo_crop.png" alt="Beyond Depth Logo" width={100} height={100} />
                </Link>
            </div>

            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <ul>
                    <li><Link href="/beyond-depth">Beyond Depth</Link></li>
                    <li><Link href={`/beyond-depth/${category}`}>{category}</Link></li>
                    <li className="active capitalize">{item.name}</li>
                </ul>
            </nav>
        </main>
    )
}