import type { FilterTeam } from "@/types/prd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { PrdStore } from "@/hooks/use-prd-store";
import { User, Save } from "lucide-react";

interface PrdToolbarProps {
  store: PrdStore;
  currentUser: string | null;
  allUsers: string[];
  onSelectUser: (name: string) => void;
}

const FILTERS: { id: FilterTeam; label: string; activeClass: string }[] = [
  { id: "all", label: "All", activeClass: "bg-primary text-primary-foreground" },
  { id: "design", label: "Designer", activeClass: "bg-violet-500 text-white" },
  { id: "dev", label: "Developer", activeClass: "bg-blue-500 text-white" },
  { id: "ghl", label: "GHL", activeClass: "bg-orange-600 text-white" },
  { id: "copy", label: "Copy", activeClass: "bg-emerald-500 text-white" },
];

export function PrdToolbar({ store, currentUser, allUsers, onSelectUser }: PrdToolbarProps) {
  const { currentPage, pages, filterTeam, setFilterTeam, showAnnotations, setShowAnnotations, saveStatus, saveNow } =
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
        {/* User picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted transition-colors">
              <User className="h-3 w-3" />
              {currentUser || "I am..."}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {allUsers.map((name) => (
              <DropdownMenuItem
                key={name}
                onClick={() => onSelectUser(name)}
                className={cn("text-xs", currentUser === name && "font-bold")}
              >
                {name}
                {currentUser === name && " ✓"}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-1 h-5" />
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
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-7 gap-1.5 px-2.5 text-[11px] font-semibold",
            saveStatus === "Saved" && "border-green-500 text-green-600",
            saveStatus === "Save failed" && "border-red-500 text-red-600",
          )}
          onClick={saveNow}
        >
          <Save className="h-3 w-3" />
          {saveStatus || "Save"}
        </Button>
      </div>
    </div>
  );
}
