import "./globals.css";
import type { Metadata } from "next";
import FooterWrapper from "./components/footerWrapper";

export const metadata: Metadata = {
    title: "Beyond Wiki"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
                <FooterWrapper />
            </body>
        </html>
    );
}
