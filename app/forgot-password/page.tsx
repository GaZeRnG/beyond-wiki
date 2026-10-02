"use client";

import Link from "next/link";
import Image from "next/image";
import { animate } from "animejs";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Turnstile } from "@marsidev/react-turnstile";
import { createClient } from "@/lib/supabase-browser";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { BadgeCheck, BadgeAlert, Eye, EyeClosed } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PasswordResetPageComponent = () => {
    const supabase = createClient();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [step, setStep] = useState<"email" | "otp" | "password">("email");
    const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined);
    const [passwordStrength, setPasswordStrength] = useState<number>(0);
    const barRef = useRef<HTMLDivElement>(null);

    // Password strength
    useEffect(() => {
        calculatePasswordStrength(newPassword);
    }, [newPassword]);

    useEffect(() => {
        updateBarColor();
    }, [passwordStrength]);

    const calculatePasswordStrength = (pwd: string) => {
        let strength = 0;
        if (pwd.length >= 8) strength += 1;
        if (/\d/.test(pwd)) strength += 1;
        if (/[a-z]/.test(pwd)) strength += 1;
        if (/[A-Z]/.test(pwd)) strength += 1;
        if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) strength += 1;
        setPasswordStrength(strength);
    };

    const updateBarColor = () => {
        if (barRef.current) {
            const colors = ["#d10000", "#cc8800", "#f6ff00", "#f6ff00", "#0ed600"];
            const targetColor = colors[Math.min(passwordStrength, 4)];
            animate(barRef.current, {
                backgroundColor: targetColor,
                duration: 300,
                ease: "InOutQuad",
            });
        }
    };

    const passwordStrengthBar = (
        <div className="flex rounded-full overflow-hidden" ref={barRef}>
            {Array.from({ length: 5 }, (_, i) => (
                <div
                    key={i}
                    className={`flex-1 h-1 ${i < passwordStrength ? "" : "bg-ring"}`}
                />
            ))}
        </div>
    );

    // Step 1: Send OTP 
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (!captchaToken) {
            setError("Please complete the CAPTCHA.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            // OTP flow — no redirectTo needed for 6-digit OTP
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSuccess("A 6-digit code has been sent to your email.");
        setLoading(false);
        setStep("otp");
    };

    // Step 2: Verify OTP
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: "recovery",
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setLoading(false);
        setStep("password");
    };

    // Step 3: Set new password
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}/.test(newPassword)) {
            setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/login");
    };

    // --- Step titles & descriptions ---
    const stepMeta = {
        email: {
            title: "Forgot Password",
            description: "Enter your account email and we'll send you a 6-digit reset code.",
        },
        otp: {
            title: "Enter Reset Code",
            description: `We sent a 6-digit code to ${email}. Enter it below.`,
        },
        password: {
            title: "Set New Password",
            description: "Choose a strong new password for your account.",
        },
    };

    return (
        <main>
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
                            <CardTitle>{stepMeta[step].title}</CardTitle>
                            <CardDescription>{stepMeta[step].description}</CardDescription>
                            {step === "email" && (
                                <CardAction>
                                    <Button variant="link" className="text-foreground pb-2">
                                        <a href="/login">Back to Login</a>
                                    </Button>
                                </CardAction>
                            )}
                        </CardHeader>

                        {/* ── Step 1: Email + Captcha ── */}
                        {step === "email" && (
                            <form onSubmit={handleEmailSubmit}>
                                <CardContent className="mb-5">
                                    {error && (
                                        <Alert className="flex flex-row justify-center bg-red-500/20 border border-red-500/50 text-red-300 p-2 text-sm mb-4">
                                            <BadgeAlert />
                                            <AlertTitle>{error}</AlertTitle>
                                        </Alert>
                                    )}
                                    <div className="flex flex-col gap-5">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="email@example.com"
                                                autoComplete="email"
                                                required
                                            />
                                        </div>
                                        <Turnstile
                                            siteKey="0x4AAAAAAFKVeRWkdRUTWTyQ"
                                            onSuccess={(token) => setCaptchaToken(token)}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={loading} className="w-full">
                                        {loading ? "Sending Code..." : "Send Reset Code"}
                                    </Button>
                                </CardFooter>
                            </form>
                        )}

                        {/* ── Step 2: OTP ── */}
                        {step === "otp" && (
                            <form onSubmit={handleOtpSubmit}>
                                <CardContent className="mb-5">
                                    {success && (
                                        <Alert className="flex flex-row justify-center bg-green-500/20 border border-green-500/50 text-green-300 p-2 text-sm mb-4">
                                            <BadgeCheck />
                                            <AlertTitle>{success}</AlertTitle>
                                        </Alert>
                                    )}
                                    {error && (
                                        <Alert className="flex flex-row justify-center bg-red-500/20 border border-red-500/50 text-red-300 p-2 text-sm mb-4">
                                            <BadgeAlert />
                                            <AlertTitle>{error}</AlertTitle>
                                        </Alert>
                                    )}
                                    <div className="flex flex-col gap-5">
                                        <div className="grid gap-2">
                                            <Label htmlFor="otp">6-Digit Code</Label>
                                            <Input
                                                id="otp"
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                                placeholder="123456"
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="link"
                                            className="text-muted-foreground text-sm p-0 h-auto self-start"
                                            onClick={() => { setStep("email"); setOtp(""); setError(""); setSuccess(""); setCaptchaToken(undefined); }}
                                        >
                                            Didn't receive a code? Go back
                                        </Button>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={loading || otp.length !== 6} className="w-full">
                                        {loading ? "Verifying..." : "Verify Code"}
                                    </Button>
                                </CardFooter>
                            </form>
                        )}

                        {/* ── Step 3: New Password ── */}
                        {step === "password" && (
                            <form onSubmit={handlePasswordSubmit}>
                                <CardContent className="mb-5">
                                    {error && (
                                        <Alert className="flex flex-row justify-center bg-red-500/20 border border-red-500/50 text-red-300 p-2 text-sm mb-4">
                                            <BadgeAlert />
                                            <AlertTitle>{error}</AlertTitle>
                                        </Alert>
                                    )}
                                    <div className="flex flex-col gap-5">
                                        {/* New Password */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <div className="flex">
                                                <Input
                                                    id="newPassword"
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    minLength={8}
                                                    autoComplete="new-password"
                                                    required
                                                />
                                                <Button variant="ghost" type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                                                    {showNewPassword ? <Eye /> : <EyeClosed />}
                                                </Button>
                                            </div>
                                            <div className="mt-1">{passwordStrengthBar}</div>
                                        </div>

                                        {/* Confirm New Password */}
                                        <div className="grid gap-2">
                                            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                                            <div className="flex">
                                                <Input
                                                    id="confirmNewPassword"
                                                    type={showConfirmNewPassword ? "text" : "password"}
                                                    value={confirmNewPassword}
                                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                    minLength={8}
                                                    autoComplete="new-password"
                                                    required
                                                />
                                                <Button variant="ghost" type="button" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                                                    {showConfirmNewPassword ? <Eye /> : <EyeClosed />}
                                                </Button>
                                            </div>
                                            {confirmNewPassword && confirmNewPassword !== newPassword && (
                                                <p className="text-red-400 text-xs">Passwords do not match.</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={loading} className="w-full">
                                        {loading ? "Updating Password..." : "Update Password"}
                                    </Button>
                                </CardFooter>
                            </form>
                        )}
                    </Card>
                </div>
            </section>
        </main>
    );
};

export default function PasswordResetPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PasswordResetPageComponent />
        </Suspense>
    );
}
