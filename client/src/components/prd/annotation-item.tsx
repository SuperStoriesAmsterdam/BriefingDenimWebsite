import { useState } from "react";
import type { Annotation, AnnotationReply } from "@/types/prd";
import { TEAM_COLORS, TEAM_LABELS } from "@/lib/prd-constants";
import { EditableText } from "./editable-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, AtSign, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnotationItemProps {
  annotation: Annotation;
  currentUser: string | null;
  allUsers: string[];
  onUpdate: (text: string) => void;
  onDelete: () => void;
  onSetTo: (to: string | undefined) => void;
  onAddReply: (reply: AnnotationReply) => void;
}

function timeAgo(ts?: string) {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function AnnotationItem({
  annotation,
  currentUser,
  allUsers,
  onUpdate,
  onDelete,
  onSetTo,
  onAddReply,
}: AnnotationItemProps) {
  const colors = TEAM_COLORS[annotation.team];
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showAssign, setShowAssign] = useState(false);

  const submitReply = () => {
    if (!replyText.trim() || !currentUser) return;
    onAddReply({
      author: currentUser,
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
    });
    setReplyText("");
    setReplying(false);
  };

  return (
    <div
      className={cn(
        "rounded-r border-l-[3px] overflow-hidden",
        colors.bg,
        colors.border
      )}
    >
      {/* Main annotation */}
      <div className="flex items-start gap-2 px-2.5 py-1.5">
        <div className="shrink-0">
          <span
            className={cn(
              "rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white",
              colors.badge
            )}
          >
            {TEAM_LABELS[annotation.team]}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <EditableText
            value={annotation.text}
            onChange={onUpdate}
            className="text-xs leading-relaxed text-foreground"
            multi
          />
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground/60">
            {annotation.author && <span>{annotation.author}</span>}
            {annotation.timestamp && <span>{timeAgo(annotation.timestamp)}</span>}
            {annotation.to && (
              <span className="rounded bg-blue-100 px-1 py-0.5 text-[9px] font-medium text-blue-700">
                → {annotation.to}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground/30 hover:text-blue-500"
            onClick={() => setShowAssign(!showAssign)}
            title="Assign to someone"
          >
            <AtSign className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground/30 hover:text-destructive"
            onClick={onDelete}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Assign to */}
      {showAssign && (
        <div className="flex flex-wrap items-center gap-1 px-2.5 pb-1.5">
          <span className="text-[10px] text-muted-foreground/60">Ask:</span>
          {allUsers.filter((u) => u !== currentUser).map((u) => (
            <button
              key={u}
              onClick={() => { onSetTo(u); setShowAssign(false); }}
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] transition-colors",
                annotation.to === u
                  ? "bg-blue-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-blue-100"
              )}
            >
              {u}
            </button>
          ))}
          {annotation.to && (
            <button
              onClick={() => { onSetTo(undefined); setShowAssign(false); }}
              className="rounded px-1.5 py-0.5 text-[10px] text-red-500 hover:bg-red-50"
            >
              clear
            </button>
          )}
        </div>
      )}

      {/* Replies */}
      {annotation.replies && annotation.replies.length > 0 && (
        <div className="border-t border-dashed border-current/10">
          {annotation.replies.map((r, ri) => (
            <div key={ri} className="flex items-start gap-2 px-2.5 py-1.5 pl-6 bg-white/50">
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed text-foreground">{r.text}</p>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground/60">
                  <span className="font-medium">{r.author}</span>
                  <span>{timeAgo(r.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply input */}
      {!replying ? (
        <button
          onClick={() => setReplying(true)}
          className="w-full border-t border-dashed border-current/10 px-2.5 py-1 text-left text-[10px] text-muted-foreground/40 hover:text-muted-foreground/70 hover:bg-white/30 transition-colors"
        >
          Reply...
        </button>
      ) : (
        <div className="flex items-center gap-1.5 border-t border-dashed border-current/10 px-2.5 py-1.5 bg-white/30">
          <Input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submitReply(); if (e.key === "Escape") setReplying(false); }}
            placeholder="Type a reply..."
            autoFocus
            className="h-6 flex-1 text-xs"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-blue-500"
            onClick={submitReply}
            disabled={!replyText.trim()}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
