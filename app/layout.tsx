import type { Metadata } from "next";
import "./globals.css";

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
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Beyond Wiki</title>
            </head>
            <body className="hub-page">{children}</body>
        </html>
    );
}
