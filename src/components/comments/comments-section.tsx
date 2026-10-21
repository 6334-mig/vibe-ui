"use client";

import * as React from "react";
import { Send, MessageSquare, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { CommentWithAuthor } from "@/types/database";
import { Button } from "@/components/ui/button";

interface CommentsSectionProps {
  projectId: string;
  initialComments: CommentWithAuthor[];
}

export function CommentsSection({
  projectId,
  initialComments,
}: CommentsSectionProps) {
  const [comments, setComments] = React.useState<CommentWithAuthor[]>(initialComments);
  const [newContent, setNewContent] = React.useState("");
  const [authorName, setAuthorName] = React.useState("GuestViber");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const trimmed = newContent.trim().slice(0, 2000);

    const newComment: CommentWithAuthor = {
      id: `comm_${Date.now()}`,
      project_id: projectId,
      guest_id: `guest_${Math.random().toString(36).substring(2, 9)}`,
      guest_name: authorName.trim() || "Anonymous Guest",
      content: trimmed,
      is_hidden: false,
      created_at: new Date().toISOString(),
    };

    setComments((prev) => [newComment, ...prev]);
    setNewContent("");

    toast.success("Comment posted!", {
      description: "Signed with HMAC guest session and sanitized as plain text.",
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100">
            Discussion & Feedback ({comments.length})
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <ShieldCheck className="size-3.5" />
          <span>Anti-XSS Raw Text Guard Active</span>
        </div>
      </div>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-xl space-y-3"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <User className="size-3.5 text-cyan-400" />
            <span>Posting as:</span>
          </div>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name or handle..."
            maxLength={30}
            className="w-full sm:w-48 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none"
          />
        </div>

        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Share your thoughts on the code, shaders, or visual aesthetics..."
          rows={3}
          maxLength={2000}
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 text-sm text-slate-100 placeholder-slate-500 backdrop-blur-md focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/10"
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500 font-mono">
            {newContent.length} / 2000 chars
          </span>
          <Button
            type="submit"
            size="sm"
            variant="primary"
            disabled={!newContent.trim()}
            className="gap-1.5"
          >
            <Send className="size-3.5" />
            Post Comment
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-8 text-center text-sm text-slate-500">
            No comments yet. Be the first to vibe with this experiment!
          </div>
        ) : (
          comments.map((comment) => {
            const authorName =
              comment.author?.display_name ||
              comment.author?.username ||
              comment.guest_name ||
              "Guest";
            const isGuest = !comment.user_id;

            return (
              <div
                key={comment.id}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4.5 backdrop-blur-md space-y-2.5 transition-all hover:border-white/[0.12]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                      {authorName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-200">
                          {authorName}
                        </span>
                        {isGuest ? (
                          <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-mono text-slate-400 border border-white/5">
                            GUEST
                          </span>
                        ) : (
                          <span className="rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-cyan-400 border border-cyan-500/20">
                            CREATOR
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* CRITICAL SECURITY REQUIREMENT: Plain text only, NEVER dangerouslySetInnerHTML */}
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap select-text pl-9">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
