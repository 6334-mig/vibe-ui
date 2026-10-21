import Link from "next/link";
import { ArrowLeft, Star, Bookmark, Eye, Sparkles, Globe, Calendar, Award } from "lucide-react";
import { mockProfiles, mockProjectsWithAuthor } from "@/lib/mock-data";
import { BentoCard } from "@/components/bento/bento-card";
import { Badge } from "@/components/ui/badge";

export function generateStaticParams() {
  return mockProfiles.map((p) => ({
    username: p.username,
  }));
}

interface UserProfileProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: UserProfileProps) {
  const { username } = await params;

  const profile =
    mockProfiles.find((p) => p.username === username) ||
    mockProfiles.find((p) => p.username.toLowerCase() === username.toLowerCase()) ||
    mockProfiles[0]; // Graceful fallback for demo

  // User's published projects
  const userProjects = mockProjectsWithAuthor.filter(
    (p) => p.author?.username === profile.username || p.user_id === profile.id || p.author_id === profile.id
  );

  // If user has no projects in mock data, show some sample projects
  const displayProjects = userProjects.length > 0 ? userProjects : mockProjectsWithAuthor.slice(0, 3);

  const totalViews = displayProjects.reduce((acc, p) => acc + p.view_count, 0);
  const totalStars = displayProjects.reduce((acc, p) => acc + p.favorite_count, 0);
  const avgRating =
    displayProjects.length > 0
      ? (displayProjects.reduce((acc, p) => acc + p.avg_rating, 0) / displayProjects.length).toFixed(1)
      : "5.0";

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-white/[0.2] hover:bg-white/[0.06] hover:text-white transition-all backdrop-blur-md"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Explore</span>
        </Link>
      </div>

      {/* User Hero Banner */}
      <div className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] via-white/[0.02] to-cyan-950/20 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-cyan-500/10 blur-[90px]" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-purple-500/10 blur-[90px]" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="size-20 sm:size-24 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-1 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-[#090a0f] flex items-center justify-center text-2xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-300 to-purple-300">
                {(profile.display_name || profile.username).substring(0, 2).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {profile.display_name || profile.username}
                </h1>
                {profile.role === "admin" ? (
                  <Badge variant="cyan" className="font-mono text-[10px]">ADMIN</Badge>
                ) : (
                  <Badge variant="purple" className="font-mono text-[10px]">CREATOR</Badge>
                )}
              </div>

              <p className="text-sm font-mono text-cyan-400">@{profile.username}</p>

              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed pt-1">
                {profile.bio || "Creative coder, generative artist, and UI experimenter building with Three.js and shaders."}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 font-mono">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
                  >
                    <Globe className="size-3.5" />
                    <span>{profile.website.replace("https://", "")}</span>
                  </a>
                )}
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="size-3.5" />
                  <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center">
              <p className="text-[10px] text-slate-400 font-mono">PROJECTS</p>
              <p className="text-xl font-black text-white font-mono mt-0.5">{displayProjects.length}</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center">
              <p className="text-[10px] text-slate-400 font-mono">STARS</p>
              <p className="text-xl font-black text-pink-400 font-mono mt-0.5">{totalStars}</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-center">
              <p className="text-[10px] text-slate-400 font-mono">AVG SCORE</p>
              <p className="text-xl font-black text-amber-400 font-mono mt-0.5">⭐ {avgRating}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User's Published Experiments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              Published Experiments ({displayProjects.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProjects.map((project) => (
            <BentoCard
              key={project.id}
              project={project}
              variant="standard"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
