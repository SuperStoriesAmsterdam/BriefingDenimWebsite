import type { Page, PageQuestion, AnnotationReply } from "@/types/prd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ShoppingListProps {
  pages: Page[];
  currentUser: string | null;
  onNavigate: (pageId: string) => void;
  onReplyToPageQuestion: (pageId: string, questionId: string, reply: AnnotationReply) => void;
}

interface QuestionRef {
  question: PageQuestion;
  pageId: string;
  pageLabel: string;
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

export function ShoppingList({ pages, currentUser, onNavigate, onReplyToPageQuestion }: ShoppingListProps) {
  const [tab, setTab] = useState<"all" | "for-me" | "my-questions" | "person">("all");
  const [filterPerson, setFilterPerson] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="p-5">
        <h2 className="text-lg font-bold text-foreground mb-2">My List</h2>
        <p className="text-sm text-muted-foreground">Select your name in the toolbar first.</p>
      </div>
    );
  }

  // Collect all page-level questions
  const allRefs: QuestionRef[] = [];
  for (const page of pages) {
    for (const q of (page.questions || [])) {
      allRefs.push({ question: q, pageId: page.id, pageLabel: page.label });
    }
  }

  // Collect unique names from questions for the filter
  const allNames = Array.from(new Set(
    allRefs.flatMap((r) => [r.question.author, r.question.to].filter(Boolean) as string[])
  ));

  const forMe = allRefs.filter((r) => r.question.to === currentUser);
  const myQuestions = allRefs.filter((r) => r.question.author === currentUser);
  const forPerson = filterPerson ? allRefs.filter((r) => r.question.to === filterPerson || r.question.author === filterPerson) : [];
  const allQuestions = allRefs;

  const items = tab === "for-me" ? forMe
    : tab === "my-questions" ? myQuestions
    : tab === "person" ? forPerson
    : allQuestions;

  const label = tab === "for-me" ? "Questions assigned to you"
    : tab === "my-questions" ? "Questions you asked"
    : tab === "person" ? `Questions for/from ${filterPerson}`
    : "All questions across all pages";

  return (
    <div className="p-5">
      <h2 className="text-lg font-bold text-foreground mb-1">Questions</h2>
      <p className="text-sm text-muted-foreground mb-4">{label}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => { setTab("all"); setFilterPerson(null); }}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            tab === "all" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          All ({allQuestions.length})
        </button>
        {currentUser && (
          <>
            <button
              onClick={() => { setTab("for-me"); setFilterPerson(null); }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                tab === "for-me" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              For me ({forMe.length})
            </button>
            <button
              onClick={() => { setTab("my-questions"); setFilterPerson(null); }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                tab === "my-questions" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              My questions ({myQuestions.length})
            </button>
          </>
        )}
        {allNames.filter((n) => n !== currentUser).map((name) => (
          <button
            key={name}
            onClick={() => { setTab("person"); setFilterPerson(name); }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              tab === "person" && filterPerson === name ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {name}
          </button>
        ))}
      </div>

      {items.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 py-12 text-center text-sm text-muted-foreground">
          No questions yet
        </div>
      )}

      <div className="space-y-3">
        {items.map((ref) => (
          <QuestionCard
            key={ref.question.id}
            ref_={ref}
            currentUser={currentUser}
            onNavigate={onNavigate}
            onReply={(reply) => onReplyToPageQuestion(ref.pageId, ref.question.id, reply)}
          />
        ))}
      </div>
    </div>
  );
}

function QuestionCard({
  ref_,
  currentUser,
  onNavigate,
  onReply,
}: {
  ref_: QuestionRef;
  currentUser: string;
  onNavigate: (pageId: string) => void;
  onReply: (reply: AnnotationReply) => void;
}) {
  const [replyText, setReplyText] = useState("");
  const { question } = ref_;

  const submitReply = () => {
    if (!replyText.trim()) return;
    onReply({
      author: currentUser,
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
    });
    setReplyText("");
  };

  return (
    <div className="rounded-lg border overflow-hidden bg-white">
      {/* Location */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border-b">
        <button
          onClick={() => onNavigate(ref_.pageId)}
          className="text-[11px] font-medium text-blue-600 hover:underline"
        >
          {ref_.pageLabel}
        </button>
      </div>

      {/* Question */}
      <div className="px-3 py-2">
        <p className="text-sm text-foreground">{question.text}</p>
        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground/60">
          <span className="font-medium">{question.author}</span>
          <span>{timeAgo(question.timestamp)}</span>
          {question.to && (
            <span className="rounded bg-blue-100 px-1 py-0.5 text-[9px] font-medium text-blue-700">
              → {question.to}
            </span>
          )}
        </div>
      </div>

      {/* Replies */}
      {question.replies.length > 0 && (
        <div className="border-t">
          {question.replies.map((r, i) => (
            <div key={i} className="px-3 py-2 pl-6 bg-slate-50/50 border-b last:border-0">
              <p className="text-xs text-foreground">{r.text}</p>
              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground/60">
                <span className="font-medium">{r.author}</span>
                <span>{timeAgo(r.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply */}
      <div className="flex items-center gap-1.5 border-t px-3 py-1.5 bg-slate-50/30">
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
