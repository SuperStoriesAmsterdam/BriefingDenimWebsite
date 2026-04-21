import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import multer from "multer";
import sharp from "sharp";

const UPLOADS_DIR = path.resolve("uploads");
const FULL_MAX = 1800;
const THUMB_MAX = 400;

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const upload = multer({
  dest: path.join(UPLOADS_DIR, "tmp"),
  limits: { fileSize: 10 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype.startsWith("image/"));
  },
});

function generateId(): string {
  return "mood-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

/**
 * Server-side startup migration: inject navmap blocks into Education and Store pages if missing.
 * Runs once at server start. Directly patches the DB — no client-side JS needed.
 */
async function migrateNavmaps() {
  try {
    const doc = await storage.getPrd();
    if (!doc) { console.log("[migration] No PRD doc found — skipping."); return; }

    const raw = doc.data;
    const pages: any[] = Array.isArray(raw)
      ? raw
      : typeof raw === "string"
      ? JSON.parse(raw)
      : [];

    if (!pages.length) { console.log("[migration] PRD data is empty — skipping."); return; }

    console.log("[migration] Page IDs in DB:", pages.map((p: any) => p.id).join(", "));

    let changed = false;

    // --- Education navmap ---
    const edPage = pages.find((p: any) => p.id === "education" || p.id === "learn");
    if (edPage && Array.isArray(edPage.blocks) && !edPage.blocks.some((b: any) => b.type === "navmap")) {
      const heroIdx = edPage.blocks.findIndex((b: any) => b.type === "hero");
      const insertAt = heroIdx >= 0 ? heroIdx + 1 : 0;
      edPage.blocks.splice(insertAt, 0, {
        type: "navmap",
        title: "Navigation & Tracks",
        desc: "Live diagram: full site navigation bar (top) + Education's three programme tracks with their sub-pages (below). Rendered automatically from the page structure — no manual editing needed.",
        content: [],
        annotations: [],
      });
      console.log(`[migration] navmap injected into Education page at position ${insertAt}.`);
      changed = true;
    } else {
      console.log("[migration] Education navmap already present or page not found — skipping.");
    }

    // --- Store navmap ---
    const storePage = pages.find((p: any) => p.id === "store");
    if (storePage && Array.isArray(storePage.blocks) && !storePage.blocks.some((b: any) => b.type === "navmap")) {
      const heroIdx = storePage.blocks.findIndex((b: any) => b.type === "hero");
      const insertAt = heroIdx >= 0 ? heroIdx + 1 : 0;
      storePage.blocks.splice(insertAt, 0, {
        type: "navmap",
        title: "Store Tracks",
        desc: "Live diagram: site nav bar (top) + Store's four service tracks (below). Rendered automatically from page structure.",
        content: [],
        annotations: [],
      });
      console.log(`[migration] navmap injected into Store page at position ${insertAt}.`);
      changed = true;
    } else {
      console.log("[migration] Store navmap already present or page not found — skipping.");
    }

    // --- Tours navmap ---
    const toursPage = pages.find((p: any) => p.id === "tours");
    if (toursPage && Array.isArray(toursPage.blocks) && !toursPage.blocks.some((b: any) => b.type === "navmap")) {
      toursPage.blocks.unshift({
        type: "navmap",
        title: "Tour Tracks",
        desc: "Live diagram: site nav bar (top) + Tours' two tracks — Visitor Tours and Travel Trade (below). Rendered automatically from page structure.",
        content: [],
        annotations: [],
      });
      console.log("[migration] navmap injected into Tours page at position 0.");
      changed = true;
    } else {
      console.log("[migration] Tours navmap already present or page not found — skipping.");
    }

    // --- Incubator navmap ---
    const incubatorPage = pages.find((p: any) => p.id === "incubator");
    if (incubatorPage && Array.isArray(incubatorPage.blocks) && !incubatorPage.blocks.some((b: any) => b.type === "navmap")) {
      const heroIdx = incubatorPage.blocks.findIndex((b: any) => b.type === "hero");
      const insertAt = heroIdx >= 0 ? heroIdx + 1 : 0;
      incubatorPage.blocks.splice(insertAt, 0, {
        type: "navmap",
        title: "Incubator Tracks",
        desc: "Live diagram: site nav bar (top) + Incubator's two tracks — Apply and Support (below). Rendered automatically from page structure.",
        content: [],
        annotations: [],
      });
      console.log(`[migration] navmap injected into Incubator page at position ${insertAt}.`);
      changed = true;
    } else {
      console.log("[migration] Incubator navmap already present or page not found — skipping.");
    }

    if (changed) {
      await storage.savePrd(pages, "dc-prd-v48");
      console.log("[migration] Saved with version dc-prd-v48.");
    }
  } catch (err) {
    console.error("[migration] Navmap migration failed:", err);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Run DB migrations at startup
  await migrateNavmaps();

  // Serve uploaded mood images as static files
  app.use("/uploads", express.static(UPLOADS_DIR));

  // GET /api/debug-prd — show page IDs and block types (diagnostic only)
  app.get("/api/debug-prd", async (_req, res) => {
    try {
      const doc = await storage.getPrd();
      if (!doc) return res.json({ error: "no doc" });
      const raw = doc.data;
      const pages: any[] = Array.isArray(raw) ? raw : typeof raw === "string" ? JSON.parse(raw) : [];
      return res.json({
        version: doc.version,
        pageCount: pages.length,
        pages: pages.map((p: any) => ({
          id: p.id,
          label: p.label,
          blockTypes: (p.blocks || []).map((b: any) => b.type),
        })),
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // GET /api/prd — load PRD data from database
  app.get("/api/prd", async (_req, res) => {
    res.set("Cache-Control", "no-store");
    try {
      const doc = await storage.getPrd();
      if (!doc) {
        return res.json({ data: null, version: null });
      }
      return res.json({ data: doc.data, version: doc.version, updatedAt: doc.updatedAt });
    } catch (err) {
      console.error("Failed to load PRD:", err);
      return res.status(500).json({ message: "Failed to load PRD data" });
    }
  });

  // PUT /api/prd — save PRD data to database
  app.put("/api/prd", async (req, res) => {
    try {
      const { data, version } = req.body;
      if (!data || !version) {
        return res.status(400).json({ message: "Missing data or version" });
      }
      const doc = await storage.savePrd(data, version);
      return res.json({ ok: true, updatedAt: doc.updatedAt });
    } catch (err) {
      console.error("Failed to save PRD:", err);
      return res.status(500).json({ message: "Failed to save PRD data" });
    }
  });

  // POST /api/uploads — upload mood images, resize to full + thumbnail
  app.post("/api/uploads", upload.array("images", 20), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No image files provided" });
      }

      const results = [];
      for (const file of files) {
        const id = generateId();
        const fullPath = path.join(UPLOADS_DIR, `${id}.jpg`);
        const thumbPath = path.join(UPLOADS_DIR, `thumb-${id}.jpg`);

        // Full resolution: max 1800px wide, 85% quality
        await sharp(file.path)
          .rotate() // auto-rotate based on EXIF
          .resize(FULL_MAX, undefined, { withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toFile(fullPath);

        // Thumbnail: max 400px wide, 60% quality
        await sharp(file.path)
          .rotate()
          .resize(THUMB_MAX, undefined, { withoutEnlargement: true })
          .jpeg({ quality: 60 })
          .toFile(thumbPath);

        // Clean up temp file
        fs.unlink(file.path, () => {});

        results.push({
          id,
          url: `/uploads/${id}.jpg`,
          thumbUrl: `/uploads/thumb-${id}.jpg`,
          name: file.originalname,
        });
      }

      return res.json({ files: results });
    } catch (err) {
      console.error("Upload failed:", err);
      return res.status(500).json({ message: "Upload failed" });
    }
  });

  // GET /api/team — load team members from database
  app.get("/api/team", async (_req, res) => {
    res.set("Cache-Control", "no-store");
    try {
      const doc = await storage.getPrd("team");
      if (!doc) return res.json({ data: null });
      return res.json({ data: doc.data });
    } catch (err) {
      console.error("Failed to load team:", err);
      return res.status(500).json({ message: "Failed to load team data" });
    }
  });

  // PUT /api/team — save team members to database
  app.put("/api/team", async (req, res) => {
    try {
      const { data } = req.body;
      if (!data) return res.status(400).json({ message: "Missing data" });
      await storage.savePrd(data, "team-v1", "team");
      return res.json({ ok: true });
    } catch (err) {
      console.error("Failed to save team:", err);
      return res.status(500).json({ message: "Failed to save team data" });
    }
  });

  // DELETE /api/uploads/:id — delete a mood image
  app.delete("/api/uploads/:id", (req, res) => {
    const { id } = req.params;
    const fullPath = path.join(UPLOADS_DIR, `${id}.jpg`);
    const thumbPath = path.join(UPLOADS_DIR, `thumb-${id}.jpg`);

    fs.unlink(fullPath, () => {});
    fs.unlink(thumbPath, () => {});

    return res.json({ ok: true });
  });

  return httpServer;
}
