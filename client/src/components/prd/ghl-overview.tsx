import { GHL_PIPES, GHL_INT, UNIVERSAL_AUTOMATIONS } from "@/lib/prd-defaults";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function GhlOverview() {
  return (
    <div className="p-5">
      <h2 className="text-xl font-bold text-foreground mb-1">GHL Integration Overview</h2>
      <p className="text-[13px] text-muted-foreground mb-5">
        All integration points for the GHL team.
      </p>

      {/* System Integrations */}
      <h3 className="text-base font-bold text-orange-600 mb-2.5">System Integrations</h3>
      <div className="flex flex-col gap-1.5 mb-6">
        {GHL_INT.map((x, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded border border-orange-600/10 bg-orange-600/5 px-3 py-2"
          >
            <span className="min-w-[100px] text-[13px] font-bold text-foreground">{x.s}</span>
            <span className="text-[13px] font-semibold text-orange-600">{x.d}</span>
            <span className="text-xs text-muted-foreground">{x.p}</span>
          </div>
        ))}
      </div>

      {/* Pipelines */}
      <h3 className="text-base font-bold text-orange-600 mb-2.5">
        Pipelines ({GHL_PIPES.length})
      </h3>
      <div className="flex flex-col gap-2">
        {GHL_PIPES.map((p, i) => (
          <Card key={i} className="border-orange-600/15 px-3.5 py-2.5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-foreground">{p.n}</span>
              <Badge variant="secondary" className="text-[11px]">
                {p.t}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{p.a}</p>
          </Card>
        ))}
      </div>

      {/* Universal automations */}
      <Card className="mt-6 border-amber-300 bg-amber-50/50 px-3.5 py-3">
        <h4 className="text-[13px] font-bold text-foreground mb-1.5">Universal automations</h4>
        <div className="text-xs leading-7 text-muted-foreground">
          {UNIVERSAL_AUTOMATIONS.map((t, i) => (
            <div key={i}>{t}</div>
          ))}
        </div>
      </Card>
    </div>
  );
}
