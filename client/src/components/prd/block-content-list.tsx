import { EditableText } from "./editable-text";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BlockContentListProps {
  items: string[];
  onUpdate: (index: number, value: string) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
}

export function BlockContentList({ items, onUpdate, onDelete, onAdd }: BlockContentListProps) {
  return (
    <div className="rounded border border-dashed border-muted-foreground/20 bg-background p-2.5 mb-2.5">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-1.5 py-0.5"
          style={{
            borderBottom: i < items.length - 1 ? "1px dotted hsl(var(--border))" : "none",
          }}
        >
          <EditableText
            value={item}
            onChange={(v) => onUpdate(i, v)}
            className="flex-1 text-xs leading-relaxed text-muted-foreground"
            multi
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0 text-muted-foreground/30 hover:text-destructive"
            onClick={() => onDelete(i)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="mt-1 h-6 border-dashed px-2 text-[11px] text-muted-foreground"
        onClick={onAdd}
      >
        + item
      </Button>
    </div>
  );
}
