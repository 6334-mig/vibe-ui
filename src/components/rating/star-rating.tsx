"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  initialRating?: number;
  ratingCount?: number;
  userRating?: number;
  interactive?: boolean;
  className?: string;
}

export function StarRating({
  initialRating = 4.5,
  ratingCount = 24,
  userRating: initialUserRating = 0,
  interactive = true,
  className,
}: StarRatingProps) {
  const [avgRating, setAvgRating] = React.useState(initialRating);
  const [count, setCount] = React.useState(ratingCount);
  const [userVote, setUserVote] = React.useState(initialUserRating);
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleRate = (score: number) => {
    if (!interactive) return;
    const oldVote = userVote;
    setUserVote(score);

    // Optimistically update count & average
    if (oldVote === 0) {
      setCount((c) => c + 1);
      setAvgRating((prev) =>
        parseFloat(((prev * count + score) / (count + 1)).toFixed(1))
      );
    } else {
      setAvgRating((prev) =>
        parseFloat(((prev * count - oldVote + score) / count).toFixed(1))
      );
    }

    toast.success(`Rated ${score} stars!`, {
      description: "Guest session cryptographically signed with HMAC-SHA256.",
    });
  };

  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled =
            hoverRating > 0 ? star <= hoverRating : star <= Math.round(avgRating);
          const isUserSelection = userVote > 0 && star <= userVote;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              onClick={() => handleRate(star)}
              className={cn(
                "p-0.5 rounded transition-transform duration-100",
                interactive && "hover:scale-125 cursor-pointer"
              )}
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={cn(
                  "size-4 transition-colors",
                  isFilled
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    : "fill-transparent text-slate-600",
                  isUserSelection && "text-amber-300"
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
        <span className="font-bold text-slate-200">{avgRating.toFixed(1)}</span>
        <span>({count})</span>
      </div>
    </div>
  );
}
