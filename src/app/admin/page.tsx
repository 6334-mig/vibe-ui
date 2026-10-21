"use client";

import * as React from "react";
import Link from "next/link";
import {
  Shield,
  CheckCircle,
  XCircle,
  Star,
  Flag,
  Eye,
  Filter,
  AlertTriangle,
  Sparkles,
  Layers,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { mockProjectsWithAuthor } from "@/lib/mock-data";
import { ProjectWithAuthor, ProjectStatus } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [projects, setProjects] = React.useState<ProjectWithAuthor[]>(mockProjectsWithAuthor);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // Summary Metrics
  const totalCount = projects.length;
  const pendingCount = projects.filter((p) => p.status === "pending").length;
  const publishedCount = projects.filter(
    (p) => p.status === "published" || p.status === "approved"
  ).length;
  const featuredCount = projects.filter((p) => p.is_featured).length;

  const handleApprove = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "published" as ProjectStatus } : p))
    );
    toast.success("Project Approved", {
      description: "Status changed to published. Visible in discovery grid.",
    });
  };

  const handleReject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "rejected" as ProjectStatus } : p))
    );
    toast.error("Project Rejected", {
      description: "Project rejected and removed from public listings.",
    });
  };

  const handleToggleFeature = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_featured: !p.is_featured } : p
      )
    );
    toast.info("Feature Status Updated", {
      description: "Project featured toggle modified.",
    });
  };

  const handleFlag = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "flagged" as ProjectStatus } : p))
    );
    toast.warning("Project Flagged", {
      description: "Marked for administrative security review.",
    });
  };

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "featured") return p.is_featured;
    return p.status === statusFilter;
  });

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20">
            <Shield className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Curator & Moderation Console
              <span className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[10px] font-mono text-purple-300 border border-purple-500/30">
                ADMIN ACCESS
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Audit incoming vibe submissions, toggle featured spots, and enforce sandbox safety.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl">
          <p className="text-xs font-medium text-slate-400">TOTAL SUBMISSIONS</p>
          <p className="text-2xl font-black text-white mt-1 font-mono">{totalCount}</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl">
          <p className="text-xs font-medium text-slate-400">PUBLISHED EXPERIMENTS</p>
          <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">{publishedCount}</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl">
          <p className="text-xs font-medium text-slate-400">PENDING REVIEW</p>
          <p className="text-2xl font-black text-amber-400 mt-1 font-mono">{pendingCount}</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl">
          <p className="text-xs font-medium text-slate-400">FEATURED BENTO SPOTS</p>
          <p className="text-2xl font-black text-purple-400 mt-1 font-mono">{featuredCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] pb-3">
        {[
          { id: "all", label: "All Projects" },
          { id: "published", label: "Published" },
          { id: "pending", label: "Pending" },
          { id: "featured", label: "Featured" },
          { id: "flagged", label: "Flagged" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === tab.id
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Moderation Queue Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-mono">
              <tr>
                <th className="p-4 font-medium">PROJECT & AUTHOR</th>
                <th className="p-4 font-medium">TAGS</th>
                <th className="p-4 font-medium">STATUS</th>
                <th className="p-4 font-medium">RATINGS / VIEWS</th>
                <th className="p-4 font-medium text-right">MOD ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredProjects.map((p) => {
                const author = p.author?.display_name || p.author?.username || "creator";
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="p-4">
                      <div className="space-y-1">
                        <Link
                          href={`/p/${p.id}`}
                          className="font-bold text-slate-100 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                        >
                          <span>{p.title}</span>
                          {p.is_featured && (
                            <Star className="size-3 text-amber-400 fill-amber-400" />
                          )}
                        </Link>
                        <p className="text-[11px] text-slate-400">
                          by @{p.author?.username || "user"} • {new Date(p.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-slate-300 border border-white/5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      {p.status === "published" || p.status === "approved" ? (
                        <Badge variant="emerald">PUBLISHED</Badge>
                      ) : p.status === "pending" ? (
                        <Badge variant="amber">PENDING</Badge>
                      ) : p.status === "flagged" ? (
                        <Badge variant="rose">FLAGGED</Badge>
                      ) : (
                        <Badge variant="default">{p.status.toUpperCase()}</Badge>
                      )}
                    </td>

                    <td className="p-4 font-mono text-slate-300">
                      <div>⭐ {p.avg_rating.toFixed(1)} ({p.rating_count})</div>
                      <div className="text-[11px] text-slate-500">👁 {p.view_count.toLocaleString()}</div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/p/${p.id}`}
                          title="Inspect Preview"
                          className="p-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 text-slate-400 hover:text-white transition-all"
                        >
                          <Eye className="size-3.5" />
                        </Link>

                        <button
                          onClick={() => handleToggleFeature(p.id)}
                          title="Toggle Featured"
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            p.is_featured
                              ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                              : "border-white/[0.08] hover:border-amber-500/30 text-slate-400 hover:text-amber-300"
                          }`}
                        >
                          <Star className="size-3.5" />
                        </button>

                        <button
                          onClick={() => handleApprove(p.id)}
                          title="Approve & Publish"
                          className="p-1.5 rounded-lg border border-white/[0.08] hover:border-emerald-500/40 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 transition-all cursor-pointer"
                        >
                          <CheckCircle className="size-3.5" />
                        </button>

                        <button
                          onClick={() => handleFlag(p.id)}
                          title="Flag for Abuse"
                          className="p-1.5 rounded-lg border border-white/[0.08] hover:border-rose-500/40 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-all cursor-pointer"
                        >
                          <Flag className="size-3.5" />
                        </button>

                        <button
                          onClick={() => handleReject(p.id)}
                          title="Reject Project"
                          className="p-1.5 rounded-lg border border-white/[0.08] hover:border-red-500/40 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                        >
                          <XCircle className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
