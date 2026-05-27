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
        <html lang="en" className="h-full">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body>
                <div className="flex-1">
                    {children}
                </div>
                <FooterWrapper />
            </body>
        </html>
    );
}
