import { type User, type InsertUser, type PrdDocument, users, prdDocuments } from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPrd(id?: string): Promise<PrdDocument | undefined>;
  savePrd(data: unknown, version: string, id?: string): Promise<PrdDocument>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getPrd(id: string = "default"): Promise<PrdDocument | undefined> {
    const [doc] = await db.select().from(prdDocuments).where(eq(prdDocuments.id, id));
    return doc;
  }

  async savePrd(data: unknown, version: string, id: string = "default"): Promise<PrdDocument> {
    const existing = await this.getPrd(id);
    if (existing) {
      const [doc] = await db
        .update(prdDocuments)
        .set({ data, version, updatedAt: new Date() })
        .where(eq(prdDocuments.id, id))
        .returning();
      return doc;
    }
    const [doc] = await db
      .insert(prdDocuments)
      .values({ id, data, version, updatedAt: new Date(), createdAt: new Date() })
      .returning();
    return doc;
  }
}

export const storage = new DatabaseStorage();
