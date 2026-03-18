import { useState } from "react";
import type { Annotation, AnnotationReply, FilterTeam, TeamId } from "@/types/prd";
import { AnnotationItem } from "./annotation-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnnotationListProps {
  annotations: Annotation[];
  filterTeam: FilterTeam;
  currentUser: string | null;
  allUsers: string[];
  onUpdateAnnotation: (realIndex: number, text: string) => void;
  onDeleteAnnotation: (realIndex: number) => void;
  onAddAnnotation: (team: TeamId) => void;
  onSetTo: (realIndex: number, to: string | undefined) => void;
  onAddReply: (realIndex: number, reply: AnnotationReply) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

export function AnnotationList({
  annotations,
  filterTeam,
  currentUser,
  allUsers,
  onUpdateAnnotation,
  onDeleteAnnotation,
  onAddAnnotation,
  onSetTo,
  onAddReply,
  onReorder,
}: AnnotationListProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const filtered =
    filterTeam === "all"
      ? annotations
      : annotations.filter((a) => a.team === filterTeam);

  return (
    <div className="flex flex-col gap-1">
      {filtered.map((a, i) => {
        const realIndex = annotations.indexOf(a);
        return (
          <div
            key={realIndex}
            draggable={!!onReorder}
            onDragStart={(e) => {
              e.stopPropagation();
              e.dataTransfer.effectAllowed = "move";
              e.dataTransfer.setData("annotation-index", String(realIndex));
              setDragIdx(realIndex);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOverIdx(realIndex);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onReorder && dragIdx !== null && dragIdx !== realIndex) {
                onReorder(dragIdx, realIndex);
              }
              setDragIdx(null);
              setOverIdx(null);
            }}
            onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
            className={cn(
              dragIdx === realIndex && "opacity-30",
              overIdx === realIndex && dragIdx !== null && dragIdx !== realIndex && "ring-2 ring-blue-400/50 rounded-r"
            )}
          >
            <AnnotationItem
              annotation={a}
              currentUser={currentUser}
              allUsers={allUsers}
              onUpdate={(text) => onUpdateAnnotation(realIndex, text)}
              onDelete={() => onDeleteAnnotation(realIndex)}
              onSetTo={(to) => onSetTo(realIndex, to)}
              onAddReply={(reply) => onAddReply(realIndex, reply)}
            />
          </div>
        );
      })}
      <div className="mt-1 flex gap-1">
        {(["design", "dev", "ghl", "copy"] as const).map((team) => (
          <Button
            key={team}
            variant="outline"
            size="sm"
            className="h-6 border-dashed px-2 text-[10px] text-muted-foreground"
            onClick={() => onAddAnnotation(team)}
          >
            + {team.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}
