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
      className="mb-4"
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      tabIndex={-1}
    >
      {/* Thumbnails row */}
      {images.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart={(e) => handleThumbDragStart(e, idx)}
              onDragOver={(e) => handleThumbDragOver(e, idx)}
              onDrop={(e) => handleThumbDrop(e, idx)}
              onDragEnd={handleThumbDragEnd}
              className={cn(
                "group relative h-20 shrink-0 cursor-grab overflow-hidden rounded-md border",
                reorderIdx === idx && "opacity-40",
                reorderOver === idx && "outline-2 outline-dashed outline-blue-400 -outline-offset-2"
              )}
            >
              <img
                src={img.thumbUrl}
                alt={img.name}
                className="h-full w-auto object-cover cursor-pointer"
                onClick={() => setLightboxIdx(idx)}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(idx);
                }}
                className="absolute -right-0.5 -top-0.5 hidden h-5 w-5 items-center justify-center rounded-full bg-destructive text-[9px] text-white group-hover:flex"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-20 w-16 shrink-0 rounded-md border border-dashed text-muted-foreground/40 hover:text-muted-foreground"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
          {images.length > 0 && (
            <span className="shrink-0 text-[10px] text-muted-foreground/50 pl-1">
              {images.length} mood {images.length === 1 ? "image" : "images"}
            </span>
          )}
        </div>
      )}

      {/* Drop zone when empty or dragging files over */}
      {(images.length === 0 || dragOver) && (
        <div
          className={cn(
            "flex h-16 items-center justify-center rounded-md border border-dashed text-[11px] text-muted-foreground/40",
            dragOver && "border-blue-400 bg-blue-50/50 text-blue-500",
            uploading && "opacity-50"
          )}
        >
          {uploading ? (
            "Uploading..."
          ) : images.length === 0 ? (
            <button
              className="flex items-center gap-1.5 hover:text-muted-foreground"
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Drop mood images here, paste, or click to add
            </button>
          ) : (
            "Drop images here"
          )}
        </div>
      )}

      {error && <p className="mt-1 text-[10px] text-destructive">{error}</p>}

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

      {/* Lightbox with download */}
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
                  {/* Previous */}
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
                  {/* Next */}
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
