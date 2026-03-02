import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { FileText, ExternalLink, Pencil, X } from "lucide-react";

interface DocLinkBadgeProps {
  docUrl?: string;
  onUpdate: (url: string | undefined) => void;
}

export function DocLinkBadge({ docUrl, onUpdate }: DocLinkBadgeProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const handleOpen = () => {
    setDraft(docUrl ?? "");
    setOpen(true);
  };

  const handleSave = () => {
    const trimmed = draft.trim();
    onUpdate(trimmed || undefined);
    setOpen(false);
  };

  if (!docUrl) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 gap-1 px-2 text-[11px] text-muted-foreground/60 hover:text-muted-foreground"
            onClick={handleOpen}
          >
            <FileText className="h-3 w-3" />
            + Doc link
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" align="start">
          <div className="space-y-2">
            <Input
              placeholder="https://docs.google.com/..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="h-8 text-xs"
              autoFocus
            />
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" className="h-7 text-xs" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  const displayUrl = (() => {
    try {
      const u = new URL(docUrl);
      const path = u.pathname.length > 20 ? u.pathname.slice(0, 20) + "..." : u.pathname;
      return u.hostname + path;
    } catch {
      return docUrl.length > 30 ? docUrl.slice(0, 30) + "..." : docUrl;
    }
  })();

  return (
    <div className="flex items-center gap-1">
      <Badge
        variant="secondary"
        className="cursor-pointer gap-1 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-700 hover:bg-emerald-500/20"
        onClick={() => window.open(docUrl, "_blank", "noopener")}
      >
        <FileText className="h-3 w-3" />
        {displayUrl}
        <ExternalLink className="h-2.5 w-2.5" />
      </Badge>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground/40 hover:text-muted-foreground"
            onClick={handleOpen}
          >
            <Pencil className="h-2.5 w-2.5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" align="start">
          <div className="space-y-2">
            <Input
              placeholder="https://docs.google.com/..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="h-8 text-xs"
              autoFocus
            />
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" className="h-7 text-xs" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-muted-foreground/40 hover:text-destructive"
        onClick={() => onUpdate(undefined)}
      >
        <X className="h-2.5 w-2.5" />
      </Button>
    </div>
  );
}
