"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            if (!res.ok) throw new Error("Failed to logout");

            localStorage.removeItem("remember_me");
            sessionStorage.removeItem("remember_me");

            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = "/login";
        }
    };

    return (
        <button onClick={handleLogout}>
            <LogoutIcon />
            Logout
        </button>
    );
}

function LogoutIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 17 5-5-5-5"/>
            <path d="M21 12H9"/>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        </svg>
    );
}