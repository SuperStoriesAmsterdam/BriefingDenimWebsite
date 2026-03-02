import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { getStorageUsage } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

interface StorageIndicatorProps {
  saveStatus: string;
}

export function StorageIndicator({ saveStatus }: StorageIndicatorProps) {
  const [usage, setUsage] = useState({ used: 0, total: 1, percent: 0 });

  useEffect(() => {
    setUsage(getStorageUsage());
  }, [saveStatus]);

  const usedMB = (usage.used / (1024 * 1024)).toFixed(1);
  const totalMB = (usage.total / (1024 * 1024)).toFixed(1);

  return (
    <div className="px-3 py-2">
      <div className="mb-1 flex items-center justify-between text-[9px] text-sidebar-foreground/40">
        <span>Storage</span>
        <span>
          {usedMB} / {totalMB} MB ({usage.percent}%)
        </span>
      </div>
      <Progress
        value={usage.percent}
        className={cn(
          "h-1.5",
          usage.percent < 60
            ? "[&>div]:bg-green-500"
            : usage.percent < 80
              ? "[&>div]:bg-yellow-500"
              : "[&>div]:bg-red-500"
        )}
      />
    </div>
  );
}
