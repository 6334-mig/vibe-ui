"use client";

import * as React from "react";
import { Search, X, Sparkles, Flame, Star, Bookmark, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortFilter = "all" | "top_rated" | "most_starred" | "trending" | "newest";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSort: SortFilter;
  onSortChange: (sort: SortFilter) => void;
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  availableTags: string[];
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  selectedSort,
  onSortChange,
  selectedTag,
  onTagChange,
  availableTags,
}: SearchBarProps) {
  const sortOptions = [
    { id: "all", label: "All Vibes", icon: Sparkles },
    { id: "top_rated", label: "Top Rated ⭐", icon: Star },
    { id: "most_starred", label: "Most Starred 🔖", icon: Bookmark },
    { id: "trending", label: "Trending 🔥", icon: Flame },
    { id: "newest", label: "Newest ⚡", icon: Zap },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Search className="size-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search experiments by title, description, or author..."
          className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] py-3.5 pl-11 pr-10 text-sm text-slate-100 placeholder-slate-500 backdrop-blur-xl transition-all focus:border-cyan-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-4 focus:ring-cyan-500/10"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Sort Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {sortOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedSort === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSortChange(opt.id as SortFilter)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer",
                isSelected
                  ? "border border-cyan-400/40 bg-cyan-500/15 text-cyan-300 shadow-sm shadow-cyan-500/20"
                  : "border border-white/[0.06] bg-white/[0.02] text-slate-400 hover:border-white/[0.15] hover:bg-white/[0.05] hover:text-slate-200"
              )}
            >
              <Icon className="size-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mr-1">
          Tags:
        </span>
        <button
          onClick={() => onTagChange(null)}
          className={cn(
            "rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
            selectedTag === null
              ? "bg-white/10 text-white font-semibold"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
          )}
        >
          Any
        </button>
        {availableTags.slice(0, 8).map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => onTagChange(isSelected ? null : tag)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer",
                isSelected
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20 font-semibold"
                  : "bg-white/[0.02] text-slate-400 border border-white/[0.06] hover:border-white/[0.14] hover:text-slate-200"
              )}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
