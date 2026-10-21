import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?: "cyan" | "purple" | "amber" | "none";
}

export function GlassCard({
  className,
  hoverable = false,
  glow = "none",
  children,
  ...props
}: GlassCardProps) {
  const glowStyles = {
    none: "",
    cyan: "hover:shadow-[0_0_35px_-5px_rgba(6,182,212,0.25)] hover:border-cyan-500/40",
    purple: "hover:shadow-[0_0_35px_-5px_rgba(168,85,247,0.25)] hover:border-purple-500/40",
    amber: "hover:shadow-[0_0_35px_-5px_rgba(245,158,11,0.25)] hover:border-amber-500/40",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-2xl transition-all duration-300",
        hoverable && "hover:border-white/[0.2] hover:bg-white/[0.05] hover:-translate-y-0.5",
        glow !== "none" && glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
