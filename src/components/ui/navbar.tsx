"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Upload, Shield, Menu, X, LogIn, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

/** Navigation link definition */
interface NavLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { href: "/", label: "Explore", icon: <Compass className="size-4" /> },
  { href: "/upload", label: "Upload Studio", icon: <Upload className="size-4" /> },
  { href: "/admin", label: "Moderation", icon: <Shield className="size-4" /> },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#090a0f]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-md shadow-cyan-500/25 transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-200 to-purple-300">
            VIBE UI
          </span>
          <span className="hidden sm:inline-block rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">
            SHOWCASE
          </span>
        </Link>

        {/* Desktop navigation links */}
        <div className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/[0.08] text-cyan-300 border border-white/[0.1] shadow-sm"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side: Profile shortcut + Sign In + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/u/astrid_wave"
            className="hidden sm:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-white/[0.2] hover:bg-white/[0.06]"
          >
            <div className="size-5 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
              AW
            </div>
            <span>@astrid_wave</span>
          </Link>

          {/* Sign In button (desktop) */}
          <Link
            href="/login"
            className="hidden items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 shadow-sm shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-500/20 md:flex"
          >
            <LogIn className="size-3.5" />
            Sign In
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-9 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition-all hover:border-white/[0.2] hover:text-white md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-b border-white/[0.08] bg-[#090a0f]/95 backdrop-blur-2xl md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1.5 px-4 py-4 sm:px-6">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white/[0.08] text-cyan-300"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <Link
                  href="/u/astrid_wave"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <div className="size-4 rounded-full bg-cyan-400"></div>
                  Profile: @astrid_wave
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
