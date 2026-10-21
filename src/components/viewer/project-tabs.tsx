"use client";

import * as React from "react";
import { Play, Code2, MessageSquare, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { SandboxViewer } from "./sandbox-viewer";
import { CommentsSection } from "@/components/comments/comments-section";
import { CommentWithAuthor, ProjectWithAuthor } from "@/types/database";
import { cn } from "@/lib/utils";

interface ProjectTabsProps {
  project: ProjectWithAuthor;
  comments: CommentWithAuthor[];
}

export function ProjectTabs({ project, comments }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = React.useState<"preview" | "code" | "comments">("preview");
  const [copied, setCopied] = React.useState(false);

  const rawCode = project.code || project.html_code || "";

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Tab Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-2">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
          <button
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer",
              activeTab === "preview"
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
            )}
          >
            <Play className="size-3.5 fill-current" />
            Live Preview
          </button>

          <button
            onClick={() => setActiveTab("code")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer",
              activeTab === "code"
                ? "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
            )}
          >
            <Code2 className="size-3.5" />
            Inspect Code
          </button>

          <button
            onClick={() => setActiveTab("comments")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 cursor-pointer",
              activeTab === "comments"
                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
            )}
          >
            <MessageSquare className="size-3.5" />
            Comments ({comments.length})
          </button>
        </div>

        {activeTab === "code" && (
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-white/[0.2] hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy Source</span>
              </>
            )}
          </button>
        )}

        {activeTab === "preview" && (
          <a
            href={`/embed/${project.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            <ExternalLink className="size-3.5" />
            <span>Open Standalone Tab</span>
          </a>
        )}
      </div>

      {/* Tab Panels */}
      {activeTab === "preview" && (
        <div className="w-full h-[640px] rounded-2xl overflow-hidden border border-white/[0.08] bg-[#07080c] shadow-2xl">
          <SandboxViewer
            htmlCode={rawCode}
            title={project.title}
            fullscreenHref={`/embed/${project.id}`}
            className="h-full border-0 rounded-none"
          />
        </div>
      )}

      {activeTab === "code" && (
        <div className="w-full rounded-2xl border border-white/[0.08] bg-[#07080d] p-4 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] text-xs font-mono text-slate-400">
            <span>HTML/CSS/JS SOURCE ({Math.round(rawCode.length / 1024 * 10) / 10} KB)</span>
            <span className="text-slate-600">UTF-8 • Strict Sandbox Verified</span>
          </div>
          <pre className="p-4 rounded-xl bg-black/40 overflow-x-auto text-xs font-mono text-cyan-200 leading-relaxed max-h-[580px] selection:bg-cyan-500/30 selection:text-white">
            <code>{rawCode}</code>
          </pre>
        </div>
      )}

      {activeTab === "comments" && (
        <div className="w-full pt-2">
          <CommentsSection
            projectId={project.id}
            initialComments={comments}
          />
        </div>
      )}
    </div>
  );
}
