import { Value } from "@sinclair/typebox/value";
import { count, eq } from "drizzle-orm";
import { Static } from "elysia";
import { defaultDb } from ".";
import { getAddCollectionCardRespBodySchema } from "../types/routes/collections";
import { collection, collectionImg } from "./schema";

export class SQL {
  static async getAddCollectionCard(options: {
    userId: string;
  }): Promise<
    Static<
      typeof getAddCollectionCardRespBodySchema.properties.data.properties.collections
    >
  > {
    const { userId } = options;

    const collections = await defaultDb.query.collection.findMany({
      where: eq(collection.userId, userId),
      columns: {
        id: true,
        name: true,
      },
    });

    const res = Value.Create(
      getAddCollectionCardRespBodySchema.properties.data.properties.collections
    );

    for (const collection of collections) {
      const result = await defaultDb
        .select({ amount: count() })
        .from(collectionImg)
        .where(eq(collectionImg.collectionId, collection.id));

      res.push({
        id: collection.id,
        name: collection.name,
        amount: result[0].amount,
      });
    }

    return res;
  }

  static async appendToCollection(options: {
    startOrder: number;
    collectionId: string;
    imgIds: string[];
  }) {
    const { startOrder, collectionId, imgIds } = options;

    await defaultDb.insert(collectionImg).values(
      imgIds.map((imgId, i) => ({
        collectionId,
        imgId,
        order: startOrder + i,
      }))
    );
  }
}
