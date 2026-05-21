"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Navbar from './components/navbar';

export default function Home() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(2);

    const positions = ["far-left", "left", "center", "right", "far-right", "hidden"];

    const themeColors =[
        "rgba(0, 150, 255, 0.6)",   // Beyond Ocean
        "rgba(255, 215, 0, 0.6)",   // Beyond Ascension
        "rgba(158, 158, 158, 0.6)", // Beyond Depth
        "rgba(1, 71, 238, 0.6)",    // Beyond Cosmo
        "rgba(50, 205, 50, 0.6)",   // Beyond Zombie
        "rgba(103, 42, 236, 0.6)"   // Beyond Nightfall
    ];

    const modpacks = [
        { href: "/", img: "/logo/Beyond_Ocean_logo_crop.png", alt: "Beyond Ocean" },
        { href: "/", img: "/logo/Beyond_Ascension_logo_crop.png", alt: "Beyond Ascension" },
        { href: "/beyond-depth/", img: "/logo/Beyond_Depth_logo_crop.png", alt: "Beyond Depth" },
        { href: "/", img: "/logo/Beyond_Cosmo_logo_crop.png", alt: "Beyond Cosmo" },
        { href: "/", img: "/logo/Beyond_Zombie_logo_crop.png", alt: "Beyond Zombie" },
        { href: "/", img: "/logo/Beyond_Nightfall_logo_crop.png", alt: "Beyond Nightfall" },
        // { href: "/", img: "/logo/Beyond_Shenanigans_logo.png", alt: "Beyond Shenanigans" },
    ];

    // Carousel rotation
    const rotate = (direction: number) => {
        setCurrentIndex((prev) => (prev + direction + modpacks.length) % modpacks.length);
    };

    // Touch handlers
    useEffect(() => {
        const container = carouselRef.current;
        if (!container) return;

        let touchStartX = 0;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchEndX - touchStartX;
            const swipeThreshold = 50;

            if (Math.abs(diff) > swipeThreshold) {
                rotate(diff > 0 ? -1 : 1);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") rotate(-1);
            if (e.key === "ArrowRight") rotate(1);
        };

        container.addEventListener("touchstart", handleTouchStart, { passive: true });
        container.addEventListener("touchend", handleTouchEnd, { passive: true });
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchend", handleTouchEnd);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Update background color based on current modpack
    useEffect(() => {
        document.documentElement.style.setProperty("--theme-color", themeColors[currentIndex]);
    }, [currentIndex]);

    // Calculate positions
    const getPosition = (index: number) => {
        let posIndex = (index - currentIndex + 2 + modpacks.length) % modpacks.length;
        if (posIndex >= positions.length) posIndex = positions.length - 1;
        return positions[posIndex];
    };

    const handleSlideClick = (e: React.MouseEvent, index: number) => {
        const pos = getPosition(index);
        if (pos !== "center") {
            e.preventDefault();
            const posIndex = (index - currentIndex + 2 + modpacks.length) % modpacks.length;
            const direction = posIndex < 2 ? -1 : 1;
            rotate(direction);
        }
    };

    return (
        <main className="hub-page">
            <Navbar page="hub" />

            <div className='h-20'></div>

            {/* Warning */}
            <section className="warning">
                <h2>This wiki is currently under development and will have LIMITED or NO INFO at all.</h2>
                <h3>The only feature that works is the links below and beyond depth.</h3>
            </section>

            {/* Logo */}
            <section className="logo">
                <Image src="/logo/Beyond_Wiki_logo_crop.png" alt="Beyond Wiki Logo" width={300} height={150} />
            </section>

            {/* Main */}
            <section className="main">
                <section className="left-main">
                    <b>Upcoming Feature:</b>
                    <hr className="mx-auto w-[90%] my-4" />
                    tbh dont know what to add here. Suggest it in Discord
                </section>

                <section className="center-main">
                    <p className="welcome">Welcome to <b>Beyond Wiki</b></p>
                    <p>A wiki for all of Beyond Packs.</p>
                    <p>Select a pack below to get started.</p>

                    <hr className="mx-auto w-[90%] my-4" />

                    <h1 className="m-0 text-lg font-bold">Modpacks</h1>
                    <div className="wiki-links" ref={carouselRef}>
                        <div className="wiki-links-images">
                            {modpacks.map((mod, i) => (
                                <a key={i} href={mod.href} className={`mod ${getPosition(i)}`} data-index={i} data-pos={getPosition(i)} onClick={(e) => handleSlideClick(e, i)}>
                                    <Image src={mod.img} alt={mod.alt} width={150} height={75} />
                                </a>
                            ))}
                        </div>
                        <div className="wiki-links-buttons">
                            <button id="prev" onClick={() => rotate(-1)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-big-left-icon lucide-arrow-big-left"><path d="M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"/></svg></button>
                            <button id="next" onClick={() => rotate(1)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-big-right-icon lucide-arrow-big-right"><path d="M11 9a1 1 0 0 0 1-1V5.061a1 1 0 0 1 1.811-.75l6.836 6.836a1.207 1.207 0 0 1 0 1.707l-6.836 6.835a1 1 0 0 1-1.811-.75V16a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"/></svg></button>
                        </div>
                    </div>
                </section>

                <section className="right-main">
                    <b>Upcoming Feature:</b>
                    <hr className="mx-auto w-[90%] my-4" />
                    Top Contributors???
                </section>
            </section>
        </main>
    );
}