import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Game session schema
export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  throwResults: jsonb("throw_results").notNull(),
  remainingWork: integer("remaining_work").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: text("created_at").notNull(),
});

export const insertGameSessionSchema = createInsertSchema(gameSessions).pick({
  userId: true,
  throwResults: true,
  remainingWork: true,
  completed: true,
  createdAt: true,
});

export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type GameSession = typeof gameSessions.$inferSelect;
