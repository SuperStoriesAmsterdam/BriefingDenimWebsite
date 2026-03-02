import type { FilterTeam } from "@/types/prd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { PrdStore } from "@/hooks/use-prd-store";

interface PrdToolbarProps {
  store: PrdStore;
}

const FILTERS: { id: FilterTeam; label: string; activeClass: string }[] = [
  { id: "all", label: "All", activeClass: "bg-primary text-primary-foreground" },
  { id: "design", label: "Designer", activeClass: "bg-violet-500 text-white" },
  { id: "dev", label: "Developer", activeClass: "bg-blue-500 text-white" },
  { id: "ghl", label: "GHL", activeClass: "bg-orange-600 text-white" },
  { id: "copy", label: "Copy", activeClass: "bg-emerald-500 text-white" },
];

export function PrdToolbar({ store }: PrdToolbarProps) {
  const { currentPage, pages, filterTeam, setFilterTeam, showAnnotations, setShowAnnotations } =
    store;

  if (!currentPage) return null;

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b bg-background px-5 py-2.5">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-foreground">{currentPage.label}</h2>
        {!currentPage.nav && (
          <Badge variant="secondary" className="text-[10px]">
            footer only
          </Badge>
        )}
        {currentPage.parent && (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-[10px] text-blue-600"
          >
            child of {pages?.find((p) => p.id === currentPage.parent)?.label}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {FILTERS.map((f) => (
          <Button
            key={f.id}
            variant={filterTeam === f.id ? "default" : "secondary"}
            size="sm"
            className={cn(
              "h-7 px-2.5 text-[11px] font-semibold",
              filterTeam === f.id && f.activeClass
            )}
            onClick={() => setFilterTeam(f.id)}
          >
            {f.label}
          </Button>
        ))}
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Button
          variant={showAnnotations ? "default" : "secondary"}
          size="sm"
          className="h-7 px-2.5 text-[11px] font-semibold"
          onClick={() => setShowAnnotations(!showAnnotations)}
        >
          {showAnnotations ? "Annotations on" : "Annotations off"}
        </Button>
      </div>
    </div>
  );
}
