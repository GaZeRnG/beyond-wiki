"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@lib/supabase-browser";
import Link from "next/link";
import Navbar from "../components/navbar";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const registered = searchParams.get('registered') === 'true';

    useEffect(() => {
        const state = rememberMe ? "1" : "0";
        sessionStorage.setItem("remember_me", state);
    }, [rememberMe]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        let loginEmail = email.trim();

        if (!loginEmail.includes('@')) {
            const { data: emailData, error: lookupError } = await supabase
                .rpc('get_email_by_username', { username_input: loginEmail });

            if (lookupError || !emailData || emailData.length === 0) {
                setError("Username not found.");
                setLoading(false);
                return;
            }
            loginEmail = emailData[0].user_email;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        if (rememberMe) {
            localStorage.setItem("remember_me", "true");
        } else {
            localStorage.removeItem("remember_me");
        }

        if (data.user) {
            await syncUserToTable(data.user);
        }

        router.push("/");
        router.refresh();
    };

    const handleOAuthLogin = async (provider: "google" | "discord") => {
        const rememberState = rememberMe ? "1" : "0";

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback?remember=${rememberState}`,
            },
        });

        if (error) {
            setError(error.message);
        }
    };

    const syncUserToTable = async (user: any) => {
        const { error } = await supabase
            .from('users')
            .upsert({
                id: user.id,
                user_email: user.email,
                user_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                oauth_provider: 'email',
            }, { onConflict: 'id' });

        if (error) console.error('Sync error:', error);
    };


    return (
        <>
            <main className="login-page">
                <Navbar />
                <section className="login-whole">
                    <div className="login-container">
                        <h1 className="login-title">LOGIN</h1>

                        {/* Success Message */}
                        {registered && (
                            <div className="login-success">
                                Registration successful!
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin} className="login-form">
                            {/* Username/Email */}
                            <label className="login-label-text">
                                <UserIcon />
                                <span>Username/Email</span>
                                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Username/Email" className="login-input" />
                            </label>

                            {/* Password */}
                            <label className="login-label-text">
                                <KeyIcon />
                                <span>Password</span>
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="Password" className="login-input" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="login-eye">
                                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                </button>
                            </label>

                            {/* Remember Me */}
                            <label className="login-remember">
                                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="checkbox bg-neutral-800 checked:bg-neutral-500 mr-2" />
                                Stay logged In
                            </label>

                            <button type="submit" disabled={loading} className="login-submit">
                                {loading ? "Logging In..." : "Login"}
                            </button>

                            {/* OAuth */}
                            <div className="login-others">
                                {/* Google */}
                                <button type="button" onClick={() => handleOAuthLogin("google")} className="login-google">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" loading="lazy" />
                                    Google
                                </button>

                                {/* Discord */}
                                <button type="button" onClick={() => handleOAuthLogin("discord")} className="login-discord">
                                    <img src="https://www.svgrepo.com/show/353655/discord-icon.svg" alt="Discord" className="w-6 h-6" loading="lazy" />
                                    Discord
                                </button>
                            </div>

                            <Link href="/register" className="login-register">
                                Don't have an account?
                            </Link>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}

function UserIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
    );
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