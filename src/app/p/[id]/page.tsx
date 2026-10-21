import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Calendar, Sparkles, ExternalLink, ShieldCheck } from "lucide-react";
import {
  getProjectById,
  getCommentsForProject,
  mockProjectsWithAuthor,
} from "@/lib/mock-data";
import { ProjectTabs } from "@/components/viewer/project-tabs";
import { StarRating } from "@/components/rating/star-rating";
import { FavoriteButton } from "@/components/rating/favorite-button";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return mockProjectsWithAuthor.map((p) => ({
    id: p.id,
  }));
}

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;

  // Find project by id or fallback to first matching slug
  const project =
    getProjectById(id) ||
    mockProjectsWithAuthor.find((p) => p.slug === id) ||
    mockProjectsWithAuthor.find((p) => p.id.includes(id));

  if (!project) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-12 backdrop-blur-2xl max-w-md space-y-4">
          <div className="size-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
            !
          </div>
          <h2 className="text-xl font-bold text-white">Project Not Found</h2>
          <p className="text-sm text-slate-400">
            The experiment with ID &quot;{id}&quot; does not exist or may have been unlisted.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-all"
          >
            <ArrowLeft className="size-3.5" />
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const comments = getCommentsForProject(project.id);
  const authorName =
    project.author?.display_name || project.author?.username || "Creative Dev";
  const authorHandle = project.author?.username || "creator";

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-white/[0.2] hover:bg-white/[0.06] hover:text-white transition-all backdrop-blur-md"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Explore</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <FavoriteButton
            initialCount={project.favorite_count}
            isFavorited={false}
          />
          <a
            href={`/embed/${project.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 shadow-sm shadow-cyan-500/20 transition-all"
          >
            <ExternalLink className="size-3.5" />
            <span>Fullscreen Embed</span>
          </a>
        </div>
      </div>

      {/* Project Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.is_featured && (
            <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
              <Sparkles className="size-3" />
              FEATURED VIBE
            </span>
          )}
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
            <ShieldCheck className="size-3" />
            SANDBOX ISOLATED
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          {project.title}
        </h1>

        <p className="text-base text-slate-300 max-w-3xl leading-relaxed">
          {project.description}
        </p>

        {/* Metadata row: Author, Rating, Views, Date */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
          <Link
            href={`/u/${authorHandle}`}
            className="flex items-center gap-2 group hover:text-white transition-colors"
          >
            <div className="size-7 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
              {authorName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {authorName}
              </span>
              <span className="text-[11px] text-slate-500 ml-1.5 font-mono">
                @{authorHandle}
              </span>
            </div>
          </Link>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Interactive Star Rating */}
          <StarRating
            initialRating={project.avg_rating}
            ratingCount={project.rating_count}
          />

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Views */}
          <div className="flex items-center gap-1.5 font-mono">
            <Eye className="size-3.5 text-slate-500" />
            <span>{project.view_count.toLocaleString()} views</span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Published date */}
          <div className="flex items-center gap-1.5 font-mono text-slate-500">
            <Calendar className="size-3.5" />
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Tag Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="default" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Main Tabs Section (Preview / Code / Comments) */}
      <ProjectTabs project={project} comments={comments} />
    </div>
  );
}
