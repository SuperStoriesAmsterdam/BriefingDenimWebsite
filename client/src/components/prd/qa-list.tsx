import type { QuestionItem } from "@/types/prd";
import { EditableText } from "./editable-text";
import { Button } from "@/components/ui/button";
import { X, CheckCircle2, Circle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface QAListProps {
  items: QuestionItem[];
  onUpdate: (items: QuestionItem[]) => void;
}

export function QAList({ items, onUpdate }: QAListProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const answered = items.filter((q) => q.answered).length;

  return (
    <div className="rounded border border-dashed border-indigo-300/40 bg-indigo-50/30 p-2.5 mb-2.5">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-2 text-[11px] text-muted-foreground">
        <span className="font-medium">
          {answered}/{items.length} answered
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-muted-foreground/10">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: items.length > 0 ? `${(answered / items.length) * 100}%` : "0%" }}
          />
        </div>
      </div>

      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            "border-b border-dotted border-indigo-200/40 py-2 last:border-0",
            item.answered && "opacity-70"
          )}
        >
          {/* Question row */}
          <div className="flex items-start gap-2">
            <button
              onClick={() => {
                const updated = [...items];
                updated[i] = { ...updated[i], answered: !updated[i].answered };
                onUpdate(updated);
              }}
              className="mt-0.5 shrink-0"
              title={item.answered ? "Mark as unanswered" : "Mark as answered"}
            >
              {item.answered ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/30 hover:text-indigo-400" />
              )}
            </button>
            <EditableText
              value={item.text}
              onChange={(v) => {
                const updated = [...items];
                updated[i] = { ...updated[i], text: v };
                onUpdate(updated);
              }}
              className={cn(
                "flex-1 text-xs leading-relaxed",
                item.answered ? "text-muted-foreground line-through" : "text-foreground"
              )}
              multi
            />
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-5 w-5 shrink-0",
                item.answer
                  ? "text-indigo-400"
                  : "text-muted-foreground/30 hover:text-indigo-400"
              )}
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              title={item.answer ? "View/edit answer" : "Add answer"}
            >
              <MessageSquare className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 shrink-0 text-muted-foreground/30 hover:text-destructive"
              onClick={() => onUpdate(items.filter((_, j) => j !== i))}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Answer area */}
          {expandedIdx === i && (
            <div className="ml-6 mt-1.5 rounded border border-indigo-200/50 bg-white p-2">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-400/70">
                Answer
              </div>
              <EditableText
                value={item.answer}
                onChange={(v) => {
                  const updated = [...items];
                  updated[i] = { ...updated[i], answer: v };
                  onUpdate(updated);
                }}
                className="text-xs leading-relaxed text-foreground"
                multi
                placeholder="Type the answer here..."
              />
            </div>
          )}

          {/* Show answer preview when collapsed but has answer */}
          {expandedIdx !== i && item.answer && (
            <div
              className="ml-6 mt-1 text-[11px] text-indigo-600/60 cursor-pointer hover:text-indigo-600"
              onClick={() => setExpandedIdx(i)}
            >
              {item.answer.length > 80 ? item.answer.slice(0, 80) + "..." : item.answer}
            </div>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        className="mt-1 h-6 border-dashed px-2 text-[11px] text-muted-foreground"
        onClick={() =>
          onUpdate([...items, { text: "New question...", answered: false, answer: "" }])
        }
      >
        + question
      </Button>
    </div>
  );
}
