import type { PrdStore } from "@/hooks/use-prd-store";
import { PageMoodStrip } from "./page-mood-strip";

interface MoodViewProps {
  store: PrdStore;
}

export function MoodView({ store }: MoodViewProps) {
  const { currentPage } = store;

  if (!currentPage) return null;

  return (
    <div className="p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground">{currentPage.label}</h2>
        <p className="text-[13px] text-muted-foreground">
          Visual references for this page. Drop images to upload, click to view full-res and download.
        </p>
      </div>
      <PageMoodStrip
        pageId={currentPage.id}
        images={currentPage.moodImages ?? []}
        onUpdate={(images) => store.updateMoodImages(currentPage.id, images)}
      />
    </div>
  );
}
