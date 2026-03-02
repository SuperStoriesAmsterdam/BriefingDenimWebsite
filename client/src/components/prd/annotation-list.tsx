import type { Annotation, FilterTeam, TeamId } from "@/types/prd";
import { AnnotationItem } from "./annotation-item";
import { Button } from "@/components/ui/button";

interface AnnotationListProps {
  annotations: Annotation[];
  filterTeam: FilterTeam;
  onUpdateAnnotation: (realIndex: number, text: string) => void;
  onDeleteAnnotation: (realIndex: number) => void;
  onAddAnnotation: (team: TeamId) => void;
}

export function AnnotationList({
  annotations,
  filterTeam,
  onUpdateAnnotation,
  onDeleteAnnotation,
  onAddAnnotation,
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
            onUpdate={(text) => onUpdateAnnotation(realIndex, text)}
            onDelete={() => onDeleteAnnotation(realIndex)}
          />
        );
      })}
      <div className="mt-1 flex gap-1">
        {(["design", "dev", "ghl"] as const).map((team) => (
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
