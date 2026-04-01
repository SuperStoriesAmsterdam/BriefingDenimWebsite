import type { Page, FilterTeam } from "@/types/prd";
import { TEAM_COLORS, TEAM_LABELS } from "@/lib/prd-constants";
import { cn } from "@/lib/utils";
import { CheckSquare, Square, ExternalLink } from "lucide-react";

interface AnnotationTasksProps {
  pages: Page[];
  filterTeam: FilterTeam;
  onToggleDone: (pageId: string, blockIndex: number, annotationIndex: number) => void;
  onNavigate: (pageId: string, blockIndex: number) => void;
}

interface TaskRef {
  pageId: string;
  pageLabel: string;
  blockIndex: number;
  blockTitle: string;
  annotationIndex: number;
  team: string;
  text: string;
  done: boolean;
  author?: string;
}

export function AnnotationTasks({ pages, filterTeam, onToggleDone, onNavigate }: AnnotationTasksProps) {
  // Flatten all annotations into task refs
  const tasks: TaskRef[] = [];
  for (const page of pages) {
    for (let bi = 0; bi < page.blocks.length; bi++) {
      const block = page.blocks[bi];
      for (let ai = 0; ai < block.annotations.length; ai++) {
        const a = block.annotations[ai];
        if (filterTeam !== "all" && a.team !== filterTeam) continue;
        tasks.push({
          pageId: page.id,
          pageLabel: page.label,
          blockIndex: bi,
          blockTitle: block.title,
          annotationIndex: ai,
          team: a.team,
          text: a.text,
          done: !!a.done,
          author: a.author,
        });
      }
    }
  }

  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const remaining = totalCount - doneCount;

  // Group by page, then block
  const grouped = new Map<string, Map<number, TaskRef[]>>();
  for (const t of tasks) {
    if (!grouped.has(t.pageId)) grouped.set(t.pageId, new Map());
    const pageMap = grouped.get(t.pageId)!;
    if (!pageMap.has(t.blockIndex)) pageMap.set(t.blockIndex, []);
    pageMap.get(t.blockIndex)!.push(t);
  }

  // Preserve page order from the pages array
  const orderedPages = pages.filter((p) => grouped.has(p.id));

  return (
    <div className="p-5 max-w-3xl">
      <h2 className="text-lg font-bold text-foreground mb-1">Annotation Tasks</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {remaining === 0 && totalCount > 0
          ? "All done!"
          : `${remaining} remaining of ${totalCount} tasks`}
        {totalCount > 0 && (
          <span className="ml-2 text-xs text-muted-foreground/60">
            ({doneCount}/{totalCount} completed)
          </span>
        )}
      </p>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="mb-6 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(doneCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      {totalCount === 0 && (
        <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 py-12 text-center text-sm text-muted-foreground">
          No annotations{filterTeam !== "all" ? ` for ${TEAM_LABELS[filterTeam]}` : ""}
        </div>
      )}

      <div className="space-y-6">
        {orderedPages.map((page) => {
          const blockMap = grouped.get(page.id)!;
          return (
            <div key={page.id}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">
                {page.label}
              </h3>
              <div className="space-y-3">
                {Array.from(blockMap.entries()).map(([blockIndex, blockTasks]) => (
                  <div key={blockIndex} className="rounded-lg border bg-white overflow-hidden">
                    {/* Block header */}
                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b">
                      <span className="text-[12px] font-semibold text-foreground/80">
                        {blockTasks[0].blockTitle}
                      </span>
                      <button
                        onClick={() => onNavigate(page.id, blockIndex)}
                        className="flex items-center gap-1 text-[10px] text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Go to block
                      </button>
                    </div>
                    {/* Tasks */}
                    <div className="divide-y">
                      {blockTasks.map((task) => {
                        const colors = TEAM_COLORS[task.team as keyof typeof TEAM_COLORS];
                        return (
                          <button
                            key={`${task.pageId}-${task.blockIndex}-${task.annotationIndex}`}
                            onClick={() => onToggleDone(task.pageId, task.blockIndex, task.annotationIndex)}
                            className={cn(
                              "flex w-full items-start gap-2.5 px-3 py-2 text-left transition-colors hover:bg-muted/30",
                              task.done && "opacity-50"
                            )}
                          >
                            {task.done ? (
                              <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            ) : (
                              <Square className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm text-foreground",
                                task.done && "line-through text-muted-foreground"
                              )}>
                                {task.text}
                              </p>
                              <div className="mt-0.5 flex items-center gap-1.5">
                                <span className={cn(
                                  "rounded px-1 py-0.5 text-[9px] font-bold uppercase text-white",
                                  colors.badge
                                )}>
                                  {TEAM_LABELS[task.team as keyof typeof TEAM_LABELS]}
                                </span>
                                {task.author && (
                                  <span className="text-[10px] text-muted-foreground/50">
                                    {task.author}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Count unchecked annotations for given pages and filter */
export function countUnchecked(pages: Page[], filterTeam: FilterTeam, pageId?: string): number {
  const target = pageId ? pages.filter((p) => p.id === pageId) : pages;
  return target.reduce(
    (sum, p) =>
      sum +
      p.blocks.reduce(
        (bSum, b) =>
          bSum +
          b.annotations.filter(
            (a) => !a.done && (filterTeam === "all" || a.team === filterTeam)
          ).length,
        0
      ),
    0
  );
}
