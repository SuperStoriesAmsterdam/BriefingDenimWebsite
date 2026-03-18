import type { Annotation, AnnotationReply, FilterTeam, TeamId } from "@/types/prd";
import { AnnotationItem } from "./annotation-item";
import { Button } from "@/components/ui/button";

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
}: AnnotationListProps) {
  const filtered =
    filterTeam === "all"
      ? annotations
      : annotations.filter((a) => a.team === filterTeam);

  return (
    <div className="flex flex-col gap-1">
      {filtered.map((a, i) => {
        const realIndex = annotations.indexOf(a);
        return (
          <AnnotationItem
            key={realIndex}
            annotation={a}
            currentUser={currentUser}
            allUsers={allUsers}
            onUpdate={(text) => onUpdateAnnotation(realIndex, text)}
            onDelete={() => onDeleteAnnotation(realIndex)}
            onSetTo={(to) => onSetTo(realIndex, to)}
            onAddReply={(reply) => onAddReply(realIndex, reply)}
          />
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
