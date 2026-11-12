"use client";

import Image from "next/image";
import Navbar from "@/components/navbar";

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-[url('/background/BW-still.png')] bg-cover bg-center bg-no-repeat">
            {/* Navbar */}
            <Navbar page="hub" />

            <div className="w-full h-screen flex items-center justify-center">
                <video autoPlay loop muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0">
                    <source src="/background/BW-loop.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="fixed inset-0 z-10 flex items-start justify-center pointer-events-none pt-40 md:pt-30 lg:pt-40 xl:pt-50">
                <Image src="/logo/Beyond_wiki_logo.svg" alt="Beyond Wiki Logo" width={400} height={200} className="w-[75vw] max-w-70 sm:max-w-90 md:max-w-110 h-auto select-none"/>

            </div>
        </main>
    );
}
