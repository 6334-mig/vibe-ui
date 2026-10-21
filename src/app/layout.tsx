import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/ui/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibe UI Show",
  description:
    "A glassmorphic bento-grid showcase platform for creative frontend experiments. Explore, share, and rate HTML/CSS/JS art.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#090a0f] text-foreground">
        {/* Glass navigation header */}
        <Suspense fallback={<div className="h-16 w-full border-b border-white/[0.08] bg-[#090a0f]/80" />}>
          <Navbar />
        </Suspense>

        {/* Main content area */}
        <main className="flex-1">{children}</main>

        {/* Minimal glass footer */}
        <footer className="border-t border-white/[0.06] bg-[#090a0f]/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="text-neon-cyan">✦</span>
              <span>Vibe UI Show</span>
            </div>
            <p className="text-xs text-muted">
              Built with Next.js, Tailwind CSS & glassmorphism.
              Creative experiments welcome.
            </p>
          </div>
        </footer>

        {/* Toast notifications */}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(15, 17, 23, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              color: "#e2e8f0",
            },
          }}
        />
      </body>
    </html>
  );
}
