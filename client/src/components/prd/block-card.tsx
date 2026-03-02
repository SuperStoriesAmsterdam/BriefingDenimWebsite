import type { Block, FilterTeam, TeamId, BlockType, Page } from "@/types/prd";
import { BLOCK_TYPE_STYLES, BLOCK_TYPES } from "@/lib/prd-constants";
import { EditableText } from "./editable-text";
import { BlockContentList } from "./block-content-list";
import { AnnotationList } from "./annotation-list";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { X, ChevronUp, ChevronDown, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockCardProps {
  block: Block;
  index: number;
  totalBlocks: number;
  pageId: string;
  allPages: Page[];
  showAnnotations: boolean;
  filterTeam: FilterTeam;
  onUpdate: (block: Block | null) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveToPage: (targetPageId: string) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isOver: boolean;
}

export function BlockCard({
  block,
  index,
  totalBlocks,
  pageId,
  allPages,
  showAnnotations,
  filterTeam,
  onUpdate,
  onMoveUp,
  onMoveDown,
  onMoveToPage,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isOver,
}: BlockCardProps) {
  const style = BLOCK_TYPE_STYLES[block.type] || BLOCK_TYPE_STYLES.section;
  const otherPages = allPages.filter((p) => p.id !== pageId);

  return (
    <Card
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("block-index", String(index));
        e.dataTransfer.setData("block-page-id", pageId);
        onDragStart(index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(index);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(index);
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "mb-3 cursor-grab border-t-4 p-4",
        style.border,
        style.bg,
        isDragging && "opacity-40",
        isOver && "outline-2 outline-dashed outline-[hsl(41,47%,56%)] -outline-offset-2"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
          {style.label}
        </Badge>
        <div className="flex items-center gap-1">
          {/* Move up/down */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            disabled={index === 0}
            onClick={onMoveUp}
            title="Move up"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            disabled={index === totalBlocks - 1}
            onClick={onMoveDown}
            title="Move down"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>

          {/* Move to page */}
          {otherPages.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6" title="Move to page...">
                  <MoveRight className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
                {otherPages.map((p) => (
                  <DropdownMenuItem key={p.id} onClick={() => onMoveToPage(p.id)}>
                    {p.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Type switcher */}
          <Select
            value={block.type}
            onValueChange={(v) => onUpdate({ ...block, type: v as BlockType })}
          >
            <SelectTrigger className="h-6 w-auto gap-1 border-muted-foreground/20 bg-background px-2 text-[10px] text-muted-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BLOCK_TYPES.map((t) => (
                <SelectItem key={t} value={t} className="text-xs">
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground/40 hover:text-destructive"
            onClick={() => onUpdate(null)}
            title="Delete block"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Title */}
      <div className="mt-1">
        <EditableText
          value={block.title}
          onChange={(v) => onUpdate({ ...block, title: v })}
          className="text-base font-bold text-foreground"
        />
      </div>

      {/* Description */}
      <div className="mb-2.5">
        <EditableText
          value={block.desc}
          onChange={(v) => onUpdate({ ...block, desc: v })}
          className="text-[13px] leading-relaxed text-muted-foreground"
          multi
        />
      </div>

      {/* Content items */}
      <BlockContentList
        items={block.content}
        onUpdate={(i, v) => {
          const content = [...block.content];
          content[i] = v;
          onUpdate({ ...block, content });
        }}
        onDelete={(i) => onUpdate({ ...block, content: block.content.filter((_, j) => j !== i) })}
        onAdd={() => onUpdate({ ...block, content: [...block.content, "New item..."] })}
        onReorder={(from, to) => {
          const content = [...block.content];
          const [item] = content.splice(from, 1);
          content.splice(to, 0, item);
          onUpdate({ ...block, content });
        }}
      />

      {/* Annotations */}
      {showAnnotations && (
        <AnnotationList
          annotations={block.annotations}
          filterTeam={filterTeam}
          onUpdateAnnotation={(ri, text) => {
            const annotations = [...block.annotations];
            annotations[ri] = { ...annotations[ri], text };
            onUpdate({ ...block, annotations });
          }}
          onDeleteAnnotation={(ri) =>
            onUpdate({ ...block, annotations: block.annotations.filter((_, j) => j !== ri) })
          }
          onAddAnnotation={(team: TeamId) =>
            onUpdate({
              ...block,
              annotations: [...block.annotations, { team, text: "New instruction..." }],
            })
          }
        />
      )}
    </Card>
  );
}
