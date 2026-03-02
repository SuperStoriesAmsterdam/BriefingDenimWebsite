# Denim City — Wireframe PRD Tool

**Version 2.0** | Internal tool for the project team

---

## What Is This?

The Wireframe PRD is an interactive, browser-based tool that serves as the single source of truth for the Denim City website rebuild. It replaces static documents (Google Docs, PDFs, Notion pages) with a living wireframe where every team — design, development, GHL automation, and copywriting — works from the same structure.

Every page, every block, every annotation, every reference image, and every doc link lives inside this tool. Data persists in your browser's localStorage (5 MB limit). No login, no server, no sync conflicts.

---

## Who Uses This & How

| Role | What they do in the tool |
|------|--------------------------|
| **Project Manager** | Structures pages, orders blocks, writes descriptions, assigns schema types, manages overall architecture |
| **Designer** | Reads block structures and design annotations (violet), adds reference images per block, links to Figma docs |
| **Developer** | Reads dev annotations (blue), checks schema type assignments, reviews page hierarchy in Sitemap view |
| **GHL Specialist** | Uses GHL Overview for pipeline/automation reference, reads GHL annotations (orange) on blocks |
| **Copywriter** | Reads copy annotations (green), writes LLM Extract paragraphs, links Google Docs per block |

---

## Getting Started

1. Open the app in your browser
2. The sidebar shows **three view modes** at the top:
   - **Wireframes** — the main editing view (default)
   - **GHL Overview** — read-only reference of all GHL integrations, pipelines, and automations
   - **Sitemap** — read-only page hierarchy showing nav structure
3. Below the view modes, the **page tree** lists all pages. Click any page to open it.
4. The main area shows the selected page's **blocks** — the building units of each page wireframe.

---

## Core Concepts

### Pages

A page represents one URL on the final website (e.g., Home, Store, Education, Denim Dates).

- Pages appear in the sidebar under "Pages"
- Pages can be **top-level** (in main nav) or **footer-only** (toggle via the footer button in sidebar)
- Pages can be **nested** under a parent page (drag one page onto another in the sidebar)
- Pages can be **reordered** by dragging them above or below other pages in the sidebar

### Blocks

A block is one section of a page wireframe (e.g., Hero, Grid, Content Section, CTA).

Each block contains:
- **Type** — hero, grid, section, or cta (each has distinct styling)
- **Title** — the section name
- **Description** — what this section does and why
- **LLM Extract** — a single paragraph written for AI citation (amber section)
- **Content items** — bullet-point list of what goes in this section
- **Images** — reference images, mood boards, screenshots
- **Doc link** — URL to the Google Doc where the copywriter writes actual copy
- **Schema type** — Schema.org structured data type for this section
- **Annotations** — team-specific instructions (design, dev, GHL, copy)

### Annotations

Color-coded instructions attached to blocks, one per team:

| Team | Color | Label | Purpose |
|------|-------|-------|---------|
| Design | Violet | DESIGNER | Visual direction, layout references, UX notes |
| Dev | Blue | DEVELOPER | Technical specs, SEO requirements, integrations |
| GHL | Orange | GHL | Pipeline assignments, automations, form routing |
| Copy | Green | COPY | Tone, messaging, cross-links, LLM SEO guidance |

---

## Features Guide

### Editing Text

All text in the tool is editable:

1. **Double-click** any text to enter edit mode
2. Type your changes
3. **Press Enter** (single-line fields) or **click away** (multi-line fields) to save
4. **Press Escape** to cancel and revert

Changes auto-save to localStorage with a 500ms debounce. You'll see "..." while saving, then "Saved" briefly.

### Managing Pages

| Action | How |
|--------|-----|
| **Add a page** | Click the **+** button next to the "Pages" heading in the sidebar |
| **Rename a page** | Double-click the page name in the sidebar |
| **Delete a page** | (via code/defaults — no UI delete button currently for safety) |
| **Reorder pages** | Drag a page in the sidebar and drop it above or below another page. A gold line shows where it will land. |
| **Nest a page** | Drag a page onto another page in the sidebar (it becomes a child) |
| **Unnest a page** | Click the **up arrow** (↑) on a nested child page |
| **Toggle nav/footer** | Click "Move to footer only" or "Move to main nav" in the sidebar footer |

### Managing Blocks

| Action | How |
|--------|-----|
| **Add a block** | Click **"+ Add section"** at the bottom of the page |
| **Delete a block** | Click the **X** button in the block header |
| **Move up/down** | Click the **↑** or **↓** arrows in the block header |
| **Move to another page** | Click the **→** arrow in the header, then select the target page |
| **Change block type** | Use the type dropdown in the header (hero / grid / section / cta) |
| **Drag to reorder** | Grab the block card and drag it to a new position. A dashed gold outline shows the drop target. |

### Schema Type

Each block has a Schema.org type dropdown (the `</>` icon in the header):

- **none** — no structured data
- **FAQPage** — for FAQ sections
- **Course** — for education/course sections
- **LocalBusiness** — for location/store info
- **Event** — for events and calendar items
- **Product** — for product listings
- **Article** — for editorial/press content
- **Organization** — for company info
- **Service** — for service descriptions
- **Place** — for venue/location details

This tells the developer which JSON-LD schema to implement for each section.

### LLM Extract

The amber/gold section below each block's description:

- **Purpose**: Write one paragraph per block that AI models (ChatGPT, Perplexity, Google AI) should extract and cite when answering questions about Denim City.
- **How**: Double-click the placeholder text, write your paragraph, click away to save.
- **Best practice**: Include the entity name, location, key facts, and differentiators in a single extractable paragraph. Think "What should ChatGPT quote about this section?"

### Content Items

The bulleted list inside each block:

| Action | How |
|--------|-----|
| **Add item** | Click **"+ item"** at the bottom of the list |
| **Edit item** | Double-click the item text |
| **Delete item** | Click the red **X** on the right |
| **Reorder items** | Drag the grip handle (⠿) on the left of each item |

### Reference Images

The image gallery area below content items in each block:

| Action | How |
|--------|-----|
| **Add images (drag)** | Drag image files from your desktop onto the block's image area |
| **Add images (paste)** | Click the image area and press **Cmd+V** (Mac) or **Ctrl+V** (Windows) with an image in your clipboard |
| **Add images (picker)** | Click the **+** button (dashed square) to open a file picker |
| **View full size** | Click any thumbnail to open a lightbox |
| **Reorder images** | Drag thumbnails to rearrange them |
| **Delete image** | Hover over a thumbnail and click the red **X** |

Images are resized to max 800px width and compressed to JPEG quality 0.7 before storing. This keeps each image at roughly 40–80 KB. The storage indicator in the sidebar shows how much of your 5 MB budget is used.

### Doc Links

The doc link area below images in each block:

| Action | How |
|--------|-----|
| **Add a doc link** | Click **"+ Doc link"**, paste the URL, click Save |
| **Open the doc** | Click the green badge — it opens in a new tab |
| **Edit the URL** | Click the pencil icon (✏️) next to the badge |
| **Remove the link** | Click the **X** next to the badge |

Intended for Google Docs URLs where the copywriter writes the actual page copy, but works with any URL (Figma, Notion, etc.).

### Annotations

Below the doc link in each block:

| Action | How |
|--------|-----|
| **Add annotation** | Click **+ DESIGN**, **+ DEV**, **+ GHL**, or **+ COPY** at the bottom |
| **Edit annotation** | Double-click the annotation text |
| **Delete annotation** | Click the red **X** on the annotation |
| **Filter by team** | Use the team filter buttons in the toolbar (top of the page) |
| **Hide all annotations** | Click "Annotations" toggle in the toolbar |

### Storage Indicator

In the sidebar footer, a small progress bar shows localStorage usage:

- **Green** (< 60%) — plenty of room
- **Yellow** (60–80%) — getting full, mostly from images
- **Red** (> 80%) — near the 5 MB limit, remove images to free space

If storage hits 100%, saves will fail and the status will show **"Storage full!"**. Delete some images to recover.

### Reset to Defaults

In the sidebar footer: **"Reset to defaults"** with a confirmation dialog. This erases all your edits and restores the original PRD content. Use with caution — this cannot be undone.

---

## View Modes

### Wireframe View (default)

The main working view. Shows the current page's blocks with full editing capabilities. The toolbar at the top displays:
- Page name and status badges (footer-only, child-of)
- Team filter buttons
- Annotations on/off toggle

### GHL Overview

A read-only reference view showing all GHL integration points:

1. **System Integrations** — Lightspeed R → GHL, Webflow → GHL, GHL Calendars
2. **Pipelines** (9 total) — Tours, Courses, Lab/Atelier, Partnerships, Venue, Funding, Press, Incubator, Repair B2B — each with booking type and automation actions
3. **Universal Automations** (6 total) — Confirmation emails, feedback loops, abandoned booking recovery, cross-sell sequences, certificates, audience segmentation

### Sitemap View

A read-only hierarchical view of all pages showing:
- Top-level pages
- Nested child pages (indented with └)
- Footer-only pages (muted with "(footer)" label)

---

## Data Persistence & Versioning

### How Data Is Saved

- All data lives in **localStorage** in your browser
- Key: `dc-prd-data` (the page data) + `dc-prd-version` (the version tag)
- Saves happen automatically 500ms after any edit
- **No cloud sync** — data is per-browser, per-device

### What Happens on Version Updates

When the development team updates the default PRD content and bumps the version key:

1. On next page load, the tool detects the version mismatch
2. It **merges** your edits with the new defaults:
   - Your text edits (titles, descriptions, content, annotations) are **preserved**
   - New pages from defaults are **added**
   - New blocks from defaults are **appended** to existing pages
   - Pages you created manually are **kept**
3. The merged result is saved under the new version

**Nothing you wrote is ever deleted by a version update.**

### Storage Limits

- localStorage cap: ~5 MB per origin
- Text content (pages, blocks, annotations): typically 200–400 KB
- Each reference image: ~40–80 KB (after compression)
- Practical limit: ~50–60 images before hitting capacity
- The storage indicator in the sidebar tracks usage in real time

---

## Testing Checklist

Use this checklist to verify the tool works correctly after any update.

### Page Management
- [ ] Click **+** to add a new page — it appears in the sidebar and becomes active
- [ ] Double-click a page name in the sidebar — edit it, press Enter — name updates
- [ ] Drag a page above another page — gold line appears — drop it — order changes
- [ ] Drag a page onto another page — it becomes nested (indented, child)
- [ ] Click the **↑** arrow on a nested page — it moves to top level
- [ ] Click "Move to footer only" — page shows "footer" badge
- [ ] Click "Move to main nav" — badge disappears

### Block Management
- [ ] Click **"+ Add section"** — new block appears at bottom
- [ ] Click **X** on a block — it's deleted
- [ ] Click **↑** / **↓** — block moves up/down
- [ ] Click **→** and select a page — block moves to that page
- [ ] Drag a block card — dashed gold outline on target — drop — blocks reorder
- [ ] Change block type dropdown — card styling updates (border color, background)

### Text Editing
- [ ] Double-click any title — edit field appears — type — press Enter — saved
- [ ] Double-click description — textarea appears — type — click away — saved
- [ ] Press Escape while editing — reverts to original text
- [ ] After any edit — "..." appears briefly, then "Saved" for 1.5 seconds

### Schema Type
- [ ] Click the `</>` dropdown in a block header — select "FAQPage" — dropdown shows "FAQPage"
- [ ] Change to "none" — dropdown shows "none"
- [ ] Refresh the page — selection persists

### LLM Extract
- [ ] Double-click the "Write one paragraph..." placeholder — type a paragraph — click away
- [ ] Refresh the page — paragraph persists in the amber section

### Content Items
- [ ] Click **"+ item"** — new item appears
- [ ] Double-click item text — edit — click away — saved
- [ ] Click red **X** — item deleted
- [ ] Drag grip handle (⠿) — reorder items within the list

### Images
- [ ] Drag an image file from desktop onto a block's image area — thumbnail appears
- [ ] Click the **+** square — file picker opens — select images — thumbnails appear
- [ ] Copy a screenshot to clipboard — click image area — Cmd+V — image appears
- [ ] Click a thumbnail — lightbox opens with full-size image — close it
- [ ] Drag thumbnails — reorder within the gallery
- [ ] Hover a thumbnail — red X appears — click it — image deleted
- [ ] Check sidebar — storage indicator updates after adding/removing images

### Doc Links
- [ ] Click **"+ Doc link"** — paste a URL — click Save — green badge appears
- [ ] Click the green badge — URL opens in a new tab
- [ ] Click pencil icon — edit the URL — Save — badge updates
- [ ] Click **X** — link removed, "+" button returns

### Annotations
- [ ] Click **"+ DESIGN"** — violet annotation appears with placeholder text
- [ ] Double-click annotation text — edit — click away — saved
- [ ] Click red **X** — annotation deleted
- [ ] Click "Developer" filter in toolbar — only blue annotations visible
- [ ] Click "All" — all annotations visible again
- [ ] Toggle "Annotations" off — all annotation sections hidden

### View Modes
- [ ] Click **"GHL Overview"** — shows integrations, pipelines, automations (read-only)
- [ ] Click **"Sitemap"** — shows page hierarchy with nav/footer labels
- [ ] Click **"Wireframes"** — returns to block editing view

### Storage & Persistence
- [ ] Make several edits, add images, set schema types, write LLM paragraphs
- [ ] Refresh the browser — all changes persist
- [ ] Check storage indicator in sidebar — shows reasonable usage (green/yellow)
- [ ] Click **"Reset to defaults"** — confirm — all custom edits gone, original content restored

### Drag & Drop Isolation
- [ ] Drag a block — only blocks reorder, not content items or images
- [ ] Drag a content item grip handle — only items reorder within the block
- [ ] Drag an image thumbnail — only images reorder within the gallery
- [ ] Drag a page in the sidebar — only pages reorder, blocks stay put
- [ ] Drop an image from desktop — only the image gallery responds, not block drag

---

## Block Layout Reference

Each block card follows this visual structure from top to bottom:

```
┌── Block Card ────────────────────────────────────────┐
│ [hero]  [↑] [↓] [→] [</>schema▾] [type▾] [×]       │  header
│                                                       │
│ Title (editable)                                      │
│ Description (editable, multi-line)                    │
│                                                       │
│ ┌─ ✦ LLM EXTRACT ──────────────────────────────────┐ │  amber bg
│ │ "Denim City is a denim innovation hub in..."      │ │
│ └───────────────────────────────────────────────────┘ │
│                                                       │
│ ┌─ Content ─────────────────────────────────────────┐ │
│ │ ⠿ Content item 1                              [×] │ │
│ │ ⠿ Content item 2                              [×] │ │
│ │ [+ item]                                          │ │
│ └───────────────────────────────────────────────────┘ │
│                                                       │
│ [img1] [img2] [img3] [+]                             │  image gallery
│                                                       │
│ [📄 docs.google.com/d/...] [✏️] [×]                 │  doc link
│                                                       │
│ 🟣 DESIGNER: annotation text...                      │  annotations
│ 🔵 DEVELOPER: annotation text...                     │
│ 🟠 GHL: annotation text...                           │
│ 🟢 COPY: annotation text...                          │
│ [+ DESIGN] [+ DEV] [+ GHL] [+ COPY]                 │
└──────────────────────────────────────────────────────┘
```

---

## FAQ

**Q: Can I use this on my phone?**
A: The tool works in mobile browsers but is designed for desktop. Drag-and-drop and double-click editing are awkward on touch devices.

**Q: What happens if I clear my browser data?**
A: All PRD content is lost. The tool will reload with the built-in defaults. There is no cloud backup.

**Q: Can two people edit at the same time?**
A: No. Data lives in each person's browser independently. There is no real-time sync. Coordinate edits via the Google Doc links on each block.

**Q: How do I free up storage space?**
A: Delete reference images from blocks. Images are by far the largest storage consumers. Text content barely uses any space.

**Q: What's the difference between Description and LLM Extract?**
A: The **description** is an internal note explaining what a section should do and why. The **LLM Extract** is customer-facing copy — the actual paragraph you want AI models to find and quote about this section.

**Q: Do schema types affect the website directly?**
A: No. Schema types are instructions for the developer. They indicate which Schema.org JSON-LD markup to implement when building each section.
