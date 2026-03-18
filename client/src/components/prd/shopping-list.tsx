import type { Page, Annotation, AnnotationReply } from "@/types/prd";
import { TEAM_COLORS, TEAM_LABELS } from "@/lib/prd-constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ShoppingListProps {
  pages: Page[];
  currentUser: string | null;
  onNavigate: (pageId: string) => void;
  onAddReply: (pageId: string, blockIndex: number, annotationIndex: number, reply: AnnotationReply) => void;
}

interface AnnotationRef {
  annotation: Annotation;
  pageId: string;
  pageLabel: string;
  blockIndex: number;
  blockTitle: string;
  annotationIndex: number;
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

export function ShoppingList({ pages, currentUser, onNavigate, onAddReply }: ShoppingListProps) {
  const [tab, setTab] = useState<"for-me" | "my-questions">("for-me");

  if (!currentUser) return null;

  // Collect all annotations with their location
  const allRefs: AnnotationRef[] = [];
  for (const page of pages) {
    for (let bi = 0; bi < page.blocks.length; bi++) {
      const block = page.blocks[bi];
      for (let ai = 0; ai < block.annotations.length; ai++) {
        allRefs.push({
          annotation: block.annotations[ai],
          pageId: page.id,
          pageLabel: page.label,
          blockIndex: bi,
          blockTitle: block.title,
          annotationIndex: ai,
        });
      }
    }
  }

  const forMe = allRefs.filter((r) => r.annotation.to === currentUser);
  const myQuestions = allRefs.filter((r) => r.annotation.author === currentUser && r.annotation.to);

  const items = tab === "for-me" ? forMe : myQuestions;

  return (
    <div className="p-5">
      <h2 className="text-lg font-bold text-foreground mb-1">
        {currentUser}'s List
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {tab === "for-me" ? "Questions and notes assigned to you" : "Questions you asked others"}
      </p>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => setTab("for-me")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            tab === "for-me" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          For me ({forMe.length})
        </button>
        <button
          onClick={() => setTab("my-questions")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            tab === "my-questions" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          My questions ({myQuestions.length})
        </button>
      </div>

      {items.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 py-12 text-center text-sm text-muted-foreground">
          {tab === "for-me" ? "Nothing assigned to you yet" : "You haven't asked any questions yet"}
        </div>
      )}

      <div className="space-y-3">
        {items.map((ref, i) => (
          <ShoppingListItem
            key={`${ref.pageId}-${ref.blockIndex}-${ref.annotationIndex}-${i}`}
            ref_={ref}
            currentUser={currentUser}
            onNavigate={onNavigate}
            onAddReply={(reply) =>
              onAddReply(ref.pageId, ref.blockIndex, ref.annotationIndex, reply)
            }
          />
        ))}
      </div>
    </div>
  );
}

function ShoppingListItem({
  ref_,
  currentUser,
  onNavigate,
  onAddReply,
}: {
  ref_: AnnotationRef;
  currentUser: string;
  onNavigate: (pageId: string) => void;
  onAddReply: (reply: AnnotationReply) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const { annotation } = ref_;
  const colors = TEAM_COLORS[annotation.team];
  const hasReplies = annotation.replies && annotation.replies.length > 0;

  const submitReply = () => {
    if (!replyText.trim()) return;
    onAddReply({
      author: currentUser,
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
    });
    setReplyText("");
  };

  return (
    <div className={cn("rounded-lg border overflow-hidden", colors.bg)}>
      {/* Location breadcrumb */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 border-b">
        <button
          onClick={() => onNavigate(ref_.pageId)}
          className="text-[11px] font-medium text-blue-600 hover:underline"
        >
          {ref_.pageLabel}
        </button>
        <span className="text-[11px] text-muted-foreground/40">›</span>
        <span className="text-[11px] text-muted-foreground">{ref_.blockTitle}</span>
        <span className={cn("ml-auto rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white", colors.badge)}>
          {TEAM_LABELS[annotation.team]}
        </span>
      </div>

      {/* Annotation text */}
      <div className="px-3 py-2">
        <p className="text-sm leading-relaxed text-foreground">{annotation.text}</p>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground/60">
          {annotation.author && <span>{annotation.author}</span>}
          {annotation.timestamp && <span>{timeAgo(annotation.timestamp)}</span>}
          {annotation.to && (
            <span className="rounded bg-blue-100 px-1 py-0.5 text-[9px] font-medium text-blue-700">
              → {annotation.to}
            </span>
          )}
        </div>
      </div>

      {/* Replies */}
      {hasReplies && (
        <div className="border-t">
          {annotation.replies!.map((r, ri) => (
            <div key={ri} className="px-3 py-1.5 pl-6 bg-white/50 border-b border-dashed last:border-0">
              <p className="text-xs leading-relaxed text-foreground">{r.text}</p>
              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground/60">
                <span className="font-medium">{r.author}</span>
                <span>{timeAgo(r.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply input */}
      <div className="flex items-center gap-1.5 border-t px-3 py-1.5 bg-white/30">
        <Input
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submitReply(); }}
          placeholder="Reply..."
          className="h-7 flex-1 text-xs"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-blue-500"
          onClick={submitReply}
          disabled={!replyText.trim()}
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
