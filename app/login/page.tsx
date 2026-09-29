"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase-browser";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, BadgeAlert, Eye, EyeClosed } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


export default function LoginPage() {
    const supabase = createClient();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const registered = searchParams.get('registered') === 'true';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        let loginEmail = email.trim();

        if (!loginEmail.includes("@")) {
            const { data: emailData, error: lookupError } = await supabase
                .rpc('get_email_by_username', { username_input: loginEmail });

            if (lookupError || !emailData || emailData.length === 0) {
                setError("User not found");
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

        window.location.href = "/";
    }

    const handleOAuthLogin = async (provider: "google" | "discord") => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
        });

        if (error) {
            setError(error.message);
            return;
        }
    };

    return (
        <main>
            {/* Card */}
            <section className="h-screen grid place-items-center">
                <div className="flex flex-col w-full max-w-sm">
                    <p className="place-items-start pl-2">
                        <Button variant="link" className="text-foreground pb-4">
                            <Link href="/">
                                <Image src="/logo/Beyond_Wiki_logo.svg" alt="Beyond Wiki Logo" width={80} height={40} />
                            </Link>
                        </Button>
                    </p>
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle>Login To Beyond Wiki</CardTitle>
                            <CardDescription>Welcome Back to Beyond Wiki. Enter your email below to login to your account.</CardDescription>
                            <CardAction>
                                <Button variant="link" className="text-foreground pb-2">
                                    <a href="/signup">
                                        Sign Up
                                    </a>
                                </Button>
                            </CardAction>

                        </CardHeader>
                        <form onSubmit={handleLogin}>
                            <CardContent className="mb-5">
                                {/* Registered */}
                                {registered && (
                                    <Alert className="flex flex-row justify-center bg-green-500/20 border border-green-500/50 text-green-300 p-2 text-sm">
                                        <BadgeCheck />
                                        <AlertTitle>Registration Successful!</AlertTitle>
                                    </Alert>
                                )}

                                {/* Error */}
                                {error && (
                                    <Alert className="flex flex-row justify-center bg-red-500/20 border border-red-500/50 text-red-300 p-2 text-sm">
                                        <BadgeAlert />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}

                                <div className="flex flex-col gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Username or Email</Label>
                                        <Input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Wikiversal or email@example.com" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            <a href="#" className="ml-auto text-sm text-muted-foreground hover:underline">
                                                Forgot your Password?
                                            </a>
                                        </div>
                                        <div className="flex">
                                            <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
                                            <Button variant="ghost" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <Eye /> : <EyeClosed />}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button type="submit" disabled={loading} className="w-full mb-2">
                                    {loading ? "Logging In..." : "Login"}
                                </Button>
                                <Separator />
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <Button variant="google" onClick={() => handleOAuthLogin("google")}>
                                        <Image src="/logo/google-icon.svg" alt="Google" width={20} height={20}  />
                                        Login with Google
                                    </Button>
                                    <Button variant="discord" onClick={() => handleOAuthLogin("discord")}>
                                        <Image src="/logo/discord-icon.svg" alt="Discord" width={20} height={20} />
                                        Login with Discord
                                    </Button>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </section>
        </main>
    )
}