import { useState } from "react";
import type { PageQuestion, AnnotationReply } from "@/types/prd";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion, Send, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageQuestionsProps {
  questions: PageQuestion[];
  currentUser: string | null;
  allUsers: string[];
  onAdd: (question: PageQuestion) => void;
  onReply: (questionId: string, reply: AnnotationReply) => void;
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function PageQuestions({ questions, currentUser, allUsers, onAdd, onReply }: PageQuestionsProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [assignTo, setAssignTo] = useState<string | undefined>();
  const [open, setOpen] = useState(true);

  const submit = () => {
    if (!newQuestion.trim() || !currentUser) return;
    onAdd({
      id: "q-" + Date.now(),
      text: newQuestion.trim(),
      author: currentUser,
      to: assignTo,
      timestamp: new Date().toISOString(),
      replies: [],
    });
    setNewQuestion("");
    setAssignTo(undefined);
  };

  return (
    <div className="mt-6 rounded-lg border-2 border-blue-200/60 bg-blue-50/30">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <MessageCircleQuestion className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-semibold text-foreground">Questions</span>
        {questions.length > 0 && (
          <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">
            {questions.length}
          </span>
        )}
        {open ? <ChevronUp className="ml-auto h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="ml-auto h-3.5 w-3.5 text-muted-foreground" />}
      </button>

      {open && (
        <div className="border-t border-blue-200/60 px-4 py-3 space-y-3">
          {/* Existing questions */}
          {questions.map((q) => (
            <QuestionThread
              key={q.id}
              question={q}
              currentUser={currentUser}
              onReply={(reply) => onReply(q.id, reply)}
            />
          ))}

          {/* New question input */}
          {currentUser ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && newQuestion.trim()) submit(); }}
                  placeholder="Ask a question about this page..."
                  className="flex-1 text-sm"
                />
                <Button onClick={submit} disabled={!newQuestion.trim()} size="sm">
                  <Send className="h-3.5 w-3.5 mr-1" />
                  Ask
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-[10px] text-muted-foreground">For:</span>
                {allUsers.filter((u) => u !== currentUser).map((u) => (
                  <button
                    key={u}
                    onClick={() => setAssignTo(assignTo === u ? undefined : u)}
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] transition-colors",
                      assignTo === u
                        ? "bg-blue-500 text-white"
                        : "bg-white text-muted-foreground hover:bg-blue-100"
                    )}
                  >
                    {u}
                  </button>
                ))}
                {!assignTo && <span className="text-[10px] text-muted-foreground/50">everyone</span>}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Select your name in the toolbar to ask questions.</p>
          )}
        </div>
      )}
    </div>
  );
}

function QuestionThread({
  question,
  currentUser,
  onReply,
}: {
  question: PageQuestion;
  currentUser: string | null;
  onReply: (reply: AnnotationReply) => void;
}) {
  const [replyText, setReplyText] = useState("");

  const submitReply = () => {
    if (!replyText.trim() || !currentUser) return;
    onReply({
      author: currentUser,
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
    });
    setReplyText("");
  };

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      {/* Question */}
      <div className="px-3 py-2">
        <p className="text-sm text-foreground">{question.text}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground/60">
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
            <div key={i} className="border-b last:border-0 bg-slate-50/50 px-3 py-2 pl-6">
              <p className="text-xs text-foreground">{r.text}</p>
              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground/60">
                <span className="font-medium">{r.author}</span>
                <span>{timeAgo(r.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply input */}
      <div className="flex items-center gap-1.5 border-t px-3 py-1.5 bg-slate-50/30">
        <Input
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submitReply(); }}
          placeholder="Reply..."
          className="h-7 flex-1 text-xs bg-white"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-blue-500"
          onClick={submitReply}
          disabled={!replyText.trim()}
        >
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
