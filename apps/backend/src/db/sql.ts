import { Value } from "@sinclair/typebox/value";
import { asc, count, eq } from "drizzle-orm";
import { Static } from "elysia";
import { defaultDb } from ".";
import {
  getAddCollectionCardRespBodySchema,
  getCollectionByIdRespBodySchema,
} from "../types/routes/collections";
import { collection, collectionImg, img } from "./schema";

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

  static async getLastestCollections(options: { page: number; limit: number }) {
    const result = await defaultDb
      .select({
        id: collection.id,
        imgUrl: img.url,
      })
      .from(collection)
      .innerJoin(collectionImg, eq(collectionImg.collectionId, collection.id))
      .innerJoin(img, eq(collectionImg.imgId, img.id))
      .where(eq(collectionImg.order, 0))
      .orderBy(asc(collection.createdAt))
      .offset((options.page - 1) * options.limit)
      .limit(options.limit);

    return result;
  }

  static async getCollectionById(options: {
    id: string;
  }): Promise<Static<
    typeof getCollectionByIdRespBodySchema.properties.data.properties.collection
  > | null> {
    const c = await defaultDb.query.collection.findFirst({
      where: eq(collection.id, options.id),
      columns: {
        name: true,
      },
      with: {
        collectionImgs: {
          columns: {},
          with: {
            img: true,
          },
          orderBy: asc(collectionImg.order),
        },
      },
    });

    if (!c) {
      return null;
    }

    const r = Value.Create(
      getCollectionByIdRespBodySchema.properties.data.properties.collection
    );

    r.name = c.name;
    r.imgs = c.collectionImgs.map((ci) => ({
      id: ci.img.id,
      url: ci.img.url,
    }));

    return r;
  }
}
