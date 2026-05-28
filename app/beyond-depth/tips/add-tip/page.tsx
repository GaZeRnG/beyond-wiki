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

    const formRef = useRef<HTMLFormElement>(null);
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

    const handleExternalSubmit = () => {
        formRef.current?.requestSubmit();
    }

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
                tip_title: trimmedTitle,
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

            <section className="action-bar">
                <Link href="/beyond-depth" className="back">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                    Back to Home
                </Link>
                <button type="submit" onClick={handleExternalSubmit} disabled={loading} className="submit">
                    {loading ? "Submitting..." : "Submit Tip"}
                </button>
            </section>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="add-tip-form">
                <section className="top-bar">
                    {/* Title */}
                    <section className="input-value">
                        <label htmlFor="title" className="input-label">Tip Title</label>
                        <input ref={titleRef} id="title" type="text" placeholder="e.g., Best Early Game Strategy" maxLength={300} required value={title} onChange={(e) => setTitle(e.target.value)} className="title-input"/>
                        <span ref={titleShadowRef} id="title-shadow" ariad-hidden="true" className="shadow-span" />
                    </section>

                    {/* Author */}
                    <section className="input-value">
                        <label htmlFor="author" className="input-label">Author (Optional)</label>
                        <input ref={authorRef} id="author" type="text" placeholder="Your username" maxLength={300} value={author} onChange={(e) => setAuthor(e.target.value)} className="author-input" />
                        <span ref={authorShadowRef} id="author-shadow" ariad-hidden="true" className="shadow-span" />
                    </section>
                </section>

                {/* Content */}
                <section className="input-value">
                    <label htmlFor="content" className="input-label">Your Tip</label>
                    <textarea id="content" placeholder="Share your knowledge with the community..." rows={6} required value={content} onChange={(e) => setContent(e.target.value)} className="content-input" />
                    <span className="char-counter">{content.length} characters</span>
                </section>

                {/* Submit */}
                {/* <section className="submit-button">
                    <button type="submit" disabled={loading} className="submit">
                        {loading ? "Submitting..." : "Submit Tip"}
                    </button>
                    <Link href="/beyond-depth" className="back">Back to Home</Link>
                </section> */}
            </form>
        </main>
    )
}