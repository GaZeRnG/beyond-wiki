"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase-browser";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BadgeCheck, BadgeAlert, User } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const registered = searchParams.get('registered') === 'true';

    const handleOAuthLogin = async (provider: "google" | "discord") => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
        });

        if (error) {
            setError(error.message);
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
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="flex flex-col gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Username or Email</Label>
                                        <Input id="email" type="text" placeholder="Wikiversal or email@example.com" required />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            <a href="#" className="ml-auto text-sm text-muted-foreground hover:underline">
                                                Forgot your Password?
                                            </a>
                                        </div>
                                        <Input id="password" type="password" required />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button type="submit" className="w-full mb-2">
                                Login
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
                    </Card>
                </div>
            </section>
        </main>
    )
}