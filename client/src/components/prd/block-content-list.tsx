import { useState } from "react";
import { EditableText } from "./editable-text";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockContentListProps {
  items: string[];
  onUpdate: (index: number, value: string) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function BlockContentList({ items, onUpdate, onDelete, onAdd, onReorder }: BlockContentListProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  return (
    <div className="rounded border border-dashed border-muted-foreground/20 bg-background p-2.5 mb-2.5">
      {items.map((item, i) => (
        <div
          key={i}
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("content-item-index", String(i));
            setDragIdx(i);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOverIdx(i);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (dragIdx !== null && dragIdx !== i) {
              onReorder(dragIdx, i);
            }
            setDragIdx(null);
            setOverIdx(null);
          }}
          onDragEnd={() => {
            setDragIdx(null);
            setOverIdx(null);
          }}
          className={cn(
            "flex items-start gap-1 py-0.5 group",
            i < items.length - 1 && "border-b border-dotted border-border",
            dragIdx === i && "opacity-30",
            overIdx === i && dragIdx !== null && dragIdx !== i && "bg-primary/5"
          )}
        >
          <span
            className="mt-0.5 shrink-0 cursor-grab text-muted-foreground/20 hover:text-muted-foreground/50 active:cursor-grabbing"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </span>
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
