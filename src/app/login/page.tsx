"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Magic Link Dispatched!", {
        description: `Check ${email} for your secure login link.`,
      });
      setEmail("");
    }, 600);
  };

  const handleGitHub = () => {
    toast.info("Connecting to GitHub OAuth...", {
      description: "Redirecting to Supabase OAuth provider.",
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        {/* Ambient glow backdrop */}
        <div className="pointer-events-none absolute -top-20 -left-20 size-60 rounded-full bg-cyan-500/15 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 size-60 rounded-full bg-purple-500/15 blur-[90px]" />

        <div className="relative rounded-3xl border border-white/[0.08] bg-[#090a0f]/80 p-8 backdrop-blur-2xl shadow-2xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25 mb-1">
              <Sparkles className="size-6 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Enter Vibe UI Show
            </h1>
            <p className="text-xs text-slate-400">
              Sign in to publish creative experiments, bookmark favorites, and curate the bento showcase.
            </p>
          </div>

          {/* GitHub OAuth Button */}
          <button
            onClick={handleGitHub}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-white/[0.12] bg-white/[0.04] p-3 text-sm font-semibold text-white hover:bg-white/[0.08] hover:border-white/[0.2] transition-all cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <svg className="size-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>Continue with GitHub</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[11px] font-mono text-slate-500 uppercase">
              Or email magic link
            </span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Magic link form */}
          <form onSubmit={handleMagicLink} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@vibe-ui.show"
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full h-11 rounded-2xl font-semibold gap-2"
            >
              <span>{loading ? "Sending link..." : "Send Magic Link"}</span>
              <ArrowRight className="size-4" />
            </Button>
          </form>

          {/* Guest Identity Notice */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <ShieldCheck className="size-3.5" />
              <span>Hybrid Guest Session Active</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              You can vote, star, and comment right now without signing in. When you log in later, your contributions automatically link to your account.
            </p>
          </div>

          {/* Back to explore */}
          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-cyan-300 transition-colors"
            >
              ← Back to Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
