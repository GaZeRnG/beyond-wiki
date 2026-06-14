"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@components/navbar";
import Loading from "@app/loading";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@lib/supabase-browser";
import { animate } from "animejs";

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

function DeleteModal({
    itemName, onConfirm, onClose, deleting,
}: {
    itemName: string;
    onConfirm: () => void;
    onClose: () => void;
    deleting: boolean;
}) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("keydown", handleEsc);
        }
    }, [onClose]);

    return (
        <section className="delete-modal" onClick={onClose}>
            <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="delete-header">Are you sure you want to delete {itemName}?</div>
                <div className="delete-description">!!!! THIS ACTION CANNOT BE UNDONE !!!!</div>
                <div className="delete-btns">
                    <button onClick={onClose} className="delete-cancel">Cancel</button>
                    <button onClick={onConfirm} className="delete-confirm">{deleting ? "Deleting..." : "Delete"}</button>
                </div>
            </div>
        </section>
    );
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState("");

    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editImageUrl, setEditImageUrl] = useState("");
    const [editHowToGet, setEditHowToGet] = useState("");
    const [editHowToUse, setEditHowToUse] = useState("");
    const [editStats, setEditStats] = useState<Record<string, string>>({});

    const supabase = createClient();

    // Toast error
    useEffect(() => {
        if (error) {
            animate('.error-slug-toast', {
                translateX: { from: 250, to: 0 },
                duration: 1000,
            })
            setTimeout(() => {
                animate('.error-slug-toast', {
                    translateX: { from: 0, to: 250 },
                    duration: 1000,
                })
            }, 3000);
            setTimeout(() => {
                setError("");
            }, 4000);
        }
    }, [error]);

    // Get them items
    useEffect(() => {
        fetch(`/api/items?category=${category}&slug=${slug}`)
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
        setDeleting(true);

        const res = await fetch(`/api/items/${item.id}`, { method: "DELETE" });

        if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Failed to delete item.");
            setDeleting(false);
            setShowDeleteModal(false);
            return;
        }

        sessionStorage.addItem("deleted-item", item.id);

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

    if (loading) return <Loading />;
    if (!item) {
        router.push(`/beyond-depth/${category}`);
        return <Loading />;
    };

    const content = item.content;

    // Le page
    return (
        <main className="bd-item-page">
            <div className="bd-bg" />
            <Navbar />
            <div className="h-20" />

            {/* Error Toast */}
            {error && (
                <div className="error-slug-toast">
                    <ToastX /> {error}
                </div>
            )}

            {/* Logo */}
            <div className="page-logo">
                <Link href="/beyond-depth">
                    <Image src="/logo/Beyond_Depth_logo_crop.png" alt="Beyond Depth Logo" width={100} height={100} />
                </Link>
            </div>

            {/* BreadItem */}
            <section className="bread-item">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs">
                    <ul>
                        <li><Link href="/beyond-depth">Beyond Depth</Link></li>
                        <li className="capitalize"><Link href={`/beyond-depth/${category}`}>{category}</Link></li>
                        <li className="capitalize">{item.name}</li>
                    </ul>
                </nav>

                {/* Edit Item */}
                {user && (
                    <div className="control-item">
                        {editMode ? (
                            <>
                                <button onClick={handleSave} disabled={saving} className="save-btn">
                                    {saving ? "Saving..." : "Save"}
                                </button>
                                <button onClick={() => setEditMode(false)} className="cancel-btn">
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setEditMode(true)} className="edit-btn tooltip" data-tip="Edit">
                                    <DoEdit />
                                </button>
                                <button onClick={() => setShowDeleteModal(true)} disabled={deleting} className="delete-btn tooltip tooltip-error" data-tip="Delete">
                                    <DoDelete />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </section>

            {/* Divider */}
            <div className="divider w-[50%] mx-auto m-0 mb-2.5" />

            {/* Item */}
            <section className="item">
                {/* Image */}
                {item.image_url ? (
                    <div className="item-image">
                        <Image src={item.image_url} alt={item.name} width={150} height={150} unoptimized={item.image_url.startsWith("http")}/>
                    </div>
                ) : (
                    <div className="item-image">
                        <NoImage/>
                    </div>
                )}

                {/* Item Content */}
                <div className="item-content">
                    {/* Title */}
                    <div className="item-title">{item.name}</div>

                    {/* Description */}
                    <div className="item-description">{item.description}</div>
                </div>

                {/* How To Get */}
                {/* {content.how_to_get && (
                    <div className="item-how-to-get">
                        <div className="item-how-to-get-title">How To Get</div>
                        <div className="item-how-to-get-content">{content.how_to_get}</div>
                    </div>
                )} */}
            </section>

            {/* Delete Modal */}
            {showDeleteModal && (
                <DeleteModal 
                    itemName={item.name}
                    onConfirm={handleDelete}
                    onClose={() => setShowDeleteModal(false)}
                    deleting={deleting}
                />
            )}
        </main>
    )
}

function NoImage() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image-off-icon lucide-image-off">
            <line x1="2" x2="22" y1="2" y2="22"/>
            <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/>
            <line x1="13.5" x2="6" y1="13.5" y2="21"/>
            <line x1="18" x2="21" y1="12" y2="15"/>
            <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"/>
            <path d="M21 15V5a2 2 0 0 0-2-2H9"/>
        </svg>
    )
}

function NoEdit() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-off-icon lucide-pencil-off">
            <path d="m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982"/>
            <path d="m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353"/>
            <path d="m15 5 4 4"/>
            <path d="m2 2 20 20"/>
        </svg>
    )
}

function DoEdit() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil">
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
            <path d="m15 5 4 4"/>
        </svg>
    )
}

function DoDelete() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2-icon lucide-trash-2">
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
            <path d="M3 6h18"/>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
    )
}

function ToastX() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-x-icon lucide-circle-x">
            <circle cx="12" cy="12" r="10"/>
            <path d="m15 9-6 6"/>
            <path d="m9 9 6 6"/>
        </svg>
    )
}