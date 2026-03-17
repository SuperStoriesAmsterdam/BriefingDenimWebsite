# Page-Level Mood Images — Feature PRD

## For Claude Code Implementation

**Purpose:** Add server-stored mood/reference images per page so the designer gets an instant visual impression of each page's feel. Images are uploadable, downloadable at high resolution, and add zero weight to the PRD JSON payload.

---

## 1. Overview

Each page in the sidebar should support a collection of mood/reference images — JPGs that convey the visual direction for that specific page. These are NOT stored as base64 in the JSON (like the existing block-level images). They are uploaded to the server filesystem and the JSON stores only lightweight URL references.

Three tiers:
- **Thumbnail** (~400px wide, 60% JPEG) — displayed inline in the mood strip for fast rendering
- **Full resolution** (~1800px wide, 85% JPEG) — stored on server, used for lightbox view and download
- **JSON payload** — stores only `{ id, url, thumbUrl, name }` per image — a few bytes each

---

## 2. Data Model Changes

### 2.1 New type in `client/src/types/prd.ts`

```typescript
export interface MoodImage {
  id: string;       // "mood-{timestamp}-{random}"
  url: string;      // Server path to full-res image, e.g. "/uploads/mood-abc123.jpg"
  thumbUrl: string;  // Server path to thumbnail, e.g. "/uploads/thumb-mood-abc123.jpg"
  name: string;      // Original filename
}
```

### 2.2 Extend the `Page` interface in `client/src/types/prd.ts`

```typescript
export interface Page {
  id: string;
  label: string;
  nav: boolean;
  parent: string | null;
  blocks: Block[];
  moodImages?: MoodImage[];  // <-- NEW: page-level mood/reference images
}
```

**Important:** The `moodImages` array is optional so existing data stays compatible with zero migration.

---

## 3. Server Changes

### 3.1 Upload endpoint in `server/routes.ts`

Add a new route: `POST /api/uploads`

```
POST /api/uploads
Content-Type: multipart/form-data
Body: one or more image files (field name: "images")

Response: {
  files: [
    { id: "mood-abc123", url: "/uploads/mood-abc123.jpg", thumbUrl: "/uploads/thumb-mood-abc123.jpg", name: "original-name.jpg" },
    ...
  ]
}
```

Implementation:
1. Use `multer` (already in package.json dependencies) for multipart parsing
2. For each uploaded file:
   a. Generate a unique ID: `"mood-" + Date.now() + "-" + randomString(6)`
   b. Resize to **full resolution**: max 1800px wide, maintain aspect ratio, JPEG 85% quality → save as `/uploads/mood-{id}.jpg`
   c. Resize to **thumbnail**: max 400px wide, maintain aspect ratio, JPEG 60% quality → save as `/uploads/thumb-mood-{id}.jpg`
   d. Use the `sharp` library for server-side image processing (needs to be added as dependency — see section 7)
3. Return the array of `{ id, url, thumbUrl, name }` objects

### 3.2 Delete endpoint in `server/routes.ts`

Add: `DELETE /api/uploads/:id`

```
DELETE /api/uploads/mood-abc123

Response: { ok: true }
```

Implementation:
1. Delete both files: `/uploads/mood-{id}.jpg` and `/uploads/thumb-mood-{id}.jpg`
2. Return success (don't error if files already gone)

### 3.3 Serve uploaded files as static assets

In `server/index.ts` (or `routes.ts`), add static file serving for the uploads directory:

```typescript
import express from "express";
import path from "path";

// Serve uploaded mood images
app.use("/uploads", express.static(path.resolve("uploads")));
```

This must be registered **before** the catch-all route in both dev and production.

### 3.4 Uploads directory

Create the `uploads/` directory at the project root. Add a `.gitkeep` file so the directory is tracked by git but images are not.

Add to `.gitignore`:
```
uploads/*.jpg
```

---

## 4. Client Changes

### 4.1 New component: `client/src/components/prd/page-mood-strip.tsx`

A horizontal strip displayed at the top of the wireframe view for the current page. Behavior:

**Display:**
- Horizontal scrollable row of thumbnail images
- Each thumbnail: ~80px tall, proportional width, rounded corners, subtle border
- Drag-drop to reorder thumbnails
- "+" button at the end to add more images
- Drop zone: drag files onto the strip to upload
- If no images: show a subtle dashed drop zone with text "Drop mood images here or click to add"
- Show image count badge, e.g. "4 mood images"

**Interactions:**
- **Click thumbnail** → Open lightbox showing full-res image (loaded from `url`, not `thumbUrl`)
- **Lightbox** → Shows full-res image + download button + delete button + left/right navigation between images
- **Download button** → Triggers browser download of the full-res image (`url` path). Use an `<a href={url} download={name}>` or similar.
- **Delete** → Calls `DELETE /api/uploads/:id`, removes from page's `moodImages` array, triggers persist
- **Drag-drop reorder** → Reorder within the `moodImages` array, triggers persist
- **Upload** → Accepts files via drop, paste, or file picker. Calls `POST /api/uploads`, gets back URLs, appends to page's `moodImages` array, triggers persist.

**Styling:**
- Compact — should not dominate the page. Think of it as a visual header strip.
- Use existing design language (same border styles, rounded corners, muted colors as the rest of the UI)
- Collapsed by default if many images — horizontal scroll, not wrapping

### 4.2 Upload helper: `client/src/lib/upload-utils.ts` (new file)

```typescript
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
```

### 4.3 Store changes: `client/src/hooks/use-prd-store.ts`

Add one new mutation:

```typescript
const updateMoodImages = useCallback(
  (pageId: string, moodImages: MoodImage[]) => {
    if (!pages) return;
    persist(
      pages.map((p) =>
        p.id === pageId ? { ...p, moodImages } : p
      )
    );
  },
  [pages, persist]
);
```

Export it from the hook return.

### 4.4 Wireframe view: `client/src/components/prd/wireframe-view.tsx`

Add the mood strip above the blocks:

```tsx
import { PageMoodStrip } from "./page-mood-strip";

// Inside the component, before the blocks map:
<PageMoodStrip
  pageId={currentPage.id}
  images={currentPage.moodImages ?? []}
  onUpdate={(images) => store.updateMoodImages(currentPage.id, images)}
/>
```

---

## 5. Production / Build Considerations

### 5.1 Uploads directory persistence

The `uploads/` directory must persist across deployments. On Replit, files in the project directory persist. Ensure the build script (`script/build.ts`) does NOT delete the `uploads/` folder during `rm("dist", ...)` — it currently only deletes `dist/`, so this is safe.

### 5.2 Static serving in production

In `server/static.ts` or `server/index.ts`, the `/uploads` static route must be registered in BOTH dev and production modes. Register it in `server/routes.ts` (inside `registerRoutes`) so it's always active regardless of environment.

### 5.3 Multer configuration

Configure multer with:
- `dest`: A temp directory (e.g., `uploads/tmp/`)
- File size limit: 10MB per file
- File count limit: 20 files per request
- Accept only image MIME types

After multer saves the temp file, the route handler processes it with sharp and deletes the temp file.

---

## 6. What NOT to Change

- **Existing block-level images** (`Block.images` with base64 `data` field) — leave these completely untouched. They serve a different purpose (inline reference images per wireframe block) and work fine for 1-2 small images.
- **`prd-storage.ts`** — No changes needed. The merge logic works on page structure; `moodImages` is just another optional field that gets preserved automatically.
- **`prd-defaults.ts`** — No mood images in defaults. They're uploaded per-project, not part of the template.

---

## 7. Dependencies

### Add: `sharp`

```bash
npm install sharp
```

Sharp is a high-performance Node.js image processing library. It handles:
- JPEG resize and compression
- Maintains EXIF orientation
- Fast — C-based (libvips), much faster than canvas-based alternatives

`multer` is already in `package.json`.

### Alternative if sharp causes issues on Replit

If `sharp` has native binary issues on Replit's environment, fall back to the same canvas-based approach used client-side but running on the server. However, sharp is widely supported on Linux and should work.

---

## 8. Implementation Order

1. `npm install sharp` (add dependency)
2. Create `uploads/` directory + `.gitkeep` + update `.gitignore`
3. Add `MoodImage` type and extend `Page` interface in `types/prd.ts`
4. Add upload/delete endpoints in `server/routes.ts` + static serving for `/uploads`
5. Create `client/src/lib/upload-utils.ts`
6. Add `updateMoodImages` mutation to `use-prd-store.ts`
7. Create `client/src/components/prd/page-mood-strip.tsx`
8. Add mood strip to `wireframe-view.tsx`
9. Test: upload images, verify thumbnails render, lightbox works, download works, delete works, reorder works, page switching preserves images, save/load cycle works

---

## 9. UX Summary

**Designer experience:**
1. PM opens a page (e.g. "Homepage")
2. Drops 5-6 reference JPGs onto the mood strip at the top
3. Images upload to server, thumbnails appear instantly in a horizontal row
4. Designer opens the same page — sees the mood strip with visual direction at a glance
5. Clicks any image → full-res lightbox with download button
6. Downloads hi-res JPGs for use in Figma

**Performance:**
- PRD JSON payload: unaffected (only stores URL strings)
- Page load: thumbnails are ~15-20KB each, loaded from server on demand
- Save/sync: fast — no image data in the JSON
- localStorage: no pressure — URLs are just strings
