"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase-browser";
import Link from "next/link";
import Navbar from "../components/navbar";

export default function Register() {
    const router = useRouter();
    const supabase = createClient();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                },
            },
        });

        if (error) {
            setError(error.message);
        }

        if (data.user) {
            await syncUserToTable(data.user);
        }

        router.push("/login");
        router.refresh();
    };

    const syncUserToTable = async (user: any) => {
        const { error } = await supabase
            .from('users')
            .upsert({
                id: user.id,
                user_email: user.email,
                user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                oauth_provider: 'manual',
            }, { onConflict: 'id' });

        if (error) console.error('Sync error:', error);
    };

    return (
        <>
            <main className="register-page">
                <Navbar />
                <section className="register-whole">
                    <div className="register-container">
                        <h1 className="register-title">REGISTER</h1>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-2 rounded mb-4 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleRegister} className="register-form">
                            {/* Username */}
                            <label className="floating-label input validator bg-neutral-800 rounded-md p-2.5 w-full">
                                <UserIcon />
                                <span>Username</span>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username" className="bg-transparent border-none outline-none text-white w-full text-sm" />
                            </label>

                            {/* Email */}
                            <label className="floating-label input validator bg-neutral-800 rounded-md p-2.5 w-full">
                                <EmailIcon />
                                <span>Email</span>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="bg-transparent border-none outline-none text-white w-full text-sm" />
                            </label>

                            {/* Password */}
                            <label className="floating-label input validator bg-neutral-800 rounded-md p-2.5 w-full">
                                <KeyIcon />
                                <span>Password</span>
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="Password" className="bg-transparent border-none outline-none text-white w-full text-sm pr-10" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                </button>
                            </label>

                            {/* Confirm Password */}
                            <label className="floating-label input validator bg-neutral-800 rounded-md p-2.5 w-full">
                                <KeyIcon />
                                <span>Confirm Password</span>
                                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm Password" className="bg-transparent border-none outline-none text-white w-full text-sm pr-10" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                                    {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                </button>
                            </label>
                        </form>
                    </div>
                </section>
            </main>
        </>
    )
}

function UserIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
    )
}

function EmailIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail">
            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/>
            <rect x="2" y="4" width="20" height="16" rx="2"/>
        </svg>
    )
}

function KeyIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>
        </svg>
    );
}

function EyeClosedIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-.722-3.25"/>
            <path d="M2 8a10.645 10.645 0 0 0 20 0"/>
            <path d="m20 15-1.726-2.05"/>
            <path d="m4 15 1.726-2.05"/>
            <path d="m9 18 .722-3.25"/>
        </svg>
    );
}

function EyeOpenIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    );
}