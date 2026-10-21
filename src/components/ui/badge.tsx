import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors border",
  {
    variants: {
      variant: {
        default:
          "border-white/10 bg-white/[0.04] text-slate-300 backdrop-blur-sm",
        cyan:
          "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-sm shadow-cyan-500/20",
        purple:
          "border-purple-500/30 bg-purple-500/10 text-purple-300 shadow-sm shadow-purple-500/20",
        amber:
          "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-sm shadow-amber-500/20",
        emerald:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-sm shadow-emerald-500/20",
        rose:
          "border-rose-500/30 bg-rose-500/10 text-rose-300 shadow-sm shadow-rose-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
