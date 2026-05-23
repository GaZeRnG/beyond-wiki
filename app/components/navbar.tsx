"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from "../../lib/supabase-browser";
import LogoutButton from "./logoutButton";

export default function Navbar({page = ""}: {page?: string}) {
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: {user} } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data } = await supabase
                    .from('users')
                    .select('user_name, user_pfp')
                    .eq('id', user.id)
                    .single();
                setUserData(data);
            } else {
                setUserData(null);
            }
        };

        getUser();

        const { data: {subscription} } = supabase.auth.onAuthStateChange((_event, session) => {
            const newUser = session?.user ?? null;
            setUser(newUser);

            if (newUser) {
                supabase.from('users')
                    .select('user_name, user_pfp')
                    .eq('id', newUser.id)
                    .single()
                    .then(({ data }) => {setUserData(data);});
            } else {
                setUserData(null);
            }
        });

        return () => subscription?.unsubscribe();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isHub = page === "hub";

    return (
        <nav className="nav">
            {/* Logo */}
            <section>
                {isHub ? (
                    <Image src="/logo/Beyond_Wiki_logo_crop.png" alt="Beyond Wiki Logo" width={40} height={40} />
                ) : (
                    <Link href="/" className='nav_logo'>
                        <Image src="/logo/Beyond_Wiki_logo_crop.png" alt="Beyond Wiki Logo" width={40} height={40} />
                    </Link>
                )}
            </section>

            {/* Search */}
            <section className="search">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
                <input type="search" placeholder="Search"></input>
            </section>

            {/* User */}
            <section className="drop" ref={dropdownRef}>
                <div className="user" tabIndex={0} role="button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {user ? (
                        <>
                            <p>{userData?.user_name || user.email?.split('@')[0]}</p>
                            <div className="user-icon" id="user-icon">
                                {userData?.user_pfp ? (
                                    <Image src={userData.user_pfp} alt="Profile" width={32} height={32} className="avatar rounded-full" unoptimized={userData.user_pfp.startsWith('http')}/>
                                ) : (
                                    <DefaultUserIcon />
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <p>Guest</p>
                            <div className="user-icon" id="user-icon">
                                <DefaultUserIcon />
                            </div>
                        </>
                    )}
                </div>

                {/* Dropdown Menu */}
                <ul className="drop_menu dropdown-content">
                    {user ? (
                        <>
                            <li>
                                <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                                    <ProfileIcon />
                                    Profile
                                </Link>
                            </li>
                            <hr className="my-2 border-gray-600"></hr>
                            <li>
                                <LogoutButton />
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link href="/login" onClick={() => setDropdownOpen(false)}>
                                <LoginIcon />
                                Login
                            </Link>
                        </li>
                    )}
                </ul>
            </section>
        </nav>
    );
}

function DefaultUserIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    );
}

function ProfileIcon() {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-pen-icon lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="7" r="4"/></svg>
    );
}

// function LogoutIcon() {
//     return(
//         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
//     );
// }

function LoginIcon() {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in-icon lucide-log-in"><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg>
    );
}