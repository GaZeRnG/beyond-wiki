"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { animate } from "animejs";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-browser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function Navbar({page = ""}: {page?: string}) {
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState<{ id: number; title: string }[]>([]);

    const supabase = createClient();
    const isHub = page === "hub";
    const searchRef = useRef<HTMLDivElement>(null);

    const { setTheme, theme } = useTheme();

    // Themes
    const DoLight = () => {
        // localStorage.setItem("theme", "light");
        setTheme("light");
    }
    
    const DoDark = () => {
        // localStorage.setItem("theme", "dark");
        setTheme("dark");
    }

    const DoTheme = () => {
        if (theme === "light") {
            DoDark();
        } else {
            DoLight();
        }
    }

    // Get user
    useEffect(() => {
        const getUser = async () => {
            const { data: {user} } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const {data} = await supabase
                    .from('users')
                    .select('user_name, user_avatar')
                    .eq('id', user.id)
                    .single();
                setUserData(data);
            } else {
                setUserData(null);
            }
        }

        getUser();

        
    })

    // Close search on click outside the search input
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        if (value.length > 2) {
            const { data, error } = await supabase
                .from('')
                .select('*')
                .ilike('', `%${value}%`)
            if (error) {
                console.error(error);
                setSearchResults([]);
            } else {
                setSearchResults(data);
            }
        } else {
            setSearchResults([]);
        }
    };

    return (
        <nav className="grid grid-cols-[1fr_2fr_1fr] fixed w-full h-15 top-0 z-100 px-2 bg-background">
            {/* Logo */}
            <section className="flex flex-row items-center justify-self-start">
                {isHub ? (
                    <Image src="/logo/Beyond_Wiki_logo.svg" alt="Beyond Wiki Logo" width={80} height={40} />
                ) : (
                    <Link href="/">
                        <Image src="/logo/Beyond_Wiki_logo.svg" alt="Beyond Wiki Logo" width={80} height={40} />
                    </Link>
                )}
            </section>
            
            {/* Search Bar */}
            <section className="flex flex-row justify-self-center items-center" ref={searchRef}>
                <input
                    type="text"
                    placeholder="Search modpacks, mods, recipes, etc."
                    className="px-2 py-2 rounded-sm bg-muted border border-input focus:outline-none focus:ring-2 focus:ring-primary w-50 md:w-100 overflow-auto"
                    value={search}
                    onChange={handleSearch}
                />

                {searchResults.length > 0 && (
                    <ul className="absolute border border-accent-foreground w-80 z-50 mt-2">
                        {searchResults.map(result => (
                            <li key={result.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                {result.title}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Login/Account Icon */}
            <section className="flex flex-row items-center justify-self-end">
                {/* Toggle Theme */}
                <Button variant="outline" size="icon" className="mr-2 cursor-pointer" onClick={ DoTheme }>
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {user ? (
                    <Link href="/account">
                        <Avatar size="lg">
                            <AvatarImage src={userData.user_avatar} alt="Profile" />
                            <AvatarFallback>{userData?.name[0]}</AvatarFallback>
                        </Avatar>
                    </Link>
                ) : (
                    <Button className="flex items-center h-10 rounded-sm px-2 bg-primary text-primary-foreground">
                        <Link href="/login">
                            <p>Get Started</p>
                        </Link>
                    </Button>
                )}
            </section>
        </nav>
    );
}