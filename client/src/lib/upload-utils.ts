import type { MoodImage } from "@/types/prd";

export async function uploadMoodImages(files: FileList | File[]): Promise<MoodImage[]> {
  const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
  if (imageFiles.length === 0) return [];

  const formData = new FormData();
  imageFiles.forEach((f) => formData.append("images", f));

  const res = await fetch("/api/uploads", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return data.files as MoodImage[];
}

export async function deleteMoodImage(id: string): Promise<void> {
  await fetch(`/api/uploads/${encodeURIComponent(id)}`, { method: "DELETE" });
}
