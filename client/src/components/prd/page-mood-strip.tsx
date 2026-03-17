import { useState, useRef, useCallback } from "react";
import type { MoodImage } from "@/types/prd";
import { uploadMoodImages, deleteMoodImage } from "@/lib/upload-utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ImagePlus, X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageMoodStripProps {
  pageId: string;
  images: MoodImage[];
  onUpdate: (images: MoodImage[]) => void;
}

export function PageMoodStrip({ pageId, images, onUpdate }: PageMoodStripProps) {
  const [dragOver, setDragOver] = useState(false);
  const [reorderIdx, setReorderIdx] = useState<number | null>(null);
  const [reorderOver, setReorderOver] = useState<number | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addImages = useCallback(
    async (files: FileList | File[]) => {
      setUploading(true);
      setError("");
      try {
        const newImages = await uploadMoodImages(files);
        if (newImages.length > 0) {
          onUpdate([...images, ...newImages]);
        }
      } catch {
        setError("Upload failed — try again");
        setTimeout(() => setError(""), 3000);
      } finally {
        setUploading(false);
      }
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes("Files")) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

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

  const handleDelete = async (idx: number) => {
    const img = images[idx];
    await deleteMoodImage(img.id);
    onUpdate(images.filter((_, i) => i !== idx));
    if (lightboxIdx !== null) {
      if (images.length <= 1) {
        setLightboxIdx(null);
      } else if (idx <= lightboxIdx) {
        setLightboxIdx(Math.max(0, lightboxIdx - 1));
      }
    }
  };

  // Thumbnail reorder
  const handleThumbDragStart = (e: React.DragEvent, idx: number) => {
    e.stopPropagation();
    e.dataTransfer.setData("mood-reorder-idx", String(idx));
    e.dataTransfer.effectAllowed = "move";
    setReorderIdx(idx);
  };

  const handleThumbDragOver = (e: React.DragEvent, idx: number) => {
    if (!e.dataTransfer.types.includes("mood-reorder-idx")) return;
    e.preventDefault();
    e.stopPropagation();
    setReorderOver(idx);
  };

  const handleThumbDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    const fromStr = e.dataTransfer.getData("mood-reorder-idx");
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

  const lightboxImage = lightboxIdx !== null ? images[lightboxIdx] : null;

  return (
    <div
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      tabIndex={-1}
    >
      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart={(e) => handleThumbDragStart(e, idx)}
              onDragOver={(e) => handleThumbDragOver(e, idx)}
              onDrop={(e) => handleThumbDrop(e, idx)}
              onDragEnd={handleThumbDragEnd}
              className={cn(
                "group relative aspect-[4/3] cursor-grab overflow-hidden rounded-lg border bg-muted/30",
                reorderIdx === idx && "opacity-40",
                reorderOver === idx && "outline-2 outline-dashed outline-blue-400 -outline-offset-2"
              )}
            >
              <img
                src={img.thumbUrl}
                alt={img.name}
                className="h-full w-full object-cover cursor-pointer transition-transform group-hover:scale-[1.02]"
                onClick={() => setLightboxIdx(idx)}
              />
              {/* Filename overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-6 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-[11px] text-white truncate block">{img.name}</span>
              </div>
              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(idx);
                }}
                className="absolute right-1.5 top-1.5 hidden h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm group-hover:flex hover:bg-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Add more button as grid cell */}
          <button
            className="flex aspect-[4/3] items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground/30 transition-colors hover:border-muted-foreground/40 hover:text-muted-foreground/50"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <div className="flex flex-col items-center gap-1">
              <ImagePlus className="h-6 w-6" />
              <span className="text-[11px]">{uploading ? "Uploading..." : "Add images"}</span>
            </div>
          </button>
        </div>
      )}

      {/* Empty state drop zone */}
      {images.length === 0 && (
        <div
          className={cn(
            "flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground/40 transition-colors",
            dragOver && "border-blue-400 bg-blue-50/50 text-blue-500",
            uploading && "opacity-50"
          )}
        >
          {uploading ? (
            <span className="text-sm">Uploading...</span>
          ) : (
            <button
              className="flex flex-col items-center gap-2 hover:text-muted-foreground"
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm">Drop mood images here, paste, or click to add</span>
            </button>
          )}
        </div>
      )}

      {/* Drag-over overlay when images exist */}
      {images.length > 0 && dragOver && (
        <div className="mt-3 flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-blue-400 bg-blue-50/50 text-sm text-blue-500">
          Drop to add images
        </div>
      )}

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

      {images.length > 0 && (
        <p className="mt-3 text-[11px] text-muted-foreground/50">
          {images.length} {images.length === 1 ? "image" : "images"} · Click to view full-res · Drag to reorder
        </p>
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

      {/* Lightbox */}
      <Dialog open={lightboxIdx !== null} onOpenChange={() => setLightboxIdx(null)}>
        <DialogContent className="max-w-4xl p-3">
          <DialogTitle className="sr-only">{lightboxImage?.name ?? "Mood image"}</DialogTitle>
          {lightboxImage && (
            <div className="relative">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.name}
                className="max-h-[80vh] w-full rounded object-contain"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={lightboxIdx === 0}
                    onClick={() => setLightboxIdx((i) => (i !== null ? i - 1 : null))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {(lightboxIdx ?? 0) + 1} / {images.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={lightboxIdx === images.length - 1}
                    onClick={() => setLightboxIdx((i) => (i !== null ? i + 1 : null))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {lightboxImage.name}
                  </span>
                  <a
                    href={lightboxImage.url}
                    download={lightboxImage.name}
                    className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleDelete(lightboxIdx!)}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
