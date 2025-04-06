import { users, type User, type InsertUser, gameSessions, type GameSession, type InsertGameSession } from "@shared/schema";

// Storage interface for the application
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game session operations
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getGameSession(id: number): Promise<GameSession | undefined>;
  updateGameSession(id: number, session: Partial<InsertGameSession>): Promise<GameSession | undefined>;
  getGameSessionsByUserId(userId: number): Promise<GameSession[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameSessions: Map<number, GameSession>;
  userCurrentId: number;
  sessionCurrentId: number;

  constructor() {
    this.users = new Map();
    this.gameSessions = new Map();
    this.userCurrentId = 1;
    this.sessionCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const id = this.sessionCurrentId++;
    const session: GameSession = { ...insertSession, id };
    this.gameSessions.set(id, session);
    return session;
  }

  async getGameSession(id: number): Promise<GameSession | undefined> {
    return this.gameSessions.get(id);
  }

  async updateGameSession(id: number, sessionUpdate: Partial<InsertGameSession>): Promise<GameSession | undefined> {
    const existingSession = await this.getGameSession(id);
    if (!existingSession) return undefined;

    const updatedSession = { ...existingSession, ...sessionUpdate };
    this.gameSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getGameSessionsByUserId(userId: number): Promise<GameSession[]> {
    return Array.from(this.gameSessions.values()).filter(
      (session) => session.userId === userId
    );
  }
}

export const storage = new MemStorage();
