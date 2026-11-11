"use client";

import Image from "next/image";
import Navbar from "@/components/navbar";

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Navbar */}
            <Navbar page="hub" />

            <div className="h-screen w-full">
                <video autoPlay loop muted playsInline preload="auto" className="absolute top-0 left-0 min-w-full min-h-full  -z-10 overflow-hidden">
                    <source src="/background/BW-loop.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="fixed inset-0 z-10 flex top-[20%] justify-center pointer-events-none px-4">
                <Image src="/logo/Beyond_wiki_logo.svg" alt="Beyond Wiki Logo" width={400} height={200} className="absolute w-[75vw] max-w-70 sm:max-w-90 md:max-w-110 h-auto select-none"/>
            </div>
        </main>
    );
}
