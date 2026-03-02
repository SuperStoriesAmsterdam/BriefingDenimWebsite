import type { Annotation } from "@/types/prd";
import { TEAM_COLORS, TEAM_LABELS } from "@/lib/prd-constants";
import { EditableText } from "./editable-text";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnotationItemProps {
  annotation: Annotation;
  onUpdate: (text: string) => void;
  onDelete: () => void;
}

export function AnnotationItem({ annotation, onUpdate, onDelete }: AnnotationItemProps) {
  const colors = TEAM_COLORS[annotation.team];

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-r px-2.5 py-1.5 border-l-[3px]",
        colors.bg,
        colors.border
      )}
    >
      <span
        className={cn(
          "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase text-white",
          colors.badge
        )}
      >
        {TEAM_LABELS[annotation.team]}
      </span>
      <EditableText
        value={annotation.text}
        onChange={onUpdate}
        className="flex-1 text-xs leading-relaxed text-foreground"
        multi
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 shrink-0 text-muted-foreground/40 hover:text-destructive"
        onClick={onDelete}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
