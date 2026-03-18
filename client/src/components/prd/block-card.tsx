import { useState } from "react";
import type { Block, FilterTeam, TeamId, BlockType, SchemaType, Page, QuestionItem, AnnotationReply } from "@/types/prd";
import { BLOCK_TYPES, SCHEMA_TYPES } from "@/lib/prd-constants";
import { EditableText } from "./editable-text";
import { BlockContentList } from "./block-content-list";
import { QAList } from "./qa-list";
import { AnnotationList } from "./annotation-list";

import { DocLinkBadge } from "./doc-link-badge";
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
import { X, ChevronUp, ChevronDown, MoveRight, Code, Sparkles, ChevronRight, Settings2 } from "lucide-react";
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
  onReceiveContent?: (fromPageId: string, fromBlockIndex: number, contentIndex: number, insertIndex: number) => void;
  currentUser: string | null;
  allUsers: string[];
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
  onReceiveContent,
  currentUser,
  allUsers,
}: BlockCardProps) {
  const otherPages = allPages.filter((p) => p.id !== pageId);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Shared annotation handlers
  const annotationHandlers = {
    annotations: block.annotations,
    filterTeam,
    currentUser,
    allUsers,
    onUpdateAnnotation: (ri: number, text: string) => {
      const annotations = [...block.annotations];
      annotations[ri] = { ...annotations[ri], text };
      onUpdate({ ...block, annotations });
    },
    onDeleteAnnotation: (ri: number) =>
      onUpdate({ ...block, annotations: block.annotations.filter((_: any, j: number) => j !== ri) }),
    onAddAnnotation: (team: TeamId) =>
      onUpdate({
        ...block,
        annotations: [
          ...block.annotations,
          { team, text: "New note...", author: currentUser || undefined, timestamp: new Date().toISOString() },
        ],
      }),
    onSetTo: (ri: number, to: string | undefined) => {
      const annotations = [...block.annotations];
      annotations[ri] = { ...annotations[ri], to };
      onUpdate({ ...block, annotations });
    },
    onAddReply: (ri: number, reply: AnnotationReply) => {
      const annotations = [...block.annotations];
      const existing = annotations[ri];
      annotations[ri] = { ...existing, replies: [...(existing.replies || []), reply] };
      onUpdate({ ...block, annotations });
    },
    onReorder: (from: number, to: number) => {
      const annotations = [...block.annotations];
      const [moved] = annotations.splice(from, 1);
      annotations.splice(to, 0, moved);
      onUpdate({ ...block, annotations });
    },
  };
  const hasDetails = block.llmParagraph || (block.questions && block.questions.length > 0) || block.docUrl || (showAnnotations && block.annotations.length > 0);

  // Shared content list props
  const contentListProps = {
    items: block.content,
    pageId,
    blockIndex: index,
    onUpdate: (i: number, v: string) => {
      const content = [...block.content];
      content[i] = v;
      onUpdate({ ...block, content });
    },
    onDelete: (i: number) => onUpdate({ ...block, content: block.content.filter((_: string, j: number) => j !== i) }),
    onAdd: () => onUpdate({ ...block, content: [...block.content, "New item..."] }),
    onReorder: (from: number, to: number) => {
      const content = [...block.content];
      const [item] = content.splice(from, 1);
      content.splice(to, 0, item);
      onUpdate({ ...block, content });
    },
    onReceiveContent,
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        // Only allow block drag from the toolbar grip, not from content items
        if ((e.target as HTMLElement).closest("[data-content-drag]")) return;
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
        "group/block relative mb-4 cursor-grab overflow-hidden rounded-lg border shadow-sm transition-all",
        isDragging && "opacity-40",
        isOver && "ring-2 ring-dashed ring-amber-400 ring-offset-2"
      )}
    >
      {/* Hover toolbar */}
      <div className="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-md border bg-white/95 px-1 py-0.5 shadow-sm opacity-0 group-hover/block:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-5 w-5" disabled={index === 0} onClick={onMoveUp} title="Move up">
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-5 w-5" disabled={index === totalBlocks - 1} onClick={onMoveDown} title="Move down">
          <ChevronDown className="h-3 w-3" />
        </Button>
        {otherPages.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5" title="Move to page...">
                <MoveRight className="h-3 w-3" />
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
        <div className="mx-0.5 h-3 w-px bg-border" />
        <Select value={block.schemaType ?? "none"} onValueChange={(v) => onUpdate({ ...block, schemaType: v as SchemaType })}>
          <SelectTrigger className="h-5 w-auto gap-0.5 border-0 bg-transparent px-1 text-[10px] text-muted-foreground shadow-none">
            <Code className="h-2.5 w-2.5 shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SCHEMA_TYPES.map((t) => (
              <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={block.type} onValueChange={(v) => onUpdate({ ...block, type: v as BlockType })}>
          <SelectTrigger className="h-5 w-auto gap-0.5 border-0 bg-transparent px-1 text-[10px] text-muted-foreground shadow-none">
            <Settings2 className="h-2.5 w-2.5 shrink-0" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BLOCK_TYPES.map((t) => (
              <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mx-0.5 h-3 w-px bg-border" />
        <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground/50 hover:text-destructive" onClick={() => onUpdate(null)} title="Delete block">
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* ── HERO ── */}
      {block.type === "hero" && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-8 py-10 text-center">
          <div className="mx-auto max-w-xl">
            <EditableText
              value={block.title}
              onChange={(v) => onUpdate({ ...block, title: v })}
              className="text-xl font-bold text-white"
            />
            <div className="mt-2">
              <EditableText
                value={block.desc}
                onChange={(v) => onUpdate({ ...block, desc: v })}
                className="text-sm leading-relaxed text-slate-300"
                multi
              />
            </div>
            {block.content.length > 0 && (
              <div className="mt-5">
                <BlockContentList {...contentListProps} />
              </div>
            )}
            {block.content.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 h-7 border-dashed border-slate-500 bg-transparent px-3 text-[11px] text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                onClick={contentListProps.onAdd}
              >
                + item
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ── GRID ── */}
      {block.type === "grid" && (
        <div className="bg-slate-50 px-5 py-5">
          <EditableText
            value={block.title}
            onChange={(v) => onUpdate({ ...block, title: v })}
            className="text-base font-bold text-foreground"
          />
          <div className="mt-1 mb-4">
            <EditableText
              value={block.desc}
              onChange={(v) => onUpdate({ ...block, desc: v })}
              className="text-[13px] leading-relaxed text-muted-foreground"
              multi
            />
          </div>
          <BlockContentList {...contentListProps} variant="grid" />
        </div>
      )}

      {/* ── SECTION ── */}
      {block.type === "section" && (
        <div className="bg-white px-5 py-5">
          <div className="border-l-2 border-slate-300 pl-4">
            <EditableText
              value={block.title}
              onChange={(v) => onUpdate({ ...block, title: v })}
              className="text-base font-bold text-foreground"
            />
            <div className="mt-1 mb-3">
              <EditableText
                value={block.desc}
                onChange={(v) => onUpdate({ ...block, desc: v })}
                className="text-[13px] leading-relaxed text-muted-foreground"
                multi
              />
            </div>
          </div>
          <div className="mt-3">
            <BlockContentList {...contentListProps} />
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      {block.type === "cta" && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-8 text-center">
          <div className="mx-auto max-w-md">
            <EditableText
              value={block.title}
              onChange={(v) => onUpdate({ ...block, title: v })}
              className="text-lg font-bold text-foreground"
            />
            <div className="mt-1 mb-4">
              <EditableText
                value={block.desc}
                onChange={(v) => onUpdate({ ...block, desc: v })}
                className="text-[13px] leading-relaxed text-muted-foreground"
                multi
              />
            </div>
            <div className="inline-block rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md">
              {block.content[0] || "Call to Action"}
            </div>
            {block.content.length > 1 && (
              <div className="mt-4">
                <BlockContentList {...contentListProps} />
              </div>
            )}
            {block.content.length <= 1 && (
              <div className="mt-4">
                <BlockContentList {...contentListProps} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Details section (LLM, Q&A, images, annotations) ── */}
      {hasDetails && (
        <div className="border-t bg-white">
          <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="flex w-full items-center gap-1.5 px-4 py-2 text-[11px] font-medium text-muted-foreground hover:bg-muted/30 transition-colors"
          >
            <ChevronRight className={cn("h-3 w-3 transition-transform", detailsOpen && "rotate-90")} />
            Details
            {block.questions && block.questions.length > 0 && (
              <span className="ml-1 rounded-full bg-indigo-100 px-1.5 text-[10px] text-indigo-600">
                {block.questions.filter((q) => q.answered).length}/{block.questions.length} Q&A
              </span>
            )}
            {showAnnotations && block.annotations.length > 0 && (
              <span className="ml-1 rounded-full bg-slate-100 px-1.5 text-[10px] text-slate-500">
                {block.annotations.length} notes
              </span>
            )}
          </button>
          {detailsOpen && (
            <div className="space-y-3 px-4 pb-4">
              {/* LLM Extract */}
              <div className="rounded border border-amber-200/60 bg-amber-50/50 px-3 py-2">
                <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700/70">
                  <Sparkles className="h-3 w-3" />
                  LLM Extract
                </div>
                <EditableText
                  value={block.llmParagraph ?? ""}
                  onChange={(v) => onUpdate({ ...block, llmParagraph: v || undefined })}
                  className="text-[12px] leading-relaxed text-amber-900/70"
                  multi
                  placeholder="Write one paragraph that AI models should extract and cite..."
                />
              </div>

              {/* Q&A checklist */}
              {block.questions && block.questions.length > 0 ? (
                <QAList
                  items={block.questions}
                  onUpdate={(questions: QuestionItem[]) => onUpdate({ ...block, questions: questions.length > 0 ? questions : undefined })}
                />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 border-dashed px-2 text-[11px] text-muted-foreground"
                  onClick={() => onUpdate({ ...block, questions: [{ text: "New question...", answered: false, answer: "" }] })}
                >
                  + Q&A checklist
                </Button>
              )}

              {/* Doc link */}
              <DocLinkBadge
                docUrl={block.docUrl}
                onUpdate={(url) => onUpdate({ ...block, docUrl: url })}
              />

              {/* Annotations */}
              {showAnnotations && (
                <AnnotationList {...annotationHandlers} />
              )}
            </div>
          )}
        </div>
      )}

      {/* Details section when nothing is populated yet — show add buttons */}
      {!hasDetails && (
        <div className="flex items-center gap-2 border-t bg-white px-4 py-2">
          <Button
            variant="outline"
            size="sm"
            className="h-6 border-dashed px-2 text-[11px] text-muted-foreground"
            onClick={() => onUpdate({ ...block, questions: [{ text: "New question...", answered: false, answer: "" }] })}
          >
            + Q&A
          </Button>
          <DocLinkBadge
            docUrl={block.docUrl}
            onUpdate={(url) => onUpdate({ ...block, docUrl: url })}
          />
          {showAnnotations && (
            <AnnotationList {...annotationHandlers} />
          )}
        </div>
      )}
    </div>
  );
}
