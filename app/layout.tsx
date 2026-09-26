import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Beyond Wiki",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            suppressHydrationWarning
            lang="en"
            // className={cn("dark", "h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
            className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
        >
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body className="min-h-full flex flex-col">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
