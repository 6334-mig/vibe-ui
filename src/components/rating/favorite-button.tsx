"use client";

import * as React from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  initialCount?: number;
  isFavorited?: boolean;
  className?: string;
  size?: "sm" | "default";
}

export function FavoriteButton({
  initialCount = 12,
  isFavorited: initialFavorited = false,
  className,
  size = "default",
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = React.useState(initialFavorited);
  const [count, setCount] = React.useState(initialCount);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = !favorited;
    setFavorited(nextState);
    setCount((prev) => (nextState ? prev + 1 : prev - 1));

    if (nextState) {
      toast.success("Saved to your vibes!", {
        description: "Added to your personal collection.",
      });
    } else {
      toast("Removed from collection", {
        description: "Project unbookmarked.",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md transition-all duration-200 cursor-pointer select-none",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
        favorited
          ? "border-pink-500/40 bg-pink-500/15 text-pink-300 shadow-sm shadow-pink-500/20"
          : "text-slate-400 hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-slate-200",
        className
      )}
    >
      <Bookmark
        className={cn(
          "transition-colors",
          size === "sm" ? "size-3.5" : "size-4",
          favorited ? "fill-pink-400 text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" : "fill-transparent"
        )}
      />
      <span className="font-mono font-medium">{count}</span>
    </button>
  );
}
