import { useState } from "react";
import { EditableText } from "./editable-text";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockContentListProps {
  items: string[];
  durations?: string[];
  pageId: string;
  blockIndex: number;
  onUpdate: (index: number, value: string) => void;
  onUpdateDuration?: (index: number, value: string) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onReceiveContent?: (fromPageId: string, fromBlockIndex: number, contentIndex: number, insertIndex: number) => void;
  variant?: "default" | "grid";
}

export function BlockContentList({
  items,
  durations,
  pageId,
  blockIndex,
  onUpdate,
  onUpdateDuration,
  onDelete,
  onAdd,
  onReorder,
  onReceiveContent,
  variant = "default",
}: BlockContentListProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [externalOver, setExternalOver] = useState(false);

  const handleDragStart = (e: React.DragEvent, i: number) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("content-item-index", String(i));
    e.dataTransfer.setData("source-page-id", pageId);
    e.dataTransfer.setData("source-block-index", String(blockIndex));
    setDragIdx(i);
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    setExternalOver(false);

    const sourcePageId = e.dataTransfer.getData("source-page-id");
    const sourceBlockIndex = parseInt(e.dataTransfer.getData("source-block-index"), 10);
    const sourceContentIndex = parseInt(e.dataTransfer.getData("content-item-index"), 10);

    if (!sourcePageId || isNaN(sourceBlockIndex) || isNaN(sourceContentIndex)) return;

    const isSameBlock = sourcePageId === pageId && sourceBlockIndex === blockIndex;

    if (isSameBlock) {
      if (dragIdx !== null && dragIdx !== targetIdx) {
        onReorder(dragIdx, targetIdx);
      }
    } else if (onReceiveContent) {
      onReceiveContent(sourcePageId, sourceBlockIndex, sourceContentIndex, targetIdx);
    }
    setDragIdx(null);
    setOverIdx(null);
  };

  const handleContainerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExternalOver(false);

    const sourcePageId = e.dataTransfer.getData("source-page-id");
    const sourceBlockIndex = parseInt(e.dataTransfer.getData("source-block-index"), 10);
    const sourceContentIndex = parseInt(e.dataTransfer.getData("content-item-index"), 10);

    if (!sourcePageId || isNaN(sourceBlockIndex) || isNaN(sourceContentIndex)) return;

    const isSameBlock = sourcePageId === pageId && sourceBlockIndex === blockIndex;
    if (!isSameBlock && onReceiveContent) {
      onReceiveContent(sourcePageId, sourceBlockIndex, sourceContentIndex, items.length);
    }
  };

  const handleContainerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("source-page-id")) {
      setExternalOver(true);
    }
  };

  if (variant === "grid") {
    return (
      <div
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2.5",
          externalOver && "ring-2 ring-blue-400/40 ring-dashed rounded"
        )}
        onDragOver={handleContainerDragOver}
        onDragLeave={() => setExternalOver(false)}
        onDrop={handleContainerDrop}
      >
        {items.map((item, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOverIdx(i);
            }}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            className={cn(
              "group relative rounded-lg border bg-white p-3 text-center shadow-sm transition-all",
              dragIdx === i && "opacity-30",
              overIdx === i && dragIdx !== null && dragIdx !== i && "ring-2 ring-blue-400/50"
            )}
          >
            <span className="absolute left-1.5 top-1.5 text-[10px] font-semibold text-muted-foreground/30 select-none group-hover:opacity-0 transition-opacity">
              {i + 1}
            </span>
            <span className="absolute left-1 top-1 cursor-grab text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="h-3 w-3" />
            </span>
            <EditableText
              value={item}
              onChange={(v) => onUpdate(i, v)}
              className="text-xs leading-relaxed text-foreground"
              multi
            />
            {onUpdateDuration && (
              <div className="mt-2 flex justify-center">
                <EditableText
                  value={durations?.[i] ?? ""}
                  onChange={(v) => onUpdateDuration(i, v)}
                  className="inline-block rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-muted-foreground min-w-[48px] text-center"
                  placeholder="duration"
                />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0.5 top-0.5 h-5 w-5 shrink-0 text-muted-foreground/30 opacity-0 group-hover:opacity-100 hover:text-destructive"
              onClick={() => onDelete(i)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <button
          onClick={onAdd}
          className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-3 text-[11px] text-muted-foreground hover:border-muted-foreground/40 hover:bg-muted/30 transition-colors"
        >
          + item
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded border border-dashed border-muted-foreground/20 bg-background p-2.5 mb-2.5 transition-colors",
        externalOver && "border-blue-400 bg-blue-50/30"
      )}
      onDragOver={handleContainerDragOver}
      onDragLeave={() => setExternalOver(false)}
      onDrop={handleContainerDrop}
    >
      {items.map((item, i) => (
        <div
          key={i}
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOverIdx(i);
          }}
          onDrop={(e) => handleDrop(e, i)}
          onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
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
