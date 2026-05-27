"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@components/navbar";

export default function AddTipPage() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const titleRef = useRef<HTMLInputElement>(null);
    const authorRef = useRef<HTMLInputElement>(null);
    const titleShadowRef = useRef<HTMLInputElement>(null);
    const authorShadowRef = useRef<HTMLInputElement>(null);

    const autoGrow = (input: HTMLInputElement, shadow: HTMLSpanElement) => {
        shadow.textContent = input.value || input.placeholder;
        const minW = 15 * 16;
        const maxW = input.classList.contains("title-input")
            ? (input.parentElement?.clientWidth || 0) * 0.90
            : (input.parentElement?.clientWidth || 0) * 0.30;
        const newW = Math.max(minW, Math.min(shadow.scrollWidth + 8, maxW));
        input.style.width = newW + "px";
    };

    useEffect(() => {
        const input = [
            { input: titleRef.current, shadow: titleShadowRef.current },
            { input: authorRef.current, shadow: authorShadowRef.current },
        ];

        input.forEach(({ input, shadow }) => {
            if (!input || !shadow) return;

            const handler = () => autoGrow(input, shadow);
            input.addEventListener("input", handler);
            autoGrow(input, shadow);

            return () => input.removeEventListener("input", handler);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        const trimmedTitle = title.trim();
        const trimmedAuthor = author.trim();
        const trimmedContent = content.trim();

        if (!trimmedContent) {
            setErrors(["Tip cannot be empty."]);
            setLoading(false);
            return;
        }

        const res = await fetch("/api/tips", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tip_tile: trimmedTitle,
                tip_content: trimmedContent,
                author: trimmedAuthor || undefined,
                pack: "beyond-depth",
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setErrors([data.error || "Failed to add tip. Please try again."]);
            setLoading(false);
            return;
        }

        router.push(`/beyond-depth/tips/view-tip?id=${data.tip.tip_id}`);
    };

    return (
        <main className="bd-add-tip-page">
            <div className="add-tip-bg"></div>

            <Navbar />

            <div className="h-20" />

            {/* Errors */}
            {errors.length > 0 && (
                <div className="add-tip-errors">
                    <ul className="add-tip-errors-list">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="add-tip-form">
                <section className="top-bar">
                    {/* Title */}
                    <section className="input-value">
                        <input ref={titleRef} id="title" type="text" placeholder="Enter your Title" maxLength={300} required value={title} onChange={(e) => setTitle(e.target.value)} className="title-input"/>
                        <span ref={titleShadowRef} id="title-shadow" ariad-hidden="true" className="shadow-span" />
                    </section>

                    {/* Author */}
                    <section className="input-value">
                        <input ref={authorRef} id="author" type="text" placeholder="Enter your Username (Optional)" maxLength={300} value={author} onChange={(e) => setAuthor(e.target.value)} className="author-input" />
                        <span ref={authorShadowRef} id="author-shadow" ariad-hidden="true" className="shadow-span" />
                    </section>
                </section>

                {/* Content */}
                <section className="input-value">
                    <textarea id="content" placeholder="Enter your Tip" rows={5} required value={content} onChange={(e) => setContent(e.target.value)} className="content-input" />
                </section>

                {/* Submit */}
                <section className="submit-button">
                    <button type="submit" disabled={loading} className="submit">
                        {loading ? "Submitting..." : "Submit Tip"}
                    </button>
                    <Link href="/beyond-depth" className="back">Back to Home</Link>
                </section>
            </form>
        </main>
    )
}