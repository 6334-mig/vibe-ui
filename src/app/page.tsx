"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Upload, Flame, Star, Cpu } from "lucide-react";
import { SearchBar, SortFilter } from "@/components/ui/search-bar";
import { BentoGrid } from "@/components/bento/bento-grid";
import { mockProjectsWithAuthor, getAllTags } from "@/lib/mock-data";
import { ProjectWithAuthor } from "@/types/database";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSort, setSelectedSort] = React.useState<SortFilter>("all");
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);

  const availableTags = React.useMemo(() => getAllTags(), []);

  // Filter and sort mock projects
  const filteredProjects = React.useMemo(() => {
    let result = [...mockProjectsWithAuthor];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.author?.username.toLowerCase().includes(q) ||
          p.author?.display_name?.toLowerCase().includes(q)
      );
    }

    // Tag filter
    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }

    // Sorting
    switch (selectedSort) {
      case "top_rated":
        result.sort((a, b) => b.avg_rating - a.avg_rating);
        break;
      case "most_starred":
        result.sort((a, b) => b.favorite_count - a.favorite_count);
        break;
      case "trending":
        result.sort((a, b) => b.view_count - a.view_count);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      default:
        // Featured first, then rating
        result.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return b.avg_rating - a.avg_rating;
        });
        break;
    }

    return result;
  }, [searchQuery, selectedSort, selectedTag]);

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-pink-500/15 blur-[120px] rounded-full -z-10" />

      {/* Hero Header Section */}
      <section className="text-center space-y-4 pt-4 pb-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 shadow-sm shadow-cyan-500/20 backdrop-blur-md">
          <Sparkles className="size-3.5 text-cyan-400 animate-pulse" />
          <span>Curated Interactive Frontend Experiments</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          Where Code Becomes{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            Pure Vibe
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
          An open, sandboxed showcase for creative frontend engineers and generative designers to run, inspect, rate, and publish Three.js, Canvas, and CSS art.
        </p>

        {/* Hero Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
          >
            <Upload className="size-4" />
            <span>Launch Studio & Upload</span>
          </Link>
          <a
            href="#discover"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer backdrop-blur-md"
          >
            <Flame className="size-4 text-amber-400" />
            <span>Explore Bento Grid</span>
          </a>
        </div>
      </section>

      {/* Search and Filters */}
      <section id="discover" className="space-y-6 pt-4">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          availableTags={availableTags}
        />

        {/* Bento Discovery Grid */}
        <BentoGrid projects={filteredProjects} />
      </section>
    </div>
  );
}
