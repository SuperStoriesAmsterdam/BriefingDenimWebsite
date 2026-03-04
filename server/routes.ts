import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  return httpServer;
}
