import type { Page } from "@/types/prd";

interface SitemapViewProps {
  topLevelPages: Page[];
  childrenOf: (parentId: string) => Page[];
}

export function SitemapView({ topLevelPages, childrenOf }: SitemapViewProps) {
  const sitePages = topLevelPages.filter((p) => p.id !== "briefings" && p.id !== "questions");

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold text-foreground mb-5">Sitemap &amp; Navigation</h2>
      {sitePages.map((p) => (
        <div key={p.id} className="mb-2">
          <div className="py-1 text-[13px] font-semibold" style={{ color: p.nav ? undefined : "hsl(var(--muted-foreground))" }}>
            {p.label}{" "}
            {!p.nav && (
              <span className="text-[10px] text-muted-foreground/50">(footer)</span>
            )}
          </div>
          {childrenOf(p.id).map((ch) => (
            <div key={ch.id} className="pl-5 text-xs text-muted-foreground py-0.5">
              └ {ch.label}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
