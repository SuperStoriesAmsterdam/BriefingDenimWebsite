import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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

  // Serve standalone HTML files
  app.get("/customer-journey.html", (_req, res) => {
    // In dev (ESM): import.meta.dirname = server/, so .. = workspace root
    // In production (CJS bundle): __dirname = dist/, file is copied there
    const dir = typeof __dirname !== "undefined" ? __dirname : import.meta.dirname;
    const candidates = [
      path.resolve(dir, "customer-journey.html"),
      path.resolve(dir, "..", "customer-journey.html"),
    ];
    const filePath = candidates.find((p) => fs.existsSync(p));
    if (filePath) {
      res.type("html").sendFile(filePath);
    } else {
      res.status(404).send("Not found");
    }
  });

  return httpServer;
}
