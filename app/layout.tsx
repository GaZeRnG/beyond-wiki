import "./globals.css";
import type { Metadata } from "next";
import Footer from "./components/footer";

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
            <body>
                {children}
                <Footer />
            </body>
        </html>
    );
}
