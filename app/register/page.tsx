"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@components/navbar";

export default function RegisterPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const validate = (): string[] => {
        const errs: string[] = [];

        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            errs.push("All fields are required.");
        }

        if (username.trim().length < 3 || username.trim().length > 30) {
            errs.push("Username must be between 3 and 30 characters.");
        }

        if (!/^[A-Za-z][A-Za-z0-9\-]*$/.test(username.trim())) {
            errs.push("Username must start with a letter and contain only letters, numbers, or dashes.");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errs.push("Invalid email format.");
        }

        if (password !== confirmPassword) {
            errs.push("Passwords do not match.");
        }

        if (password.length < 8) {
            errs.push("Password must be at least 8 characters long.");
        }

        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password)) {
            errs.push("Password must contain at least one number, one lowercase letter, and one uppercase letter.");
        }

        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        const validationErrors = validate();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return;
        }

        const res = await fetch ("api/auth/register", {
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
            setErrors([data.error || "Failed to register. Please try again."]);
            setLoading(false);
            return;
        }

        router.push("/login?registered=true");
    };

    return (
        <>
            <main className="register-page">
                <Navbar />
                <section className="register-whole">
                    <div className="register-container">
                        <h1 className="register-title">REGISTER</h1>

                        {/* Error message */}
                        {errors.length > 0 && (
                            <div className="register-error">
                                <ul className="register-error-list">
                                    {errors.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="register-form">
                            {/* Username */}
                            <label className="register-label-text">
                                <UserIcon />
                                <span>Username</span>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username" minLength={3} maxLength={30} pattern="[A-Za-z][A-Za-z0-9\-]*" title="Must start with a letter. Only letters, numbers, or dash" className="register-input" />
                            </label>
                            <p className="register-below-text">Must be 3 to 30 characters, containing only letters, numbers or dash</p>

                            {/* Email */}
                            <label className="register-label-text">
                                <EmailIcon />
                                <span>Email</span>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="register-input" />
                            </label>
                            <p className="register-below-text">Must be a valid email address</p>

                            {/* Password */}
                            <label className="register-label-text">
                                <KeyIcon />
                                <span>Password</span>
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" placeholder="Password" className="register-input" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="register-eye">
                                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                </button>
                            </label>
                            <p className="register-below-text">Must be more than 8 characters, including number, lowercase letter, uppercase letter</p>

                            {/* Confirm Password */}
                            <label className="register-label-text">
                                <KeyIcon />
                                <span>Confirm Password</span>
                                <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} placeholder="Confirm Password" className="register-input" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="register-eye">
                                    {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                </button>
                            </label>
                            <p className="register-below-text">Must match the password</p>

                            {/* Submit */}
                            <button type="submit" disabled={loading} className="register-submit">
                                {loading ? "Registering..." : "Register"}
                            </button>

                            <Link href="/login" className="register-back">Back to Login</Link>
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