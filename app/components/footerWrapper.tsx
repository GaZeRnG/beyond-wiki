"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Footer from "./footer";

const noFooterPaths = [
    "/login",
    "/register",
];

export default function FooterWrapper() {
    const pathname = usePathname();
    const hideFooter = noFooterPaths.includes(pathname);

    useEffect(() => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        window.scrollTo(0, 0);
    }, [pathname]);

    if (hideFooter) return null

    return <Footer />
}