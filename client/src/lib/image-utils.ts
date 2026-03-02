import type { BlockImage } from "@/types/prd";

export function generateImageId(): string {
  return "img-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

export function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        let w = img.width;
        let h = img.height;
        if (w > MAX) {
          h = Math.round(h * (MAX / w));
          w = MAX;
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function processFiles(files: FileList | File[]): Promise<BlockImage[]> {
  const images: BlockImage[] = [];
  const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
  for (const file of arr) {
    const data = await resizeImage(file);
    images.push({ id: generateImageId(), data, name: file.name });
  }
  return images;
}

export function getStorageUsage(): { used: number; total: number; percent: number } {
  let used = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      used += key.length + (localStorage.getItem(key)?.length ?? 0);
    }
  }
  // Characters in JS are 2 bytes, localStorage is ~5MB
  const usedBytes = used * 2;
  const total = 5 * 1024 * 1024;
  return { used: usedBytes, total, percent: Math.round((usedBytes / total) * 100) };
}

export function canFitInStorage(newCharLength: number): boolean {
  const { used, total } = getStorageUsage();
  // newCharLength is in characters (each char = 2 bytes in localStorage)
  return (used + newCharLength * 2) / total < 0.95;
}
