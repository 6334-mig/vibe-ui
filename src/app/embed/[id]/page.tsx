import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { getProjectById, mockProjectsWithAuthor } from "@/lib/mock-data";
import { buildSandboxedHtml } from "@/lib/sandbox";

export function generateStaticParams() {
  return mockProjectsWithAuthor.map((p) => ({
    id: p.id,
  }));
}

interface EmbedPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { id } = await params;

  const project =
    getProjectById(id) ||
    mockProjectsWithAuthor.find((p) => p.slug === id) ||
    mockProjectsWithAuthor.find((p) => p.id.includes(id));

  if (!project) {
    notFound();
  }

  const rawCode = project.code || project.html_code || "";
  const sandboxedSrc = buildSandboxedHtml(rawCode);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#090a0f]">
      {/* Floating Minimal Badge */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
        <Link
          href={`/p/${project.id}`}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-[#090a0f]/80 px-3.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md shadow-2xl hover:border-white/20 hover:text-white transition-all"
        >
          <ArrowLeft className="size-3.5" />
          <span>{project.title}</span>
        </Link>

        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-bold text-cyan-300 backdrop-blur-md hover:bg-cyan-500/20 transition-all"
        >
          <Sparkles className="size-3" />
          <span>VIBE UI</span>
        </Link>
      </div>

      {/* Strict Sandboxed Iframe (Zero Same-Origin, allow-scripts allow-pointer-lock only) */}
      <iframe
        srcDoc={sandboxedSrc}
        title={project.title}
        sandbox="allow-scripts allow-pointer-lock"
        className="w-full h-full border-0 bg-[#090a0f]"
      />
    </div>
  );
}
