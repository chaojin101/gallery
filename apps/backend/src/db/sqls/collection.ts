import { count, desc, eq } from "drizzle-orm";
import { defaultDb } from "..";
import { collection, collectionImg, img } from "../../db/schema";

export const getCollectionByName = async (options: { name: string }) => {
  const { name } = options;

  const result = await defaultDb
    .select()
    .from(collection)
    .where(eq(collection.name, name));

  return result[0];
};

export const addCollection = async (options: {
  userId: string;
  name: string;
  description: string;
}) => {
  const result = await defaultDb
    .insert(collection)
    .values({ ...options })
    .returning();

  return result[0];
};

export const getCollectionByIdFromDB = async (options: { id: string }) => {
  const { id } = options;

  return defaultDb.query.collection.findFirst({
    where: eq(collection.id, id),
  });
};

export const getCollectionByUserIdFromDB = async (options: {
  userId: string;
}) => {
  const { userId } = options;

  return await defaultDb.query.collection.findMany({
    where: eq(collection.userId, userId),
    orderBy: desc(collection.updatedAt),
  });
};

export const getCollectionImgCountByCollectionId = async (options: {
  collectionId: string;
}) => {
  const { collectionId } = options;

  const result = await defaultDb
    .select({ amount: count() })
    .from(collectionImg)
    .where(eq(collectionImg.collectionId, collectionId));

  return result[0].amount;
};

export const getLastesCollections = async (options: {
  offset: number;
  limit: number;
}) => {
  const { offset, limit } = options;

  const rows = await defaultDb
    .select()
    .from(collection)
    .innerJoin(collectionImg, eq(collectionImg.collectionId, collection.id))
    .innerJoin(img, eq(img.id, collectionImg.imgId))
    .where(eq(collectionImg.order, 0))
    .orderBy(desc(collection.createdAt))
    .offset(offset)
    .limit(limit);

  return rows;
};

export const getTotalCollectionsWithImgAmount = async (options?: {}) => {
  const result = await defaultDb
    .select({ count: count() })
    .from(collection)
    .innerJoin(collectionImg, eq(collectionImg.collectionId, collection.id))
    .where(eq(collectionImg.order, 0));

  return result[0].count;
};
