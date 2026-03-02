import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multi?: boolean;
  placeholder?: string;
}

export function EditableText({
  value,
  onChange,
  className,
  multi = false,
  placeholder = "Click to edit...",
}: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => setDraft(value), [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if ("select" in inputRef.current) {
        inputRef.current.select();
      }
      if (inputRef.current.tagName === "TEXTAREA") {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = inputRef.current.scrollHeight + "px";
      }
    }
  }, [editing]);

  const done = () => {
    setEditing(false);
    if (draft !== value) onChange(draft);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
  };

  if (editing) {
    if (multi) {
      return (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onBlur={done}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDraft(value);
              setEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "min-h-0 resize-none overflow-hidden border-blue-500 bg-blue-50/50 focus-visible:ring-blue-500/30",
            className
          )}
        />
      );
    }

    return (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={done}
        onKeyDown={(e) => {
          if (e.key === "Enter") done();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "h-auto border-blue-500 bg-blue-50/50 px-1 py-0.5 focus-visible:ring-blue-500/30",
          className
        )}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      className={cn(
        "cursor-text border-b border-dashed border-transparent hover:border-muted-foreground/30",
        multi && "block min-h-[20px]",
        className
      )}
      title="Click to edit"
    >
      {value || (
        <span className="italic text-muted-foreground/50">{placeholder}</span>
      )}
    </span>
  );
}
