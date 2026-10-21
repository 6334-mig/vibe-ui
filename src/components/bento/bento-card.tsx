"use client";

import * as React from "react";
import Link from "next/link";
import { Star, Bookmark, Play, Sparkles, ExternalLink, Eye } from "lucide-react";
import { motion } from "motion/react";
import { ProjectWithAuthor } from "@/types/database";
import { buildSandboxedHtml } from "@/lib/sandbox";
import { cn } from "@/lib/utils";

interface BentoCardProps {
  project: ProjectWithAuthor;
  variant?: "hero" | "tall" | "wide" | "standard";
  className?: string;
}

export function BentoCard({
  project,
  variant = "standard",
  className,
}: BentoCardProps) {
  const authorName =
    project.author?.display_name || project.author?.username || "Creative Dev";
  const authorHandle = project.author?.username || "creator";
  const isHero = variant === "hero";
  const isWide = variant === "wide";

  const rawCode = project.code || project.html_code || "";
  const sandboxedSrc = React.useMemo(() => {
    return buildSandboxedHtml(rawCode);
  }, [rawCode]);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0d14]/90 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.25)]",
        isHero && "col-span-1 md:col-span-2 lg:col-span-2 row-span-2",
        isWide && "md:col-span-2 lg:col-span-2",
        className
      )}
    >
      {/* Visual Live Preview Window */}
      <div
        className={cn(
          "relative w-full overflow-hidden border-b border-white/[0.06] bg-[#07080f]",
          isHero ? "h-64 sm:h-80" : isWide ? "h-48 sm:h-56" : "h-44 sm:h-48"
        )}
      >
        {/* Sandboxed iframe showing real live HTML/CSS/JS */}
        <iframe
          srcDoc={sandboxedSrc}
          title={project.title}
          sandbox="allow-scripts allow-pointer-lock"
          loading="lazy"
          className="w-full h-full border-0 pointer-events-none select-none bg-[#07080f]"
        />

        {/* Subtle glass gradient vignette on top of iframe */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0c0d14] via-transparent to-black/20 opacity-60 group-hover:opacity-30 transition-opacity duration-300" />

        {/* Top Floating Badge Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            {project.is_featured && (
              <span className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 shadow-md">
                <Sparkles className="size-3" />
                {isHero ? "#1 FEATURED" : "FEATURED"}
              </span>
            )}
            <span className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-black/60 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono font-semibold text-cyan-300">
              <span className="size-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              LIVE
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="size-3 fill-amber-400" />
              {project.avg_rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Hover Action Overlay */}
        <Link
          href={`/p/${project.id}`}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]"
          aria-label={`Open ${project.title}`}
        >
          <div className="flex items-center gap-2 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 px-4 py-2 text-xs font-bold text-cyan-200 shadow-lg shadow-cyan-500/30 backdrop-blur-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Play className="size-3.5 fill-current" />
            <span>Launch Live Experiment</span>
          </div>
        </Link>
      </div>

      {/* Card Content & Metadata */}
      <div className="flex flex-col justify-between flex-1 p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/p/${project.id}`}>
              <h3
                className={cn(
                  "font-black text-white hover:text-cyan-300 transition-colors line-clamp-1",
                  isHero ? "text-xl sm:text-2xl" : "text-base"
                )}
              >
                {project.title}
              </h3>
            </Link>

            <div className="flex items-center gap-1 text-xs font-mono text-slate-400 shrink-0">
              <Bookmark className="size-3 text-pink-400" />
              <span>{project.favorite_count}</span>
            </div>
          </div>

          <p
            className={cn(
              "text-slate-400 leading-relaxed",
              isHero ? "text-xs sm:text-sm line-clamp-2" : "text-xs line-clamp-2"
            )}
          >
            {project.description}
          </p>
        </div>

        {/* Footer: Tags, Author, & Direct Link */}
        <div className="pt-3 border-t border-white/[0.06] space-y-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, isHero ? 4 : 3).map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-mono text-slate-300"
              >
                #{tag}
              </span>
            ))}
            {project.tags.length > (isHero ? 4 : 3) && (
              <span className="text-[10px] text-slate-500 self-center font-mono">
                +{project.tags.length - (isHero ? 4 : 3)}
              </span>
            )}
          </div>

          {/* Author info & Actions */}
          <div className="flex items-center justify-between pt-1">
            <Link
              href={`/u/${authorHandle}`}
              className="flex items-center gap-2 group/author hover:text-white transition-colors"
            >
              <div className="size-6 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                {authorName.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-xs text-slate-400 group-hover/author:text-cyan-300 transition-colors">
                @{authorHandle}
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                <Eye className="size-3" />
                {project.view_count.toLocaleString()}
              </span>

              <Link
                href={`/p/${project.id}`}
                className="flex items-center gap-1 rounded-xl border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-slate-200 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/15 hover:text-cyan-300"
              >
                <span>Inspect</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
