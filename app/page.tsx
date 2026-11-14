"use client";

import Image from "next/image";
import Navbar from "@/components/navbar";
import BWWall from "@/components/BW-wall";

export default function Home() {
    return (
        <main className="min-h-screen relative">
            {/* Navbar */}
            <div className="relative z-30">
                <Navbar page="hub" />
            </div>

            <div className="fixed inset-0 z-0 bg-[url('/background/BW-still.png')] bg-cover bg-center bg-no-repeat pointer-events-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                >
                    <source src="/background/BW-loop.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="fixed inset-0 flex flex-col justify-center pointer-events-none z-10 select-none">
                <div className="h-1/3 w-full flex items-center justify-center">
                    <Image
                        src="/logo/Beyond_Wiki_logo.svg"
                        alt="Beyond Wiki Logo"
                        width={400}
                        height={200}
                        className="w-[75vw] max-w-70 sm:max-w-90 md:max-w-110 h-auto"
                    />
                </div>

                <div className="h-1/2 w-full flex items-center justify-center">
                    <span className="text-md md:text-lg font-medium tracking-wide text-center px-4 py-2 rounded-md bg-card shadow-md shadow-black/40 backdrop-blur-xs">
                        Scroll to select your modpack
                    </span>
                </div>
            </div>

            {/* <div className="w-full flex items-center justify-center">
                <video autoPlay loop muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0">
                    <source src="/background/BW-loop.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="fixed inset-0 flex flex-col justify-center pointer-events-none z-10 select-none">
                <div className="h-1/3 w-full flex items-center justify-center">
                    <Image src="/logo/Beyond_wiki_logo.svg" alt="Beyond Wiki Logo" width={400} height={200} className="w-[75vw] max-w-70 sm:max-w-90 md:max-w-110 h-auto"/>
                </div>

                <div className="h-1/2 w-full flex items-center justify-center">
                    <span className="text-md md:text-lg font-medium tracking-wide text-center px-4 py-2 rounded-md bg-card shadow-md shadow-black/40 backdrop-blur-xs">
                        Scroll to select your modpack
                    </span>
                </div>
            </div> */}

            <div className="relative w-full z-20">
                <BWWall />
            </div>
        </main>
    );
}
