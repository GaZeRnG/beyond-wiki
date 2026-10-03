"use client";

import Image from "next/image";
import Navbar from "@/components/navbar";
import { useEffect, useRef } from "react";

const SLIDES = [
    { src: "/logo/Beyond_Wiki_logo.svg", alt: "Beyond Wiki Logo" },
    { src: "/logo/Beyond_Depth_logo.svg", alt: "Beyond Depth Logo" },
    { src: "/logo/Beyond_Wiki_logo.svg", alt: "Beyond Wiki Logo" },
    { src: "/logo/Beyond_Depth_logo.svg", alt: "Beyond Depth Logo" },
];

export default function Home() {
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const logoRefs = useRef<(HTMLImageElement | null)[]>([]);

    useEffect(() => {
        const ease = (t: number) => t * t * (3 - 2 * t); // smoothstep
        const MIN_SCALE = 0.8;
        let ticking = false;

        const update = () => {
            const vh = window.innerHeight || document.documentElement.clientHeight || 1;
            const viewportCenter = vh / 2;

            const slides = slideRefs.current.filter((el): el is HTMLDivElement => el !== null);
            if (slides.length === 0) return;

            // Center position (relative to viewport) of each slide
            const centers = slides.map((slide) => {
                const rect = slide.getBoundingClientRect();
                return rect.top + rect.height / 2;
            });

            const lastIdx = centers.length - 1;

            // Clamp if before the first slide
            if (viewportCenter <= centers[0]) {
                logoRefs.current.forEach((logo, idx) => {
                    if (!logo) return;
                    const opacity = idx === 0 ? 1 : 0;
                    const scale = idx === 0 ? 1 : MIN_SCALE;
                    logo.style.opacity = opacity.toString();
                    logo.style.transform = `scale(${scale})`;
                });
                return;
            }

            // Clamp if past the last slide
            if (viewportCenter >= centers[lastIdx]) {
                logoRefs.current.forEach((logo, idx) => {
                    if (!logo) return;
                    const opacity = idx === lastIdx ? 1 : 0;
                    const scale = idx === lastIdx ? 1 : MIN_SCALE;
                    logo.style.opacity = opacity.toString();
                    logo.style.transform = `scale(${scale})`;
                });
                return;
            }

            // Find which pair of slides viewportCenter is currently between
            let i = 0;
            while (i < lastIdx && viewportCenter > centers[i + 1]) {
                i++;
            }

            const from = centers[i];
            const to = centers[i + 1] ?? from;

            const dist = to - from;
            const raw = dist === 0 ? 0 : (viewportCenter - from) / dist;
            const progress = ease(Math.min(1, Math.max(0, raw)));

            logoRefs.current.forEach((logo, idx) => {
                if (!logo) return;
                let opacity = 0;
                if (idx === i) opacity = 1 - progress;
                else if (idx === i + 1) opacity = progress;

                const scale = MIN_SCALE + (1 - MIN_SCALE) * opacity;

                logo.style.opacity = opacity.toFixed(3);
                logo.style.transform = `scale(${scale.toFixed(3)})`;
            });
        };

        const onScrollOrResize = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    update();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Initial paint
        update();

        // Mobile and Desktop listeners
        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        document.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);
        window.addEventListener("orientationchange", onScrollOrResize);

        const vv = window.visualViewport;
        if (vv) {
            vv.addEventListener("resize", onScrollOrResize);
            vv.addEventListener("scroll", onScrollOrResize);
        }

        return () => {
            window.removeEventListener("scroll", onScrollOrResize);
            document.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);
            window.removeEventListener("orientationchange", onScrollOrResize);
            if (vv) {
                vv.removeEventListener("resize", onScrollOrResize);
                vv.removeEventListener("scroll", onScrollOrResize);
            }
        };
    }, []);

    return (
        <main className="min-h-screen relative overflow-x-hidden">
            {/* Navbar */}
            <Navbar page="hub" />

            {/* Background slides */}
            {SLIDES.map((slide, i) => (
                <div
                    key={i}
                    ref={(el) => {
                        slideRefs.current[i] = el;
                    }}
                    className="h-screen w-full bg-[url('/background/bg.png')] bg-cover bg-center bg-no-repeat"
                />
            ))}

            {/* Fixed logo overlay — always centered, fully responsive across mobile & desktop */}
            <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none px-4">
                {SLIDES.map((slide, i) => (
                    <Image
                        key={i}
                        ref={(el) => {
                            logoRefs.current[i] = el as HTMLImageElement;
                        }}
                        src={slide.src}
                        alt={slide.alt}
                        width={400}
                        height={200}
                        className="absolute w-[75vw] max-w-70 sm:max-w-90 md:max-w-110 h-auto object-contain will-change-transform drop-shadow-2xl select-none"
                        style={{
                            opacity: i === 0 ? 1 : 0,
                            transform: i === 0 ? "scale(1)" : "scale(0.8)",
                        }}
                        priority={i === 0}
                    />
                ))}
            </div>
        </main>
    );
}
