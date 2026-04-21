import type { Page } from "@/types/prd";
import { cn } from "@/lib/utils";
import { PROJECT_NAME } from "@/lib/project.config";

interface SitemapViewProps {
  topLevelPages: Page[];
  childrenOf: (parentId: string) => Page[];
  onNavigate: (pageId: string) => void;
}

// Pages that are Phase 2 — shown in nav bar but visually flagged
const PHASE2_IDS = ["denim-guide"];

export function SitemapView({ topLevelPages, childrenOf, onNavigate }: SitemapViewProps) {
  const navPages = topLevelPages.filter((p) => p.id !== "briefings" && p.nav);
  const footerPages = topLevelPages.filter((p) => p.id !== "briefings" && !p.nav);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{PROJECT_NAME}</p>
        <h1 className="text-xl font-bold text-foreground">Site Architecture</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Click any page to open its brief.</p>
      </div>

      {/* ── VISUAL NAV BAR ── */}
      <div className="mx-8 mb-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Main Navigation</p>
        <div className="flex items-center gap-1 bg-foreground rounded-t-lg px-4 py-0 h-11 overflow-x-auto">
          {/* Logo stub */}
          <span className="text-[11px] font-bold tracking-widest text-background/60 mr-4 shrink-0 uppercase">
            {PROJECT_NAME}
          </span>
          <div className="flex items-center gap-1 flex-1">
            {navPages.map((p) => (
              <button
                key={p.id}
                onClick={() => onNavigate(p.id)}
                className={cn(
                  "px-3 h-11 text-[12px] font-medium shrink-0 transition-colors relative",
                  PHASE2_IDS.includes(p.id)
                    ? "text-background/30 italic"
                    : "text-background/80 hover:text-background hover:bg-white/10"
                )}
              >
                {p.label}
                {PHASE2_IDS.includes(p.id) && (
                  <span className="ml-1 text-[9px] font-bold uppercase tracking-wide text-background/25">p2</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── ARCHITECTURE DIAGRAM ── */}
      <div className="mx-8 border border-border border-t-0 rounded-b-lg bg-background overflow-x-auto">
        <div className="flex min-w-max">
          {navPages.map((p, i) => {
            const children = childrenOf(p.id);
            const isPhase2 = PHASE2_IDS.includes(p.id);
            return (
              <div
                key={p.id}
                className={cn(
                  "flex flex-col items-center min-w-[140px]",
                  i < navPages.length - 1 && "border-r border-border/50"
                )}
              >
                {/* Connector dot */}
                <div className="flex flex-col items-center pt-3 pb-1">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    isPhase2 ? "bg-muted-foreground/20" : "bg-foreground/60"
                  )} />
                  {children.length > 0 && (
                    <div className="w-px h-4 bg-border mt-1" />
                  )}
                </div>

                {/* Children */}
                {children.length > 0 ? (
                  <div className="flex gap-3 px-3 pb-4 items-start justify-center">
                    {children.map((ch) => {
                      const grandchildren = childrenOf(ch.id);
                      return (
                        <div key={ch.id} className="flex flex-col items-center">
                          {/* Child box */}
                          <button
                            onClick={() => onNavigate(ch.id)}
                            className={cn(
                              "rounded border px-3 py-1.5 text-[11px] font-semibold transition-colors whitespace-nowrap",
                              isPhase2
                                ? "border-dashed border-border text-muted-foreground/40 cursor-default"
                                : "border-border bg-muted/40 text-foreground hover:bg-muted hover:border-muted-foreground/30"
                            )}
                          >
                            {ch.label}
                          </button>

                          {/* Grandchildren */}
                          {grandchildren.length > 0 && (
                            <>
                              <div className="w-px h-3 bg-border" />
                              <div className="flex flex-col items-center gap-1">
                                {grandchildren.map((gc) => (
                                  <button
                                    key={gc.id}
                                    onClick={() => onNavigate(gc.id)}
                                    className="rounded border border-dashed border-border/60 px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:border-border transition-colors whitespace-nowrap"
                                  >
                                    {gc.label}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="pb-4 px-3">
                    <span className={cn(
                      "text-[10px]",
                      isPhase2 ? "text-muted-foreground/30 italic" : "text-muted-foreground/40"
                    )}>
                      {isPhase2 ? "Phase 2" : "no sub-pages"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FOOTER ZONE ── */}
      {footerPages.length > 0 && (
        <div className="mx-8 mt-8 mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Footer</p>
          <div className="rounded-lg border border-dashed border-border bg-background px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {footerPages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onNavigate(p.id)}
                  className="rounded border border-dashed border-border px-3 py-1.5 text-[11px] text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
