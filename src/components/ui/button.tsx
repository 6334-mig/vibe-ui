import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-white/[0.05] hover:bg-white/[0.1] text-slate-100 border border-white/[0.1] hover:border-white/[0.2] backdrop-blur-md shadow-sm active:scale-[0.98]",
        primary:
          "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 border border-cyan-400/30 active:scale-[0.98]",
        secondary:
          "bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 active:scale-[0.98]",
        danger:
          "bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 active:scale-[0.98]",
        ghost:
          "hover:bg-white/[0.06] text-slate-300 hover:text-white active:scale-[0.98]",
        outline:
          "border border-white/20 bg-transparent hover:bg-white/[0.05] text-slate-200 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-6 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
