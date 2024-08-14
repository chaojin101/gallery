import { eq } from "drizzle-orm";
import { defaultDb } from "../db";
import { collection } from "../db/schema";

export class CollectionService {
  static async addCollection(options: {
    userId: string;
    name: string;
    description: string;
  }) {
    const result = await defaultDb
      .insert(collection)
      .values({ ...options })
      .returning();

    return result[0];
  }

  static async getCollectionByName(name: string) {
    const result = await defaultDb
      .select()
      .from(collection)
      .where(eq(collection.name, name));

    return result[0];
  }

  static async getCollectionById(options: { id: string }) {
    return await defaultDb.query.collection.findFirst({
      where: eq(collection.id, options.id),
    });
  }
}
