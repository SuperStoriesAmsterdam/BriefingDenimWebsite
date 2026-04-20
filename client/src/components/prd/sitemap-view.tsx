import type { Page } from "@/types/prd";
import { cn } from "@/lib/utils";
import { PROJECT_NAME } from "@/lib/project.config";
// SitemapView is the primary dashboard — shown by default when no page is selected.

interface SitemapViewProps {
  topLevelPages: Page[];
  childrenOf: (parentId: string) => Page[];
  onNavigate: (pageId: string) => void;
}

export function SitemapView({ topLevelPages, childrenOf, onNavigate }: SitemapViewProps) {
  const navPages = topLevelPages.filter((p) => p.id !== "briefings" && p.nav);
  const footerPages = topLevelPages.filter((p) => p.id !== "briefings" && !p.nav);

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{PROJECT_NAME}</p>
        <h1 className="text-2xl font-bold text-foreground">Site Navigation</h1>
        <p className="text-sm text-muted-foreground mt-1">Click any page to open its brief.</p>
      </div>

      {/* Main nav grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        {navPages.map((p) => {
          const children = childrenOf(p.id);
          return (
            <NavCard
              key={p.id}
              page={p}
              children={children}
              childrenOf={childrenOf}
              onNavigate={onNavigate}
            />
          );
        })}
      </div>

      {/* Footer / hidden pages */}
      {footerPages.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Footer / Hidden Pages
          </p>
          <div className="flex flex-wrap gap-2">
            {footerPages.map((p) => (
              <button
                key={p.id}
                onClick={() => onNavigate(p.id)}
                className="rounded border border-dashed border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NavCard({
  page,
  children,
  childrenOf,
  onNavigate,
}: {
  page: Page;
  children: Page[];
  childrenOf: (id: string) => Page[];
  onNavigate: (id: string) => void;
}) {
  const hasChildren = children.length > 0;

  return (
    <div className="rounded-lg border border-border bg-white shadow-sm flex flex-col overflow-hidden">
      {/* Card header — clicking navigates to this page */}
      <button
        onClick={() => onNavigate(page.id)}
        className="flex items-center gap-2 px-4 py-3 text-left hover:bg-muted/40 transition-colors border-b border-border"
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-foreground/70" />
        <span className="text-[13px] font-semibold text-foreground leading-snug">{page.label}</span>
      </button>

      {/* Children */}
      {hasChildren && (
        <div className="flex flex-col py-1.5 px-2 flex-1">
          {children.map((ch) => {
            const grandchildren = childrenOf(ch.id);
            return (
              <div key={ch.id}>
                <button
                  onClick={() => onNavigate(ch.id)}
                  className="w-full flex items-center gap-1.5 rounded px-2 py-1 text-left text-[12px] text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                  {ch.label}
                </button>
                {grandchildren.length > 0 && (
                  <div className="ml-5 border-l border-border/60 pl-2 mb-0.5">
                    {grandchildren.map((gc) => (
                      <button
                        key={gc.id}
                        onClick={() => onNavigate(gc.id)}
                        className={cn(
                          "w-full flex items-center gap-1.5 rounded px-2 py-0.5 text-left text-[11px] text-muted-foreground/60",
                          "hover:bg-muted/50 hover:text-muted-foreground transition-colors"
                        )}
                      >
                        <span className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/25" />
                        {gc.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
