# Project DAM — Digital Asset Manager PRD

## For Claude Code Implementation (Standalone App)

**Purpose:** A lightweight digital asset manager for managing reference images, mood boards, and deliverables across multiple client projects. Replaces Google Docs as the image storage/browsing layer.
**Stack:** React + Express + PostgreSQL + sharp + Tailwind CSS + shadcn/ui
**Date:** 2026-03-17

---

## 1. What This Is

A standalone web app where a small team (PM, designer, developer, copywriter) can:

1. Upload images in bulk — drag-drop 30 JPGs, they're resized and stored
2. Organize into collections — "WW Homepage Mood", "Denim City Textures", "Client X Brand Assets"
3. Tag and search — find "hero warm minimal" across all collections
4. Browse visually — grid of thumbnails, instant visual impression, no waiting
5. Download hi-res — click any image, get the full-quality file

This is NOT a full enterprise DAM. No user permissions, no approval workflows, no AI tagging. Just fast, visual, organized image storage across clients.

---

## 2. Data Model

### 2.1 Database Tables (PostgreSQL + Drizzle ORM)

**collections**
```
id          varchar(64)   PK, default gen_random_uuid()
name        text          NOT NULL — "WW Homepage Mood", "Denim City Textures"
slug        text          UNIQUE NOT NULL — URL-safe version of name
description text          — optional description
parentId    varchar(64)   FK → collections.id, nullable — for nested folders
color       varchar(7)    — optional hex color for visual coding, e.g. "#4f46e5"
sortOrder   integer       DEFAULT 0 — manual ordering
createdAt   timestamp     DEFAULT now()
updatedAt   timestamp     DEFAULT now()
```

**assets**
```
id          varchar(64)   PK, default gen_random_uuid()
filename    text          NOT NULL — original upload filename
fullPath    text          NOT NULL — server path to full-res image, e.g. "/store/abc123.jpg"
thumbPath   text          NOT NULL — server path to thumbnail, e.g. "/store/thumb-abc123.jpg"
width       integer       — full-res width in pixels
height      integer       — full-res height in pixels
fileSize    integer       — full-res file size in bytes
mimeType    text          — "image/jpeg", "image/png"
createdAt   timestamp     DEFAULT now()
```

**asset_tags**
```
id          varchar(64)   PK, default gen_random_uuid()
assetId     varchar(64)   FK → assets.id, ON DELETE CASCADE
tag         text          NOT NULL — lowercase, trimmed
```
Composite unique index on (assetId, tag).

**asset_collections**
```
id          varchar(64)   PK, default gen_random_uuid()
assetId     varchar(64)   FK → assets.id, ON DELETE CASCADE
collectionId varchar(64)  FK → collections.id, ON DELETE CASCADE
sortOrder   integer       DEFAULT 0 — manual ordering within collection
addedAt     timestamp     DEFAULT now()
```
Composite unique index on (assetId, collectionId).

### 2.2 Relationships

- An asset can belong to **multiple collections** (many-to-many via asset_collections)
- An asset can have **multiple tags** (one-to-many via asset_tags)
- A collection can have **child collections** (self-referencing parentId)
- Deleting a collection does NOT delete its assets — just the join records
- Deleting an asset deletes its files from disk, its tags, and its collection memberships

---

## 3. File Storage

### 3.1 Directory Structure

```
/store/
  abc123.jpg            # full-res image
  thumb-abc123.jpg      # thumbnail
  def456.jpg
  thumb-def456.jpg
  ...
```

Flat directory. No subdirectories per collection — assets are organized logically via DB, not filesystem. This keeps file serving simple and avoids path issues.

### 3.2 Image Processing (sharp)

On upload, each image is processed into two versions:

| Version | Max Width | JPEG Quality | Purpose |
|---------|-----------|-------------|---------|
| Full | 1800px | 85% | Download, lightbox |
| Thumbnail | 400px | 60% | Grid browsing |

Processing rules:
- Auto-rotate based on EXIF orientation
- Maintain aspect ratio (only constrain width, height follows)
- Don't enlarge small images (`withoutEnlargement: true`)
- Output as JPEG regardless of input format
- Strip EXIF metadata from thumbnail (not full — designer may want it)
- Record width, height, fileSize of the full-res output in the DB

### 3.3 Static Serving

```typescript
app.use("/store", express.static(path.resolve("store")));
```

Registered before any catch-all routes. Thumbnails and full-res images are served directly as static files.

---

## 4. API Endpoints

### 4.1 Assets

**POST /api/assets**
Upload one or more images. Multipart form data.
```
Request:  multipart/form-data, field "images" (multiple files)
          optional field "collectionId" — auto-assign to collection
          optional field "tags" — comma-separated tags to apply to all uploads

Response: {
  assets: [
    {
      id: "abc123",
      filename: "hero-reference.jpg",
      fullPath: "/store/abc123.jpg",
      thumbPath: "/store/thumb-abc123.jpg",
      width: 1800,
      height: 1200,
      fileSize: 245000,
      mimeType: "image/jpeg",
      tags: ["hero", "warm"],
      collections: ["col-xyz"],
      createdAt: "2026-03-17T..."
    },
    ...
  ]
}
```

**GET /api/assets**
List/search assets with filtering and pagination.
```
Query params:
  q           — search by filename (ILIKE %q%)
  tag         — filter by tag (exact match, can repeat for AND: tag=hero&tag=warm)
  collectionId — filter by collection
  sort        — "newest" (default), "oldest", "name", "size"
  limit       — default 50, max 200
  offset      — default 0

Response: {
  assets: [ ...asset objects with tags and collections populated... ],
  total: 142
}
```

**GET /api/assets/:id**
Single asset with full details.
```
Response: {
  id, filename, fullPath, thumbPath, width, height, fileSize, mimeType,
  tags: ["hero", "warm", "minimal"],
  collections: [{ id: "col-xyz", name: "WW Homepage Mood" }, ...],
  createdAt
}
```

**PATCH /api/assets/:id**
Update asset metadata.
```
Request:  { filename?: string, tags?: string[] }
Response: { ok: true, asset: { ...updated asset... } }
```

When `tags` is provided, it replaces all existing tags for this asset (delete all existing, insert new). Tags should be lowercased and trimmed before storing.

**DELETE /api/assets/:id**
Delete asset, its files, tags, and collection memberships.
```
Response: { ok: true }
```

**POST /api/assets/bulk-tag**
Add tags to multiple assets at once.
```
Request:  { assetIds: string[], tags: string[] }
Response: { ok: true }
```

**POST /api/assets/bulk-delete**
Delete multiple assets at once.
```
Request:  { assetIds: string[] }
Response: { ok: true }
```

### 4.2 Collections

**POST /api/collections**
Create a collection.
```
Request:  { name: string, description?: string, parentId?: string, color?: string }
Response: { collection: { id, name, slug, description, parentId, color, sortOrder, createdAt } }
```
Auto-generate slug from name (lowercase, hyphens, unique).

**GET /api/collections**
List all collections as a tree.
```
Response: {
  collections: [
    {
      id, name, slug, description, parentId, color, sortOrder,
      assetCount: 24,
      children: [ ...nested collections... ]
    },
    ...
  ]
}
```

**PATCH /api/collections/:id**
Update collection.
```
Request:  { name?: string, description?: string, parentId?: string, color?: string, sortOrder?: number }
Response: { ok: true, collection: { ...updated... } }
```

**DELETE /api/collections/:id**
Delete collection and its join records. Does NOT delete assets. Child collections become top-level (parentId set to null).
```
Response: { ok: true }
```

### 4.3 Collection ↔ Asset Assignment

**POST /api/collections/:collectionId/assets**
Add assets to a collection.
```
Request:  { assetIds: string[] }
Response: { ok: true }
```

**DELETE /api/collections/:collectionId/assets**
Remove assets from a collection.
```
Request:  { assetIds: string[] }
Response: { ok: true }
```

### 4.4 Tags

**GET /api/tags**
List all unique tags with usage counts.
```
Response: {
  tags: [
    { tag: "hero", count: 12 },
    { tag: "warm", count: 8 },
    ...
  ]
}
```

---

## 5. Client Architecture

### 5.1 Routing (Wouter)

```
/                       → Redirect to /library
/library                → All assets (default view)
/library?q=...&tag=...  → Filtered view
/collection/:slug       → Assets in a specific collection
```

Single-page app. No separate pages for individual assets — use lightbox overlay.

### 5.2 Layout

```
┌─────────────────────────────────────────────────────────┐
│  DAM Logo/Name                          [Upload] [Search]│
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│  SIDEBAR     │  MAIN CONTENT                            │
│              │                                          │
│  All Assets  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  ───────     │  │     │ │     │ │     │ │     │      │
│  Collections │  │ img │ │ img │ │ img │ │ img │      │
│  ┣ WW Site   │  │     │ │     │ │     │ │     │      │
│  ┃ ┣ Homepage│  └─────┘ └─────┘ └─────┘ └─────┘      │
│  ┃ ┣ Coaches │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  ┃ ┗ About   │  │     │ │     │ │     │ │     │      │
│  ┣ Denim City│  │ img │ │ img │ │ img │ │ img │      │
│  ┗ Client X  │  │     │ │     │ │     │ │     │      │
│              │  └─────┘ └─────┘ └─────┘ └─────┘      │
│  ───────     │                                          │
│  Tags        │  Showing 24 assets · 3 selected          │
│  hero (12)   │                                          │
│  warm (8)    │                                          │
│  texture (5) │                                          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

### 5.3 Sidebar Component

**Sections:**

1. **All Assets** — link to `/library`, shows total count
2. **Collections** — tree view matching DB hierarchy
   - Click collection → filters main grid to that collection
   - Right-click or kebab menu → rename, change color, delete
   - "+" button to create new collection
   - Drag collections to reorder or nest
   - Each collection shows asset count badge
3. **Tags** — list of all tags with counts
   - Click tag → filters main grid by that tag
   - Multiple tags can be active (AND filter)
   - Active tags shown as pills with "x" to remove

### 5.4 Main Grid Component

**Thumbnail Grid:**
- Responsive CSS grid: 5-6 columns on desktop, 3 on tablet, 2 on mobile
- Each cell: square thumbnail (object-cover), rounded corners, subtle border
- Hover: slight scale-up, shows filename overlay at bottom + checkbox at top-left
- Thumbnail loads from `thumbPath` (400px JPEG — fast)

**Selection:**
- Click thumbnail → open lightbox (if nothing selected)
- Checkbox click → toggle selection (multi-select mode)
- Shift+click → range select
- When assets are selected, show **selection toolbar** at bottom:
  - "[N] selected · [Add to Collection ▾] · [Tag ▾] · [Download] · [Delete]"

**Empty state:**
- Drop zone: "Drop images here or click to upload"

**Loading:**
- Skeleton grid while fetching

### 5.5 Lightbox Overlay

Triggered by clicking a thumbnail (when not in selection mode).

```
┌──────────────────────────────────────────────────────────┐
│  [←] [→]                              [Download] [✕]    │
│                                                          │
│                                                          │
│                    Full-res image                         │
│                    (loaded from fullPath)                 │
│                                                          │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  hero-reference.jpg · 1800×1200 · 245 KB · Mar 17 2026  │
│  Tags: [hero] [warm] [minimal] [+ add tag]               │
│  Collections: [WW Homepage Mood] [+ add to collection]   │
└──────────────────────────────────────────────────────────┘
```

Features:
- Left/right arrow keys (and buttons) to navigate between assets
- Full-res image loaded from `fullPath`
- Download button triggers browser download
- Inline tag editing — click "+" to add, click "x" on tag to remove
- Inline collection assignment — click "+" to add to collection via dropdown
- Delete button with confirmation
- Click outside or press Escape to close

### 5.6 Upload Flow

**Trigger:** "Upload" button in header, or drag-drop onto the grid area.

**Step 1: File Selection**
- Drag-drop files onto main grid area, or click Upload button for file picker
- Accept: image/* (JPG, PNG, WebP, TIFF, etc.)
- Show upload progress: thumbnail preview of each file + progress bar

**Step 2: During Upload**
- Files sent to `POST /api/assets` as multipart
- Server processes with sharp, returns asset objects
- Each completed asset appears in the grid immediately (optimistic)
- If a collection is currently active in sidebar, auto-assign to that collection

**Step 3: Post-Upload Tagging (Optional)**
- After upload completes, newly uploaded assets are auto-selected
- Selection toolbar appears: user can immediately bulk-tag or assign to collection
- Or just dismiss and organize later

### 5.7 Search

**Search bar** in header. Debounced (300ms).

- Searches by filename (ILIKE)
- Combined with active tag and collection filters
- Results update the main grid in real-time
- Clear button to reset search

### 5.8 Collection Management

**Create collection:**
- "+" button in sidebar
- Inline text input for name
- Optional: pick a color from a preset palette (8-10 colors)
- Optional: nest under existing collection

**Rename:**
- Double-click collection name in sidebar → inline edit

**Delete:**
- Kebab menu → Delete → confirmation dialog
- "This will remove the collection but keep all assets"

**Drag to assign:**
- Drag asset thumbnails from grid onto a collection in the sidebar
- Visual feedback: collection highlights on drag-over
- Assigns the asset(s) to that collection

---

## 6. Components Inventory

### Layout
| Component | Purpose |
|-----------|---------|
| `app-layout.tsx` | Sidebar + main content shell with resizable panels |
| `app-header.tsx` | Top bar with logo, search input, upload button |

### Sidebar
| Component | Purpose |
|-----------|---------|
| `sidebar.tsx` | Full sidebar: all-assets link, collection tree, tag list |
| `collection-tree.tsx` | Recursive tree of collections with drag-drop, CRUD |
| `collection-item.tsx` | Single collection row: name, color dot, count, kebab menu |
| `tag-list.tsx` | List of tags with counts, click to filter |

### Main Content
| Component | Purpose |
|-----------|---------|
| `asset-grid.tsx` | Responsive thumbnail grid with selection, drag, empty state |
| `asset-thumb.tsx` | Single thumbnail: image, hover overlay, checkbox, drag handle |
| `selection-toolbar.tsx` | Floating bottom bar when assets selected: tag, collect, download, delete |
| `upload-zone.tsx` | Drag-drop overlay + progress indicators |

### Overlays
| Component | Purpose |
|-----------|---------|
| `lightbox.tsx` | Full-screen image viewer with nav, metadata, inline tag/collection editing |
| `tag-input.tsx` | Autocomplete tag input (reused in lightbox and selection toolbar) |
| `collection-picker.tsx` | Dropdown to pick/assign collections (reused in lightbox and toolbar) |

### Shared/UI
- Use shadcn/ui components: Button, Dialog, DropdownMenu, Input, Badge, Skeleton, ScrollArea, Separator, Tooltip
- Use Lucide icons

---

## 7. State Management

Use React Query for server state (asset lists, collections, tags) and local React state for UI (selection, lightbox, sidebar expand/collapse).

### React Query Keys
```
["assets", { q, tag, collectionId, sort, limit, offset }]  — asset list
["assets", assetId]                                          — single asset
["collections"]                                              — collection tree
["tags"]                                                     — tag list
```

### Local State (via useState or a small Zustand store)
```
selectedAssetIds: Set<string>    — currently selected assets
lightboxAssetId: string | null   — asset shown in lightbox
sidebarCollectionId: string | null — active collection filter
activeTags: string[]             — active tag filters
searchQuery: string              — current search text
```

### Mutations (via React Query useMutation)
- Upload assets → invalidate ["assets"], ["tags"]
- Delete asset(s) → invalidate ["assets"], ["collections"], ["tags"]
- Update asset tags → invalidate ["assets", assetId], ["tags"]
- Add to collection → invalidate ["assets"], ["collections"]
- Remove from collection → invalidate ["assets"], ["collections"]
- Create/update/delete collection → invalidate ["collections"]

---

## 8. Project Setup

### 8.1 Dependencies

```json
{
  "dependencies": {
    "express": "^5",
    "drizzle-orm": "^0.39",
    "pg": "^8",
    "sharp": "^0.33",
    "multer": "^1.4",
    "nanoid": "^5",
    "zod": "^3",
    "react": "^18",
    "react-dom": "^18",
    "@tanstack/react-query": "^5",
    "wouter": "^3",
    "tailwindcss": "^3.4",
    "lucide-react": "^0.400"
  },
  "devDependencies": {
    "typescript": "^5.6",
    "vite": "^7",
    "@vitejs/plugin-react": "^4",
    "@types/multer": "^1",
    "@types/express": "^5",
    "@types/pg": "^8",
    "drizzle-kit": "^0.30",
    "tsx": "^4",
    "esbuild": "^0.24"
  }
}
```

### 8.2 Directory Structure

```
dam/
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── pages/
│   │   │   └── library.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── app-layout.tsx
│   │   │   │   ├── app-header.tsx
│   │   │   │   └── sidebar.tsx
│   │   │   ├── assets/
│   │   │   │   ├── asset-grid.tsx
│   │   │   │   ├── asset-thumb.tsx
│   │   │   │   ├── lightbox.tsx
│   │   │   │   ├── upload-zone.tsx
│   │   │   │   └── selection-toolbar.tsx
│   │   │   ├── collections/
│   │   │   │   ├── collection-tree.tsx
│   │   │   │   ├── collection-item.tsx
│   │   │   │   └── collection-picker.tsx
│   │   │   ├── tags/
│   │   │   │   ├── tag-list.tsx
│   │   │   │   └── tag-input.tsx
│   │   │   └── ui/          ← shadcn components
│   │   ├── hooks/
│   │   │   └── use-dam-store.ts
│   │   └── lib/
│   │       ├── api.ts        ← fetch wrappers for all endpoints
│   │       └── queryClient.ts
│   └── index.html
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── db.ts
│   ├── vite.ts
│   └── static.ts
├── shared/
│   └── schema.ts             ← Drizzle schema (all 4 tables)
├── store/                    ← image files (gitignored)
│   └── .gitkeep
├── script/
│   └── build.ts
├── drizzle.config.ts
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .gitignore                ← includes store/*.jpg
```

### 8.3 Build & Dev

Same pattern as the briefing platform:
- `npm run dev` — tsx + Vite dev server
- `npm run build` — Vite client build + esbuild server bundle
- `npm start` — production server
- `npm run db:push` — Drizzle schema push to PostgreSQL

---

## 9. Implementation Order

1. **Project scaffold** — package.json, tsconfig, vite config, tailwind, drizzle config (copy/adapt from briefing platform)
2. **Database schema** — `shared/schema.ts` with all 4 tables, run `db:push`
3. **Server: storage layer** — Drizzle queries for assets, collections, tags, joins
4. **Server: upload endpoint** — `POST /api/assets` with multer + sharp processing
5. **Server: CRUD endpoints** — all remaining API endpoints from section 4
6. **Server: static serving** — `/store` static route
7. **Client: layout shell** — app-layout, header, sidebar skeleton, routing
8. **Client: asset grid** — fetch assets, render thumbnail grid, empty state
9. **Client: upload flow** — drag-drop zone, file picker, progress, auto-refresh
10. **Client: lightbox** — full-res view, navigation, download, metadata display
11. **Client: collections** — sidebar tree, create/rename/delete, filter grid by collection
12. **Client: tags** — tag list in sidebar, tag input component, filter by tag
13. **Client: selection** — multi-select, selection toolbar, bulk tag, bulk assign, bulk delete
14. **Client: drag-assign** — drag thumbnails onto collections in sidebar
15. **Client: search** — search bar with debounce, combined filtering
16. **QA & polish** — responsive layout, loading states, error handling, edge cases

---

## 10. Key Design Decisions

**Why flat file storage, not S3?**
Simplicity. For a small team managing a few thousand images, local disk is fast and free. S3 adds complexity (credentials, CORS, signed URLs) with no benefit at this scale. If the app outgrows local disk, the migration path is straightforward — swap the static serving and upload paths.

**Why separate thumbnail and full-res, not on-the-fly resize?**
Pre-generated thumbnails = zero processing on every grid render. The grid loads dozens of thumbnails at once — they need to be instant. Full-res is loaded only on lightbox open (one image at a time).

**Why many-to-many for collections (not folders)?**
An image can live in "WW Homepage Mood" AND "Warm Tones" AND "Client Shared." Folders force a single location. Collections are more flexible and match how people actually think about reference images.

**Why tags separate from collections?**
Collections = organizational (by client/project/page). Tags = descriptive (mood, color, style, content). Different axis, both useful for finding things.

**Why not a CDN or image proxy?**
Overkill for an internal tool serving <10 concurrent users. Express static serving with proper cache headers is fast enough. Add a CDN later if needed (just point it at `/store`).
