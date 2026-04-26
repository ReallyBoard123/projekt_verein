import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Suspense } from "react";
import StickyLogo from "@/components/StickyLogo";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Together — VereinsFinder Kassel",
  description: "Finde den passenden Verein in deiner Nähe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}
      >
        <StickyLogo />

        <Suspense fallback={<div className="flex-1 bg-background" />}>
          <div className="flex-1 pt-24">{children}</div>
        </Suspense>

        <footer className="w-full py-16 md:py-24 border-t border-border bg-background flex flex-col items-center justify-center gap-6">
          <p className="text-sm text-text-muted font-medium">Ein Projekt von</p>
          <Image
            src="/logo.png"
            alt="Project Logo"
            width={800}
            height={800}
            className="h-56 md:h-80 w-56 md:w-80 object-contain opacity-90 hover:opacity-100 transition-opacity"
          />
        </footer>
      </body>
    </html>
  );
}
