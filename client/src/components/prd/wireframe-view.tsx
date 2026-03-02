import type { Page, FilterTeam } from "@/types/prd";
import { BlockCard } from "./block-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { PrdStore } from "@/hooks/use-prd-store";

interface WireframeViewProps {
  store: PrdStore;
}

export function WireframeView({ store }: WireframeViewProps) {
  const { currentPage, pages, filterTeam, showAnnotations } = store;

  if (!currentPage || !pages) return null;

  return (
    <div className="p-5">
      {currentPage.blocks.map((block, i) => (
        <BlockCard
          key={i}
          block={block}
          index={i}
          totalBlocks={currentPage.blocks.length}
          pageId={currentPage.id}
          allPages={pages}
          showAnnotations={showAnnotations}
          filterTeam={filterTeam}
          onUpdate={(nb) => store.updateBlock(currentPage.id, i, nb)}
          onMoveUp={() => store.moveBlockUp(currentPage.id, i)}
          onMoveDown={() => store.moveBlockDown(currentPage.id, i)}
          onMoveToPage={(targetId) => store.moveBlockToPage(currentPage.id, i, targetId)}
          onDragStart={store.setDragBlock}
          onDragOver={store.setOverBlock}
          onDrop={store.dropBlock}
          onDragEnd={() => {
            store.setDragBlock(null);
            store.setOverBlock(null);
          }}
          isDragging={store.dragBlock === i}
          isOver={store.overBlock === i}
        />
      ))}
      <Button
        variant="outline"
        className="w-full border-2 border-dashed py-6 text-[13px] font-semibold text-muted-foreground"
        onClick={() => store.addBlock(currentPage.id)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add section
      </Button>
    </div>
  );
}
