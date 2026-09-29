"use client";

import Link from "next/link";
import Image from "next/image";
import { animate } from 'animejs';
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { BadgeCheck, BadgeAlert, Eye, EyeClosed } from "lucide-react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordStrength, setPasswordStrength] = useState<number>(0);
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const barRef = useRef<HTMLDivElement>(null);

    // Validation
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Username
        if (username.length < 3 || username.length > 30 || !/^[A-Za-z][A-Za-z0-9\-]*$/.test(username)) {
            newErrors.username = "Username must be between 3 and 30 characters, start with a letter, and can only include letters, numbers, or dash.";
        }

        // Email
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Valid email is required.";
        }

        // Password
        if (!password || password.length < 8 || !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}/.test(password)) {
            newErrors.password = "Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and special characters.";
        }

        // Confirm Password
        if (!confirmPassword || confirmPassword !== password) {
            newErrors.confirmPassword = "Confirm password must match.";
        }

        setValidationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // Password Strength
    useEffect(() => {
        calculatePasswordStrength(password);
        updateBarColor();
    }, [password]);

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
        setPasswordStrength(strength);
    };

    const updateBarColor = () => {
        if (barRef.current) {
            const colors = ["#d10000", "#cc8800", "f6ff00", "#f6ff00", "#0ed600"];
            const targetColor = colors[Math.min(passwordStrength, 4)];
            animate(
                barRef.current,
                {
                    backgroundColor: targetColor,
                    duration: 300,
                    ease: 'InOutQuad'
                }
            );
        }
    };

    const passwordStrengthBar = (
        <div className="flex rounded-full overflow-hidden" ref={barRef}>
            {Array.from({ length: 5 }, (_, i) => (
                <div
                    key={i}
                    className={`flex-1 h-1 ${i < passwordStrength ? '' : 'bg-ring'}`}
                />
            ))}
        </div>
    );

    // Submit
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setError("");
        setValidationErrors({});
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        const res = await fetch ("api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username.trim(),
                email: email.trim(),
                password,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Failed to register. Please try again.");
            setLoading(false);
            return;
        }

        router.push("/login?registered=true");
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
                            <CardTitle>Signup To Beyond Wiki</CardTitle>
                            <CardDescription>Oh hey! a new player. Go ahead and signup to be able to join the community!</CardDescription>
                            <CardAction>
                                <Button variant="link" className="text-foreground pb-2">
                                    <a href="/login">
                                        Login
                                    </a>
                                </Button>
                            </CardAction>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="mb-5">
                                {/* Error */}
                                {error && (
                                    <Alert className="flex flex-row justify-center bg-red-500/20 border border-red-500/50 text-red-300 p-2 text-sm">
                                        <BadgeAlert />
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}

                                <div className="flex flex-col gap-5">
                                    {/* Username */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input type="text" value={username} placeholder="Wikiversal" minLength={3} maxLength={30} onChange={(e) => setUsername(e.target.value)} autoComplete="username" pattern="[A-Za-z][A-Za-z0-9\-]*" title="Must start with a letter. Only letters, numbers, or dash" required />
                                        {validationErrors.username && <p className="text-red-400 text-xs">{validationErrors.username}</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input type="email" value={email} placeholder="email@example.com" onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                                        {validationErrors.email && <p className="text-red-400 text-xs">{validationErrors.email}</p>}
                                    </div>

                                    {/* Password */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="flex">
                                            <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} autoComplete="new-password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter, and special character" required />
                                            <Button variant="ghost" type="button" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <Eye /> : <EyeClosed />}
                                            </Button>
                                        </div>
                                        <div className="mt-1">
                                            {passwordStrengthBar}
                                        </div>
                                        {validationErrors.password && <p className="text-red-400 text-xs">{validationErrors.password}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Confirm Password</Label>
                                        <div className="flex">
                                            <Input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={8} autoComplete="new-password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter, and special character" required />
                                            <Button variant="ghost" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                {showConfirmPassword ? <Eye /> : <EyeClosed />}
                                            </Button>
                                        </div>
                                        {validationErrors.confirmPassword && <p className="text-red-400 text-xs">{validationErrors.confirmPassword}</p>}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? "Signing up..." : "Sign up"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </section>
        </main>
    )
}