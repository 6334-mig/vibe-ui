"use client";

import * as React from "react";
import { BentoCard } from "./bento-card";
import { ProjectWithAuthor } from "@/types/database";
import { Sparkles, Compass } from "lucide-react";

interface BentoGridProps {
  projects: ProjectWithAuthor[];
}

export function BentoGrid({ projects }: BentoGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.02] p-16 text-center backdrop-blur-xl">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4">
          <Compass className="size-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          No experiments matched your filters
        </h3>
        <p className="text-sm text-slate-400 max-w-sm">
          Try adjusting your search query, selecting different tags, or switching sort order.
        </p>
      </div>
    );
  }

  // The first project gets the Hero tile if there are multiple projects
  const [heroProject, ...remainingProjects] = projects;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
      {/* Hero Tile */}
      {heroProject && (
        <BentoCard
          key={heroProject.id}
          project={heroProject}
          variant="hero"
        />
      )}

      {/* Remaining Tiles */}
      {remainingProjects.map((project, idx) => {
        // Add subtle variation to layout
        const isWide = idx === 1 || idx === 5;
        return (
          <BentoCard
            key={project.id}
            project={project}
            variant={isWide ? "wide" : "standard"}
            className={isWide ? "md:col-span-2 lg:col-span-2" : ""}
          />
        );
      })}
    </div>
  );
}
