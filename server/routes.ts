import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/sessions", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      if (userId) {
        const sessions = await storage.getGameSessionsByUserId(userId);
        res.json(sessions);
      } else {
        res.status(400).json({ message: "User ID is required" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game sessions" });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getGameSession(id);
      
      if (session) {
        res.json(session);
      } else {
        res.status(404).json({ message: "Game session not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch game session" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const gameSessionData = insertGameSessionSchema.parse(req.body);
      const newSession = await storage.createGameSession(gameSessionData);
      res.status(201).json(newSession);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid session data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create game session" });
      }
    }
  });

  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updatedSession = await storage.updateGameSession(id, updateData);
      
      if (updatedSession) {
        res.json(updatedSession);
      } else {
        res.status(404).json({ message: "Game session not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update game session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
