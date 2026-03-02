import { useState, useRef, useCallback } from "react";
import type { BlockImage } from "@/types/prd";
import { processFiles, canFitInStorage } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockImageGalleryProps {
  images: BlockImage[];
  onUpdate: (images: BlockImage[]) => void;
}

export function BlockImageGallery({ images, onUpdate }: BlockImageGalleryProps) {
  const [dragOver, setDragOver] = useState(false);
  const [reorderIdx, setReorderIdx] = useState<number | null>(null);
  const [reorderOver, setReorderOver] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<BlockImage | null>(null);
  const [warning, setWarning] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addImages = useCallback(
    async (files: FileList | File[]) => {
      const newImages = await processFiles(files);
      if (newImages.length === 0) return;
      // Check storage against actual resized data, not raw file size
      const totalChars = newImages.reduce((s, img) => s + img.data.length + img.name.length + img.id.length, 0);
      if (!canFitInStorage(totalChars)) {
        setWarning("Storage nearly full — remove images first");
        setTimeout(() => setWarning(""), 3000);
        return;
      }
      onUpdate([...images, ...newImages]);
    },
    [images, onUpdate]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      if (e.dataTransfer.types.includes("Files")) {
        addImages(e.dataTransfer.files);
      }
    },
    [addImages]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes("Files")) return;
      e.preventDefault();
      e.stopPropagation();
      setDragOver(true);
    },
    []
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const f = items[i].getAsFile();
          if (f) files.push(f);
        }
      }
      if (files.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        addImages(files);
      }
    },
    [addImages]
  );

  const handleDelete = (idx: number) => {
    onUpdate(images.filter((_, i) => i !== idx));
  };

  // Thumbnail reorder handlers
  const handleThumbDragStart = (e: React.DragEvent, idx: number) => {
    e.stopPropagation();
    e.dataTransfer.setData("image-reorder-idx", String(idx));
    e.dataTransfer.effectAllowed = "move";
    setReorderIdx(idx);
  };

  const handleThumbDragOver = (e: React.DragEvent, idx: number) => {
    if (!e.dataTransfer.types.includes("image-reorder-idx")) return;
    e.preventDefault();
    e.stopPropagation();
    setReorderOver(idx);
  };

  const handleThumbDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const fromStr = e.dataTransfer.getData("image-reorder-idx");
    if (!fromStr) return;
    const fromIdx = parseInt(fromStr, 10);
    if (fromIdx === toIdx) return;
    const reordered = [...images];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    onUpdate(reordered);
    setReorderIdx(null);
    setReorderOver(null);
  };

  const handleThumbDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    setReorderIdx(null);
    setReorderOver(null);
  };

  return (
    <div
      className="mt-2"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      tabIndex={-1}
    >
      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          {images.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart={(e) => handleThumbDragStart(e, idx)}
              onDragOver={(e) => handleThumbDragOver(e, idx)}
              onDrop={(e) => handleThumbDrop(e, idx)}
              onDragEnd={handleThumbDragEnd}
              className={cn(
                "group relative h-16 w-16 shrink-0 cursor-grab overflow-hidden rounded border",
                reorderIdx === idx && "opacity-40",
                reorderOver === idx && "outline-2 outline-dashed outline-blue-400 -outline-offset-2"
              )}
            >
              <img
                src={img.data}
                alt={img.name}
                className="h-full w-full object-cover"
                onClick={() => setLightbox(img)}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(idx);
                }}
                className="absolute -right-0.5 -top-0.5 hidden h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] text-white group-hover:flex"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-16 w-16 shrink-0 rounded border border-dashed text-muted-foreground/40 hover:text-muted-foreground"
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Drop zone (shown when empty or drag-over) */}
      {(images.length === 0 || dragOver) && (
        <div
          className={cn(
            "flex h-14 items-center justify-center rounded border border-dashed text-[11px] text-muted-foreground/40",
            dragOver && "border-blue-400 bg-blue-50/50 text-blue-500"
          )}
        >
          {images.length === 0 ? (
            <button
              className="flex items-center gap-1.5 hover:text-muted-foreground"
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Drop images here, paste, or click to add
            </button>
          ) : (
            "Drop images here"
          )}
        </div>
      )}

      {warning && (
        <p className="mt-1 text-[10px] text-destructive">{warning}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) addImages(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Lightbox dialog */}
      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">{lightbox?.name ?? "Image"}</DialogTitle>
          {lightbox && (
            <img
              src={lightbox.data}
              alt={lightbox.name}
              className="max-h-[80vh] w-full rounded object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
