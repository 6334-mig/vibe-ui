"use client";

import * as React from "react";
import { buildSandboxedHtml } from "@/lib/sandbox";
import { Maximize2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SandboxViewerProps {
  htmlCode: string;
  className?: string;
  title?: string;
  fullscreenHref?: string;
  autoReloadKey?: number | string;
}

export function SandboxViewer({
  htmlCode,
  className,
  title = "Interactive Experiment Sandbox",
  fullscreenHref,
  autoReloadKey = 0,
}: SandboxViewerProps) {
  const [reloadKey, setReloadKey] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const sandboxedSrc = React.useMemo(() => {
    return buildSandboxedHtml(htmlCode || "<!-- Empty project -->");
  }, [htmlCode]);

  const handleReload = () => {
    setIsLoading(true);
    setReloadKey((k) => k + 1);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col w-full h-full min-h-[420px] rounded-2xl border border-white/[0.08] bg-[#07080c] overflow-hidden shadow-2xl group",
        className
      )}
    >
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleReload}
          title="Restart Canvas"
          className="flex size-8 items-center justify-center rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer shadow-lg"
        >
          <RotateCcw className="size-3.5" />
        </button>

        {fullscreenHref && (
          <a
            href={fullscreenHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Sandbox in Fullscreen"
            className="flex size-8 items-center justify-center rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-all cursor-pointer shadow-lg"
          >
            <Maximize2 className="size-3.5" />
          </a>
        )}
      </div>

      {/* Sandboxed Iframe (STRICT ZERO-TRUST SECURITY: allow-scripts allow-pointer-lock only) */}
      <iframe
        key={`${reloadKey}-${autoReloadKey}`}
        srcDoc={sandboxedSrc}
        title={title}
        sandbox="allow-scripts allow-pointer-lock"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        className="w-full h-full flex-1 border-0 bg-[#090a0f]"
      />

      {/* Loading overlay indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#090a0f]/80 backdrop-blur-sm pointer-events-none transition-opacity">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="size-2 rounded-full bg-cyan-400 animate-ping"></span>
            INITIALIZING SHADER RUNTIME...
          </div>
        </div>
      )}
    </div>
  );
}
