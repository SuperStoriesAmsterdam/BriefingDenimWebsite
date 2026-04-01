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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve uploaded mood images as static files
  app.use("/uploads", express.static(UPLOADS_DIR));

  // GET /api/prd — load PRD data from database
  app.get("/api/prd", async (_req, res) => {
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
